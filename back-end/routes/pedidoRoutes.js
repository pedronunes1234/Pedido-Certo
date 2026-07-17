const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");

router.get("/", pedidoController.listarPedidos);
router.post("/", pedidoController.criarPedido);
router.get("/loja/:loja", pedidoController.listarPedidosPorLoja);
router.put("/:id/status", pedidoController.atualizarStatus);
router.put("/:id/ocultar", pedidoController.ocultarPedido);
router.get("/dados-loja/:loja", pedidoController.dadosLoja);

module.exports = router;