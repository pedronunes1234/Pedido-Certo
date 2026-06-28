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
  document.getElementById("btnFinalizar").addEventListener("click", async () => {

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

    // TROCO
    if (pagamentoSelecionado.value === "Dinheiro") {
      const trocoSim = document.querySelector('input[name="troco"]:checked');
      if (trocoSim && trocoSim.value === "Sim") {
        const valorTrocoRaw = document.getElementById("valorTrocoInput").value;
        const valorTroco = parseFloat(valorTrocoRaw);

        if (!valorTrocoRaw || isNaN(valorTroco) || valorTroco <= 0) {
          alert("Informe um valor de troco válido.");
          return;
        }

        if (valorTroco < totalPedido) {
          alert(`O valor do troco (R$ ${valorTroco.toFixed(2)}) é menor que o total (R$ ${totalPedido.toFixed(2)}).`);
          return;
        }
      }
    }

    let totalPedido = 0;
    const itens = Object.values(carrinho).map(item => {
      totalPedido += item.preco * item.qtd;
      return {
        nome_produto: item.nome,
        quantidade: item.qtd,
        preco: item.preco,
        tamanho: item.tamanho || null,
        sabores: item.sabores ? item.sabores.join(", ") : null,
        borda: item.borda || null,
        adicionais: item.adicionais ? item.adicionais.join(", ") : null,
        marca: item.marca || null
      };
    });

    const btnFinalizar = document.getElementById("btnFinalizar");
    btnFinalizar.disabled = true;
    btnFinalizar.textContent = "Enviando...";

    const loja = localStorage.getItem("lojaSelecionada");

    try {
        const res = await fetch("https://pedido-certo-production.up.railway.app/api/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                loja,
                nome_cliente: nome,
                endereco,
                telefone: "",
                pagamento: pagamentoSelecionado.value,
                total: totalPedido,
                itens
            })
        });

        const dados = await res.json();

        if (!dados.sucesso) {
            alert("Erro ao salvar pedido.");
            btnFinalizar.disabled = false;
            btnFinalizar.textContent = "Finalizar Pedido";
            return;
        }

        const pedidoId = dados.pedidoId;

        // SE PIX — busca dados da loja e mostra QR Code
        if (pagamentoSelecionado.value === "Pix") {
            const resLoja = await fetch(`https://pedido-certo-production.up.railway.app/api/pedidos/dados-loja/${encodeURIComponent(loja)}`);
            const dadosLoja = await resLoja.json();

            if (dadosLoja.sucesso) {
                mostrarQRCode(pedidoId, totalPedido, dadosLoja.dados.chave_pix, dadosLoja.dados.whatsapp);
            }
        } else {
            // CARTÃO OU DINHEIRO — vai direto
            alert(`Pedido #${pedidoId} confirmado! Acompanhe pelo painel.`);
            localStorage.removeItem("carrinho");
            carrinho = {};
            renderizarCarrinho();
        }

        btnFinalizar.disabled = false;
        btnFinalizar.textContent = "Finalizar Pedido";

    } catch (err) {
        console.error(err);
        alert("Erro no servidor.");
        btnFinalizar.disabled = false;
        btnFinalizar.textContent = "Finalizar Pedido";
    }
});








function mostrarQRCode(pedidoId, total, chavePix, whatsapp) {

    // Gera payload Pix
    function gerarPixPayload(chave, valor, nome, cidade) {
        const valorStr = valor.toFixed(2);
        const nomeStr = nome.substring(0, 25).padEnd(25, " ");
        const cidadeStr = cidade.substring(0, 15).padEnd(15, " ");

        const pixKey = `0014BR.GOV.BCB.PIX0136${chave}`;
        const merchant = `0014BR.GOV.BCB.PIX${String(pixKey.length).padStart(2, "0")}${pixKey}`;
        const amount = `54${String(valorStr.length).padStart(2, "0")}${valorStr}`;

        let payload = `000201${merchant}5204000053039865${amount}5802BR59${String(nomeStr.trim().length).padStart(2, "0")}${nomeStr.trim()}60${String(cidadeStr.trim().length).padStart(2, "0")}${cidadeStr.trim()}6304`;

        // CRC16
        function crc16(str) {
            let crc = 0xFFFF;
            for (let i = 0; i < str.length; i++) {
                crc ^= str.charCodeAt(i) << 8;
                for (let j = 0; j < 8; j++) {
                    crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
                }
            }
            return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
        }

        return payload + crc16(payload);
    }

    const payload = gerarPixPayload(chavePix, total, "Pedido Certo", "Brasil");

    // Cria modal do QR Code
    const modal = document.createElement("div");
    modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.8);
        display: flex; align-items: center; justify-content: center;
        z-index: 99999; padding: 20px;
    `;

    modal.innerHTML = `
        <div style="background:#fff; border-radius:20px; padding:24px; max-width:360px; width:100%; text-align:center;">
            <h2 style="color:#c40000; margin-bottom:4px;">Pagar via Pix</h2>
            <p style="color:#888; font-size:14px; margin-bottom:16px;">Pedido #${pedidoId}</p>

            <div style="font-size:28px; font-weight:bold; color:#222; margin-bottom:16px;">
                R$ ${total.toFixed(2)}
            </div>

            <div id="qrcode-container" style="display:flex; justify-content:center; margin-bottom:16px;"></div>

            <p style="font-size:12px; color:#888; margin-bottom:8px;">Chave Pix:</p>
            <div style="background:#f5f5f5; border-radius:8px; padding:10px; font-size:14px; font-weight:bold; margin-bottom:16px; word-break:break-all;">
                ${chavePix}
            </div>

            <button id="btnComprovante" style="
                width:100%; padding:14px; background:#25D366;
                color:#fff; border:none; border-radius:12px;
                font-size:16px; font-weight:bold; cursor:pointer; margin-bottom:10px;
            ">
                Enviar comprovante no WhatsApp
            </button>

            <button id="btnFecharPix" style="
                width:100%; padding:12px; background:#f5f5f5;
                color:#555; border:none; border-radius:12px;
                font-size:14px; cursor:pointer;
            ">
                Fechar
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Gera QR Code
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => {
        new QRCode(document.getElementById("qrcode-container"), {
            text: payload,
            width: 200,
            height: 200
        });
    };
    document.head.appendChild(script);

    // Botão comprovante
    document.getElementById("btnComprovante").addEventListener("click", () => {
        const mensagem = `Comprovante do pedido #${pedidoId} - R$ ${total.toFixed(2)}`;
        const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");

        localStorage.removeItem("carrinho");
        carrinho = {};
        renderizarCarrinho();
        document.body.removeChild(modal);
    });

    // Botão fechar
    document.getElementById("btnFecharPix").addEventListener("click", () => {
        localStorage.removeItem("carrinho");
        carrinho = {};
        renderizarCarrinho();
        document.body.removeChild(modal);
    });
}







}); // fecha DOMContentLoaded

