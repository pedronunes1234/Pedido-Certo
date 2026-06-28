const express = require("express");
const cors = require("cors");
const path = require("path");

// Conexão com o banco
const db = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// Caminho do front-end
const frontendPath = path.join(__dirname, "../front-end");

// Servir arquivos estáticos
app.use(express.static(frontendPath));

// Importar rotas
const pedidoRoutes = require("./routes/pedidoRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

// Rotas da API
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/usuarios", usuarioRoutes);

// Página inicial
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Testar conexão com o banco
app.get("/api/teste-banco", (req, res) => {
    db.query("SELECT 1 AS teste", (err, results) => {
        if (err) {
            return res.status(500).json({
                sucesso: false,
                erro: err.message
            });
        }

        res.json({
            sucesso: true,
            mensagem: "Banco conectado com sucesso!",
            resultado: results
        });
    });
});

// Inicializar servidor
app.listen(PORT, () => {
    console.log(`🚀 Pedido Certo rodando na porta ${PORT}`);
});