const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");
// Listar pedidos
router.get("/", pedidoController.listarPedidos);
// Criar pedido
router.post("/", pedidoController.criarPedido);
module.exports = router;