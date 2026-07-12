const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.post("/login", usuarioController.login);
router.get("/oauth/url", usuarioController.gerarUrlOAuth);
router.get("/oauth/callback", usuarioController.callbackOAuth);

module.exports = router;