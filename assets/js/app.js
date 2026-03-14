const MENU = [
  {
    id: "tradicionais",
    nome: "Pastéis Tradicionais",
    itens: [
      {
        id: "calabresa-queijo",
        nome: "Calabresa c/ Queijo",
        desc: "Calabresa com queijo mussarela.",
        preco: 9.99,
        esgotado: false,
        imagem: "assets/img/pasteis/calabresa-queijo.jpg"
      },
      {
        id: "frango-queijo",
        nome: "Frango c/ Queijo",
        desc: "Frango temperado com queijo mussarela.",
        preco: 9.99,
        esgotado: false,
        imagem: "assets/img/pasteis/frango-queijo.jpg"
      },
      {
        id: "carne-queijo",
        nome: "Carne c/ Queijo",
        desc: "Carne temperada com queijo mussarela.",
        preco: 9.99,
        esgotado: false,
        imagem: "assets/img/pasteis/carne-queijo.jpg"
      },
      {
        id: "misto",
        nome: "Misto",
        desc: "Presunto e queijo mussarela.",
        preco: 9.99,
        esgotado: false,
        imagem: "assets/img/pasteis/misto.jpg"
      }
    ]
  },
  {
    id: "especiais",
    nome: "Pastéis Especiais",
    itens: [
      {
        id: "frango-cremoso",
        nome: "Frango Cremoso",
        desc: "Tomate, milho, queijo catupiry e queijo mussarela.",
        preco: 12.99,
        esgotado: false,
        imagem: "assets/img/pasteis/frango-cremoso.jpg"
      },
      {
        id: "pizza",
        nome: "Pizza",
        desc: "Presunto, queijo, tomate e orégano.",
        preco: 12.99,
        esgotado: false,
        imagem: "assets/img/pasteis/pizza.jpg"
      },
      {
        id: "moda-da-casa",
        nome: "Moda da Casa",
        desc: "Carne, calabresa, tomate, milho, azeitona e queijo.",
        preco: 12.99,
        esgotado: false,
        imagem: "assets/img/pasteis/moda-da-casa.jpg"
      },
      {
        id: "tres-queijos",
        nome: "Pastel 3 Queijos",
        desc: "Queijo mussarela, queijo catupiry e queijo cheddar.",
        preco: 12.99,
        esgotado: false,
        imagem: "assets/img/pasteis/tres-queijos.jpg"
      }
    ]
  },
  {
    id: "pastelao",
    nome: "Pastelão 30cm",
    itens: [
      {
        id: "pastelao-30cm",
        nome: "Pastelão de 30cm",
        desc: "Calabresa, frango, carne, presunto, queijo mussarela, queijo catupiry, queijo cheddar, tomate, milho, azeitona e orégano.",
        preco: 24.99,
        esgotado: false,
        imagem: "assets/img/pasteis/pastelao-30cm.jpg"
      }
    ]
  },
  {
  id: "bebidas",
  nome: "Bebidas",
  itens: [
    {
      id: "suco-goiaba",
      nome: "Suco de Goiaba 350ml",
      desc: "Suco natural de goiaba.",
      preco: 5.00,
      esgotado: false,
      imagem: "assets/img/bebidas/suco-goiaba.jpg"
    },
    {
      id: "suco-acerola",
      nome: "Suco de Acerola 350ml",
      desc: "Suco natural de acerola.",
      preco: 5.00,
      esgotado: false,
      imagem: "assets/img/bebidas/suco-acerola.jpg"
    },
    {
      id: "coca-cola",
      nome: "Coca-Cola",
      desc: "Refrigerante Coca-Cola gelado.",
      preco: 6.00,
      esgotado: false,
      imagem: "assets/img/bebidas/coca-cola.jpg"
    },
    {
      id: "guarana-tuchaua",
      nome: "Guaraná Tuchaua",
      desc: "Refrigerante Guaraná Tuchaua gelado.",
      preco: 6.00,
      esgotado: false,
      imagem: "assets/img/bebidas/tuchaua.jpg"
    }
  ]
}
];

const WHATSAPP_NUMERO = "5591980614781";
const cart = {};

const categoryChips = document.getElementById("categoryChips");
const menuGrid = document.getElementById("menuGrid");
const cartLines = document.getElementById("cartLines");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const cartBar = document.getElementById("cartBar");
const cartBarText = document.getElementById("cartBarText");
const cartBarTotal = document.getElementById("cartBarTotal");
const warn = document.getElementById("warn");

const btnWhats = document.getElementById("btnWhats");
const btnClear = document.getElementById("btnClear");
const btnOpenCart = document.getElementById("btnOpenCart");

let activeCatId = MENU[0].id;

