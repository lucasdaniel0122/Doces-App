console.log('main.js carregado!');

/* ======= Configurações / constantes ======= */
const SIDEBAR_COLLAPSED_W = '72px';
const SIDEBAR_EXPANDED_W = '220px';
const STORAGE_KEYS = {
    PRODUTOS: 'docesapp_produtos_v1',
    CART: 'docesapp_cart_v1',
    SALES: 'docesapp_sales_v1'
};

/*  ======= Utilitários ======= */
const money = (value) => {
    //formata número para moeda BRL
    return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL' });
};

const debounce = (fn, wait = 250) => {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout (() => fn(...args), wait);
    };
};

const nowISO = () => new Date().toISOString();

/* ======= Mock inicial de produtos (será salvo no localStorage se vazio) ======= */
const defaultProdutos = [
    /*Brigadeiros*/
    { id: 'bgd-001', name: 'Brigadeiro Gourmet Tradicional (un)', sku: 'BRG-001', price: 3.50, unit: 'un', stock: 250 },
    { id: 'bgd-002', name: 'Brigadeiro Belga (un)', sku: 'BRG-002', price: 4.50, unit: 'un', stock: 140 },
    { id: 'bgd-003', name: 'Brigadeiro Ninho (un)', sku: 'BRG-003', price: 4.00, unit: 'un', stock: 130 },
    { id: 'bgd-004', name: 'Brigadeiro de Pistache (un)', sku: 'BRG-004', price: 4.80, unit: 'un', stock: 80 },

    /* Brigadeiros personalizados (temas) */
    { id: 'bgd-t-001', name: 'Brigadeiro Personalizado - Tema Branca de Neve (un)', sku: 'BTP-001', price: 5.50, unit: 'un', stock: '60' },
    { id: 'bgd-t-002', name: 'Brigadeiro Personalizado - Tema Stitch (un)', sku: 'BTP-002', price: 5.50, unit: 'un', stock: 60 },
    { id: 'bgd-t-003', name: 'Brigadeiro Personalizado - Tema Nossa Senhora Aparecida (un)', sku: 'BTP-003', price: 5.50, unit: 'un', stock: 40 },

    /* Ovos de Páscoa */
    { id: 'ovo-001', name: 'Ovo de Páscoa 500g - Chocolate ao Leite', sku: 'OVO-500-AL', price: 85.00, unit: 'un', stock: 10 },
    { id: 'ovo-002', name: 'Ovo de Páscoa 500g - Chocolate Meio Amargo', sku: 'OVO-002-MA', price: 90.00, unit: 'un', stock: 20 },
    { id: 'ovo-003', name: 'Ovo de Páscoa 250g - Colher (recheado)', sku: 'OVO-250-CL', price: 55.00, unit: 'un', stock: 12 },

    /* Ovos de Páscoa recheados variados (sugestões) */
    { id: 'ovo-r-001', name: 'Ovo de Colher - Brigadeiro', sku: 'OVC-BRG', price: 48.00, unit: 'un', stock: 15 },
    { id: 'ovo-r-002', name: ' Ovo de Colher - Doce de Leite', sku: 'OVC-DL', price: 50.00, unit: 'un', stock: 14 },
    { id: 'ovo-r-003', name: ' Ovo de Colher - Leite Ninho com Nutella', sku: 'OVC-NUT', price: 55.00, unit: 'un', stock: 10 },

    /* Chocolates personalizados com mensagem */
    { id: 'choc-msg-001', name: 'Chocolate Personalizado com Mensagem (barra 120g)', sku: 'CHM-120', price: 22.00, unit: 'un', stock: 80 },
    
    /* Buquês e cestas */
    { id: 'buq-001', name: 'Buquê de Chocolates (12 unidades variadas)', sku: 'BUQ-012', price: 90.00, unit: 'un', stock: 5 },
    { id: 'cest-001', name: 'Cesta de Doces Variados (média)', sku: 'CST-MED', price: 120.00, unit: 'un', stock: 5 },

    /* Cones recheados */
    { id: 'cone-001', name: 'Cone Recheado - Brigadeiro (un)', sku: 'CNE-BRG', price: 8.00, unit: 'un', stock: 12 },
    { id: 'cone-002', name: 'Cone Recheado - Leite Ninho com Nutella (un)', sku: 'CNE-NUT', price: 10.00, unit: 'un', stock: 10 },
    { id: 'cone-003', name: 'Cone Recheado - Morango com Chocolate (un)', sku: 'CNE-MRG', price: 8.50, unit: 'un', stock: 5 },

    /* Chocotones recehados (uni e duo minis) */
    { id: 'choc-001', name: 'Chocotone Recheado - Brigadeiro (1kg)', sku: 'CHT-BRG-1', price: 89.90, unit: 'un', stock: 5 },
    { id: 'choc-002', name: 'Chocotone Recheado - Doce de Leite (1kg)', sku: 'CHT-DL-1', price: 89.90, unit: 'un', stock: 5 },
    { id: 'choc-003', name: 'Chocotone Recheado - Leite Ninho com Nutella (1kg)', sku: 'CHT-NUT-1', price: 94.90, unit: 'un', stock: 5 },
    { id: 'choc-004', name: 'Chocotone Recheado - Pistache com Geleia de Morango (1kg)', sku: 'CHT-PIS-1', price: 94.90, unit: 'un', stock: 5 },
    { id: 'choc-005', name: 'Chocotone Recheado - Beijinho (1kg)', sku: 'CHT-BEJ', price: 89.90, unit: 'un', stock: 5 },

    /* Duo minis de chocootne (kit com 2 minis) */
    { id: 'choc-duo-001', name: 'Duo Mini Chocotone - Brigadeiro (300g)', sku: 'CDU-BRG-300', price: 35.00, unit: 'un', stock: 5 },
    { id: 'choc-duo-002', name: 'Duo Mini Chocotone - Doce de Leite (300g)', sku: 'CDU-DL-300', price: 35.00, unit: 'un', stock: 5 },

    /* Cakedonuts e similares */
    { id: 'caked-001', name: 'Cakedonut - Chocolate Recheado (un)', sku: 'CKD-CHC', price: 4.90, unit: 'un', stock: 5 },

    /* Biscoitos decorados */
    { id: 'bisc-001', name: 'Biscoito Decorado (un)', sku: 'BSC-DEC', price: 12.90, unit: 'un', stock: 12 },

    /* Pão de mel */
    { id: 'pmel-001', name: 'Pão de Mel Recheado (2 unidades)', sku: 'PML-001', price: 18.90, unit: 'un', stock: 5 },

    /* Rabanada tradicional e recheada */
    { id: 'rbd-001', name: 'Rabanada Tradicional (3 unidades)', sku: 'RBD-TRD', price: 11.90, unit: 'un', stock: 5 },
    { id: 'rbd-002', name: 'Rabanada Recheada - Brigadeiro', sku: 'RBD-BRG', price: 7.90, unit: 'un', stock: 5 },
    { id: 'rbd-003', name: 'Rabanada Recheada - Doce de Leite', sku: 'RBD-DL', price: 7.90, unit: 'un', stock: 5 },
    { id: 'rbd-004', name: 'Rabanada Recheada - Leite Ninho com Nutella', sku: 'RBD-NUT', price: 7.90, unit: 'un', stock: 5 },
    { id: 'rbd-005', name: 'Rabanada Recheada - Pistache', sku: 'RBD-PIS', price: 7.90, unit: 'un', stock: 5 },
    { id: 'rbd-006', name: 'Rabanada Recheada - Beijinho', sku: 'RBD-BEJ', price: 7.90, unit: 'un', stock: 5 },

    /* Sabores sugeridos/adicionais (variações) */
    { id: 'var-001', name: 'Doce de Leite (versão tradicional) - porção', sku: 'SAB-DL', price: 5.00, unit: 'por', stock: 5 },
    { id: 'var-002', name: 'Pistache - porção', sku: 'SAB-PIS', price: 6.50, unit: 'por', stock: 5 },
    { id: 'var-003', name: 'Beijinho - porção', sku: 'SAB-BEJ', price: 4.00, unit: 'por', stock: 5 },
];

