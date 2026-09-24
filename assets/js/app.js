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
  var IMG_EXT = ["webp", "jpg", "png", "jpeg", "JPG"]; // công cụ của shop lưu WebP (nhẹ), vẫn nhận JPG/PNG
  var MAX_SHOTS = 12; // tối đa ảnh mỗi mẫu: MÃ, MÃ-2 … MÃ-12

  var GENDER_LABEL = { nam: "Nam", nu: "Nữ", gs: "GS", kid: "Kid", unisex: "Unisex" };
  var BRAND_ORDER = ["New Balance", "Asics", "Onitsuka Tiger", "Jordan", "Nike", "Adidas", "Puma", "Salomon", "On", "Vans", "Converse"];
  var PRICE_RANGES = [
    { id: "u2", label: "Dưới 2 triệu", min: 0, max: 1999 },
    { id: "2-3", label: "2 – 3 triệu", min: 2000, max: 2999 },
    { id: "3-4", label: "3 – 4 triệu", min: 3000, max: 3999 },
    { id: "o4", label: "Từ 4 triệu", min: 4000, max: Infinity },
  ];
  // Bộ lọc màu: đoán từ tên màu trong tên giày
  var COLOR_FILTERS = [
    { id: "den", label: "Đen", hex: "#1f1f1f", re: /black|phantom|stealth|noir|obsidian|panda/ },
    { id: "trang", label: "Trắng", hex: "#ffffff", re: /white|summit|triple white/ },
    { id: "kem", label: "Kem / Be", hex: "#e8dcc4", re: /beige|cream|sail|linen|turtledove|birch|sea salt|oatmeal|ivory|sand|tan|coconut|arid|stone|timberwolf|mushroom|cannoli|greige|oat|putty|bone/ },
    { id: "xam", label: "Xám", hex: "#9d9e9a", re: /grey|gray|cloud|smoke|lunar|castlerock|graphite|cement|rain|magnet|harbor|oyster|shadow|titanium|wolf/ },
    { id: "bac", label: "Bạc / Ánh kim", hex: "#c3c6ca", re: /silver|metallic|chrome|aluminum|aluminium/ },
    { id: "nau", label: "Nâu", hex: "#7a5236", re: /brown|mocha|chocolate|oak|pecan|desert|relic|coffee|pumpernickel|espresso|hemp|clay|earth/ },
    { id: "navy", label: "Xanh navy", hex: "#26324f", re: /navy|indigo|midnight|peacoat|dark teal|eclipse/ },
    { id: "xanhduong", label: "Xanh dương", hex: "#4071b3", re: /blue|denim|royal|sky|chambray|paisley|unc/ },
    { id: "xanhla", label: "Xanh lá", hex: "#5d7a4c", re: /olive|khaki|sage|grass|malachite|green|spruce|mint|teal|cactus|pine/ },
    { id: "hong", label: "Hồng", hex: "#e3a3b2", re: /pink|rose|mauve|ballet|dragon fruit|lily|taffy|quartz/ },
    { id: "do", label: "Đỏ", hex: "#b3261e", re: /red|cardinal|scarlet|bordeaux|maroon|chicago|siren|bred/ },
    { id: "vang", label: "Vàng / Cam", hex: "#e0b43a", re: /yellow|sulfur|volt|ochre|curry|gold|orange|rust|ginger|peach/ },
    { id: "tim", label: "Tím", hex: "#6f4c8f", re: /purple|plum|grape|lilac|concord|violet/ },
  ];
  var PROVINCES = ["Hà Nội", "TP. Hồ Chí Minh", "Hải Phòng", "Đà Nẵng", "Cần Thơ", "Huế", "An Giang", "Bắc Ninh", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Tĩnh", "Hưng Yên", "Khánh Hòa", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Nghệ An", "Ninh Bình", "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh", "Thái Nguyên", "Thanh Hóa", "Tuyên Quang", "Vĩnh Long"];

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
  function absUrl(path) { return new URL(path, SHOP.siteUrl || location.href).href; }

  /* ---------- Data ---------- */
  function lineOf(p) {
    var list = LINES[p.brand] || [];
    for (var i = 0; i < list.length; i++) if (list[i][1].test(p.name)) return list[i][0];
    return OTHER_LINE;
  }
  var PRODUCTS = RAW.map(function (p) {
    var sizes = (p.sizes || []).slice().sort(function (a, b) { return sizeNum(a.s) - sizeNum(b.s); });
    var prices = sizes.map(function (s) { return s.p || p.price; }).filter(Boolean);
    var n = norm(p.name);
    return Object.assign({}, p, {
      sizes: sizes,
      inStock: sizes.length > 0,
      minPrice: prices.length ? Math.min.apply(null, prices) : p.price,
      line: lineOf(p),
      colors: COLOR_FILTERS.filter(function (c) { return c.re.test(n); }).map(function (c) { return c.id; }),
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
  function lineTitle(brand, line) {
    if (line === OTHER_LINE) return brand + " — các dòng khác";
    if (/^Giày /.test(line)) return line + " " + brand;
    return line.indexOf(brand.split(" ")[0]) === 0 ? line : brand + " " + line;
  }
  function bestOf(list) {
    return list.slice().sort(function (a, b) { return (b.image ? 1 : 0) - (a.image ? 1 : 0) || b.sizes.length - a.sizes.length; })[0];
  }
  function fromSlug(list, s) { return list.filter(function (x) { return slug(x.name) === s; })[0]; }
  function fitNote(p) {
    for (var i = 0; i < FIT_NOTES.length; i++) if (FIT_NOTES[i].match.test(p.name)) return FIT_NOTES[i];
    return null;
  }

  /* ---------- Ảnh ----------
     Ảnh sản phẩm: images/products/<MÃ>.jpg, ảnh phụ <MÃ>-2.jpg… Website tự dò, không cần chạy lệnh.
     Banner trang chủ: images/banners/banner-1.jpg … banner-5.jpg
     Banner hãng: images/banners/<tên-hãng>.jpg (VD new-balance.jpg, onitsuka-tiger.jpg)
     Ảnh khách hàng: images/khach-hang/1.jpg … 24.jpg */
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
  // Dò ảnh đánh số base1, base2… cho đến khi thiếu
  function findSeries(base, from, max) {
    var found = [], n = from;
    return new Promise(function (resolve) {
      (function next() {
        if (n > max) return resolve(found);
        findImage(base + n++).then(function (u) { if (u) { found.push(u); next(); } else resolve(found); });
      })();
    });
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
    search: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    menu: '<svg viewBox="0 0 28 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 5h22M3 12h22M3 19h22"/></svg>',
    close: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"/><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1l-2.2 2.23z"/></svg>',
    ms: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.4 2 2 6.1 2 11.7c0 2.9 1.2 5.5 3.2 7.2V22l3-1.6c1.2.3 2.5.5 3.8.5 5.6 0 10-4.1 10-9.7S17.6 2 12 2zm1 12.9l-2.6-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.8-2.7-5.3 5.7z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.3 2.3 1.7 3.8 4 4v3.1c-1.4.1-2.7-.3-4-1.1v6.1c0 4-3.5 6.3-6.9 5.4-4.3-1.2-5-6.9-1.3-9 1-.6 2.2-.8 3.4-.7v3.2c-.4-.1-.8-.1-1.2 0-1.5.3-2.3 1.9-1.6 3.2.9 1.6 3.6 1.4 3.9-.8V3z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M2 6h12v10H2zM14 10h4l4 4v2h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4"/><path d="M5 12v9h14v-9M12 8v13M12 8c-2-4-6-4-6-1.5S9 8 12 8zM12 8c2-4 6-4 6-1.5S15 8 12 8z"/></svg>',
  };

  /* ---------- Giỏ hàng & sản phẩm đã xem ---------- */
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
  function cartTotal(cart) {
    return cart.reduce(function (t, it) { return t + (itemPrice(BY_ID[it.id], it.size) || 0); }, 0);
  }
  function updateCartBadge() {
    var n = getCart().length;
    $all("[data-cart-count]").forEach(function (el) { el.textContent = n; el.hidden = !n; });
  }
  var SEEN_KEY = "slife_seen_v1";
  function markSeen(id) {
    var list = (storage(SEEN_KEY) || []).filter(function (x) { return x !== id && BY_ID[x]; });
    list.unshift(id);
    storage(SEEN_KEY, list.slice(0, 12));
  }
  function seenProducts(exceptId) {
    return (storage(SEEN_KEY) || []).filter(function (x) { return x !== exceptId && BY_ID[x]; }).map(function (x) { return BY_ID[x]; });
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
  function modal(html, cls) {
    var wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.innerHTML = '<div class="modal__box ' + (cls || "") + '" role="dialog" aria-modal="true">' + html + "</div>";
    function close() { wrap.remove(); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") close(); }
    wrap.addEventListener("click", function (e) { if (e.target === wrap || e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(wrap);
    return { el: wrap, close: close };
  }
  // Hộp thoại "Mua ngay": hiện tin nhắn, bấm nút thì sao chép và mở Zalo
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
  // Popup "Thêm vào giỏ hàng thành công"
  function addedModal(p, size) {
    var cart = getCart();
    modal(
      '<div class="added__head">' + I.check + "<b>Thêm vào giỏ hàng thành công</b>" +
      '<button class="added__x" data-close aria-label="Đóng">' + I.close + "</button></div>" +
      '<div class="added__item"><div class="added__img">' + media(p, true) + "</div>" +
      "<div><div>" + esc(fullName(p)) + '</div><div class="muted">Size ' + esc(size) + " · " + money(itemPrice(p, size)) + "</div></div></div>" +
      '<div class="added__sum"><a href="cart.html">Giỏ hàng hiện có</a><div><b>' + money(cartTotal(cart)) + '</b><br><span class="muted">(' + cart.length + ") sản phẩm</span></div></div>" +
      '<div class="modal__actions"><a class="btn btn--ghost" href="dat-hang.html">Đặt hàng</a><a class="btn" href="cart.html">Xem giỏ hàng</a></div>',
      "added"
    );
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
      '<div class="card__brand">' + esc(p.brand) + "</div>" +
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
      return (i ? "<span>/</span>" : "") + (c[1] ? '<a href="' + c[1] + '">' + esc(c[0]) + "</a>" : esc(c[0]));
    }).join("") + "</nav>";
  }
  // Khối sản phẩm có tiêu đề; trên điện thoại vuốt ngang
  function rail(title, list, moreHref, moreText) {
    if (!list.length) return "";
    return '<section class="sec"><div class="sec__head"><h2 class="sec__title">' + esc(title) + "</h2>" +
      (moreHref ? '<a class="sec__link" href="' + moreHref + '">' + esc(moreText || "Xem tất cả") + "</a>" : "") + "</div>" +
      '<div class="rail">' + list.map(card).join("") + "</div></section>";
  }

  /* ---------- Header / Menu / Footer ---------- */
  function renderChrome() {
    var brands = brandList();
    var q = params().get("q") || "";
    var headerEl = $("#site-header");
    if (headerEl) {
      var navBrands = brands.slice(0, 6);
      headerEl.outerHTML =
        (SHOP.announcement ? '<div class="announce">' + esc(SHOP.announcement) + "</div>" : "") +
        '<header class="hd"><div class="container">' +
        '<div class="hd__row">' +
        '<a class="hd__cart" href="cart.html" aria-label="Giỏ hàng">' + I.bag + '<span class="badge" data-cart-count hidden>0</span></a>' +
        '<a class="logo" href="index.html" aria-label="' + esc(SHOP.name) + ' — Trang chủ"><b>S&amp;LIFE</b><small>Sneakers</small></a>' +
        '<nav class="nav" aria-label="Thương hiệu"><a href="index.html">Trang chủ</a>' +
        navBrands.map(function (b) {
          var lines = lineList(b.name);
          return '<div class="nav__item"><a href="' + brandUrl(b.name) + '">' + esc(b.name) + (lines.length > 1 ? I.down : "") + "</a>" +
            (lines.length > 1 ? '<div class="nav__drop">' + lines.map(function (l) {
              return '<a href="' + lineUrl(b.name, l.name) + '">' + esc(l.name) + "</a>";
            }).join("") + '<a class="nav__all" href="' + brandUrl(b.name) + '">Tất cả ' + esc(b.name) + " →</a></div>" : "") +
            "</div>";
        }).join("") +
        '<a href="shop.html">Tất cả giày</a></nav>' +
        '<div class="hd__right">' +
        '<button class="icon-btn hd__searchbtn" data-search-toggle aria-label="Tìm kiếm">' + I.search + "</button>" +
        '<a class="icon-btn hd__cart2" href="cart.html" aria-label="Giỏ hàng">' + I.bag + '<span class="badge" data-cart-count hidden>0</span></a>' +
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
        '<a href="size-guide.html">Hướng dẫn chọn size</a><a href="policy.html">Đổi trả, ship &amp; thanh toán</a><a href="gioi-thieu.html">Giới thiệu</a><a href="lien-he.html">Liên hệ</a><a href="cart.html">Giỏ hàng</a></div>' +
        '<div class="m-contact">Hotline / Zalo: <a href="tel:' + SHOP.phone + '"><b>' + SHOP.phoneDisplay + "</b></a> (" + esc(SHOP.openHours) + ")</div>" +
        "</div></div></div>";
    }

    var footerEl = $("#site-footer");
    if (footerEl) {
      var social = [
        SHOP.facebook ? ["Facebook S&LIFE Sneakers", SHOP.facebook, I.fb] : null,
        SHOP.facebookGarment ? ["Facebook S&LIFE Garment", SHOP.facebookGarment, I.fb] : null,
        SHOP.facebookOwner ? ["Facebook Mr. Bảo", SHOP.facebookOwner, I.fb] : null,
        ["Zalo", SHOP.zalo, "<b>Zalo</b>"],
        ["Instagram S&LIFE Sneakers", SHOP.instagram, I.ig],
        SHOP.instagramGarment ? ["Instagram S&LIFE Garment", SHOP.instagramGarment, I.ig] : null,
        ["TikTok", SHOP.tiktok, I.tt],
      ].filter(Boolean);
      footerEl.outerHTML =
        '<footer class="ft"><div class="container"><div class="ft__grid">' +
        '<div><a class="logo" href="index.html"><b>S&amp;LIFE</b><small>Sneakers</small></a>' +
        '<ul class="ft__info">' +
        (SHOP.legalName ? "<li>" + esc(SHOP.legalName) + "</li>" : "") +
        (SHOP.address ? "<li>Địa chỉ: " + esc(SHOP.address) + "</li>" : "") +
        '<li>Hotline / Zalo: <a href="tel:' + SHOP.phone + '">' + SHOP.phoneDisplay + "</a> (" + esc(SHOP.openHours) + ")</li>" +
        (SHOP.email ? '<li>Email: <a href="mailto:' + esc(SHOP.email) + '">' + esc(SHOP.email) + "</a></li>" : "") +
        (SHOP.taxCode ? "<li>MST / GPKD: " + esc(SHOP.taxCode) + "</li>" : "") +
        "</ul>" +
        '<div class="ft__social">' + social.map(function (s) {
          return '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener" aria-label="' + esc(s[0]) + '" title="' + esc(s[0]) + '">' + s[2] + "</a>";
        }).join("") + "</div></div>" +
        "<div><h4>Cửa hàng</h4><ul>" +
        '<li><a href="index.html">Trang chủ</a></li>' +
        brands.slice(0, 7).map(function (b) { return '<li><a href="' + brandUrl(b.name) + '">Giày ' + esc(b.name) + "</a></li>"; }).join("") +
        '<li><a href="lien-he.html">Liên hệ</a></li>' +
        "</ul></div>" +
        '<div><h4>Chính sách</h4><ul><li><a href="gioi-thieu.html">Giới thiệu</a></li><li><a href="policy.html#dat-hang">Hướng dẫn đặt hàng</a></li><li><a href="size-guide.html">Hướng dẫn chọn size</a></li><li><a href="policy.html#doi-tra">Chính sách đổi trả</a></li><li><a href="policy.html#ship">Vận chuyển & thanh toán</a></li><li><a href="policy.html#khieu-nai">Giải quyết khiếu nại</a></li><li><a href="chinh-sach-bao-mat.html">Chính sách bảo mật</a></li></ul></div>' +
        "<div><h4>Thanh toán</h4>" +
        '<div class="ft__pay"><span>COD</span><span>Chuyển khoản</span><span>VietQR</span></div>' +
        '<p class="ft__note">Được mở hộp kiểm tra trước khi trả tiền.</p>' +
        (SHOP.bctUrl ? '<a class="ft__bct" href="' + esc(SHOP.bctUrl) + '" target="_blank" rel="noopener">✓ Đã thông báo Bộ Công Thương</a>' : "") +
        "</div></div>" +
        '<div class="ft__bottom">© ' + new Date().getFullYear() + " " + esc(SHOP.name) + " · Giá và tồn kho có thể thay đổi trong ngày — nhắn shop xác nhận size trước khi chuyển khoản.</div>" +
        "</div></footer>" +
        '<div class="float-contact">' +
        '<button class="fc-top" data-top aria-label="Lên đầu trang" hidden>' + I.up + "</button>" +
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
      if (e.target.closest("[data-search-toggle]")) {
        var hd = $(".hd");
        hd.classList.toggle("is-search");
        if (hd.classList.contains("is-search")) $(".hd__search input").focus();
      }
      if (e.target.closest("[data-top]")) window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggleMenu(false); });
    var topBtn = $("[data-top]");
    if (topBtn) window.addEventListener("scroll", function () { topBtn.hidden = window.scrollY < 600; }, { passive: true });
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
    // Banner ảnh do shop tải lên (images/banners/banner-1.jpg …): có thì thay banner chữ bằng slider ảnh
    var slider = $("[data-slider]");
    if (slider) {
      findSeries("images/banners/banner-", 1, 6).then(function (urls) {
        if (!urls.length) return;
        var track = $("[data-slides]", slider), dots = $("[data-dots]", slider), cur = 0, timer;
        track.innerHTML = urls.map(function (u, i) { return '<a class="slide" href="shop.html"><img src="' + esc(u) + '" alt="Banner ' + (i + 1) + '"' + (i ? ' loading="lazy"' : "") + "></a>"; }).join("");
        dots.innerHTML = urls.length > 1 ? urls.map(function (u, i) { return '<button data-dot="' + i + '" aria-label="Banner ' + (i + 1) + '"></button>'; }).join("") : "";
        function go(i) {
          cur = (i + urls.length) % urls.length;
          track.style.transform = "translateX(" + (-100 * cur) + "%)";
          $all("[data-dot]", dots).forEach(function (d, j) { d.classList.toggle("is-active", j === cur); });
          clearTimeout(timer);
          if (urls.length > 1) timer = setTimeout(function () { go(cur + 1); }, 5000);
        }
        slider.hidden = false;
        $("[data-text-banner]").hidden = true;
        $all("[data-slide-nav]", slider).forEach(function (b) { b.hidden = urls.length < 2; });
        slider.addEventListener("click", function (e) {
          var d = e.target.closest("[data-dot]"), n = e.target.closest("[data-slide-nav]");
          if (d) go(+d.dataset.dot);
          if (n) go(cur + (+n.dataset.slideNav));
        });
        var x0 = null;
        track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
        track.addEventListener("touchend", function (e) {
          if (x0 === null) return;
          var dx = e.changedTouches[0].clientX - x0;
          if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
          x0 = null;
        });
        go(0);
      });
    }

    var brandEl = $("[data-brand-tiles]");
    if (brandEl) {
      brandEl.innerHTML = brands.map(function (b) {
        return tile(brandUrl(b.name), bestOf(IN_STOCK.filter(function (x) { return x.brand === b.name; })), "Giày " + b.name, b.count + " mẫu");
      }).join("");
    }

    // Dòng giày nổi bật (như hàng "Mexico 66 SD / Mexico 66 / …" của N&N)
    var linesEl = $("[data-featured-lines]");
    if (linesEl) {
      var all = [];
      brands.forEach(function (b) {
        lineList(b.name).forEach(function (l) { if (l.name !== OTHER_LINE && l.count >= 3) all.push({ brand: b.name, line: l.name, count: l.count }); });
      });
      all.sort(function (a, b) { return b.count - a.count; });
      linesEl.innerHTML = all.slice(0, 12).map(function (x) {
        var p = bestOf(IN_STOCK.filter(function (y) { return y.brand === x.brand && y.line === x.line; }));
        return '<a class="line-card" href="' + lineUrl(x.brand, x.line) + '"><div class="line-card__img">' + media(p) +
          '<span class="line-card__over">' + esc(lineTitle(x.brand, x.line)) + "</span></div>" +
          "<b>" + esc(lineTitle(x.brand, x.line)) + '</b><span class="muted">' + x.count + " sản phẩm</span></a>";
      }).join("");
    }

    // Mỗi hãng một khối sản phẩm
    var secEl = $("[data-brand-sections]");
    if (secEl) {
      secEl.innerHTML = brands.filter(function (b) { return b.count >= 4; }).map(function (b) {
        var list = IN_STOCK.filter(function (p) { return p.brand === b.name; })
          .sort(function (a, c) { return c.sizes.length - a.sizes.length; }).slice(0, 10);
        return rail(b.name, list, brandUrl(b.name), "Xem tất cả");
      }).join("");
    }

    // Khoảnh khắc cùng khách hàng: images/khach-hang/1.jpg, 2.jpg…
    var moments = $("[data-moments]");
    if (moments) {
      findSeries("images/khach-hang/", 1, 24).then(function (urls) {
        if (!urls.length) return;
        moments.hidden = false;
        $(".moments", moments).innerHTML = urls.map(function (u) {
          return '<figure class="polaroid"><img src="' + esc(u) + '" alt="Khách hàng của ' + esc(SHOP.name) + '" loading="lazy"></figure>';
        }).join("");
      });
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
      colors: (p.get("color") || "").split(",").filter(Boolean),
      genders: (p.get("gender") || "").split(",").filter(Boolean),
      price: p.get("price") || "",
      sort: p.get("sort") || "default",
      showOut: p.get("all") === "1",
      page: Math.max(1, +p.get("page") || 1),
    };

    // Tiêu đề, breadcrumb
    var title = line ? lineTitle(brand, line) : brand ? "Giày " + brand : state.q ? "Tìm kiếm: " + state.q : "Giày chính hãng";
    $("[data-title]").textContent = title;
    document.title = title + " — " + SHOP.name;
    var trail = [["Trang chủ", "index.html"], ["Danh mục", brand || state.q ? "shop.html" : ""]];
    if (brand) trail.push(["Giày " + brand, line ? brandUrl(brand) : ""]);
    if (line) trail.push([line, ""]);
    if (state.q && !brand) trail.push(["Tìm kiếm", ""]);
    $("[data-crumbs]").innerHTML = crumbs(trail);

    // Banner hãng / dòng nếu shop có tải ảnh: images/banners/<hãng>.jpg hoặc <hãng>-<dòng>.jpg
    var bannerEl = $("[data-collection-banner]");
    if (bannerEl && brand) {
      var tries = line ? ["images/banners/" + slug(brand) + "-" + slug(line), "images/banners/" + slug(brand)] : ["images/banners/" + slug(brand)];
      (function next(i) {
        if (i >= tries.length) return;
        findImage(tries[i]).then(function (u) {
          if (!u) return next(i + 1);
          bannerEl.innerHTML = '<img src="' + esc(u) + '" alt="' + esc(title) + '">';
          bannerEl.hidden = false;
        });
      })(0);
    }

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

    // Bộ lọc: cột trái trên máy tính, ngăn kéo trên điện thoại
    var pool = PRODUCTS.filter(function (x) { return (!brand || x.brand === brand) && (!line || x.line === line); });
    var sizeSet = {}, colorCount = {};
    pool.forEach(function (x) {
      x.sizes.forEach(function (s) { sizeSet[s.s] = 1; });
      if (x.inStock) x.colors.forEach(function (c) { colorCount[c] = (colorCount[c] || 0) + 1; });
    });
    var sizeKeys = Object.keys(sizeSet).sort(function (a, b) { return sizeNum(a) - sizeNum(b); });
    var fEl = $("[data-filters]");
    $(".filters__body", fEl).innerHTML =
      '<div class="filter"><h3>Size (EU)</h3><div class="size-grid">' +
      sizeKeys.map(function (s) { return '<button type="button" class="size-btn" data-size="' + esc(s) + '">' + esc(s) + "</button>"; }).join("") +
      '</div><p class="muted" style="font-size:12.5px;margin:8px 0 0">40Y: size 40 bản GS.</p></div>' +
      '<div class="filter"><h3>Màu sắc</h3><div class="colors">' +
      COLOR_FILTERS.filter(function (c) { return colorCount[c.id]; }).map(function (c) {
        return '<label class="color"><input type="checkbox" name="color" value="' + c.id + '"><i style="background:' + c.hex + '"></i>' + c.label + " <small>" + colorCount[c.id] + "</small></label>";
      }).join("") + "</div></div>" +
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
      $all('input[name="color"]', fEl).forEach(function (i) { i.checked = state.colors.indexOf(i.value) >= 0; });
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
      if (state.colors.length) u.set("color", state.colors.join(","));
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
        if (state.colors.length && !x.colors.some(function (c) { return state.colors.indexOf(c) >= 0; })) return false;
        if (state.sizes.length && !x.sizes.some(function (s) { return state.sizes.indexOf(s.s) >= 0; })) return false;
        if (range && !(x.minPrice >= range.min && x.minPrice <= range.max)) return false;
        for (var i = 0; i < words.length; i++) if (x.search.indexOf(words[i]) < 0) return false;
        return true;
      });
      var cmp = {
        "name-asc": function (a, b) { return a.name.localeCompare(b.name); },
        "name-desc": function (a, b) { return b.name.localeCompare(a.name); },
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
      if (cur > 1) out.push('<button class="next" data-page="' + (cur - 1) + '" aria-label="Trang trước">‹</button>');
      Object.keys(shown).map(Number).sort(function (a, b) { return a - b; }).forEach(function (n) {
        if (n - last > 1) out.push("<span>…</span>");
        out.push('<button data-page="' + n + '"' + (n === cur ? ' class="is-current" aria-current="page"' : "") + ">" + n + "</button>");
        last = n;
      });
      if (cur < pages) out.push('<button class="next" data-page="' + (cur + 1) + '" aria-label="Trang sau">›</button>');
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
      state.colors.forEach(function (c) { chips.push(["color", c, COLOR_FILTERS.filter(function (x) { return x.id === c; })[0].label]); });
      state.genders.forEach(function (g) { chips.push(["gender", g, "Code " + GENDER_LABEL[g]]); });
      if (state.price) chips.push(["price", "", PRICE_RANGES.filter(function (r) { return r.id === state.price; })[0].label]);
      if (state.showOut) chips.push(["showOut", "", "Gồm mẫu hết size"]);
      chipsEl.innerHTML = chips.map(function (c) { return '<button data-remove="' + c[0] + '" data-value="' + esc(c[1]) + '">' + esc(c[2]) + "</button>"; }).join("");
      chipsEl.hidden = !chips.length;
      var n = state.sizes.length + state.colors.length + state.genders.length + (state.price ? 1 : 0);
      $("[data-filter-count]").textContent = n ? "(" + n + ")" : "";
      $("[data-apply]").textContent = "Xem " + list.length + " mẫu";
      writeUrl();
    }
    function toggle(arr, v) { var i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); }
    function openFilters(open) { fEl.classList.toggle("is-open", open); document.body.style.overflow = open ? "hidden" : ""; }

    fEl.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "gender") toggle(state.genders, t.value);
      if (t.name === "color") toggle(state.colors, t.value);
      if (t.name === "price") state.price = t.value;
      if (t.name === "showOut") state.showOut = t.checked;
      state.page = 1; render();
    });
    fEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-size]");
      if (b) { toggle(state.sizes, b.dataset.size); b.classList.toggle("is-active"); state.page = 1; render(); }
      if (e.target.closest("[data-filters-close]")) openFilters(false);
      if (e.target.closest("[data-clear]")) { state.sizes = []; state.colors = []; state.genders = []; state.price = ""; state.showOut = false; state.page = 1; syncInputs(); render(); }
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
      if (k === "color") toggle(state.colors, v);
      if (k === "gender") toggle(state.genders, v);
      if (k === "price") state.price = "";
      if (k === "showOut") state.showOut = false;
      state.page = 1; syncInputs(); render();
    });

    // Đoạn giới thiệu cuối trang ("Đọc thêm")
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

    var seenEl = $("[data-seen]");
    if (seenEl) seenEl.innerHTML = rail("Sản phẩm đã xem", seenProducts().slice(0, 8));

    syncInputs();
    render();
  }

  /* ---------- Trang sản phẩm ---------- */
  function initProduct() {
    var root = $("[data-product]");
    var p = BY_ID[params().get("id")];
    if (!p) {
      root.innerHTML = '<div class="empty" style="margin:40px 0"><h2>Không tìm thấy sản phẩm</h2><p class="muted">Mẫu này có thể vừa được cập nhật. Xem các mẫu đang còn hàng nhé.</p><a class="btn" href="shop.html">Xem hàng sẵn</a></div>';
      return;
    }
    var name = fullName(p);
    document.title = name + " — " + SHOP.name;
    var fit = fitNote(p);
    var selected = p.sizes.length === 1 ? p.sizes[0].s : null;
    var sizeText = p.sizes.map(function (s) { return s.s; }).join(", ");
    var hasLines = (LINES[p.brand] || []).length > 0;
    var pageUrl = absUrl(productUrl(p));
    var trail = [["Trang chủ", "index.html"], [p.brand, brandUrl(p.brand)]];
    if (hasLines) trail.push([p.line, lineUrl(p.brand, p.line)]);
    trail.push([name, ""]);

    // Dữ liệu có cấu trúc cho Google (giá, tình trạng còn hàng)
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Product", name: name, sku: p.code || p.id, mpn: p.code || undefined,
      brand: { "@type": "Brand", name: p.brand }, image: absUrl(imgBase(p) + ".jpg"),
      offers: { "@type": "Offer", priceCurrency: "VND", price: (p.minPrice || 0) * 1000, url: pageUrl, itemCondition: "https://schema.org/NewCondition",
        availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
    });
    document.head.appendChild(ld);

    root.innerHTML =
      '<div class="pd__crumb">' + crumbs(trail) + "</div>" +
      '<div class="pd">' +
      '<div class="gallery"><div class="gallery__thumbs" data-thumbs></div><div class="gallery__main" data-main>' + media(p, true) + "</div>" +
      '<div class="share"><span>Chia sẻ</span>' +
      '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '" target="_blank" rel="noopener" aria-label="Chia sẻ Facebook" class="share__fb">' + I.fb + "</a>" +
      '<button type="button" data-copy-link aria-label="Sao chép link">' + I.link + "</button></div></div>" +
      '<div class="pd__info">' +
      "<h1>" + esc(name) + "</h1>" +
      '<div class="pd__sub">Thương hiệu: <a href="' + brandUrl(p.brand) + '">' + esc(p.brand) + "</a>" +
      (p.code ? '<span>Mã sản phẩm: <a href="#" data-copy-code title="Sao chép mã">' + esc(p.code) + "</a></span>" : "") + "</div>" +
      '<div class="pd__price" data-price>' + money(p.price) + "</div>" +
      '<div class="promo"><div class="promo__title">' + I.gift + "Cam kết & ưu đãi</div><ul>" +
      (SHOP.perks || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
      (p.note ? '<div class="pd__note"><b>Ghi chú của shop:</b> ' + esc(p.note) + "</div>" : "") +
      (p.inStock
        ? '<div class="pd__sizehead"><span>Kích thước: <b data-size-label>' + esc(selected || "chọn size") + '</b></span><a class="pd__guide" href="size-guide.html">Hướng dẫn chọn size</a></div>' +
          '<div class="sizes">' +
          p.sizes.map(function (s) {
            var extra = s.p && s.p !== p.price ? money(s.p).replace(".000₫", "k") : s.n ? "Lưu ý" : "";
            return '<button type="button" data-size="' + esc(s.s) + '" title="' + esc(s.n || "") + '">' + esc(s.s) + (extra ? "<small>" + esc(extra) + "</small>" : "") + "</button>";
          }).join("") + "</div>" +
          '<p class="pd__hint" data-size-note>Size không có trong danh sách là đã hết — nhắn shop để order.</p>'
        : '<span class="pill is-out">Tạm hết size</span>') +
      (fit ? '<div class="fit"><b>Lưu ý form ' + esc(fit.line) + ":</b> " + esc(fit.advice) + "</div>" : "") +
      '<div class="pd__buttons">' +
      (p.inStock ? '<button class="btn btn--ghost btn--block" data-add>Thêm vào giỏ</button>' : "") +
      '<button class="btn btn--block" data-buy>' + (p.inStock ? "Mua ngay" : "Hỏi shop qua Zalo") + "</button>" +
      "</div>" +
      '<p class="pd__call">Gọi đặt mua <a href="tel:' + SHOP.phone + '"><b>' + SHOP.phoneDisplay + "</b></a> (" + esc(SHOP.openHours) + ")</p>" +
      "</div></div>" +

      '<div class="tabs">' +
      '<div class="tabs__nav" role="tablist"><button class="is-active" data-tab="0" role="tab">Mô tả sản phẩm</button><button data-tab="1" role="tab">Thông tin sản phẩm</button><button data-tab="2" role="tab">Chính sách đổi trả</button></div>' +
      '<div class="tabs__panel" data-panel="0">' +
      "<p><b>" + esc(name) + "</b> là hàng chính hãng đang có sẵn tại " + esc(SHOP.name) + "." +
      (p.code ? " Mã sản phẩm <b>" + esc(p.code) + "</b> khớp với tem hộp — bạn tra mã này trên trang chủ của " + esc(p.brand) + " sẽ ra đúng mẫu, đúng màu." : "") + "</p>" +
      (p.inStock ? "<p>Size còn tại shop: <b>" + esc(sizeText) + "</b>. Tồn kho thay đổi trong ngày, bạn nhắn shop xác nhận size trước khi chuyển khoản nhé.</p>" : "<p>Mẫu này tạm hết size tại shop. Bạn nhắn Zalo để shop kiểm tra và báo giá order.</p>") +
      (fit ? "<p>Về form: " + esc(fit.advice) + " Còn phân vân, gửi shop số cm chân kèm tên đôi giày đang đi vừa nhất để được tư vấn.</p>" : "") +
      "<p><b>Bảo quản:</b> tránh ngâm nước, không giặt máy, không dùng chất tẩy mạnh, không phơi trực tiếp dưới nắng gắt.</p>" +
      "<p>Mỗi đôi giao đủ hộp, giấy gói, tem và phụ kiện đi kèm. Shop gửi ảnh chụp thật trước khi đóng gói, bạn được mở hộp kiểm tra trước khi trả tiền.</p>" +
      "</div>" +
      '<div class="tabs__panel" data-panel="1" hidden><table class="spec"><tbody>' +
      "<tr><th>Thương hiệu</th><td>" + esc(p.brand) + "</td></tr>" +
      (hasLines ? "<tr><th>Dòng giày</th><td>" + esc(p.line) + "</td></tr>" : "") +
      (p.code ? "<tr><th>Mã sản phẩm</th><td>" + esc(p.code) + "</td></tr>" : "") +
      "<tr><th>Dành cho</th><td>" + (p.gender === "unisex" ? "Unisex / size nam" : "Code " + GENDER_LABEL[p.gender]) + "</td></tr>" +
      "<tr><th>Size còn</th><td>" + (p.inStock ? esc(sizeText) : "Tạm hết") + "</td></tr>" +
      "<tr><th>Tình trạng</th><td>Mới, đủ hộp, tem và phụ kiện</td></tr>" +
      "</tbody></table></div>" +
      '<div class="tabs__panel" data-panel="2" hidden><ul>' +
      "<li>Đổi trả trong " + SHOP.returnDays + " ngày kể từ khi giao hàng: giữ nguyên hộp, tem, chưa đi ngoài trời. Khách hỗ trợ phí đổi trả.</li>" +
      "<li>Sai size do shop tư vấn: shop chịu phí đổi.</li>" +
      "<li>Giao sai mẫu, sai size do shop đóng nhầm: quay video lúc đồng kiểm và gửi shop trong 24 giờ, shop đổi lại và chịu toàn bộ chi phí.</li>" +
      "<li>Ship toàn quốc. COD đặt cọc " + SHOP.depositPercent + "% giá bán, phần còn lại thu khi nhận hàng.</li>" +
      '</ul><p><a href="policy.html" style="text-decoration:underline">Xem đầy đủ chính sách</a></p></div>' +
      "</div>";

    // Bộ ảnh: MÃ, MÃ-2 … MÃ-12. Hiện dần từng ảnh khi tìm thấy; nút ‹ › và vuốt để xem
    var base = imgBase(p), shots = [], cur = 0;
    var thumbs = $("[data-thumbs]", root), mainBox = $("[data-main]", root);
    function mainImg() { return $("img", mainBox); }
    function show(i) {
      if (!shots.length) return;
      cur = (i + shots.length) % shots.length;
      var img = mainImg();
      if (img) { img.src = shots[cur]; img.classList.add("ok"); }
      $all("button", thumbs).forEach(function (x, j) { x.classList.toggle("is-active", j === cur); });
      var active = thumbs.children[cur];
      if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest", inline: "nearest" });
      var counter = $("[data-counter]", mainBox);
      if (counter) counter.textContent = (cur + 1) + " / " + shots.length;
    }
    function addShot(u) {
      shots.push(u);
      if (shots.length < 2) return;
      if (shots.length === 2) {
        thumbs.innerHTML = '<button type="button" data-shot="0" class="is-active"><img src="' + esc(shots[0]) + '" alt=""></button>';
        mainBox.insertAdjacentHTML("beforeend",
          '<button type="button" class="gallery__nav gallery__nav--prev" data-nav="-1" aria-label="Ảnh trước">' + I.left + "</button>" +
          '<button type="button" class="gallery__nav gallery__nav--next" data-nav="1" aria-label="Ảnh sau">' + I.left + "</button>" +
          '<span class="gallery__count" data-counter></span>');
      }
      thumbs.insertAdjacentHTML("beforeend", '<button type="button" data-shot="' + (shots.length - 1) + '"><img src="' + esc(u) + '" alt="" loading="lazy"></button>');
      var counter = $("[data-counter]", mainBox);
      if (counter) counter.textContent = (cur + 1) + " / " + shots.length;
    }
    findImage(base).then(function (first) {
      if (!first) return;
      addShot(first);
      var n = 2;
      (function next() {
        if (n > MAX_SHOTS) return;
        findImage(base + "-" + n++).then(function (u) { if (u) { addShot(u); next(); } });
      })();
    });
    thumbs.addEventListener("click", function (e) {
      var b = e.target.closest("[data-shot]");
      if (b) show(+b.dataset.shot);
    });
    mainBox.addEventListener("click", function (e) {
      var b = e.target.closest("[data-nav]");
      if (b) show(cur + (+b.dataset.nav));
    });
    var x0 = null;
    mainBox.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    mainBox.addEventListener("touchend", function (e) {
      if (x0 === null || shots.length < 2) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
      x0 = null;
    });

    var priceEl = $("[data-price]", root);
    function markSize() {
      $all("[data-size]", root).forEach(function (b) { b.classList.toggle("is-active", b.dataset.size === selected); });
      var s = p.sizes.filter(function (x) { return x.s === selected; })[0];
      priceEl.innerHTML = money((s && s.p) || p.price) + (s && s.p && s.p !== p.price ? "<small>giá riêng size " + esc(s.s) + "</small>" : "");
      var label = $("[data-size-label]", root);
      if (label) label.textContent = selected || "chọn size";
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
      if (e.target.closest("[data-copy-link]")) copyText(pageUrl).then(function () { toast("Đã sao chép link sản phẩm"); });
      if (e.target.closest("[data-add]")) {
        if (!selected) { toast("Bạn chọn size trước nhé"); return; }
        if (!addToCart(p.id, selected)) { toast("Size " + selected + " đã có trong giỏ"); return; }
        addedModal(p, selected);
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

    // Sản phẩm cùng dòng, cùng tầm giá, đã xem
    var sameLine = IN_STOCK.filter(function (x) { return x.id !== p.id && x.brand === p.brand && x.line === p.line; })
      .sort(function (a, b) { return b.sizes.length - a.sizes.length; }).slice(0, 10);
    var used = {}; sameLine.forEach(function (x) { used[x.id] = 1; });
    var ref = p.minPrice || p.price || 0;
    var samePrice = IN_STOCK.filter(function (x) { return x.id !== p.id && !used[x.id] && x.minPrice && Math.abs(x.minPrice - ref) <= ref * 0.15; })
      .sort(function (a, b) { return Math.abs(a.minPrice - ref) - Math.abs(b.minPrice - ref); }).slice(0, 10);
    $("[data-related]").innerHTML =
      rail(hasLines && p.line !== OTHER_LINE ? "Cùng dòng " + lineTitle(p.brand, p.line) : "Cùng thương hiệu " + p.brand, sameLine, hasLines ? lineUrl(p.brand, p.line) : brandUrl(p.brand)) +
      rail("Cùng tầm giá", samePrice) +
      rail("Sản phẩm đã xem", seenProducts(p.id).slice(0, 8));
    markSeen(p.id);
  }

  /* ---------- Giỏ hàng ---------- */
  function initCart() {
    var listEl = $("[data-cart-list]"), sumEl = $("[data-cart-summary]"), noteEl = $("[data-cart-note]");
    noteEl.value = storage("slife_note") || "";
    noteEl.addEventListener("input", function () { storage("slife_note", noteEl.value); });

    function render() {
      var cart = getCart();
      $("[data-cart-heading]").textContent = "Giỏ hàng (" + cart.length + ")";
      if (!cart.length) {
        listEl.innerHTML = '<div class="empty"><h3>Giỏ hàng đang trống</h3><p class="muted">Chọn vài đôi ưng ý rồi quay lại đây để đặt hàng.</p><a class="btn" href="shop.html">Xem hàng sẵn</a></div>';
        sumEl.hidden = true;
      } else {
        sumEl.hidden = false;
        listEl.innerHTML = cart.map(function (it, i) {
          var p = BY_ID[it.id], price = itemPrice(p, it.size);
          var still = p.sizes.some(function (s) { return s.s === it.size; });
          return '<div class="cart-item"><button class="cart-item__x" data-remove="' + i + '" aria-label="Xoá">' + I.close + "</button>" +
            '<a class="cart-item__img" href="' + productUrl(p) + '">' + media(p) + "</a>" +
            '<div><a class="cart-item__name" href="' + productUrl(p) + '">' + esc(fullName(p)) + "</a>" +
            '<div class="cart-item__meta">Size ' + esc(it.size) + "</div>" +
            (still ? "" : '<div class="cart-item__meta" style="color:var(--buy-2)">Size này vừa hết trong bảng hàng — nhắn shop kiểm tra.</div>') +
            '<div class="cart-item__price">' + money(price) + "</div></div></div>";
        }).join("");
        $("[data-total]", sumEl).textContent = money(cartTotal(cart));
      }
      // Gợi ý: cùng hãng với món trong giỏ
      var inCart = {}, brandsIn = {};
      cart.forEach(function (it) { inCart[it.id] = 1; brandsIn[BY_ID[it.id].brand] = 1; });
      var sug = IN_STOCK.filter(function (x) { return !inCart[x.id] && (!cart.length || brandsIn[x.brand]); })
        .sort(function (a, b) { return b.sizes.length - a.sizes.length; }).slice(0, 8);
      $("[data-suggest]").innerHTML = rail("Có thể bạn sẽ thích", sug);
    }
    listEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-remove]");
      if (!b) return;
      var cart = getCart();
      cart.splice(+b.dataset.remove, 1);
      setCart(cart);
      render();
    });
    render();
  }

  /* ---------- Đặt hàng (thanh toán) ---------- */
  function orderCode() {
    var d = new Date();
    return "SL" + String(d.getFullYear()).slice(2) + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) +
      String(Math.floor(Math.random() * 900) + 100);
  }
  function vietQr(amountK, info) {
    var b = SHOP.bank;
    if (!b || !b.bin) return "";
    return "https://img.vietqr.io/image/" + encodeURIComponent(b.bin) + "-" + encodeURIComponent(b.number) + "-compact2.png?amount=" + Math.round(amountK * 1000) +
      "&addInfo=" + encodeURIComponent(info) + "&accountName=" + encodeURIComponent(b.holder);
  }
  function initCheckout() {
    var cart = getCart();
    var root = $("[data-checkout]");
    if (!cart.length) {
      root.innerHTML = '<div class="empty" style="margin:30px 0"><h3>Giỏ hàng đang trống</h3><p class="muted">Chọn giày trước rồi quay lại đặt hàng nhé.</p><a class="btn" href="shop.html">Xem hàng sẵn</a></div>';
      return;
    }
    var total = cartTotal(cart);
    var deposit = Math.round(total * SHOP.depositPercent / 100);
    var saved = storage("slife_customer") || {};

    $("[data-summary]").innerHTML =
      cart.map(function (it) {
        var p = BY_ID[it.id];
        return '<div class="co-item"><div class="co-item__img">' + media(p) + "</div><div>" + esc(fullName(p)) +
          '<br><small class="muted">Size ' + esc(it.size) + "</small></div><b>" + money(itemPrice(p, it.size)) + "</b></div>";
      }).join("") +
      '<div class="summary__row"><span>Tạm tính</span><span>' + money(total) + "</span></div>" +
      '<div class="summary__row"><span>Phí vận chuyển</span><span class="muted">Shop báo khi xác nhận</span></div>' +
      '<div class="summary__row summary__total"><span>Tổng cộng</span><span>' + money(total) + "</span></div>";

    var form = $("[data-co-form]");
    var prov = form.province;
    prov.innerHTML = '<option value="">Chọn tỉnh / thành</option>' + PROVINCES.map(function (x) { return "<option>" + x + "</option>"; }).join("");
    ["name", "phone", "email", "province", "address", "foot"].forEach(function (k) { if (saved[k] && form[k]) form[k].value = saved[k]; });
    form.note.value = storage("slife_note") || "";
    $("[data-cod-text]").textContent = "Cọc " + SHOP.depositPercent + "% (" + money(deposit) + ") qua chuyển khoản, phần còn lại trả khi nhận hàng. Được mở hộp kiểm tra trước khi trả tiền.";
    $("[data-bank-text]").innerHTML = "Ngân hàng " + esc(SHOP.bank.name) + "<br>STK: <b>" + esc(SHOP.bank.number) + "</b><br>Chủ TK: <b>" + esc(SHOP.bank.holder) + "</b>";

    // Bước 1 -> Bước 2
    function step(n) {
      $all("[data-step]", root).forEach(function (s) { s.hidden = +s.dataset.step !== n; });
      $all("[data-crumb-step]", root).forEach(function (s) { s.classList.toggle("is-current", +s.dataset.crumbStep === n); });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    function readForm() {
      return {
        name: form.name.value.trim(), phone: form.phone.value.trim(), email: form.email.value.trim(),
        province: form.province.value, address: form.address.value.trim(), foot: form.foot.value.trim(), note: form.note.value.trim(),
      };
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = readForm();
      if (!d.name || !d.phone || !d.province || !d.address) { toast("Bạn điền giúp họ tên, số điện thoại, tỉnh/thành và địa chỉ nhé"); return; }
      if (!/^(\+?84|0)[0-9 .]{8,12}$/.test(d.phone)) { toast("Số điện thoại chưa đúng"); form.phone.focus(); return; }
      if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) { toast("Email chưa đúng"); form.email.focus(); return; }
      if (!form.agree.checked) { toast("Bạn đồng ý chính sách bảo mật để shop dùng thông tin giao hàng nhé"); return; }
      storage("slife_customer", d);
      step(2);
    });
    $("[data-back]").addEventListener("click", function () { step(1); });

    $("[data-finish]").addEventListener("click", function () {
      var d = readForm();
      var pay = (root.querySelector('input[name="pay"]:checked') || {}).value || "cod";
      var code = orderCode();
      var lines = cart.map(function (it, i) {
        var p = BY_ID[it.id];
        return (i + 1) + ") Mã: " + (p.code || "—") + " / Size: " + it.size + " / " + p.name + " — " + money(itemPrice(p, it.size));
      });
      var payText = pay === "bank" ? "Chuyển khoản 100% (" + money(total) + ")" : "COD, cọc " + SHOP.depositPercent + "% (" + money(deposit) + ")";
      var msg = "Chào shop, mình đặt đơn " + code + ":\n" + lines.join("\n") +
        "\nTạm tính: " + money(total) +
        "\n\nChân dài: " + (d.foot ? d.foot.replace(/\s*cm$/i, "") + " cm" : "…") +
        "\nTên: " + d.name + "\nSĐT: " + d.phone + (d.email ? "\nEmail: " + d.email : "") +
        "\nĐịa chỉ: " + d.address + ", " + d.province +
        "\nThanh toán: " + payText + (d.note ? "\nGhi chú: " + d.note : "");

      // Lưu đơn vào Google Sheet nếu shop đã cài (xem HUONG-DAN-DON-HANG.md)
      if (SHOP.orderEndpoint) {
        try {
          fetch(SHOP.orderEndpoint, {
            method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              code: code, time: new Date().toISOString(), name: d.name, phone: d.phone, email: d.email, province: d.province, address: d.address,
              foot: d.foot, note: d.note, payment: payText, total: total * 1000,
              items: cart.map(function (it) { var p = BY_ID[it.id]; return { code: p.code, name: p.name, size: it.size, price: (itemPrice(p, it.size) || 0) * 1000 }; }),
            }),
          });
        } catch (err) { /* vẫn còn tin nhắn Zalo làm dự phòng */ }
      }

      var payAmount = pay === "bank" ? total : deposit;
      var qr = vietQr(payAmount, code);
      $("[data-done]").innerHTML =
        '<div class="done__head">' + I.check + "<div><h2>Đã tạo đơn " + esc(code) + "</h2>" +
        '<p class="muted">Bước cuối: gửi đơn cho shop qua Zalo để shop xác nhận còn size và báo phí ship.</p></div></div>' +
        '<div class="done__grid"><div>' +
        '<div class="order-msg" data-msg>' + esc(msg) + "</div>" +
        '<a class="btn btn--zalo btn--block" style="margin-top:12px" href="' + SHOP.zalo + '" target="_blank" rel="noopener" data-send>1. Sao chép đơn & mở Zalo</a>' +
        '<p class="muted" style="font-size:13px;margin:8px 0 0">Dán tin nhắn vào khung chat Zalo của shop rồi gửi.</p></div>' +
        (qr ? '<div class="done__qr"><b>2. ' + (pay === "bank" ? "Chuyển khoản" : "Chuyển cọc") + " " + money(payAmount) + "</b>" +
          '<img src="' + esc(qr) + '" alt="Mã QR chuyển khoản ' + esc(code) + '" width="240" height="240" onerror="this.outerHTML=\'<p>' + esc(SHOP.bank.name) + "<br>STK <b>" + esc(SHOP.bank.number) + "</b><br>" + esc(SHOP.bank.holder) + "<br>Nội dung: <b>" + esc(code) + '</b></p>\'">' +
          '<small class="muted">Mở app ngân hàng, quét mã — số tiền và nội dung <b>' + esc(code) + "</b> đã điền sẵn. Nên chờ shop xác nhận còn size rồi hẵng chuyển.</small></div>" : "") +
        "</div>";
      $("[data-send]").addEventListener("click", function () { copyText(msg); toast("Đã sao chép đơn — dán vào Zalo để gửi shop"); });
      setCart([]);
      storage("slife_note", "");
      step(3);
    });
    step(1);
  }

  /* ---------- Trang kiểm tra & thêm ảnh (anh.html) ----------
     Kéo ảnh vào dòng sản phẩm: ảnh được thu nhỏ, đặt đúng tên mã và lưu thẳng vào images/products
     (Chrome / Edge, khi mở web bằng xem-web.bat). Trình duyệt khác: ảnh được tải về với đúng tên. */
  function shrinkImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var k = Math.min(1, 1200 / Math.max(im.naturalWidth, im.naturalHeight));
        var c = document.createElement("canvas");
        c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
        var g = c.getContext("2d");
        g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
        g.drawImage(im, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        // WebP nhẹ hơn JPG ~40%; trình duyệt không xuất được WebP thì dùng JPG
        c.toBlob(function (b) {
          if (b && b.type === "image/webp") return resolve(b);
          c.toBlob(function (j) { j ? resolve(j) : reject(new Error("toBlob")); }, "image/jpeg", 0.82);
        }, "image/webp", 0.8);
      };
      im.onerror = function () { URL.revokeObjectURL(url); reject(new Error("unreadable")); };
      im.src = url;
    });
  }
  // Giải nén file .zip (VD Canva tải nhiều trang) thành danh sách ảnh, không cần thư viện
  function unzipImages(file) {
    return file.arrayBuffer().then(function (ab) {
      var buf = new Uint8Array(ab), dv = new DataView(ab), eocd = -1;
      for (var i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
        if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
      }
      if (eocd < 0) throw new Error("zip");
      var count = dv.getUint16(eocd + 10, true), pos = dv.getUint32(eocd + 16, true), jobs = [];
      for (var n = 0; n < count && dv.getUint32(pos, true) === 0x02014b50; n++) {
        var method = dv.getUint16(pos + 10, true), size = dv.getUint32(pos + 20, true);
        var nameLen = dv.getUint16(pos + 28, true), extraLen = dv.getUint16(pos + 30, true), commentLen = dv.getUint16(pos + 32, true);
        var local = dv.getUint32(pos + 42, true);
        var name = new TextDecoder().decode(buf.subarray(pos + 46, pos + 46 + nameLen));
        pos += 46 + nameLen + extraLen + commentLen;
        var ext = (name.match(/\.(jpe?g|png|webp)$/i) || [])[1];
        if (!ext || /(^|\/)(__MACOSX|\.)/.test(name)) continue;
        var start = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
        var raw = new Blob([buf.subarray(start, start + size)]);
        var type = "image/" + (/jpe?g/i.test(ext) ? "jpeg" : ext.toLowerCase());
        jobs.push((method === 0 ? Promise.resolve(raw)
          : method === 8 && window.DecompressionStream ? new Response(raw.stream().pipeThrough(new DecompressionStream("deflate-raw"))).blob()
          : Promise.reject(new Error("zip"))).then((function (nm, tp) {
            return function (b) { return new File([b], nm.split("/").pop(), { type: tp }); };
          })(name, type)));
      }
      return Promise.all(jobs);
    });
  }
  function initImages() {
    var body = $("[data-img-rows]"), stat = $("[data-img-stat]"), filter = "all", q = "";
    var list = PRODUCTS.slice().sort(function (a, b) { return (b.inStock - a.inStock) || a.order - b.order; });
    var status = {}, dir = null, done = 0, found = 0;
    var canWrite = typeof window.showDirectoryPicker === "function";
    body.innerHTML = list.map(function (p) {
      var file = (p.code || p.id) + ".jpg";
      return '<tr data-row="' + esc(p.id) + '" data-q="' + esc(p.search + " " + norm(p.id)) + '">' +
        '<td><div class="thumb">' + media(p) + "</div></td>" +
        '<td><a href="' + productUrl(p) + '" target="_blank" rel="noopener">' + esc(fullName(p)) + "</a><br><small class=\"muted\">" + esc(p.brand) + (p.inStock ? "" : " · hết size") + "</small></td>" +
        '<td><code>' + esc(file) + '</code> <button class="btn btn--ghost btn--sm" data-copy="' + esc(p.code || p.id) + '">Chép tên</button></td>' +
        '<td><label class="drop" data-drop="' + esc(p.id) + '"><input type="file" accept="image/*,.zip" multiple hidden>Kéo ảnh / file zip vào đây<br><small>hoặc bấm để chọn</small></label></td>' +
        '<td data-status class="muted">Đang kiểm tra…</td></tr>';
    }).join("");

    function setStatus(p, text, ok) {
      var cell = $('[data-row="' + p.id + '"] [data-status]', body);
      cell.className = ok ? "status-ok" : "status-miss";
      cell.textContent = text;
    }
    function showStat() { stat.textContent = "Đã kiểm tra " + done + "/" + list.length + " mẫu · " + found + " mẫu có ảnh"; }

    var queue = list.slice();
    function worker() {
      var p = queue.shift();
      if (!p) return;
      findImage(imgBase(p)).then(function (u) {
        if (status[p.id] === undefined) {
          status[p.id] = !!u; if (u) found++;
          setStatus(p, u ? "Đã có ảnh (" + u.split("/").pop() + ")" : "Chưa có ảnh", !!u);
        }
        done++; showStat(); apply(); worker();
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

    // Chọn thư mục images/products một lần để lưu thẳng ảnh vào đó
    var dirBtn = $("[data-pick-dir]"), dirNote = $("[data-dir-note]");
    if (!canWrite) {
      dirBtn.hidden = true;
      dirNote.innerHTML = "Trình duyệt này không lưu thẳng vào thư mục được: ảnh sẽ được <b>tải về (Downloads) với đúng tên</b>, bạn chép chúng vào <b>images/products</b>. Dùng Chrome hoặc Edge và mở web bằng <b>xem-web.bat</b> để lưu thẳng.";
    }
    // Chọn nơi LƯU ảnh: thư mục B-o, B-o\images hay B-o\images\products đều được — tự tìm vào images\products
    function findProductsDir(h) {
      function sub(d, name) { return d.getDirectoryHandle(name).catch(function () { return null; }); }
      var p = h.name === "products" ? Promise.resolve(h)
        : h.name === "images" ? sub(h, "products")
        : sub(h, "images").then(function (i) { return i ? sub(i, "products") : null; });
      // Thư mục ảnh của website có sẵn file README.md — dùng để chắc chắn chọn đúng
      return p.then(function (d) {
        return d ? d.getFileHandle("README.md").then(function () { return d; }, function () { return null; }) : null;
      });
    }
    dirBtn.addEventListener("click", function () {
      window.showDirectoryPicker({ id: "slife-products", mode: "readwrite" }).then(function (h) {
        return findProductsDir(h).then(function (d) {
          dir = d;
          dirNote.innerHTML = d
            ? "✓ Ảnh sẽ được lưu vào <b>B-o\\images\\products</b>. Giờ kéo ảnh / file zip (để ở ổ nào cũng được) thả vào đúng dòng bên dưới."
            : "⚠ Thư mục <b>" + esc(h.name) + "</b> không phải thư mục website. Bấm lại và chọn thư mục <b>B-o</b> (nơi bạn tải website về, VD Documents\\B-o).";
          dirNote.className = d ? "status-ok" : "status-miss";
        });
      }).catch(function () { /* người dùng huỷ */ });
    });

    function exists(name) {
      if (!dir) return Promise.resolve(false);
      return Promise.all(IMG_EXT.map(function (ext) {
        return dir.getFileHandle(name + "." + ext).then(function () { return true; }, function () { return false; });
      })).then(function (r) { return r.some(Boolean); });
    }
    // Tên còn trống: MÃ (nếu chưa có ảnh chính) rồi MÃ-2, MÃ-3… (tối đa MAX_SHOTS)
    var used = {};
    function nextName(p) {
      var stem = p.code || p.id, n = 1;
      used[p.id] = used[p.id] || {};
      function tryN() {
        if (n > MAX_SHOTS) return Promise.resolve(null);
        var name = n === 1 ? stem : stem + "-" + n;
        var known = used[p.id][name] || (n === 1 && status[p.id] === true);
        return (known ? Promise.resolve(true) : exists(name)).then(function (has) {
          if (has) { n++; return tryN(); }
          used[p.id][name] = true;
          return name;
        });
      }
      return tryN();
    }
    function save(name, blob) {
      var ext = blob.type === "image/webp" ? ".webp" : ".jpg";
      if (dir) {
        return dir.getFileHandle(name + ext, { create: true }).then(function (fh) {
          return fh.createWritable().then(function (w) { return w.write(blob).then(function () { return w.close(); }); });
        });
      }
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = name + ext;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      return Promise.resolve();
    }
    function handle(p, dropped) {
      if (canWrite && !dir) { toast("Bấm “Chọn nơi lưu: thư mục website B-o” trước nhé"); return; }
      // File .zip (Canva tải nhiều trang) được giải nén thành ảnh
      Promise.all(Array.prototype.map.call(dropped, function (f) {
        return /\.zip$/i.test(f.name) || f.type === "application/zip" || f.type === "application/x-zip-compressed" ? unzipImages(f) : [f];
      })).then(function (groups) {
        saveAll(p, [].concat.apply([], groups));
      }, function () { toast("Không mở được file zip này — giải nén rồi kéo ảnh vào"); });
    }
    function saveAll(p, files) {
      // Sắp theo tên file (ảnh điện thoại đặt theo thứ tự chụp, Canva đặt theo số trang): ảnh đầu tiên = ảnh chính
      files = files.filter(function (f) { return /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic)$/i.test(f.name); })
        .sort(function (a, b) { return a.name.localeCompare(b.name, undefined, { numeric: true }); });
      if (!files.length) return;
      var chain = Promise.resolve(), savedNames = [];
      files.forEach(function (f) {
        chain = chain.then(function () {
          if (/heic$/i.test(f.name)) throw new Error("heic");
          return Promise.all([shrinkImage(f), nextName(p)]);
        }).then(function (r) {
          if (!r[1]) throw new Error("full");
          return save(r[1], r[0]).then(function () {
            savedNames.push(r[1] + (r[0].type === "image/webp" ? ".webp" : ".jpg"));
            if (!status[p.id]) { status[p.id] = true; found++; showStat(); }
            if (savedNames.length === 1 && r[1] === (p.code || p.id)) {
              var img = $('[data-row="' + p.id + '"] .thumb img', body);
              if (img) { img.src = URL.createObjectURL(r[0]); img.classList.add("ok"); }
            }
          });
        });
      });
      chain.then(function () {
        setStatus(p, (dir ? "Đã lưu " : "Đã tải về ") + savedNames.join(", "), true);
        toast((dir ? "Đã lưu " : "Đã tải về ") + savedNames.length + " ảnh cho " + (p.code || p.name));
      }).catch(function (err) {
        var msg = err.message === "heic" ? "Ảnh HEIC (iPhone) chưa đọc được — gửi qua Zalo/Messenger rồi tải về dạng JPG"
          : err.message === "full" ? "Mẫu này đã đủ " + MAX_SHOTS + " ảnh"
          : err.message === "unreadable" ? "File này không phải ảnh đọc được" : "Không lưu được ảnh: " + err.message;
        toast(msg);
        if (savedNames.length) setStatus(p, (dir ? "Đã lưu " : "Đã tải về ") + savedNames.join(", "), true);
      });
    }
    body.addEventListener("change", function (e) {
      var zone = e.target.closest("[data-drop]");
      if (zone && e.target.files) { handle(BY_ID[zone.dataset.drop], e.target.files); e.target.value = ""; }
    });
    ["dragover", "drop"].forEach(function (t) { window.addEventListener(t, function (e) { e.preventDefault(); }); });
    body.addEventListener("dragover", function (e) {
      var tr = e.target.closest("[data-row]");
      $all(".drop.is-over", body).forEach(function (z) { z.classList.remove("is-over"); });
      if (tr) $(".drop", tr).classList.add("is-over");
    });
    body.addEventListener("drop", function (e) {
      var tr = e.target.closest("[data-row]");
      $all(".drop.is-over", body).forEach(function (z) { z.classList.remove("is-over"); });
      if (tr && e.dataTransfer && e.dataTransfer.files.length) handle(BY_ID[tr.dataset.row], e.dataTransfer.files);
    });
  }

  /* ---------- Trang thông tin: điền thông tin shop vào chỗ [data-shop] ---------- */
  function fillShopInfo() {
    $all("[data-shop]").forEach(function (el) {
      var v = SHOP[el.dataset.shop];
      var row = el.closest("[data-shop-row]");
      if (!v) { if (row) row.hidden = true; return; }
      if (el.tagName === "A" && el.dataset.prefix) el.href = el.dataset.prefix + v;
      el.textContent = v;
    });
    $all("[data-shop-href]").forEach(function (el) {
      var v = SHOP[el.dataset.shopHref];
      var row = el.closest("[data-shop-row]");
      if (!v) { if (row) row.hidden = true; return; }
      el.href = v;
    });
  }

  /* ---------- Khởi động ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderChrome();
    fillShopInfo();
    var page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "shop") initShop();
    if (page === "product") initProduct();
    if (page === "cart") initCart();
    if (page === "checkout") initCheckout();
    if (page === "images") initImages();
  });
})();
