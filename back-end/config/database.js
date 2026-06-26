const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "pedido_certo"
});

connection.connect((err) => {
    if (err) {
        console.error("Erro ao conectar:", err);
        return;
    }

    console.log("✅ Banco de dados conectado!");
});

module.exports = connection;