/* ======= Estado em memória ======= */
let PRODUTOS = [];
 let CART = {}; // { productId: { product, qty } }
 let FILTER_TEXT = '';

 /* ======= Seletores (ajustados aos IDs em pt-BR) ======= */
 const el = {
    sidebar: document.querySelector('.sidebar'),
    toggleSidebarBtn: document.getElementById('toggle-sidebar'),
    year: document.getElementById('ano'),
    productsList: document.getElementById('lista-produtos'), // <-- nota
    cartContainer: document.getElementById('cart'),
    totalPrice: document.getElementById('total-price'),
    finalizeBtn: document.getElementById('finalizar-venda'),
    searchInput: document.getElementById('pesquisar'), // <-- nota
    novaVendaBtn: document.getElementById('nova-venda'),
    cadastrarProdBtn: document.getElementById('cadastrar-prod'),
    menuItems: document.querySelectorAll('.menu-item')
 };

 /* ======= Inicialização ======= */
 document.addEventListener('DOMContentLoaded', () => {
    if (el.year) el.year.textContent = new Date().getFullYear();
    loadProdutos();
    loadCart();
    renderProdutos();
    renderCart();
    updateTotal();
    bindEvents();
 });

 /*  ======= Storage: load/save (consistente com STORAGE_KEYS.PRODUTOS) ======= */
 function loadProdutos() {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUTOS);
    if (raw) {
        try {
            PRODUTOS = JSON.parse(raw);
            return;
        } catch (e) {
            console.warn('Erro ao parsear produtos do localStorage, carregando defaults.', e);
        }
    }
    PRODUTOS = defaultProdutos.slice();
    localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(PRODUTOS));
 }

 function loadCart() {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            CART = {};
            Object.entries(parsed).forEach(([pid, item]) => {
                const product = PRODUTOS.find(p => p.id === pid) || item.product;
                CART[pid] = { product, qty: item.qty };
            });
            return;
        }   catch (e) {
            console.warn('Erro ao carregar carrinho do localStorage', e);
        }
    }
    CART = {};
 }

 function saveCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(CART));
 }

 /* ======= Render de produtos (usa lista-produtos) ======= */
