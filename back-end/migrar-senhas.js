// Script de uso ÚNICO - rodar uma vez para migrar senhas em texto puro para hash bcrypt
// Depois de rodar com sucesso, pode apagar este arquivo

require("dotenv").config();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306
});

async function migrar() {
    pool.query("SELECT id, email, senha FROM usuarios", async (err, usuarios) => {
        if (err) {
            console.error("Erro ao buscar usuários:", err);
            process.exit(1);
        }

        for (const usuario of usuarios) {
            // Pula se já parece ser um hash bcrypt (evita re-criptografar)
            if (usuario.senha.startsWith("$2b$") || usuario.senha.startsWith("$2a$")) {
                console.log(`Pulando ${usuario.email} (já está com hash)`);
                continue;
            }

            const hash = await bcrypt.hash(usuario.senha, 10);

            await new Promise((resolve, reject) => {
                pool.query(
                    "UPDATE usuarios SET senha = ? WHERE id = ?",
                    [hash, usuario.id],
                    (err) => {
                        if (err) return reject(err);
                        resolve();
                    }
                );
            });

            console.log(`✅ Senha migrada: ${usuario.email}`);
        }

        console.log("Migração concluída!");
        process.exit(0);
    });
}

migrar();