const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");

router.get("/", pedidoController.listarPedidos);
router.post("/", pedidoController.criarPedido);
router.get("/loja/:loja", pedidoController.listarPedidosPorLoja);
router.put("/:id/status", pedidoController.atualizarStatus);

module.exports = router;