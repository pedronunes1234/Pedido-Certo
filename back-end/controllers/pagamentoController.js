const { MercadoPagoConfig, Payment } = require("mercadopago");
const db = require("../config/database");

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

exports.criarPix = async (req, res) => {
    const { total, pedidoId, nomeCliente, email } = req.body;

    try {
        const payment = new Payment(client);

        const resultado = await payment.create({
            body: {
                transaction_amount: total,
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
            pagamentoId: resultado.id,
            qrCode: resultado.point_of_interaction.transaction_data.qr_code,
            qrCodeBase64: resultado.point_of_interaction.transaction_data.qr_code_base64
        });

    } catch (err) {
        console.error("Erro MP:", err);
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
                            else console.log(`Pedido #${pedidoId} pago!`);
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