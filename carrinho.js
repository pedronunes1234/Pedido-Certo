const btnFinalizar = document.getElementById("btnFinalizar");

btnFinalizar.addEventListener("click", () => {

  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
  const endereco = localStorage.getItem("enderecoUsuario") || "";
  const nomeCliente = document.getElementById("nomeCliente").value.trim();
  const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');

  // 🔒 BLOQUEIOS IMPORTANTES

  if (Object.keys(carrinho).length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  if (!nomeCliente) {
    alert("Digite seu nome.");
    return;
  }

  if (!endereco) {
    alert("Informe seu endereço antes de finalizar.");
    return;
  }

  if (!pagamentoSelecionado) {
    alert("Selecione a forma de pagamento.");
    return;
  }

  const formaPagamento = pagamentoSelecionado.value;

  // 🔹 MONTAR MENSAGEM
  let mensagem = " *Novo Pedido - Peixodá Pizzaria*\n\n";
  mensagem += " Cliente: " + nomeCliente + "\n";
  mensagem += " Endereço: " + endereco + "\n\n";
  mensagem += " *Itens do Pedido:*\n";

  let total = 0;

  Object.values(carrinho).forEach(item => {
    const totalItem = item.preco * item.qtd;
    total += totalItem;

    mensagem += `• ${item.nome}`;
    
    if (item.tamanho) mensagem += ` - ${item.tamanho}`;
    if (item.marca) mensagem += ` (${item.marca})`;

    mensagem += `\n  ${item.qtd}x R$ ${item.preco.toFixed(2)} = R$ ${totalItem.toFixed(2)}\n\n`;
  });

  mensagem += " *Total:* R$ " + total.toFixed(2) + "\n";
  mensagem += " Pagamento: " + formaPagamento + "\n";

  // 🔹 PIX
  if (formaPagamento === "Pix") {
    const chavePix = "84981635642"; // coloque a chave real
    const nomePix = "Peixodá Pizzaria";

    mensagem += "\n *Chave Pix:84981635642* " + chavePix + "\n";
    mensagem += " Favorecido: Pedro Gustavo " + nomePix + "\n";
    mensagem += " Envie o comprovante após o pagamento.\n";
  }

  // 🔹 DINHEIRO
  if (formaPagamento === "Dinheiro") {

    const trocoSelecionado = document.querySelector('input[name="troco"]:checked');

    if (trocoSelecionado && trocoSelecionado.value === "Sim") {

      const valorTroco = document.getElementById("valorTrocoInput").value;

      if (!valorTroco) {
        alert("Informe o valor para troco.");
        return;
      }

      mensagem += " Troco para: R$ " + parseFloat(valorTroco).toFixed(2) + "\n";
    }
  }

  const numero = "5584981069732"; // COLOQUE O NÚMERO REAL
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  // 🚀 ABRIR WHATSAPP
  window.open(url, "_blank");

  // 🧹 LIMPAR CARRINHO AUTOMATICAMENTE
  localStorage.removeItem("carrinho");

});
