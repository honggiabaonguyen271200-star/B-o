// Công cụ nội bộ anh.html: kiểm tra mẫu nào đã có ảnh, kéo thả ảnh để lưu đúng tên vào images/products.
// Tách khỏi app.js để các trang của khách không phải tải phần này. Dùng hàm chung từ app.js (window.SLIFE).
(function () {
  "use strict";
  var S = window.SLIFE;
  var $ = S["$"];
  var $all = S["$all"];
  var BY_ID = S["BY_ID"];
  var IMG_EXT = S["IMG_EXT"];
  var MAX_SHOTS = S["MAX_SHOTS"];
  var PRODUCTS = S["PRODUCTS"];
  var copyText = S["copyText"];
  var esc = S["esc"];
  var findImage = S["findImage"];
  var fullName = S["fullName"];
  var imgBase = S["imgBase"];
  var media = S["media"];
  var norm = S["norm"];
  var productUrl = S["productUrl"];
  var shotsOf = S["shotsOf"];
  var toast = S["toast"];

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
      // Có danh sách ảnh (danh-sach.js, tự cập nhật khi mở xem-web.bat) thì tin danh sách, không dò từng file (không lỗi 404)
      (shotsOf(p) ? Promise.resolve(shotsOf(p)[0]) : window.PRODUCT_IMAGES ? Promise.resolve(null) : findImage(imgBase(p))).then(function (u) {
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

  document.addEventListener("DOMContentLoaded", initImages);
})();