function formatBRL(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function getAllItems() {
  return MENU.flatMap(secao =>
    secao.itens.map(item => ({
      ...item,
      categoriaId: secao.id,
      categoriaNome: secao.nome
    }))
  );
}

function getItemById(itemId) {
  return getAllItems().find(item => item.id === itemId);
}

function getCartEntries() {
  return Object.entries(cart).map(([itemId, qty]) => {
    const item = getItemById(itemId);
    return {
      ...item,
      qty,
      subtotal: item.preco * qty
    };
  });
}

function getCartCount() {
  return getCartEntries().reduce((acc, item) => acc + item.qty, 0);
}

function getCartTotalValue() {
  return getCartEntries().reduce((acc, item) => acc + item.subtotal, 0);
}

function addItem(itemId) {
  const item = getItemById(itemId);
  if (!item || item.esgotado) return;

  cart[itemId] = (cart[itemId] || 0) + 1;
  renderAll();
}

function removeItem(itemId) {
  if (!cart[itemId]) return;

  cart[itemId]--;
  if (cart[itemId] <= 0) {
    delete cart[itemId];
  }
  renderAll();
}

function setCategory(catId) {
  activeCatId = catId;
  renderAll();
}

function renderChips() {
  categoryChips.innerHTML = MENU.map(secao => `
    <button class="chip ${secao.id === activeCatId ? "active" : ""}" type="button" onclick="setCategory('${secao.id}')">
      ${secao.nome}
    </button>
  `).join("");
}

function renderMenu() {
  const cat = MENU.find(c => c.id === activeCatId) || MENU[0];

  if (!cat || !cat.itens || cat.itens.length === 0) {
    menuGrid.innerHTML = `<p style="color:#666;">Nenhum item encontrado nessa categoria.</p>`;
    return;
  }

  menuGrid.innerHTML = cat.itens.map(item => {
    const qtd = cart[item.id] || 0;

    return `
      <div class="product ${item.esgotado ? "product--disabled" : ""}">
        <div class="product__imageWrap">
          <img
            src="${item.imagem}"
            alt="${item.nome}"
            class="product__image"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="product__imagePlaceholder" style="display:none;">
            <span>📷 Foto do produto</span>
          </div>
        </div>

        <div class="product__body">
          <div class="product__nameRow">
            <div class="product__name">${item.nome}</div>
            ${item.esgotado ? `<span class="badgeEsgotado">Indisponível hoje</span>` : ""}
          </div>

          <div class="product__desc">${item.desc || ""}</div>

          <div class="product__row">
            <div class="product__price">${formatBRL(item.preco)}</div>

            ${
              item.esgotado
                ? `<div class="soldOutText">Esgotado</div>`
                : `
                  <div class="qty">
                    <button class="btnMini" type="button" onclick="removeItem('${item.id}')">−</button>
                    <div class="qty__num">${qtd}</div>
                    <button class="btnMini" type="button" onclick="addItem('${item.id}')">+</button>
                  </div>
                `
            }
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderCart() {
  const entries = getCartEntries();

  if (!entries.length) {
    cartLines.innerHTML = `<div class="emptyCart">Seu carrinho está vazio no momento.</div>`;
  } else {
    cartLines.innerHTML = entries.map(item => `
      <div class="cartLine">
        <div>
          <div class="cartLine__name">${item.nome}</div>
          <div class="cartLine__meta">${item.qty}x • ${formatBRL(item.preco)}</div>
        </div>
        <strong>${formatBRL(item.subtotal)}</strong>
      </div>
    `).join("");
  }

  const total = getCartTotalValue();
  const count = getCartCount();

  cartTotal.textContent = formatBRL(total);
  cartBarTotal.textContent = formatBRL(total);
  cartCount.textContent = count;

  cartBarText.textContent = count > 0
    ? `Ver carrinho (${count} item${count > 1 ? "s" : ""})`
    : "Ver carrinho";

  if (count > 0) {
    cartBar.classList.add("show");
  } else {
    cartBar.classList.remove("show");
  }
}

function renderAll() {
  renderChips();
  renderMenu();
  renderCart();
}

function limparCarrinho() {
  Object.keys(cart).forEach(key => delete cart[key]);
  renderAll();
}

function montarMensagemWhatsApp() {
  warn.textContent = "";

  const nome = document.getElementById("nome").value.trim();
  const tipo = document.getElementById("tipo").value;
  const pagamento = document.getElementById("pagamento").value;
  const endereco = document.getElementById("endereco").value.trim();
  const obs = document.getElementById("obs").value.trim();

  const entries = getCartEntries();

  if (!entries.length) {
    warn.textContent = "Adicione pelo menos 1 item no carrinho.";
    return null;
  }

  if (!nome) {
    warn.textContent = "Informe o seu nome.";
    return null;
  }

  if (tipo === "Entrega" && !endereco) {
    warn.textContent = "Informe o endereço para entrega.";
    return null;
  }

let mensagem = `🥟 *LA CASA DE PASTEL*%0A🧾 Novo pedido recebido:%0A%0A`;

mensagem += `👤 *Nome:* ${encodeURIComponent(nome)}%0A`;
mensagem += `📦 *Tipo:* ${encodeURIComponent(tipo)}%0A`;
mensagem += `💳 *Pagamento:* ${encodeURIComponent(pagamento)}%0A`;

if (tipo === "Entrega") {
  mensagem += `📍 *Endereço:* ${encodeURIComponent(endereco)}%0A`;
}

mensagem += `%0A🍴 *Itens do pedido:*%0A`;

entries.forEach(item => {
  mensagem += `• ${encodeURIComponent(item.qty + "x " + item.nome)} — ${encodeURIComponent(formatBRL(item.subtotal))}%0A`;
});

mensagem += `%0A💰 *Total:* ${encodeURIComponent(formatBRL(getCartTotalValue()))}%0A`;

if (obs) {
  mensagem += `%0A📝 *Observações:* ${encodeURIComponent(obs)}%0A`;
}

return mensagem;
}

function enviarWhatsApp() {
  const mensagem = montarMensagemWhatsApp();
  if (!mensagem) return;

  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`;
  window.open(url, "_blank");
}

btnWhats.addEventListener("click", enviarWhatsApp);
btnClear.addEventListener("click", limparCarrinho);

btnOpenCart.addEventListener("click", () => {
  document.getElementById("cart").scrollIntoView({ behavior: "smooth" });
});

cartBar.addEventListener("click", () => {
  document.getElementById("cart").scrollIntoView({ behavior: "smooth" });
});

renderAll();

window.addItem = addItem;
window.removeItem = removeItem;

window.setCategory = setCategory;

