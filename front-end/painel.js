const API = "https://pedido-certo-production.up.railway.app";

let usuarioLogado = null;
let pedidosAnteriores = [];
let filtroAtual = "todos";
let intervaloPainel = null;

const telaLogin = document.getElementById("telaLogin");
const telaPainel = document.getElementById("telaPainel");
const nomeLoja = document.getElementById("nomeLoja");
const listaPedidos = document.getElementById("listaPedidos");
const erroLogin = document.getElementById("erroLogin");
const contadorNovos = document.getElementById("contadorNovos");
const som = document.getElementById("somNovoPedido");

document.getElementById("btnLogin").addEventListener("click", async () => {
    const email = document.getElementById("emailLogin").value.trim();
    const senha = document.getElementById("senhaLogin").value.trim();

    if (!email || !senha) {
        erroLogin.textContent = "Preencha email e senha.";
        return;
    }

    try {
        const res = await fetch(`${API}/api/usuarios/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const dados = await res.json();

        if (!dados.sucesso) {
            erroLogin.textContent = dados.mensagem;
            return;
        }

        usuarioLogado = dados.usuario;
        telaLogin.style.display = "none";
        telaPainel.style.display = "block";
        nomeLoja.textContent = usuarioLogado.loja;


        // Mostra botão de conectar MP se não conectado
        if (!dados.usuario.mp_conectado) {
            const btnConectar = document.createElement("button");
            btnConectar.textContent = "💳 Conectar Mercado Pago";
            btnConectar.style.cssText = `
                background: #ffffff; color: #c40000; border: 2px solid #c40000;
                padding: 10px 16px; border-radius: 8px;
                font-size: 14px; font-weight: bold; cursor: pointer; margin-left: 10px;
            `;
            btnConectar.addEventListener("click", async () => {
                const res = await fetch(`https://pedido-certo-production.up.railway.app/api/usuarios/oauth/url?lojaId=${usuarioLogado.id}`);
                const dados = await res.json();
                if (dados.sucesso) window.open(dados.url, "_blank");
            });
            document.querySelector(".header-painel").appendChild(btnConectar);
        }

        carregarPedidos();
        intervaloPainel = setInterval(carregarPedidos, 15000);

    } catch (err) {
        erroLogin.textContent = "Erro ao conectar ao servidor.";
    }
});

document.getElementById("btnSair").addEventListener("click", () => {
    clearInterval(intervaloPainel);
    usuarioLogado = null;
    pedidosAnteriores = [];
    telaLogin.style.display = "flex";
    telaPainel.style.display = "none";
});

document.querySelectorAll(".filtro").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filtro").forEach(b => b.classList.remove("ativo"));
        btn.classList.add("ativo");
        filtroAtual = btn.dataset.status;
        renderizarPedidos(pedidosAnteriores);
    });
});

async function carregarPedidos() {
    try {
        const loja = encodeURIComponent(usuarioLogado.loja);
        const res = await fetch(`${API}/api/pedidos/loja/${loja}`);
        const dados = await res.json();

        if (!dados.sucesso) return;

        const novos = dados.pedidos.filter(p =>
            !pedidosAnteriores.find(a => a.id === p.id)
        );

        if (pedidosAnteriores.length > 0 && novos.length > 0) {
            som.play().catch(() => {});
        }

        const aguardando = dados.pedidos.filter(p => p.status === "Aguardando Pagamento").length;
        contadorNovos.textContent = aguardando > 0 ? `${aguardando} aguardando` : "";

        pedidosAnteriores = dados.pedidos;
        renderizarPedidos(dados.pedidos);

    } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
    }
}

function renderizarPedidos(pedidos) {
    const filtrados = filtroAtual === "todos"
        ? pedidos
        : pedidos.filter(p => p.status === filtroAtual);

    if (filtrados.length === 0) {
        listaPedidos.innerHTML = `<p class="vazio">Nenhum pedido encontrado.</p>`;
        return;
    }

    listaPedidos.innerHTML = filtrados.map(pedido => {
        const hora = new Date(pedido.criado_em).toLocaleTimeString("pt-BR", {
            hour: "2-digit", minute: "2-digit"
        });

        const statusClass = pedido.status
            .toLowerCase()
            .replace(/\s+/g, "-")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const itens = pedido.itens_resumo
            ? pedido.itens_resumo.split("\n").map(i => `<div>• ${i}</div>`).join("")
            : "";

        let botao = "";
        if (pedido.status === "Aguardando Pagamento") {
            botao = `<button class="btn-status preparo" onclick="atualizarStatus(${pedido.id}, 'Em preparo')">✅ Confirmar e preparar</button>`;
        } else if (pedido.status === "Em preparo") {
            botao = `<button class="btn-status saiu" onclick="atualizarStatus(${pedido.id}, 'Saiu para entrega')">🛵 Saiu para entrega</button>`;
        } else if (pedido.status === "Saiu para entrega") {
            botao = `<button class="btn-status entregue" onclick="atualizarStatus(${pedido.id}, 'Entregue')">✅ Confirmar entrega</button>`;
        }

        return `
        <div class="pedido-card status-${statusClass}" id="card-${pedido.id}">
            <div class="pedido-topo">
                <span class="pedido-id">#${pedido.id}</span>
                <span class="pedido-status">${pedido.status}</span>
                <span class="pedido-hora">${hora}</span>
                <button class="btn-fechar-pedido" onclick="ocultarPedido(${pedido.id})" title="Ocultar pedido">✕</button>
            </div>
            <div class="pedido-info">
                <p><strong>${pedido.nome_cliente}</strong></p>
                <p>📍 ${pedido.endereco}</p>
                <p>💳 ${pedido.pagamento}</p>
            </div>
            <div class="pedido-itens">${itens}</div>
            <div class="pedido-total">Total: R$ ${parseFloat(pedido.total).toFixed(2)}</div>
            <div class="pedido-acoes">${botao}</div>
        </div>`;
    }).join("");
}

async function atualizarStatus(id, status) {
    try {
        await fetch(`${API}/api/pedidos/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });
        await carregarPedidos();
    } catch (err) {
        alert("Erro ao atualizar status.");
    }
}

async function ocultarPedido(id) {
    const card = document.getElementById(`card-${id}`);
    if (card) card.style.display = "none";

    try {
        await fetch(`${API}/api/pedidos/${id}/ocultar`, { method: "PUT" });
        pedidosAnteriores = pedidosAnteriores.filter(p => p.id !== id);
    } catch (err) {
        console.error("Erro ao ocultar pedido:", err);
    }
}