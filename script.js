const chat = document.getElementById('chat');
const resumo = document.getElementById('resumo');
const menuContainer = document.getElementById('menu');
const cart = [];

const menu = [
  { nome: 'Pães Franceses', preco: 2.00 },
  { nome: 'Bolo de Cenoura', preco: 7.50 },
  { nome: 'Croissants', preco: 6.00 },
  { nome: 'Sonhos com creme', preco: 5.00 },
  { nome: 'Pães de Queijo', preco: 4.00 },
  { nome: 'Torta de Frango', preco: 8.50 },
  { nome: 'Café com Leite', preco: 3.00 }
];

function addMessage(text, from = 'sistema') {
  const p = document.createElement('p');
  p.classList.add(from);
  p.textContent = (from === 'sistema' ? '🟡 ' : '✅ ') + text;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
}

function speak(text) {
  const voices = speechSynthesis.getVoices();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = 'pt-BR';
  if (voices.length) {
    const voice = voices.find(v => v.lang === 'pt-BR');
    if (voice) msg.voice = voice;
  }
  msg.rate = 1;
  speechSynthesis.speak(msg);
}

function updateCart() {
  if (cart.length === 0) {
    resumo.textContent = 'Nenhum item ainda.';
    return;
  }
  renderCartItems();
}

function renderCartItems() {
  resumo.innerHTML = '';
  if (cart.length === 0) {
    resumo.textContent = 'Nenhum item ainda.';
    return;
  }
  cart.forEach((c, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.style.display = 'flex';
    itemDiv.style.justifyContent = 'space-between';
    itemDiv.style.alignItems = 'center';
    itemDiv.style.marginBottom = '8px';
    itemDiv.style.fontSize = '18px';
    const textSpan = document.createElement('span');
    textSpan.textContent = `${c.quantidade}x ${c.item.nome}`;
    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.style.backgroundColor = '#ef4444';
    btnExcluir.style.color = 'white';
    btnExcluir.style.border = 'none';
    btnExcluir.style.borderRadius = '8px';
    btnExcluir.style.padding = '4px 12px';
    btnExcluir.style.cursor = 'pointer';
    btnExcluir.onclick = () => {
      cart.splice(index, 1);
      updateCart();
    };
    btnExcluir.onmouseenter = () => btnExcluir.style.backgroundColor = '#dc2626';
    btnExcluir.onmouseleave = () => btnExcluir.style.backgroundColor = '#ef4444';
    itemDiv.appendChild(textSpan);
    itemDiv.appendChild(btnExcluir);
    resumo.appendChild(itemDiv);
  });
  const total = cart.reduce((sum, c) => sum + c.item.preco * c.quantidade, 0).toFixed(2);
  const totalDiv = document.createElement('div');
  totalDiv.style.fontWeight = '700';
  totalDiv.style.marginTop = '12px';
  totalDiv.textContent = `Total: R$ ${total}`;
  resumo.appendChild(totalDiv);
}

function handleOption(item, quantidade = 1) {
  if (item === 'Finalizar pedido') {
    if (cart.length === 0) {
      const msg = 'Você ainda não escolheu nada!';
      addMessage(msg);
      speak(msg);
      return;
    }
    const resumoPedido = cart.map(c => `${c.quantidade}x ${c.item.nome}`).join(', ');
    const total = cart.reduce((sum, c) => sum + c.item.preco * c.quantidade, 0).toFixed(2);
    const msg = `Pedido enviado: ${resumoPedido}. Total: R$ ${total}. Obrigado, Berta! ❤️`;
    addMessage(msg);
    speak(msg);
    cart.length = 0;
    updateCart();
    return;
  }
  addMessage(`${quantidade}x ${item.nome}`, 'usuario');
  const index = cart.findIndex(c => c.item.nome === item.nome);
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

menu.forEach((item) => {
  const card = document.createElement('div');
  card.classList.add('item-card');
  const title = document.createElement('h3');
  title.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
  const controls = document.createElement('div');
  controls.classList.add('item-controls');
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1';
  input.value = '1';
  const btn = document.createElement('button');
  btn.textContent = 'Adicionar';
  btn.onclick = () => {
    const qtd = parseInt(input.value);
    if (qtd > 0) handleOption(item, qtd);
  };
  controls.appendChild(input);
  controls.appendChild(btn);
  card.appendChild(title);
  card.appendChild(controls);
  menuContainer.appendChild(card);
});

const limparBtn = document.createElement('button');
limparBtn.textContent = 'Limpar Carrinho';
limparBtn.style.marginTop = '10px';
limparBtn.style.backgroundColor = '#555';
limparBtn.style.color = 'white';
limparBtn.style.border = 'none';
limparBtn.style.borderRadius = '8px';
limparBtn.style.padding = '10px 20px';
limparBtn.style.cursor = 'pointer';
limparBtn.onclick = () => {
  cart.length = 0;
  updateCart();
  addMessage('Carrinho limpo.', 'sistema');
  speak('Carrinho limpo.');
};
document.querySelector('.container').appendChild(limparBtn);

document.getElementById('start').addEventListener('click', () => {
  const msg = 'Olá, Berta! Que bom falar com você. Veja nosso cardápio e escolha o que deseja.';
  addMessage(msg);
  speak(msg);
  updateCart();
});
document.getElementById('reset').addEventListener('click', () => {
  chat.innerHTML = '';
  resumo.innerHTML = '';
  cart.length = 0;
  const msg = 'Chat reiniciado. Como posso ajudar você hoje?';
  addMessage(msg);
  speak(msg);
});
