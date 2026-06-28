const db = require("../config/database");

exports.login = (req, res) => {
    const { email, senha } = req.body;

    db.query(
        "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
        [email, senha],
        (err, results) => {
            if (err) return res.status(500).json({ sucesso: false, erro: err.message });

            if (results.length === 0) {
                return res.json({ sucesso: false, mensagem: "Email ou senha incorretos." });
            }

            const usuario = results[0];
            res.json({
                sucesso: true,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    loja: usuario.loja
                }
            });
        }
    );
};