function renderProdutos() {
  if (!el.productsList) return;
  el.productsList.innerHTML = '';

  const filtered = PRODUTOS.filter(p => {
    if (!FILTER_TEXT) return true;
    const s = FILTER_TEXT.toLowerCase();
    return p.name.toLowerCase().includes(s) || (p.sku && p.sku.toLowerCase().includes(s));
  });

  if (filtered.length === 0) {
    el.productsList.innerHTML = `<div class="empty">Nenhum produto encontrado.</div>`;
    return;
  }

  filtered.forEach(p => {
    const wrap = document.createElement('div');
    wrap.className = 'product';
    wrap.setAttribute('data-id', p.id);

    wrap.innerHTML = `
      <div class="meta">
        <h4>${escapeHtml(p.name)}</h4>
        <small>SKU: ${escapeHtml(p.sku || '-')} • Estoque: ${p.stock}</small>
      </div>
      <div class="price">${money(p.price)}</div>
      <div>
        <button class="add-btn" title="Adicionar ao carrinho" data-id="${p.id}">Adicionar</button>
      </div>
    `;
    el.productsList.appendChild(wrap);
  });
}

/* ======= Render do carrinho ======= */
function renderCart() {
  if (!el.cartContainer) return;
  el.cartContainer.innerHTML = '';

  const items = Object.values(CART);
  if (items.length === 0) {
    el.cartContainer.innerHTML = `<div class="cart-empty">Carrinho vazio</div>`;
    return;
  }

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div style="flex:1">
        <div style="font-weight:600">${escapeHtml(item.product.name)}</div>
        <small style="color:rgba(0,0,0,0.45)">${escapeHtml(item.product.sku || '')}</small>
      </div>
      <div style="display:flex; gap:8px; align-items:center;">
        <button class="qty-btn" data-action="dec" data-id="${item.product.id}">−</button>
        <div>${item.qty}</div>
        <button class="qty-btn" data-action="inc" data-id="${item.product.id}">+</button>
        <div style="min-width:70px; text-align:right;">${money(item.qty * item.product.price)}</div>
        <button class="remove-btn" data-id="${item.product.id}" title="Remover">✕</button>
      </div>
    `;
    el.cartContainer.appendChild(div);
  });
}

/* ======= Atualizar total ======= */
function updateTotal() {
  const total = Object.values(CART).reduce((acc, it) => acc + (it.product.price * it.qty), 0);
  if (el.totalPrice) el.totalPrice.textContent = money(total);
}

/* ======= Comportamentos: adicionar, alterar qtd, remover ======= */
function addToCart(productId, qty = 1) {
  const product = PRODUTOS.find(p => p.id === productId);
  if (!product) { showToast('Produto não encontrado'); return; }
  if (!CART[productId]) CART[productId] = { product, qty: 0 };
  CART[productId].qty += qty;
  if (CART[productId].qty <= 0) delete CART[productId];
  saveCart();
  renderCart();
  updateTotal();
  showToast(`${product.name} adicionado ao carrinho`);
}

function changeQty(productId, delta) {
  if (!CART[productId]) return;
  CART[productId].qty += delta;
  if (CART[productId].qty <= 0) delete CART[productId];
  saveCart();
  renderCart();
  updateTotal();
}

function removeFromCart(productId) {
  if (CART[productId]) {
    delete CART[productId];
    saveCart();
    renderCart();
    updateTotal();
  }
}

/* ======= Finalizar venda ======= */
function finalizeSale() {
  const items = Object.values(CART);
  if (items.length === 0) {
    showToast('Carrinho vazio', true);
    return;
  }

  const sale = {
    id: 's' + Date.now(),
    created_at: nowISO(),
    items: items.map(it => ({ id: it.product.id, name: it.product.name, sku: it.product.sku, qty: it.qty, unit_price: it.product.price, subtotal: it.qty * it.product.price })),
    total: items.reduce((acc, it) => acc + it.qty * it.product.price, 0)
  };

  const raw = localStorage.getItem(STORAGE_KEYS.SALES);
  const sales = raw ? JSON.parse(raw) : [];
  sales.push(sale);
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));

  sale.items.forEach(si => {
    const prod = PRODUTOS.find(p => p.id === si.id);
    if (prod) prod.stock = Math.max(0, prod.stock - si.qty);
  });
  saveProdutos();

  CART = {};
  saveCart();
  renderCart();
  updateTotal();

  showToast(`Venda registrada • Total: ${money(sale.total)}`);
}

/* ======= Menu / navegação local ======= */
function setActiveView(viewName) {
  document.querySelectorAll('.menu-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });
  const title = document.querySelector('.page-title');
  if (title) title.textContent = viewName.toUpperCase();
}

/* ======= Bind de eventos ======= */
function bindEvents() {
  if (el.toggleSidebarBtn && el.sidebar) {
    el.toggleSidebarBtn.addEventListener('click', () => {
      const collapsed = el.sidebar.getAttribute('data-collapsed') === 'true';
      if (collapsed) {
        el.sidebar.style.width = SIDEBAR_COLLAPSED_W;
        el.sidebar.setAttribute('data-collapsed', 'false');
      } else {
        el.sidebar.style.width = SIDEBAR_EXPANDED_W;
        el.sidebar.setAttribute('data-collapsed', 'true');
      }
    });
  }

  if (el.productsList) {
    el.productsList.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.add-btn');
      if (!btn) return;
      const pid = btn.dataset.id;
      addToCart(pid, 1);
    });
  }

  if (el.cartContainer) {
    el.cartContainer.addEventListener('click', (ev) => {
      const incBtn = ev.target.closest('.qty-btn');
      const removeBtn = ev.target.closest('.remove-btn');
      if (incBtn) {
        const id = incBtn.dataset.id;
        const action = incBtn.dataset.action;
        if (action === 'inc') changeQty(id, +1);
        if (action === 'dec') changeQty(id, -1);
        return;
      }
      if (removeBtn) {
        const id = removeBtn.dataset.id;
        removeFromCart(id);
        return;
      }
    });
  }

  if (el.finalizeBtn) el.finalizeBtn.addEventListener('click', finalizeSale);

  if (el.searchInput) {
    const fn = debounce((ev) => {
      FILTER_TEXT = ev.target.value.trim();
      renderProdutos();
    }, 250);
    el.searchInput.addEventListener('input', fn);
  }

  if (el.novaVendaBtn) el.novaVendaBtn.addEventListener('click', () => {
    if (el.searchInput) el.searchInput.focus();
    showToast('Foque na busca para iniciar uma nova venda');
    setActiveView('pdv');
  });
  if (el.cadastrarProdBtn) el.cadastrarProdBtn.addEventListener('click', () => {
    showToast('Vamos criar a tela de cadastro de produtos em seguida');
    setActiveView('produtos');
  });

  if (el.menuItems) {
    el.menuItems.forEach(btn => {
      btn.addEventListener('click', () => {
        setActiveView(btn.dataset.view);
      });
    });
  }

  document.addEventListener('keydown', (ev) => {
    if (ev.ctrlKey && ev.shiftKey && ev.key.toLowerCase() === 's') {
      ev.preventDefault();
      finalizeSale();
    }
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k') {
      ev.preventDefault();
      if (el.searchInput) el.searchInput.focus();
    }
  });
}

/* ======= Toast simples ======= */
function showToast(message, isError = false, ms = 2400) {
  const t = document.createElement('div');
  t.className = 'doces-toast';
  t.textContent = message;
  t.style.position = 'fixed';
  t.style.right = '18px';
  t.style.bottom = '18px';
  t.style.padding = '10px 14px';
  t.style.background = isError ? 'rgba(224,100,100,0.95)' : 'rgba(139,94,60,0.95)';
  t.style.color = '#fff';
  t.style.borderRadius = '10px';
  t.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
  t.style.zIndex = 9999;
  t.style.opacity = 0;
  t.style.transition = 'opacity 180ms ease, transform 180ms ease';
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    t.style.opacity = 1;
    t.style.transform = 'translateY(-4px)';
  });
  setTimeout(() => {
    t.style.opacity = 0;
    t.style.transform = 'translateY(0)';
    setTimeout(() => t.remove(), 260);
  }, ms);
}

/* ======= Escape HTML simples ======= */
function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str).replace(/[&<>"'`=\/]/g, function (s) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#96;',
      '/': '&#47;',
      '=': '&#61;'
    })[s];
  });
}

