const LOJAS = {

  pizzaria: {
    nome: "Peixodá Pizzaria",

    abre: "18:00",
    fecha: "23:30",

    categorias: {

      comidas: [
        
        {
          nome: "Pizza Calabresa",
          img: "imagens/pizzaria/pizza.calabr.png",
          descricao: "Calabresa, cebola e orégano",
          tamanhos: {
            P: 30,
            M: 40,
            G: 50
          }
        },
        {
          nome: "Pizza Mussarela",
          img: "imagens/pizzaria/pizza.mussa.png",
          descricao: "Queijo mussarela e orégano",
          tamanhos: {
            P: 30,
            M: 40,
            G: 50
          }
        },
        {
          nome: "Pizza Frango com Catupiry",
          img: "imagens/pizzaria/pizza.fra.cap.png",
          descricao: "Frango desfiado, catupiry, azeitona e orégano",
          tamanhos: {
            P: 30,
            M: 40,
            G: 50
          }
        },

        {
          nome: "Monte sua Pizza!",
          tipo: "monte-pizza",
          img: "imagens/pizzaria/msp.png",

          tamanhos: {
            P: 35,
            M: 45,
            G: 55
          },

          sabores: [
            "Calabresa",
            "Mussarela",
            "Frango Catupiry"
          ]
        }
      ],

      bebidas: [
        {
          nome: "Refrigerante 1L",
          marcas: {
            Coca: { preco: 9, img: "imagens/bebidas/coca.1L.png" },
            Pepsi: { preco: 9, img: "imagens/bebidas/pespi.1L.png" },
            Guarana: { preco: 9, img: "imagens/bebidas/guara.1L.png" }
          }
        },
        {
          nome: "Refrigerante 2 Litro",
          marcas: {
            Coca: { preco: 15, img: "imagens/bebidas/coca.2L.png" },
            Pepsi: { preco: 15, img: "imagens/bebidas/pespi.2L.png" },
            Guarana: { preco: 15, img: "imagens/bebidas/guara.2L.png" }
          }
        },
        {
          nome: "Refrigerante Lata",
          marcas: {
            Coca: { preco: 5, img: "imagens/bebidas/coca.lata.png" },
            Pepsi: { preco: 5, img: "imagens/bebidas/pespi.lata.png" },
            Guarana: { preco: 5, img: "imagens/bebidas/guara.lata.png" }
          }
        },
        {
          nome: "Água Mineral",
          preco: 4.00,
          img: "imagens/bebidas/agua.png"
        }
      ]
    }
  },


  hamburgueria: {
    nome: "Burger House",

    abre: "16:00",
    fecha: "22:35",

    categorias: {
      comidas: [
        {
          nome: "X-Burguer",
          preco: 15,
          img: "imagens/hamburgueria/x-burger.png",
          descricao: "Pão, hambúrguer, salada, ovo, queijo, presunto e salada",
          adicionais: [
            { nome: "Bacon", preco: 3 },
            { nome: "Presunto", preco: 2 },
            { nome: "Ovo", preco: 2 },
            { nome: "Queijo", preco: 3 }
          ]
        },
        {
          nome: "X-Bacon",
          preco: 18,
          img: "imagens/hamburgueria/x-bancon.jpg",
          descricao: "Pão, hambúrguer, cheddar, bacon e salada",
          adicionais: [
            { nome: "Hamburguer", preco: 3 },
            { nome: "Bacon", preco: 2 },
            { nome: "Cheddar", preco: 3 }
          ]
        },
        {
          nome: "X-Tudo",
          preco: 25,
          img: "imagens/hamburgueria/x-tudo.png",
          descricao: "Pão, hambúrguer, cheddar, bacon, presunto, ovo, calabresa e salada",
          adicionais: [
            { nome: "Bacon", preco: 3 },
            { nome: "Presunto", preco: 2 },
            { nome: "Ovo", preco: 2 },
            { nome: "Queijo Extra", preco: 3 },
            { nome: "Calabresa", preco: 4 }
          ]
        }
      ],

      bebidas: [
        {
          nome: "Refrigerante Lata",
          marcas: {
            Coca: { preco: 5, img: "imagens/bebidas/coca.lata.png" },
            Pepsi: { preco: 5, img: "imagens/bebidas/pespi.lata.png" },
            Guarana: { preco: 5, img: "imagens/bebidas/guara.lata.png" }
          }
        },
        {
          nome: "Refrigerante 1L",
          marcas: {
            Coca: { preco: 9, img: "imagens/bebidas/coca.1L.png" },
            Pepsi: { preco: 9, img: "imagens/bebidas/pespi.1L.png" },
            Guarana: { preco: 9, img: "imagens/bebidas/guara.1L.png" }
          }
        },
        {
          nome: "Refrigerante 2 Litro",
          marcas: {
            Coca: { preco: 15, img: "imagens/bebidas/coca.2L.png" },
            Pepsi: { preco: 15, img: "imagens/bebidas/pespi.2L.png" },
            Guarana: { preco: 15, img: "imagens/bebidas/guara.2L.png" }
          }
        },
        {
          nome: "Água Mineral",
          preco: 4.00,
          img: "imagens/bebidas/agua.png"
        }
      ]
    }
  },


  kisabor: {
    nome: "Ki Sabor",

    abre: "18:30",
    fecha: "22:00",

    categorias: {

      salgados: [
        {
          nome: "Coxinha",
          preco: 5.00,
          img: "imagens/kisabor/coxinha.png"
        },
        {
          nome: "Salsichão",
          preco: 5.00,
          img: "imagens/kisabor/salsichao.png"
        }
      ],

      pastes: [
        {
          nome: "Pastel de Carne",
          preco: 8.00,
          img: "imagens/kisabor/pastel.carne.png"
        },
        {
          nome: "Pastel de Frango",
          preco: 8.00,
          img: "imagens/kisabor/pastel.frango.jpg"
        },
        {
          nome: "Pastel de Queijo",
          preco: 7.00,
          img: "imagens/kisabor/pastel.queijo.png"
        },
        {
          nome: "Pastel de Pizza",
          preco: 8.00,
          img: "imagens/kisabor/pastel.pizza.png"
        }
      ],

      delicias: [
        {
          nome: "Cachorro Quente",
          preco: 10.00,
          img: "imagens/kisabor/cachorro.quente.png"
        },
        {
          nome: "Panqueca",
          preco: 12.00,
          img: "imagens/kisabor/panqueca.png"
        }
      ],

      porcoes: [
        {
          nome: "Isca de Frango",
          preco: 25.00,
          img: "imagens/kisabor/isca.frango.png"
        },
        {
          nome: "Carne Acebolada",
          preco: 28.00,
          img: "imagens/kisabor/carne.acebolada.png"
        },
        {
          nome: "Batata Frita",
          preco: 18.00,
          img: "imagens/kisabor/batata.frita.png"
        },
        {
          nome: "Batata Especial",
          preco: 22.00,
          img: "imagens/kisabor/batata.especial.png"
        },
        {
          nome: "Mini Salgados",
          preco: 20.00,
          img: "imagens/kisabor/mini.salgados.png"
        }
      ],

      lanches: [
        {
          nome: "Bauru",
          descricao: "Pão, hambúrguer, presunto, mussarela e tomate",
          preco: 18.00,
          img: "imagens/kisabor/bauru.png"
        },
        {
          nome: "Americano",
          descricao: "Pão, hambúrguer, presunto, mussarela, tomate e ovo",
          preco: 20.00,
          img: "imagens/kisabor/americano.png"
        },
        {
          nome: "X-Calabresa",
          descricao: "Pão, hambúrguer, calabresa, mussarela, presunto, alface e tomate",
          preco: 22.00,
          img: "imagens/kisabor/x.calabresa.png"
        },
        {
          nome: "Artesanal Completo",
          descricao: "Pão hambúrguer, presunto, mussarela, bacon, ovo, calabresa, cheddar, alface e tomate",
          preco: 32.00,
          img: "imagens/kisabor/artesanal.completo.png"
        },
        {
          nome: "Artesanal Simples",
          descricao: "Pão, hambúrguer e mussarela",
          preco: 22.00,
          img: "imagens/kisabor/artesanal.simples.png"
        },
        {
          nome: "Cuscuz Recheado",
          preco: 15.00,
          img: "imagens/kisabor/cuscuz.recheado.png"
        },
        {
          nome: "Misto Quente",
          preco: 10.00,
          img: "imagens/kisabor/misto.quente.png"
        }
      ],

      bebidas: [
        {
          nome: "Refrigerante Lata",
          marcas: {
            Guaraná: { preco: 5.00, img: "imagens/bebidas/guara.lata.png" },
            Coca: { preco: 5.00, img: "imagens/bebidas/coca.lata.png" },
            Fanta: { preco: 5.00, img: "imagens/bebidas/fanta.lata.png" }
          }
        },
        {
          nome: "Suco Natural",
          preco: 8.00,
          img: "imagens/kisabor/suco.png"
        }
      ]
    }
  }

};

const enderecoSalvo = localStorage.getItem("enderecoUsuario");
const enderecoLoja = document.getElementById("endereco-usuario");
const tipoEntregaAtual = localStorage.getItem("tipoEntrega") || "entrega";

if (enderecoLoja) {
  const blocoEnderecoLoja = enderecoLoja.closest(".endereco-loja") || enderecoLoja;

  if (tipoEntregaAtual === "retirada") {
    blocoEnderecoLoja.style.display = "none";
  } else {
    blocoEnderecoLoja.style.display = "";
    if (enderecoSalvo) enderecoLoja.textContent = enderecoSalvo;
  }
}
