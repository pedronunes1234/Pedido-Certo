const express = require("express");
const router = express.Router();
const pagamentoController = require("../controllers/pagamentoController");

router.post("/pix", pagamentoController.criarPix);
router.post("/webhook", pagamentoController.webhook);

module.exports = router;