
console.log('Chart disponível?', typeof Chart);

console.log('main.js carregado!');

/* ======= DASHBOARD | DADOS MOCK (INDEPENDENTE DO PDV) ======= */
const DASHBOARD_DATA = {
  faturamentoHoje: 1240,
  pedidosHoje: 18,
  produtosVendidos: 67,
  ticketMedio: 68.9
};


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

/* ===== VENDAS: gerenciar vendas (append) ===== */
(function(){
  const SALES_KEY = 'docesapp_sales_v1';

  // selectors
  const viewVendas = document.getElementById('view-vendas');
  const vendasList = document.getElementById('vendas-list');
  const vendaDetail = document.getElementById('venda-detail');
  const vendaDetailContent = document.getElementById('venda-detail-content');
  const vendaDetailEmpty = document.getElementById('venda-detail-empty');
  const vendaIdEl = document.getElementById('venda-id');
  const vendaDateEl = document.getElementById('venda-date');
  const vendaItemsEl = document.getElementById('venda-items');
  const vendaTotalEl = document.getElementById('venda-total');
  const vendaStatusSelect = document.getElementById('venda-status');
  const btnSaveStatus = document.getElementById('btn-save-status');
  const btnDeleteVenda = document.getElementById('btn-delete-venda');
  const btnRefreshVendas = document.getElementById('btn-refresh-vendas');
  const filterStatus = document.getElementById('filter-status');

  let SALES = []; // will hold parsed sales
  let SELECTED_SALE_ID = null;

  function loadSales() {
    const raw = localStorage.getItem(SALES_KEY);
    SALES = raw ? JSON.parse(raw) : [];
    // ensure each sale has status
    SALES = SALES.map(s => ({ status: 'pendente', ...s }));
    renderSalesList();
  }

  function saveSales() {
    localStorage.setItem(SALES_KEY, JSON.stringify(SALES));
  }

  function money(v){ return (v||0).toLocaleString('pt-BR', { style:'currency', currency:'BRL' }); }

  function renderSalesList() {
    if (!vendasList) return;
    vendasList.innerHTML = '';
    const statusFilter = filterStatus ? filterStatus.value : '';
    const filtered = SALES.filter(s => !statusFilter || s.status === statusFilter).sort((a,b)=> b.created_at.localeCompare(a.created_at));
    if (filtered.length === 0) { vendasList.innerHTML = '<div class="card" style="padding:12px;color:var(--muted)">Nenhuma venda encontrada</div>'; return; }

    filtered.forEach(sale => {
      const div = document.createElement('div');
      div.className = 'venda-card';
      div.dataset.id = sale.id;
      const dt = new Date(sale.created_at);
      const title = sale.items && sale.items.length ? sale.items[0].name : 'Venda';
      const subtitle = `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()} • ${sale.items.length} itens`;
      div.innerHTML = `
        <div class="meta">
          <div class="title">${escapeHtml(title)}</div>
          <div class="subtitle">${escapeHtml(subtitle)}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
          <div style="font-weight:800">${money(sale.total)}</div>
          <div class="venda-badge ${sale.status||'pendente'}">${(sale.status||'pendente').replace('_',' ')}</div>
        </div>
      `;
      div.addEventListener('click', ()=> selectSale(sale.id));
      vendasList.appendChild(div);
    });
  }

  function selectSale(id) {
    SELECTED_SALE_ID = id;
    const sale = SALES.find(s=> s.id === id);
    if (!sale) return;
    vendaDetailEmpty.style.display = 'none';
    vendaDetailContent.style.display = 'block';
    vendaIdEl.textContent = `Pedido ${sale.id}`;
    const dt = new Date(sale.created_at);
    vendaDateEl.textContent = dt.toLocaleString();
    vendaStatusSelect.value = sale.status || 'pendente';

    // items
    vendaItemsEl.innerHTML = '';
    sale.items.forEach(it => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.marginBottom = '8px';
      row.innerHTML = `<div style="min-width:0"><div style="font-weight:700">${escapeHtml(it.name)}</div><div style="font-size:0.85rem;color:var(--muted)">${it.qty} x ${money(it.unit_price)}</div></div><div style="font-weight:800">${money(it.subtotal)}</div>`;
      vendaItemsEl.appendChild(row);
    });

    vendaTotalEl.textContent = money(sale.total);
  }

  // save status
  if (btnSaveStatus) btnSaveStatus.addEventListener('click', ()=>{
    if (!SELECTED_SALE_ID) return showToast('Selecione uma venda', 'error');
    const sale = SALES.find(s=> s.id === SELECTED_SALE_ID);
    if (!sale) return;
    sale.status = vendaStatusSelect.value;
    saveSales();
    renderSalesList();
    showToast('Status atualizado', 'success');
  });

  // delete sale
  if (btnDeleteVenda) btnDeleteVenda.addEventListener('click', ()=>{
    if (!SELECTED_SALE_ID) return showToast('Selecione uma venda', 'error');
    if (!confirm('Deseja excluir esta venda?')) return;
    SALES = SALES.filter(s=> s.id !== SELECTED_SALE_ID);
    saveSales();
    SELECTED_SALE_ID = null;
    vendaDetailEmpty.style.display = 'block';
    vendaDetailContent.style.display = 'none';
    renderSalesList();
    showToast('Venda excluída', 'default');
  });

  // refresh
  if (btnRefreshVendas) btnRefreshVendas.addEventListener('click', ()=> loadSales());
  if (filterStatus) filterStatus.addEventListener('change', ()=> renderSalesList());

  // initialize if view exists
  document.addEventListener('DOMContentLoaded', ()=> {
    // if user navigates to Vendas via setActiveView, show view
    if (typeof setActiveView === 'function') {
      // override setActiveView to show/hide our view automatically
      const original = setActiveView;
      window.setActiveView = function(view){
        original(view);
        if (view === 'vendas') {
          if (viewVendas) viewVendas.style.display = 'block';
          loadSales();
        } else {
          if (viewVendas) viewVendas.style.display = 'none';
        }
      };
    } else {
      // fallback: show vendas view only when present if default
      if (viewVendas) viewVendas.style.display = 'none';
    }
  });

})();

