const LOJAS = {

  pizzaria: {
    nome: "Peixodá Pizzaria",

    abre: "18:00",
    fecha: "23:30",

    categorias: {

      comidas: [
        {
          nome: "Pizza Calabresa",
          img: "imagens/pizza.calabr.png",
          tamanhos: {
            P: 30,
            M: 40,
            G: 50
          }
        },
        {
          nome: "Pizza Mussarela",
          img: "imagens/pizza.mussa.png",
          tamanhos: {
            P: 30,
            M: 40,
            G: 50
          }
        },
        {
          nome: "Pizza Frango com Catupiry",
          img: "imagens/pizza.fra.cap.png",
          tamanhos: {
            P: 30,
            M: 40,
            G: 50
          }
        }
      ],

      bebidas: [
        {
          nome: "Refrigerante 1L",
          marcas: {
            Coca: {
              preco: 9,
              img: "imagens/coca.1L.png"
            },
            Pepsi: {
              preco: 9,
              img: "imagens/pespi.1L.png"
            },
            Guarana: {
              preco: 9,
              img: "imagens/guara.1L.png"
            }
          }
        },

        {
          nome: "Refrigerante 2 Litro",
          marcas: {
            Coca: {
              preco: 15,
              img: "imagens/coca.2L.png"
            },
            Pepsi: {
              preco: 15,
              img: "imagens/pespi.2L.png"
            },
            Guarana: {
              preco: 15,
              img: "imagens/guara.2L.png"
            }
          }
        },

        {
          nome: "Refrigerante Lata",
          marcas: {
            Coca: {
              preco: 5,
              img: "imagens/coca.lata.png"
            },
            Pepsi: {
              preco: 5,
              img: "imagens/pespi.lata.png"
            },
            Guarana: {
              preco: 5,
              img: "imagens/guara.lata.png"
            }
          }
        },

        {
          nome: "Água Mineral",
          preco: 4.00,
          img: "imagens/agua.png"
        }
      ]

    }
  }

};
