import {
  categorias,
  produtos,
  produtosDestaque,
} from './dados.js'

import {
  adicionarAoCarrinho,
  alterarQuantidade,
  removerDoCarrinho,
  calcularTotais,
} from './carrinho.js'

const moeda =
  new Intl.NumberFormat(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    },
  )

const estado = {
  categoria: 'Todos',
  carrinho: [],
  fonteAmpliada: false,
  altoContraste: false,
}

const elementos = {
  menu:
    document.getElementById(
      'menu',
    ),

  filtros:
    document.getElementById(
      'filtros',
    ),

  destaques:
    document.getElementById(
      'destaques',
    ),

  resumo:
    document.getElementById(
      'resumo',
    ),

  subtotal:
    document.getElementById(
      'subtotal',
    ),

  total:
    document.getElementById(
      'total',
    ),

  quantidadeCarrinho:
    document.getElementById(
      'quantidade-carrinho',
    ),

  contadorTopo:
    document.getElementById(
      'contador-topo',
    ),

  finalizar:
    document.getElementById(
      'finalizar',
    ),

  limpar:
    document.getElementById(
      'limpar',
    ),

  abrirCarrinho:
    document.getElementById(
      'abrir-carrinho',
    ),

  barraMobile:
    document.getElementById(
      'barra-carrinho-mobile',
    ),

  mobileItens:
    document.getElementById(
      'mobile-itens',
    ),

  mobileTotal:
    document.getElementById(
      'mobile-total',
    ),

  alternarFonte:
    document.getElementById(
      'alternar-fonte',
    ),

  alternarContraste:
    document.getElementById(
      'alternar-contraste',
    ),

  anuncios:
    document.getElementById(
      'anuncios',
    ),

  confirmacao:
    document.getElementById(
      'confirmacao-pedido',
    ),

  numeroPedido:
    document.getElementById(
      'numero-pedido',
    ),

  confirmacaoItens:
    document.getElementById(
      'confirmacao-itens',
    ),

  confirmacaoTotal:
    document.getElementById(
      'confirmacao-total',
    ),

  novoPedido:
    document.getElementById(
      'novo-pedido',
    ),
}

function anunciar(mensagem) {
  elementos.anuncios.textContent = ''

  window.setTimeout(
    () => {
      elementos.anuncios.textContent =
        mensagem
    },
    40,
  )
}

