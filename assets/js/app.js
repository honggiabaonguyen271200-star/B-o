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
  var MAX_QTY = 5;
  // Danh sách ảnh đang có (images/products/danh-sach.js, do công cụ nhập ảnh ghi). Thiếu thì tự dò như cũ.
  var MANIFEST = window.PRODUCT_IMAGES || null;
  // Khi đã có danh sách, mẫu ngoài danh sách chỉ dò 2 đuôi phổ biến để bớt tải lỗi
  var EXTS = MANIFEST ? ["webp", "jpg"] : IMG_EXT;
  var REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var GENDER_LABEL = { nam: "Nam", nu: "Nữ", gs: "GS", kid: "Kid", unisex: "Unisex" };
  var BRAND_ORDER = ["New Balance", "Asics", "Onitsuka Tiger", "Jordan", "Nike", "Adidas", "Puma", "Salomon", "On", "Vans", "Converse"];
  var PRICE_QUICK = [
    { label: "Dưới 2 triệu", min: 0, max: 1999 },
    { label: "2 – 3 triệu", min: 2000, max: 2999 },
    { label: "3 – 4 triệu", min: 3000, max: 3999 },
    { label: "Từ 4 triệu", min: 4000, max: 0 },
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
  function compact(s) { return norm(s).replace(/[^a-z0-9]/g, ""); }
  function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  // Giá trong dữ liệu tính theo nghìn đồng: 2600 -> 2.600.000₫
  function money(k) { return k == null ? "Liên hệ" : (k * 1000).toLocaleString("vi-VN") + "₫"; }
  function million(k) { return (k / 1000).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + " tr"; }
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
  function lineUrl(b, l) { return (b ? "shop.html?brand=" + slug(b) + "&line=" : "shop.html?line=") + slug(l); }
  function absUrl(path) { return new URL(path, SHOP.siteUrl || location.href).href; }
  function initials(b) {
    var w = b.split(/\s+/);
    return w.length > 1 ? (w[0][0] + w[1][0]).toUpperCase() : b[0].toUpperCase();
  }
  function handle(url) { var m = String(url || "").match(/(?:instagram\.com|tiktok\.com)\/(@?[^/?#]+)/); return m ? (m[1][0] === "@" ? m[1] : "@" + m[1]) : ""; }
  function debounce(fn, ms) { var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms); }; }

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
      compact: compact([p.brand, p.name, p.code].join(" ")),
    });
  });
  var BY_ID = {}, BY_CODE = {};
  PRODUCTS.forEach(function (p) { BY_ID[p.id] = p; if (p.code) BY_CODE[compact(p.code)] = p; });
  // ?id= nhận cả chữ hoa/thường và cả mã sản phẩm
  function findProduct(id) {
    if (!id) return null;
    return BY_ID[id] || BY_ID[String(id).toLowerCase()] || BY_CODE[compact(id)] || null;
  }
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
    if (!brand) return line;
    if (line === OTHER_LINE) return brand + " — các dòng khác";
    if (/^Giày /.test(line)) return line + " " + brand;
    return line.indexOf(brand.split(" ")[0]) === 0 ? line : brand + " " + line;
  }
  // Mẫu đẹp nhất để làm ảnh đại diện: có ảnh thật, còn nhiều size
  function rank(a, b) { return (hasPhoto(b) - hasPhoto(a)) || (b.sizes.length - a.sizes.length) || (a.order - b.order); }
  function bestOf(list) { return list.slice().sort(rank)[0]; }
  function fromSlug(list, s) { return list.filter(function (x) { return slug(x.name) === s; })[0]; }
  function fitNote(p) {
    for (var i = 0; i < FIT_NOTES.length; i++) if (FIT_NOTES[i].match.test(p.name)) return FIT_NOTES[i];
    return null;
  }
  // Tìm theo tên, hãng, mã (mã viết liền/có gạch đều được)
  function matcher(q) {
    var words = norm(q).split(/\s+/).filter(Boolean), cq = compact(q);
    return function (p) {
      if (!words.length) return true;
      if (cq.length >= 4 && p.compact.indexOf(cq) >= 0) return true;
      for (var i = 0; i < words.length; i++) {
        if (p.search.indexOf(words[i]) < 0 && p.compact.indexOf(compact(words[i])) < 0) return false;
      }
      return true;
    };
  }
  function searchProducts(q) {
    var m = matcher(q), cq = compact(q);
    return PRODUCTS.filter(m).sort(function (a, b) {
      var ca = a.code && compact(a.code).indexOf(cq) === 0 ? 1 : 0, cb = b.code && compact(b.code).indexOf(cq) === 0 ? 1 : 0;
      return (b.inStock - a.inStock) || (cb - ca) || rank(a, b);
    });
  }

  /* ---------- Ảnh ----------
     Ảnh sản phẩm: images/products/<MÃ>.webp, ảnh phụ <MÃ>-2.webp… Website tự dò, không cần khai báo.
     Banner trang chủ: images/banners/banner-1.jpg … (thêm vào hero)
     Banner hãng: images/banners/<tên-hãng>.jpg (VD new-balance.jpg, onitsuka-tiger.jpg)
     Ảnh khách hàng: images/khach-hang/1.jpg … 24.jpg */
  function stemOf(p) { return p.code || p.id; }
  function imgBase(p) { return IMG_DIR + stemOf(p); }
  function shotsOf(p) {
    var list = MANIFEST && MANIFEST[stemOf(p)];
    return list && list.length ? list.map(function (f) { return IMG_DIR + f; }) : null;
  }
  function hasPhoto(p) { return shotsOf(p) ? 1 : 0; }
  window.__slifeOk = function (img) { img.classList.add("ok"); if (img.parentNode) img.parentNode.classList.add("has-photo"); };
  window.__slifeImg = function (img) {
    var i = +img.dataset.i + 1;
    if (i >= EXTS.length) { img.remove(); return; }
    img.dataset.i = i;
    img.src = img.dataset.base + "." + EXTS[i];
  };
  function probe(url) {
    return new Promise(function (resolve) {
      var im = new Image();
      im.onload = function () { resolve(url); };
      im.onerror = function () { resolve(null); };
      im.src = url;
    });
  }
  function findImage(base, exts) {
    var i = 0;
    exts = exts || IMG_EXT;
    function next() {
      if (i >= exts.length) return Promise.resolve(null);
      return probe(base + "." + exts[i++]).then(function (u) { return u || next(); });
    }
    return next();
  }
  // Dò ảnh đánh số base1, base2… cho đến khi thiếu
  function findSeries(base, from, max, exts) {
    var found = [], n = from;
    return new Promise(function (resolve) {
      (function next() {
        if (n > max) return resolve(found);
        findImage(base + n++, exts).then(function (u) { if (u) { found.push(u); next(); } else resolve(found); });
      })();
    });
  }
  // Bộ ảnh của một mẫu: MÃ, MÃ-2 … MÃ-12. Có danh sách thì dùng ngay, không thì dò dần.
  function loadShots(p, onShot) {
    var known = shotsOf(p);
    if (known) { known.forEach(onShot); return; }
    var base = imgBase(p);
    findImage(base, EXTS).then(function (first) {
      if (!first) return;
      onShot(first);
      var n = 2;
      (function next() {
        if (n > MAX_SHOTS) return;
        findImage(base + "-" + n++, EXTS).then(function (u) { if (u) { onShot(u); next(); } });
      })();
    });
  }
  // Ảnh thật nếu có; chưa có thì ô trung tính "Ảnh thật đang cập nhật" (không vẽ giày giả)
  function media(p, o) {
    o = o || {};
    var shots = shotsOf(p), base = imgBase(p);
    return '<div class="media">' +
      '<div class="media__ph" aria-hidden="true"><img src="images/brand/slife-mark-gradient.svg" alt="" width="60" height="61"><span>Ảnh thật đang cập nhật</span></div>' +
      '<img class="media__img" alt="' + esc(fullName(p)) + '" src="' + esc(shots ? shots[0] : base + "." + EXTS[0]) + '" data-base="' + esc(base) + '" data-i="' + (shots ? -1 : 0) + '"' +
      (o.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async" onload="__slifeOk(this)" onerror="__slifeImg(this)">' +
      (o.alt && shots && shots[1] ? '<img class="media__alt" alt="" data-src="' + esc(shots[1]) + '" onload="this.classList.add(\'ok\')">' : "") +
      "</div>";
  }

  /* ---------- Icons ---------- */
  function svg(d, o) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + ((o && o.w) || 1.7) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>"; }
  var I = {
    bag: svg('<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>'),
    bagPlus: svg('<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2M12 11.5v5M9.5 14h5"/>'),
    heart: svg('<path d="M12 20s-7.5-4.6-9.2-9.2C1.6 7.4 3.9 4 7.3 4c2 0 3.4 1.1 4.7 2.8C13.3 5.1 14.7 4 16.7 4c3.4 0 5.7 3.4 4.5 6.8C19.5 15.4 12 20 12 20z"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
    menu: svg('<path d="M4 7h16M4 12h16M4 17h10"/>', { w: 1.9 }),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>', { w: 1.9 }),
    chev: svg('<path d="M9 6l6 6-6 6"/>', { w: 2 }),
    down: svg('<path d="M6 9l6 6 6-6"/>', { w: 2 }),
    left: svg('<path d="M15 6l-6 6 6 6"/>', { w: 2 }),
    right: svg('<path d="M9 6l6 6-6 6"/>', { w: 2 }),
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', { w: 1.9 }),
    check: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff"/></svg>',
    chat: svg('<path d="M20 12c0 4.4-3.6 8-8 8-1.4 0-2.7-.3-3.8-1L4 20l1-3.9C4.4 14.9 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>', { w: 2 }),
    phone: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1l-2.2 2.23z"/></svg>',
    ms: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.4 2 2 6.1 2 11.7c0 2.9 1.2 5.5 3.2 7.2V22l3-1.6c1.2.3 2.5.5 3.8.5 5.6 0 10-4.1 10-9.7S17.6 2 12 2zm1 12.9l-2.6-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.8-2.7-5.3 5.7z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21z"/></svg>',
    ig: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>', { w: 1.8 }),
    tt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.3 2.3 1.7 3.8 4 4v3.1c-1.4.1-2.7-.3-4-1.1v6.1c0 4-3.5 6.3-6.9 5.4-4.3-1.2-5-6.9-1.3-9 1-.6 2.2-.8 3.4-.7v3.2c-.4-.1-.8-.1-1.2 0-1.5.3-2.3 1.9-1.6 3.2.9 1.6 3.6 1.4 3.9-.8V3z"/></svg>',
    link: svg('<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>', { w: 1.8 }),
    share: svg('<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>'),
    copy: svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>'),
    zoom: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M11 8v6M8 11h6"/>', { w: 1.9 }),
    ruler: svg('<path d="M3 16.5L16.5 3 21 7.5 7.5 21z"/><path d="M7 12.5l1.5 1.5M9.5 10l2 2M12 7.5l1.5 1.5M14.5 5l2 2"/>'),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>', { w: 1.9 }),
    pause: svg('<path d="M9 6v12M15 6v12"/>', { w: 2.2 }),
    play: svg('<path d="M8 5.5v13l10-6.5z" fill="currentColor"/>', { w: 1.5 }),
    shield: svg('<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'),
    box: svg('<path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4M12 11v10"/>'),
    swap: svg('<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>'),
    truck: svg('<path d="M2 6h12v10H2zM14 10h4l4 4v2h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>'),
    camera: svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
  };
  var ZL = '<span class="zl">Zalo</span>';

  /* ---------- Giỏ hàng, yêu thích, đã xem ---------- */
  var CART_KEY = "slife_cart_v1";
  var memCart = [];
  function getCart() {
    var c = storage(CART_KEY);
    return (Array.isArray(c) ? c : memCart).filter(function (it) { return BY_ID[it.id]; })
      .map(function (it) { return { id: it.id, size: it.size, qty: Math.max(1, Math.min(MAX_QTY, +it.qty || 1)) }; });
  }
  function setCart(list) { memCart = list; storage(CART_KEY, list); updateBadges(); }
  function addToCart(id, size, qty) {
    var list = getCart();
    var it = list.filter(function (x) { return x.id === id && x.size === size; })[0];
    if (it) it.qty = Math.min(MAX_QTY, it.qty + (qty || 1));
    else list.push({ id: id, size: size, qty: qty || 1 });
    setCart(list);
    var b = $all("[data-cart-count]");
    b.forEach(function (el) { el.classList.remove("is-pop"); void el.offsetWidth; el.classList.add("is-pop"); });
  }
  function itemPrice(p, size) {
    var s = p.sizes.filter(function (x) { return x.s === size; })[0];
    return (s && s.p) || p.price;
  }
  function cartCount(cart) { return cart.reduce(function (t, it) { return t + it.qty; }, 0); }
  function cartTotal(cart) {
    return cart.reduce(function (t, it) { return t + (itemPrice(BY_ID[it.id], it.size) || 0) * it.qty; }, 0);
  }
  var WISH_KEY = "slife_wish_v1";
  function wishes() { return (storage(WISH_KEY) || []).filter(function (id) { return BY_ID[id]; }); }
  function isWished(id) { return wishes().indexOf(id) >= 0; }
  function toggleWish(id) {
    var list = wishes(), i = list.indexOf(id), on = i < 0;
    if (on) list.unshift(id); else list.splice(i, 1);
    storage(WISH_KEY, list);
    $all('[data-wish="' + id + '"]').forEach(function (b) { b.setAttribute("aria-pressed", on); });
    updateBadges();
    toast(on ? "Đã lưu vào Yêu thích" : "Đã bỏ khỏi Yêu thích");
  }
  function wishBtn(p) {
    var on = isWished(p.id);
    return '<button type="button" class="wish" data-wish="' + esc(p.id) + '" aria-pressed="' + on + '" aria-label="Yêu thích ' + esc(p.name) + '">' + I.heart + "</button>";
  }
  function updateBadges() {
    var n = cartCount(getCart()), w = wishes().length;
    $all("[data-cart-count]").forEach(function (el) { el.textContent = n; el.hidden = !n; });
    $all("[data-wish-count]").forEach(function (el) { el.textContent = w; el.hidden = !w; });
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
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite"); document.body.appendChild(t); }
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
  // Giữ phím Tab trong hộp thoại, trả lại vị trí cũ khi đóng
  function trapFocus(box) {
    function onKey(e) {
      if (e.key !== "Tab") return;
      var f = $all('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', box).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
    box.addEventListener("keydown", onKey);
    return function () { box.removeEventListener("keydown", onKey); };
  }
  function modal(html, cls) {
    var opener = document.activeElement;
    var wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.innerHTML = '<div class="modal__box ' + (cls || "") + '" role="dialog" aria-modal="true">' +
      '<button type="button" class="icon-btn modal__x" data-close aria-label="Đóng">' + I.close + "</button>" + html + "</div>";
    var box = wrap.firstChild, untrap = trapFocus(box);
    var h = $("h3", box);
    if (h) { h.id = "m-" + Date.now(); box.setAttribute("aria-labelledby", h.id); }
    function close() {
      wrap.remove(); untrap(); document.removeEventListener("keydown", onKey); document.body.style.overflow = "";
      if (opener && opener.focus) opener.focus();
    }
    function onKey(e) { if (e.key === "Escape") close(); }
    wrap.addEventListener("click", function (e) { if (e.target === wrap || e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(wrap);
    document.body.style.overflow = "hidden";
    var first = $("[data-autofocus]", box) || $(".modal__x", box);
    if (first) first.focus();
    return { el: wrap, close: close };
  }
  // Hộp thoại gửi tin nhắn cho shop qua Zalo (tư vấn, hỏi hàng, order)
  function orderModal(title, build, askFoot) {
    var m = modal(
      "<h3>" + esc(title) + "</h3>" +
      (askFoot ? '<div class="field" style="margin-top:10px"><label for="m-foot">Chiều dài bàn chân (cm) — không bắt buộc</label><input id="m-foot" inputmode="decimal" placeholder="VD: 25"><span class="hint">Để shop kiểm tra lại size giúp cho chắc.</span></div>' : "") +
      '<div class="order-msg" data-msg></div>' +
      '<p class="muted" style="font-size:13px;margin:10px 0 0">Bấm nút bên dưới: tin nhắn được sao chép, bạn dán vào khung chat Zalo rồi gửi. Shop xác nhận còn size, báo tổng tiền và phí ship.</p>' +
      '<div class="modal__actions"><button class="btn btn--ghost" data-close>Đóng</button>' +
      '<a class="btn btn--zalo" href="' + esc(SHOP.zalo) + '" target="_blank" rel="noopener" data-go>Sao chép & mở Zalo</a></div>'
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
  function askZalo(p, size) {
    orderModal(p.inStock ? "Tư vấn qua Zalo" : "Hỏi order qua Zalo", function (foot) {
      return (p.inStock ? "Chào shop, mình cần tư vấn đôi này:\n" : "Chào shop, mình muốn hỏi order đôi này:\n") + fullName(p) + "\n" +
        "Mã: " + (p.code || p.name) + " / Size: " + (size || "…") + " / Chân dài: " + (foot ? foot.replace(/\s*cm$/i, "") : "…") + " cm\n" +
        "Link: " + absUrl(productUrl(p));
    }, true);
  }

  // Chọn size nhanh từ thẻ sản phẩm
  function quickAdd(p) {
    var sel = p.sizes.length === 1 ? p.sizes[0].s : null;
    var m = modal(
      "<h3>Chọn size</h3>" +
      '<div class="quick"><div class="quick__img">' + media(p) + "</div><div><b>" + esc(fullName(p)) + '</b><span data-q-price>' + money(p.minPrice) + "</span></div></div>" +
      '<div class="pd__sizehead"><span>Size (EU): <b data-q-label>' + esc(sel || "chưa chọn") + '</b></span><a class="pd__guide" href="size-guide.html">Hướng dẫn chọn size</a></div>' +
      '<div class="sizes" role="group" aria-label="Chọn size">' + p.sizes.map(function (s) {
        return '<button type="button" data-qs="' + esc(s.s) + '"' + (s.s === sel ? ' class="is-active" aria-pressed="true"' : ' aria-pressed="false"') + ">" + esc(s.s) + "</button>";
      }).join("") + "</div>" +
      (fitNote(p) ? '<div class="fit" style="margin:14px 0 0">' + I.info + "<div><b>Lưu ý form:</b> " + esc(fitNote(p).advice) + "</div></div>" : "") +
      '<div class="modal__actions"><a class="btn btn--ghost" href="' + productUrl(p) + '">Xem chi tiết</a><button class="btn btn--grad" data-q-add>' + I.bagPlus + "Thêm vào giỏ</button></div>"
    );
    m.el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-qs]");
      if (b) {
        sel = b.dataset.qs;
        $all("[data-qs]", m.el).forEach(function (x) { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", x === b); });
        $("[data-q-label]", m.el).textContent = sel;
        $("[data-q-price]", m.el).textContent = money(itemPrice(p, sel));
      }
      if (e.target.closest("[data-q-add]")) {
        if (!sel) { toast("Bạn chọn size trước nhé"); var g = $(".sizes", m.el); g.classList.remove("is-shake"); void g.offsetWidth; g.classList.add("is-shake"); return; }
        addToCart(p.id, sel, 1);
        m.close();
        openMini(p.id + "|" + sel);
      }
    });
  }

  function pill(kind, text, sm) { return '<span class="pill pill--' + kind + (sm ? " pill--sm" : "") + '">' + esc(text) + "</span>"; }
  function card(p) {
    var tags = [];
    if (!p.inStock) tags.push(pill("order", "Hết size · nhận order", 1));
    else if (p.sizes.length === 1) tags.push(pill("info", "Còn 1 size", 1));
    if (p.sale) tags.push(pill("out", "Xả kho", 1));
    if (p.gender === "nu") tags.push(pill("g", "Code nữ", 1));
    if (p.gender === "gs" || p.gender === "kid") tags.push(pill("g", GENDER_LABEL[p.gender], 1));
    var url = productUrl(p);
    var sizes = p.sizes.map(function (s) { return s.s; });
    return (
      '<article class="card' + (p.inStock ? "" : " is-out") + '">' +
      '<div class="card__img"><a class="card__imglink" href="' + url + '" tabindex="-1" aria-hidden="true">' + media(p, { alt: true }) + "</a>" +
      '<div class="card__badges">' + tags.join("") + "</div>" + wishBtn(p) +
      (p.inStock ? '<button type="button" class="card__quick" data-quick="' + esc(p.id) + '" aria-label="Thêm nhanh ' + esc(p.name) + ' vào giỏ">' + I.bagPlus + "<span>Thêm nhanh</span></button>" : "") +
      "</div>" +
      '<div class="card__body">' + (norm(p.name).indexOf(norm(p.brand)) === 0 ? "" : '<div class="card__brand">' + esc(p.brand) + "</div>") +
      '<h3 class="card__name"><a href="' + url + '">' + esc(p.name) + "</a></h3>" +
      (p.code ? '<div class="card__code">' + esc(p.code) + "</div>" : "") +
      (p.inStock ? '<div class="card__sizes">Size ' + esc(sizes.join(" · ")) + "</div>" : "") +
      (p.inStock
        ? '<div class="card__price">' + (p.minPrice < p.price ? "<small>Từ</small>" : "") + money(p.minPrice) + "</div>"
        : '<div class="card__price is-out">Nhắn shop báo giá</div>') +
      "</div></article>"
    );
  }
  function crumbs(list) {
    return '<nav class="breadcrumb" aria-label="Breadcrumb">' + list.map(function (c, i) {
      return (i ? '<span aria-hidden="true">/</span>' : "") + (c[1] ? '<a href="' + c[1] + '">' + esc(c[0]) + "</a>" : '<b style="font-weight:500">' + esc(c[0]) + "</b>");
    }).join("") + "</nav>";
  }
  function railBody(list) {
    return '<div class="rail-wrap"><button type="button" class="rail-nav rail-nav--prev" data-rail="-1" aria-label="Xem mẫu trước">' + I.left + "</button>" +
      '<div class="rail" data-rail-track>' + list.map(card).join("") + "</div>" +
      '<button type="button" class="rail-nav rail-nav--next" data-rail="1" aria-label="Xem thêm mẫu">' + I.right + "</button></div>";
  }
  // Khối sản phẩm có tiêu đề; vuốt ngang trên điện thoại, nút ‹ › trên máy tính
  function rail(title, list, moreHref, moreText, sub) {
    if (!list.length) return "";
    return '<section class="sec"><div class="sec__head"><h2 class="sec__title">' + esc(title) + "</h2>" + (sub ? '<p class="sec__sub">' + esc(sub) + "</p>" : "") + "</div>" +
      railBody(list) +
      (moreHref ? '<div class="sec__foot"><a class="sec__link" href="' + moreHref + '">' + esc(moreText || "Xem tất cả") + I.arrow + "</a></div>" : "") + "</section>";
  }
  function bindRails(root) {
    $all("[data-rail-track]", root).forEach(function (track) {
      if (track.dataset.bound) return;
      track.dataset.bound = 1;
      var wrap = track.parentNode, prev = $(".rail-nav--prev", wrap), next = $(".rail-nav--next", wrap);
      function sync() {
        prev.disabled = track.scrollLeft < 8;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      }
      track.addEventListener("scroll", debounce(sync, 60), { passive: true });
      wrap.addEventListener("click", function (e) {
        var b = e.target.closest("[data-rail]");
        if (b) track.scrollBy({ left: +b.dataset.rail * track.clientWidth * 0.9, behavior: REDUCED ? "auto" : "smooth" });
      });
      sync();
    });
  }

  /* ---------- Giỏ trượt từ phải ---------- */
  var layerOpener = null, layerUntrap = null;
  function openLayer(el, open) {
    if (!el) return;
    el.classList.toggle("is-open", open);
    el.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      layerOpener = document.activeElement;
      layerUntrap = trapFocus(el);
      var f = $("[data-autofocus]", el) || $(".drawer__head button", el) || $(".filters__head button", el);
      if (f) setTimeout(function () { f.focus(); }, 60);
    } else {
      if (layerUntrap) layerUntrap();
      if (layerOpener && layerOpener.focus && document.contains(layerOpener)) layerOpener.focus();
    }
  }
  function openMini(newKey) {
    var el = $("#mini");
    if (!el) { location.href = "cart.html"; return; }
    var cart = getCart();
    $("[data-mini-body]", el).innerHTML =
      (newKey ? '<div class="mini__ok" role="status">' + I.check + "Đã thêm vào giỏ hàng</div>" : "") +
      (cart.length
        ? '<div class="mini__list">' + cart.map(function (it) {
          var p = BY_ID[it.id];
          return '<div class="mini__item' + (newKey === it.id + "|" + it.size ? " mini__new" : "") + '"><a class="mini__img" href="' + productUrl(p) + '">' + media(p) + "</a>" +
            '<div><a class="mini__name" href="' + productUrl(p) + '">' + esc(fullName(p)) + '</a><div class="mini__meta">Size ' + esc(it.size) + " · SL " + it.qty + "</div></div>" +
            '<div class="mini__price">' + money(itemPrice(p, it.size) * it.qty) + "</div></div>";
        }).join("") + "</div>" +
          '<div class="mini__foot"><div class="mini__sum"><span>Tạm tính (' + cartCount(cart) + ' đôi)</span><b>' + money(cartTotal(cart)) + "</b></div>" +
          '<p class="muted" style="font-size:13px;margin:0">Phí ship shop báo khi xác nhận đơn. Được mở hộp kiểm tra trước khi trả tiền.</p>' +
          '<div class="row2"><a class="btn btn--ghost" href="cart.html">Xem giỏ hàng</a><a class="btn btn--grad" href="dat-hang.html" data-autofocus>Đặt hàng</a></div>' +
          '<button type="button" class="link" data-mini-close style="justify-self:center">Tiếp tục mua sắm</button></div>'
        : '<div class="mini__empty"><p>Giỏ hàng đang trống.</p><a class="btn btn--grad" href="shop.html">Xem hàng sẵn</a></div>');
    openLayer(el, true);
  }

  /* ---------- Header / Menu / Footer ---------- */
  function needsList() {
    function count(f) { return IN_STOCK.filter(f).length; }
    var tennis = count(function (p) { return p.line === "Giày tennis"; });
    return [
      { label: "Giày nữ", sub: "Mẫu code nữ", href: "shop.html?gender=nu", n: count(function (p) { return p.gender === "nu"; }) },
      { label: "Size GS / Kid", sub: "Size trẻ em lớn, hợp chân nhỏ", href: "shop.html?gender=gs,kid", n: count(function (p) { return p.gender === "gs" || p.gender === "kid"; }) },
      { label: "Giày tennis", sub: "Asics, Nike", href: lineUrl(null, "Giày tennis"), n: tennis },
      { label: "Dưới 2 triệu", sub: "Giá tốt để bắt đầu", href: "shop.html?max=1999", n: count(function (p) { return p.minPrice < 2000; }) },
      { label: "2 – 3 triệu", sub: "Tầm giá phổ biến", href: "shop.html?min=2000&max=2999", n: count(function (p) { return p.minPrice >= 2000 && p.minPrice < 3000; }) },
      { label: "Còn nhiều size", sub: "Dễ chọn size nhất", href: "shop.html?sort=sizes", n: IN_STOCK.length },
    ].filter(function (x) { return x.n > 0; });
  }
  function renderChrome() {
    var brands = brandList();
    var q = params().get("q") || "";
    var page = document.body.dataset.page;
    var file = location.pathname.split("/").pop() || "index.html";
    var needs = needsList();
    var headerEl = $("#site-header");
    if (headerEl) {
      var msgs = (SHOP.announcements && SHOP.announcements.length ? SHOP.announcements : [SHOP.announcement]).filter(Boolean);
      var annKey = msgs.join("|");
      var showAnn = msgs.length && storage("slife_ann_off") !== annKey;
      function navLink(href, text) { return '<div class="nav__item"><a class="nav__link" href="' + href + '"' + (file === href ? ' aria-current="page"' : "") + ">" + text + "</a></div>"; }
      headerEl.outerHTML =
        '<a class="skip" href="#main">Bỏ qua, tới nội dung chính</a>' +
        (showAnn ? '<div class="announce" data-announce><div class="container announce__in"><div class="announce__msgs">' +
          msgs.map(function (m, i) { return "<span" + (i ? ' aria-hidden="true"' : ' class="is-on"') + ">" + esc(m) + "</span>"; }).join("") +
          '</div><button type="button" class="announce__x" data-ann-close aria-label="Ẩn thông báo">' + I.close + "</button></div></div>" : "") +
        '<header class="hd"><div class="container hd__row">' +
        '<button type="button" class="icon-btn hd__menu" data-menu-open aria-label="Mở menu" aria-controls="menu" aria-expanded="false">' + I.menu + "</button>" +
        '<a class="logo" href="index.html" aria-label="' + esc(SHOP.name) + ' — Trang chủ"><img class="logo__mark" src="images/brand/slife-mark-gradient.svg" alt="" width="40" height="41"><img class="logo__word" src="images/brand/slife-wordmark-ink.svg" alt="S&amp;LIFE" width="58" height="19"></a>' +
        '<form class="search" action="shop.html" role="search" data-search>' + '<svg class="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
        '<input type="search" name="q" value="' + esc(q) + '" placeholder="Tìm tên giày hoặc mã, VD: 204L, U204LMMC" aria-label="Tìm giày theo tên hoặc mã" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="search-pop">' +
        '<button type="submit" class="search__go">Tìm</button><div class="search__pop" id="search-pop" role="listbox" aria-label="Gợi ý tìm kiếm" hidden></div></form>' +
        '<nav class="nav" aria-label="Menu chính">' +
        navLink("shop.html", "Tất cả giày") +
        '<div class="nav__item" data-mega-item><button type="button" class="nav__link" aria-expanded="false" aria-controls="mega-brands">Thương hiệu' + I.down + "</button>" +
        '<div class="mega" id="mega-brands"><div class="container mega__in">' +
        brands.map(function (b) {
          var lines = lineList(b.name).filter(function (l) { return l.name !== OTHER_LINE; });
          return '<div class="mega__col"><h4><a href="' + brandUrl(b.name) + '">' + esc(b.name) + "</a><small>" + b.count + " mẫu</small></h4>" +
            (lines.length ? "<ul>" + lines.map(function (l) { return '<li><a href="' + lineUrl(b.name, l.name) + '">' + esc(l.name) + " <small>" + l.count + "</small></a></li>"; }).join("") + "</ul>" : "") +
            "</div>";
        }).join("") + "</div></div></div>" +
        '<div class="nav__item" data-mega-item><button type="button" class="nav__link" aria-expanded="false" aria-controls="mega-needs">Theo nhu cầu' + I.down + "</button>" +
        '<div class="mega" id="mega-needs"><div class="container mega__in mega__in--needs">' +
        needs.map(function (x) { return '<a class="need" href="' + x.href + '"><b>' + esc(x.label) + "</b><span>" + esc(x.sub) + " · " + x.n + " mẫu</span></a>"; }).join("") +
        "</div></div></div>" +
        navLink("size-guide.html", "Hướng dẫn size") + navLink("lien-he.html", "Liên hệ") +
        "</nav>" +
        '<div class="hd__icons">' +
        '<a class="icon-btn" href="shop.html?wish=1" aria-label="Yêu thích">' + I.heart + '<span class="badge" data-wish-count hidden>0</span></a>' +
        '<a class="icon-btn" href="cart.html" aria-label="Giỏ hàng">' + I.bag + '<span class="badge" data-cart-count hidden>0</span></a>' +
        "</div></div></header>" +
        // Ngăn kéo menu điện thoại
        '<div class="drawer" id="menu" aria-hidden="true"><div class="drawer__backdrop" data-menu-close></div>' +
        '<div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">' +
        '<div class="drawer__head"><b>Menu</b><button type="button" class="icon-btn" data-menu-close aria-label="Đóng menu">' + I.close + "</button></div>" +
        '<div class="drawer__body">' +
        '<div class="drawer__title">Giày theo hãng</div>' +
        '<div class="m-item"><div class="m-row"><a href="shop.html">Tất cả giày <small>' + IN_STOCK.length + " mẫu</small></a></div></div>" +
        brands.map(function (b) {
          var lines = lineList(b.name);
          return '<div class="m-item"><div class="m-row"><a href="' + brandUrl(b.name) + '">' + esc(b.name) + " <small>" + b.count + "</small></a>" +
            (lines.length > 1 ? '<button type="button" class="m-toggle" data-menu-sub aria-expanded="false" aria-label="Các dòng ' + esc(b.name) + '">' + I.chev + "</button>" : "") +
            "</div>" +
            (lines.length > 1 ? '<div class="m-sub">' + lines.map(function (l) {
              return '<a href="' + lineUrl(b.name, l.name) + '">' + esc(l.name) + " <small>" + l.count + "</small></a>";
            }).join("") + "</div>" : "") +
            "</div>";
        }).join("") +
        '<div class="drawer__title">Theo nhu cầu</div><div class="m-links">' +
        needs.map(function (x) { return '<a href="' + x.href + '">' + esc(x.label) + "</a>"; }).join("") + "</div>" +
        '<div class="drawer__title">Hỗ trợ</div><div class="m-links">' +
        '<a href="shop.html?wish=1">Yêu thích</a><a href="size-guide.html">Hướng dẫn chọn size</a><a href="policy.html">Đổi trả, ship &amp; thanh toán</a><a href="gioi-thieu.html">Giới thiệu</a><a href="lien-he.html">Liên hệ</a><a href="cart.html">Giỏ hàng</a></div>' +
        '<div class="m-contact">Tư vấn size, kiểm tra hàng: <a href="tel:' + esc(SHOP.phone) + '"><b>' + esc(SHOP.phoneDisplay) + "</b></a> (Zalo / gọi, " + esc(SHOP.openHours) + ")</div>" +
        "</div></div></div>" +
        // Giỏ trượt
        '<div class="drawer drawer--right" id="mini" aria-hidden="true"><div class="drawer__backdrop" data-mini-close></div>' +
        '<div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Giỏ hàng">' +
        '<div class="drawer__head"><b>Giỏ hàng</b><button type="button" class="icon-btn" data-mini-close aria-label="Đóng giỏ hàng">' + I.close + "</button></div>" +
        '<div data-mini-body style="display:flex;flex-direction:column;flex:1;min-height:0"></div></div></div>';
    }

    var footerEl = $("#site-footer");
    if (footerEl) {
      var social = [
        SHOP.facebook ? ["Facebook S&LIFE Sneakers", SHOP.facebook, I.fb] : null,
        ["Instagram S&LIFE Sneakers", SHOP.instagram, I.ig],
        ["TikTok S&LIFE", SHOP.tiktok, I.tt],
        ["Zalo " + SHOP.phoneDisplay, SHOP.zalo, "Zalo"],
        SHOP.facebookOwner ? ["Facebook chủ shop", SHOP.facebookOwner, I.fb] : null,
      ].filter(function (s) { return s && s[1]; });
      footerEl.outerHTML =
        '<footer class="ft"><div class="container">' +
        '<div class="ft__trust">' +
        "<div>" + I.shield + "<p style=\"margin:0\"><b>Chính hãng</b><span>Mã sản phẩm khớp tem hộp</span></p></div>" +
        "<div>" + I.box + "<p style=\"margin:0\"><b>Đồng kiểm</b><span>Mở hộp kiểm tra trước khi trả tiền</span></p></div>" +
        "<div>" + I.swap + '<p style="margin:0"><b>Đổi size ' + SHOP.returnDays + " ngày</b><span>Còn nguyên hộp, tem</span></p></div>" +
        "<div>" + I.truck + '<p style="margin:0"><b>Ship toàn quốc</b><span>COD cọc ' + SHOP.depositPercent + "%</span></p></div></div>" +
        '<div class="ft__grid">' +
        '<div><a href="index.html" aria-label="' + esc(SHOP.name) + '"><img class="ft__logo" src="images/brand/slife-full-white.svg" alt="S&amp;LIFE Since 2021" width="150" height="224" loading="lazy" style="width:96px"></a>' +
        '<ul class="ft__info">' +
        (SHOP.legalName ? "<li>" + esc(SHOP.legalName) + "</li>" : "") +
        (SHOP.address ? "<li>Địa chỉ: " + esc(SHOP.address) + "</li>" : "") +
        '<li>Hotline / Zalo: <a href="tel:' + esc(SHOP.phone) + '">' + esc(SHOP.phoneDisplay) + "</a> (" + esc(SHOP.openHours) + ")</li>" +
        (SHOP.email ? '<li>Email: <a href="mailto:' + esc(SHOP.email) + '">' + esc(SHOP.email) + "</a></li>" : "") +
        (SHOP.taxCode ? "<li>MST / GPKD: " + esc(SHOP.taxCode) + "</li>" : "") +
        "<li>Bán hàng online, giao toàn quốc</li></ul>" +
        '<div class="ft__social">' + social.map(function (s) {
          return '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener" aria-label="' + esc(s[0]) + '" title="' + esc(s[0]) + '">' + s[2] + "</a>";
        }).join("") + "</div></div>" +
        "<div><h4>Cửa hàng</h4><ul>" +
        '<li><a href="shop.html">Tất cả giày</a></li>' +
        brands.slice(0, 7).map(function (b) { return '<li><a href="' + brandUrl(b.name) + '">Giày ' + esc(b.name) + "</a></li>"; }).join("") +
        '<li><a href="shop.html?wish=1">Yêu thích</a></li>' +
        "</ul></div>" +
        '<div><h4>Hỗ trợ</h4><ul><li><a href="gioi-thieu.html">Giới thiệu</a></li><li><a href="policy.html#dat-hang">Hướng dẫn đặt hàng</a></li><li><a href="size-guide.html">Hướng dẫn chọn size</a></li><li><a href="policy.html#doi-tra">Chính sách đổi trả</a></li><li><a href="policy.html#ship">Vận chuyển &amp; thanh toán</a></li><li><a href="policy.html#khieu-nai">Giải quyết khiếu nại</a></li><li><a href="chinh-sach-bao-mat.html">Chính sách bảo mật</a></li><li><a href="lien-he.html">Liên hệ</a></li></ul></div>' +
        "<div><h4>Thanh toán</h4>" +
        '<div class="ft__pay"><span>COD</span><span>Chuyển khoản</span><span>VietQR</span></div>' +
        '<p class="ft__note">Được mở hộp kiểm tra trước khi trả tiền. Giá và tồn kho có thể thay đổi trong ngày — nhắn shop xác nhận size trước khi chuyển khoản.</p>' +
        (SHOP.bctUrl ? '<a class="ft__bct" href="' + esc(SHOP.bctUrl) + '" target="_blank" rel="noopener">✓ Đã thông báo Bộ Công Thương</a>' : "") +
        "</div></div>" +
        '<div class="ft__bottom"><span>© ' + new Date().getFullYear() + " " + esc(SHOP.name) + ' · Since 2021</span><button type="button" data-top>Lên đầu trang ↑</button></div>' +
        "</div></footer>" +
        '<div class="chat" data-chat><div class="chat__panel" id="chat-panel" role="dialog" aria-label="Liên hệ shop">' +
        '<div class="chat__head"><b>Nhắn S&amp;LIFE</b><small>Tư vấn size, kiểm tra hàng · ' + esc(SHOP.openHours) + "</small></div>" +
        '<a href="' + esc(SHOP.zalo) + '" target="_blank" rel="noopener"><span class="chat__ic chat__ic--zalo">Zalo</span><span>Chat Zalo<small>' + esc(SHOP.phoneDisplay) + "</small></span></a>" +
        (SHOP.facebook ? '<a href="' + esc(SHOP.facebook) + '" target="_blank" rel="noopener"><span class="chat__ic chat__ic--ms">' + I.ms + "</span><span>Messenger<small>Fanpage S&amp;LIFE Sneakers</small></span></a>" : "") +
        '<a href="tel:' + esc(SHOP.phone) + '"><span class="chat__ic chat__ic--tel">' + I.phone + "</span><span>Gọi shop<small>" + esc(SHOP.phoneDisplay) + "</small></span></a>" +
        '</div><button type="button" class="chat__btn" data-chat-toggle aria-expanded="false" aria-controls="chat-panel" aria-label="Liên hệ shop">' +
        '<span class="i-chat">' + I.chat + '</span><span class="i-x">' + I.close + "</span></button></div>";
    }

    var hd = $(".hd");
    // Chiều cao header thật (để thanh lọc, cột ảnh dính đúng chỗ)
    function syncHd() { if (hd) document.documentElement.style.setProperty("--hd-h", hd.offsetHeight + "px"); }
    syncHd();
    window.addEventListener("resize", debounce(syncHd, 100));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHd);
    window.addEventListener("scroll", function () { if (hd) hd.classList.toggle("is-scrolled", window.scrollY > 4); }, { passive: true });

    // Thanh thông báo tự đổi câu
    var ann = $("[data-announce]");
    if (ann) {
      var spans = $all(".announce__msgs span", ann), ai = 0, paused = false;
      ann.addEventListener("mouseenter", function () { paused = true; });
      ann.addEventListener("mouseleave", function () { paused = false; });
      if (spans.length > 1 && !REDUCED) setInterval(function () {
        if (paused || document.hidden) return;
        spans[ai].classList.remove("is-on"); spans[ai].setAttribute("aria-hidden", "true");
        ai = (ai + 1) % spans.length;
        spans[ai].classList.add("is-on"); spans[ai].removeAttribute("aria-hidden");
      }, 4500);
    }

    var menu = $("#menu"), chat = $("[data-chat]");
    function closeMegas(except) { $all("[data-mega-item].is-open").forEach(function (it) { if (it !== except) { it.classList.remove("is-open"); $(".nav__link", it).setAttribute("aria-expanded", "false"); } }); }
    function toggleChat(open) {
      if (!chat) return;
      chat.classList.toggle("is-open", open);
      $("[data-chat-toggle]", chat).setAttribute("aria-expanded", open);
    }
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (t.closest("[data-menu-open]")) { openLayer(menu, true); $("[data-menu-open]").setAttribute("aria-expanded", "true"); }
      if (t.closest("[data-menu-close]")) { openLayer(menu, false); $("[data-menu-open]").setAttribute("aria-expanded", "false"); }
      if (t.closest("[data-mini-close]")) openLayer($("#mini"), false);
      var sub = t.closest("[data-menu-sub]");
      if (sub) { var it = sub.closest(".m-item"); it.classList.toggle("is-open"); sub.setAttribute("aria-expanded", it.classList.contains("is-open")); }
      var megaBtn = t.closest("[data-mega-item] > .nav__link");
      if (megaBtn) {
        var item = megaBtn.parentNode, open = !item.classList.contains("is-open");
        closeMegas(item);
        item.classList.toggle("is-open", open);
        megaBtn.setAttribute("aria-expanded", open);
      } else if (!t.closest(".mega")) closeMegas();
      if (t.closest("[data-chat-toggle]")) toggleChat(!chat.classList.contains("is-open"));
      else if (chat && !t.closest("[data-chat]")) toggleChat(false);
      if (t.closest("[data-ann-close]")) { storage("slife_ann_off", annKeyOf()); $("[data-announce]").remove(); syncHd(); }
      if (t.closest("[data-top]")) window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
      var w = t.closest("[data-wish]");
      if (w) { e.preventDefault(); toggleWish(w.dataset.wish); }
      var qa = t.closest("[data-quick]");
      if (qa) { e.preventDefault(); quickAdd(BY_ID[qa.dataset.quick]); }
    });
    function annKeyOf() { return ((SHOP.announcements && SHOP.announcements.length ? SHOP.announcements : [SHOP.announcement]).filter(Boolean)).join("|"); }
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (menu && menu.classList.contains("is-open")) { openLayer(menu, false); }
      var mini = $("#mini");
      if (mini && mini.classList.contains("is-open")) openLayer(mini, false);
      closeMegas(); toggleChat(false);
    });
    // Ảnh thứ hai khi rê chuột lên thẻ (chỉ tải khi cần)
    document.addEventListener("mouseover", function (e) {
      var c = e.target.closest && e.target.closest(".card");
      if (!c) return;
      var a = $(".media__alt[data-src]", c);
      if (a) { a.src = a.dataset.src; a.removeAttribute("data-src"); }
    });
    $all("[data-search]").forEach(initSearch);
    updateBadges();
  }

  /* ---------- Ô tìm kiếm: gợi ý tức thì ---------- */
  function initSearch(form) {
    var input = $("input", form), pop = $(".search__pop", form), active = -1, lastQ = null;
    var popular = [];
    brandList().forEach(function (b) {
      lineList(b.name).forEach(function (l) { if (l.name !== OTHER_LINE && l.count >= 8) popular.push({ t: lineTitle(b.name, l.name), href: lineUrl(b.name, l.name), n: l.count }); });
    });
    popular.sort(function (a, b) { return b.n - a.n; });
    function items() { return $all("[data-sug]", pop); }
    function setActive(i) {
      var list = items();
      active = list.length ? (i + list.length) % list.length : -1;
      list.forEach(function (x, j) { x.classList.toggle("is-active", j === active); x.setAttribute("aria-selected", j === active); });
      if (active >= 0) { input.setAttribute("aria-activedescendant", list[active].id); list[active].scrollIntoView({ block: "nearest" }); }
      else input.removeAttribute("aria-activedescendant");
    }
    function show(open) { pop.hidden = !open; input.setAttribute("aria-expanded", open); if (!open) active = -1; }
    function render() {
      var q = input.value.trim();
      if (q === lastQ && !pop.hidden) return;
      lastQ = q;
      active = -1;
      if (!q) {
        pop.innerHTML = '<div class="sug-head">Dòng giày được tìm nhiều</div><div class="sug-chips">' +
          popular.slice(0, 8).map(function (x, i) { return '<a href="' + x.href + '" id="sg-p' + i + '" role="option" data-sug>' + esc(x.t) + "</a>"; }).join("") + "</div>";
        show(true);
        return;
      }
      var res = searchProducts(q);
      pop.innerHTML = res.length
        ? res.slice(0, 6).map(function (p, i) {
          return '<a class="sug" href="' + productUrl(p) + '" id="sg-' + i + '" role="option" data-sug><span class="sug__img">' + media(p) + "</span>" +
            '<span><span class="sug__name">' + esc(p.name) + '</span><span class="sug__code">' + esc(p.code || p.brand) + (p.inStock ? "" : " · hết size") + "</span></span>" +
            '<span class="sug__price">' + (p.inStock ? money(p.minPrice) : "") + "</span></a>";
        }).join("") + '<a class="sug-all" href="shop.html?q=' + encodeURIComponent(q) + '" id="sg-all" role="option" data-sug>Xem tất cả ' + res.length + " kết quả" + I.arrow.replace("<svg", '<svg width="18" height="18"') + "</a>"
        : '<div class="sug-empty">Chưa thấy mẫu “' + esc(q) + '”. Thử gõ mã in trên tem hộp, hoặc <a href="' + esc(SHOP.zalo) + '" target="_blank" rel="noopener">nhắn Zalo</a> để shop tìm giúp.</div>';
      show(true);
    }
    input.addEventListener("input", debounce(render, 90));
    input.addEventListener("focus", render);
    input.addEventListener("keydown", function (e) {
      if (pop.hidden && e.key !== "Escape") return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      if (e.key === "Enter" && active >= 0) { e.preventDefault(); items()[active].click(); }
      if (e.key === "Escape") { show(false); lastQ = null; }
    });
    document.addEventListener("click", function (e) { if (!form.contains(e.target)) { show(false); lastQ = null; } });
    form.addEventListener("submit", function (e) {
      var q = input.value.trim();
      if (!q) { e.preventDefault(); input.focus(); return; }
      // Gõ đúng mã sản phẩm: vào thẳng trang sản phẩm
      var exact = BY_CODE[compact(q)];
      if (exact) { e.preventDefault(); location.href = productUrl(exact); }
    });
  }

  /* ---------- Trang chủ ---------- */
  function hero(root, slides) {
    var track = $("[data-hero-track]", root), dots = $("[data-hero-dots]", root), pauseBtn = $("[data-hero-pause]", root);
    var cur = 0, timer, playing = !REDUCED, hover = false;
    function all() { return $all(".hero__slide", track); }
    function paint() {
      var list = all();
      dots.innerHTML = list.length > 1 ? list.map(function (s, i) { return '<button type="button" data-dot="' + i + '" aria-label="Xem slide ' + (i + 1) + '"></button>'; }).join("") : "";
      $all(".hero__nav", root).forEach(function (n) { n.hidden = list.length < 2; });
      go(cur, true);
    }
    function go(i, silent) {
      var list = all();
      if (!list.length) return;
      cur = (i + list.length) % list.length;
      track.style.transform = "translateX(" + (-100 * cur) + "%)";
      list.forEach(function (s, j) { s.setAttribute("aria-hidden", j !== cur); s.inert = j !== cur; });
      $all("[data-dot]", dots).forEach(function (d, j) { d.classList.toggle("is-active", j === cur); d.setAttribute("aria-current", j === cur); });
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (playing && !hover && all().length > 1) timer = setTimeout(function () { go(cur + 1); }, 6500);
    }
    function setPlay(on) {
      playing = on;
      pauseBtn.innerHTML = on ? I.pause : I.play;
      pauseBtn.setAttribute("aria-label", on ? "Tạm dừng tự chuyển" : "Tự chuyển slide");
      schedule();
    }
    track.innerHTML = slides.join("");
    root.addEventListener("click", function (e) {
      var d = e.target.closest("[data-dot]"), n = e.target.closest("[data-hero-go]");
      if (d) go(+d.dataset.dot);
      if (n) go(cur + (+n.dataset.heroGo));
      if (e.target.closest("[data-hero-pause]")) setPlay(!playing);
    });
    root.addEventListener("mouseenter", function () { hover = true; schedule(); });
    root.addEventListener("mouseleave", function () { hover = false; schedule(); });
    root.addEventListener("focusin", function () { hover = true; schedule(); });
    root.addEventListener("focusout", function () { hover = false; schedule(); });
    var x0 = null, y0 = null;
    track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    setPlay(playing);
    paint();
    return { add: function (html) { track.insertAdjacentHTML("beforeend", html); paint(); } };
  }

  function initHome() {
    var brands = brandList();
    var photos = IN_STOCK.filter(hasPhoto).sort(rank);

    // Hero: ảnh giày thật đang có + câu đúng giọng S&LIFE
    var heroEl = $("[data-hero]");
    if (heroEl) {
      var star = photos[0] || bestOf(IN_STOCK);
      var slides = [
        '<div class="hero__slide hero__slide--grad"><div class="container hero__in"><div>' +
        '<div class="hero__kicker"><img src="images/brand/slife-mark-white.svg" alt="" width="22" height="22">S&amp;LIFE Sneakers · Since 2021</div>' +
        '<h2 class="hero__title"><span>Only</span><span class="is-outline">Authentic</span></h2>' +
        '<p class="hero__lead">Giày chính hãng, có sẵn size. Mỗi đôi có mã sản phẩm khớp tem hộp — tra trên trang chủ của hãng ra đúng mẫu, đúng màu.</p>' +
        '<div class="hero__cta"><a class="btn btn--light" href="shop.html">Xem ' + IN_STOCK.length + ' mẫu có sẵn</a><a class="btn btn--line-light" href="size-guide.html">Hướng dẫn chọn size</a></div></div>' +
        '<div class="hero__art"><div class="hero__word" aria-hidden="true">S&amp;LIFE</div>' +
        (star ? '<a class="hero__shoe" href="' + productUrl(star) + '">' + media(star, { eager: true }) +
          '<span class="hero__tag"><span><b>' + esc(star.name) + "</b><br>" + esc(star.code || "") + "</span><b>" + money(star.minPrice) + "</b></span></a>" : "") +
        "</div></div></div>",
      ];
      // Dòng giày có nhiều ảnh thật nhất
      var byLine = {};
      photos.forEach(function (p) { var k = p.brand + "|" + p.line; if (p.line !== OTHER_LINE) (byLine[k] = byLine[k] || []).push(p); });
      var topLine = Object.keys(byLine).sort(function (a, b) { return byLine[b].length - byLine[a].length; })[0];
      if (topLine && byLine[topLine].length >= 3) {
        var tb = topLine.split("|")[0], tl = topLine.split("|")[1];
        var inLine = IN_STOCK.filter(function (p) { return p.brand === tb && p.line === tl; });
        var sz = {};
        inLine.forEach(function (p) { p.sizes.forEach(function (s) { sz[s.s] = 1; }); });
        var szs = Object.keys(sz).sort(function (a, b) { return sizeNum(a) - sizeNum(b); });
        slides.push(
          '<div class="hero__slide hero__slide--ink"><div class="container hero__in"><div>' +
          '<div class="hero__kicker">Dòng giày đang có nhiều size</div>' +
          '<h2 class="hero__title"><span>' + esc(tb) + '</span><span class="grad-text" style="background-image:linear-gradient(90deg,#8FB3FF,#D59BFF 55%,#FF8A8E)">' + esc(tl) + "</span></h2>" +
          '<p class="hero__lead">' + inLine.length + " mẫu " + esc(lineTitle(tb, tl)) + " đang có sẵn tại shop" + (szs.length > 1 ? ", size từ " + esc(szs[0]) + " đến " + esc(szs[szs.length - 1]) : "") + ". Ảnh chụp thật từng đôi.</p>" +
          '<div class="hero__cta"><a class="btn btn--grad" href="' + lineUrl(tb, tl) + '">Xem dòng ' + esc(tl) + '</a><a class="btn btn--line-light" href="' + brandUrl(tb) + '">Tất cả ' + esc(tb) + "</a></div></div>" +
          '<div class="hero__art"><div class="hero__stack">' + byLine[topLine].slice(0, 3).map(function (p) { return '<a href="' + productUrl(p) + '" aria-label="' + esc(p.name) + '">' + media(p) + "</a>"; }).join("") + "</div></div>" +
          "</div></div>"
        );
      }
      slides.push(
        '<div class="hero__slide hero__slide--grad" style="background:linear-gradient(135deg,#771CAE 0%,#AD2571 55%,#DB3137 100%)"><div class="container hero__in"><div>' +
        '<div class="hero__kicker">Mua online, kiểm tra tận tay</div>' +
        '<h2 class="hero__title"><span>Mở hộp</span><span>kiểm tra</span><span class="is-outline">rồi trả tiền</span></h2>' +
        '<p class="hero__lead">Shop gửi ảnh chụp thật trước khi đóng gói. Đồng kiểm khi nhận, đổi size trong ' + SHOP.returnDays + " ngày nếu còn nguyên hộp, tem.</p>" +
        '<div class="hero__cta"><a class="btn btn--light" href="policy.html">Cách mua hàng</a><a class="btn btn--line-light" href="' + esc(SHOP.zalo) + '" target="_blank" rel="noopener">Nhắn Zalo tư vấn</a></div></div>' +
        '<div class="hero__art"><img class="hero__mark" src="images/brand/slife-full-white.svg" alt="S&amp;LIFE Since 2021" width="340" height="507"></div>' +
        "</div></div>"
      );
      var h = hero(heroEl, slides);
      // Banner ảnh shop tự tải lên: images/banners/banner-1.jpg … thêm vào cuối hero
      findSeries("images/banners/banner-", 1, 6, ["jpg", "webp"]).then(function (urls) {
        urls.forEach(function (u, i) {
          h.add('<div class="hero__slide hero__slide--img"><img src="' + esc(u) + '" alt="Banner S&amp;LIFE ' + (i + 1) + '" loading="lazy"><div class="container hero__in"><div><div class="hero__cta"><a class="btn btn--light" href="shop.html">Xem hàng sẵn</a></div></div></div></div>');
        });
      });
    }

    var perksEl = $("[data-perks]");
    if (perksEl) {
      perksEl.innerHTML = [
        [I.shield, "Chính hãng", "Mã sản phẩm khớp tem hộp, tra được trên trang chủ hãng"],
        [I.box, "Đồng kiểm", "Mở hộp kiểm tra trước khi trả tiền"],
        [I.swap, "Đổi size " + SHOP.returnDays + " ngày", "Còn nguyên hộp, tem, chưa đi ngoài trời"],
        [I.truck, "Ship toàn quốc", "COD cọc " + SHOP.depositPercent + "%, Hà Nội và TP.HCM có ship nhanh"],
      ].map(function (x) { return '<div class="perk"><span class="perk__ic">' + x[0] + "</span><b>" + x[1] + "</b><span>" + x[2] + "</span></div>"; }).join("");
    }

    var brandEl = $("[data-brands]");
    if (brandEl) {
      brandEl.innerHTML = brands.map(function (b) {
        return '<a class="brand-tile" href="' + brandUrl(b.name) + '"><span class="brand-tile__mono" aria-hidden="true">' + esc(initials(b.name)) + "</span>" +
          "<span><b>" + esc(b.name) + "</b><small>" + b.count + " mẫu</small></span>" + I.chev + "</a>";
      }).join("") +
        '<a class="brand-tile brand-tile--all" href="shop.html"><span class="brand-tile__mono" aria-hidden="true" style="background:var(--grad-brand);color:#fff">' + IN_STOCK.length + "</span><span><b>Tất cả giày</b><small>Đang có size</small></span>" + I.chev + "</a>";
    }

    var picks = $("[data-picks]");
    if (picks) {
      picks.innerHTML = rail("Gợi ý cho bạn", IN_STOCK.slice().sort(rank).slice(0, 12), "shop.html", "Xem tất cả " + IN_STOCK.length + " mẫu", "Mẫu có ảnh chụp thật và còn nhiều size");
    }

    // Dòng giày nổi bật: ô ảnh lớn
    var linesEl = $("[data-lines]");
    if (linesEl) {
      var all = [];
      brands.forEach(function (b) {
        lineList(b.name).forEach(function (l) {
          if (l.name === OTHER_LINE || l.count < 3) return;
          var list = IN_STOCK.filter(function (y) { return y.brand === b.name && y.line === l.name; });
          all.push({ brand: b.name, line: l.name, count: l.count, list: list, photos: list.filter(hasPhoto).length });
        });
      });
      all.sort(function (a, b) { return (b.photos > 0) - (a.photos > 0) || b.count - a.count; });
      linesEl.innerHTML = all.slice(0, 5).map(function (x) {
        var p = bestOf(x.list), title = lineTitle(x.brand, x.line);
        // Chữ lớn trong ô: bỏ tên hãng lặp lại, VD "Jordan 1 Low" -> "1 Low"
        var word = x.line.replace(/^Giày /, "").replace(new RegExp("^" + x.brand + "\\s+", "i"), "");
        if (hasPhoto(p)) {
          return '<a class="line-card" href="' + lineUrl(x.brand, x.line) + '">' + media(p) +
            '<span class="line-card__txt"><b>' + esc(title) + "</b><small>" + x.count + " mẫu</small></span></a>";
        }
        return '<a class="line-card line-card--text" href="' + lineUrl(x.brand, x.line) + '"><span class="line-card__word' + (word.length > 5 ? " is-long" : "") + '" aria-hidden="true"><span>' + esc(word) + "</span></span>" +
          '<span class="line-card__txt"><b>' + esc(title) + "</b><small>" + x.count + " mẫu</small></span></a>";
      }).join("");
    }

    var story = $("[data-story]");
    if (story) {
      story.innerHTML = '<img class="story__bg" src="images/brand/slife-mark-white.svg" alt="" aria-hidden="true" loading="lazy">' +
        '<div class="container story__in"><img class="story__logo" src="images/brand/slife-full-white.svg" alt="S&amp;LIFE Since 2021" width="180" height="268" loading="lazy">' +
        "<div><h2>S&amp;LIFE — Since 2021</h2>" +
        "<p>" + esc(SHOP.name) + " bán giày chính hãng có sẵn tại shop. Website hiện đúng những size đang còn trong kho, giá bán rõ ràng. Đôi nào có lỗi ngoại quan hoặc lệch size, shop ghi thẳng vào ghi chú sản phẩm — không giấu lỗi.</p>" +
        '<div class="story__stats"><div><b>' + IN_STOCK.length + "</b><span>mẫu còn size</span></div><div><b>" + brands.length + "</b><span>thương hiệu</span></div><div><b>" + SHOP.returnDays + " ngày</b><span>đổi size</span></div></div>" +
        '<div class="hero__cta"><a class="btn btn--light" href="gioi-thieu.html">Về S&amp;LIFE</a><a class="btn btn--line-light" href="' + esc(SHOP.zalo) + '" target="_blank" rel="noopener">Nhắn Zalo cho shop</a></div></div></div>';
    }

    // Theo thương hiệu: tab chọn hãng + băng sản phẩm
    var byBrand = $("[data-by-brand]");
    if (byBrand) {
      var tabBrands = brands.filter(function (b) { return b.count >= 4; });
      var tabs = $(".tabs-row", byBrand), body = $("[data-by-brand-body]", byBrand);
      tabs.innerHTML = tabBrands.map(function (b, i) {
        return '<button type="button" class="chip' + (i ? "" : " is-active") + '" role="tab" aria-selected="' + !i + '" data-tab-brand="' + esc(b.name) + '">' + esc(b.name) + " <small>" + b.count + "</small></button>";
      }).join("");
      function showBrand(name) {
        var list = IN_STOCK.filter(function (p) { return p.brand === name; }).sort(rank).slice(0, 12);
        body.innerHTML = railBody(list) + '<div class="sec__foot"><a class="sec__link" href="' + brandUrl(name) + '">Xem tất cả giày ' + esc(name) + I.arrow + "</a></div>";
        bindRails(body);
      }
      tabs.addEventListener("click", function (e) {
        var b = e.target.closest("[data-tab-brand]");
        if (!b) return;
        $all("[data-tab-brand]", tabs).forEach(function (x) { x.classList.toggle("is-active", x === b); x.setAttribute("aria-selected", x === b); });
        showBrand(b.dataset.tabBrand);
      });
      if (tabBrands.length) showBrand(tabBrands[0].name);
    }

    // Ảnh khách thật: images/khach-hang/1.jpg, 2.jpg…
    var moments = $("[data-moments]");
    if (moments) {
      findSeries("images/khach-hang/", 1, 24, ["jpg", "webp"]).then(function (urls) {
        if (!urls.length) return;
        moments.hidden = false;
        $(".moments", moments).innerHTML = urls.map(function (u) {
          return '<figure class="polaroid"><img src="' + esc(u) + '" alt="Khách hàng của ' + esc(SHOP.name) + '" loading="lazy"></figure>';
        }).join("");
      });
    }

    var faq = $("[data-faq]");
    if (faq) faq.innerHTML = (SHOP.faq || []).map(function (x) {
      return "<details><summary>" + esc(x[0]) + '<i aria-hidden="true"></i></summary><div class="faq__a">' + esc(x[1]) + "</div></details>";
    }).join("");

    var follow = $("[data-follow]");
    if (follow) {
      var links = [
        SHOP.instagram ? [SHOP.instagram, I.ig, "Instagram", handle(SHOP.instagram)] : null,
        SHOP.tiktok ? [SHOP.tiktok, I.tt, "TikTok", handle(SHOP.tiktok)] : null,
        SHOP.facebook ? [SHOP.facebook, I.fb, "Facebook", "S&LIFE Sneakers"] : null,
        [SHOP.zalo, ZL, "Zalo", SHOP.phoneDisplay],
      ].filter(Boolean);
      follow.innerHTML = '<div class="container follow__in"><div><h2>Theo dõi <span class="grad-text" style="background-image:linear-gradient(90deg,#8FB3FF,#D59BFF 55%,#FF8A8E)">S&amp;LIFE</span></h2>' +
        "<p>Hàng mới về, ảnh thật từng đôi và mẹo chọn size — shop đăng trên các kênh dưới đây.</p></div>" +
        '<div class="follow__links">' + links.map(function (l) {
          return '<a href="' + esc(l[0]) + '" target="_blank" rel="noopener">' + l[1] + "<span><b>" + l[2] + "</b><small>" + esc(l[3]) + "</small></span></a>";
        }).join("") + "</div></div>";
    }
    bindRails(document);
  }

  /* ---------- Trang danh mục: tất cả / hãng / dòng / tìm kiếm / yêu thích ---------- */
  function initShop() {
    var p = params();
    var brands = brandList();
    var brand = fromSlug(brands, p.get("brand") || "");
    brand = brand ? brand.name : null;
    var lines = brand ? lineList(brand) : [];
    var line = null;
    if (p.get("line")) {
      if (brand) { line = fromSlug(lines, p.get("line")); line = line ? line.name : null; }
      else {
        // Dòng chung nhiều hãng, VD giày tennis
        var ln = PRODUCTS.filter(function (x) { return slug(x.line) === p.get("line"); })[0];
        line = ln ? ln.line : null;
      }
    }
    var wishMode = p.get("wish") === "1";

    var state = {
      q: p.get("q") || "",
      brands: (p.get("brands") || "").split(",").filter(Boolean),
      sizes: (p.get("size") || "").split(",").filter(Boolean),
      colors: (p.get("color") || "").split(",").filter(Boolean),
      genders: (p.get("gender") || "").split(",").filter(Boolean),
      min: +p.get("min") || 0,
      max: +p.get("max") || 0,
      sort: p.get("sort") || "default",
      showOut: p.get("all") === "1" || wishMode,
      page: Math.max(1, +p.get("page") || 1),
    };

    var title = wishMode ? "Yêu thích" : line ? lineTitle(brand, line) : brand ? "Giày " + brand : state.q ? "Kết quả cho “" + state.q + "”" : "Giày chính hãng";
    var titleEl = $("[data-title]");
    titleEl.innerHTML = brand && !line ? 'Giày <span class="grad-text">' + esc(brand) + "</span>" : esc(title);
    document.title = title + " — " + SHOP.name;
    var trail = [["Trang chủ", "index.html"], ["Tất cả giày", brand || line || state.q || wishMode ? "shop.html" : ""]];
    if (brand) trail.push(["Giày " + brand, line ? brandUrl(brand) : ""]);
    if (line) trail.push([line, ""]);
    if (state.q && !brand) trail.push(["Tìm kiếm", ""]);
    if (wishMode) trail.push(["Yêu thích", ""]);
    $("[data-crumbs]").innerHTML = crumbs(trail);

    // Banner hãng / dòng nếu shop có tải ảnh: images/banners/<hãng>.jpg hoặc <hãng>-<dòng>.jpg
    var bannerEl = $("[data-collection-banner]");
    if (bannerEl && brand) {
      var tries = line ? ["images/banners/" + slug(brand) + "-" + slug(line), "images/banners/" + slug(brand)] : ["images/banners/" + slug(brand)];
      (function next(i) {
        if (i >= tries.length) return;
        findImage(tries[i], ["jpg", "webp"]).then(function (u) {
          if (!u) return next(i + 1);
          bannerEl.innerHTML = '<img src="' + esc(u) + '" alt="' + esc(title) + '">';
          bannerEl.hidden = false;
        });
      })(0);
    }

    // Hàng chip điều hướng: các hãng (trang tất cả) hoặc các dòng (trang hãng)
    var tilesEl = $("[data-tiles]");
    if (brand && lines.length > 1) {
      tilesEl.innerHTML = '<a class="chip' + (line ? "" : " is-active") + '" href="' + brandUrl(brand) + '">Tất cả <small>' + IN_STOCK.filter(function (x) { return x.brand === brand; }).length + "</small></a>" +
        lines.map(function (l) { return '<a class="chip' + (l.name === line ? " is-active" : "") + '" href="' + lineUrl(brand, l.name) + '">' + esc(l.name) + " <small>" + l.count + "</small></a>"; }).join("");
    } else if (!brand && !line && !wishMode) {
      tilesEl.innerHTML = '<a class="chip is-active" href="shop.html">Tất cả <small>' + IN_STOCK.length + "</small></a>" +
        brands.map(function (b) { return '<a class="chip" href="' + brandUrl(b.name) + '">' + esc(b.name) + " <small>" + b.count + "</small></a>"; }).join("");
    } else {
      tilesEl.hidden = true;
    }

    // Tập sản phẩm của trang
    var wishIds = wishes();
    var pool = PRODUCTS.filter(function (x) {
      if (wishMode) return wishIds.indexOf(x.id) >= 0;
      return (!brand || x.brand === brand) && (!line || x.line === line);
    });
    var sizeSet = {}, colorCount = {}, brandCount = {}, prices = [];
    pool.forEach(function (x) {
      x.sizes.forEach(function (s) { sizeSet[s.s] = 1; });
      if (x.inStock) {
        x.colors.forEach(function (c) { colorCount[c] = (colorCount[c] || 0) + 1; });
        brandCount[x.brand] = (brandCount[x.brand] || 0) + 1;
        if (x.minPrice) prices.push(x.minPrice);
      }
    });
    var pMin = prices.length ? Math.floor(Math.min.apply(null, prices) / 100) * 100 : 0;
    var pMax = prices.length ? Math.ceil(Math.max.apply(null, prices) / 100) * 100 : 0;
    var sizeKeys = Object.keys(sizeSet).sort(function (a, b) { return sizeNum(a) - sizeNum(b); });
    var fEl = $("[data-filters]");
    function section(titleText, html, open) {
      return '<details class="filter"' + (open ? " open" : "") + "><summary>" + titleText + I.down + '</summary><div class="filter__body">' + html + "</div></details>";
    }
    var brandKeys = Object.keys(brandCount).sort(function (a, b) { return BRAND_ORDER.indexOf(a) - BRAND_ORDER.indexOf(b); });
    $(".filters__body", fEl).innerHTML =
      (!brand && brandKeys.length > 1 ? section("Thương hiệu", brandKeys.map(function (b) {
        return '<label class="check"><input type="checkbox" name="brand" value="' + esc(b) + '"> ' + esc(b) + " <small>" + brandCount[b] + "</small></label>";
      }).join(""), true) : "") +
      (sizeKeys.length ? section("Size (EU)", '<div class="size-grid">' +
        sizeKeys.map(function (s) { return '<button type="button" class="size-btn" data-size="' + esc(s) + '" aria-pressed="false">' + esc(s) + "</button>"; }).join("") +
        '</div><p class="filter__note">40Y: size 40 bản GS. Chọn nhiều size được.</p>', true) : "") +
      (pMax > pMin ? section("Khoảng giá", '<div class="range" data-range><div class="range__track"></div><div class="range__fill" data-range-fill></div>' +
        '<input type="range" min="' + pMin + '" max="' + pMax + '" step="100" data-range-min aria-label="Giá thấp nhất">' +
        '<input type="range" min="' + pMin + '" max="' + pMax + '" step="100" data-range-max aria-label="Giá cao nhất"></div>' +
        '<div class="price-inputs"><label><input type="number" inputmode="numeric" step="100" min="0" data-price-min aria-label="Giá từ (nghìn đồng)"><span>k</span></label><span class="muted">–</span>' +
        '<label><input type="number" inputmode="numeric" step="100" min="0" data-price-max aria-label="Giá đến (nghìn đồng)"><span>k</span></label></div>' +
        '<div class="price-quick">' + PRICE_QUICK.map(function (r, i) { return '<button type="button" data-price-quick="' + i + '">' + r.label + "</button>"; }).join("") + "</div>", true) : "") +
      (Object.keys(colorCount).length ? section("Màu sắc", '<div class="colors">' +
        COLOR_FILTERS.filter(function (c) { return colorCount[c.id]; }).map(function (c) {
          return '<label class="color"><input type="checkbox" name="color" value="' + c.id + '"><i style="background:' + c.hex + '"></i>' + c.label + " <small>" + colorCount[c.id] + "</small></label>";
        }).join("") + "</div>", false) : "") +
      section("Dành cho", ["nam", "nu", "gs", "kid"].map(function (g) { return '<label class="check"><input type="checkbox" name="gender" value="' + g + '"> Code ' + GENDER_LABEL[g] + "</label>"; }).join("") +
        '<p class="filter__note">Mẫu không ghi code là unisex / size nam.</p>', false) +
      (wishMode ? "" : section("Tình trạng", '<label class="check"><input type="checkbox" name="showOut"> Hiện cả mẫu đã hết size (nhận order)</label>', false));

    var rMin = $("[data-range-min]", fEl), rMax = $("[data-range-max]", fEl), iMin = $("[data-price-min]", fEl), iMax = $("[data-price-max]", fEl), fill = $("[data-range-fill]", fEl);
    function syncRange() {
      if (!rMin) return;
      var lo = state.min || pMin, hi = state.max || pMax;
      rMin.value = lo; rMax.value = hi; iMin.value = lo; iMax.value = hi;
      var span = pMax - pMin || 1;
      fill.style.left = ((lo - pMin) / span * 100) + "%";
      fill.style.right = ((pMax - hi) / span * 100) + "%";
    }
    function syncInputs() {
      $all('input[name="brand"]', fEl).forEach(function (i) { i.checked = state.brands.indexOf(i.value) >= 0; });
      $all('input[name="gender"]', fEl).forEach(function (i) { i.checked = state.genders.indexOf(i.value) >= 0; });
      $all('input[name="color"]', fEl).forEach(function (i) { i.checked = state.colors.indexOf(i.value) >= 0; });
      $all("[data-size]", fEl).forEach(function (b) { var on = state.sizes.indexOf(b.dataset.size) >= 0; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on); });
      var so = $('input[name="showOut"]', fEl);
      if (so) so.checked = state.showOut;
      syncRange();
    }
    function writeUrl() {
      var u = new URLSearchParams();
      if (wishMode) u.set("wish", "1");
      if (brand) u.set("brand", slug(brand));
      if (line) u.set("line", slug(line));
      if (state.q) u.set("q", state.q);
      if (state.brands.length) u.set("brands", state.brands.join(","));
      if (state.sizes.length) u.set("size", state.sizes.join(","));
      if (state.colors.length) u.set("color", state.colors.join(","));
      if (state.genders.length) u.set("gender", state.genders.join(","));
      if (state.min) u.set("min", state.min);
      if (state.max) u.set("max", state.max);
      if (state.sort !== "default") u.set("sort", state.sort);
      if (state.showOut && !wishMode) u.set("all", "1");
      if (state.page > 1) u.set("page", state.page);
      history.replaceState(null, "", "shop.html" + (u.toString() ? "?" + u : ""));
    }
    function filtered() {
      var m = matcher(state.q);
      var list = pool.filter(function (x) {
        if (!state.showOut && !x.inStock) return false;
        if (state.brands.length && state.brands.indexOf(x.brand) < 0) return false;
        if (state.genders.length && state.genders.indexOf(x.gender) < 0) return false;
        if (state.colors.length && !x.colors.some(function (c) { return state.colors.indexOf(c) >= 0; })) return false;
        if (state.sizes.length && !x.sizes.some(function (s) { return state.sizes.indexOf(s.s) >= 0; })) return false;
        if (state.min && !(x.minPrice >= state.min)) return false;
        if (state.max && !(x.minPrice <= state.max)) return false;
        return m(x);
      });
      var cmp = {
        "name-asc": function (a, b) { return a.name.localeCompare(b.name); },
        "price-asc": function (a, b) { return (a.minPrice || 1e9) - (b.minPrice || 1e9); },
        "price-desc": function (a, b) { return (b.minPrice || 0) - (a.minPrice || 0); },
        "sizes": function (a, b) { return b.sizes.length - a.sizes.length; },
      }[state.sort];
      return list.sort(function (a, b) {
        if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
        return cmp ? cmp(a, b) : rank(a, b);
      });
    }

    var gridEl = $("[data-grid]"), pagerEl = $("[data-pager]"), countEl = $("[data-count]"), chipsEl = $("[data-chips]"), sortEl = $("[data-sort]");
    sortEl.value = state.sort;
    if (sortEl.value !== state.sort) { state.sort = "default"; sortEl.value = "default"; }

    function pagesHtml(total) {
      var pages = Math.ceil(total / PAGE_SIZE);
      if (pages <= 1) return "";
      var cur = state.page, out = [], shown = {};
      [1, 2, cur - 1, cur, cur + 1, pages - 1, pages].forEach(function (n) { if (n >= 1 && n <= pages) shown[n] = 1; });
      var last = 0;
      if (cur > 1) out.push('<button data-page="' + (cur - 1) + '" aria-label="Trang trước">‹</button>');
      Object.keys(shown).map(Number).sort(function (a, b) { return a - b; }).forEach(function (n) {
        if (n - last > 1) out.push("<span>…</span>");
        out.push('<button data-page="' + n + '"' + (n === cur ? ' class="is-current" aria-current="page"' : "") + ' aria-label="Trang ' + n + '">' + n + "</button>");
        last = n;
      });
      if (cur < pages) out.push('<button data-page="' + (cur + 1) + '" aria-label="Trang sau">›</button>');
      return out.join("");
    }
    function activeChips() {
      var chips = [];
      state.brands.forEach(function (b) { chips.push(["brand", b, b]); });
      state.sizes.forEach(function (s) { chips.push(["size", s, "Size " + s]); });
      if (state.min || state.max) chips.push(["price", "", (state.min ? million(state.min) : "0") + " – " + (state.max ? million(state.max) : "…")]);
      state.colors.forEach(function (c) { chips.push(["color", c, COLOR_FILTERS.filter(function (x) { return x.id === c; })[0].label]); });
      state.genders.forEach(function (g) { chips.push(["gender", g, "Code " + GENDER_LABEL[g]]); });
      if (state.showOut && !wishMode) chips.push(["showOut", "", "Gồm mẫu hết size"]);
      if (state.q && (brand || wishMode)) chips.push(["q", "", "“" + state.q + "”"]);
      return chips;
    }
    function chipHtml(c) { return '<button type="button" data-remove="' + c[0] + '" data-value="' + esc(c[1]) + '" aria-label="Bỏ lọc ' + esc(c[2]) + '">' + esc(c[2]) + I.close + "</button>"; }

    function render() {
      var list = filtered();
      var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      if (state.page > pages) state.page = pages;
      var start = (state.page - 1) * PAGE_SIZE;
      var chips = activeChips();
      countEl.textContent = list.length + " mẫu" + (state.showOut || wishMode ? "" : " còn size");
      if (list.length) {
        gridEl.innerHTML = list.slice(start, start + PAGE_SIZE).map(card).join("");
      } else if (wishMode && !chips.length) {
        gridEl.innerHTML = '<div class="empty"><h2>Chưa có mẫu yêu thích</h2><p class="muted">Bấm biểu tượng trái tim trên mẫu giày để lưu lại, xem lại sau ở đây (lưu trên trình duyệt này).</p><div class="empty__actions"><a class="btn btn--grad" href="shop.html">Xem hàng sẵn</a></div></div>';
      } else {
        gridEl.innerHTML = '<div class="empty"><h2>Chưa có mẫu phù hợp</h2>' +
          '<p class="muted">' + (chips.length ? "Thử bỏ bớt bộ lọc bên dưới." : "Thử gõ mã in trên tem hộp, hoặc tên ngắn hơn (VD: 204L, Samba).") + " Shop nhận order theo yêu cầu — nhắn Zalo mẫu và size bạn cần.</p>" +
          (chips.length ? '<div class="empty__chips chips">' + chips.map(chipHtml).join("") + "</div>" : "") +
          '<div class="empty__actions">' + (chips.length ? '<button type="button" class="btn btn--ghost" data-clear>Xoá tất cả bộ lọc</button>' : "") +
          '<a class="btn btn--zalo" href="' + esc(SHOP.zalo) + '" target="_blank" rel="noopener">Nhắn Zalo cho shop</a></div></div>' +
          '<div style="grid-column:1/-1">' + rail("Gợi ý cho bạn", IN_STOCK.slice().sort(rank).slice(0, 10)) + "</div>";
        bindRails(gridEl);
      }
      pagerEl.innerHTML = pagesHtml(list.length);
      chipsEl.innerHTML = chips.map(chipHtml).join("") + (chips.length > 1 ? '<button type="button" class="chips__clear" data-clear>Xoá tất cả</button>' : "");
      chipsEl.hidden = !chips.length;
      var n = state.brands.length + state.sizes.length + state.colors.length + state.genders.length + (state.min || state.max ? 1 : 0) + (state.showOut && !wishMode ? 1 : 0);
      $("[data-filter-count]").innerHTML = n ? "<b>" + n + "</b>" : "";
      $("[data-apply]").textContent = "Xem " + list.length + " mẫu";
      writeUrl();
    }
    function toggle(arr, v) { var i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); }
    function openFilters(open) { openLayer(fEl, open); }
    function clearAll() { state.brands = []; state.sizes = []; state.colors = []; state.genders = []; state.min = 0; state.max = 0; state.showOut = wishMode; if (brand || wishMode) state.q = ""; state.page = 1; syncInputs(); render(); }

    fEl.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "brand") toggle(state.brands, t.value);
      if (t.name === "gender") toggle(state.genders, t.value);
      if (t.name === "color") toggle(state.colors, t.value);
      if (t.name === "showOut") state.showOut = t.checked;
      if (t.matches("[data-price-min], [data-price-max]")) {
        var lo = Math.max(pMin, Math.min(+iMin.value || pMin, pMax)), hi = Math.max(pMin, Math.min(+iMax.value || pMax, pMax));
        if (lo > hi) { var tmp = lo; lo = hi; hi = tmp; }
        state.min = lo > pMin ? lo : 0; state.max = hi < pMax ? hi : 0;
        syncRange();
      }
      if (t.matches("[data-range-min], [data-range-max]")) {
        state.min = +rMin.value > pMin ? +rMin.value : 0;
        state.max = +rMax.value < pMax ? +rMax.value : 0;
      }
      state.page = 1; render();
    });
    fEl.addEventListener("input", function (e) {
      if (!e.target.matches("[data-range-min], [data-range-max]")) return;
      var lo = +rMin.value, hi = +rMax.value;
      if (lo > hi - 100) { if (e.target === rMin) rMin.value = lo = hi - 100; else rMax.value = hi = lo + 100; }
      state.min = lo > pMin ? lo : 0; state.max = hi < pMax ? hi : 0;
      syncRange();
    });
    fEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-size]");
      if (b) { toggle(state.sizes, b.dataset.size); state.page = 1; syncInputs(); render(); }
      var pq = e.target.closest("[data-price-quick]");
      if (pq) { var r = PRICE_QUICK[+pq.dataset.priceQuick]; state.min = r.min > pMin ? r.min : 0; state.max = r.max && r.max < pMax ? r.max : 0; state.page = 1; syncRange(); render(); }
      if (e.target.closest("[data-filters-close]")) openFilters(false);
      if (e.target.closest("[data-clear]")) clearAll();
    });
    $("[data-filters-open]").addEventListener("click", function () { openFilters(true); });
    sortEl.addEventListener("change", function () { state.sort = sortEl.value; state.page = 1; render(); });
    pagerEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-page]");
      if (!b) return;
      state.page = +b.dataset.page; render();
      $(".coll__head").scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
    });
    function onChip(e) {
      if (e.target.closest("[data-clear]")) { clearAll(); return; }
      var b = e.target.closest("[data-remove]");
      if (!b) return;
      var k = b.dataset.remove, v = b.dataset.value;
      if (k === "brand") toggle(state.brands, v);
      if (k === "size") toggle(state.sizes, v);
      if (k === "color") toggle(state.colors, v);
      if (k === "gender") toggle(state.genders, v);
      if (k === "price") { state.min = 0; state.max = 0; }
      if (k === "showOut") state.showOut = false;
      if (k === "q") state.q = "";
      state.page = 1; syncInputs(); render();
    }
    chipsEl.addEventListener("click", onChip);
    gridEl.addEventListener("click", onChip);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && fEl.classList.contains("is-open")) openFilters(false); });

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
        this.setAttribute("aria-expanded", about.classList.contains("is-open"));
      });
    }

    var seenEl = $("[data-seen]");
    if (seenEl) { seenEl.innerHTML = rail("Đã xem gần đây", seenProducts().slice(0, 10)); bindRails(seenEl); }

    syncInputs();
    render();
  }

  /* ---------- Trang sản phẩm ---------- */
  function sizeGuideModal(p) {
    var fit = fitNote(p);
    modal(
      "<h3>Hướng dẫn chọn size</h3>" +
      (fit ? '<div class="fit">' + I.info + "<div><b>Form " + esc(fit.line) + ":</b> " + esc(fit.advice) + "</div></div>" : "") +
      '<p style="margin:0 0 8px"><b>Đo chiều dài bàn chân</b></p><ol style="margin:0 0 14px;padding-left:20px;color:var(--ink-2);font-size:14.5px">' +
      "<li>Đứng thẳng trên tờ giấy A4, gót sát tường.</li><li>Đánh dấu đầu ngón chân dài nhất, đo từ mép giấy đến vạch (cm).</li><li>Đo vào cuối ngày, đo cả hai chân, lấy số lớn hơn.</li></ol>" +
      '<div class="table-wrap size-table"><table><thead><tr><th>Dòng giày</th><th>Lưu ý form</th></tr></thead><tbody>' +
      FIT_NOTES.map(function (f) { return "<tr" + (fit === f ? ' style="background:var(--order-bg)"' : "") + "><td>" + esc(f.line) + "</td><td>" + esc(f.advice) + "</td></tr>"; }).join("") +
      "</tbody></table></div>" +
      '<p class="muted" style="font-size:13.5px;margin:0">Còn phân vân giữa hai size: gửi shop số cm chân kèm tên đôi giày đang đi vừa nhất.</p>' +
      '<div class="modal__actions"><a class="btn btn--ghost" href="size-guide.html">Xem đầy đủ</a><button type="button" class="btn btn--zalo" data-ask-size>Hỏi size qua Zalo</button></div>',
      "modal__box--wide"
    ).el.addEventListener("click", function (e) { if (e.target.closest("[data-ask-size]")) askZalo(p, null); });
  }
  function lightbox(shots, start, alt) {
    var cur = start;
    var m = modal(
      '<div class="lightbox"><div class="lightbox__top"><span data-lb-count></span><button type="button" class="icon-btn" data-close aria-label="Đóng">' + I.close + "</button></div>" +
      '<div class="lightbox__stage"><img data-lb-img alt="' + esc(alt) + '">' +
      (shots.length > 1 ? '<button type="button" class="gallery__nav gallery__nav--prev" data-lb="-1" aria-label="Ảnh trước">' + I.left + '</button><button type="button" class="gallery__nav gallery__nav--next" data-lb="1" aria-label="Ảnh sau">' + I.left + "</button>" : "") +
      "</div>" +
      (shots.length > 1 ? '<div class="lightbox__thumbs">' + shots.map(function (u, i) { return '<button type="button" data-lbi="' + i + '" aria-label="Ảnh ' + (i + 1) + '"><img src="' + esc(u) + '" alt="" loading="lazy"></button>'; }).join("") + "</div>" : "") +
      "</div>", "lb-box");
    var box = $(".modal__box", m.el);
    box.style.cssText = "max-width:none;width:100%;height:100%;max-height:none;padding:0;border-radius:0;background:transparent;box-shadow:none";
    m.el.style.padding = "0";
    $(".modal__x", box).remove();
    function show(i) {
      cur = (i + shots.length) % shots.length;
      $("[data-lb-img]", box).src = shots[cur];
      $("[data-lb-count]", box).textContent = (cur + 1) + " / " + shots.length;
      $all("[data-lbi]", box).forEach(function (b, j) { b.classList.toggle("is-active", j === cur); });
    }
    box.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lb]"), t = e.target.closest("[data-lbi]");
      if (b) show(cur + (+b.dataset.lb));
      if (t) show(+t.dataset.lbi);
    });
    function key(e) { if (e.key === "ArrowRight") show(cur + 1); if (e.key === "ArrowLeft") show(cur - 1); }
    document.addEventListener("keydown", key);
    new MutationObserver(function (_, obs) { if (!document.contains(m.el)) { document.removeEventListener("keydown", key); obs.disconnect(); } }).observe(document.body, { childList: true });
    var stage = $(".lightbox__stage", box), x0 = null;
    stage.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    $("[data-close]", box).focus();
    show(cur);
  }

  function initProduct() {
    var root = $("[data-product]");
    var p = findProduct(params().get("id"));
    if (!p) {
      var q = params().get("id") || "";
      root.innerHTML = '<div class="empty" style="margin:40px 0"><h2>Không tìm thấy sản phẩm</h2><p class="muted">Mẫu này có thể vừa được cập nhật. Tìm lại theo mã hoặc xem các mẫu đang có sẵn.</p><div class="empty__actions">' +
        (q ? '<a class="btn btn--ghost" href="shop.html?q=' + encodeURIComponent(q) + '">Tìm “' + esc(q) + "”</a>" : "") + '<a class="btn btn--grad" href="shop.html">Xem hàng sẵn</a></div></div>';
      return;
    }
    var name = fullName(p);
    document.title = name + " — " + SHOP.name;
    var meta = $('meta[name="description"]');
    if (meta) meta.content = name + " chính hãng tại " + SHOP.name + ". " + (p.inStock ? "Size còn: " + p.sizes.map(function (s) { return s.s; }).join(", ") + ". " : "") + "Đồng kiểm khi nhận, đổi size " + SHOP.returnDays + " ngày.";
    var fit = fitNote(p);
    var selected = p.sizes.length === 1 ? p.sizes[0].s : null, qty = 1;
    var sizeText = p.sizes.map(function (s) { return s.s; }).join(", ");
    var hasLines = (LINES[p.brand] || []).length > 0;
    var pageUrl = absUrl(productUrl(p));
    var trail = [["Trang chủ", "index.html"], [p.brand, brandUrl(p.brand)]];
    if (hasLines && p.line !== OTHER_LINE) trail.push([p.line, lineUrl(p.brand, p.line)]);
    trail.push([p.name, ""]);
    var known = shotsOf(p);

    // Dữ liệu có cấu trúc cho Google (giá, tình trạng còn hàng) — chỉ dữ liệu thật
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Product", name: name, sku: p.code || p.id, mpn: p.code || undefined,
      brand: { "@type": "Brand", name: p.brand }, image: known ? known.map(absUrl) : undefined,
      offers: { "@type": "Offer", priceCurrency: "VND", price: (p.minPrice || 0) * 1000, url: pageUrl, itemCondition: "https://schema.org/NewCondition",
        availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
    });
    document.head.appendChild(ld);

    // Dải size theo hãng: size đang có đậm, size đã hết làm mờ (bấm để hỏi order)
    var range = [];
    if (p.inStock) {
      var kid = p.gender === "gs" || p.gender === "kid", seen = {};
      PRODUCTS.forEach(function (x) {
        if (x.brand !== p.brand || ((x.gender === "gs" || x.gender === "kid") !== kid)) return;
        x.sizes.forEach(function (s) { seen[s.s] = 1; });
      });
      var own = p.sizes.map(function (s) { return s.s; });
      var lo = sizeNum(own[0]) - 1.5, hi = sizeNum(own[own.length - 1]) + 1.5;
      range = Object.keys(seen).filter(function (s) { return own.indexOf(s) >= 0 || (sizeNum(s) >= lo && sizeNum(s) <= hi && !/y$/i.test(s)); })
        .sort(function (a, b) { return sizeNum(a) - sizeNum(b); });
    }
    var status = p.inStock
      ? pill("ok", "Có sẵn · " + p.sizes.length + " size")
      : pill("order", "Hết size · nhận order");
    var genderPill = p.gender !== "unisex" ? pill("g", p.gender === "nam" ? "Code nam" : p.gender === "nu" ? "Code nữ" : GENDER_LABEL[p.gender]) : "";

    root.innerHTML =
      '<div class="pd-top">' + crumbs(trail) + "</div>" +
      '<div class="pd">' +
      '<div class="gallery"><div class="gallery__main" data-main>' + media(p, { eager: true }) +
      '<span class="gallery__hint" hidden>' + I.zoom + "Rê chuột để phóng to · bấm để xem lớn</span></div>" +
      '<div class="thumbs" data-thumbs></div></div>' +
      '<div class="pd__info">' +
      '<div class="pd__brand"><a href="' + brandUrl(p.brand) + '">' + esc(p.brand) + "</a>" +
      (p.code ? '<button type="button" class="pd__code" data-copy-code title="Sao chép mã">Mã ' + esc(p.code) + I.copy + "</button>" : "") + "</div>" +
      "<h1>" + esc(p.name) + "</h1>" +
      '<div class="pd__pills">' + status + pill("plain", "Mới · đủ hộp, tem") + genderPill + "</div>" +
      '<div class="pd__price" data-price>' + money(p.minPrice) + "</div>" +
      (p.note ? '<div class="pd__note"><b>Ghi chú của shop:</b> ' + esc(p.note) + "</div>" : "") +
      (fit ? '<div class="fit">' + I.info + "<div><b>Lưu ý form:</b> " + esc(fit.advice) + "</div></div>" : "") +
      (p.inStock
        ? '<div class="pd__sizehead" id="chon-size"><span>Chọn size (EU): <b data-size-label>' + esc(selected || "chưa chọn") + '</b></span><button type="button" class="pd__guide" data-guide>' + I.ruler + "Hướng dẫn chọn size</button></div>" +
          '<div class="sizes" data-sizes role="group" aria-label="Chọn size">' +
          range.map(function (s) {
            var own = p.sizes.filter(function (x) { return x.s === s; })[0];
            if (!own) return '<button type="button" class="is-off" data-off="' + esc(s) + '" aria-label="Size ' + esc(s) + ' đã hết">' + esc(s) + "</button>";
            var extra = own.p && own.p !== p.price ? money(own.p).replace(".000₫", "k") : own.n ? "Lưu ý" : "";
            return '<button type="button" data-size="' + esc(s) + '" aria-pressed="false" title="' + esc(own.n || "") + '">' + esc(s) + (extra ? "<small>" + esc(extra) + "</small>" : "") + "</button>";
          }).join("") + "</div>" +
          '<p class="pd__hint" data-size-note>Size mờ là đã hết — bấm vào để hỏi shop order.</p>' +
          '<div class="pd__buy" data-buy-block><div class="qty" role="group" aria-label="Số lượng"><button type="button" data-qty="-1" aria-label="Giảm">−</button><input type="number" value="1" min="1" max="' + MAX_QTY + '" data-qty-input aria-label="Số lượng"><button type="button" data-qty="1" aria-label="Tăng">+</button></div>' +
          '<button type="button" class="btn btn--grad" data-add>' + I.bagPlus + "Thêm vào giỏ</button></div>" +
          '<div class="pd__buy2"><button type="button" class="btn" data-buy-now>Mua ngay</button><button type="button" class="btn btn--ghost" data-ask>Tư vấn Zalo</button>' + wishBtn(p) + "</div>"
        : '<p class="pd__hint">Mẫu này tạm hết size tại shop. Nhắn Zalo để shop kiểm tra và báo giá order.</p>' +
          '<div class="pd__buy2" data-buy-block style="grid-template-columns:1fr 52px"><button type="button" class="btn btn--grad" data-ask>Nhắn Zalo hỏi order</button>' + wishBtn(p) + "</div>") +
      '<p class="pd__call">Hoặc gọi <a href="tel:' + esc(SHOP.phone) + '">' + esc(SHOP.phoneDisplay) + "</a> (" + esc(SHOP.openHours) + ")</p>" +
      '<div class="acc">' +
      "<details open><summary>" + I.shield + "Cam kết của S&amp;LIFE" + I.down.replace("<svg", '<svg class="chev"') + '</summary><div class="acc__body"><ul>' +
      (SHOP.perks || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></details>" +
      "<details><summary>" + I.truck + "Giao hàng &amp; thanh toán" + I.down.replace("<svg", '<svg class="chev"') + '</summary><div class="acc__body"><ul>' +
      "<li>Ship toàn quốc qua SPX Express, Viettel Post…; nội thành Hà Nội, TP.HCM có ship nhanh (chuyển khoản trước).</li>" +
      "<li>COD: đặt cọc " + SHOP.depositPercent + "% giá bán, phần còn lại trả khi nhận hàng.</li>" +
      "<li>Chuyển khoản " + esc(SHOP.bank.name) + " — có mã VietQR ở bước đặt hàng.</li>" +
      '</ul><p style="margin:8px 0 0"><a class="link" href="policy.html#ship">Chi tiết vận chuyển</a></p></div></details>' +
      "<details><summary>" + I.swap + "Đổi size &amp; đổi trả" + I.down.replace("<svg", '<svg class="chev"') + '</summary><div class="acc__body"><ul>' +
      "<li>Đổi trả trong " + SHOP.returnDays + " ngày kể từ khi giao: giữ nguyên hộp, tem, chưa đi ngoài trời. Khách hỗ trợ phí đổi trả.</li>" +
      "<li>Sai size do shop tư vấn: shop chịu phí đổi.</li>" +
      "<li>Giao sai mẫu, sai size do shop đóng nhầm: quay video lúc đồng kiểm và gửi shop trong 24 giờ, shop đổi lại và chịu toàn bộ chi phí.</li>" +
      '</ul><p style="margin:8px 0 0"><a class="link" href="policy.html#doi-tra">Xem đầy đủ chính sách</a></p></div></details>' +
      "</div>" +
      '<div class="share"><span>Chia sẻ</span>' +
      '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '" target="_blank" rel="noopener">' + I.fb + "Facebook</a>" +
      '<button type="button" data-copy-link>' + I.link + "Sao chép link</button>" +
      (navigator.share ? '<button type="button" data-native-share>' + I.share + "Zalo, Messenger…</button>" : "") + "</div>" +
      "</div></div>" +

      '<section class="pd-sec"><div class="pd-desc"><div><h2>Mô tả sản phẩm</h2><div class="pd-desc__text">' +
      "<p><b>" + esc(name) + "</b> là hàng chính hãng " + (p.inStock ? "đang có sẵn" : "") + " tại " + esc(SHOP.name) + "." +
      (p.code ? " Mã sản phẩm <b>" + esc(p.code) + "</b> khớp với tem hộp — bạn tra mã này trên trang chủ của " + esc(p.brand) + " sẽ ra đúng mẫu, đúng màu." : "") + "</p>" +
      (p.inStock ? "<p>Size còn tại shop: <b>" + esc(sizeText) + "</b>. Tồn kho thay đổi trong ngày, bạn nhắn shop xác nhận size trước khi chuyển khoản nhé.</p>" : "<p>Mẫu này tạm hết size tại shop. Bạn nhắn Zalo để shop kiểm tra và báo giá order.</p>") +
      (fit ? "<p>Về form: " + esc(fit.advice) + " Còn phân vân, gửi shop số cm chân kèm tên đôi giày đang đi vừa nhất để được tư vấn.</p>" : "") +
      "<p><b>Bảo quản:</b> tránh ngâm nước, không giặt máy, không dùng chất tẩy mạnh, không phơi trực tiếp dưới nắng gắt.</p>" +
      "<p>Mỗi đôi giao đủ hộp, giấy gói, tem và phụ kiện đi kèm. Shop gửi ảnh chụp thật trước khi đóng gói, bạn được mở hộp kiểm tra trước khi trả tiền.</p>" +
      "</div>" +
      '<div class="about-shop"><img src="images/brand/icon-192.png" alt="" width="64" height="64" loading="lazy"><div><b>Về ' + esc(SHOP.name) + "</b>" +
      "<p>Shop bán giày chính hãng online từ 2021. Nói thật tình trạng từng đôi, tư vấn size theo form từng dòng, gửi ảnh chụp thật trước khi đóng gói.</p>" +
      '<div class="about-shop__links">' +
      (SHOP.instagram ? '<a href="' + esc(SHOP.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram">' + I.ig + "</a>" : "") +
      (SHOP.tiktok ? '<a href="' + esc(SHOP.tiktok) + '" target="_blank" rel="noopener" aria-label="TikTok">' + I.tt + "</a>" : "") +
      (SHOP.facebook ? '<a href="' + esc(SHOP.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook">' + I.fb + "</a>" : "") +
      "</div></div></div></div>" +
      '<div><h2>Thông tin sản phẩm</h2><table class="spec"><tbody>' +
      "<tr><th>Thương hiệu</th><td>" + esc(p.brand) + "</td></tr>" +
      (hasLines ? "<tr><th>Dòng giày</th><td>" + esc(p.line) + "</td></tr>" : "") +
      (p.code ? "<tr><th>Mã sản phẩm</th><td>" + esc(p.code) + "</td></tr>" : "") +
      "<tr><th>Dành cho</th><td>" + (p.gender === "unisex" ? "Unisex / size nam" : "Code " + GENDER_LABEL[p.gender]) + "</td></tr>" +
      "<tr><th>Size còn</th><td>" + (p.inStock ? esc(sizeText) : "Tạm hết — nhận order") + "</td></tr>" +
      "<tr><th>Tình trạng</th><td>Mới, đủ hộp, tem và phụ kiện</td></tr>" +
      (fit ? "<tr><th>Form</th><td>" + esc(fit.advice) + "</td></tr>" : "") +
      "</tbody></table></div></div></section>";

    // Bộ ảnh: dùng danh sách có sẵn, hoặc dò dần MÃ, MÃ-2 … MÃ-12
    var shots = [], cur = 0;
    var thumbs = $("[data-thumbs]", root), mainBox = $("[data-main]", root), hint = $(".gallery__hint", mainBox);
    var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
    function mainImg() { return $(".media__img", mainBox); }
    function show(i) {
      if (!shots.length) return;
      cur = (i + shots.length) % shots.length;
      var img = mainImg();
      if (img) { img.src = shots[cur]; img.classList.add("ok"); }
      $all("button", thumbs).forEach(function (x, j) { x.classList.toggle("is-active", j === cur); x.setAttribute("aria-current", j === cur); });
      var active = thumbs.children[cur];
      if (active) thumbs.scrollTo({ left: active.offsetLeft - thumbs.clientWidth / 2 + active.clientWidth / 2, behavior: REDUCED ? "auto" : "smooth" });
      var counter = $("[data-counter]", mainBox);
      if (counter) counter.textContent = (cur + 1) + " / " + shots.length;
    }
    function addShot(u) {
      shots.push(u);
      mainBox.classList.remove("is-empty");
      var cta = $(".gallery__ph-cta", mainBox);
      if (cta) cta.remove();
      if (fine) hint.hidden = false;
      if (shots.length < 2) return;
      if (shots.length === 2) {
        thumbs.innerHTML = '<button type="button" data-shot="0" class="is-active" aria-label="Ảnh 1"><img src="' + esc(shots[0]) + '" alt=""></button>';
        mainBox.insertAdjacentHTML("beforeend",
          '<button type="button" class="gallery__nav gallery__nav--prev" data-nav="-1" aria-label="Ảnh trước">' + I.left + "</button>" +
          '<button type="button" class="gallery__nav gallery__nav--next" data-nav="1" aria-label="Ảnh sau">' + I.left + "</button>" +
          '<span class="gallery__count" data-counter></span>');
      }
      thumbs.insertAdjacentHTML("beforeend", '<button type="button" data-shot="' + (shots.length - 1) + '" aria-label="Ảnh ' + shots.length + '"><img src="' + esc(u) + '" alt="" loading="lazy"></button>');
      var counter = $("[data-counter]", mainBox);
      if (counter) counter.textContent = (cur + 1) + " / " + shots.length;
    }
    if (!known) {
      mainBox.classList.add("is-empty");
      mainBox.insertAdjacentHTML("beforeend", '<a class="btn btn--zalo btn--sm gallery__ph-cta" href="' + esc(SHOP.zalo) + '" target="_blank" rel="noopener">' + I.camera + "Nhắn Zalo nhận ảnh thật</a>");
    }
    loadShots(p, addShot);
    thumbs.addEventListener("click", function (e) {
      var b = e.target.closest("[data-shot]");
      if (b) show(+b.dataset.shot);
    });
    mainBox.addEventListener("click", function (e) {
      var b = e.target.closest("[data-nav]");
      if (b) { show(cur + (+b.dataset.nav)); return; }
      if (e.target.closest("a")) return;
      if (shots.length) { mainBox.classList.remove("is-zoom"); lightbox(shots, cur, name); }
    });
    // Phóng to khi rê chuột (máy tính)
    if (fine) {
      mainBox.addEventListener("mousemove", function (e) {
        if (!shots.length || e.target.closest("button")) { mainBox.classList.remove("is-zoom"); return; }
        var r = mainBox.getBoundingClientRect(), img = mainImg();
        mainBox.classList.add("is-zoom");
        if (img) img.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + "% " + ((e.clientY - r.top) / r.height * 100) + "%";
      });
      mainBox.addEventListener("mouseleave", function () { mainBox.classList.remove("is-zoom"); });
    }
    var x0 = null, y0 = null;
    mainBox.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    mainBox.addEventListener("touchend", function (e) {
      if (x0 === null || shots.length < 2) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { e.preventDefault(); show(cur + (dx < 0 ? 1 : -1)); }
      x0 = null;
    });

    var priceEl = $("[data-price]", root), noteEl = $("[data-size-note]", root), sizesEl = $("[data-sizes]", root);
    function markSize() {
      $all("[data-size]", root).forEach(function (b) { var on = b.dataset.size === selected; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on); });
      var s = p.sizes.filter(function (x) { return x.s === selected; })[0];
      priceEl.innerHTML = (s ? "" : p.minPrice < p.price ? "<small>Từ</small>" : "") + money((s && s.p) || p.minPrice) + (s && s.p && s.p !== p.price ? "<small>giá riêng size " + esc(s.s) + "</small>" : "");
      var label = $("[data-size-label]", root);
      if (label) label.textContent = selected || "chưa chọn";
      if (noteEl && s) { noteEl.classList.remove("is-warn"); noteEl.textContent = s.n ? "Size " + s.s + ": " + s.n : "Size " + s.s + " còn hàng tại shop."; }
      updateBar();
    }
    function needSize() {
      toast("Bạn chọn size trước nhé");
      if (!sizesEl) return;
      sizesEl.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
      sizesEl.classList.remove("is-shake"); void sizesEl.offsetWidth; sizesEl.classList.add("is-shake");
      if (noteEl) { noteEl.textContent = "Chọn một size ở trên để tiếp tục."; noteEl.classList.add("is-warn"); }
    }
    function setQty(n) {
      qty = Math.max(1, Math.min(MAX_QTY, n || 1));
      var inp = $("[data-qty-input]", root);
      if (inp) inp.value = qty;
      $all("[data-qty]", root).forEach(function (b) { b.disabled = (+b.dataset.qty < 0 && qty <= 1) || (+b.dataset.qty > 0 && qty >= MAX_QTY); });
    }
    function add() {
      if (!selected) { needSize(); return false; }
      addToCart(p.id, selected, qty);
      return true;
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-size]");
      if (b) { selected = b.dataset.size; markSize(); }
      var off = e.target.closest("[data-off]");
      if (off && noteEl) { noteEl.innerHTML = "Size " + esc(off.dataset.off) + ' đã hết tại shop. <a class="link" href="#" data-ask-off="' + esc(off.dataset.off) + '">Nhắn Zalo hỏi order size này</a>'; noteEl.classList.add("is-warn"); }
      var ao = e.target.closest("[data-ask-off]");
      if (ao) { e.preventDefault(); askZalo(p, ao.dataset.askOff); }
      var qb = e.target.closest("[data-qty]");
      if (qb) setQty(qty + (+qb.dataset.qty));
      if (e.target.closest("[data-guide]")) sizeGuideModal(p);
      if (e.target.closest("[data-copy-code]")) copyText(p.code).then(function () { toast("Đã sao chép mã " + p.code); });
      if (e.target.closest("[data-copy-link]")) copyText(pageUrl).then(function () { toast("Đã sao chép link sản phẩm"); });
      if (e.target.closest("[data-native-share]")) navigator.share({ title: name, url: pageUrl }).catch(function () {});
      if (e.target.closest("[data-add]")) { if (add()) openMini(p.id + "|" + selected); }
      if (e.target.closest("[data-buy-now]")) { if (add()) location.href = "dat-hang.html"; }
      if (e.target.closest("[data-ask]")) askZalo(p, selected);
    });
    var qi = $("[data-qty-input]", root);
    if (qi) qi.addEventListener("change", function () { setQty(+qi.value); });
    setQty(1);

    // Thanh mua dính đáy màn hình trên điện thoại
    var bar = document.createElement("div");
    bar.className = "buybar";
    bar.innerHTML = '<div class="buybar__info"><b data-bar-price></b><small data-bar-sub></small></div>' +
      (p.inStock ? '<button type="button" class="btn btn--grad" data-bar-add>' + I.bagPlus + "Thêm vào giỏ</button>" : '<button type="button" class="btn btn--grad" data-bar-ask>Hỏi order</button>');
    document.body.appendChild(bar);
    function updateBar() {
      var s = p.sizes.filter(function (x) { return x.s === selected; })[0];
      $("[data-bar-price]", bar).textContent = money((s && s.p) || p.minPrice);
      $("[data-bar-sub]", bar).textContent = p.inStock ? (selected ? "Size " + selected + " · " + p.name : "Chưa chọn size · " + p.name) : p.name;
    }
    bar.addEventListener("click", function (e) {
      if (e.target.closest("[data-bar-add]")) { if (add()) openMini(p.id + "|" + selected); }
      if (e.target.closest("[data-bar-ask]")) askZalo(p, null);
    });
    var block = $("[data-buy-block]", root), footer = $(".ft"), ticking = false;
    // Chỉ hiện khi nút mua đã cuộn qua phía trên, ẩn khi tới footer
    function syncBar() {
      ticking = false;
      if (!block) return;
      var on = block.getBoundingClientRect().bottom < 0 && (!footer || footer.getBoundingClientRect().top > window.innerHeight);
      bar.classList.toggle("is-show", on);
      document.body.classList.toggle("has-buybar", on);
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(syncBar); } }, { passive: true });
    syncBar();
    markSize();

    // Sản phẩm cùng dòng, cùng tầm giá, đã xem
    var sameLine = IN_STOCK.filter(function (x) { return x.id !== p.id && x.brand === p.brand && (!hasLines || x.line === p.line); }).sort(rank).slice(0, 12);
    var used = {}; sameLine.forEach(function (x) { used[x.id] = 1; });
    var ref = p.minPrice || p.price || 0;
    var samePrice = IN_STOCK.filter(function (x) { return x.id !== p.id && !used[x.id] && x.minPrice && Math.abs(x.minPrice - ref) <= ref * 0.15; })
      .sort(function (a, b) { return (hasPhoto(b) - hasPhoto(a)) || Math.abs(a.minPrice - ref) - Math.abs(b.minPrice - ref); }).slice(0, 12);
    var rel = $("[data-related]");
    rel.innerHTML =
      rail(hasLines && p.line !== OTHER_LINE ? "Cùng dòng " + lineTitle(p.brand, p.line) : "Cùng hãng " + p.brand, sameLine, hasLines && p.line !== OTHER_LINE ? lineUrl(p.brand, p.line) : brandUrl(p.brand), "Xem tất cả") +
      rail("Cùng tầm giá", samePrice) +
      rail("Đã xem gần đây", seenProducts(p.id).slice(0, 10));
    bindRails(rel);
    markSeen(p.id);
  }

  /* ---------- Giỏ hàng ---------- */
  function initCart() {
    var listEl = $("[data-cart-list]"), sumEl = $("[data-cart-summary]"), noteEl = $("[data-cart-note]");
    noteEl.value = storage("slife_note") || "";
    noteEl.addEventListener("input", function () { storage("slife_note", noteEl.value); });

    function render() {
      var cart = getCart();
      $("[data-cart-heading]").textContent = "Giỏ hàng (" + cartCount(cart) + ")";
      if (!cart.length) {
        listEl.innerHTML = '<div class="empty"><h3>Giỏ hàng đang trống</h3><p class="muted">Chọn vài đôi ưng ý rồi quay lại đây để đặt hàng.</p><a class="btn btn--grad" href="shop.html">Xem hàng sẵn</a></div>';
        sumEl.hidden = true;
      } else {
        sumEl.hidden = false;
        listEl.innerHTML = cart.map(function (it, i) {
          var p = BY_ID[it.id], price = itemPrice(p, it.size);
          var still = p.sizes.some(function (s) { return s.s === it.size; });
          return '<div class="cart-item">' +
            '<a class="cart-item__img" href="' + productUrl(p) + '">' + media(p) + "</a>" +
            '<div><a class="cart-item__name" href="' + productUrl(p) + '">' + esc(fullName(p)) + "</a>" +
            '<div class="cart-item__meta">Size ' + esc(it.size) + " · " + money(price) + "</div>" +
            (still ? "" : '<div class="cart-item__meta" style="color:var(--c-berry)">Size này vừa hết trong bảng hàng — nhắn shop kiểm tra.</div>') +
            '<div class="cart-item__row"><div class="qty" role="group" aria-label="Số lượng"><button type="button" data-cq="' + i + '" data-d="-1" aria-label="Giảm"' + (it.qty <= 1 ? " disabled" : "") + '>−</button><input value="' + it.qty + '" readonly aria-label="Số lượng" tabindex="-1"><button type="button" data-cq="' + i + '" data-d="1" aria-label="Tăng"' + (it.qty >= MAX_QTY ? " disabled" : "") + ">+</button></div>" +
            '<span class="cart-item__price">' + money(price * it.qty) + "</span></div></div>" +
            '<button class="cart-item__x" data-remove="' + i + '" aria-label="Xoá ' + esc(p.name) + ' khỏi giỏ">' + I.close + "</button></div>";
        }).join("");
        $("[data-total]", sumEl).textContent = money(cartTotal(cart));
      }
      // Gợi ý: cùng hãng với món trong giỏ
      var inCart = {}, brandsIn = {};
      cart.forEach(function (it) { inCart[it.id] = 1; brandsIn[BY_ID[it.id].brand] = 1; });
      var sug = IN_STOCK.filter(function (x) { return !inCart[x.id] && (!cart.length || brandsIn[x.brand]); }).sort(rank).slice(0, 10);
      $("[data-suggest]").innerHTML = rail("Có thể bạn sẽ thích", sug);
      bindRails($("[data-suggest]"));
    }
    listEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-remove]"), q = e.target.closest("[data-cq]");
      if (!b && !q) return;
      var cart = getCart();
      if (b) cart.splice(+b.dataset.remove, 1);
      if (q) { var it = cart[+q.dataset.cq]; it.qty = Math.max(1, Math.min(MAX_QTY, it.qty + (+q.dataset.d))); }
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
      root.innerHTML = '<div class="empty" style="margin:30px 0"><h3>Giỏ hàng đang trống</h3><p class="muted">Chọn giày trước rồi quay lại đặt hàng nhé.</p><a class="btn btn--grad" href="shop.html">Xem hàng sẵn</a></div>';
      return;
    }
    var total = cartTotal(cart);
    var deposit = Math.round(total * SHOP.depositPercent / 100);
    var saved = storage("slife_customer") || {};

    $("[data-summary]").innerHTML =
      cart.map(function (it) {
        var p = BY_ID[it.id];
        return '<div class="co-item"><div class="co-item__img">' + media(p) + "</div><div>" + esc(fullName(p)) +
          '<br><small class="muted">Size ' + esc(it.size) + (it.qty > 1 ? " · SL " + it.qty : "") + "</small></div><b>" + money(itemPrice(p, it.size) * it.qty) + "</b></div>";
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
        return (i + 1) + ") Mã: " + (p.code || "—") + " / Size: " + it.size + (it.qty > 1 ? " / SL: " + it.qty : "") + " / " + p.name + " — " + money(itemPrice(p, it.size) * it.qty);
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
              items: cart.map(function (it) { var p = BY_ID[it.id]; return { code: p.code, name: p.name, size: it.size, qty: it.qty, price: (itemPrice(p, it.size) || 0) * 1000 }; }),
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
  // Ghi lại images/products/danh-sach.js (danh sách ảnh) sau khi lưu ảnh — giống scripts/image_manifest.py
  function writeManifest(dir) {
    var names = [];
    var it = dir.values();
    function step() {
      return it.next().then(function (r) {
        if (r.done) return;
        if (r.value.kind === "file") names.push(r.value.name);
        return step();
      });
    }
    return step().then(function () {
      var shots = {};
      names.forEach(function (n) {
        var m = n.match(/^(.+?)(?:-(\d{1,2}))?\.(webp|jpe?g|png|JPG)$/);
        if (!m) return;
        var s = shots[m[1]] = shots[m[1]] || {}, k = +(m[2] || 1);
        if (!s[k] || /\.webp$/.test(n)) s[k] = n;
      });
      var out = {};
      Object.keys(shots).sort().forEach(function (stem) {
        var files = [], k = 1;
        while (shots[stem][k]) files.push(shots[stem][k++]);
        if (files.length) out[stem] = files;
      });
      var text = "// File tự sinh (anh.html / scripts/image_manifest.py) — danh sách ảnh sản phẩm đang có. Không cần sửa tay.\n" +
        "window.PRODUCT_IMAGES = " + JSON.stringify(out) + ";\n";
      return dir.getFileHandle("danh-sach.js", { create: true }).then(function (fh) {
        return fh.createWritable().then(function (w) { return w.write(new Blob([text], { type: "text/javascript" })).then(function () { return w.close(); }); });
      });
    }).catch(function () { /* không ghi được danh sách: website vẫn tự dò ảnh */ });
  }
  function initImages() {
    var body = $("[data-img-rows]"), stat = $("[data-img-stat]"), filter = "all", q = "";
    var list = PRODUCTS.slice().sort(function (a, b) { return (b.inStock - a.inStock) || a.order - b.order; });
    var status = {}, dir = null, done = 0, found = 0;
    var canWrite = typeof window.showDirectoryPicker === "function";
    body.innerHTML = list.map(function (p) {
      var file = p.code || p.id;
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
      (shotsOf(p) ? Promise.resolve(shotsOf(p)[0]) : findImage(imgBase(p))).then(function (u) {
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
        if (dir) writeManifest(dir);
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
