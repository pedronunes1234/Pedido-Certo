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
          <p class="desc-item">
            ${item.sabores && item.sabores.length > 0
              ? ` Sabores: ${item.sabores.join(", ")}`
              : ""}
            ${item.borda && item.borda !== "Sem borda"
              ? `<br> Borda: ${item.borda}`
              : ""}
            ${item.tamanho && !item.sabores
              ? `📏 Tamanho: ${item.tamanho}`
              : ""}
            ${item.marca
              ? `<br>🥤 ${item.marca}`
              : ""}
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

      document.querySelectorAll('input[name="pagamento"]').forEach(r => {
        r.closest(".opcao").classList.remove("selecionado");
      });
      radio.closest(".opcao").classList.add("selecionado");

      if (radio.value === "Dinheiro" && radio.checked) {
        trocoBox.style.display = "block";

        // Inicializa o "Não" como selecionado visualmente
        const trocoNao = document.querySelector('input[name="troco"][value="Não"]');
        trocoNao.checked = true;
        document.querySelectorAll('input[name="troco"]').forEach(r => {
          r.closest(".opcao").classList.remove("selecionado");
        });
        trocoNao.closest(".opcao").classList.add("selecionado");
        valorTrocoBox.style.display = "none";

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

      // Atualiza visual
      document.querySelectorAll('input[name="troco"]').forEach(radio => {
        radio.closest(".opcao").classList.remove("selecionado");
      });
      r.closest(".opcao").classList.add("selecionado");

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

      mensagem += `• ${item.nome}\n`;
      if (item.sabores && item.sabores.length > 0)
        mensagem += `  Sabores: ${item.sabores.join(", ")}\n`;
      if (item.borda && item.borda !== "Sem borda")
        mensagem += `  Borda: ${item.borda}\n`;
      if (item.marca)
        mensagem += `  Marca: ${item.marca}\n`;
      mensagem += `  ${item.qtd}x R$ ${item.preco.toFixed(2)} = R$ ${totalItem.toFixed(2)}\n\n`;
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
        const valorTroco = parseFloat(document.getElementById("valorTrocoInput").value);

        if (!valorTroco) {
          alert("Informe o valor do troco.");
          return;
        }

        if (valorTroco < total) {
          alert(`O valor do troco (R$ ${valorTroco.toFixed(2)}) é inferior ao total do pedido (R$ ${total.toFixed(2)}). Por favor, informe um valor maior.`);
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