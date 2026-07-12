const { MercadoPagoConfig, Payment } = require("mercadopago");
const db = require("../config/database");

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

exports.criarPix = async (req, res) => {
    const { total, nomeCliente, email, dadosPedido } = req.body;

    try {
        // 1. Salva o pedido no banco com status "Aguardando Pagamento"
        const sqlPedido = `
            INSERT INTO pedidos (loja, nome_cliente, endereco, telefone, pagamento, total, status)
            VALUES (?, ?, ?, ?, ?, ?, 'Aguardando Pagamento')
        `;

        db.query(sqlPedido, [
            dadosPedido.loja,
            dadosPedido.nome_cliente,
            dadosPedido.endereco,
            "",
            "Pix",
            dadosPedido.total
        ], async (err, result) => {
            if (err) return res.status(500).json({ sucesso: false, erro: err.message });

            const pedidoId = result.insertId;

            // 2. Salva os itens do pedido
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
                db.query(sqlItens, [valores]);
            }

            // 3. Gera QR Code no Mercado Pago
            try {
                const payment = new Payment(client);
                const resultado = await payment.create({
                    body: {
                        transaction_amount: Number(total),
                        description: `Pedido #${pedidoId} - Pedido Certo`,
                        payment_method_id: "pix",
                        payer: {
                            email: email || "cliente@pedidocerto.com",
                            first_name: nomeCliente || "Cliente"
                        }
                    }
                });

                res.json({
                    sucesso: true,
                    pedidoId: pedidoId,
                    pagamentoId: resultado.id,
                    qrCode: resultado.point_of_interaction.transaction_data.qr_code,
                    qrCodeBase64: resultado.point_of_interaction.transaction_data.qr_code_base64
                });

            } catch (errMP) {
                console.error("Erro MP:", errMP);
                res.status(500).json({ sucesso: false, erro: errMP.message });
            }
        });

    } catch (err) {
        console.error("Erro:", err);
        res.status(500).json({ sucesso: false, erro: err.message });
    }
};

exports.webhook = async (req, res) => {
    const { type, data } = req.body;

    if (type === "payment") {
        const pagamentoId = data.id;

        try {
            const payment = new Payment(client);
            const pagamento = await payment.get({ id: pagamentoId });

            if (pagamento.status === "approved") {
                const match = pagamento.description.match(/Pedido #(\d+)/);

                if (match) {
                    const pedidoId = match[1];
                    db.query(
                        "UPDATE pedidos SET status = 'Aguardando Preparo' WHERE id = ?",
                        [pedidoId],
                        (err) => {
                            if (err) console.error("Erro ao atualizar pedido:", err);
                            else console.log(`Pedido #${pedidoId} pago e confirmado!`);
                        }
                    );
                }
            }
        } catch (err) {
            console.error("Erro webhook:", err);
        }
    }

    res.sendStatus(200);
};