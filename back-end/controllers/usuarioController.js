const db = require("../config/database");
const bcrypt = require("bcrypt");

exports.login = (req, res) => {
    const { email, senha } = req.body;

    // Busca o usuário só pelo email (a senha é conferida depois, com bcrypt)
    db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        async (err, results) => {
            if (err) return res.status(500).json({ sucesso: false, erro: err.message });

            if (results.length === 0) {
                return res.json({ sucesso: false, mensagem: "Email ou senha incorretos." });
            }

            const usuario = results[0];

            try {
                const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

                if (!senhaCorreta) {
                    return res.json({ sucesso: false, mensagem: "Email ou senha incorretos." });
                }

                res.json({
                    sucesso: true,
                    usuario: {
                        id: usuario.id,
                        nome: usuario.nome,
                        loja: usuario.loja,
                        mp_conectado: !!usuario.mp_access_token
                    }
                });
            } catch (errBcrypt) {
                console.error("Erro ao verificar senha:", errBcrypt);
                res.status(500).json({ sucesso: false, erro: "Erro ao verificar senha." });
            }
        }
    );
};

// GERAR URL OAUTH
exports.gerarUrlOAuth = (req, res) => {
    const { lojaId } = req.query;
    const clientId = process.env.MP_CLIENT_ID;
    const redirectUri = "https://pedido-certo-production.up.railway.app/api/usuarios/oauth/callback";

    const url = `https://auth.mercadopago.com.br/authorization?client_id=${clientId}&response_type=code&platform_id=mp&state=${lojaId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    res.json({ sucesso: true, url });
};

// CALLBACK OAUTH
exports.callbackOAuth = async (req, res) => {
    const { code, state } = req.query;
    const lojaId = state;

    try {
        const response = await fetch("https://api.mercadopago.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: process.env.MP_CLIENT_ID,
                client_secret: process.env.MP_CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: "https://pedido-certo-production.up.railway.app/api/usuarios/oauth/callback"
            })
        });

        const dados = await response.json();

        db.query(
            "UPDATE usuarios SET mp_access_token = ?, mp_user_id = ? WHERE id = ?",
            [dados.access_token, dados.user_id, lojaId],
            (err) => {
                if (err) return res.status(500).send("Erro ao salvar token");
                res.redirect(`https://pedronunes1234.github.io/Pedido-Certo/front-end/painel.html?conectado=true`);
            }
        );

    } catch (err) {
        console.error("Erro OAuth:", err);
        res.status(500).send("Erro na autenticação");
    }
};