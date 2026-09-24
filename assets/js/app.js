/* S&LIFE Sneakers — front-end (HTML/CSS/JS thuần, chạy trực tiếp trên GitHub Pages). */
(function () {
  "use strict";

  var SHOP = window.SHOP;
  var FIT_NOTES = window.FIT_NOTES || [];
  var LINES = window.LINES || {};
  var RAW = window.PRODUCTS || [];
  var PAGE_SIZE = 24;
  var OTHER_LINE = "Các dòng khác";
  var IMG_DIR = "images/products/";
  var IMG_EXT = ["jpg", "png", "webp", "jpeg", "JPG"];

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
  function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  // Giá trong dữ liệu tính theo nghìn đồng: 2600 -> 2.600.000₫
  function money(k) { return k == null ? "Liên hệ" : (k * 1000).toLocaleString("vi-VN") + "₫"; }
  function sizeNum(s) { return parseFloat(String(s).replace(",", ".")) + (/y$/i.test(s) ? -0.01 : 0); }
  function params() { return new URLSearchParams(location.search); }
  function storage(key, value) {
    try {
      if (value === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { return null; }
  }
  function fullName(p) { return "Giày " + p.name + (p.code ? " " + p.code : ""); }
  function productUrl(p) { return "product.html?id=" + encodeURIComponent(p.id); }
  function brandUrl(b) { return "shop.html?brand=" + slug(b); }
  function lineUrl(b, l) { return "shop.html?brand=" + slug(b) + "&line=" + slug(l); }

  /* ---------- Data ---------- */
  function lineOf(p) {
    var list = LINES[p.brand] || [];
    for (var i = 0; i < list.length; i++) if (list[i][1].test(p.name)) return list[i][0];
    return OTHER_LINE;
  }
  var PRODUCTS = RAW.map(function (p) {
    var sizes = (p.sizes || []).slice().sort(function (a, b) { return sizeNum(a.s) - sizeNum(b.s); });
    var prices = sizes.map(function (s) { return s.p || p.price; }).filter(Boolean);
    return Object.assign({}, p, {
      sizes: sizes,
      inStock: sizes.length > 0,
      minPrice: prices.length ? Math.min.apply(null, prices) : p.price,
      line: lineOf(p),
      search: norm([p.name, p.code, p.brand, GENDER_LABEL[p.gender]].join(" ")),
    });
  });
  var BY_ID = {};
  PRODUCTS.forEach(function (p) { BY_ID[p.id] = p; });
  var IN_STOCK = PRODUCTS.filter(function (p) { return p.inStock; });

  function brandList() {
    var counts = {};
    IN_STOCK.forEach(function (p) { counts[p.brand] = (counts[p.brand] || 0) + 1; });
    return Object.keys(counts).sort(function (a, b) {
      var ia = BRAND_ORDER.indexOf(a), ib = BRAND_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    }).map(function (b) { return { name: b, count: counts[b] }; });
  }
  // Các dòng của một hãng còn hàng, theo thứ tự khai báo trong data/shop.js
  function lineList(brand) {
    var order = (LINES[brand] || []).map(function (l) { return l[0]; }).concat([OTHER_LINE]);
    var counts = {};
    IN_STOCK.forEach(function (p) { if (p.brand === brand) counts[p.line] = (counts[p.line] || 0) + 1; });
    return order.filter(function (l, i) { return counts[l] && order.indexOf(l) === i; })
      .map(function (l) { return { name: l, count: counts[l] }; });
  }
  function bestOf(list) {
    return list.slice().sort(function (a, b) { return (b.image ? 1 : 0) - (a.image ? 1 : 0) || b.sizes.length - a.sizes.length; })[0];
  }
  function fromSlug(list, s) { return list.filter(function (x) { return slug(x.name) === s; })[0]; }
  function fitNote(p) {
    for (var i = 0; i < FIT_NOTES.length; i++) if (FIT_NOTES[i].match.test(p.name)) return FIT_NOTES[i];
    return null;
  }

  /* ---------- Ảnh sản phẩm ----------
     Ảnh đặt trong images/products/, tên file = mã sản phẩm (VD: U204LMMC.jpg).
     Ảnh phụ: U204LMMC-2.jpg, U204LMMC-3.jpg… Website tự dò, không cần chạy lệnh. */
  function imgBase(p) { return IMG_DIR + (p.code || p.id); }
  window.__slifeImg = function (img) {
    var i = +img.dataset.i + 1;
    if (i >= IMG_EXT.length) { img.remove(); return; }
    img.dataset.i = i;
    img.src = img.dataset.base + "." + IMG_EXT[i];
  };
  function probe(url) {
    return new Promise(function (resolve) {
      var im = new Image();
      im.onload = function () { resolve(url); };
      im.onerror = function () { resolve(null); };
      im.src = url;
    });
  }
  function findImage(base) {
    var i = 0;
    function next() {
      if (i >= IMG_EXT.length) return Promise.resolve(null);
      return probe(base + "." + IMG_EXT[i++]).then(function (u) { return u || next(); });
    }
    return next();
  }

  var COLORS = [
    [/black|phantom|stealth|noir|den\b/, "#1f1f1f"],
    [/navy|indigo|midnight|obsidian|peacoat|dark teal|eclipse/, "#26324f"],
    [/red|cardinal|scarlet|bordeaux|maroon|chicago|siren/, "#b3261e"],
    [/pink|rose|mauve|ballet|dragon fruit|lily|taffy/, "#e3a3b2"],
    [/purple|plum|grape|lilac|concord/, "#6f4c8f"],
    [/olive|khaki|sage|grass|malachite|green|spruce|mint|teal|cactus|pine/, "#5d7a4c"],
    [/yellow|sulfur|volt|ochre|curry|gold/, "#e0b43a"],
    [/orange|rust|ginger|peach/, "#df7a3a"],
    [/blue|denim|royal|sky|chambray|paisley/, "#4071b3"],
    [/brown|mocha|chocolate|oak|pecan|desert|relic|coffee|pumpernickel|espresso|hemp/, "#7a5236"],
    [/silver|metallic|chrome|aluminum/, "#c3c6ca"],
    [/grey|gray|cloud|smoke|lunar|castlerock|graphite|cement|rain|magnet|harbor|oyster|shadow|titanium/, "#9d9e9a"],
    [/beige|cream|sail|linen|turtledove|birch|sea salt|oatmeal|ivory|sand|tan|coconut|arid|stone|timberwolf|mushroom|cannoli|clay|greige|oat/, "#e2d7c1"],
    [/white/, "#f3f2ee"],
  ];
  function colorway(name) {
    var n = norm(name), found = [];
    COLORS.forEach(function (c) { var m = n.match(c[0]); if (m) found.push({ at: m.index, color: c[1] }); });
    found.sort(function (a, b) { return a.at - b.at; });
    var main = found[0] ? found[0].color : "#d9d5cc";
    var second = found[1] ? found[1].color : (main === "#f3f2ee" ? "#1f1f1f" : "#f3f2ee");
    return { main: main, second: second, gum: /gum/.test(n) };
  }
  // Hình minh hoạ hiện khi chưa có ảnh thật
  function placeholder(p) {
    var c = colorway(p.name);
    var dark = c.main === "#1f1f1f" || c.main === "#26324f";
    var line = dark ? "#555" : "rgba(0,0,0,.2)";
    var sole = c.gum ? "#c28a4e" : (c.main === "#f3f2ee" ? "#e6e2d8" : "#f6f5f1");
    return (
      '<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="400" height="400" fill="#f4f4f2"/>' +
      '<ellipse cx="204" cy="296" rx="160" ry="9" fill="rgba(0,0,0,.07)"/>' +
      '<path d="M234 136 C236 118 248 108 262 110 L276 130 Z" fill="' + c.second + '" stroke="' + line + '" stroke-width="2"/>' +
      '<path d="M60 258 C54 236 64 222 92 214 L150 200 C172 194 188 182 200 168 L236 134 C248 126 262 124 274 130 C290 138 306 142 322 140 C336 138 346 144 350 156 L356 258 Z" fill="' + c.main + '" stroke="' + line + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M60 258 C54 236 64 222 92 214 L118 208 C112 226 112 244 118 258 Z" fill="' + c.second + '" opacity=".55"/>' +
      '<path d="M326 140 C338 139 346 145 350 156 L356 258 L322 258 C326 220 328 180 326 140 Z" fill="' + c.second + '" opacity=".9"/>' +
      '<path d="M122 244 C180 226 246 216 312 222" stroke="' + c.second + '" stroke-width="11" fill="none" stroke-linecap="round"/>' +
      '<g stroke="' + (dark ? "#888" : "rgba(0,0,0,.35)") + '" stroke-width="3" stroke-linecap="round">' +
      '<line x1="200" y1="176" x2="214" y2="190"/><line x1="212" y1="164" x2="226" y2="178"/><line x1="224" y1="152" x2="238" y2="166"/><line x1="236" y1="141" x2="250" y2="155"/></g>' +
      '<path d="M50 254 H360 C366 254 368 262 366 270 C362 282 350 288 338 288 H72 C58 288 46 278 46 266 C46 258 48 254 50 254 Z" fill="' + sole + '" stroke="rgba(0,0,0,.14)" stroke-width="2"/>' +
      '<text x="200" y="352" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-size="13" letter-spacing="3" fill="#b5b5b5">' + esc(p.brand.toUpperCase()) + "</text>" +
      "</svg>"
    );
  }
  // Ảnh thật (nếu có) đè lên hình minh hoạ; không có thì giữ hình minh hoạ
  function media(p, eager) {
    var base = imgBase(p);
    var src = p.image || base + "." + IMG_EXT[0];
    return '<div class="media">' + placeholder(p) +
      '<img alt="' + esc(fullName(p)) + '" src="' + esc(src) + '" data-base="' + esc(base) + '" data-i="' + (p.image ? -1 : 0) + '"' +
      (eager ? "" : ' loading="lazy"') + ' onload="this.classList.add(\'ok\')" onerror="__slifeImg(this)"></div>';
  }

  /* ---------- Icons ---------- */
  var I = {
    bag: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 4h2l2.2 11h11.3L20.5 7H6.3"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>',
    menu: '<svg viewBox="0 0 28 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 5h22M3 12h22M3 19h22"/></svg>',
    close: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1l-2.2 2.23z"/></svg>',
    ms: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.4 2 2 6.1 2 11.7c0 2.9 1.2 5.5 3.2 7.2V22l3-1.6c1.2.3 2.5.5 3.8.5 5.6 0 10-4.1 10-9.7S17.6 2 12 2zm1 12.9l-2.6-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.8-2.7-5.3 5.7z"/></svg>',
  };

  /* ---------- Cart ---------- */
  var CART_KEY = "slife_cart_v1";
  var memCart = [];
  function getCart() {
    var c = storage(CART_KEY);
    return (Array.isArray(c) ? c : memCart).filter(function (it) { return BY_ID[it.id]; });
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
      return navigator.clipboard.writeText(text).catch(function () { legacyCopy(text); });
    }
    legacyCopy(text);
    return Promise.resolve();
  }
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) { /* bỏ qua */ }
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
  // Hộp thoại đặt hàng: hiện tin nhắn, bấm nút thì sao chép và mở Zalo
  function orderModal(build, askFoot) {
    var m = modal(
      "<h3>Gửi đơn cho shop qua Zalo</h3>" +
      (askFoot ? '<div class="field" style="margin-top:10px"><label for="m-foot">Chiều dài bàn chân (cm) — không bắt buộc</label><input id="m-foot" inputmode="decimal" placeholder="VD: 25"><span class="hint">Để shop kiểm tra lại size giúp cho chắc.</span></div>' : "") +
      '<div class="order-msg" data-msg></div>' +
      '<p class="muted" style="font-size:13px;margin:10px 0 0">Bấm nút bên dưới: tin nhắn được sao chép, bạn dán vào khung chat Zalo rồi gửi. Shop xác nhận còn size, báo tổng tiền và phí ship.</p>' +
      '<div class="modal__actions"><button class="btn btn--ghost" data-close>Đóng</button>' +
      '<a class="btn btn--zalo" href="' + SHOP.zalo + '" target="_blank" rel="noopener" data-go>Sao chép & mở Zalo</a></div>'
    );
    var msgEl = $("[data-msg]", m.el), foot = $("#m-foot", m.el);
    function refresh() { msgEl.textContent = build(foot ? foot.value.trim() : ""); }
    if (foot) foot.addEventListener("input", refresh);
    refresh();
    $("[data-go]", m.el).addEventListener("click", function () {
      copyText(msgEl.textContent);
      toast("Đã sao chép tin nhắn — dán vào Zalo để gửi shop");
      setTimeout(m.close, 400);
    });
  }

  function card(p) {
    var tags = [];
    if (!p.inStock) tags.push('<span class="tag tag--muted">Hết hàng</span>');
    else if (p.sizes.length === 1) tags.push('<span class="tag">Còn 1 size</span>');
    if (p.sale) tags.push('<span class="tag tag--dark">Xả kho</span>');
    if (p.gender === "nu") tags.push('<span class="tag tag--pink">Nữ</span>');
    if (p.gender === "gs" || p.gender === "kid") tags.push('<span class="tag tag--pink">' + GENDER_LABEL[p.gender] + "</span>");
    var sizes = p.sizes.map(function (s) { return s.s; });
    return (
      '<a class="card' + (p.inStock ? "" : " is-out") + '" href="' + productUrl(p) + '">' +
      '<div class="card__img">' + media(p) + '<div class="card__tags">' + tags.join("") + "</div></div>" +
      '<div class="card__name">' + esc(fullName(p)) + "</div>" +
      (p.inStock ? '<div class="card__sizes">Size: ' + esc(sizes.join(" · ")) + "</div>" : "") +
      (p.inStock
        ? '<div class="card__price">' + (p.minPrice < p.price ? "Từ " : "") + money(p.minPrice) + "</div>"
        : '<div class="card__price is-out">Tạm hết size</div>') +
      "</a>"
    );
  }
  function tile(href, p, label, sub, active) {
    return '<a class="tile' + (active ? " is-active" : "") + '" href="' + href + '"><div class="tile__img">' + (p ? media(p) : "") + "</div>" +
      '<div class="tile__label"><span>' + esc(label) + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</span></div></a>";
  }
  function crumbs(list) {
    return '<nav class="breadcrumb" aria-label="Breadcrumb">' + list.map(function (c, i) {
      return (i ? "<span>»</span>" : "") + (c[1] ? '<a href="' + c[1] + '">' + esc(c[0]) + "</a>" : esc(c[0]));
    }).join("") + "</nav>";
  }

  /* ---------- Header / Menu / Footer ---------- */
  function renderChrome() {
    var brands = brandList();
    var q = params().get("q") || "";
    var headerEl = $("#site-header");
    if (headerEl) {
      headerEl.outerHTML =
        '<header class="hd"><div class="container">' +
        '<div class="hd__row">' +
        '<a class="hd__cart" href="cart.html" aria-label="Giỏ hàng">' + I.bag + '<span class="badge" data-cart-count hidden>0</span><span class="lbl">Giỏ hàng</span></a>' +
        '<a class="logo" href="index.html" aria-label="' + esc(SHOP.name) + ' — Trang chủ"><b>S&amp;LIFE</b><small>Sneakers</small></a>' +
        '<div class="hd__right"><a class="hd__hotline" href="tel:' + SHOP.phone + '">Hotline / Zalo<b>' + SHOP.phoneDisplay + "</b></a>" +
        '<button class="menu-btn" data-menu-open aria-label="Mở menu" aria-controls="menu">' + I.menu + "MENU</button></div>" +
        "</div>" +
        '<form class="hd__search" action="shop.html" role="search"><input type="search" name="q" value="' + esc(q) + '" placeholder="Tìm tên giày hoặc mã, VD: 204L, 1183C102" aria-label="Tìm kiếm sản phẩm"><button type="submit">TÌM KIẾM</button></form>' +
        "</div></header>" +
        '<div class="drawer" id="menu" aria-hidden="true"><div class="drawer__backdrop" data-menu-close></div>' +
        '<div class="drawer__panel" role="dialog" aria-label="Menu">' +
        '<div class="drawer__head"><b>MENU</b><button class="menu-btn" data-menu-close aria-label="Đóng menu">' + I.close + "</button></div>" +
        '<div class="drawer__body">' +
        '<div class="drawer__title">Giày theo hãng</div>' +
        '<div class="m-item"><div class="m-row"><a href="shop.html">Tất cả giày <small>' + IN_STOCK.length + "</small></a></div></div>" +
        brands.map(function (b) {
          var lines = lineList(b.name);
          return '<div class="m-item"><div class="m-row"><a href="' + brandUrl(b.name) + '">Giày ' + esc(b.name) + " <small>" + b.count + "</small></a>" +
            (lines.length > 1 ? '<button class="m-toggle" data-menu-sub aria-label="Xem các dòng ' + esc(b.name) + '">' + I.chev + "</button>" : "") +
            "</div>" +
            (lines.length > 1 ? '<div class="m-sub">' + lines.map(function (l) {
              return '<a href="' + lineUrl(b.name, l.name) + '">' + esc(l.name) + " <small>" + l.count + "</small></a>";
            }).join("") + "</div>" : "") +
            "</div>";
        }).join("") +
        '<div class="drawer__title">Hỗ trợ</div><div class="m-links">' +
        '<a href="size-guide.html">Hướng dẫn chọn size</a><a href="policy.html">Đổi trả, ship &amp; thanh toán</a><a href="cart.html">Giỏ hàng</a></div>' +
        '<div class="m-contact">Hotline / Zalo: <a href="tel:' + SHOP.phone + '"><b>' + SHOP.phoneDisplay + "</b></a> (" + esc(SHOP.owner) + ")</div>" +
        "</div></div></div>";
    }

    var footerEl = $("#site-footer");
    if (footerEl) {
      footerEl.outerHTML =
        '<footer class="ft"><div class="container"><div class="ft__grid">' +
        '<div><a class="logo" href="index.html"><b>S&amp;LIFE</b><small>Sneakers</small></a>' +
        '<p style="margin-top:14px;max-width:320px">' + esc(SHOP.tagline) + ". Mỗi đôi có mã sản phẩm khớp tem hộp, tra trên trang chủ của hãng ra đúng mẫu, đúng màu.</p></div>" +
        "<div><h4>Danh mục</h4><ul>" +
        brands.slice(0, 8).map(function (b) { return '<li><a href="' + brandUrl(b.name) + '">Giày ' + esc(b.name) + "</a></li>"; }).join("") +
        "</ul></div>" +
        '<div><h4>Hỗ trợ khách hàng</h4><ul><li><a href="size-guide.html">Hướng dẫn chọn size</a></li><li><a href="policy.html#dat-hang">Cách đặt hàng</a></li><li><a href="policy.html#doi-tra">Chính sách đổi trả</a></li><li><a href="policy.html#ship">Ship & thanh toán</a></li><li><a href="policy.html#chinh-hang">Cam kết chính hãng</a></li></ul></div>' +
        "<div><h4>Liên hệ</h4><ul>" +
        "<li>" + esc(SHOP.owner) + ': <a href="tel:' + SHOP.phone + '">' + SHOP.phoneDisplay + "</a></li>" +
        '<li><a href="' + SHOP.zalo + '" target="_blank" rel="noopener">Zalo: ' + SHOP.phoneDisplay + "</a></li>" +
        (SHOP.facebook ? '<li><a href="' + esc(SHOP.facebook) + '" target="_blank" rel="noopener">Facebook: ' + esc(SHOP.facebookName) + "</a></li>" : "<li>Facebook: " + esc(SHOP.facebookName) + "</li>") +
        '<li><a href="' + SHOP.instagram + '" target="_blank" rel="noopener">Instagram: @s.life_sneakers</a></li>' +
        '<li><a href="' + SHOP.tiktok + '" target="_blank" rel="noopener">TikTok: @slifesneaker</a></li>' +
        "</ul></div></div>" +
        '<div class="ft__bottom">© ' + new Date().getFullYear() + " " + esc(SHOP.name) + " · Giá và tồn kho có thể thay đổi trong ngày — nhắn shop xác nhận size trước khi chuyển khoản.</div>" +
        "</div></footer>" +
        '<div class="float-contact">' +
        (SHOP.facebook ? '<a class="fc-ms" href="' + esc(SHOP.facebook) + '" target="_blank" rel="noopener" aria-label="Nhắn Facebook">' + I.ms + "</a>" : "") +
        '<a class="fc-zalo" href="' + SHOP.zalo + '" target="_blank" rel="noopener" aria-label="Chat Zalo">Zalo</a>' +
        '<a class="fc-phone" href="tel:' + SHOP.phone + '" aria-label="Gọi shop">' + I.phone + "</a></div>";
    }

    var menu = $("#menu");
    function toggleMenu(open) {
      if (!menu) return;
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.style.overflow = open ? "hidden" : "";
    }
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-menu-open]")) toggleMenu(true);
      if (e.target.closest("[data-menu-close]")) toggleMenu(false);
      var sub = e.target.closest("[data-menu-sub]");
      if (sub) sub.closest(".m-item").classList.toggle("is-open");
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggleMenu(false); });
    updateCartBadge();
  }

  /* ---------- Trang chủ ---------- */
  function initHome() {
    var brands = brandList();
    $all("[data-stat-products]").forEach(function (el) { el.textContent = IN_STOCK.length; });

    var pics = $("[data-banner-pics]");
    if (pics) {
      pics.innerHTML = ["New Balance", "Onitsuka Tiger", "Jordan", "Adidas"].map(function (b) {
        var p = bestOf(IN_STOCK.filter(function (x) { return x.brand === b; }));
        return p ? '<a href="' + brandUrl(b) + '">' + media(p, true) + "<span>" + esc(b) + "</span></a>" : "";
      }).join("");
    }

    var brandEl = $("[data-brand-tiles]");
    if (brandEl) {
      brandEl.innerHTML = brands.map(function (b) {
        return tile(brandUrl(b.name), bestOf(IN_STOCK.filter(function (x) { return x.brand === b.name; })), "Giày " + b.name, b.count + " mẫu");
      }).join("");
    }

    // Mỗi hãng một khối sản phẩm, giống các khối "AIR JORDAN 1", "SNEAKER" của Sneaker Daily
    var secEl = $("[data-brand-sections]");
    if (secEl) {
      secEl.innerHTML = brands.filter(function (b) { return b.count >= 4; }).map(function (b) {
        var list = IN_STOCK.filter(function (p) { return p.brand === b.name; })
          .sort(function (a, c) { return c.sizes.length - a.sizes.length; }).slice(0, 8);
        return '<section class="sec"><h2 class="sec__title">Giày ' + esc(b.name) + "</h2>" +
          '<div class="grid">' + list.map(card).join("") + "</div>" +
          '<div class="sec__more"><a class="btn btn--ghost" href="' + brandUrl(b.name) + '">Xem tất cả ' + b.count + " mẫu " + esc(b.name) + "</a></div></section>";
      }).join("");
    }
  }

  /* ---------- Trang danh mục: tất cả / hãng / dòng / tìm kiếm ---------- */
  function initShop() {
    var p = params();
    var brands = brandList();
    var brand = fromSlug(brands, p.get("brand") || "");
    brand = brand ? brand.name : null;
    var lines = brand ? lineList(brand) : [];
    var line = brand ? fromSlug(lines, p.get("line") || "") : null;
    line = line ? line.name : null;

    var state = {
      q: p.get("q") || "",
      sizes: (p.get("size") || "").split(",").filter(Boolean),
      genders: (p.get("gender") || "").split(",").filter(Boolean),
      price: p.get("price") || "",
      sort: p.get("sort") || "default",
      showOut: p.get("all") === "1",
      page: Math.max(1, +p.get("page") || 1),
    };

    // Tiêu đề, breadcrumb
    var title = line ? (line === OTHER_LINE ? brand + " — các dòng khác" : /^Giày /.test(line) ? line + " " + brand : line.indexOf(brand.split(" ")[0]) === 0 ? line : brand + " " + line)
      : brand ? "Giày " + brand : state.q ? "Tìm kiếm: " + state.q : "Giày chính hãng";
    $("[data-title]").textContent = title;
    document.title = title + " — " + SHOP.name;
    var trail = [["Trang chủ", "index.html"], ["Giày", brand || state.q ? "shop.html" : ""]];
    if (brand) trail.push(["Giày " + brand, line ? brandUrl(brand) : ""]);
    if (line) trail.push([line, ""]);
    if (state.q && !brand) trail.push(["Tìm kiếm", ""]);
    $("[data-crumbs]").innerHTML = crumbs(trail);

    // Ô hãng (trang tất cả) hoặc ô dòng giày (trang hãng)
    var tilesEl = $("[data-tiles]");
    if (!brand && !state.q) {
      tilesEl.innerHTML = brands.map(function (b) {
        return tile(brandUrl(b.name), bestOf(IN_STOCK.filter(function (x) { return x.brand === b.name; })), "Giày " + b.name, b.count + " mẫu");
      }).join("");
    } else if (brand && !line && lines.length > 1) {
      tilesEl.innerHTML = lines.map(function (l) {
        return tile(lineUrl(brand, l.name), bestOf(IN_STOCK.filter(function (x) { return x.brand === brand && x.line === l.name; })), l.name, l.count + " mẫu");
      }).join("");
    } else {
      tilesEl.hidden = true;
    }

    // Bộ lọc
    var pool = PRODUCTS.filter(function (x) { return (!brand || x.brand === brand) && (!line || x.line === line); });
    var sizeSet = {};
    pool.forEach(function (x) { x.sizes.forEach(function (s) { sizeSet[s.s] = 1; }); });
    var sizeKeys = Object.keys(sizeSet).sort(function (a, b) { return sizeNum(a) - sizeNum(b); });
    var fEl = $("[data-filters]");
    $(".filters__body", fEl).innerHTML =
      '<div class="filter"><h3>Size (EU)</h3><div class="size-grid">' +
      sizeKeys.map(function (s) { return '<button type="button" class="size-btn" data-size="' + esc(s) + '">' + esc(s) + "</button>"; }).join("") +
      '</div><p class="muted" style="font-size:12.5px;margin:8px 0 0">40Y: size 40 bản GS.</p></div>' +
      '<div class="filter"><h3>Khoảng giá</h3>' +
      [{ id: "", label: "Tất cả" }].concat(PRICE_RANGES).map(function (r) {
        return '<label class="check"><input type="radio" name="price" value="' + r.id + '"> ' + r.label + "</label>";
      }).join("") + "</div>" +
      '<div class="filter"><h3>Dành cho</h3>' +
      ["nam", "nu", "gs", "kid"].map(function (g) { return '<label class="check"><input type="checkbox" name="gender" value="' + g + '"> Code ' + GENDER_LABEL[g] + "</label>"; }).join("") +
      '<p class="muted" style="font-size:12.5px;margin:6px 0 0">Mẫu không ghi code là unisex / size nam.</p></div>' +
      '<div class="filter"><label class="check"><input type="checkbox" name="showOut"> Hiện cả mẫu đã hết size</label></div>';

    function syncInputs() {
      $all('input[name="gender"]', fEl).forEach(function (i) { i.checked = state.genders.indexOf(i.value) >= 0; });
      $all('input[name="price"]', fEl).forEach(function (i) { i.checked = i.value === state.price; });
      $all("[data-size]", fEl).forEach(function (b) { b.classList.toggle("is-active", state.sizes.indexOf(b.dataset.size) >= 0); });
      $('input[name="showOut"]', fEl).checked = state.showOut;
    }
    function writeUrl() {
      var u = new URLSearchParams();
      if (brand) u.set("brand", slug(brand));
      if (line) u.set("line", slug(line));
      if (state.q) u.set("q", state.q);
      if (state.sizes.length) u.set("size", state.sizes.join(","));
      if (state.genders.length) u.set("gender", state.genders.join(","));
      if (state.price) u.set("price", state.price);
      if (state.sort !== "default") u.set("sort", state.sort);
      if (state.showOut) u.set("all", "1");
      if (state.page > 1) u.set("page", state.page);
      history.replaceState(null, "", "shop.html" + (u.toString() ? "?" + u : ""));
    }
    function filtered() {
      var words = norm(state.q).split(/\s+/).filter(Boolean);
      var range = PRICE_RANGES.filter(function (r) { return r.id === state.price; })[0];
      var list = pool.filter(function (x) {
        if (!state.showOut && !x.inStock) return false;
        if (state.genders.length && state.genders.indexOf(x.gender) < 0) return false;
        if (state.sizes.length && !x.sizes.some(function (s) { return state.sizes.indexOf(s.s) >= 0; })) return false;
        if (range && !(x.minPrice >= range.min && x.minPrice <= range.max)) return false;
        for (var i = 0; i < words.length; i++) if (x.search.indexOf(words[i]) < 0) return false;
        return true;
      });
      var cmp = {
        "price-asc": function (a, b) { return (a.minPrice || 1e9) - (b.minPrice || 1e9); },
        "price-desc": function (a, b) { return (b.minPrice || 0) - (a.minPrice || 0); },
        "sizes": function (a, b) { return b.sizes.length - a.sizes.length; },
      }[state.sort];
      return list.sort(function (a, b) {
        if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
        return cmp ? cmp(a, b) : a.order - b.order;
      });
    }

    var gridEl = $("[data-grid]"), pagerEl = $("[data-pager]"), countEl = $("[data-count]"), chipsEl = $("[data-chips]"), sortEl = $("[data-sort]");
    sortEl.value = state.sort;

    function pagesHtml(total) {
      var pages = Math.ceil(total / PAGE_SIZE);
      if (pages <= 1) return "";
      var cur = state.page, out = [], shown = {};
      [1, 2, cur - 1, cur, cur + 1, pages - 1, pages].forEach(function (n) { if (n >= 1 && n <= pages) shown[n] = 1; });
      var last = 0;
      Object.keys(shown).map(Number).sort(function (a, b) { return a - b; }).forEach(function (n) {
        if (n - last > 1) out.push("<span>…</span>");
        out.push('<button data-page="' + n + '"' + (n === cur ? ' class="is-current" aria-current="page"' : "") + ">" + n + "</button>");
        last = n;
      });
      if (cur < pages) out.push('<button class="next" data-page="' + (cur + 1) + '">Tiếp →</button>');
      return out.join("");
    }

    function render() {
      var list = filtered();
      var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      if (state.page > pages) state.page = pages;
      var start = (state.page - 1) * PAGE_SIZE;
      countEl.textContent = list.length + " mẫu" + (state.showOut ? "" : " còn size");
      gridEl.innerHTML = list.length
        ? list.slice(start, start + PAGE_SIZE).map(card).join("")
        : '<div class="empty"><h3>Chưa có mẫu phù hợp</h3><p class="muted">Thử bỏ bớt bộ lọc, hoặc nhắn shop mẫu bạn cần — shop nhận order theo yêu cầu.</p><a class="btn btn--zalo" href="' + SHOP.zalo + '" target="_blank" rel="noopener">Nhắn Zalo cho shop</a></div>';
      pagerEl.innerHTML = pagesHtml(list.length);

      var chips = [];
      state.sizes.forEach(function (s) { chips.push(["size", s, "Size " + s]); });
      state.genders.forEach(function (g) { chips.push(["gender", g, "Code " + GENDER_LABEL[g]]); });
      if (state.price) chips.push(["price", "", PRICE_RANGES.filter(function (r) { return r.id === state.price; })[0].label]);
      if (state.showOut) chips.push(["showOut", "", "Gồm mẫu hết size"]);
      chipsEl.innerHTML = chips.map(function (c) { return '<button data-remove="' + c[0] + '" data-value="' + esc(c[1]) + '">' + esc(c[2]) + "</button>"; }).join("");
      chipsEl.hidden = !chips.length;
      var n = state.sizes.length + state.genders.length + (state.price ? 1 : 0);
      $("[data-filter-count]").textContent = n ? "(" + n + ")" : "";
      $("[data-apply]").textContent = "Xem " + list.length + " mẫu";
      writeUrl();
    }
    function toggle(arr, v) { var i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); }
    function openFilters(open) { fEl.classList.toggle("is-open", open); document.body.style.overflow = open ? "hidden" : ""; }

    fEl.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "gender") toggle(state.genders, t.value);
      if (t.name === "price") state.price = t.value;
      if (t.name === "showOut") state.showOut = t.checked;
      state.page = 1; render();
    });
    fEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-size]");
      if (b) { toggle(state.sizes, b.dataset.size); b.classList.toggle("is-active"); state.page = 1; render(); }
      if (e.target.closest("[data-filters-close]")) openFilters(false);
      if (e.target.closest("[data-clear]")) { state.sizes = []; state.genders = []; state.price = ""; state.showOut = false; state.page = 1; syncInputs(); render(); }
    });
    $("[data-filters-open]").addEventListener("click", function () { openFilters(true); });
    sortEl.addEventListener("change", function () { state.sort = sortEl.value; state.page = 1; render(); });
    pagerEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-page]");
      if (!b) return;
      state.page = +b.dataset.page; render();
      $("[data-count]").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    chipsEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-remove]");
      if (!b) return;
      var k = b.dataset.remove, v = b.dataset.value;
      if (k === "size") toggle(state.sizes, v);
      if (k === "gender") toggle(state.genders, v);
      if (k === "price") state.price = "";
      if (k === "showOut") state.showOut = false;
      state.page = 1; syncInputs(); render();
    });

    // Đoạn giới thiệu cuối trang (giống "Đọc thêm" của Sneaker Daily)
    var about = $("[data-about]");
    if (about && brand) {
      about.hidden = false;
      $("h2", about).textContent = (line ? title : "Giày " + brand) + " chính hãng tại " + SHOP.name;
      $(".about__body", about).innerHTML =
        "<p>" + esc(SHOP.name) + " có sẵn " + pool.filter(function (x) { return x.inStock; }).length + " mẫu " + esc(line ? title : brand) +
        " chính hãng. Mỗi đôi có mã sản phẩm khớp với tem hộp — bạn tra mã trên trang chủ của " + esc(brand) + " sẽ ra đúng mẫu, đúng màu. Giao đủ hộp, giấy gói, tem và phụ kiện đi kèm.</p>" +
        "<p>Trên mỗi mẫu, website chỉ hiện những size đang còn tại shop. Tồn kho thay đổi trong ngày, bạn nhắn shop xác nhận size trước khi chuyển khoản. Còn phân vân size, gửi shop số cm chân kèm tên đôi giày đang đi vừa nhất để được tư vấn.</p>" +
        "<p>Khi nhận hàng bạn được mở hộp kiểm tra trước khi trả tiền. Đổi size trong " + SHOP.returnDays + " ngày nếu giày còn nguyên hộp, tem và chưa đi ngoài trời. Ship toàn quốc, nội thành Hà Nội và TP.HCM có ship nhanh.</p>";
      $("button", about).addEventListener("click", function () {
        about.classList.toggle("is-open");
        this.textContent = about.classList.contains("is-open") ? "Thu gọn" : "Đọc thêm";
      });
    }

    syncInputs();
    render();
  }

  /* ---------- Trang sản phẩm ---------- */
  function initProduct() {
    var root = $("[data-product]");
    var p = BY_ID[params().get("id")];
    if (!p) {
      root.innerHTML = '<div class="empty" style="margin:40px 0"><h2>Không tìm thấy sản phẩm</h2><p class="muted">Mẫu này có thể vừa được cập nhật. Xem các mẫu đang còn hàng nhé.</p><a class="btn" href="shop.html">Xem hàng sẵn</a></div>';
      $("[data-related-wrap]").hidden = true;
      return;
    }
    var name = fullName(p);
    document.title = name + " — " + SHOP.name;
    var fit = fitNote(p);
    var selected = p.sizes.length === 1 ? p.sizes[0].s : null;
    var sizeText = p.sizes.map(function (s) { return s.s; }).join(", ");
    var hasLines = (LINES[p.brand] || []).length > 0;
    var trail = [["Trang chủ", "index.html"], ["Giày", "shop.html"], ["Giày " + p.brand, brandUrl(p.brand)]];
    if (hasLines) trail.push([p.line, lineUrl(p.brand, p.line)]);
    trail.push([p.name, ""]);

    root.innerHTML =
      '<div class="pd">' +
      '<div class="gallery"><div class="gallery__main" data-main>' + media(p, true) + '</div><div class="gallery__thumbs" data-thumbs></div></div>' +
      "<div>" +
      '<div class="pd__crumb">' + crumbs(trail) + "</div>" +
      "<h1>" + esc(name) + "</h1>" +
      '<div class="pd__price" data-price>' + money(p.price) + "</div>" +
      (p.inStock
        ? '<a class="pd__guide" href="size-guide.html">Hướng dẫn chọn size</a>' +
          '<div class="pd__sizes"><span>Size</span><div class="sizes">' +
          p.sizes.map(function (s) {
            var extra = s.p && s.p !== p.price ? money(s.p).replace(".000₫", "k") : s.n ? "Lưu ý" : "";
            return '<button type="button" data-size="' + esc(s.s) + '" title="' + esc(s.n || "") + '">' + esc(s.s) + (extra ? "<small>" + esc(extra) + "</small>" : "") + "</button>";
          }).join("") + "</div></div>" +
          '<p class="pd__hint" data-size-note>Size không có trong danh sách là đã hết — nhắn shop để order.</p>'
        : "") +
      '<span class="pill' + (p.inStock ? "" : " is-out") + '">' + (p.inStock ? "Còn hàng" : "Tạm hết size") + "</span>" +
      (p.note ? '<div class="pd__note"><b>Ghi chú của shop:</b> ' + esc(p.note) + "</div>" : "") +
      (fit ? '<div class="fit"><b>Lưu ý form ' + esc(fit.line) + ":</b> " + esc(fit.advice) + "</div>" : "") +
      '<div class="pd__buttons">' +
      '<button class="btn btn--buy btn--block" data-buy>' + (p.inStock ? "Mua ngay" : "Hỏi shop qua Zalo") + "</button>" +
      (p.inStock ? '<button class="btn btn--cart btn--block" data-add>Thêm vào giỏ</button>' : "") +
      "</div>" +
      '<div class="pd__meta">' +
      (p.code ? "<span>Mã: <b>" + esc(p.code) + '</b> <a href="#" data-copy-code>(sao chép)</a></span>' : "") +
      '<span>Danh mục: <a href="' + brandUrl(p.brand) + '">Giày ' + esc(p.brand) + "</a>" +
      (hasLines ? ', <a href="' + lineUrl(p.brand, p.line) + '">' + esc(p.line) + "</a>" : "") + "</span>" +
      "<span>Thương hiệu: <b>" + esc(p.brand) + "</b></span></div>" +
      "</div></div>" +

      '<div class="tabs">' +
      '<div class="tabs__nav" role="tablist"><button class="is-active" data-tab="0" role="tab">Mô tả</button><button data-tab="1" role="tab">Thông tin sản phẩm</button><button data-tab="2" role="tab">Ship &amp; đổi trả</button></div>' +
      '<div class="tabs__panel" data-panel="0">' +
      "<p><b>" + esc(name) + "</b> là hàng chính hãng đang có sẵn tại " + esc(SHOP.name) + "." +
      (p.code ? " Mã sản phẩm <b>" + esc(p.code) + "</b> khớp với tem hộp — bạn tra mã này trên trang chủ của " + esc(p.brand) + " sẽ ra đúng mẫu, đúng màu." : "") + "</p>" +
      (p.inStock ? "<p>Size còn tại shop: <b>" + esc(sizeText) + "</b>. Tồn kho thay đổi trong ngày, bạn nhắn shop xác nhận size trước khi chuyển khoản nhé.</p>" : "<p>Mẫu này tạm hết size tại shop. Bạn nhắn Zalo để shop kiểm tra và báo giá order.</p>") +
      (fit ? "<p>Về form: " + esc(fit.advice) + " Còn phân vân, gửi shop số cm chân kèm tên đôi giày đang đi vừa nhất để được tư vấn.</p>" : "") +
      "<p>Mỗi đôi giao đủ hộp, giấy gói, tem và phụ kiện đi kèm. Shop gửi ảnh chụp thật trước khi đóng gói, bạn được mở hộp kiểm tra trước khi trả tiền.</p>" +
      "</div>" +
      '<div class="tabs__panel" data-panel="1" hidden><h3>Thông tin sản phẩm ' + esc(p.name) + '</h3><table class="spec"><tbody>' +
      "<tr><th>Thương hiệu</th><td>" + esc(p.brand) + "</td></tr>" +
      (hasLines ? "<tr><th>Dòng giày</th><td>" + esc(p.line) + "</td></tr>" : "") +
      (p.code ? "<tr><th>Mã sản phẩm</th><td>" + esc(p.code) + "</td></tr>" : "") +
      "<tr><th>Dành cho</th><td>" + (p.gender === "unisex" ? "Unisex / size nam" : "Code " + GENDER_LABEL[p.gender]) + "</td></tr>" +
      "<tr><th>Size còn</th><td>" + (p.inStock ? esc(sizeText) : "Tạm hết") + "</td></tr>" +
      "<tr><th>Tình trạng</th><td>Mới, đủ hộp, tem và phụ kiện</td></tr>" +
      "</tbody></table></div>" +
      '<div class="tabs__panel" data-panel="2" hidden><ul>' +
      "<li>Nội thành Hà Nội / TP.HCM: ship nhanh Grab, Be (chuyển khoản trước 100%) hoặc SPX Express, Viettel Post.</li>" +
      "<li>Tỉnh khác: SPX Express, Viettel Post.</li>" +
      "<li>COD: đặt cọc " + SHOP.depositPercent + "% giá bán, phần còn lại thu khi nhận hàng. Được đồng kiểm.</li>" +
      "<li>Đổi trả trong " + SHOP.returnDays + " ngày: giữ nguyên hộp, tem, chưa đi ngoài trời. Sai size do shop tư vấn, shop chịu phí đổi.</li>" +
      '</ul><p><a href="policy.html" style="text-decoration:underline">Xem đầy đủ chính sách</a></p></div>' +
      "</div>";

    // Ảnh phụ: CODE-2.jpg, CODE-3.jpg…
    var base = imgBase(p), shots = [];
    findImage(base).then(function (main) {
      if (!main) return;
      shots.push(main);
      var n = 2;
      (function more() {
        if (n > 8) return done();
        findImage(base + "-" + n++).then(function (u) { if (u) { shots.push(u); more(); } else done(); });
      })();
    });
    function done() {
      if (shots.length < 2) return;
      var thumbs = $("[data-thumbs]", root), mainEl = $("[data-main] img", root);
      thumbs.innerHTML = shots.map(function (u, i) {
        return '<button type="button" data-shot="' + i + '"' + (i ? "" : ' class="is-active"') + '><img src="' + esc(u) + '" alt=""></button>';
      }).join("");
      thumbs.addEventListener("click", function (e) {
        var b = e.target.closest("[data-shot]");
        if (!b || !mainEl) return;
        mainEl.src = shots[+b.dataset.shot];
        $all("button", thumbs).forEach(function (x) { x.classList.toggle("is-active", x === b); });
      });
    }

    var priceEl = $("[data-price]", root);
    function markSize() {
      $all("[data-size]", root).forEach(function (b) { b.classList.toggle("is-active", b.dataset.size === selected); });
      var s = p.sizes.filter(function (x) { return x.s === selected; })[0];
      priceEl.innerHTML = money((s && s.p) || p.price) + (s && s.p && s.p !== p.price ? "<small>giá riêng size " + esc(s.s) + "</small>" : "");
      var noteEl = $("[data-size-note]", root);
      if (noteEl && s && s.n) noteEl.textContent = "Size " + s.s + ": " + s.n;
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-size]");
      if (b) { selected = b.dataset.size; markSize(); }
      var tab = e.target.closest("[data-tab]");
      if (tab) {
        $all("[data-tab]", root).forEach(function (x) { x.classList.toggle("is-active", x === tab); });
        $all("[data-panel]", root).forEach(function (x) { x.hidden = x.dataset.panel !== tab.dataset.tab; });
      }
      if (e.target.closest("[data-copy-code]")) {
        e.preventDefault();
        copyText(p.code).then(function () { toast("Đã sao chép mã " + p.code); });
      }
      if (e.target.closest("[data-add]")) {
        if (!selected) { toast("Bạn chọn size trước nhé"); return; }
        toast(addToCart(p.id, selected) ? "Đã thêm size " + selected + " vào giỏ" : "Size " + selected + " đã có trong giỏ");
      }
      if (e.target.closest("[data-buy]")) {
        if (p.inStock && !selected) { toast("Bạn chọn size trước nhé"); return; }
        orderModal(function (foot) {
          return (p.inStock ? "Chào shop, mình muốn đặt đôi này:\n" : "Chào shop, mình muốn hỏi đôi này:\n") + name + "\n" +
            "Mã: " + (p.code || p.name) + " / Size: " + (selected || "…") + " / Chân dài: " + (foot ? foot.replace(/\s*cm$/i, "") : "…") + " cm\n" +
            (selected ? "Giá: " + money(itemPrice(p, selected)) + "\n" : "") +
            "\nTên:\nSĐT:\nĐịa chỉ nhận hàng:";
        }, true);
      }
    });
    markSize();

    var relEl = $("[data-related]");
    var related = IN_STOCK.filter(function (x) { return x.id !== p.id && x.brand === p.brand; })
      .sort(function (a, b) { return (b.line === p.line) - (a.line === p.line) || b.sizes.length - a.sizes.length; })
      .slice(0, 8);
    relEl.innerHTML = related.map(card).join("");
    $("[data-related-wrap]").hidden = !related.length;
  }

  /* ---------- Giỏ hàng ---------- */
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
        var still = p.sizes.some(function (s) { return s.s === it.size; });
        total += price || 0;
        return '<div class="cart-item"><a class="cart-item__img" href="' + productUrl(p) + '">' + media(p) + "</a>" +
          '<div><a class="cart-item__name" href="' + productUrl(p) + '">' + esc(fullName(p)) + "</a>" +
          '<div class="cart-item__meta">Size ' + esc(it.size) + "</div>" +
          (still ? "" : '<div class="cart-item__meta" style="color:var(--buy-2)">Size này vừa hết trong bảng hàng — nhắn shop kiểm tra.</div>') +
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
      orderModal(function () { return msg; }, false);
    });
    render();
  }

  /* ---------- Trang kiểm tra ảnh (anh.html) ---------- */
  function initImages() {
    var body = $("[data-img-rows]"), stat = $("[data-img-stat]"), filter = "all", q = "";
    var list = PRODUCTS.slice().sort(function (a, b) { return (b.inStock - a.inStock) || a.order - b.order; });
    var status = {};
    body.innerHTML = list.map(function (p) {
      var file = (p.code || p.id) + ".jpg";
      return '<tr data-row="' + esc(p.id) + '" data-q="' + esc(p.search + " " + norm(p.id)) + '">' +
        '<td><div class="thumb">' + media(p) + "</div></td>" +
        '<td><a href="' + productUrl(p) + '" target="_blank" rel="noopener">' + esc(fullName(p)) + "</a><br><small class=\"muted\">" + esc(p.brand) + (p.inStock ? "" : " · hết size") + "</small></td>" +
        '<td><code>' + esc(file) + '</code> <button class="btn btn--ghost btn--sm" data-copy="' + esc(p.code || p.id) + '">Chép tên</button></td>' +
        '<td data-status class="muted">Đang kiểm tra…</td></tr>';
    }).join("");

    var queue = list.slice(), done = 0, found = 0;
    function worker() {
      var p = queue.shift();
      if (!p) return;
      findImage(imgBase(p)).then(function (u) {
        status[p.id] = !!u; done++; if (u) found++;
        var cell = $('[data-row="' + p.id + '"] [data-status]', body);
        cell.className = u ? "status-ok" : "status-miss";
        cell.textContent = u ? "Đã có ảnh (" + u.split("/").pop() + ")" : "Chưa có ảnh";
        stat.textContent = "Đã kiểm tra " + done + "/" + list.length + " mẫu · " + found + " mẫu có ảnh";
        apply();
        worker();
      });
    }
    for (var i = 0; i < 6; i++) worker();

    function apply() {
      var words = norm(q).split(/\s+/).filter(Boolean);
      $all("[data-row]", body).forEach(function (tr) {
        var s = status[tr.dataset.row];
        var ok = filter === "all" || (filter === "missing" && s === false) || (filter === "has" && s === true);
        for (var i = 0; i < words.length; i++) if (tr.dataset.q.indexOf(words[i]) < 0) ok = false;
        tr.hidden = !ok;
      });
    }
    $("[data-img-filter]").addEventListener("change", function (e) { filter = e.target.value; apply(); });
    $("[data-img-search]").addEventListener("input", function (e) { q = e.target.value; apply(); });
    body.addEventListener("click", function (e) {
      var b = e.target.closest("[data-copy]");
      if (b) copyText(b.dataset.copy).then(function () { toast("Đã chép tên file: " + b.dataset.copy); });
    });
  }

  /* ---------- Khởi động ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderChrome();
    var page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "shop") initShop();
    if (page === "product") initProduct();
    if (page === "cart") initCart();
    if (page === "images") initImages();
  });
})();
