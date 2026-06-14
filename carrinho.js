document.addEventListener("DOMContentLoaded", () => {

  const lista = document.getElementById("listaCarrinho");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const enderecoEl = document.getElementById("enderecoCarrinho");
  const nomeInput = document.getElementById("nomeCliente");

  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};

  // 📍 ENDEREÇO
  const endereco = localStorage.getItem("enderecoUsuario") || "Não informado";
  enderecoEl.textContent = endereco;

  // 👤 NOME
  const nomeSalvo = localStorage.getItem("nomeCliente");
  if (nomeSalvo) nomeInput.value = nomeSalvo;

  nomeInput.addEventListener("input", () => {
    localStorage.setItem("nomeCliente", nomeInput.value);
  });

  function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

  // 🧾 RENDERIZAR
  function renderizarCarrinho() {

    lista.innerHTML = "";
    let total = 0;

    Object.entries(carrinho).forEach(([id, item]) => {

      const totalItem = item.preco * item.qtd;
      total += totalItem;

      const div = document.createElement("div");
      div.classList.add("item-carrinho");

      div.innerHTML = `
        <div class="info-item">
          <h4>${item.nome}</h4>
          <p>
            ${item.tamanho ? "Tamanho: " + item.tamanho : ""}
            ${item.marca ? " • " + item.marca : ""}
          </p>

          <div class="controle">
            <button class="menos">−</button>
            <span>${item.qtd}</span>
            <button class="mais">+</button>
          </div>
        </div>

        <div class="lado-direito">
          <span class="valor-item">R$ ${totalItem.toFixed(2)}</span>
          <button class="remover">Remover</button>
        </div>
      `;

      // ➕ MAIS
      div.querySelector(".mais").onclick = () => {
        item.qtd++;
        salvarCarrinho();
        renderizarCarrinho();
      };

      // ➖ MENOS
      div.querySelector(".menos").onclick = () => {
        item.qtd--;
        if (item.qtd <= 0) delete carrinho[id];
        salvarCarrinho();
        renderizarCarrinho();
      };

      // ❌ REMOVER
      div.querySelector(".remover").onclick = () => {
        delete carrinho[id];
        salvarCarrinho();
        renderizarCarrinho();
      };

      lista.appendChild(div);
    });

    subtotalEl.textContent = "R$ " + total.toFixed(2);
    totalEl.textContent = "R$ " + total.toFixed(2);
  }

  renderizarCarrinho();

  // 💰 PAGAMENTO / TROCO
  const radios = document.querySelectorAll('input[name="pagamento"]');
  const trocoBox = document.getElementById("trocoBox");
  const trocoSim = document.getElementById("trocoSim");
  const valorTrocoBox = document.getElementById("valorTrocoBox");

  radios.forEach(radio => {
    radio.addEventListener("change", () => {

      if (radio.value === "Dinheiro" && radio.checked) {
        trocoBox.style.display = "block";
      } else {
        trocoBox.style.display = "none";
        valorTrocoBox.style.display = "none";
      }
    });
  });

  trocoSim.addEventListener("change", () => {
    valorTrocoBox.style.display = "block";
  });

  document.querySelectorAll('input[name="troco"]').forEach(r => {
    r.addEventListener("change", () => {
      if (r.value === "Não") {
        valorTrocoBox.style.display = "none";
      }
    });
  });

  // 📲 FINALIZAR
  document.getElementById("btnFinalizar").addEventListener("click", () => {

    const nome = nomeInput.value.trim();
    const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');

    if (Object.keys(carrinho).length === 0) {
      alert("Carrinho vazio.");
      return;
    }

    if (!nome) {
      alert("Digite seu nome.");
      return;
    }

    if (!pagamentoSelecionado) {
      alert("Escolha o pagamento.");
      return;
    }

    let mensagem = `*Novo Pedido*\n\n`;
    mensagem += `Nome: ${nome}\n`;
    mensagem += ` Endereço: ${endereco}\n\n`;
    mensagem += ` *Pedido:*\n`;

    let total = 0;

    Object.values(carrinho).forEach(item => {
      const totalItem = item.preco * item.qtd;
      total += totalItem;

      mensagem += `• ${item.nome}`;
      if (item.tamanho) mensagem += ` (${item.tamanho})`;
      if (item.marca) mensagem += ` - ${item.marca}`;

      mensagem += `\n${item.qtd}x R$ ${item.preco.toFixed(2)} = R$ ${totalItem.toFixed(2)}\n\n`;
    });

    mensagem += ` Total: R$ ${total.toFixed(2)}\n`;
    mensagem += ` Pagamento: ${pagamentoSelecionado.value}\n`;

    // PIX
    if (pagamentoSelecionado.value === "Pix") {
      mensagem += `\n Chave Pix: 84981635642\n`;
      mensagem += ` Nome: Pedro Gustavo\n`;
    }

    // DINHEIRO
    if (pagamentoSelecionado.value === "Dinheiro") {
      const troco = document.querySelector('input[name="troco"]:checked');

      if (troco && troco.value === "Sim") {
        const valorTroco = document.getElementById("valorTrocoInput").value;

        if (!valorTroco) {
          alert("Informe o troco.");
          return;
        }

        mensagem += ` Troco para: R$ ${parseFloat(valorTroco).toFixed(2)}\n`;
      }
    }

    const numero = "5584981069732";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

    // 🧹 LIMPAR
    localStorage.removeItem("carrinho");
    renderizarCarrinho();
  });

});