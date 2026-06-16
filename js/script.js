document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // 🔹 ENDEREÇO (FUNCIONA EM QUALQUER PÁGINA)
  // ===============================
  const textoEndereco = document.getElementById("textoEndereco");
  const btnEndereco = document.getElementById("btnEndereco");
  const inputEndereco = document.getElementById("inputEndereco");
  const btnSalvarEndereco = document.getElementById("btnSalvarEndereco");

  if (textoEndereco) {
    const enderecoSalvo = localStorage.getItem("enderecoUsuario");
    if (enderecoSalvo) {
      textoEndereco.textContent = enderecoSalvo;
    }

    if (btnEndereco) {
      btnEndereco.addEventListener("click", () => {
        inputEndereco.style.display = "block";
        btnSalvarEndereco.style.display = "block";
        inputEndereco.focus();
      });
    }

    if (btnSalvarEndereco) {
      btnSalvarEndereco.addEventListener("click", () => {
        const valor = inputEndereco.value.trim();

        if (!valor) {
          alert("Digite seu endereço.");
          return;
        }

        localStorage.setItem("enderecoUsuario", valor);
        textoEndereco.textContent = valor;

        inputEndereco.style.display = "none";
        btnSalvarEndereco.style.display = "none";
      });
    }
  }

  // ===============================
  // 🔹 SISTEMA DA LOJA
  // ===============================
  const lojaId = document.body.dataset.loja;
  if (!lojaId || typeof LOJAS === "undefined") return;

  const loja = LOJAS[lojaId];
  if (!loja) return;

  document.querySelector(".nome-loja").textContent = loja.nome;

  const statusEl = document.querySelector(".status-text");

  function verificarHorario() {
    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    const [abreH, abreM] = loja.abre.split(":").map(Number);
    const [fechaH, fechaM] = loja.fecha.split(":").map(Number);

    const minutosAbre = abreH * 60 + abreM;
    const minutosFecha = fechaH * 60 + fechaM;

    if (minutosAgora >= minutosAbre && minutosAgora <= minutosFecha) {
      statusEl.innerHTML = "🟢 Aberto agora";
      statusEl.style.color = "#28a745";
    } else {
      statusEl.innerHTML = `🔴 Fechado • Abre às ${loja.abre}`;
      statusEl.style.color = "#fff";
    }
  }

  verificarHorario();

  window.carrinho = {};
  const totalEl = document.getElementById("total-carrinho");
  const lista = document.getElementById("lista-produtos");

  const modal = document.getElementById("modalProduto");
const modalImagem = document.getElementById("modalImagem");
const modalNome = document.getElementById("modalNome");
const modalPrecoBase = document.getElementById("modalPrecoBase");
const modalTotal = document.getElementById("modalTotal");
const listaAdicionais = document.getElementById("listaAdicionais");
const fecharModal = document.getElementById("fecharModal");
const btnAdicionarCarrinho =document.getElementById("btnAdicionarCarrinho");

