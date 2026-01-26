const textoEndereco = document.getElementById("textoEndereco");
const btnEndereco = document.getElementById("btnEndereco");
const inputEndereco = document.getElementById("inputEndereco");
const btnSalvar = document.getElementById("btnSalvarEndereco");

// estado inicial
inputEndereco.style.display = "none";
btnSalvar.style.display = "none";

// carregar endereço salvo
const enderecoSalvo = localStorage.getItem("enderecoCliente");

if (enderecoSalvo) {
  textoEndereco.textContent = enderecoSalvo;
  btnEndereco.innerHTML = 'Atualizar endereço <span class="seta">➜</span>';
}

// clique no botão vermelho
btnEndereco.addEventListener("click", () => {
  inputEndereco.style.display = "block";
  btnSalvar.style.display = "block";

  inputEndereco.value =
    textoEndereco.textContent === "Informe seu endereço"
      ? ""
      : textoEndereco.textContent;

  inputEndereco.focus();
});

// salvar endereço
btnSalvar.addEventListener("click", () => {
  const valor = inputEndereco.value.trim();

  if (valor === "") return;

  // salva
  localStorage.setItem("enderecoCliente", valor);

  // atualiza texto
  textoEndereco.textContent = valor;

  // esconde input e botão salvar
  inputEndereco.style.display = "none";
  btnSalvar.style.display = "none";

  // muda botão principal
  btnEndereco.innerHTML = 'Atualizar endereço <span class="seta">➜</span>';
});




function abrirLoja(pagina) {
  window.location.href = pagina;
}

function verificarHorario() {
  const agora = new Date();
  const horaAtual = agora.getHours() * 60 + agora.getMinutes();

  document.querySelectorAll(".loja-card").forEach(loja => {
    const abre = loja.dataset.abre;
    const fecha = loja.dataset.fecha;

    const [abreH, abreM] = abre.split(":").map(Number);
    const [fechaH, fechaM] = fecha.split(":").map(Number);

    const abreMin = abreH * 60 + abreM;
    const fechaMin = fechaH * 60 + fechaM;

    const status = loja.querySelector(".status-loja");

    if (horaAtual >= abreMin && horaAtual < fechaMin) {
      status.innerHTML = `
        <span class="bolinha"></span>
        Aberto • fecha às ${fecha}
      `;
      status.className = "status-loja aberto";
    } else {
      status.innerHTML = `
        Fechado • abre às ${abre}
      `;
      status.className = "status-loja fechado";
    }
  });
}

verificarHorario();
setInterval(verificarHorario, 60000);


document.querySelectorAll('.loja-card').forEach(loja => {
  loja.addEventListener('click', () => {
    const idLoja = loja.getAttribute('data-loja');

    // abre a página da loja passando o ID
    window.location.href = `loja.html?id=${idLoja}`;
  });
});






// ===== ABAS =====
document.querySelectorAll(".aba").forEach(botao => {
  botao.addEventListener("click", () => {
    document.querySelectorAll(".aba").forEach(b => b.classList.remove("ativa"));
    document.querySelectorAll(".lista").forEach(l => l.classList.remove("ativa"));

    botao.classList.add("ativa");
    document.getElementById(botao.dataset.aba).classList.add("ativa");
  });
});

// ===== STATUS DA LOJA =====
function statusLoja(abre, fecha) {
  const agora = new Date();
  const minutosAtual = agora.getHours() * 60 + agora.getMinutes();

  const [aH, aM] = abre.split(":").map(Number);
  const [fH, fM] = fecha.split(":").map(Number);

  const abreMin = aH * 60 + aM;
  const fechaMin = fH * 60 + fM;

  const status = document.getElementById("statusLoja");

  if (minutosAtual >= abreMin && minutosAtual < fechaMin) {
    status.innerText = `Aberto • fecha às ${fecha}`;
  } else {
    status.innerText = `Fechado • abre às ${abre}`;
  }
}

// EXEMPLO (cada loja muda isso)
statusLoja("16:00", "22:35");

