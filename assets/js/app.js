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
  var MAX_QTY = 1; // mỗi size 1 đôi; mua nhiều đôi trao đổi thêm trong tin nhắn
  // Danh sách ảnh đang có (images/products/danh-sach.js, do công cụ nhập ảnh ghi). Thiếu thì tự dò như cũ.
  var MANIFEST = window.PRODUCT_IMAGES || null;
  // Khi đã có danh sách, mẫu ngoài danh sách chỉ dò 2 đuôi phổ biến để bớt tải lỗi
  var EXTS = MANIFEST ? ["webp", "jpg"] : IMG_EXT;
  var REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WISH = !!(SHOP.features && SHOP.features.wishlist); // nút Yêu thích: tắt/bật trong data/shop.js
  var ALIASES = SHOP.aliases || {};
  var SIZE_CHARTS = window.SIZE_CHARTS || {};

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
  // Logo hãng (images/brands/<hãng>.png, nền trong suốt, tô màu bằng CSS mask). Hãng chưa có logo: hiện tên in hoa.
  var BRAND_LOGOS = ["new-balance", "asics", "onitsuka-tiger", "jordan", "nike", "adidas", "salomon", "on"];
  function brandLogo(name, cls, wordCls) {
    var s = slug(name);
    if (BRAND_LOGOS.indexOf(s) < 0) return wordCls ? '<span class="' + wordCls + '" aria-hidden="true">' + esc(name.toUpperCase()) + "</span>" : "";
    var u = "url(images/brands/" + s + ".png)"; // ghi thẳng vào thẻ để đường dẫn tính từ trang, không từ file CSS
    return '<span class="' + cls + '" style="-webkit-mask-image:' + u + ";mask-image:" + u + '" role="img" aria-label="Logo ' + esc(name) + '"></span>';
  }
  function lineUrl(b, l) { return (b ? "shop.html?brand=" + slug(b) + "&line=" : "shop.html?line=") + slug(l); }
  function absUrl(path) { return new URL(path, SHOP.siteUrl || location.href).href; }
  // Link gửi đi (Facebook): trang chia sẻ sp/<mã>.html có ảnh xem trước, tự mở trang sản phẩm
  function shareUrl(p) { return absUrl(p.inStock ? "sp/" + encodeURIComponent(p.id) + ".html" : productUrl(p)); }
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
  // Tìm theo tên, hãng, mã (mã viết liền/có gạch đều được) và biệt danh trong data/shop.js (aliases)
  function matcher(q) {
    var nq = norm(q).trim(), alts = [];
    Object.keys(ALIASES).forEach(function (k) {
      var nk = norm(k);
      if (nq === nk || (" " + nq + " ").indexOf(" " + nk + " ") >= 0) {
        ALIASES[k].forEach(function (a) { alts.push(baseMatcher((" " + nq + " ").replace(" " + nk + " ", " " + a + " "))); });
      }
    });
    var base = baseMatcher(q);
    if (!alts.length) return base;
    return function (p) { return base(p) || alts.some(function (m) { return m(p); }); };
  }
  function baseMatcher(q) {
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
    return IN_STOCK.filter(m).sort(function (a, b) {
      var ca = a.code && compact(a.code).indexOf(cq) === 0 ? 1 : 0, cb = b.code && compact(b.code).indexOf(cq) === 0 ? 1 : 0;
      return (b.inStock - a.inStock) || (cb - ca) || rank(a, b);
    });
  }

  /* ---------- Ảnh ----------
     Ảnh sản phẩm: images/products/<MÃ>.webp, ảnh phụ <MÃ>-2.webp… Có danh sách images/products/danh-sach.js thì
     chỉ hiện ảnh trong danh sách (không dò tên file nên không có lỗi 404); danh sách tự cập nhật khi mở xem-web.bat,
     dùng anh.html hoặc các công cụ nhập ảnh. Thiếu danh sách thì dò như cũ.
     Banner, ảnh khách: danh sách images/anh-khac.js (tự sinh), thiếu thì dò như cũ.
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
  // Banner / ảnh khách trong images/anh-khac.js: trả về đường dẫn các file khớp mẫu tên, theo số thứ tự
  var SITE_IMAGES = window.SITE_IMAGES || null;
  function listedImages(folder, re) {
    return (SITE_IMAGES[folder] || []).filter(function (f) { return re.test(f); })
      .sort(function (a, b) { return (parseInt(a.replace(/\D+/g, ""), 10) || 0) - (parseInt(b.replace(/\D+/g, ""), 10) || 0); })
      .map(function (f) { return "images/" + folder + "/" + f; });
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
    if (MANIFEST) return; // có danh sách mà không có mẫu này: chưa có ảnh
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
    var probeImg = !shots && !MANIFEST; // có danh sách mà mẫu chưa có ảnh: chỉ hiện ô "Ảnh thật đang cập nhật"
    return '<div class="media">' +
      '<div class="media__ph" aria-hidden="true"><img src="images/brand/slife-mark-gradient.svg" alt="" width="60" height="61"><span>Ảnh thật đang cập nhật</span></div>' +
      // Ảnh banner đầu trang (đã tải trước) hiện ngay, không mờ dần — ảnh hiện sớm hơn
      (shots || probeImg ? '<img class="media__img' + (o.eager && shots ? " ok" : "") + '" alt="' + esc(fullName(p)) + '" src="' + esc(shots ? shots[0] : base + "." + EXTS[0]) + '" data-base="' + esc(base) + '" data-i="' + (shots ? -1 : 0) + '"' +
      (o.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async" onload="__slifeOk(this)" onerror="__slifeImg(this)">' : "") +
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
    fbc: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-1.56 19.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0012 2z"/></svg>',
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
    if (!WISH) return "";
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
  // Đo hành trình mua: mọi sự kiện đi qua một hàm. Chỉ gửi đi khi đã điền ga4Id trong data/shop.js.
  window.slifeEvents = window.slifeEvents || [];
  function track(name, data) {
    var ev = Object.assign({ event: name, page: document.body.dataset.page, time: Date.now() }, data || {});
    window.slifeEvents.push(ev);
    if (typeof window.gtag === "function") window.gtag("event", name, data || {});
  }
  function loadAnalytics() {
    if (!SHOP.ga4Id || !/^G-[A-Z0-9]+$/.test(SHOP.ga4Id)) return;
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + SHOP.ga4Id;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", SHOP.ga4Id);
  }
  /* ---------- Facebook: kênh tư vấn và chốt đơn chính ----------
     Bấm nút là mở Facebook của shop (SHOP.facebookChat) ở nơi khách đã đăng nhập Facebook:
     - điện thoại: mở thẳng app Facebook (Android: intent tới app; iPhone: fb://), không mở được thì mở link như thường;
     - đang ở trong app Facebook / Messenger: mở ngay tại đó;
     - máy tính dùng Chrome: mở tab mới. Máy tính dùng trình duyệt khác (Edge, Cốc Cốc…): trang web không tự bật được
       Chrome, nên hiện hộp chọn "Sao chép link để mở bằng Chrome" hoặc "Mở luôn bằng trình duyệt này".
     Trên trang sản phẩm, thông tin mẫu (tên, mã, size, giá, link) được chép sẵn để khách dán vào tin nhắn. */
  function fbLink(label, cls, extra) {
    return '<a class="btn btn--fb ' + (cls || "") + '" href="' + esc(SHOP.facebookChat) + '" target="_blank" rel="noopener" data-fb' + (extra || "") + ">" + I.fbc + (label || "Nhắn Facebook cho shop") + "</a>";
  }
  var fbContext = null; // trang sản phẩm gán hàm soạn tin nhắn cho mẫu đang xem
  var fbPending = "";   // tin nhắn vừa chép, để chép lại trong hộp chọn trình duyệt
  function consultMsg(p, size) {
    return "Chào shop, mình cần tư vấn đôi này:\n" + fullName(p) + "\n" +
      "Mã: " + (p.code || p.name) + " / Size: " + (size || "…") + "\n" +
      (p.inStock ? "Giá: " + money(size ? itemPrice(p, size) : p.minPrice) + "\n" : "") +
      "Chân mình dài: … cm\n" +
      "Link: " + shareUrl(p);
  }
  function device() {
    var ua = navigator.userAgent, brands = (navigator.userAgentData && navigator.userAgentData.brands) || [];
    var android = /Android/i.test(ua), ios = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    return {
      android: android, ios: ios, mobile: android || ios || /Mobi/i.test(ua),
      fbApp: /FBAN|FBAV|FB_IAB|FBIOS|MessengerForiOS/i.test(ua),
      chrome: brands.length ? brands.some(function (b) { return b.brand === "Google Chrome"; }) : /Chrome\/\d/.test(ua) && !/Edg\/|OPR\/|coc_coc|YaBrowser|Vivaldi/i.test(ua),
      name: /Edg\//.test(ua) ? "Edge" : /coc_coc/i.test(ua) ? "Cốc Cốc" : /Firefox\//.test(ua) ? "Firefox" : /OPR\//.test(ua) ? "Opera" : /Safari\//.test(ua) && !/Chrome\//.test(ua) ? "Safari" : "trình duyệt này",
    };
  }
  function openFacebook(e) {
    var url = SHOP.facebookChat, d = device();
    if (!url || d.fbApp) return; // trong app Facebook: link mở ngay trong app
    if (d.mobile) {
      if (SHOP.openFacebookApp === false) return;
      var target = d.android
        ? "intent://" + url.replace(/^https?:\/\//, "") + "#Intent;scheme=https;package=com.facebook.katana;S.browser_fallback_url=" + encodeURIComponent(url) + ";end"
        : d.ios ? (SHOP.facebookId ? "fb://profile/" + SHOP.facebookId : "fb://facewebmodal/f?href=" + encodeURIComponent(url)) : null;
      if (!target) return;
      e.preventDefault();
      location.href = target;
      // Không mở được app (chưa cài, trình duyệt trong app khác chặn): mở link như thường
      setTimeout(function () { if (!document.hidden) location.href = url; }, 1600);
      return;
    }
    if (d.chrome || SHOP.desktopAskChrome === false || storage("slife_fb_here")) return;
    e.preventDefault();
    chooseBrowser(url, d.name);
  }
  function chooseBrowser(url, name) {
    var m = modal(
      "<h3>Mở Facebook của shop</h3>" +
      '<p class="muted" style="font-size:14.5px;margin:8px 0 0">Bạn đang xem web bằng <b>' + esc(name) + "</b>. Trang web không tự mở được Chrome. Nếu Facebook của bạn đăng nhập trên <b>Chrome</b>:</p>" +
      '<ol class="steps-mini fb-steps"><li><button type="button" class="btn btn--fb btn--sm" data-fbc-link data-autofocus>' + I.fbc + "Sao chép link Facebook shop</button><br>rồi mở Chrome, dán vào thanh địa chỉ (Ctrl + V), Enter.</li>" +
      (fbPending ? '<li>Ở trang Facebook của shop, bấm <b>Nhắn tin</b>. Quay lại đây bấm <button type="button" class="btn btn--ghost btn--sm" data-fbc-msg>Sao chép tin nhắn</button> rồi dán vào khung chat.</li>' : "") + "</ol>" +
      '<div class="modal__actions"><a class="btn btn--ghost" href="' + esc(url) + '" target="_blank" rel="noopener" data-fbc-here>Mở luôn bằng ' + esc(name) + "</a></div>" +
      '<label class="check" style="margin-top:10px"><input type="checkbox" data-fbc-remember> Lần sau mở luôn bằng ' + esc(name) + ", không hỏi lại</label>"
    );
    m.el.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-fbc-link]")) { copyText(url); toast("Đã chép link — mở Chrome, dán vào thanh địa chỉ"); track("copy_fb_link", {}); }
      if (ev.target.closest("[data-fbc-msg]")) { copyText(fbPending); toast("Đã chép tin nhắn — dán vào khung chat Facebook"); }
      if (ev.target.closest("[data-fbc-here]")) {
        if ($("[data-fbc-remember]", m.el).checked) storage("slife_fb_here", 1);
        if (fbPending) copyText(fbPending);
        setTimeout(m.close, 0);
      }
    });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-fb]");
    if (!a) return;
    if (a.hasAttribute("data-fb-copy") && fbContext) {
      fbPending = fbContext(a.dataset.fbSize || null);
      copyText(fbPending);
      toast("Đã chép sẵn thông tin mẫu — dán vào tin nhắn cho shop");
      track("copy_message", { source: "san_pham" });
    }
    track("open_facebook", { source: a.dataset.fbSource || document.body.dataset.page });
    openFacebook(e);
  });

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
    if (p.inStock && p.sizes.length === 1) tags.push(pill("info", "Còn 1 size", 1));
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
      '<div class="card__body">' +
      '<h3 class="card__name"><a href="' + url + '">' + esc(p.name) + "</a></h3>" +
      (p.code ? '<div class="card__code">' + esc(p.code) + "</div>" : "") +
      (p.inStock ? '<div class="card__sizes">Size ' + esc(sizes.join(" · ")) + "</div>" : "") +
      (p.inStock
        ? '<div class="card__price">' + (p.minPrice < p.price ? "<small>Từ</small>" : "") + money(p.minPrice) + "</div>"
        : '<div class="card__price is-out">Tạm hết size</div>') +
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
            '<div><a class="mini__name" href="' + productUrl(p) + '">' + esc(fullName(p)) + '</a><div class="mini__meta">Size ' + esc(it.size) + "</div></div>" +
            '<div class="mini__price">' + money(itemPrice(p, it.size)) + "</div></div>";
        }).join("") + "</div>" +
          '<div class="mini__foot"><div class="mini__sum"><span>Tạm tính (' + cartCount(cart) + ' đôi)</span><b>' + money(cartTotal(cart)) + "</b></div>" +
          '<p class="muted" style="font-size:13px;margin:0">Shop xác nhận size, phí ship và tiền cọc qua Facebook.</p>' +
          '<div class="row2"><a class="btn btn--ghost" href="cart.html">Xem giỏ hàng</a><a class="btn btn--grad" href="dat-hang.html" data-autofocus>Gửi yêu cầu</a></div>' +
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
    var file = location.pathname.split("/").pop() || "index.html";
    var needs = needsList();
    var headerEl = $("#site-header");
    if (headerEl) {
      // Dòng chữ đầu trang: đứng yên (không chạy chữ). Máy tính hiện cả 3 câu, điện thoại hiện câu đầu.
      var msgs = (SHOP.announcements && SHOP.announcements.length ? SHOP.announcements : [SHOP.announcement]).filter(Boolean);
      function navLink(href, text) { return '<div class="nav__item"><a class="nav__link" href="' + href + '"' + (file === href ? ' aria-current="page"' : "") + ">" + text + "</a></div>"; }
      headerEl.outerHTML =
        '<a class="skip" href="#main">Bỏ qua, tới nội dung chính</a>' +
        (msgs.length ? '<div class="announce"><div class="container announce__in">' +
          msgs.map(function (m, i) { return "<span" + (i ? ' class="announce__more"' : "") + ">" + esc(m) + "</span>"; }).join('<i aria-hidden="true">·</i>') +
          "</div></div>" : "") +
        '<header class="hd"><div class="container hd__row">' +
        '<button type="button" class="icon-btn hd__menu" data-menu-open aria-label="Mở menu" aria-controls="menu" aria-expanded="false">' + I.menu + "</button>" +
        '<a class="logo" href="index.html" aria-label="' + esc(SHOP.name) + ' — Trang chủ"><img class="logo__img" src="images/brand/slife-logo-square-192.webp" alt="S&amp;LIFE Since 2021" width="52" height="52"></a>' +
        '<form class="search" action="shop.html" role="search" data-search>' + '<svg class="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
        '<input type="search" name="q" value="' + esc(q) + '" placeholder="Tìm tên, mã hoặc biệt danh, VD: 204L, AF1" aria-label="Tìm giày theo tên, mã hoặc biệt danh" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="search-pop">' +
        '<button type="submit" class="search__go">Tìm</button><div class="search__pop" id="search-pop" role="listbox" aria-label="Gợi ý tìm kiếm" hidden></div></form>' +
        '<nav class="nav" aria-label="Menu chính">' +
        navLink("shop.html", "Hàng sẵn") +
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
        navLink("size-guide.html", "Chọn size") + navLink("lien-he.html", "Liên hệ") +
        "</nav>" +
        '<div class="hd__icons">' +
        '<a class="icon-btn hd__fb" href="' + esc(SHOP.facebookChat) + '" target="_blank" rel="noopener" aria-label="Nhắn Facebook cho shop" data-fb>' + I.fbc + "</a>" +
        (WISH ? '<a class="icon-btn" href="shop.html?wish=1" aria-label="Yêu thích">' + I.heart + '<span class="badge" data-wish-count hidden>0</span></a>' : "") +
        '<a class="icon-btn" href="cart.html" aria-label="Giỏ hàng">' + I.bag + '<span class="badge" data-cart-count hidden>0</span></a>' +
        "</div></div></header>" +
        // Ngăn kéo menu điện thoại
        '<div class="drawer" id="menu" aria-hidden="true"><div class="drawer__backdrop" data-menu-close></div>' +
        '<div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">' +
        '<div class="drawer__head"><b>Menu</b><button type="button" class="icon-btn" data-menu-close aria-label="Đóng menu">' + I.close + "</button></div>" +
        '<div class="drawer__body">' +
        '<div class="drawer__title">Giày theo hãng</div>' +
        '<div class="m-item"><div class="m-row"><a href="shop.html">Tất cả hàng sẵn <small>' + IN_STOCK.length + " mẫu</small></a></div></div>" +
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
        '<a href="size-guide.html">Hướng dẫn chọn size</a><a href="policy.html">Mua hàng, giao hàng &amp; đổi size</a><a href="gioi-thieu.html">Giới thiệu</a><a href="lien-he.html">Liên hệ</a><a href="cart.html">Giỏ hàng</a></div>' +
        '<div class="m-contact"><p style="margin:0 0 10px">Tư vấn size và chốt đơn qua Facebook (' + esc(SHOP.openHours) + ").</p>" + fbLink("Nhắn Facebook cho shop", "btn--block") + "</div>" +
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
        [SHOP.facebookChat, I.fbc, "Facebook " + (SHOP.facebookChatName || "")],
        SHOP.facebookOwner ? [SHOP.facebookOwner, I.fb, "Facebook " + (SHOP.facebookName || "chủ shop")] : null,
        SHOP.instagram ? [SHOP.instagram, I.ig, "Instagram S&LIFE Sneaker"] : null,
        SHOP.tiktok ? [SHOP.tiktok, I.tt, "TikTok S&LIFE"] : null,
      ].filter(Boolean);
      footerEl.outerHTML =
        '<footer class="ft"><div class="container">' +
        '<div class="ft__trust">' +
        "<div>" + I.shield + '<p style="margin:0"><b>Chính hãng</b><span>Mã sản phẩm khớp tem hộp</span></p></div>' +
        "<div>" + I.ruler + '<p style="margin:0"><b>Tư vấn size</b><span>Theo form từng dòng giày</span></p></div>' +
        "<div>" + I.camera + '<p style="margin:0"><b>Ảnh thật</b><span>Shop gửi ảnh đôi giày trước khi giao</span></p></div>' +
        "<div>" + I.swap + '<p style="margin:0"><b>Đổi size ' + SHOP.returnDays + " ngày</b><span>Còn nguyên hộp, tem</span></p></div></div>" +
        '<div class="ft__grid">' +
        '<div><a href="index.html" aria-label="' + esc(SHOP.name) + '"><img class="ft__logo" src="images/brand/slife-full-white.svg" alt="S&amp;LIFE Since 2021" width="96" height="143" loading="lazy"></a>' +
        '<ul class="ft__info">' +
        "<li>" + esc(SHOP.name) + " — giày chính hãng, hàng sẵn. Bán online, giao toàn quốc.</li>" +
        (SHOP.legalName ? "<li>" + esc(SHOP.legalName) + "</li>" : "") +
        (SHOP.address ? "<li>Địa chỉ: " + esc(SHOP.address) + "</li>" : "") +
        (SHOP.email ? '<li>Email: <a href="mailto:' + esc(SHOP.email) + '">' + esc(SHOP.email) + "</a></li>" : "") +
        (SHOP.taxCode ? "<li>MST / GPKD: " + esc(SHOP.taxCode) + "</li>" : "") +
        "<li>Tư vấn qua Facebook: " + esc(SHOP.openHours) + "</li></ul>" +
        '<div class="ft__social">' + social.map(function (s) {
          return '<a href="' + esc(s[0]) + '" target="_blank" rel="noopener" aria-label="' + esc(s[2]) + '" title="' + esc(s[2]) + '">' + s[1] + "</a>";
        }).join("") + "</div></div>" +
        "<div><h4>Cửa hàng</h4><ul>" +
        '<li><a href="shop.html">Tất cả hàng sẵn</a></li>' +
        brands.slice(0, 7).map(function (b) { return '<li><a href="' + brandUrl(b.name) + '">Giày ' + esc(b.name) + "</a></li>"; }).join("") +
        "</ul></div>" +
        '<div><h4>Hỗ trợ</h4><ul><li><a href="gioi-thieu.html">Giới thiệu</a></li><li><a href="policy.html#dat-hang">Cách mua hàng</a></li><li><a href="size-guide.html">Hướng dẫn chọn size</a></li><li><a href="policy.html#doi-tra">Đổi size, đổi trả</a></li><li><a href="policy.html#ship">Giao hàng, đặt cọc</a></li><li><a href="policy.html#khieu-nai">Giải quyết khiếu nại</a></li><li><a href="chinh-sach-bao-mat.html">Chính sách bảo mật</a></li><li><a href="lien-he.html">Liên hệ</a></li></ul></div>' +
        "<div><h4>Mua hàng</h4>" +
        '<ol class="ft__steps"><li>Chọn mẫu và size còn sẵn</li><li>Gửi yêu cầu cho shop qua Facebook</li><li>Shop xác nhận size, phí ship và tiền cọc</li></ol>' +
        '<p class="ft__note">Website không thu tiền. Số tài khoản và mức cọc shop gửi riêng trong tin nhắn.</p>' +
        fbLink("Nhắn Facebook", "btn--sm ft__fb") +
        (SHOP.bctUrl ? '<a class="ft__bct" href="' + esc(SHOP.bctUrl) + '" target="_blank" rel="noopener">✓ Đã thông báo Bộ Công Thương</a>' : "") +
        "</div></div>" +
        '<div class="ft__bottom"><span>© ' + new Date().getFullYear() + " " + esc(SHOP.name) + ' · Since 2021</span><button type="button" data-top>Lên đầu trang ↑</button></div>' +
        "</div></footer>";
    }

    var hd = $(".hd");
    // Chiều cao header thật (để thanh lọc, cột ảnh dính đúng chỗ)
    function syncHd() { if (hd) document.documentElement.style.setProperty("--hd-h", hd.offsetHeight + "px"); }
    syncHd();
    window.addEventListener("resize", debounce(syncHd, 100));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHd);
    window.addEventListener("scroll", function () { if (hd) hd.classList.toggle("is-scrolled", window.scrollY > 4); }, { passive: true });

    var menu = $("#menu");
    function closeMegas(except) { $all("[data-mega-item].is-open").forEach(function (it) { if (it !== except) { it.classList.remove("is-open"); $(".nav__link", it).setAttribute("aria-expanded", "false"); } }); }
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
      if (t.closest("[data-top]")) window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
      var w = t.closest("[data-wish]");
      if (w) { e.preventDefault(); toggleWish(w.dataset.wish); }
      var qa = t.closest("[data-quick]");
      if (qa) { e.preventDefault(); quickAdd(BY_ID[qa.dataset.quick]); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (menu && menu.classList.contains("is-open")) { openLayer(menu, false); }
      var mini = $("#mini");
      if (mini && mini.classList.contains("is-open")) openLayer(mini, false);
      closeMegas();
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
        : '<div class="sug-empty">Chưa thấy mẫu “' + esc(q) + '”. Thử gõ mã in trên tem hộp, hoặc <a href="' + esc(SHOP.facebookChat) + '" target="_blank" rel="noopener" data-fb>nhắn Facebook</a> để shop tìm giúp.</div>';
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
      track("search", { q: q });
      // Gõ đúng mã sản phẩm: vào thẳng trang sản phẩm
      var exact = BY_CODE[compact(q)];
      if (exact) { e.preventDefault(); location.href = productUrl(exact); }
    });
  }

  /* ---------- Trang chủ ---------- */
  // Hero: không tự chuyển (tránh chuyển động), khách bấm chấm / mũi tên hoặc vuốt
  function hero(root, slides) {
    var track = $("[data-hero-track]", root), dots = $("[data-hero-dots]", root), cur = 0;
    function all() { return $all(".hero__slide", track); }
    function paint() {
      var list = all();
      dots.innerHTML = list.length > 1 ? list.map(function (s, i) { return '<button type="button" data-dot="' + i + '" aria-label="Xem slide ' + (i + 1) + '"></button>'; }).join("") : "";
      $all(".hero__nav", root).forEach(function (n) { n.hidden = list.length < 2; });
      go(cur);
    }
    function go(i) {
      var list = all();
      if (!list.length) return;
      cur = (i + list.length) % list.length;
      track.style.transform = "translateX(" + (-100 * cur) + "%)";
      list.forEach(function (s, j) { s.setAttribute("aria-hidden", j !== cur); s.inert = j !== cur; });
      $all("[data-dot]", dots).forEach(function (d, j) { d.classList.toggle("is-active", j === cur); d.setAttribute("aria-current", j === cur); });
    }
    track.innerHTML = slides.join("");
    root.addEventListener("click", function (e) {
      var d = e.target.closest("[data-dot]"), n = e.target.closest("[data-hero-go]");
      if (d) go(+d.dataset.dot);
      if (n) go(cur + (+n.dataset.heroGo));
    });
    var x0 = null, y0 = null;
    track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1));
      x0 = null;
    });
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
        '<div class="hero__kicker"><img src="images/brand/slife-mark-white.svg" alt="" width="22" height="22">S&amp;LIFE Sneaker · Since 2021</div>' +
        '<h2 class="hero__title"><span>Only</span><span>Authentic</span></h2>' +
        '<p class="hero__lead">Giày chính hãng, có sẵn size. Mỗi đôi có mã sản phẩm khớp tem hộp — tra trên trang chủ của hãng ra đúng mẫu, đúng màu.</p>' +
        '<div class="hero__cta"><a class="btn btn--light" href="shop.html">Xem ' + IN_STOCK.length + ' mẫu có sẵn</a><a class="btn btn--line-light" href="size-guide.html">Hướng dẫn chọn size</a></div></div>' +
        '<div class="hero__art">' +
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
          '<h2 class="hero__title"><span>' + esc(tb) + "</span><span>" + esc(tl) + "</span></h2>" +
          '<p class="hero__lead">' + inLine.length + " mẫu " + esc(lineTitle(tb, tl)) + " đang có sẵn tại shop" + (szs.length > 1 ? ", size từ " + esc(szs[0]) + " đến " + esc(szs[szs.length - 1]) : "") + ". Ảnh chụp thật từng đôi.</p>" +
          '<div class="hero__cta"><a class="btn btn--light" href="' + lineUrl(tb, tl) + '">Xem dòng ' + esc(tl) + '</a><a class="btn btn--line-light" href="' + brandUrl(tb) + '">Tất cả ' + esc(tb) + "</a></div></div>" +
          '<div class="hero__art"><div class="hero__stack">' + byLine[topLine].slice(0, 3).map(function (p) { return '<a href="' + productUrl(p) + '" aria-label="' + esc(p.name) + '">' + media(p) + "</a>"; }).join("") + "</div></div>" +
          "</div></div>"
        );
      }
      slides.push(
        '<div class="hero__slide hero__slide--ink"><div class="container hero__in"><div>' +
        '<div class="hero__kicker">Tư vấn trước khi chốt</div>' +
        '<h2 class="hero__title"><span>Hỏi size</span><span>trước khi mua</span></h2>' +
        '<p class="hero__lead">Nhắn Facebook số cm chân và đôi bạn đang đi vừa nhất — shop tư vấn theo form từng dòng, gửi ảnh chụp thật trước khi giao.</p>' +
        '<div class="hero__cta">' + fbLink("Nhắn Facebook cho shop", "btn--light") + '<a class="btn btn--line-light" href="policy.html#dat-hang">Cách mua hàng</a></div></div>' +
        '<div class="hero__art"><img class="hero__mark" src="images/brand/slife-full-white.svg" alt="S&amp;LIFE Since 2021" width="340" height="507"></div>' +
        "</div></div>"
      );
      var h = hero(heroEl, slides);
      // Banner ảnh shop tự tải lên: images/banners/banner-1.jpg … thêm vào cuối hero
      (SITE_IMAGES ? Promise.resolve(listedImages("banners", /^banner-\d+\.(jpe?g|png|webp)$/i).slice(0, 6)) : findSeries("images/banners/banner-", 1, 6, ["jpg", "webp"])).then(function (urls) {
        urls.forEach(function (u, i) {
          h.add('<div class="hero__slide hero__slide--img"><img src="' + esc(u) + '" alt="Banner S&amp;LIFE ' + (i + 1) + '" loading="lazy"><div class="container hero__in"><div><div class="hero__cta"><a class="btn btn--light" href="shop.html">Xem hàng sẵn</a></div></div></div></div>');
        });
      });
    }

    // Hàng sẵn, mua ngay — ngay sau hero
    var picks = $("[data-picks]");
    if (picks) {
      picks.innerHTML = rail("Hàng sẵn, mua ngay", IN_STOCK.slice().sort(rank).slice(0, 12), "shop.html", "Xem tất cả " + IN_STOCK.length + " mẫu có sẵn", "Còn size tại shop · mẫu có ảnh chụp thật được xếp trước");
    }

    var perksEl = $("[data-perks]");
    if (perksEl) {
      perksEl.innerHTML = [
        [I.shield, "Chính hãng", "Mã sản phẩm khớp tem hộp, tra được trên trang chủ hãng"],
        [I.ruler, "Tư vấn size", "Theo form từng dòng, trước khi chốt đơn"],
        [I.camera, "Ảnh thật", "Shop gửi ảnh chụp đôi giày trước khi giao"],
        [I.swap, "Đổi size " + SHOP.returnDays + " ngày", "Còn nguyên hộp, tem, chưa đi ngoài trời"],
      ].map(function (x) { return '<div class="perk"><span class="perk__ic">' + x[0] + "</span><b>" + x[1] + "</b><span>" + x[2] + "</span></div>"; }).join("");
    }

    var brandEl = $("[data-brands]");
    if (brandEl) {
      brandEl.innerHTML = brands.map(function (b) {
        return '<a class="brand-tile" href="' + brandUrl(b.name) + '">' + brandLogo(b.name, "brand-tile__logo", "brand-tile__word") +
          '<span class="brand-tile__meta"><b>' + esc(b.name) + "</b><small>" + b.count + " mẫu có sẵn</small></span></a>";
      }).join("") +
        '<a class="brand-tile brand-tile--all" href="shop.html"><span class="brand-tile__word" aria-hidden="true">' + IN_STOCK.length + '</span><span class="brand-tile__meta"><b>Tất cả hàng sẵn</b><small>Mọi hãng</small></span></a>';
    }
    var needsEl = $("[data-needs]");
    if (needsEl) needsEl.innerHTML = needsList().map(function (x) { return '<a class="need" href="' + x.href + '"><b>' + esc(x.label) + "</b><span>" + esc(x.sub) + " · " + x.n + " mẫu</span></a>"; }).join("");

    // Dòng giày nổi bật: ô lớn
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
        // Chưa có ảnh thật: chỉ ghi tên dòng một lần (tên hãng nhỏ phía trên), không lặp nhãn ở đáy
        return '<a class="line-card line-card--text" href="' + lineUrl(x.brand, x.line) + '" aria-label="' + esc(title) + ", " + x.count + ' mẫu">' +
          '<span class="line-card__plain"><small>' + esc(x.brand) + '</small><b class="' + (word.length > 9 ? "is-long" : word.length > 5 ? "is-mid" : "") + '">' + esc(word) + "</b><em>" + x.count + " mẫu</em></span></a>";
      }).join("");
    }

    // Khối tư vấn size: trả lời nỗi lo lớn nhất của khách (size, form)
    var consult = $("[data-consult]");
    if (consult) {
      consult.innerHTML = '<div class="consult__text"><h2>Chưa chắc size?</h2>' +
        "<p>Mỗi dòng giày có form khác nhau: Mexico 66 hẹp và ngắn, Samba thân hẹp, 204L thoải mái. Trên từng mẫu đã có lưu ý form và bảng size; cần chắc hơn, nhắn shop.</p>" +
        '<ol class="consult__steps"><li><b>Đo chân</b>Đứng trên tờ A4, đo từ gót tới ngón dài nhất (cm).</li><li><b>Nhắn shop</b>Gửi số cm và tên đôi bạn đang đi vừa nhất.</li><li><b>Chốt size</b>Shop tư vấn size theo form của mẫu bạn chọn.</li></ol>' +
        '<div class="consult__cta">' + fbLink("Hỏi size qua Facebook", "btn--grad") + '<a class="btn btn--ghost" href="size-guide.html">Hướng dẫn chọn size</a></div></div>' +
        '<div class="consult__notes"><h3>Lưu ý form thường gặp</h3><ul>' +
        FIT_NOTES.slice(0, 6).map(function (f) { return "<li><b>" + esc(f.line) + "</b><span>" + esc(f.advice) + "</span></li>"; }).join("") + "</ul></div>";
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
      (SITE_IMAGES ? Promise.resolve(listedImages("khach-hang", /^\d+\.(jpe?g|png|webp)$/i).slice(0, 24)) : findSeries("images/khach-hang/", 1, 24, ["jpg", "webp"])).then(function (urls) {
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
        [SHOP.facebookChat, I.fbc, "Facebook", "Tư vấn và chốt đơn"],
        SHOP.facebookOwner && SHOP.facebookOwner !== SHOP.facebookChat ? [SHOP.facebookOwner, I.fb, "Facebook", SHOP.facebookName || "Chủ shop"] : null,
        SHOP.instagram ? [SHOP.instagram, I.ig, "Instagram", handle(SHOP.instagram)] : null,
        SHOP.tiktok ? [SHOP.tiktok, I.tt, "TikTok", handle(SHOP.tiktok)] : null,
      ].filter(Boolean);
      follow.innerHTML = '<div class="container follow__in"><div><h2>Theo dõi S&amp;LIFE</h2>' +
        "<p>Hàng mới về, ảnh thật từng đôi và mẹo chọn size — shop đăng trên các kênh dưới đây.</p></div>" +
        '<div class="follow__links">' + links.map(function (l) {
          return '<a href="' + esc(l[0]) + '" target="_blank" rel="noopener"' + (l[0] === SHOP.facebookChat ? " data-fb" : "") + ">" + l[1] + "<span><b>" + l[2] + "</b><small>" + esc(l[3]) + "</small></span></a>";
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
    var wishMode = WISH && p.get("wish") === "1";

    var state = {
      q: p.get("q") || "",
      brands: (p.get("brands") || "").split(",").filter(Boolean),
      sizes: (p.get("size") || "").split(",").filter(Boolean),
      colors: (p.get("color") || "").split(",").filter(Boolean),
      genders: (p.get("gender") || "").split(",").filter(Boolean),
      min: +p.get("min") || 0,
      max: +p.get("max") || 0,
      sort: p.get("sort") || "default",
      lines: (p.get("lines") || "").split(",").filter(Boolean),
      showOut: false, // website chỉ hiện hàng sẵn
      page: Math.max(1, +p.get("page") || 1),
    };

    var title = wishMode ? "Yêu thích" : line ? lineTitle(brand, line) : brand ? "Giày " + brand : state.q ? "Kết quả cho “" + state.q + "”" : "Giày chính hãng";
    var titleEl = $("[data-title]");
    titleEl.innerHTML = brand && !line ? 'Giày <span class="grad-text">' + esc(brand) + "</span>" : esc(title);
    if (brand && !line) titleEl.insertAdjacentHTML("beforebegin", brandLogo(brand, "coll__brandlogo").replace(/role="img" aria-label="[^"]*"/, 'aria-hidden="true"'));
    document.title = title + " — " + SHOP.name;
    var trail = [["Trang chủ", "index.html"], ["Hàng sẵn", brand || line || state.q || wishMode ? "shop.html" : ""]];
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
        var name = tries[i].replace("images/banners/", "");
        (SITE_IMAGES ? Promise.resolve(listedImages("banners", new RegExp("^" + name + "\\.(jpe?g|png|webp)$", "i"))[0] || null) : findImage(tries[i], ["jpg", "webp"])).then(function (u) {
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
    var pool = IN_STOCK.filter(function (x) {
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
      '<div data-lines-filter></div>' +
      (sizeKeys.length ? section("Size (EU)", '<div class="size-grid">' +
        sizeKeys.map(function (s) { return '<button type="button" class="size-btn" data-size="' + esc(s) + '" aria-pressed="false">' + esc(s) + "</button>"; }).join("") +
        '</div><p class="filter__note">40Y: size 40 bản GS. Chọn nhiều size được.</p>', true) : "") +
      (pMax > pMin ? section("Khoảng giá", '<div class="range" data-range><div class="range__track"></div><div class="range__fill" data-range-fill></div>' +
        '<input type="range" min="' + pMin + '" max="' + pMax + '" step="100" data-range-min aria-label="Giá thấp nhất">' +
        '<input type="range" min="' + pMin + '" max="' + pMax + '" step="100" data-range-max aria-label="Giá cao nhất"></div>' +
        '<div class="price-inputs"><label><input type="number" inputmode="numeric" step="100" min="0" data-price-min aria-label="Giá từ (nghìn đồng)"><span>k</span></label><span class="muted">–</span>' +
        '<label><input type="number" inputmode="numeric" step="100" min="0" data-price-max aria-label="Giá đến (nghìn đồng)"><span>k</span></label></div>' +
        '<div class="price-quick">' + PRICE_QUICK.map(function (r, i) { return '<button type="button" data-price-quick="' + i + '">' + r.label + "</button>"; }).join("") + "</div>", true) : "") +
      section("Dành cho", ["nam", "nu", "gs", "kid"].map(function (g) { return '<label class="check"><input type="checkbox" name="gender" value="' + g + '"> Code ' + GENDER_LABEL[g] + "</label>"; }).join("") +
        '<p class="filter__note">Mẫu không ghi code là unisex / size nam.</p>', false);

    // Lọc theo dòng giày: trong trang hãng, hoặc khi đã chọn 1–3 hãng
    var linesBox = $("[data-lines-filter]", fEl), linesKey = null;
    function lineOptions() {
      var bs = brand ? [brand] : state.brands.length && state.brands.length <= 3 ? state.brands : [];
      if (line) return [];
      var out = [];
      bs.forEach(function (b) {
        var ls = lineList(b);
        if (ls.length > 1) ls.forEach(function (l) { out.push({ key: b + "|" + l.name, label: (bs.length > 1 ? b + " · " : "") + l.name, n: l.count }); });
      });
      return out;
    }
    function renderLines() {
      var opts = lineOptions(), key = opts.map(function (o) { return o.key; }).join(",");
      // Bỏ các dòng không còn thuộc hãng đang chọn
      state.lines = state.lines.filter(function (k) { return key.split(",").indexOf(k) >= 0; });
      if (key === linesKey) return;
      linesKey = key;
      linesBox.innerHTML = opts.length ? section("Dòng giày", opts.map(function (o) {
        return '<label class="check"><input type="checkbox" name="line" value="' + esc(o.key) + '"' + (state.lines.indexOf(o.key) >= 0 ? " checked" : "") + "> " + esc(o.label) + " <small>" + o.n + "</small></label>";
      }).join(""), true) : "";
    }

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
      $all('input[name="line"]', fEl).forEach(function (i) { i.checked = state.lines.indexOf(i.value) >= 0; });
      $all("[data-size]", fEl).forEach(function (b) { var on = state.sizes.indexOf(b.dataset.size) >= 0; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on); });
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
      if (state.lines.length) u.set("lines", state.lines.join(","));
      if (state.genders.length) u.set("gender", state.genders.join(","));
      if (state.min) u.set("min", state.min);
      if (state.max) u.set("max", state.max);
      if (state.sort !== "default") u.set("sort", state.sort);
      if (state.page > 1) u.set("page", state.page);
      history.replaceState(null, "", "shop.html" + (u.toString() ? "?" + u : ""));
    }
    function filtered() {
      var m = matcher(state.q);
      var list = pool.filter(function (x) {
        if (!state.showOut && !x.inStock) return false;
        if (state.brands.length && state.brands.indexOf(x.brand) < 0) return false;
        if (state.genders.length && state.genders.indexOf(x.gender) < 0) return false;
        if (state.lines.length && state.lines.indexOf(x.brand + "|" + x.line) < 0) return false;
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
      state.lines.forEach(function (k) { chips.push(["line", k, k.split("|")[1] + (brand ? "" : " (" + k.split("|")[0] + ")")]); });
      state.genders.forEach(function (g) { chips.push(["gender", g, "Code " + GENDER_LABEL[g]]); });
      if (state.q && (brand || wishMode)) chips.push(["q", "", "“" + state.q + "”"]);
      return chips;
    }
    function chipHtml(c) { return '<button type="button" data-remove="' + c[0] + '" data-value="' + esc(c[1]) + '" aria-label="Bỏ lọc ' + esc(c[2]) + '">' + esc(c[2]) + I.close + "</button>"; }

    function render() {
      renderLines();
      var list = filtered();
      var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      if (state.page > pages) state.page = pages;
      var start = (state.page - 1) * PAGE_SIZE;
      var chips = activeChips();
      countEl.textContent = list.length + " mẫu có sẵn";
      if (list.length) {
        gridEl.innerHTML = list.slice(start, start + PAGE_SIZE).map(card).join("");
      } else if (wishMode && !chips.length) {
        gridEl.innerHTML = '<div class="empty"><h2>Chưa có mẫu yêu thích</h2><p class="muted">Bấm biểu tượng trái tim trên mẫu giày để lưu lại, xem lại sau ở đây (lưu trên trình duyệt này).</p><div class="empty__actions"><a class="btn btn--grad" href="shop.html">Xem hàng sẵn</a></div></div>';
      } else {
        gridEl.innerHTML = '<div class="empty"><h2>Chưa có mẫu phù hợp</h2>' +
          '<p class="muted">' + (chips.length ? "Thử bỏ bớt bộ lọc bên dưới." : "Thử gõ mã in trên tem hộp, hoặc tên ngắn hơn (VD: 204L, Samba).") + " Website chỉ hiện hàng đang có sẵn — cần mẫu khác, nhắn Facebook để shop tư vấn.</p>" +
          (chips.length ? '<div class="empty__chips chips">' + chips.map(chipHtml).join("") + "</div>" : "") +
          '<div class="empty__actions">' + (chips.length ? '<button type="button" class="btn btn--ghost" data-clear>Xoá tất cả bộ lọc</button>' : "") +
          fbLink("Nhắn Facebook cho shop") + "</div></div>" +
          '<div style="grid-column:1/-1">' + rail("Gợi ý cho bạn", IN_STOCK.slice().sort(rank).slice(0, 10)) + "</div>";
        bindRails(gridEl);
      }
      pagerEl.innerHTML = pagesHtml(list.length);
      chipsEl.innerHTML = chips.map(chipHtml).join("") + (chips.length > 1 ? '<button type="button" class="chips__clear" data-clear>Xoá tất cả</button>' : "");
      chipsEl.hidden = !chips.length;
      var n = state.brands.length + state.lines.length + state.sizes.length + state.genders.length + (state.min || state.max ? 1 : 0);
      $("[data-filter-count]").innerHTML = n ? "<b>" + n + "</b>" : "";
      $("[data-apply]").textContent = "Xem " + list.length + " mẫu";
      writeUrl();
    }
    function toggle(arr, v) { var i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); }
    function openFilters(open) { openLayer(fEl, open); }
    function clearAll() { state.brands = []; state.lines = []; state.sizes = []; state.genders = []; state.min = 0; state.max = 0; if (brand || wishMode) state.q = ""; state.page = 1; syncInputs(); render(); }

    function trackFilter() { track("filter", { brands: state.brands.join(","), lines: state.lines.join(","), sizes: state.sizes.join(","), min: state.min, max: state.max }); }
    fEl.addEventListener("change", function (e) {
      var t = e.target;
      setTimeout(trackFilter, 0);
      if (t.name === "brand") toggle(state.brands, t.value);
      if (t.name === "gender") toggle(state.genders, t.value);
      if (t.name === "line") toggle(state.lines, t.value);
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
      if (b) { toggle(state.sizes, b.dataset.size); state.page = 1; syncInputs(); render(); trackFilter(); }
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
      if (k === "line") toggle(state.lines, v);
      if (k === "gender") toggle(state.genders, v);
      if (k === "price") { state.min = 0; state.max = 0; }
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
  // Bảng size tham khảo theo hãng (data/shop.js SIZE_CHARTS); tô đậm size mẫu đang có
  // Bảng size theo hãng (data/shop.js): mở sẵn bảng hợp với mẫu (code nữ → Nữ, GS/Kid → Trẻ em), tô size shop đang có
  var MEASURE_STEPS = "<li>Mang loại tất bạn thường mang khi đi đôi giày này.</li>" +
    "<li>Đứng thẳng trên mặt phẳng, gót chân chạm tường; nhờ người khác đo giúp nếu cần.</li>" +
    "<li>Đo từ điểm sau cùng của gót chân tới đầu ngón chân dài nhất (cm).</li>" +
    "<li>Đo cả hai chân, lấy số của bàn chân dài hơn.</li>" +
    "<li>Số đo nằm giữa hai cỡ: muốn ôm chân thì chọn nhỏ hơn một cỡ, muốn rộng rãi thì chọn lớn hơn một cỡ.</li>";
  var chartSeq = 0;
  function sizeVal(s) {
    var m = String(s).replace(",", ".").match(/^(\d+(?:\.\d+)?)(?:\s+(\d)\/(\d))?$/);
    return m ? +m[1] + (m[2] ? m[2] / m[3] : 0) : NaN;
  }
  function sizeChartHtml(p) {
    var chart = SIZE_CHARTS[p.brand];
    if (!chart || !chart.tables) {
      return '<p class="chart__none">Bảng size ' + esc(p.brand) + " shop đang cập nhật. Nhắn Facebook số cm chân và đôi bạn đang đi vừa nhất, shop tư vấn size cho mẫu này.</p>";
    }
    var own = (p.sizes || []).map(function (s) { return sizeVal(s.s); }).filter(isFinite);
    // Bảng mở sẵn: ưu tiên bảng hợp giới tính (code nữ → Nữ, GS/Kid → Trẻ em) nhưng phải chứa size shop đang có
    var want = p.gender === "nu" ? "women" : p.gender === "gs" || p.gender === "kid" ? "kids" : "";
    function hits(tb) { return tb.rows.some(function (r) { var eu = sizeVal(r[0]); return own.some(function (x) { return Math.abs(x - eu) < 0.2; }); }); }
    var order = chart.tables.map(function (tb, i) { return i; }).sort(function (a, b) { return (want && chart.tables[b][want] ? 1 : 0) - (want && chart.tables[a][want] ? 1 : 0) || a - b; });
    var pick = order.filter(function (i) { return hits(chart.tables[i]); })[0];
    if (pick === undefined) pick = order[0];
    var id = "chart" + (++chartSeq);
    var tabs = chart.tables.length > 1 ? '<div class="chart__tabs" role="tablist" aria-label="Chọn bảng size">' + chart.tables.map(function (tb, i) {
      return '<button type="button" role="tab" id="' + id + "-t" + i + '" aria-controls="' + id + "-p" + i + '" aria-selected="' + (i === pick) + '" data-chart-tab="' + i + '">' + esc(tb.name) + "</button>";
    }).join("") + "</div>" : "";
    var panels = chart.tables.map(function (tb, i) {
      return '<div class="table-wrap chart__table" id="' + id + "-p" + i + '" data-chart-panel="' + i + '"' + (chart.tables.length > 1 ? ' role="tabpanel" aria-labelledby="' + id + "-t" + i + '"' : "") + (i === pick ? "" : " hidden") + ">" +
        "<table><thead><tr>" + tb.cols.map(function (c) { return '<th scope="col">' + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        tb.rows.map(function (r) {
          var eu = sizeVal(r[0]);
          var has = isFinite(eu) && own.some(function (x) { return Math.abs(x - eu) < 0.2; });
          return "<tr" + (has ? ' class="is-own"' : "") + ">" + r.map(function (c, j) {
            return "<td>" + esc(c) + (j === 0 && has ? ' <span class="chart__tag">còn</span>' : "") + "</td>";
          }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>";
    }).join("");
    return '<div class="chart__body" data-chart>' + tabs + panels +
      '<p class="chart__note">Theo bảng size chính thức của ' + esc(p.brand === "Jordan" ? "Nike / Jordan" : p.brand) + " (" + esc(chart.source) + "), để tham khảo. " +
      "Mỗi dòng giày có form khác nhau — shop xác nhận lại size theo số cm chân của bạn.</p></div>";
  }
  document.addEventListener("click", function (e) {
    var tab = e.target.closest("[data-chart-tab]");
    if (!tab) return;
    var box = tab.closest("[data-chart]"), i = tab.dataset.chartTab;
    $all("[data-chart-tab]", box).forEach(function (b) { b.setAttribute("aria-selected", b.dataset.chartTab === i); });
    $all("[data-chart-panel]", box).forEach(function (pn) { pn.hidden = pn.dataset.chartPanel !== i; });
  });
  function sizeGuideModal(p) {
    var fit = fitNote(p);
    modal(
      "<h3>Hướng dẫn chọn size</h3>" +
      (fit ? '<div class="fit">' + I.info + "<div><b>Form " + esc(fit.line) + ":</b> " + esc(fit.advice) + "</div></div>" : "") +
      '<p style="margin:0 0 8px"><b>Cách đo chiều dài bàn chân</b></p><ol style="margin:0 0 14px;padding-left:20px;color:var(--ink-2);font-size:14.5px">' + MEASURE_STEPS + "</ol>" +
      '<p style="margin:0 0 8px"><b>Bảng size ' + esc(p.brand) + "</b></p>" + sizeChartHtml(p) +
      '<p class="muted" style="font-size:14px;margin:12px 0 0">Còn phân vân giữa hai size: nhắn shop số cm chân kèm tên đôi giày đang đi vừa nhất.</p>' +
      '<div class="modal__actions"><a class="btn btn--ghost" href="size-guide.html">Xem đầy đủ</a>' + fbLink("Hỏi size qua Facebook", "", " data-fb-copy") + "</div>",
      "modal__box--wide"
    );
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
    if (meta) meta.content = name + " chính hãng tại " + SHOP.name + ". " + (p.inStock ? "Size còn: " + p.sizes.map(function (s) { return s.s; }).join(", ") + ". " : "") + "Tư vấn size theo form, đổi size " + SHOP.returnDays + " ngày.";
    var fit = fitNote(p);
    var selected = p.sizes.length === 1 ? p.sizes[0].s : null;
    fbContext = function (size) { return consultMsg(p, size || selected); }; // nút Facebook: chép sẵn mẫu + size đang chọn
    track("view_item", { id: p.id, code: p.code, brand: p.brand, price: p.minPrice * 1000 });
    var sizeText = p.sizes.map(function (s) { return s.s; }).join(", ");
    var hasLines = (LINES[p.brand] || []).length > 0;
    var pageUrl = absUrl(productUrl(p)), linkUrl = shareUrl(p);
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

    // Dải size theo hãng: size đang có đậm, size đã hết làm mờ (bấm để nhắn shop tư vấn)
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
      : pill("out", "Tạm hết size");
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
      '<div class="pd__pills">' + status + genderPill + "</div>" +
      '<div class="pd__price" data-price>' + money(p.minPrice) + "</div>" +
      (p.note ? '<div class="pd__note"><b>Ghi chú của shop:</b> ' + esc(p.note) + "</div>" : "") +
      (p.inStock
        ? '<div class="pd__sizehead" id="chon-size"><span>Chọn size (EU): <b data-size-label>' + esc(selected || "chưa chọn") + '</b></span><button type="button" class="pd__guide" data-guide>' + I.ruler + "Hướng dẫn chọn size</button></div>" +
          '<div class="sizes" data-sizes role="group" aria-label="Chọn size">' +
          range.map(function (s) {
            var own = p.sizes.filter(function (x) { return x.s === s; })[0];
            if (!own) return '<button type="button" class="is-off" data-off="' + esc(s) + '" aria-label="Size ' + esc(s) + ' đã hết">' + esc(s) + "</button>";
            var extra = own.p && own.p !== p.price ? money(own.p).replace(".000₫", "k") : own.n ? "Lưu ý" : "";
            return '<button type="button" data-size="' + esc(s) + '" aria-pressed="false" title="' + esc(own.n || "") + '">' + esc(s) + (extra ? "<small>" + esc(extra) + "</small>" : "") + "</button>";
          }).join("") + "</div>" +
          '<p class="pd__hint" data-size-note>' + (range.length > p.sizes.length ? "Size mờ đã hết tại shop — cần size khác, nhắn Facebook để shop tư vấn." : "Chỉ hiện size đang còn tại shop.") + "</p>" +
          // Tư vấn form và bảng size: đặt TRƯỚC nút mua
          '<div class="fitbox">' +
          (fit ? '<div class="fit">' + I.info + "<div><b>Lưu ý form " + esc(fit.line) + ":</b> " + esc(fit.advice) + "</div></div>" : "") +
          '<details class="chart"><summary>' + I.ruler + "Bảng size " + esc(p.brand) + I.down.replace("<svg", '<svg class="chev"') + "</summary>" + sizeChartHtml(p) + "</details></div>" +
          '<div class="pd__buy" data-buy-block><button type="button" class="btn btn--grad" data-add>' + I.bagPlus + "Thêm vào giỏ</button>" +
          fbLink("Tư vấn qua Facebook", "", " data-fb-copy") + "</div>" +
          (WISH ? '<div class="pd__buy2">' + wishBtn(p) + "</div>" : "") +
          '<p class="pd__fbnote">Bấm <b>Tư vấn qua Facebook</b>: thông tin mẫu và size bạn chọn được chép sẵn, mở Facebook shop rồi dán vào tin nhắn.</p>'
        : '<div class="pd__out"><b>Tạm hết size</b><p>Mẫu này vừa hết size tại shop. Nhắn Facebook để shop tư vấn mẫu tương tự đang có sẵn.</p></div>' +
          (fit ? '<div class="fit">' + I.info + "<div><b>Lưu ý form " + esc(fit.line) + ":</b> " + esc(fit.advice) + "</div></div>" : "") +
          '<div class="pd__buy2" data-buy-block>' + fbLink("Nhắn Facebook cho shop", "btn--grad", " data-fb-copy") + wishBtn(p) + "</div>") +
      '<p class="pd__call">Shop xác nhận size, phí ship và tiền cọc qua Facebook. Website không thu tiền.</p>' +
      '<div class="acc">' +
      "<details open><summary>" + I.shield + "Cam kết của S&amp;LIFE" + I.down.replace("<svg", '<svg class="chev"') + '</summary><div class="acc__body"><ul>' +
      (SHOP.perks || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></details>" +
      "<details><summary>" + I.truck + "Giao hàng &amp; đặt cọc" + I.down.replace("<svg", '<svg class="chev"') + '</summary><div class="acc__body"><ul>' +
      "<li>Giao qua SPX Express hoặc Viettel Post. Phí ship do đơn vị vận chuyển tính, shop báo khi xác nhận đơn.</li>" +
      "<li>Hà Nội và TP.HCM có thể giao trong ngày.</li>" +
      "<li>Sau khi xác nhận còn size, shop gửi số tài khoản và mức cọc qua Facebook.</li>" +
      "<li>Đồng kiểm tuỳ đơn vị vận chuyển — shop xác nhận riêng khi chốt đơn.</li>" +
      '</ul><p style="margin:8px 0 0"><a class="link" href="policy.html#ship">Chi tiết giao hàng</a></p></div></details>' +
      "<details><summary>" + I.swap + "Đổi size &amp; đổi trả" + I.down.replace("<svg", '<svg class="chev"') + '</summary><div class="acc__body"><ul>' +
      "<li>Đổi size trong " + SHOP.returnDays + " ngày kể từ khi nhận hàng: giày còn nguyên hộp, tem, chưa đi ngoài trời.</li>" +
      "<li>Đổi theo nhu cầu: bạn chịu phí ship hai chiều.</li>" +
      "<li>Giao sai mẫu, sai size hoặc hàng lỗi đã được xác nhận: shop đổi lại hoặc hoàn tiền và chịu phí ship.</li>" +
      '</ul><p style="margin:8px 0 0"><a class="link" href="policy.html#doi-tra">Xem đầy đủ chính sách</a></p></div></details>' +
      "</div>" +
      '<div class="share"><span>Chia sẻ</span>' +
      '<a href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(linkUrl) + '" target="_blank" rel="noopener">' + I.fb + "Facebook</a>" +
      '<button type="button" data-copy-link>' + I.link + "Sao chép link</button>" +
      (navigator.share ? '<button type="button" data-native-share>' + I.share + "Chia sẻ…</button>" : "") + "</div>" +
      "</div></div>" +

      '<section class="pd-sec"><div class="pd-desc"><div><h2>Mô tả sản phẩm</h2><div class="pd-desc__text">' +
      "<p><b>" + esc(name) + "</b> là hàng chính hãng" + (p.inStock ? " đang có sẵn" : "") + " tại " + esc(SHOP.name) + "." +
      (p.code ? " Mã sản phẩm <b>" + esc(p.code) + "</b> khớp với tem hộp — bạn tra mã này trên trang chủ của " + esc(p.brand) + " sẽ ra đúng mẫu, đúng màu." : "") + "</p>" +
      (p.inStock ? "<p>Size còn tại shop: <b>" + esc(sizeText) + "</b>. Tồn kho thay đổi trong ngày; shop xác nhận lại size khi bạn gửi yêu cầu.</p>" : "<p>Mẫu này tạm hết size tại shop. Nhắn Facebook để shop tư vấn mẫu tương tự đang có sẵn.</p>") +
      (fit ? "<p>Về form: " + esc(fit.advice) + " Còn phân vân, nhắn shop số cm chân kèm tên đôi giày đang đi vừa nhất để được tư vấn.</p>" : "") +
      "<p><b>Bảo quản:</b> tránh ngâm nước, không giặt máy, không dùng chất tẩy mạnh, không phơi trực tiếp dưới nắng gắt.</p>" +
      "<p>Shop gửi ảnh chụp thật đôi giày trước khi giao.</p>" +
      "</div>" +
      '<div class="about-shop"><img src="images/brand/icon-192.png" alt="" width="64" height="64" loading="lazy"><div><b>Về ' + esc(SHOP.name) + "</b>" +
      "<p>Giày chính hãng, hàng sẵn, bán online từ 2021. Shop tư vấn size theo form từng dòng và nói rõ nguồn hàng, tình trạng từng đôi trước khi chốt.</p>" +
      '<div class="about-shop__links">' +
      '<a href="' + esc(SHOP.facebookChat) + '" target="_blank" rel="noopener" aria-label="Facebook" data-fb>' + I.fbc + "</a>" +
      (SHOP.facebookOwner && SHOP.facebookOwner !== SHOP.facebookChat ? '<a href="' + esc(SHOP.facebookOwner) + '" target="_blank" rel="noopener" aria-label="Facebook">' + I.fb + "</a>" : "") +
      (SHOP.instagram ? '<a href="' + esc(SHOP.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram">' + I.ig + "</a>" : "") +
      (SHOP.tiktok ? '<a href="' + esc(SHOP.tiktok) + '" target="_blank" rel="noopener" aria-label="TikTok">' + I.tt + "</a>" : "") +
      "</div></div></div></div>" +
      '<div><h2>Thông tin sản phẩm</h2><table class="spec"><tbody>' +
      "<tr><th>Thương hiệu</th><td>" + esc(p.brand) + "</td></tr>" +
      (hasLines ? "<tr><th>Dòng giày</th><td>" + esc(p.line) + "</td></tr>" : "") +
      (p.code ? "<tr><th>Mã sản phẩm</th><td>" + esc(p.code) + "</td></tr>" : "") +
      "<tr><th>Dành cho</th><td>" + (p.gender === "unisex" ? "Unisex / size nam" : "Code " + GENDER_LABEL[p.gender]) + "</td></tr>" +
      "<tr><th>Size còn</th><td>" + (p.inStock ? esc(sizeText) : "Tạm hết size") + "</td></tr>" +
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
      mainBox.insertAdjacentHTML("beforeend", '<a class="btn btn--fb btn--sm gallery__ph-cta" href="' + esc(SHOP.facebookChat) + '" target="_blank" rel="noopener" data-fb data-fb-copy>' + I.camera + "Nhắn Facebook xin ảnh thật</a>");
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
    function add() {
      if (!selected) { needSize(); return false; }
      addToCart(p.id, selected, 1);
      track("add_to_cart", { id: p.id, code: p.code, size: selected, price: itemPrice(p, selected) * 1000 });
      return true;
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-size]");
      if (b) { selected = b.dataset.size; markSize(); }
      var off = e.target.closest("[data-off]");
      if (off && noteEl) { noteEl.innerHTML = "Size " + esc(off.dataset.off) + ' đã hết tại shop. <a class="link" href="' + esc(SHOP.facebookChat) + '" target="_blank" rel="noopener" data-fb data-fb-copy data-fb-size="' + esc(off.dataset.off) + '">Nhắn Facebook để shop tư vấn</a>'; noteEl.classList.add("is-warn"); }
      if (e.target.closest("[data-guide]")) sizeGuideModal(p);
      if (e.target.closest("[data-copy-code]")) copyText(p.code).then(function () { toast("Đã sao chép mã " + p.code); });
      if (e.target.closest("[data-copy-link]")) copyText(linkUrl).then(function () { toast("Đã sao chép link sản phẩm"); });
      if (e.target.closest("[data-native-share]")) navigator.share({ title: name, url: linkUrl }).catch(function () {});
      if (e.target.closest("[data-add]")) { if (add()) openMini(p.id + "|" + selected); }
    });

    // Thanh mua dính đáy màn hình trên điện thoại
    var bar = document.createElement("div");
    bar.className = "buybar";
    bar.innerHTML = '<div class="buybar__info"><b data-bar-price></b><small data-bar-sub></small></div>' +
      (p.inStock ? '<button type="button" class="btn btn--grad" data-bar-add>' + I.bagPlus + "Thêm vào giỏ</button>" : fbLink("Nhắn shop", "btn--grad", " data-fb-copy"));
    document.body.appendChild(bar);
    function updateBar() {
      var s = p.sizes.filter(function (x) { return x.s === selected; })[0];
      $("[data-bar-price]", bar).textContent = money((s && s.p) || p.minPrice);
      $("[data-bar-sub]", bar).textContent = p.inStock ? (selected ? "Size " + selected + " · " + p.name : "Chưa chọn size · " + p.name) : p.name;
    }
    bar.addEventListener("click", function (e) {
      if (e.target.closest("[data-bar-add]")) { if (add()) openMini(p.id + "|" + selected); }
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
      $("[data-cart-heading]").textContent = "Giỏ hàng (" + cart.length + ")";
      if (!cart.length) {
        listEl.innerHTML = '<div class="empty"><h2>Giỏ hàng đang trống</h2><p class="muted">Chọn mẫu và size ưng ý, rồi quay lại đây để gửi yêu cầu cho shop.</p><div class="empty__actions"><a class="btn btn--grad" href="shop.html">Xem hàng sẵn</a></div></div>';
        sumEl.hidden = true;
      } else {
        sumEl.hidden = false;
        listEl.innerHTML = cart.map(function (it, i) {
          var p = BY_ID[it.id], price = itemPrice(p, it.size);
          var still = p.sizes.some(function (s) { return s.s === it.size; });
          return '<div class="cart-item">' +
            '<a class="cart-item__img" href="' + productUrl(p) + '">' + media(p) + "</a>" +
            '<div><a class="cart-item__name" href="' + productUrl(p) + '">' + esc(fullName(p)) + "</a>" +
            '<div class="cart-item__meta">Size ' + esc(it.size) + "</div>" +
            (still ? '<div class="cart-item__price">' + money(price) + "</div>" : '<div class="cart-item__warn">Size này vừa hết trong bảng hàng — bỏ khỏi giỏ hoặc nhắn shop tư vấn.</div>') +
            "</div>" +
            '<button class="cart-item__x" data-remove="' + i + '" aria-label="Xoá ' + esc(p.name) + ' size ' + esc(it.size) + ' khỏi giỏ">' + I.close + "</button></div>";
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
      var b = e.target.closest("[data-remove]");
      if (!b) return;
      var cart = getCart();
      cart.splice(+b.dataset.remove, 1);
      setCart(cart);
      render();
    });
    render();
  }

  /* ---------- Gửi yêu cầu cho shop (thay cho đặt hàng / thanh toán) ----------
     Không có máy chủ, không thu tiền. Web soạn sẵn tin nhắn → khách sao chép và gửi qua Facebook.
     Giỏ KHÔNG tự xoá: chỉ xoá khi khách bấm "Tôi đã gửi cho shop". */
  function reqCode() {
    var d = new Date();
    return "SL" + String(d.getFullYear()).slice(2) + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "-" +
      (Math.random().toString(36) + "0000").slice(2, 6).toUpperCase();
  }
  function b64encode(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj)), s = "";
    bytes.forEach(function (b) { s += String.fromCharCode(b); });
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64decode(str) {
    var s = atob(str.replace(/-/g, "+").replace(/_/g, "/"));
    var bytes = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  // Link tóm tắt yêu cầu: dữ liệu nằm trong đường link, không cần máy chủ. Không phải trạng thái đơn.
  function requestLink(req) {
    return absUrl("yeu-cau.html?r=" + b64encode({ c: req.code, i: req.items.map(function (it) { return [it.id, it.size]; }), n: req.name || undefined, p: req.province || undefined, f: req.foot || undefined, t: req.note || undefined }));
  }
  // Ghi sổ yêu cầu vào Google Sheet của shop (nếu đã cài orderEndpoint). Dùng JSONP để biết chắc đã ghi hay chưa.
  function sendToSheet(payload) {
    return new Promise(function (resolve, reject) {
      if (!SHOP.orderEndpoint) return reject(new Error("no-endpoint"));
      var cb = "slifeCb" + Date.now(), s = document.createElement("script"), done = false;
      var timer = setTimeout(function () { finish(new Error("timeout")); }, 10000);
      function finish(err, res) {
        if (done) return;
        done = true; clearTimeout(timer);
        try { delete window[cb]; } catch (e) { window[cb] = undefined; }
        s.remove();
        if (err) reject(err); else resolve(res);
      }
      window[cb] = function (res) { finish(res && res.ok ? null : new Error((res && res.error) || "sheet"), res); };
      s.onerror = function () { finish(new Error("network")); };
      s.src = SHOP.orderEndpoint + (SHOP.orderEndpoint.indexOf("?") < 0 ? "?" : "&") + "callback=" + cb + "&data=" + encodeURIComponent(JSON.stringify(payload));
      document.head.appendChild(s);
    });
  }
  function initCheckout() {
    var root = $("[data-checkout]");
    var cart = getCart();
    if (!cart.length) {
      root.innerHTML = '<div class="empty" style="margin:30px 0;grid-column:1/-1"><h2>Giỏ hàng đang trống</h2><p class="muted">Chọn mẫu và size trước, rồi quay lại gửi yêu cầu cho shop.</p><div class="empty__actions"><a class="btn btn--grad" href="shop.html">Xem hàng sẵn</a>' + fbLink("Nhắn Facebook cho shop", "btn--ghost") + "</div></div>";
      return;
    }
    var form = $("[data-req-form]"), msgEl = $("[data-req-msg]"), linkEl = $("[data-req-link]"), statusEl = $("[data-req-status]");
    var saved = storage("slife_customer") || {};
    ["name", "province", "foot"].forEach(function (k) { if (saved[k] && form[k]) form[k].value = saved[k]; });
    form.note.value = storage("slife_note") || "";
    form.province.innerHTML = '<option value="">Chọn tỉnh / thành (không bắt buộc)</option>' + PROVINCES.map(function (x) { return "<option>" + x + "</option>"; }).join("");
    if (saved.province) form.province.value = saved.province;

    // Mã yêu cầu giữ nguyên khi giỏ không đổi — bấm nhiều lần không tạo yêu cầu trùng
    var sig = cart.map(function (it) { return it.id + "|" + it.size; }).join(",");
    var pending = storage("slife_req") || {};
    if (pending.sig !== sig) pending = { sig: sig, code: reqCode(), logged: false };
    storage("slife_req", pending);

    function current() {
      return {
        code: pending.code, items: cart,
        name: form.name.value.trim(), province: form.province.value, foot: form.foot.value.trim().replace(/\s*cm$/i, ""), note: form.note.value.trim(),
      };
    }
    function message(req) {
      var lines = req.items.map(function (it, i) {
        var p = BY_ID[it.id];
        return (i + 1) + ") " + p.name + "\n   Mã: " + (p.code || "—") + " · Size: " + it.size + " · " + money(itemPrice(p, it.size)) + "\n   " + shareUrl(p);
      });
      return "Chào shop, mình muốn mua (yêu cầu " + req.code + "):\n" + lines.join("\n") +
        "\nTạm tính: " + money(cartTotal(req.items)) +
        (req.foot ? "\nChân dài: " + req.foot + " cm" : "") +
        (req.name ? "\nTên: " + req.name : "") +
        (req.province ? "\nNhận hàng tại: " + req.province : "") +
        (req.note ? "\nGhi chú: " + req.note : "") +
        "\nNhờ shop xác nhận size, phí ship và tiền cọc giúp mình." +
        "\nXem tóm tắt: " + requestLink(req);
    }
    function refresh() {
      var req = current();
      msgEl.textContent = message(req);
      linkEl.href = requestLink(req);
      storage("slife_customer", { name: req.name, province: req.province, foot: req.foot });
      storage("slife_note", req.note);
    }
    function status(text, kind) { statusEl.hidden = !text; statusEl.className = "req__status" + (kind ? " is-" + kind : ""); statusEl.textContent = text || ""; }
    // Ghi sổ một lần cho mỗi mã yêu cầu (chống trùng ở cả web và Apps Script)
    function logOnce() {
      if (!SHOP.orderEndpoint || pending.logged) return;
      var req = current();
      status("Đang ghi yêu cầu " + req.code + " vào sổ của shop…");
      sendToSheet({
        code: req.code, time: new Date().toISOString(), name: req.name, province: req.province, foot: req.foot, note: req.note,
        total: cartTotal(req.items) * 1000, link: requestLink(req),
        items: req.items.map(function (it) { var p = BY_ID[it.id]; return { code: p.code || p.id, name: p.name, size: it.size, price: (itemPrice(p, it.size) || 0) * 1000 }; }),
      }).then(function () {
        pending.logged = true; storage("slife_req", pending);
        status("Đã ghi yêu cầu " + req.code + " vào sổ của shop. Đây chưa phải đơn đã xác nhận — shop xác nhận trong tin nhắn Facebook.", "ok");
      }, function () {
        status("Chưa ghi được vào sổ yêu cầu (mạng chậm hoặc lỗi). Không sao: bạn vẫn gửi tin nhắn qua Facebook bình thường, giỏ hàng vẫn được giữ.", "warn");
      });
    }

    $("[data-summary]").innerHTML = "<h2>Mẫu bạn chọn</h2>" +
      cart.map(function (it) {
        var p = BY_ID[it.id];
        return '<div class="co-item"><div class="co-item__img">' + media(p) + "</div><div>" + esc(fullName(p)) +
          '<br><small class="muted">Size ' + esc(it.size) + "</small></div><b>" + money(itemPrice(p, it.size)) + "</b></div>";
      }).join("") +
      '<div class="summary__row summary__total"><span>Tạm tính</span><span>' + money(cartTotal(cart)) + "</span></div>" +
      '<p class="muted" style="font-size:13.5px;margin:8px 0 0">Phí ship và tiền cọc: shop báo qua Facebook sau khi xác nhận size. Mua thêm đôi hoặc thêm size, bạn trao đổi trong tin nhắn.</p>' +
      '<a class="link" href="cart.html" style="display:inline-block;margin-top:10px">Sửa giỏ hàng</a>';

    form.addEventListener("input", refresh);
    form.addEventListener("change", refresh);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    $("[data-req-copy]").addEventListener("click", function () {
      refresh();
      copyText(msgEl.textContent).then(function () { toast("Đã sao chép — mở Facebook shop rồi dán vào tin nhắn"); });
      $("[data-req-copy]").classList.add("is-done");
      track("copy_message", { source: "gui_yeu_cau", code: pending.code, items: cart.length });
      logOnce();
    });
    $("[data-req-open]").href = SHOP.facebookChat;
    $("[data-req-open]").insertAdjacentHTML("afterbegin", I.fbc);
    $("[data-req-open]").addEventListener("click", function () {
      refresh();
      fbPending = msgEl.textContent;
      copyText(fbPending);
      toast("Đã chép tin nhắn — dán vào khung chat Facebook của shop");
      logOnce();
    });
    $("[data-req-sent]").addEventListener("click", function () {
      if (!confirm("Bạn đã dán và gửi tin nhắn cho shop trên Facebook chưa? Bấm OK để xoá giỏ hàng.")) return;
      var link = linkEl.href, code = pending.code;
      track("request_sent", { code: code, items: cart.length });
      setCart([]); storage("slife_note", ""); storage("slife_req", null);
      root.innerHTML = '<div class="req-done"><h2>Cảm ơn bạn</h2><p>Shop sẽ trả lời trong tin nhắn Facebook để xác nhận size, phí ship và tiền cọc cho yêu cầu <b>' + esc(code) + "</b>.</p>" +
        '<p class="muted">Đây là yêu cầu mua, chưa phải đơn đã xác nhận. Lưu link tóm tắt nếu cần xem lại: <a class="link" href="' + esc(link) + '">xem tóm tắt yêu cầu</a>.</p>' +
        '<div class="empty__actions">' + fbLink("Mở lại Facebook") + '<a class="btn btn--ghost" href="shop.html">Xem thêm giày</a></div></div>';
    });
    if (navigator.onLine === false) status("Thiết bị đang mất mạng. Giỏ hàng vẫn được giữ — khi có mạng, bấm Mở Facebook để gửi.", "warn");
    window.addEventListener("offline", function () { status("Mất kết nối mạng. Giỏ hàng vẫn được giữ — khi có mạng, bấm Mở Facebook để gửi.", "warn"); });
    refresh();
    track("begin_request", { items: cart.length, total: cartTotal(cart) * 1000 });
  }

  /* ---------- Trang tóm tắt yêu cầu (link riêng gửi kèm tin nhắn) ---------- */
  function initRequest() {
    var root = $("[data-request]"), data = null;
    try { data = b64decode(params().get("r") || ""); } catch (e) { data = null; }
    var items = data && Array.isArray(data.i) ? data.i.map(function (x) { return { p: findProduct(x[0]), size: String(x[1] || "") }; }).filter(function (x) { return x.p; }) : [];
    if (!items.length) {
      root.innerHTML = '<div class="empty" style="margin:30px 0"><h2>Không đọc được yêu cầu</h2><p class="muted">Link có thể bị cắt ngắn khi sao chép. Nhắn Facebook cho shop để được hỗ trợ.</p><div class="empty__actions">' + fbLink("Nhắn Facebook cho shop") + '<a class="btn btn--ghost" href="shop.html">Xem hàng sẵn</a></div></div>';
      return;
    }
    root.innerHTML = '<div class="req-view"><p class="req-view__note">' + I.info + "Đây là tóm tắt yêu cầu mua, <b>không phải trạng thái đơn</b>. Shop xác nhận size, phí ship và tiền cọc trong tin nhắn Facebook.</p>" +
      "<h1>Yêu cầu " + esc(data.c || "") + "</h1>" +
      items.map(function (x) {
        var p = x.p, still = p.sizes.some(function (s) { return s.s === x.size; });
        return '<div class="cart-item"><a class="cart-item__img" href="' + productUrl(p) + '">' + media(p) + "</a>" +
          '<div><a class="cart-item__name" href="' + productUrl(p) + '">' + esc(fullName(p)) + "</a>" +
          '<div class="cart-item__meta">Size ' + esc(x.size) + (still ? " · " + money(itemPrice(p, x.size)) + " (giá trên web lúc xem)" : "") + "</div>" +
          (still ? "" : '<div class="cart-item__warn">Size này hiện không còn trên web — shop sẽ tư vấn lựa chọn khác.</div>') + "</div></div>";
      }).join("") +
      '<dl class="req-view__info">' +
      (data.n ? "<dt>Tên</dt><dd>" + esc(data.n) + "</dd>" : "") +
      (data.p ? "<dt>Nhận hàng tại</dt><dd>" + esc(data.p) + "</dd>" : "") +
      (data.f ? "<dt>Chân dài</dt><dd>" + esc(data.f) + " cm</dd>" : "") +
      (data.t ? "<dt>Ghi chú</dt><dd>" + esc(data.t) + "</dd>" : "") + "</dl>" +
      '<div class="empty__actions" style="justify-content:flex-start">' + fbLink("Nhắn Facebook cho shop") + '<button type="button" class="btn btn--ghost" data-req-restore>Thêm các mẫu này vào giỏ</button></div></div>';
    $("[data-req-restore]", root).addEventListener("click", function () {
      items.forEach(function (x) { if (x.p.sizes.some(function (s) { return s.s === x.size; })) addToCart(x.p.id, x.size, 1); });
      openMini();
    });
  }

  /* ---------- Trang hướng dẫn size: lưu ý form + bảng size từ data/shop.js ---------- */
  function initGuide() {
    var steps = $("[data-measure-steps]");
    if (steps) steps.innerHTML = MEASURE_STEPS;
    var rows = $("[data-fit-rows]");
    if (rows) rows.innerHTML = FIT_NOTES.map(function (f) { return "<tr><td>" + esc(f.line) + "</td><td>" + esc(f.advice) + "</td></tr>"; }).join("");
    var box = $("[data-size-charts]");
    if (box) box.innerHTML = Object.keys(SIZE_CHARTS).filter(function (b) { return b !== "Jordan"; }).map(function (b) {
      return '<details class="chart"' + '><summary>' + I.ruler + "Bảng size " + esc(b) + (b === "Nike" ? " / Jordan" : "") + I.down.replace("<svg", '<svg class="chev"') + "</summary>" +
        sizeChartHtml({ brand: b, sizes: [] }) + "</details>";
    }).join("") || '<p class="muted">Shop đang cập nhật bảng size theo hãng.</p>';
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

  // Dùng chung cho công cụ ảnh nội bộ (assets/js/anh.js, chỉ tải ở anh.html)
  window.SLIFE = { "$": $, "$all": $all, BY_ID: BY_ID, IMG_EXT: IMG_EXT, MAX_SHOTS: MAX_SHOTS, PRODUCTS: PRODUCTS, copyText: copyText, esc: esc, findImage: findImage, fullName: fullName, imgBase: imgBase, media: media, norm: norm, productUrl: productUrl, shotsOf: shotsOf, toast: toast };

  /* ---------- Khởi động ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    loadAnalytics();
    renderChrome();
    fillShopInfo();
    var page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "shop") initShop();
    if (page === "product") initProduct();
    if (page === "cart") initCart();
    if (page === "checkout") initCheckout();
    if (page === "request") initRequest();
    if (page === "guide") initGuide();
  });
})();
