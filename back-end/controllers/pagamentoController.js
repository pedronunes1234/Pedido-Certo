const { MercadoPagoConfig, Payment } = require("mercadopago");
const db = require("../config/database");
const util = require("util");

const query = util.promisify(db.query).bind(db);

// Cliente da plataforma (usado quando o lojista ainda não conectou o MP)
const clientPlataforma = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

// % retido pela plataforma quando há split (ajustável via env, padrão 10%)
const TAXA_PLATAFORMA = Number(process.env.MP_TAXA_PERCENTUAL || 10) / 100;

const NOTIFICATION_URL = "https://pedido-certo-production.up.railway.app/api/pagamento/webhook";

exports.criarPix = async (req, res) => {
    const { total, nomeCliente, email, dadosPedido } = req.body;

    try {
        // 1. Salva o pedido
        const sqlPedido = `
            INSERT INTO pedidos (loja, nome_cliente, endereco, telefone, pagamento, total, status)
            VALUES (?, ?, ?, ?, ?, ?, 'Aguardando Pagamento')
        `;
        const resultPedido = await query(sqlPedido, [
            dadosPedido.loja,
            dadosPedido.nome_cliente,
            dadosPedido.endereco,
            "",
            "Pix",
            dadosPedido.total
        ]);
        const pedidoId = resultPedido.insertId;

        // 2. Salva os itens
        if (dadosPedido.itens && dadosPedido.itens.length > 0) {
            const sqlItens = `
                INSERT INTO itens_pedido 
                (pedido_id, nome_produto, quantidade, preco, tamanho, sabores, borda, adicionais, marca)
                VALUES ?
            `;
            const valores = dadosPedido.itens.map(item => [
                pedidoId,
                item.nome_produto,
                item.quantidade,
                item.preco,
                item.tamanho || null,
                item.sabores || null,
                item.borda || null,
                item.adicionais || null,
                item.marca || null
            ]);
            await query(sqlItens, [valores]);
        }

        // 3. Verifica se o lojista tem o Mercado Pago conectado
        const lojistas = await query(
            "SELECT mp_access_token FROM usuarios WHERE loja = ?",
            [dadosPedido.loja]
        );
        const lojista = lojistas[0];
        const usaSplit = !!(lojista && lojista.mp_access_token);

        // 4. Define qual credencial cria o pagamento
        const clientPagamento = usaSplit
            ? new MercadoPagoConfig({ accessToken: lojista.mp_access_token })
            : clientPlataforma;

        const corpoPagamento = {
            transaction_amount: Number(total),
            description: `Pedido #${pedidoId} - Pedido Certo`,
            payment_method_id: "pix",
            payer: {
                email: email || "cliente@pedidocerto.com",
                first_name: nomeCliente || "Cliente"
            },
            notification_url: NOTIFICATION_URL
        };

        // Só aplica taxa/split quando o pagamento é criado no nome do lojista
        if (usaSplit) {
            corpoPagamento.application_fee = Number((Number(total) * TAXA_PLATAFORMA).toFixed(2));
        }

        try {
            const payment = new Payment(clientPagamento);
            const resultado = await payment.create({ body: corpoPagamento });

            // Guarda o id do pagamento pra usar no webhook depois
            await query(
                "UPDATE pedidos SET mp_payment_id = ? WHERE id = ?",
                [String(resultado.id), pedidoId]
            );

            res.json({
                sucesso: true,
                pedidoId,
                pagamentoId: resultado.id,
                qrCode: resultado.point_of_interaction.transaction_data.qr_code,
                qrCodeBase64: resultado.point_of_interaction.transaction_data.qr_code_base64,
                repasseAutomatico: usaSplit
            });

        } catch (errMP) {
            console.error("Erro MP:", errMP);
            res.status(500).json({ sucesso: false, erro: errMP.message });
        }

    } catch (err) {
        console.error("Erro:", err);
        res.status(500).json({ sucesso: false, erro: err.message });
    }
};

exports.webhook = async (req, res) => {
    const { type, data } = req.body;

    if (type === "payment") {
        const pagamentoId = String(data.id);

        try {
            // Descobre de qual pedido/loja é esse pagamento
            const pedidos = await query(
                `SELECT p.id AS pedido_id, p.loja, u.mp_access_token
                 FROM pedidos p
                 LEFT JOIN usuarios u ON u.loja = p.loja
                 WHERE p.mp_payment_id = ?`,
                [pagamentoId]
            );
            const pedido = pedidos[0];

            // Usa o token do lojista se ele existir (pagamento com split),
            // senão cai pro token da plataforma (pagamento normal)
            const clientConsulta = (pedido && pedido.mp_access_token)
                ? new MercadoPagoConfig({ accessToken: pedido.mp_access_token })
                : clientPlataforma;

            const payment = new Payment(clientConsulta);
            const pagamento = await payment.get({ id: pagamentoId });

            if (pagamento.status === "approved") {
                let pedidoId = pedido ? pedido.pedido_id : null;

                // Fallback: se não achou pelo mp_payment_id, tenta pela descrição
                if (!pedidoId) {
                    const match = pagamento.description && pagamento.description.match(/Pedido #(\d+)/);
                    if (match) pedidoId = match[1];
                }

                if (pedidoId) {
                    await query(
                        "UPDATE pedidos SET status = 'Aguardando Preparo' WHERE id = ?",
                        [pedidoId]
                    );
                    console.log(`Pedido #${pedidoId} pago e confirmado! Split: ${!!(pedido && pedido.mp_access_token)}`);
                }
            }
        } catch (err) {
            console.error("Erro webhook:", err);
        }
    }

    res.sendStatus(200);
};