// Mini menu do usuário (simples)
(function(){
  const userInfo = document.getElementById('user-info');
  if (!userInfo) return;

  // cria menu (apenas uma vez)
  const menu = document.createElement('div');
  menu.className = 'user-menu card';
  menu.style.position = 'absolute';
  menu.style.right = '16px';
  menu.style.top = '64px';
  menu.style.minWidth = '160px';
  menu.style.display = 'none';
  menu.style.zIndex = 9999;
  menu.innerHTML = `
    <div style="padding:10px; font-weight:700;">Lucas</div>
    <hr style="margin:0;border:none;border-top:1px solid rgba(0,0,0,0.06)" />
    <button class="user-menu-btn" data-action="perfil" style="width:100%;padding:10px;border:none;background:none;text-align:left;cursor:pointer;">Perfil</button>
    <button class="user-menu-btn" data-action="sair" style="width:100%;padding:10px;border:none;background:none;text-align:left;cursor:pointer;">Sair</button>
  `;
  document.body.appendChild(menu);

  const toggleMenu = (show) => menu.style.display = show ? 'block' : 'none';
  const closeMenu = (ev) => {
    if (!menu.contains(ev.target) && !userInfo.contains(ev.target)) toggleMenu(false);
  };

  userInfo.addEventListener('click', (ev) => {
    ev.stopPropagation();
    toggleMenu(menu.style.display !== 'block');
  });

  document.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') toggleMenu(false); });

  // ações dos botões
  menu.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.user-menu-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'perfil') { alert('Abrir perfil (a implementar)'); toggleMenu(false); }
    if (action === 'sair') { alert('Logout (a implementar)'); toggleMenu(false); }
  });
})();