// =========================
// DADOS INICIAIS DO DASHBOARD
// =========================

// Isso depois vamos puxar do backend (Flask + MySQL)

function atualizarDashboard() {
  const vendasHojeEl = document.getElementById("vendas-hoje");
  if (vendasHojeEl && typeof DASHBOARD_DATA.vendasHoje === "number") {
    vendasHojeEl.innerText = `R$ ${DASHBOARD_DATA.vendasHoje.toFixed(2)}`;
  }

  const pedidosPendentesEl = document.getElementById("pedidos-pendentes");
  if (pedidosPendentesEl) {
    pedidosPendentesEl.innerText = DASHBOARD_DATA.pedidosPendentes ?? 0;
  }

  const produtosTotalEl = document.getElementById("produtos-total");
  if (produtosTotalEl) {
    produtosTotalEl.innerText = DASHBOARD_DATA.produtosCadastrados ?? 0;
  }

  const estoqueCriticoEl = document.getElementById("estoque-critico");
  if (estoqueCriticoEl) {
    estoqueCriticoEl.innerText = DASHBOARD_DATA.estoqueCritico ?? 0;
  }

  const totalMesEl = document.getElementById("total-mes");
  if (totalMesEl && typeof DASHBOARD_DATA.totalMes === "number") {
    totalMesEl.innerText = `R$ ${DASHBOARD_DATA.totalMes.toFixed(2)}`;
  }
}

atualizarDashboard();

/* Melhorias: paleta de cores, ferramentas personalizadas e exportação PNG */

(function(){
  //helper para pegar cor CSS definida no :root
  function cssVar(name, fallback){
    const val = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (val && val.trim()) ? val.trim() : (fallback || '#666');
  }

  // Paleta de cores do CSS root
  const color1 = cssVar('--brand-1', '#6b3a3a');
  const color2 = cssVar('--brand-2', '#e87f98');
  const accent1 = cssVar('--accent-1', '#67a3c9');
  const accent2 = cssVar('--accent-2', '#f3cfa8');

  // Formatação de ferramentas
  function currencyTooltip(value){
    if (typeof value === 'number') return value.toLocaleString('pt-BR', { style: 'currency', currency:'BRL'});
    return value;
  }

  // Exportação helper: download PNG charts
  function exportChartPNG(chart, filename){
    if (!chart) { alert('Gráfico não encontrado!'); return; }
    try {
      const link = document.createElement('a');
      link.href = chart.toBase64Image(); // Método Charts.js
      link.download = filename || `chart-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch(err){
      console.error('Erro de Exportação', err);
      alert('Não foi possível exportar a imagem');
    }
  }

  // Exportação Botões
  document.getElementById('export-sales')?.addEventListener('click', ()=> exportChartPNG(salesChart, 'vendas_por_dia.png'));
  document.getElementById('export-top')?.addEventListener('click', ()=> exportChartPNG(topChart, 'top_produtos.png'));
  document.getElementById('export-cat')?.addEventListener('click', ()=> exportChartPNG(catChart, 'participacao_categorias.png'));

  // Opcional: exportação de todos os charts via zip / download sequencial
  document.getElementById('export-all')?.addEventListener('click', ()=>{
    exportChartPNG(salesChart, 'vendas_por_dia.png');
    setTimeout(()=> exportChartPNG(topChart, 'top_produtos.png'), 600);
    setTimeout(()=> exportChartPNG(catChart, 'participacao_categorias.png'), 1200);
  });
  
})();

// DASHBOARD MOCK

let salesChart = null;
let catChart = null;

// Gráfico: Vendas por dia
const canvasSalesByDay = document.getElementById('chart-vendas-dia');

if (canvasSalesByDay && typeof Chart !== 'undefined') {
  salesChart = new Chart(canvasSalesByDay, {
    type: 'line',
    data: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
      datasets: [{
        label: 'Vendas (R$)',
        data: [120, 200, 150, 300, 280, 420, 380],
        borderColor: '#6b3a3a',
        backgroundColor: 'rgba(107, 58, 58, 0.15)',
        tension: 0.35,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

// Gráfico Vendas Por Categoria

const canvasSalesByCategory = document.getElementById('chart-vendas-categoria');

let catchart = null;

if (canvasSalesByCategory) {
  catchart = new Chart(canvasSalesByCategory, {
    type: 'bar',
    data: {
      labels: [
        'Brigadeiros',
        'Ovos de Páscoa',
        'Bolos no Pote',
        'Trufas',
        'Pão de Mel'
      ],
      datasets: [{
        data: [520, 380, 290, 210, 160],
        backgroundColor: [
          '#6b3a3a',
          '#e87f98',
          '#f2b705',
          '#a45ee5',
          '#f28c28'
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

if(catChart) {
  catChart.options.plugins.tooltip = {
    callbacks: {
      label: (item) => {
        const total = catChart.data.datasets[0].data
          .reduce((a, b) => a + b, 0);
        const pct = ((item.raw / total) * 100).toFixed(1);
        return `${item.label}: ${item.raw} (${pct}%)`;
      }
    }
  };

  catChart.update();
}