function criarIconeCarrinho() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3.5 4.5h2l1.7 9.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 1.9-1.4l1.5-5.4H7.1M9.6 19a1 1 0 1 0 0 .01M17.2 19a1 1 0 1 0 0 .01"
      />
    </svg>
  `
}

function criarCardProduto(
  produto,
  compacto = false,
) {
  const artigo =
    document.createElement(
      'article',
    )

  artigo.className =
    compacto
      ? 'produto-card produto-card-destaque'
      : 'produto-card'

  artigo.dataset.categoria =
    produto.categoria

  artigo.innerHTML = `
    <div class="produto-imagem-wrap">
      <img
        class="produto-imagem"
        src="${produto.imagem}"
        alt="${produto.nome}"
        loading="lazy"
      />

      <span class="produto-selo">
        ${produto.destaque}
      </span>
    </div>

    <div class="produto-conteudo">
      <span class="produto-categoria">
        ${produto.categoria}
      </span>

      <h3>
        ${produto.nome}
      </h3>

      <p>
        ${produto.descricao}
      </p>

      <div class="produto-rodape">
        <strong class="produto-preco">
          ${moeda.format(produto.preco)}
        </strong>

        <button
          class="adicionar-produto"
          type="button"
          data-produto="${produto.id}"
          aria-label="Adicionar ${produto.nome} ao pedido"
        >
          ${criarIconeCarrinho()}

          <span>
            Adicionar
          </span>
        </button>
      </div>
    </div>
  `

  artigo
    .querySelector(
      '.adicionar-produto',
    )
    .addEventListener(
      'click',
      () => {
        adicionarProduto(
          produto.id,
        )
      },
    )

  return artigo
}

function renderizarDestaques() {
  elementos.destaques.innerHTML =
    ''

  produtosDestaque.forEach(
    (id) => {
      const produto =
        produtos.find(
          (item) =>
            item.id === id,
        )

      if (produto) {
        elementos.destaques
          .appendChild(
            criarCardProduto(
              produto,
              true,
            ),
          )
      }
    },
  )
}

function renderizarFiltros() {
  elementos.filtros.innerHTML =
    ''

  categorias.forEach(
    (categoria) => {
      const botao =
        document.createElement(
          'button',
        )

      botao.type =
        'button'

      botao.className =
        'filtro-botao'

      botao.textContent =
        categoria

      botao.setAttribute(
        'aria-pressed',
        String(
          estado.categoria ===
            categoria,
        ),
      )

      if (
        estado.categoria ===
        categoria
      ) {
        botao.classList.add(
          'ativo',
        )
      }

      botao.addEventListener(
        'click',
        () => {
          estado.categoria =
            categoria

          renderizarFiltros()
          renderizarMenu()

          anunciar(
            `Categoria ${categoria} selecionada.`,
          )
        },
      )

      elementos.filtros
        .appendChild(
          botao,
        )
    },
  )
}

function renderizarMenu() {
  elementos.menu.innerHTML = ''

  const visiveis =
    estado.categoria === 'Todos'
      ? produtos
      : produtos.filter(
          (produto) =>
            produto.categoria ===
            estado.categoria,
        )

  visiveis.forEach(
    (produto) => {
      elementos.menu.appendChild(
        criarCardProduto(produto),
      )
    },
  )
}

function adicionarProduto(
  produtoId,
) {
  const produto =
    produtos.find(
      (item) =>
        item.id === produtoId,
    )

  if (!produto) {
    return
  }

  estado.carrinho =
    adicionarAoCarrinho(
      estado.carrinho,
      produto,
      1,
    )

  renderizarCarrinho()

  anunciar(
    `${produto.nome} adicionado ao pedido.`,
  )
}

function atualizarQuantidade(
  produtoId,
  delta,
) {
  estado.carrinho =
    alterarQuantidade(
      estado.carrinho,
      produtoId,
      delta,
    )

  renderizarCarrinho()
}

function removerProduto(
  produtoId,
) {
  const item =
    estado.carrinho.find(
      (entrada) =>
        entrada.produto.id ===
        produtoId,
    )

  estado.carrinho =
    removerDoCarrinho(
      estado.carrinho,
      produtoId,
    )

  renderizarCarrinho()

  if (item) {
    anunciar(
      `${item.produto.nome} removido do pedido.`,
    )
  }
}

function limparCarrinho() {
  if (
    estado.carrinho.length === 0
  ) {
    return
  }

  estado.carrinho = []

  renderizarCarrinho()

  anunciar(
    'Carrinho limpo.',
  )
}

function criarItemCarrinho(
  item,
) {
  const linha =
    document.createElement(
      'article',
    )

  linha.className =
    'carrinho-item'

  linha.innerHTML = `
    <img
      src="${item.produto.imagem}"
      alt=""
    />

    <div class="carrinho-item-info">
      <strong>
        ${item.produto.nome}
      </strong>

      <span>
        ${moeda.format(item.produto.preco)} cada
      </span>

      <button
        class="remover-item"
        type="button"
      >
        Remover
      </button>
    </div>

    <div
      class="controle-quantidade"
      aria-label="Quantidade de ${item.produto.nome}"
    >
      <button
        type="button"
        data-delta="-1"
        aria-label="Diminuir quantidade de ${item.produto.nome}"
      >
        −
      </button>

      <span aria-live="polite">
        ${item.quantidade}
      </span>

      <button
        type="button"
        data-delta="1"
        aria-label="Aumentar quantidade de ${item.produto.nome}"
      >
        +
      </button>
    </div>
  `

  linha
    .querySelectorAll(
      '[data-delta]',
    )
    .forEach(
      (botao) => {
        botao.addEventListener(
          'click',
          () => {
            atualizarQuantidade(
              item.produto.id,
              Number(
                botao.dataset.delta,
              ),
            )
          },
        )
      },
    )

  linha
    .querySelector(
      '.remover-item',
    )
    .addEventListener(
      'click',
      () => {
        removerProduto(
          item.produto.id,
        )
      },
    )

  return linha
}

function renderizarCarrinho() {
  elementos.resumo.innerHTML = ''

  const totais =
    calcularTotais(
      estado.carrinho,
    )

  const vazio =
    totais.quantidadeItens === 0

  if (vazio) {
    elementos.resumo.innerHTML = `
      <div class="carrinho-vazio">
        <span
          class="carrinho-vazio-icone"
          aria-hidden="true"
        >
          🧺
        </span>

        <strong>
          Seu pedido está vazio
        </strong>

        <p>
          Adicione um item do cardápio e ele aparecerá aqui.
        </p>
      </div>
    `
  } else {
    estado.carrinho.forEach(
      (item) => {
        elementos.resumo
          .appendChild(
            criarItemCarrinho(
              item,
            ),
          )
      },
    )
  }

  const legendaItens =
    `${totais.quantidadeItens} ${
      totais.quantidadeItens === 1
        ? 'item'
        : 'itens'
    }`

  elementos.quantidadeCarrinho.textContent =
    legendaItens

  elementos.contadorTopo.textContent =
    totais.quantidadeItens

  elementos.subtotal.textContent =
    moeda.format(
      totais.subtotal,
    )

  elementos.total.textContent =
    moeda.format(
      totais.total,
    )

  elementos.finalizar.disabled =
    vazio

  elementos.limpar.disabled =
    vazio

  elementos.mobileItens.textContent =
    legendaItens

  elementos.mobileTotal.textContent =
    moeda.format(
      totais.total,
    )

  elementos.barraMobile.hidden =
    vazio
}

function gerarNumeroPedido() {
  if (
    window.crypto?.getRandomValues
  ) {
    const valores =
      new Uint16Array(1)

    window.crypto
      .getRandomValues(
        valores,
      )

    return `AUR ${String(
      1000 +
        (valores[0] % 9000),
    )}`
  }

  return `AUR ${Math.floor(
    1000 +
      Math.random() * 9000,
  )}`
}

function finalizarPedido() {
  const totais =
    calcularTotais(
      estado.carrinho,
    )

  if (
    totais.quantidadeItens === 0
  ) {
    return
  }

  elementos.numeroPedido.textContent =
    gerarNumeroPedido()

  elementos.confirmacaoItens.textContent =
    totais.quantidadeItens

  elementos.confirmacaoTotal.textContent =
    moeda.format(
      totais.total,
    )

  estado.carrinho = []

  renderizarCarrinho()

  elementos.confirmacao.showModal()

  anunciar(
    'Pedido registrado com sucesso.',
  )
}

function rolarParaCarrinho() {
  document
    .getElementById(
      'carrinho',
    )
    .scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
}

function falar(texto) {
  if (
    !(
      'speechSynthesis'
      in window
    )
  ) {
    anunciar(
      'A leitura por voz não está disponível neste navegador.',
    )

    return
  }

  window.speechSynthesis.cancel()

  const mensagem =
    new SpeechSynthesisUtterance(
      texto,
    )

  mensagem.lang =
    'pt-BR'

  mensagem.rate =
    0.95

  mensagem.pitch =
    1

  const vozes =
    window.speechSynthesis
      .getVoices()

  const vozPt =
    vozes.find(
      (voz) =>
        voz.lang
          .toLowerCase()
          .startsWith(
            'pt-br',
          ),
    )

  if (vozPt) {
    mensagem.voice =
      vozPt
  }

  window.speechSynthesis
    .speak(
      mensagem,
    )
}

function ouvirCardapio() {
  if (
    'speechSynthesis'
      in window &&
    window.speechSynthesis
      .speaking
  ) {
    window.speechSynthesis
      .cancel()

    anunciar(
      'Leitura interrompida.',
    )

    return
  }

  const texto =
    produtos
      .map(
        (produto) =>
          `${produto.nome}, ${moeda.format(produto.preco)}.`,
      )
      .join(' ')

  falar(
    `Cardápio da Padaria Aurora. ${texto}`,
  )
}

function alternarFonte() {
  estado.fonteAmpliada =
    !estado.fonteAmpliada

  document.documentElement
    .classList.toggle(
      'fonte-ampliada',
      estado.fonteAmpliada,
    )

  elementos.alternarFonte
    .classList.toggle(
      'ativo',
      estado.fonteAmpliada,
    )

  elementos.alternarFonte
    .setAttribute(
      'aria-pressed',
      String(
        estado.fonteAmpliada,
      ),
    )

  anunciar(
    estado.fonteAmpliada
      ? 'Texto maior ativado.'
      : 'Texto maior desativado.',
  )
}

function alternarContraste() {
  estado.altoContraste =
    !estado.altoContraste

  document.body.classList
    .toggle(
      'alto-contraste',
      estado.altoContraste,
    )

  elementos.alternarContraste
    .classList.toggle(
      'ativo',
      estado.altoContraste,
    )

  elementos.alternarContraste
    .setAttribute(
      'aria-pressed',
      String(
        estado.altoContraste,
      ),
    )

  anunciar(
    estado.altoContraste
      ? 'Alto contraste ativado.'
      : 'Alto contraste desativado.',
  )
}

elementos.finalizar
  .addEventListener(
    'click',
    finalizarPedido,
  )

elementos.limpar
  .addEventListener(
    'click',
    limparCarrinho,
  )

elementos.abrirCarrinho
  .addEventListener(
    'click',
    rolarParaCarrinho,
  )

elementos.barraMobile
  .addEventListener(
    'click',
    rolarParaCarrinho,
  )

elementos.alternarFonte
  .addEventListener(
    'click',
    alternarFonte,
  )

elementos.alternarContraste
  .addEventListener(
    'click',
    alternarContraste,
  )

elementos.novoPedido
  .addEventListener(
    'click',
    () => {
      elementos.confirmacao.close()

      document
        .getElementById(
          'cardapio',
        )
        .scrollIntoView({
          behavior: 'smooth',
        })
    },
  )

document
  .querySelectorAll(
    '[data-acao="ouvir-cardapio"]',
  )
  .forEach(
    (botao) => {
      botao.addEventListener(
        'click',
        ouvirCardapio,
      )
    },
  )

renderizarDestaques()
renderizarFiltros()
renderizarMenu()
renderizarCarrinho()
