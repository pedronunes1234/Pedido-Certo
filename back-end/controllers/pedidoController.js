const db = require("../config/database");

// LISTAR PEDIDOS
exports.listarPedidos = (req, res) => {

    db.query("SELECT * FROM pedidos ORDER BY id DESC", (err, results) => {

        if (err) {
            return res.status(500).json({
                sucesso: false,
                erro: err.message
            });
        }

        res.json({
            sucesso: true,
            pedidos: results
        });
    });
};

// CRIAR PEDIDO COMPLETO (COM ITENS)
exports.criarPedido = (req, res) => {

    const { nome_cliente, endereco, telefone, pagamento, total, itens } = req.body;

    // 1. Criar pedido principal
    const sqlPedido = `
        INSERT INTO pedidos (nome_cliente, endereco, telefone, pagamento, total)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sqlPedido,
        [nome_cliente, endereco, telefone, pagamento, total],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    sucesso: false,
                    erro: err.message
                });
            }

            const pedidoId = result.insertId;

            // 2. Inserir itens do pedido
            if (itens && itens.length > 0) {

                const sqlItens = `
         INSERT INTO itens_pedido
        (pedido_id,nome_produto,
        quantidade,preco,
        tamanho,sabores,
        borda,adicionais,
        marca)VALUES ?`;

                const valores = itens.map(item => [

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

                db.query(sqlItens, [valores], (err2) => {

                    if (err2) {
                        return res.status(500).json({
                            sucesso: false,
                            erro: err2.message
                        });
                    }

                    return res.json({
                        sucesso: true,
                        pedidoId: pedidoId
                    });
                });

            } else {
                return res.json({
                    sucesso: true,
                    pedidoId: pedidoId
                });
            }
        }
    );
};