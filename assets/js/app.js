/* S&LIFE Sneakers — front-end (không cần build, chạy trực tiếp trên GitHub Pages). */
(function () {
  "use strict";

  var SHOP = window.SHOP;
  var FIT_NOTES = window.FIT_NOTES || [];
  var RAW = window.PRODUCTS || [];
  var PAGE_SIZE = 24;

  var GENDER_LABEL = { nam: "Nam", nu: "Nữ", gs: "GS", kid: "Kid", unisex: "Unisex" };
  var BRAND_ORDER = ["New Balance", "Asics", "Onitsuka Tiger", "Jordan", "Nike", "Adidas", "Puma", "Salomon", "On", "Vans", "Converse"];
  var PRICE_RANGES = [
    { id: "u2", label: "Dưới 2 triệu", min: 0, max: 1999 },
    { id: "2-3", label: "2 – 3 triệu", min: 2000, max: 2999 },
    { id: "3-4", label: "3 – 4 triệu", min: 3000, max: 3999 },
    { id: "o4", label: "Từ 4 triệu", min: 4000, max: Infinity },
  ];

  /* ---------- Helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
  }
  // Giá trong dữ liệu tính theo nghìn đồng: 2600 -> 2.600.000₫
  function money(k) {
    if (k == null) return "Liên hệ";
    return (k * 1000).toLocaleString("vi-VN") + "₫";
  }
  function sizeNum(s) { return parseFloat(String(s).replace(",", ".")) + (/y$/i.test(s) ? -0.01 : 0); }
  function params() { return new URLSearchParams(location.search); }
  function productUrl(p) { return "product.html?id=" + encodeURIComponent(p.id); }
  function shopUrl(q) { return "shop.html" + (q ? "?" + q : ""); }
  function storage(key, value) {
    try {
      if (value === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { return null; }
  }

  /* ---------- Data ---------- */
  var PRODUCTS = RAW.map(function (p) {
    var sizes = (p.sizes || []).slice().sort(function (a, b) { return sizeNum(a.s) - sizeNum(b.s); });
    var prices = sizes.map(function (s) { return s.p || p.price; }).filter(function (x) { return x; });
    return Object.assign({}, p, {
      sizes: sizes,
      inStock: sizes.length > 0,
      minPrice: prices.length ? Math.min.apply(null, prices) : p.price,
      search: norm([p.name, p.code, p.brand, GENDER_LABEL[p.gender]].join(" ")),
    });
  });
  var BY_ID = {};
  PRODUCTS.forEach(function (p) { BY_ID[p.id] = p; });

  function brandList() {
    var counts = {};
    PRODUCTS.forEach(function (p) { if (p.inStock) counts[p.brand] = (counts[p.brand] || 0) + 1; });
    return Object.keys(counts).sort(function (a, b) {
      var ia = BRAND_ORDER.indexOf(a), ib = BRAND_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    }).map(function (b) { return { name: b, count: counts[b] }; });
  }
  function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function brandFromSlug(s) {
    var hit = brandList().filter(function (b) { return slug(b.name) === s; })[0];
    return hit ? hit.name : null;
  }
  function fitNote(p) {
    for (var i = 0; i < FIT_NOTES.length; i++) if (FIT_NOTES[i].match.test(p.name)) return FIT_NOTES[i];
    return null;
  }

  /* ---------- Placeholder image (khi chưa có ảnh thật) ---------- */
  var COLORS = [
    [/black|triple black|phantom|stealth|core black|noir|đen/, "#1f1f1f"],
    [/navy|indigo|midnight|obsidian|peacoat|dark teal|eclipse/, "#26324f"],
    [/red|cardinal|scarlet|bordeaux|maroon|chicago|siren|đỏ/, "#b3261e"],
    [/pink|rose|mauve|ballet|dragon fruit|lily|hello kitty/, "#e3a3b2"],
    [/purple|plum|grape|lilac/, "#6f4c8f"],
    [/olive|khaki|sage|grass|malachite|green|spruce|mint|teal|cactus|lab green/, "#5d7a4c"],
    [/yellow|sulfur|volt|ochre|curry|gold/, "#e0b43a"],
    [/orange|rust|ginger|peach/, "#df7a3a"],
    [/blue|denim|royal|sky|chambray|paisley/, "#4071b3"],
    [/brown|mocha|chocolate|oak|pecan|desert|relic|coffee|pumpernickel|espresso|hemp|ale/, "#7a5236"],
    [/silver|metallic|chrome|aluminum/, "#c3c6ca"],
    [/grey|gray|cloud|smoke|lunar|castlerock|graphite|cement|rain|magnet|harbor|oyster|shadow|titanium/, "#9d9e9a"],
    [/beige|cream|sail|linen|turtledove|birch|sea salt|oatmeal|ivory|sand|tan|coconut|arid|stone|timberwolf|mushroom|cannoli|clay|greige|oat/, "#e2d7c1"],
    [/white|trắng/, "#f3f2ee"],
  ];
  function colorway(name) {
    var n = norm(name), found = [];
    COLORS.forEach(function (c) {
      var m = n.match(c[0]);
      if (m) found.push({ at: m.index, color: c[1] });
    });
    found.sort(function (a, b) { return a.at - b.at; });
    var main = found[0] ? found[0].color : "#d9d5cc";
    var second = found[1] ? found[1].color : (main === "#f3f2ee" ? "#1f1f1f" : "#f3f2ee");
    return { main: main, second: second, gum: /gum/.test(n) };
  }
  function placeholder(p) {
    var c = colorway(p.name);
    var dark = c.main === "#1f1f1f" || c.main === "#26324f";
    var line = dark ? "#555" : "rgba(0,0,0,.2)";
    var brand = esc(p.brand.toUpperCase());
    var body;
    if (p.cat === "apparel") {
      body =
        '<path d="M150 92 L118 104 L70 150 L100 188 L128 166 L128 318 L272 318 L272 166 L300 188 L330 150 L282 104 L250 92 C242 112 224 122 200 122 C176 122 158 112 150 92 Z" fill="' + c.main + '" stroke="' + line + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M150 92 C158 112 176 122 200 122 C224 122 242 112 250 92" fill="none" stroke="' + c.second + '" stroke-width="7"/>' +
        '<path d="M128 166 L128 318 M272 166 L272 318" stroke="' + c.second + '" stroke-width="5" opacity=".7"/>';
    } else {
      var sole = c.gum ? "#c28a4e" : (c.main === "#f3f2ee" ? "#e6e2d8" : "#f6f5f1");
      body =
        '<ellipse cx="204" cy="296" rx="160" ry="9" fill="rgba(0,0,0,.07)"/>' +
        // tongue
        '<path d="M234 136 C236 118 248 108 262 110 L276 130 Z" fill="' + c.second + '" stroke="' + line + '" stroke-width="2" stroke-linejoin="round"/>' +
        // upper (mũi giày bên trái, gót bên phải)
        '<path d="M60 258 C54 236 64 222 92 214 L150 200 C172 194 188 182 200 168 L236 134 C248 126 262 124 274 130 C290 138 306 142 322 140 C336 138 346 144 350 156 L356 258 Z" fill="' + c.main + '" stroke="' + line + '" stroke-width="2" stroke-linejoin="round"/>' +
        // mũi giày + gót phối màu
        '<path d="M60 258 C54 236 64 222 92 214 L118 208 C112 226 112 244 118 258 Z" fill="' + c.second + '" opacity=".55"/>' +
        '<path d="M326 140 C338 139 346 145 350 156 L356 258 L322 258 C326 220 328 180 326 140 Z" fill="' + c.second + '" opacity=".9"/>' +
        // logo sọc
        '<path d="M122 244 C180 226 246 216 312 222" stroke="' + c.second + '" stroke-width="11" fill="none" stroke-linecap="round"/>' +
        // dây giày
        '<g stroke="' + (dark ? "#888" : "rgba(0,0,0,.35)") + '" stroke-width="3" stroke-linecap="round">' +
        '<line x1="200" y1="176" x2="214" y2="190"/><line x1="212" y1="164" x2="226" y2="178"/><line x1="224" y1="152" x2="238" y2="166"/><line x1="236" y1="141" x2="250" y2="155"/></g>' +
        // đế
        '<path d="M50 254 H360 C366 254 368 262 366 270 C362 282 350 288 338 288 H72 C58 288 46 278 46 266 C46 258 48 254 50 254 Z" fill="' + sole + '" stroke="rgba(0,0,0,.14)" stroke-width="2"/>' +
        '<path d="M52 274 H364" stroke="rgba(0,0,0,.09)" stroke-width="2"/>';
    }
    return (
      '<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(p.name) + '">' +
      '<rect width="400" height="400" fill="#efede8"/>' +
      '<text x="24" y="40" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="700" letter-spacing="3" fill="#a19d93">' + brand + "</text>" +
      body +
      (p.code ? '<text x="24" y="372" font-family="ui-monospace, Menlo, monospace" font-size="13" fill="#a19d93">' + esc(p.code) + "</text>" : "") +
      "</svg>"
    );
  }
  function media(p) {
    return p.image
      ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">'
      : placeholder(p);
  }

  /* ---------- Icons ---------- */
  var I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    bag: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>',
    menu: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1l-2.2 2.23z"/></svg>',
    ms: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.4 2 2 6.1 2 11.7c0 2.9 1.2 5.5 3.2 7.2V22l3-1.6c1.2.3 2.5.5 3.8.5 5.6 0 10-4.1 10-9.7S17.6 2 12 2zm1 12.9l-2.6-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.8-2.7-5.3 5.7z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M2 6h12v10H2zM14 10h4l4 4v2h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 16L16 3l5 5L8 21z"/><path d="M7 12l2 2M10 9l2 2M13 6l2 2"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    filter: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
  };

  /* ---------- Cart ---------- */
  var CART_KEY = "slife_cart_v1";
  var memCart = [];
  function getCart() {
    var c = storage(CART_KEY);
    var list = Array.isArray(c) ? c : memCart;
    return list.filter(function (it) { return BY_ID[it.id]; });
  }
  function setCart(list) { memCart = list; storage(CART_KEY, list); updateCartBadge(); }
  function addToCart(id, size) {
    var list = getCart();
    var exists = list.some(function (it) { return it.id === id && it.size === size; });
    if (!exists) list.push({ id: id, size: size });
    setCart(list);
    return !exists;
  }
  function itemPrice(p, size) {
    var s = p.sizes.filter(function (x) { return x.s === size; })[0];
    return (s && s.p) || p.price;
  }
  function updateCartBadge() {
    var n = getCart().length;
    $all("[data-cart-count]").forEach(function (el) { el.textContent = n; el.hidden = !n; });
  }

  /* ---------- UI bits ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-show"); }, 2600);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    ta.remove();
  }
  function modal(html) {
    var wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.innerHTML = '<div class="modal__box" role="dialog" aria-modal="true">' + html + "</div>";
    function close() { wrap.remove(); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") close(); }
    wrap.addEventListener("click", function (e) { if (e.target === wrap || e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(wrap);
    return { el: wrap, close: close };
  }
  function sendToZalo(message) {
    copyText(message).then(function () {
      var m = modal(
        "<h3>Đã sao chép tin nhắn đặt hàng</h3>" +
        '<p class="muted">Bấm “Mở Zalo”, dán (giữ và chọn Dán) vào khung chat rồi gửi cho shop. Shop sẽ xác nhận size còn hay không, báo tổng tiền và phí ship.</p>' +
        '<div class="order-msg">' + esc(message) + "</div>" +
        '<div class="modal__actions"><button class="btn btn--ghost" data-close>Đóng</button>' +
        '<a class="btn btn--zalo" href="' + SHOP.zalo + '" target="_blank" rel="noopener">Mở Zalo</a></div>' +
        (SHOP.facebook ? '<p style="margin:12px 0 0;font-size:13.5px" class="muted">Hoặc nhắn qua <a href="' + esc(SHOP.facebook) + '" target="_blank" rel="noopener" style="text-decoration:underline">Facebook</a> · gọi <a href="tel:' + SHOP.phone + '" style="text-decoration:underline">' + SHOP.phoneDisplay + "</a></p>" : '<p style="margin:12px 0 0;font-size:13.5px" class="muted">Hoặc gọi <a href="tel:' + SHOP.phone + '" style="text-decoration:underline">' + SHOP.phoneDisplay + "</a></p>")
      );
      m.el.querySelector("a.btn--zalo").addEventListener("click", function () { setTimeout(m.close, 300); });
    });
  }

  function card(p) {
    var tags = [];
    if (!p.inStock) tags.push('<span class="tag tag--muted">Hết hàng</span>');
    else if (p.sizes.length === 1) tags.push('<span class="tag tag--dark">Còn 1 size</span>');
    if (p.sale) tags.push('<span class="tag tag--accent">Xả kho</span>');
    if (p.gender !== "unisex") tags.push('<span class="tag">' + GENDER_LABEL[p.gender] + "</span>");
    var sizes = p.sizes.map(function (s) { return s.s; });
    var sizeText = p.inStock
      ? '<div class="card__sizes">Size: <b>' + esc(sizes.slice(0, 6).join(" · ")) + (sizes.length > 6 ? " +" + (sizes.length - 6) : "") + "</b></div>"
      : '<div class="card__sizes muted">Nhắn shop để order</div>';
    var price = p.inStock
      ? '<div class="card__price">' + (p.minPrice < p.price ? "Từ " : "") + money(p.minPrice) + "</div>"
      : '<div class="card__price is-out">' + (p.price ? money(p.price) : "Tạm hết") + "</div>";
    return (
      '<a class="card' + (p.inStock ? "" : " is-out") + '" href="' + productUrl(p) + '">' +
      '<div class="card__media">' + media(p) + '<div class="card__tags">' + tags.join("") + "</div></div>" +
      '<div class="card__body"><div class="card__brand">' + esc(p.brand) + "</div>" +
      '<div class="card__name">' + esc(p.name) + "</div>" +
      (p.code ? '<div class="card__code">' + esc(p.code) + "</div>" : "") +
      sizeText + price + "</div></a>"
    );
  }

  /* ---------- Header / footer ---------- */
  function renderChrome() {
    var page = document.body.dataset.page;
    var brands = brandList();
    var navBrands = brands.slice(0, 6);
    var current = params().get("brand");
    var headerEl = $("#site-header");
    if (headerEl) {
      headerEl.outerHTML =
        '<div class="topbar"><div class="container">' +
        "<span>✓ Hàng chính hãng, mã khớp tem hộp</span><span>✓ Đồng kiểm trước khi trả tiền</span><span>✓ Đổi size trong " + SHOP.returnDays + " ngày</span>" +
        "</div></div>" +
        '<header class="header"><div class="container header__row">' +
        '<button class="icon-btn menu-toggle" aria-label="Mở menu" data-drawer-open>' + I.menu + "</button>" +
        '<a class="logo" href="index.html" aria-label="' + esc(SHOP.name) + ' — Trang chủ"><b>S&amp;LIFE</b><small>Sneakers</small></a>' +
        '<nav class="nav" aria-label="Thương hiệu">' +
        '<a href="shop.html"' + (page === "shop" && !current ? ' class="is-active"' : "") + ">Tất cả</a>" +
        navBrands.map(function (b) {
          return '<a href="' + shopUrl("brand=" + slug(b.name)) + '"' + (current === slug(b.name) ? ' class="is-active"' : "") + ">" + esc(b.name) + "</a>";
        }).join("") +
        "</nav>" +
        '<form class="header__search" action="shop.html" role="search">' + I.search +
        '<input type="search" name="q" placeholder="Tìm tên hoặc mã, VD: 204L, 1183C102" aria-label="Tìm sản phẩm" value="' + esc(params().get("q") || "") + '"></form>' +
        '<div class="header__actions">' +
        '<a class="hotline" href="tel:' + SHOP.phone + '">Hotline / Zalo<b>' + SHOP.phoneDisplay + "</b></a>" +
        '<a class="icon-btn" href="cart.html" aria-label="Giỏ hàng">' + I.bag + '<span class="badge" data-cart-count hidden>0</span></a>' +
        "</div></div></header>" +
        '<div class="drawer" id="drawer" aria-hidden="true"><div class="drawer__backdrop" data-drawer-close></div>' +
        '<div class="drawer__panel"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
        '<a class="logo" href="index.html"><b>S&amp;LIFE</b><small>Sneakers</small></a>' +
        '<button class="icon-btn" aria-label="Đóng menu" data-drawer-close>' + I.close + "</button></div>" +
        '<form class="drawer__search" action="shop.html" role="search"><input type="search" name="q" placeholder="Tìm tên hoặc mã giày" aria-label="Tìm sản phẩm"></form>' +
        '<div class="drawer__title">Thương hiệu</div><nav>' +
        '<a href="shop.html">Tất cả hàng sẵn <small>' + PRODUCTS.filter(function (p) { return p.inStock; }).length + "</small></a>" +
        brands.map(function (b) { return '<a href="' + shopUrl("brand=" + slug(b.name)) + '">' + esc(b.name) + " <small>" + b.count + "</small></a>"; }).join("") +
        '</nav><div class="drawer__title">Hỗ trợ</div><nav>' +
        '<a href="size-guide.html">Hướng dẫn chọn size</a><a href="policy.html">Chính sách & thanh toán</a><a href="cart.html">Giỏ hàng</a>' +
        '<a href="tel:' + SHOP.phone + '">Gọi ' + SHOP.phoneDisplay + "</a></nav></div></div>";
    }

    var footerEl = $("#site-footer");
    if (footerEl) {
      footerEl.outerHTML =
        '<footer class="footer"><div class="container"><div class="footer__grid">' +
        '<div><a class="logo" href="index.html"><b>S&amp;LIFE</b><small>Sneakers</small></a>' +
        '<p style="margin-top:14px;max-width:320px">' + esc(SHOP.tagline) + ". Mỗi đôi có mã sản phẩm khớp tem hộp, tra trên trang chủ của hãng ra đúng mẫu, đúng màu.</p></div>" +
        "<div><h4>Mua sắm</h4><ul>" +
        brands.slice(0, 7).map(function (b) { return '<li><a href="' + shopUrl("brand=" + slug(b.name)) + '">' + esc(b.name) + "</a></li>"; }).join("") +
        "</ul></div>" +
        '<div><h4>Hỗ trợ</h4><ul><li><a href="size-guide.html">Hướng dẫn chọn size</a></li><li><a href="policy.html#doi-tra">Đổi trả</a></li><li><a href="policy.html#ship">Ship & thanh toán</a></li><li><a href="policy.html#chinh-hang">Cam kết chính hãng</a></li><li><a href="policy.html#dat-hang">Cách đặt hàng</a></li></ul></div>' +
        "<div><h4>Liên hệ</h4><ul>" +
        "<li>" + esc(SHOP.owner) + ': <a href="tel:' + SHOP.phone + '">' + SHOP.phoneDisplay + "</a></li>" +
        '<li><a href="' + SHOP.zalo + '" target="_blank" rel="noopener">Zalo: ' + SHOP.phoneDisplay + "</a></li>" +
        (SHOP.facebook ? '<li><a href="' + esc(SHOP.facebook) + '" target="_blank" rel="noopener">Facebook: ' + esc(SHOP.facebookName) + "</a></li>" : "<li>Facebook: " + esc(SHOP.facebookName) + "</li>") +
        '<li><a href="' + SHOP.instagram + '" target="_blank" rel="noopener">Instagram: @s.life_sneakers</a></li>' +
        '<li><a href="' + SHOP.tiktok + '" target="_blank" rel="noopener">TikTok: @slifesneaker</a></li>' +
        "</ul></div></div>" +
        '<div class="footer__bottom"><span>© ' + new Date().getFullYear() + " " + esc(SHOP.name) + "</span><span>Giá và tồn kho có thể thay đổi trong ngày — nhắn shop xác nhận size trước khi chuyển khoản.</span></div>" +
        "</div></footer>" +
        '<div class="float-contact">' +
        (SHOP.facebook ? '<a class="fc-ms" href="' + esc(SHOP.facebook) + '" target="_blank" rel="noopener" aria-label="Nhắn Facebook">' + I.ms + "</a>" : "") +
        '<a class="fc-zalo" href="' + SHOP.zalo + '" target="_blank" rel="noopener" aria-label="Chat Zalo">Zalo</a>' +
        '<a class="fc-phone" href="tel:' + SHOP.phone + '" aria-label="Gọi shop">' + I.phone + "</a></div>";
    }

    var drawer = $("#drawer");
    function toggleDrawer(open) {
      if (!drawer) return;
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.style.overflow = open ? "hidden" : "";
    }
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-drawer-open]")) toggleDrawer(true);
      if (e.target.closest("[data-drawer-close]")) toggleDrawer(false);
    });
    updateCartBadge();
  }

  /* ---------- Home ---------- */
  function initHome() {
    var inStock = PRODUCTS.filter(function (p) { return p.inStock; });
    var brands = brandList();
    setText("[data-stat-products]", inStock.length);
    setText("[data-stat-brands]", brands.length);

    // Ảnh hero: 4 mẫu nổi bật từ 4 hãng khác nhau
    var hero = $("[data-hero-tiles]");
    if (hero) {
      var picks = [];
      ["New Balance", "Onitsuka Tiger", "Jordan", "Adidas"].forEach(function (b) {
        var p = inStock.filter(function (x) { return x.brand === b; }).sort(function (a, c) { return c.sizes.length - a.sizes.length; })[0];
        if (p) picks.push(p);
      });
      hero.innerHTML = picks.map(function (p) {
        return '<a class="hero__tile" href="' + productUrl(p) + '"><div class="thumb">' + media(p) + "</div><span>" + esc(p.brand) + "</span></a>";
      }).join("");
    }

    var brandEl = $("[data-brands]");
    if (brandEl) {
      brandEl.innerHTML = brands.map(function (b) {
        return '<a class="brand-tile" href="' + shopUrl("brand=" + slug(b.name)) + '"><b>' + esc(b.name) + "</b><span>" + b.count + " mẫu còn size →</span></a>";
      }).join("");
    }

    // Bộ sưu tập theo hãng, có chip chuyển tab
    var tabsEl = $("[data-home-tabs]"), gridEl = $("[data-home-grid]"), moreEl = $("[data-home-more]");
    if (tabsEl && gridEl) {
      var tabBrands = brands.slice(0, 7).map(function (b) { return b.name; });
      var active = tabBrands[0];
      var draw = function () {
        tabsEl.innerHTML = tabBrands.map(function (b) {
          return '<button class="chip' + (b === active ? " is-active" : "") + '" data-tab="' + esc(b) + '">' + esc(b) + "</button>";
        }).join("");
        var list = inStock.filter(function (p) { return p.brand === active; })
          .sort(function (a, c) { return c.sizes.length - a.sizes.length; }).slice(0, 10);
        gridEl.innerHTML = list.map(card).join("");
        if (moreEl) moreEl.href = shopUrl("brand=" + slug(active));
      };
      tabsEl.addEventListener("click", function (e) {
        var b = e.target.closest("[data-tab]");
        if (b) { active = b.dataset.tab; draw(); }
      });
      draw();
    }

    var dealsEl = $("[data-deals]");
    if (dealsEl) {
      var deals = inStock.filter(function (p) { return p.cat !== "apparel" && p.minPrice && p.minPrice < 2000; })
        .sort(function (a, c) { return a.minPrice - c.minPrice; }).slice(0, 10);
      dealsEl.innerHTML = deals.map(card).join("");
    }

    var fullEl = $("[data-full-size]");
    if (fullEl) {
      var full = inStock.filter(function (p) { return p.cat !== "apparel"; }).sort(function (a, c) { return c.sizes.length - a.sizes.length; }).slice(0, 10);
      fullEl.innerHTML = full.map(card).join("");
    }
  }
  function setText(sel, v) { $all(sel).forEach(function (el) { el.textContent = v; }); }

  /* ---------- Shop listing ---------- */
  function initShop() {
    var p = params();
    var state = {
      q: p.get("q") || "",
      brands: (p.get("brand") || "").split(",").map(brandFromSlug).filter(Boolean),
      sizes: (p.get("size") || "").split(",").filter(Boolean),
      genders: (p.get("gender") || "").split(",").filter(Boolean),
      cat: p.get("cat") || "",
      price: p.get("price") || "",
      sort: p.get("sort") || "default",
      showOut: p.get("all") === "1",
      limit: PAGE_SIZE,
    };

    var allSizes = {};
    PRODUCTS.forEach(function (x) { x.sizes.forEach(function (s) { allSizes[s.s] = 1; }); });
    var sizeKeys = Object.keys(allSizes).sort(function (a, b) { return sizeNum(a) - sizeNum(b); });
    var brands = brandList();
    var hasApparel = PRODUCTS.some(function (x) { return x.cat === "apparel"; });

    var filtersEl = $("[data-filters]");
    filtersEl.innerHTML =
      '<div class="filters__head"><h2>Bộ lọc</h2><button class="icon-btn" data-filters-close aria-label="Đóng bộ lọc">' + I.close + "</button></div>" +
      '<div class="filter"><h3>Thương hiệu</h3>' +
      brands.map(function (b) {
        return '<label class="check"><input type="checkbox" name="brand" value="' + esc(b.name) + '"> ' + esc(b.name) + " <small>" + b.count + "</small></label>";
      }).join("") + "</div>" +
      (hasApparel ? '<div class="filter"><h3>Loại</h3>' +
        [["", "Tất cả"], ["shoes", "Giày"], ["apparel", "Quần áo"]].map(function (c) {
          return '<label class="check"><input type="radio" name="cat" value="' + c[0] + '"> ' + c[1] + "</label>";
        }).join("") + "</div>" : "") +
      '<div class="filter"><h3>Size (EU)</h3><div class="size-grid">' +
      sizeKeys.map(function (s) { return '<button type="button" class="size-btn" data-size="' + esc(s) + '">' + esc(s) + "</button>"; }).join("") +
      '</div><p class="muted" style="font-size:12.5px;margin:10px 0 0">40Y: size 40 bản GS (trẻ em lớn).</p></div>' +
      '<div class="filter"><h3>Khoảng giá</h3>' +
      PRICE_RANGES.map(function (r) { return '<label class="check"><input type="radio" name="price" value="' + r.id + '"> ' + r.label + "</label>"; }).join("") +
      '<label class="check"><input type="radio" name="price" value=""> Tất cả</label></div>' +
      '<div class="filter"><h3>Dành cho</h3>' +
      ["nam", "nu", "gs", "kid"].map(function (g) { return '<label class="check"><input type="checkbox" name="gender" value="' + g + '"> Code ' + GENDER_LABEL[g] + "</label>"; }).join("") +
      '<p class="muted" style="font-size:12.5px;margin:8px 0 0">Mẫu không ghi code là unisex / size nam.</p></div>' +
      '<div class="filter"><label class="check"><input type="checkbox" name="showOut"> Hiện cả mẫu đã hết size</label></div>' +
      '<div class="filters__apply"><button class="btn btn--block" data-filters-close>Xem kết quả</button></div>';

    var gridEl = $("[data-grid]"), countEl = $("[data-count]"), moreEl = $("[data-more]"),
      activeEl = $("[data-active]"), sortEl = $("[data-sort]"), titleEl = $("[data-title]"), crumbEl = $("[data-crumb]");
    sortEl.value = state.sort;

    function syncInputs() {
      $all('input[name="brand"]', filtersEl).forEach(function (i) { i.checked = state.brands.indexOf(i.value) >= 0; });
      $all('input[name="gender"]', filtersEl).forEach(function (i) { i.checked = state.genders.indexOf(i.value) >= 0; });
      $all('input[name="price"]', filtersEl).forEach(function (i) { i.checked = i.value === state.price; });
      $all('input[name="cat"]', filtersEl).forEach(function (i) { i.checked = i.value === state.cat; });
      $all("[data-size]", filtersEl).forEach(function (b) { b.classList.toggle("is-active", state.sizes.indexOf(b.dataset.size) >= 0); });
      $('input[name="showOut"]', filtersEl).checked = state.showOut;
    }

    function writeUrl() {
      var u = new URLSearchParams();
      if (state.q) u.set("q", state.q);
      if (state.brands.length) u.set("brand", state.brands.map(slug).join(","));
      if (state.sizes.length) u.set("size", state.sizes.join(","));
      if (state.genders.length) u.set("gender", state.genders.join(","));
      if (state.price) u.set("price", state.price);
      if (state.cat) u.set("cat", state.cat);
      if (state.sort !== "default") u.set("sort", state.sort);
      if (state.showOut) u.set("all", "1");
      var qs = u.toString();
      history.replaceState(null, "", "shop.html" + (qs ? "?" + qs : ""));
    }

    function filtered() {
      var words = norm(state.q).split(/\s+/).filter(Boolean);
      var range = PRICE_RANGES.filter(function (r) { return r.id === state.price; })[0];
      var list = PRODUCTS.filter(function (x) {
        if (!state.showOut && !x.inStock) return false;
        if (state.brands.length && state.brands.indexOf(x.brand) < 0) return false;
        if (state.genders.length && state.genders.indexOf(x.gender) < 0) return false;
        if (state.cat && x.cat !== state.cat) return false;
        if (state.sizes.length && !x.sizes.some(function (s) { return state.sizes.indexOf(s.s) >= 0; })) return false;
        if (range && !(x.minPrice >= range.min && x.minPrice <= range.max)) return false;
        for (var i = 0; i < words.length; i++) if (x.search.indexOf(words[i]) < 0) return false;
        return true;
      });
      var cmp = {
        "price-asc": function (a, b) { return (a.minPrice || 1e9) - (b.minPrice || 1e9); },
        "price-desc": function (a, b) { return (b.minPrice || 0) - (a.minPrice || 0); },
        "sizes": function (a, b) { return b.sizes.length - a.sizes.length; },
        "name": function (a, b) { return a.name.localeCompare(b.name); },
      }[state.sort];
      list.sort(function (a, b) {
        if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
        return cmp ? cmp(a, b) : a.order - b.order;
      });
      return list;
    }

    function render() {
      var list = filtered();
      var title = state.brands.length === 1 ? state.brands[0] : state.q ? 'Kết quả cho “' + state.q + '”' : "Tất cả hàng sẵn";
      titleEl.textContent = title;
      crumbEl.textContent = state.brands.length === 1 ? state.brands[0] : "Hàng sẵn";
      document.title = title + " — " + SHOP.name;
      countEl.textContent = list.length + " mẫu";
      gridEl.innerHTML = list.length
        ? list.slice(0, state.limit).map(card).join("")
        : '<div class="empty" style="grid-column:1/-1"><h3>Chưa có mẫu phù hợp</h3><p class="muted">Thử bỏ bớt bộ lọc, hoặc nhắn shop mẫu bạn cần — shop nhận order theo yêu cầu.</p><a class="btn btn--zalo" href="' + SHOP.zalo + '" target="_blank" rel="noopener">Nhắn Zalo cho shop</a></div>';
      moreEl.hidden = list.length <= state.limit;
      moreEl.querySelector("button").textContent = "Xem thêm " + Math.min(PAGE_SIZE, list.length - state.limit) + " mẫu";

      var chips = [];
      if (state.q) chips.push(["q", "", "“" + state.q + "”"]);
      state.brands.forEach(function (b) { chips.push(["brand", b, b]); });
      state.sizes.forEach(function (s) { chips.push(["size", s, "Size " + s]); });
      state.genders.forEach(function (g) { chips.push(["gender", g, "Code " + GENDER_LABEL[g]]); });
      if (state.cat) chips.push(["cat", "", state.cat === "apparel" ? "Quần áo" : "Giày"]);
      if (state.price) chips.push(["price", "", PRICE_RANGES.filter(function (r) { return r.id === state.price; })[0].label]);
      activeEl.innerHTML = chips.map(function (c) {
        return '<button data-remove="' + c[0] + '" data-value="' + esc(c[1]) + '">' + esc(c[2]) + "</button>";
      }).join("") + (chips.length > 1 ? '<button data-remove="all">Xoá tất cả</button>' : "");
      activeEl.hidden = !chips.length;

      var filterCount = state.brands.length + state.sizes.length + state.genders.length + (state.price ? 1 : 0) + (state.cat ? 1 : 0);
      $("[data-filter-count]").textContent = filterCount ? "(" + filterCount + ")" : "";
      writeUrl();
    }

    function toggle(arr, v) { var i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); }

    filtersEl.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "brand") toggle(state.brands, t.value);
      if (t.name === "gender") toggle(state.genders, t.value);
      if (t.name === "price") state.price = t.value;
      if (t.name === "cat") state.cat = t.value;
      if (t.name === "showOut") state.showOut = t.checked;
      state.limit = PAGE_SIZE;
      render();
    });
    filtersEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-size]");
      if (b) { toggle(state.sizes, b.dataset.size); b.classList.toggle("is-active"); state.limit = PAGE_SIZE; render(); }
      if (e.target.closest("[data-filters-close]")) filtersEl.classList.remove("is-open");
    });
    $("[data-filters-open]").addEventListener("click", function () { filtersEl.classList.add("is-open"); });
    sortEl.addEventListener("change", function () { state.sort = sortEl.value; render(); });
    moreEl.addEventListener("click", function () { state.limit += PAGE_SIZE; render(); });
    activeEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-remove]");
      if (!b) return;
      var k = b.dataset.remove, v = b.dataset.value;
      if (k === "all") { state.q = ""; state.brands = []; state.sizes = []; state.genders = []; state.price = ""; state.cat = ""; }
      if (k === "q") state.q = "";
      if (k === "brand") toggle(state.brands, v);
      if (k === "size") toggle(state.sizes, v);
      if (k === "gender") toggle(state.genders, v);
      if (k === "price") state.price = "";
      if (k === "cat") state.cat = "";
      $all('input[name="q"]').forEach(function (i) { i.value = state.q; });
      syncInputs(); render();
    });

    syncInputs();
    render();
  }

  /* ---------- Product detail ---------- */
  function initProduct() {
    var root = $("[data-product]");
    var p = BY_ID[params().get("id")];
    if (!p) {
      root.innerHTML = '<div class="empty" style="margin:40px 0"><h2>Không tìm thấy sản phẩm</h2><p class="muted">Mẫu này có thể vừa được cập nhật. Xem các mẫu đang còn hàng nhé.</p><a class="btn" href="shop.html">Xem hàng sẵn</a></div>';
      return;
    }
    document.title = p.name + (p.code ? " " + p.code : "") + " — " + SHOP.name;
    var fit = fitNote(p);
    var selected = p.sizes.length === 1 ? p.sizes[0].s : null;

    root.innerHTML =
      '<div class="breadcrumb"><a href="index.html">Trang chủ</a> / <a href="' + shopUrl("brand=" + slug(p.brand)) + '">' + esc(p.brand) + "</a> / " + esc(p.name) + "</div>" +
      '<div class="pd"><div class="pd__media">' + media(p) + "</div>" +
      "<div>" +
      '<div class="pd__brand">' + esc(p.brand) + (p.gender !== "unisex" ? " · Code " + GENDER_LABEL[p.gender] : "") + "</div>" +
      "<h1>" + esc(p.name) + "</h1>" +
      (p.code ? '<div class="pd__code">Mã: <code>' + esc(p.code) + '</code><button type="button" data-copy-code>Sao chép</button></div>' : "") +
      '<div class="pd__price" data-price>' + money(p.price) + "</div>" +
      '<div class="pd__status' + (p.inStock ? "" : " is-out") + '">' +
      (p.inStock ? "● Hàng sẵn — còn " + p.sizes.length + " size" : "● Tạm hết size — nhắn shop để order") + "</div>" +
      (p.note ? '<div class="pd__note"><b>Ghi chú của shop:</b> ' + esc(p.note) + "</div>" : "") +
      (p.inStock
        ? '<div class="pd__block"><div class="pd__label"><span>Chọn size' + (p.cat === "apparel" ? "" : " (EU)") + '</span><a href="size-guide.html">Hướng dẫn đo chân</a></div>' +
          '<div class="pd__sizes">' +
          p.sizes.map(function (s) {
            var extra = s.p && s.p !== p.price ? money(s.p).replace(".000₫", "k") : s.n ? "Lưu ý" : "";
            return '<button type="button" data-size="' + esc(s.s) + '" title="' + esc(s.n || "") + '">' + esc(s.s) + (extra ? "<small>" + esc(extra) + "</small>" : "") + "</button>";
          }).join("") +
          '</div><p class="muted" style="font-size:13px;margin:8px 0 0" data-size-note>Size không có trong danh sách là đã hết — nhắn shop để order.</p></div>'
        : "") +
      (fit ? '<div class="fit-note">' + I.ruler + "<div><b>Form " + esc(fit.line) + "</b>" + esc(fit.advice) + "</div></div>" : "") +
      '<div class="pd__block field"><label for="foot">Chiều dài bàn chân (cm) — không bắt buộc</label>' +
      '<input id="foot" type="text" inputmode="decimal" placeholder="VD: 25" autocomplete="off"><span class="hint">Shop kiểm tra lại giúp cho chắc size trước khi gửi.</span></div>' +
      '<div class="pd__actions">' +
      '<button class="btn btn--ghost" data-add' + (p.inStock ? "" : " disabled") + ">Thêm vào giỏ</button>" +
      '<button class="btn btn--zalo" data-order>' + (p.inStock ? "Đặt nhanh qua Zalo" : "Hỏi shop qua Zalo") + "</button></div>" +
      '<div class="pd__perks">' +
      "<div>" + I.shield + "<span><b>Chính hãng.</b> Mã sản phẩm khớp tem hộp, tra trên trang chủ hãng ra đúng mẫu, đúng màu.</span></div>" +
      "<div>" + I.box + "<span><b>Đồng kiểm.</b> Mở hộp kiểm tra trước khi trả tiền. Shop gửi ảnh chụp thật trước khi đóng gói.</span></div>" +
      "<div>" + I.swap + "<span><b>Đổi trả " + SHOP.returnDays + " ngày.</b> Giữ nguyên hộp, tem, chưa đi ngoài trời. Sai size do shop tư vấn, shop chịu phí đổi.</span></div>" +
      "<div>" + I.truck + "<span><b>Ship toàn quốc.</b> Nội thành HN/HCM có ship nhanh Grab, Be. COD cọc " + SHOP.depositPercent + "%.</span></div>" +
      "</div>" +
      '<div class="tabs">' +
      "<details><summary>Cách đặt hàng</summary><div class=\"tab-body\"><ol style=\"padding-left:18px;margin:0\"><li>Chọn size, bấm <b>Đặt nhanh qua Zalo</b> — tin nhắn có sẵn mã, size được sao chép.</li><li>Dán vào Zalo gửi shop, kèm tên, số điện thoại, địa chỉ nhận hàng.</li><li>Shop xác nhận còn hàng, báo tổng tiền và phí ship, gửi ảnh thật trước khi đóng gói.</li></ol></div></details>" +
      '<details><summary>Ship & thanh toán</summary><div class="tab-body">Nội thành Hà Nội / TP.HCM: ship nhanh Grab, Be (chuyển khoản trước 100%) hoặc SPX Express, Viettel Post. Tỉnh khác: SPX Express, Viettel Post. COD: cọc ' + SHOP.depositPercent + '% giá bán, phần còn lại thu khi nhận hàng. <a href="policy.html#ship" style="text-decoration:underline">Xem chi tiết</a></div></details>' +
      "</div></div></div>";

    var priceEl = $("[data-price]", root);
    function showPrice() {
      var s = p.sizes.filter(function (x) { return x.s === selected; })[0];
      var price = (s && s.p) || p.price;
      priceEl.innerHTML = money(price) + (s && s.p && s.p !== p.price ? "<small>giá riêng size " + esc(s.s) + "</small>" : "");
      var noteEl = $("[data-size-note]", root);
      if (noteEl && s && s.n) noteEl.textContent = "Size " + s.s + ": " + s.n;
    }
    function markSize() {
      $all("[data-size]", root).forEach(function (b) { b.classList.toggle("is-active", b.dataset.size === selected); });
      showPrice();
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-size]");
      if (b) { selected = b.dataset.size; markSize(); }
      if (e.target.closest("[data-copy-code]")) copyText(p.code).then(function () { toast("Đã sao chép mã " + p.code); });
      if (e.target.closest("[data-add]")) {
        if (!selected) { toast("Bạn chọn size trước nhé"); return; }
        var added = addToCart(p.id, selected);
        toast(added ? "Đã thêm size " + selected + " vào giỏ" : "Size " + selected + " đã có trong giỏ");
      }
      if (e.target.closest("[data-order]")) {
        if (p.inStock && !selected) { toast("Bạn chọn size trước nhé"); return; }
        var foot = ($("#foot").value || "").trim();
        var line = "Mã: " + (p.code || p.name) + " / Size: " + (selected || "…") + " / Chân dài: " + (foot ? foot.replace(/\s*cm$/i, "") + " cm" : "… cm");
        var msg = "Chào shop, mình muốn đặt đôi này:\n" + p.name + "\n" + line + "\n" +
          (selected ? "Giá: " + money(itemPrice(p, selected)) + "\n" : "") +
          "\nTên:\nSĐT:\nĐịa chỉ nhận hàng:";
        sendToZalo(msg);
      }
    });
    markSize();

    var relEl = $("[data-related]");
    if (relEl) {
      var base = p.name.split(" ").slice(0, 3).join(" ");
      var related = PRODUCTS.filter(function (x) { return x.inStock && x.id !== p.id && x.brand === p.brand; })
        .sort(function (a, b) { return (b.name.indexOf(base) === 0) - (a.name.indexOf(base) === 0) || b.sizes.length - a.sizes.length; })
        .slice(0, 5);
      relEl.innerHTML = related.map(card).join("");
      $("[data-related-more]").href = shopUrl("brand=" + slug(p.brand));
    }
  }

  /* ---------- Cart ---------- */
  function initCart() {
    var listEl = $("[data-cart-list]"), sumEl = $("[data-cart-summary]");
    var saved = storage("slife_customer") || {};

    function render() {
      var cart = getCart();
      if (!cart.length) {
        listEl.innerHTML = '<div class="empty"><h3>Giỏ hàng đang trống</h3><p class="muted">Chọn vài đôi ưng ý rồi quay lại đây để gửi đơn cho shop.</p><a class="btn" href="shop.html">Xem hàng sẵn</a></div>';
        sumEl.hidden = true;
        return;
      }
      sumEl.hidden = false;
      var total = 0;
      listEl.innerHTML = cart.map(function (it, i) {
        var p = BY_ID[it.id], price = itemPrice(p, it.size);
        var stillThere = p.sizes.some(function (s) { return s.s === it.size; });
        total += price || 0;
        return '<div class="cart-item"><a class="cart-item__img" href="' + productUrl(p) + '">' + media(p) + "</a>" +
          '<div><a class="cart-item__name" href="' + productUrl(p) + '">' + esc(p.name) + "</a>" +
          '<div class="cart-item__meta">' + esc(p.code) + " · Size " + esc(it.size) + "</div>" +
          (stillThere ? "" : '<div class="cart-item__meta" style="color:var(--accent)">Size này vừa hết trong bảng hàng — nhắn shop kiểm tra.</div>') +
          '</div><div class="cart-item__side"><div class="cart-item__price">' + money(price) + "</div>" +
          '<button class="cart-item__remove" data-remove="' + i + '">Xoá</button></div></div>';
      }).join("");
      $("[data-count]", sumEl).textContent = cart.length + " đôi";
      $("[data-subtotal]", sumEl).textContent = money(total);
      $("[data-deposit]", sumEl).textContent = money(Math.round(total * SHOP.depositPercent / 100));
      $("[data-total]", sumEl).textContent = money(total);
    }

    listEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-remove]");
      if (!b) return;
      var cart = getCart();
      cart.splice(+b.dataset.remove, 1);
      setCart(cart);
      render();
    });

    var form = $("[data-order-form]");
    ["name", "phone", "address", "foot"].forEach(function (k) { if (saved[k] && form[k]) form[k].value = saved[k]; });
    $("[data-bank]").innerHTML = esc(SHOP.bank.name) + " · STK <b>" + esc(SHOP.bank.number) + "</b> · " + esc(SHOP.bank.holder);
    $("[data-deposit-pct]").textContent = SHOP.depositPercent + "%";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form;
      var data = { name: f.name.value.trim(), phone: f.phone.value.trim(), address: f.address.value.trim(), foot: f.foot.value.trim() };
      if (!data.name || !data.phone || !data.address) { toast("Bạn điền giúp tên, số điện thoại và địa chỉ nhé"); return; }
      if (!/^[0-9 +.]{9,14}$/.test(data.phone)) { toast("Số điện thoại chưa đúng"); f.phone.focus(); return; }
      storage("slife_customer", data);
      var cart = getCart(), total = 0;
      var lines = cart.map(function (it, i) {
        var p = BY_ID[it.id], price = itemPrice(p, it.size);
        total += price || 0;
        return (i + 1) + ") Mã: " + (p.code || "—") + " / Size: " + it.size + " / " + p.name + " — " + money(price);
      });
      var pay = f.payment.value === "bank" ? "Chuyển khoản 100%" : "COD, cọc " + SHOP.depositPercent + "%";
      var msg = "Chào shop, mình muốn đặt đơn:\n" + lines.join("\n") +
        "\nTạm tính: " + money(total) +
        "\n\nChân dài: " + (data.foot ? data.foot.replace(/\s*cm$/i, "") + " cm" : "…") +
        "\nTên: " + data.name + "\nSĐT: " + data.phone + "\nĐịa chỉ: " + data.address +
        "\nThanh toán: " + pay + (f.note.value.trim() ? "\nGhi chú: " + f.note.value.trim() : "");
      sendToZalo(msg);
    });
    render();
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderChrome();
    var page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "shop") initShop();
    if (page === "product") initProduct();
    if (page === "cart") initCart();
    $all("[data-shop]").forEach(function (el) {
      var v = SHOP[el.dataset.shop];
      if (el.tagName === "A" && el.dataset.href) el.href = el.dataset.href.replace("{}", v);
      el.textContent = v;
    });
  });
})();
