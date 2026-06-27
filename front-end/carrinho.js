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

  // ✅ LÓGICA DE SELEÇÃO VISUAL DE PAGAMENTO
  const trocoBox = document.getElementById("trocoBox");
  const valorTrocoBox = document.getElementById("valorTrocoBox");

  const opcoesPagamento = Array.from(document.querySelectorAll('.pagamento .opcao')).filter(
    opcao => !opcao.closest('.troco-box')
  );

  opcoesPagamento.forEach(opcao => {
    opcao.addEventListener("click", () => {
      opcoesPagamento.forEach(o => o.classList.remove("selecionado"));
      opcao.classList.add("selecionado");

      const radio = opcao.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      if (radio && radio.value === "Dinheiro") {
        trocoBox.style.display = "block";
      } else {
        trocoBox.style.display = "none";
        valorTrocoBox.style.display = "none";
        opcoesTroco.forEach(o => o.classList.remove("selecionado"));
      }
    });
  });

  // ✅ LÓGICA DE TROCO (Sim/Não)
  const opcoesTroco = Array.from(document.querySelectorAll('.troco-box .opcao'));

  opcoesTroco.forEach(opcao => {
    opcao.addEventListener("click", () => {
      opcoesTroco.forEach(o => o.classList.remove("selecionado"));
      opcao.classList.add("selecionado");

      const radio = opcao.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      if (radio && radio.value === "Sim") {
        valorTrocoBox.style.display = "block";
      } else {
        valorTrocoBox.style.display = "none";
      }
    });
  });

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
              ? `Sabores: ${item.sabores.join(", ")}`
              : ""}
            ${item.tamanho
              ? `<br>Tamanho: ${item.tamanho}`
              : ""}
            ${item.borda && item.borda !== "Sem borda"
              ? `<br>Borda: ${item.borda}`
              : ""}
            ${item.adicionais && item.adicionais.length > 0
              ? `<br>Adicionais: ${item.adicionais.join(", ")}`
              : ""}
            ${item.marca
              ? `<br>${item.marca}`
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

      div.querySelector(".mais").onclick = () => {
        item.qtd++;
        salvarCarrinho();
        renderizarCarrinho();
      };

      div.querySelector(".menos").onclick = () => {
        item.qtd--;
        if (item.qtd <= 0) delete carrinho[id];
        salvarCarrinho();
        renderizarCarrinho();
      };

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

  // 🚀 FINALIZAR PEDIDO
  document.getElementById("btnFinalizar").addEventListener("click", () => {

    const nome = nomeInput.value.trim();
    const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');

    console.log("clicou no botão");
console.log(JSON.stringify(carrinho, null, 2));
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

    let totalPedido = 0;
    let mensagem = `*Novo Pedido*\n\n`;
    mensagem += `Nome: ${nome}\n`;
    mensagem += `Endereço: ${endereco}\n\n`;
    mensagem += `*Pedido:*\n`;

    Object.values(carrinho).forEach(item => {
      const totalItem = item.preco * item.qtd;
      totalPedido += totalItem;
      mensagem += `• ${item.nome}\n`;
      if (item.sabores && item.sabores.length > 0) {
    mensagem += `Sabores: ${item.sabores.join(", ")}\n`;
}

if (item.tamanho) {
    mensagem += `Tamanho: ${item.tamanho}\n`;
}

if (item.borda && item.borda !== "Sem borda") {
    mensagem += `Borda: ${item.borda}\n`;
}

if (item.adicionais && item.adicionais.length > 0) {

    const adicionaisTexto = item.adicionais.map(a =>
        typeof a === "string" ? a : a.nome
    );

    mensagem += `Adicionais: ${adicionaisTexto.join(", ")}\n`;
}

if (item.marca) {
    mensagem += `Marca: ${item.marca}\n`;
}

      mensagem += `${item.qtd}x R$ ${item.preco.toFixed(2)} = R$ ${totalItem.toFixed(2)}\n\n`;
    });

    mensagem += `Total: R$ ${totalPedido.toFixed(2)}\n`;
    mensagem += `Pagamento: ${pagamentoSelecionado.value}\n`;

    // 💵 TROCO
    if (pagamentoSelecionado.value === "Dinheiro") {
      const trocoSim = document.querySelector('input[name="troco"]:checked');
      if (trocoSim && trocoSim.value === "Sim") {
        const valorTroco = parseFloat(document.getElementById("valorTrocoInput").value);
        if (!valorTroco || isNaN(valorTroco)) {
          alert("Digite o valor para o troco.");
          return;
        }
        if (valorTroco < totalPedido) {
          alert(`O valor para troco (R$ ${valorTroco.toFixed(2)}) é menor que o total do pedido (R$ ${totalPedido.toFixed(2)}). Por favor, corrija.`);
          return;
        }
        mensagem += `Troco para: R$ ${valorTroco.toFixed(2)}\n`;
      } else {
        mensagem += `Troco: Não precisa\n`;
      }
    }

    const itens = Object.values(carrinho).map(item => ({
  nome_produto: item.nome,
  quantidade: item.qtd,
  preco: item.preco,

  // 🍕 Pizza
  tamanho: item.tamanho || null,
  sabores: item.sabores ? item.sabores.join(", ") : null,
  borda: item.borda || null,

  // 🍔 Hambúrguer
  adicionais: item.adicionais
    ? item.adicionais.join(", ")
    : null,

  // 🥤 Bebida
  marca: item.marca || null
}));

    const btnFinalizar = document.getElementById("btnFinalizar");
    btnFinalizar.disabled = true;
    btnFinalizar.textContent = "Enviando...";
    const loja = localStorage.getItem("lojaSelecionada");
    console.log("Loja:", loja);
    fetch("http://127.0.0.1:3000/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loja: loja,
        nome_cliente: nome,
        endereco: endereco,
        telefone: "",
        pagamento: pagamentoSelecionado.value,
        total: totalPedido,
        itens: itens
      })
    })
    .then(res => res.json())
    .then(dados => {
      console.log("Pedido salvo:", dados);

      if (!dados.sucesso) {
        alert("Erro ao salvar pedido");
        btnFinalizar.disabled = false;
        btnFinalizar.textContent = "Finalizar Pedido (WhatsApp)";
        return;
      }

      const numero = "5584981069732";
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");

      localStorage.removeItem("carrinho");
      carrinho = {};
      renderizarCarrinho();

      btnFinalizar.disabled = false;
      btnFinalizar.textContent = "Finalizar Pedido (WhatsApp)";
    })
    .catch(err => {
      console.error(err);
      alert("Erro no servidor");
      btnFinalizar.disabled = false;
      btnFinalizar.textContent = "Finalizar Pedido (WhatsApp)";
    });

  });

}); // fecha DOMContentLoaded