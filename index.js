const inputNome = document.getElementById('busca');
const selectCategoria = document.getElementById('categoria');
const inputPreco = document.getElementById('preco');
const container = document.getElementById('cartas-container');
const nenhumResultado = document.getElementById('nenhum-resultado');

let todasAsCartas = [];

function aplicarFiltros() {
  const nomeFiltro = inputNome.value.trim().toLowerCase();
  const categoriaFiltro = selectCategoria.value;
  const precoFiltro = parseFloat(inputPreco.value) || Infinity;

  let algumaVisivel = false;
  container.innerHTML = '';

  todasAsCartas.forEach(carta => {
    const nome = carta.nome.toLowerCase();
    const categoria = carta.categoria;
    const preco = carta.preco;

    const nomeOK = nome.includes(nomeFiltro);
    const categoriaOK = categoriaFiltro === '' || categoria === categoriaFiltro;
    const precoOK = preco <= precoFiltro;

    if (nomeOK && categoriaOK && precoOK) {
      const card = criarCartaElemento(carta);
      container.appendChild(card);
      algumaVisivel = true;
    }
  });

  nenhumResultado.style.display = algumaVisivel ? 'none' : 'block';
}

function criarCartaElemento(carta) {
  const card = document.createElement('div');
  card.classList.add('carta');
  card.setAttribute('data-nome', carta.nome.toLowerCase());
  card.setAttribute('data-categoria', carta.categoria);
  card.setAttribute('data-preco', carta.preco);
  card.setAttribute('title', carta.descricao); // Tooltip

  card.innerHTML = `
    <img src="${carta.imagem}" alt="${carta.nome}">
    <h3>${carta.nome}</h3>
    <p>Categoria: ${carta.categoria}</p>
    <p>R$ ${carta.preco.toFixed(2)}</p>
    <button class="btn-comprar">Comprar</button>
  `;

  const btnFav = document.createElement('button');
  btnFav.classList.add('btn-favorito');
  btnFav.textContent = carta.favorito ? '★' : '☆';
  btnFav.title = 'Favoritar';

  btnFav.addEventListener('click', () => {
    carta.favorito = !carta.favorito;
    btnFav.textContent = carta.favorito ? '★' : '☆';
    salvarFavoritos();
  });

  card.appendChild(btnFav);

  return card;
}

// Carrega as cartas do JSON
fetch('cartas.json')
  .then(response => response.json())
  .then(data => {
    // Tenta carregar favoritos salvos
    const salvos = JSON.parse(localStorage.getItem('favoritos')) || {};
    data.forEach(carta => {
      carta.favorito = salvos[carta.nome] || false;
    });

    todasAsCartas = data;
    aplicarFiltros();
  })
  .catch(error => {
    console.error('Erro ao carregar cartas:', error);
    nenhumResultado.textContent = 'Erro ao carregar as cartas.';
    nenhumResultado.style.display = 'block';
  });

// Salva favoritos no localStorage
function salvarFavoritos() {
  const favoritos = {};
  todasAsCartas.forEach(carta => {
    favoritos[carta.nome] = carta.favorito;
  });
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// Eventos
inputNome.addEventListener('input', aplicarFiltros);
selectCategoria.addEventListener('change', aplicarFiltros);
inputPreco.addEventListener('input', aplicarFiltros);