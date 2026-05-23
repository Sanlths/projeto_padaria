const chat = document.getElementById("chat");
const resumo = document.getElementById("resumo");
const menuContainer = document.getElementById("menu");
const startBtn = document.getElementById("start");
const finalizarBtn = document.getElementById("finalizar");
const clearBtn = document.getElementById("clear");
const resetBtn = document.getElementById("reset");

const cart = [];

const formatarPreco = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const menu = [
  {
    nome: "Pão Francês",
    preco: 2.00,
    descricao: "Crocante por fora e macio por dentro.",
    imagem: "img/paofrances.jpg"
  },
  {
    nome: "Bolo de Cenoura",
    preco: 7.50,
    descricao: "Com cobertura cremosa de chocolate.",
    imagem: "img/bolodecenoura.jpg"
  },
  {
    nome: "Croissant",
    preco: 6.00,
    descricao: "Massa folhada amanteigada e dourada.",
    imagem: "img/croissant.jpg"
  },
  {
    nome: "Sonho com Creme",
    preco: 5.00,
    descricao: "Recheado com creme e finalizado com açúcar.",
    imagem: "img/sonho.jpg"
  },
  {
    nome: "Pão de Queijo",
    preco: 4.00,
    descricao: "Quentinho, macio e cheio de queijo.",
    imagem: "img/pao-queijo.jpg"
  },
  {
    nome: "Torta de Frango",
    preco: 8.50,
    descricao: "Massa leve com recheio cremoso de frango.",
    imagem: "img/torta-frango.jpg"
  },
  {
    nome: "Café com Leite",
    preco: 3.00,
    descricao: "Café fresquinho com leite vaporizado.",
    imagem: "img/cafe-leite.jpg"
  }
];

function addMessage(text, from = "sistema") {
  const p = document.createElement("p");
  p.classList.add(from);
  p.textContent = `${from === "sistema" ? "" : ""} ${text}`;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  const msg = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();

  msg.lang = "pt-BR";
  msg.rate = 1;

  const voice = voices.find((v) => v.lang === "pt-BR");
  if (voice) msg.voice = voice;

  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

function calcularTotal() {
  return cart.reduce((sum, c) => sum + c.item.preco * c.quantidade, 0);
}

function updateCart() {
  resumo.innerHTML = "";

  if (cart.length === 0) {
    resumo.textContent = "Nenhum item ainda.";
    return;
  }

  cart.forEach((c, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("resumo-item");

    const textSpan = document.createElement("span");
    textSpan.textContent = `${c.quantidade}x ${c.item.nome}`;

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.classList.add("excluir-btn");

    btnExcluir.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCart();
    });

    itemDiv.appendChild(textSpan);
    itemDiv.appendChild(btnExcluir);
    resumo.appendChild(itemDiv);
  });

  const totalDiv = document.createElement("div");
  totalDiv.classList.add("total");
  totalDiv.textContent = `Total: ${formatarPreco.format(calcularTotal())}`;
  resumo.appendChild(totalDiv);
}

function finalizarPedido() {
  if (cart.length === 0) {
    const msg = "Você ainda não escolheu nada!";
    addMessage(msg);
    speak(msg);
    return;
  }

  const resumoPedido = cart.map((c) => `${c.quantidade}x ${c.item.nome}`).join(", ");
  const total = formatarPreco.format(calcularTotal());
  const msg = `Pedido enviado: ${resumoPedido}. Total: ${total}. Obrigado!`;

  addMessage(msg);
  speak(msg);

  cart.length = 0;
  updateCart();
}

function handleOption(item, quantidade = 1) {
  addMessage(`${quantidade}x ${item.nome}`, "usuario");

  const index = cart.findIndex((c) => c.item.nome === item.nome);

  if (index > -1) {
    cart[index].quantidade += quantidade;
  } else {
    cart.push({ item, quantidade });
  }

  const msg = `Você escolheu ${quantidade}x ${item.nome}. Deseja mais alguma coisa?`;
  addMessage(msg);
  speak(msg);
  updateCart();
}

function renderMenu() {
  menuContainer.innerHTML = "";

  menu.forEach((item) => {
    const card = document.createElement("article");
    card.classList.add("item-card");

    const imagem = document.createElement("img");
    imagem.src = item.imagem;
    imagem.alt = item.nome;
    imagem.classList.add("item-img");

    const conteudo = document.createElement("div");
    conteudo.classList.add("item-content");

    const title = document.createElement("h3");
    title.textContent = item.nome;

    const descricao = document.createElement("p");
    descricao.textContent = item.descricao;
    descricao.classList.add("item-descricao");

    const preco = document.createElement("strong");
    preco.textContent = formatarPreco.format(item.preco);
    preco.classList.add("item-preco");

    const controls = document.createElement("div");
    controls.classList.add("item-controls");

    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.value = "1";
    input.setAttribute("aria-label", `Quantidade de ${item.nome}`);

    const btn = document.createElement("button");
    btn.textContent = "Adicionar";

    btn.addEventListener("click", () => {
      const qtd = parseInt(input.value, 10);
      if (qtd > 0) handleOption(item, qtd);
    });

    controls.appendChild(input);
    controls.appendChild(btn);

    conteudo.appendChild(title);
    conteudo.appendChild(descricao);
    conteudo.appendChild(preco);
    conteudo.appendChild(controls);

    card.appendChild(imagem);
    card.appendChild(conteudo);

    menuContainer.appendChild(card);
  });
}

startBtn.addEventListener("click", () => {
  const msg = "Olá! Que bom falar com você. Veja nosso cardápio e escolha o que deseja.";
  addMessage(msg);
  speak(msg);
  updateCart();
});

finalizarBtn.addEventListener("click", finalizarPedido);

clearBtn.addEventListener("click", () => {
  cart.length = 0;
  updateCart();
  addMessage("Carrinho limpo.", "sistema");
  speak("Carrinho limpo.");
});

resetBtn.addEventListener("click", () => {
  chat.innerHTML = "";
  cart.length = 0;
  updateCart();

  const msg = "Chat reiniciado. Como posso ajudar você hoje?";
  addMessage(msg);
  speak(msg);
});

renderMenu();
updateCart();