if (fecharModal) {
  fecharModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

let produtoAtual = null;
let adicionaisSelecionados = [];
let totalModal = 0;

let saboresSelecionados = [];

const limiteSabores = {
    P: 2,
    M: 2,
    G: 3
};

let tamanhoPizzaPersonalizada = "P";

  function atualizarTotal() {
    let total = 0;

    Object.values(carrinho).forEach(item => {
      total += item.preco * item.qtd;
    });

    totalEl.textContent = "R$ " + total.toFixed(2);
  }

  // ===============================
  // 🔹 GERAR ID ÚNICO (CORREÇÃO)
  // ===============================
  function gerarId(produto, tamanho, marca) {
    return (
      produto.nome.replace(/\s/g, "") +
      (tamanho ? "-" + tamanho : "") +
      (marca ? "-" + marca : "")
    );
  }

 function abrirModal(produto) {

    console.log(produto);

console.log("ABRIU MODAL");
    produtoAtual = produto;
    adicionaisSelecionados = [];

    modal.style.display = "flex";

    modalImagem.src = produto.img;
    modalNome.textContent = produto.nome;

    if (produto.tipo === "monte-pizza") {

        totalModal = produto.tamanhos.P;

        modalPrecoBase.textContent =
            "Preço Base: R$ " +
            totalModal.toFixed(2);

        modalTotal.textContent =
            "R$ " +
            totalModal.toFixed(2);

        criarMonteSuaPizza(produto);

        return;
    }

    btnAdicionarCarrinho.onclick = () => {

    const id = Date.now();

    carrinho[id] = {
        nome: produtoAtual.nome,
        preco: totalModal,
        qtd: 1
    };

    atualizarTotal();

    modal.style.display = "none";
};

    totalModal = produto.preco;

    modalPrecoBase.textContent =
        "Preço Base: R$ " +
        produto.preco.toFixed(2);

    modalTotal.textContent =
        "R$ " +
        totalModal.toFixed(2);

    listaAdicionais.innerHTML = "";

    if (!produto.adicionais) return;

    produto.adicionais.forEach(adicional => {

        const linha = document.createElement("div");

        linha.className = "adicional-item";

        linha.innerHTML = `
            <div>
                <strong>${adicional.nome}</strong>
                <br>
                <small>+ R$ ${adicional.preco.toFixed(2)}</small>
            </div>

            <div class="controle-adicional">
                <button class="btn-menor">-</button>
                <span>0</span>
                <button class="btn-maior">+</button>
            </div>
        `;

        const qtdEl = linha.querySelector("span");
        const btnMais = linha.querySelector(".btn-maior");
        const btnMenos = linha.querySelector(".btn-menor");

        let qtd = 0;

        btnMais.addEventListener("click", () => {

            qtd++;

            qtdEl.textContent = qtd;

            totalModal += adicional.preco;

            modalTotal.textContent =
                "R$ " +
                totalModal.toFixed(2);
        });

        btnMenos.addEventListener("click", () => {

            if (qtd === 0) return;

            qtd--;

            qtdEl.textContent = qtd;

            totalModal -= adicional.preco;

            modalTotal.textContent =
                "R$ " +
                totalModal.toFixed(2);
        });

        listaAdicionais.appendChild(linha);
    });
}


  function criarMonteSuaPizza(produto) {

    const listaSabores = document.getElementById("listaAdicionais");
    const contador = document.getElementById("contadorSabores");

    listaSabores.innerHTML = "";

    modal.querySelectorAll(".btn-tamanho").forEach(b => b.classList.remove("ativo"));
    modal.querySelector('.btn-tamanho[data-size="P"]').classList.add("ativo");

    let tamanho = "P";
    let saboresSelecionados = [];

    const limiteSabores = {
        P: 2,
        M: 2,
        G: 3
    };

    let basePrice = produto.tamanhos[tamanho];
    let total = basePrice;

    modalPrecoBase.textContent = "Preço Base: R$ " + basePrice.toFixed(2);
    modalTotal.textContent = "R$ " + basePrice.toFixed(2);

    contador.textContent = `Selecionados: 0/${limiteSabores[tamanho]}`;

    // ===============================
    // 🔥 BOTÕES P / M / G (SEM DUPLICAR EVENTO)
    // ===============================
    const botoesTamanho = modal.querySelectorAll(".btn-tamanho");

    botoesTamanho.forEach(btn => {

        // remove listener antigo (IMPORTANTE para não duplicar)
        btn.replaceWith(btn.cloneNode(true));
    });

    modal.querySelectorAll(".btn-tamanho").forEach(btn => {

        btn.addEventListener("click", () => {

            modal.querySelectorAll(".btn-tamanho")
                .forEach(b => b.classList.remove("ativo"));

            btn.classList.add("ativo");

            tamanho = btn.dataset.size;

            saboresSelecionados = [];

            listaSabores.querySelectorAll("input")
                .forEach(i => i.checked = false);

            basePrice = produto.tamanhos[tamanho];
            total = basePrice;

            modalPrecoBase.textContent =
                "Preço Base: R$ " + basePrice.toFixed(2);

            modalTotal.textContent =
                "R$ " + total.toFixed(2);

            contador.textContent =
                `Selecionados: 0/${limiteSabores[tamanho]}`;
        });
    });

    // ===============================
    // 🔥 SABORES
    // ===============================
    produto.sabores.forEach(sabor => {

        const item = document.createElement("div");
        item.className = "item-sabor-pizza";

        item.innerHTML = `
            <label>
                <input type="checkbox">
                ${sabor}
            </label>
        `;

        const checkbox = item.querySelector("input");

        checkbox.addEventListener("change", () => {

            const limite = limiteSabores[tamanho];

            if (checkbox.checked) {

                if (saboresSelecionados.length >= limite) {
                    checkbox.checked = false;
                    alert(`Máximo de ${limite} sabores para tamanho ${tamanho}`);
                    return;
                }

                saboresSelecionados.push(sabor);
            } else {
                saboresSelecionados =
                    saboresSelecionados.filter(s => s !== sabor);
            }

            contador.textContent =
                `Selecionados: ${saboresSelecionados.length}/${limite}`;
        });

        listaSabores.appendChild(item);
    });

    // ===============================
    // 🔥 BOTÃO FINAL (INTEGRADO AO SEU CARRINHO)
    // ===============================
    btnAdicionarCarrinho.onclick = () => {

        if (saboresSelecionados.length === 0) {
            alert("Escolha pelo menos 1 sabor");
            return;
        }

        const id = gerarId(produto, tamanho, "pizza");

        if (!carrinho[id]) {
            carrinho[id] = {
                nome: `${produto.nome} (${tamanho})`,
                preco: basePrice,
                qtd: 0
            };
        }

        carrinho[id].qtd++;

        atualizarTotal();

        modal.style.display = "none";
    };
}

  function renderizarCategoria(categoria) {

    lista.innerHTML = "";

    loja.categorias[categoria].forEach(produto => {
       
      console.log(produto);

      const card = document.createElement("div");
      card.classList.add("produto-card");

      const baseId = produto.nome.replace(/\s/g, "").replace(/[^a-zA-Z0-9\-_]/g, "");

      let tamanhoSelecionado = produto.tamanhos ? "M" : null;

      // Monte sua Pizza: trata como produto simples no card, tamanho M fixo
      if (produto.tipo === "monte-pizza") {
        tamanhoSelecionado = "M";
      }

      let marcaSelecionada = produto.marcas
        ? Object.keys(produto.marcas)[0]
        : null;

      let precoAtual = produto.tamanhos
        ? produto.tamanhos[tamanhoSelecionado]
        : produto.preco;

      if (produto.marcas) {
        precoAtual = produto.marcas[marcaSelecionada].preco;
      }

      let imgAtual = produto.marcas
        ? produto.marcas[marcaSelecionada].img
        : produto.img;

      card.innerHTML = `
        <img src="${imgAtual}" class="produto-img" id="img-${baseId}">

        <div class="produto-info">
          <h3>${produto.nome}</h3>

          <p class="preco-produto" id="preco-${baseId}">
            R$ ${precoAtual.toFixed(2)}
          </p>

          ${produto.tamanhos ? `
            <div class="tamanhos">
              <button class="btn-tamanho ${tamanhoSelecionado === "P" ? "ativo" : ""}" data-size="P">P</button>
              <button class="btn-tamanho ${tamanhoSelecionado === "M" ? "ativo" : ""}" data-size="M">M</button>
              <button class="btn-tamanho ${tamanhoSelecionado === "G" ? "ativo" : ""}" data-size="G">G</button>
            </div>
          ` : ""}

          ${produto.marcas ? `
            <div class="marcas">
              ${Object.keys(produto.marcas).map(marca => `
                <button class="btn-marca ${marca === marcaSelecionada ? "ativo" : ""}" 
                        data-marca="${marca}">
                  ${marca}
                </button>
              `).join("")}
            </div>
          ` : ""}
        </div>
        

        <div class="controle-qtd">
          <button class="btn-qtd" id="menos-${baseId}">−</button>
          <span class="qtd-numero" id="qtd-${baseId}">0</span>
          <button class="btn-qtd" id="mais-${baseId}">+</button>
        </div>
      `;

      lista.appendChild(card);
      console.log(
    "TIPO:",
    produto.nome,
    produto.tipo
);

if (
    produto.adicionais ||
    produto.tipo === "monte-pizza"
)
{

    card.querySelector(".produto-img")
        .addEventListener(
            "click",
            () => {

                console.log(
                    "CLICOU:",
                    produto.nome
                );

                abrirModal(produto);

            }
        );

}
      const qtdEl = card.querySelector(`#qtd-${baseId}`);
      const precoEl = card.querySelector(`#preco-${baseId}`);
      const imgEl = card.querySelector(`#img-${baseId}`);

      // 🔹 RESTAURAR QUANTIDADE AO TROCAR CATEGORIA
      const idInicial = gerarId(produto, tamanhoSelecionado, marcaSelecionada);
      if (carrinho[idInicial]) {
        qtdEl.textContent = carrinho[idInicial].qtd;
      }

      // TAMANHO
      if (produto.tamanhos) {
        const botoesTamanho = card.querySelectorAll(".btn-tamanho");

        botoesTamanho.forEach(btn => {
          btn.addEventListener("click", () => {

            botoesTamanho.forEach(b => b.classList.remove("ativo"));
            btn.classList.add("ativo");

            tamanhoSelecionado = btn.dataset.size;

            if(produto.tipo === "monte-pizza"){

    tamanhoPizzaPersonalizada =
    tamanhoSelecionado;

    const contador =
    document.getElementById(
        "contadorSabores"
    );

    if(contador){

        contador.textContent =
        `Selecionados:
        ${saboresSelecionados.length}/${
            limiteSabores[
                tamanhoPizzaPersonalizada
            ]
        }`;
    }
}

            if(produto.tipo === "monte-pizza"){

    tamanhoPizzaPersonalizada =
    tamanhoSelecionado;

}
            precoAtual = produto.tamanhos[tamanhoSelecionado];

            precoEl.textContent = "R$ " + precoAtual.toFixed(2);

            const novoId = gerarId(produto, tamanhoSelecionado, marcaSelecionada);
            qtdEl.textContent = carrinho[novoId] ? carrinho[novoId].qtd : 0;
          });
        });
      }

      // MARCA
      if (produto.marcas) {
        const botoesMarca = card.querySelectorAll(".btn-marca");

        botoesMarca.forEach(btn => {
          btn.addEventListener("click", () => {

            botoesMarca.forEach(b => b.classList.remove("ativo"));
            btn.classList.add("ativo");

            marcaSelecionada = btn.dataset.marca;
            const dados = produto.marcas[marcaSelecionada];

            imgEl.style.transform = "scale(0.95)";
            imgEl.style.opacity = "0.5";

            setTimeout(() => {
              imgEl.src = dados.img;
              precoAtual = dados.preco;
              precoEl.textContent = "R$ " + dados.preco.toFixed(2);
              imgEl.style.transform = "scale(1)";
              imgEl.style.opacity = "1";

              const novoId = gerarId(produto, tamanhoSelecionado, marcaSelecionada);
              qtdEl.textContent = carrinho[novoId] ? carrinho[novoId].qtd : 0;
            }, 150);
          });
        });
      }

      // BOTÃO +
card.querySelector(`#mais-${baseId}`).addEventListener("click", (e) => {

  e.stopPropagation();

  // Se o produto possui adicionais (mas NÃO monte-pizza)
  if (produto.adicionais) {

    abrirModal(produto);

    return;
}

  const idFinal = gerarId(
    produto,
    tamanhoSelecionado,
    marcaSelecionada
  );

  if (!carrinho[idFinal]) {
    carrinho[idFinal] = {
      nome: produto.nome,
      preco: precoAtual,
      tamanho: tamanhoSelecionado,
      marca: marcaSelecionada,
      qtd: 0
    };
  }

  carrinho[idFinal].preco = precoAtual;
  carrinho[idFinal].qtd++;

  qtdEl.textContent = carrinho[idFinal].qtd;

  atualizarTotal();

});

      // BOTÃO -
      card.querySelector(`#menos-${baseId}`).addEventListener("click", () => {

        const idFinal = gerarId(produto, tamanhoSelecionado, marcaSelecionada);
        if (!carrinho[idFinal]) return;

        carrinho[idFinal].qtd--;

        if (carrinho[idFinal].qtd <= 0) {
          delete carrinho[idFinal];
          qtdEl.textContent = 0;
        } else {
          qtdEl.textContent = carrinho[idFinal].qtd;
        }

        atualizarTotal();
      });

    });
  }

  const categoriasBtns = document.querySelectorAll(".categoria");
  const primeira = categoriasBtns[0].textContent.trim().toLowerCase();
  renderizarCategoria(primeira);

  categoriasBtns.forEach(btn => {
    btn.addEventListener("click", () => {

      categoriasBtns.forEach(b => b.classList.remove("ativa"));
      btn.classList.add("ativa");

      const nomeCategoria = btn.textContent.trim().toLowerCase();
      renderizarCategoria(nomeCategoria);
    });
  });

});

function abrirCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(window.carrinho));
  window.location.href = "carrinho.html";
}
