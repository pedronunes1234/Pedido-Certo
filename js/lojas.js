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
          tamanhos: {
            P: 30,
            M: 40,
            G: 50
          }
        },
        {
          nome: "Pizza Mussarela",
          img: "imagens/pizzaria/pizza.mussa.png",
          tamanhos: {
            P: 30,
            M: 40,
            G: 50
          }
        },
        {
          nome: "Pizza Frango com Catupiry",
          img: "imagens/pizzaria/pizza.fra.cap.png",
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
            Coca: {
              preco: 9,
              img: "imagens/bebidas/coca.1L.png"
            },
            Pepsi: {
              preco: 9,
              img: "imagens/bebidas/pespi.1L.png"
            },
            Guarana: {
              preco: 9,
              img: "imagens/bebidas/guara.1L.png"
            }
          }
        },

        {
          nome: "Refrigerante 2 Litro",
          marcas: {
            Coca: {
              preco: 15,
              img: "imagens/bebidas/coca.2L.png"
            },
            Pepsi: {
              preco: 15,
              img: "imagens/bebidas/pespi.2L.png"
            },
            Guarana: {
              preco: 15,
              img: "imagens/bebidas/guara.2L.png"
            }
          }
        },

        {
          nome: "Refrigerante Lata",
          marcas: {
            Coca: {
              preco: 5,
              img: "imagens/bebidas/coca.lata.png"
            },
            Pepsi: {
              preco: 5,
              img: "imagens/bebidas/pespi.lata.png"
            },
            Guarana: {
              preco: 5,
              img: "imagens/bebidas/guara.lata.png"
            }
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

    adicionais: [
      {
        nome: "Bacon",
        preco: 3
      },

      {
        nome: "Presunto",
        preco: 2
      },

      {
        nome: "Ovo",
        preco: 2
      },

      {
        nome: "Queijo Extra",
        preco: 3
      }
    ]
  },

  {
    nome: "X-Bacon",
    preco: 18,
    img: "imagens/hamburgueria/x-bancon.jpg",

    adicionais: [
      {
        nome: "Bacon Extra",
        preco: 3
      },

      {
        nome: "Ovo",
        preco: 2
      },

      {
        nome: "Queijo Extra",
        preco: 3
      }
    ]
  },

  {
    nome: "X-Tudo",
    preco: 25,
    img: "imagens/hamburgueria/x-tudo.png",

    adicionais: [
      {
        nome: "Bacon",
        preco: 3
      },

      {
        nome: "Presunto",
        preco: 2
      },

      {
        nome: "Ovo",
        preco: 2
      },

      {
        nome: "Queijo Extra",
        preco: 3
      },

      {
        nome: "Calabresa",
        preco: 4
      }
    ]
  }
    ],

    bebidas: [
      {
        nome: "Refrigerante Lata",
        marcas: {
          Coca: {
            preco: 5,
            img: "imagens/bebidas/coca.lata.png"
          },

          Pepsi: {
            preco: 5,
            img: "imagens/bebidas/pespi.lata.png"
          },

           Guarana: {
              preco: 5,
              img: "imagens/bebidas/guara.lata.png"
           }

        }
        
      },

       {
          nome: "Refrigerante 1L",
          marcas: {
            Coca: {
              preco: 9,
              img: "imagens/bebidas/coca.1L.png"
            },
            Pepsi: {
              preco: 9,
              img: "imagens/bebidas/pespi.1L.png"
            },
            Guarana: {
              preco: 9,
              img: "imagens/bebidas/guara.1L.png"
            }
          }
        },

        {
          nome: "Refrigerante 2 Litro",
          marcas: {
            Coca: {
              preco: 15,
              img: "imagens/bebidas/coca.2L.png"
            },
            Pepsi: {
              preco: 15,
              img: "imagens/bebidas/pespi.2L.png"
            },
            Guarana: {
              preco: 15,
              img: "imagens/bebidas/guara.2L.png"
            }
          }
        },
        
        {
          nome: "Água Mineral",
          preco: 4.00,
          img: "imagens/bebidas/agua.png"
        }
    ]
  }

}
};

const enderecoSalvo = localStorage.getItem("enderecoUsuario");
const enderecoLoja = document.getElementById("endereco-usuario");

if (enderecoLoja && enderecoSalvo) {
  enderecoLoja.textContent = enderecoSalvo;
}


