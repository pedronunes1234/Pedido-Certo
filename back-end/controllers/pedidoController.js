const db = require("../config/database");

// LISTAR PEDIDOS
exports.listarPedidos = (req, res) => {
    db.query("SELECT * FROM pedidos ORDER BY id DESC", (err, results) => {
        if (err) {
            return res.status(500).json({ sucesso: false, erro: err.message });
        }
        res.json({ sucesso: true, pedidos: results });
    });
};

// LISTAR PEDIDOS POR LOJA
exports.listarPedidosPorLoja = (req, res) => {
    const { loja } = req.params;

    const sql = `
        SELECT p.*, GROUP_CONCAT(
            CONCAT(
                i.quantidade, 'x ', i.nome_produto,
                IF(i.tamanho IS NOT NULL, CONCAT(' (', i.tamanho, ')'), ''),
                IF(i.sabores IS NOT NULL, CONCAT(' | Sabores: ', i.sabores), ''),
                IF(i.borda IS NOT NULL AND i.borda != 'Sem borda', CONCAT(' | Borda: ', i.borda), ''),
                IF(i.adicionais IS NOT NULL, CONCAT(' | Adicionais: ', i.adicionais), ''),
                IF(i.marca IS NOT NULL, CONCAT(' | ', i.marca), '')
            )
            SEPARATOR '\n'
        ) AS itens_resumo
        FROM pedidos p
        JOIN itens_pedido i ON i.pedido_id = p.id
        WHERE p.loja = ? AND p.oculto = 0
        GROUP BY p.id
        ORDER BY p.id DESC
    `;

    db.query(sql, [loja], (err, results) => {
        if (err) return res.status(500).json({ sucesso: false, erro: err.message });
        res.json({ sucesso: true, pedidos: results });
    });
};

// ATUALIZAR STATUS
exports.atualizarStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    db.query(
        "UPDATE pedidos SET status = ? WHERE id = ?",
        [status, id],
        (err) => {
            if (err) return res.status(500).json({ sucesso: false, erro: err.message });
            res.json({ sucesso: true });
        }
    );
};

// OCULTAR PEDIDO (não exclui do banco, só esconde do painel do lojista)
exports.ocultarPedido = (req, res) => {
    const { id } = req.params;

    db.query(
        "UPDATE pedidos SET oculto = 1 WHERE id = ?",
        [id],
        (err) => {
            if (err) return res.status(500).json({ sucesso: false, erro: err.message });
            res.json({ sucesso: true });
        }
    );
};

// CRIAR PEDIDO COMPLETO (COM ITENS)
exports.criarPedido = (req, res) => {

    console.log(req.body);

    const { loja, nome_cliente, endereco, telefone, pagamento, total, itens } = req.body;

    const sqlPedido = `
        INSERT INTO pedidos
        (loja, nome_cliente, endereco, telefone, pagamento, total)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sqlPedido, [loja, nome_cliente, endereco, telefone, pagamento, total], (err, result) => {
        if (err) {
            return res.status(500).json({ sucesso: false, erro: err.message });
        }

        const pedidoId = result.insertId;

        if (itens && itens.length > 0) {

            const sqlItens = `
                INSERT INTO itens_pedido
                (pedido_id, nome_produto, quantidade, preco, tamanho, sabores, borda, adicionais, marca)
                VALUES ?
            `;

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
                    return res.status(500).json({ sucesso: false, erro: err2.message });
                }
                return res.json({ sucesso: true, pedidoId: pedidoId });
            });

        } else {
            return res.json({ sucesso: true, pedidoId: pedidoId });
        }
    });
};

// BUSCAR DADOS DA LOJA (chave pix e whatsapp)
exports.dadosLoja = (req, res) => {
    const { loja } = req.params;

    db.query(
        "SELECT chave_pix, whatsapp FROM usuarios WHERE loja = ?",
        [loja],
        (err, results) => {
            if (err) return res.status(500).json({ sucesso: false, erro: err.message });
            if (results.length === 0) return res.json({ sucesso: false });
            res.json({ sucesso: true, dados: results[0] });
        }
    );
};