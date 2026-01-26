// ===============================
// ENDEREÇO DO CLIENTE
// ===============================
const spanEndereco = document.getElementById("enderecoCliente");
const enderecoSalvo = localStorage.getItem("enderecoCliente");

if (enderecoSalvo) {
  spanEndereco.textContent = `Entregar em: ${enderecoSalvo}`;
} else {
  spanEndereco.textContent = "Endereço não informado";
}

// ===============================
// IDENTIFICAR LOJA PELA URL
// ===============================
const params = new URLSearchParams(window.location.search);
const lojaId = params.get("id");

const nomeLoja = document.getElementById("nomeLoja");

// ===============================
// STATUS DA LOJA (ABERTO / FECHADO)
// ===============================
function statusLoja(abre, fecha) {
  const agora = new Date();
  const minutosAtual = agora.getHours() * 60 + agora.getMinutes();

  const [aH, aM] = abre.split(":").map(Number);
  const [fH, fM] = fecha.split(":").map(Number);

  const abreMin = aH * 60 + aM;
  const fechaMin = fH * 60 + fM;

  const status = document.getElementById("statusLoja");

  if (minutosAtual >= abreMin && minutosAtual < fechaMin) {
    status.textContent = `Aberto • fecha às ${fecha}`;
  } else {
    status.textContent = `Fechado • abre às ${abre}`;
  }
}

// ===============================
// CONFIGURAÇÕES POR LOJA
// ===============================
if (lojaId === "burger") {
  nomeLoja.textContent = "Burger House";
  statusLoja("16:00", "22:35");
}

if (lojaId === "pizzaria") {
  nomeLoja.textContent = "Peixodá Pizzaria";
  statusLoja("18:00", "23:30");
}

// ===============================
// PRODUTOS (EXEMPLO)
// ===============================
const produtos = {
  comidas: [
    { nome: "X-Burger", preco: 12 },
    { nome: "X-Bacon", preco: 15 },
    { nome: "Batata Frita", preco: 10 }
  ],
  bebidas: [
    { nome: "Coca-Cola Lata", preco: 6 },
    { nome: "Guaraná", preco: 5 },
    { nome: "Suco Natural", preco: 7 }
  ]
};

const listaProdutos = document.getElementById("listaProdutos");

// ===============================
// RENDERIZAR PRODUTOS
// ===============================
function carregarProdutos(tipo) {
  listaProdutos.innerHTML = "";

  produtos[tipo].forEach(produto => {
    listaProdutos.innerHTML += `
      <div class="produto">
        <div class="info-produto">
          <span class="nome-produto">${produto.nome}</span>
          <span class="preco-produto">R$ ${produto.preco.toFixed(2)}</span>
        </div>

        <div class="contador">
          <button class="menos">−</button>
          <span class="qtd">0</span>
          <button class="mais">+</button>
        </div>
      </div>
    `;
  });
}

// ===============================
// ABAS (COMIDAS / BEBIDAS)
// ===============================
const abas = document.querySelectorAll(".aba");

abas.forEach(aba => {
  aba.addEventListener("click", () => {
    abas.forEach(a => a.classList.remove("ativa"));
    aba.classList.add("ativa");

    carregarProdutos(aba.dataset.tipo);
  });
});

// ===============================
// INICIALIZA
// ===============================
carregarProdutos("comidas");


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("mais")) {
    const qtd = e.target.previousElementSibling;
    qtd.textContent = Number(qtd.textContent) + 1;
  }

  if (e.target.classList.contains("menos")) {
    const qtd = e.target.nextElementSibling;
    if (Number(qtd.textContent) > 0) {
      qtd.textContent = Number(qtd.textContent) - 1;
    }
  }
});


// ===================== CARRINHO =====================

// carrega carrinho salvo
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// atualiza o texto do botão
function atualizarBotaoCarrinho() {
  const btn = document.getElementById("btnCarrinho");
  if (!btn) return;

  let total = 0;
  carrinho.forEach(item => {
    total += item.preco * item.qtd;
  });

  btn.innerText = `Ver Carrinho (R$ ${total.toFixed(2).replace(".", ",")})`;
}

// adiciona produto ao carrinho
function adicionarAoCarrinho(produto) {
  const item = carrinho.find(p => p.id === produto.id);

  if (item) {
    item.qtd += 1;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      qtd: 1
    });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarBotaoCarrinho();
}

// clique no botão do carrinho
const btnCarrinho = document.getElementById("btnCarrinho");
if (btnCarrinho) {
  btnCarrinho.addEventListener("click", () => {
    window.location.href = "carrinho.html";
  });
}

// inicia com valor salvo
atualizarBotaoCarrinho();
