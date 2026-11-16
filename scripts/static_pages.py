#!/usr/bin/env python3
"""Sinh các file tĩnh đi kèm website từ data/products.js (không cần file .xlsx):

- ảnh bìa images/products/<MÃ>.webp  chuẩn hoá cho đồng đều (scripts/chuan_hoa_anh.py: vuông, nền trắng, giày cùng cỡ)
- images/products/danh-sach.js  danh sách ảnh sản phẩm (web chỉ hiện ảnh có trong danh sách, không dò tên file → không lỗi 404)
- images/anh-khac.js           danh sách banner (images/banners/) và ảnh khách (images/khach-hang/)
- sp/<mã>.html   trang của từng mẫu còn hàng, dựng từ product.html (17/11): nội dung có sẵn trong HTML (tên, mã, giá,
                 size còn, ảnh, dữ liệu Product) để Google và trình đọc link đọc được khi không chạy JavaScript; có og:title,
                 og:image, og:description để Facebook hiện ảnh + tên + giá khi dán link. app.js chạy trên trang này như
                 trên product.html (<base href="../">, <body data-q="id=…">). Sửa product.html / shop.html thì chạy lại file này
- sp/loc/<hãng>[--<dòng>].html  trang hãng / dòng giày dựng từ shop.html, có sẵn danh sách mẫu trong HTML
- sp/loc/…--size-<size>.html  trang chia sẻ cho link lọc theo size (VD: Giày Puma size 37,5): có tiêu đề, mô tả, ảnh
                 một mẫu trong bộ lọc, tự chuyển sang shop.html?brand=…&size=…. Nút "Chia sẻ" ở trang danh mục dùng link này
- sp/anh/<MÃ>.jpg ảnh xem trước (JPEG, Facebook đọc chắc chắn hơn WebP), lấy từ ảnh chính của mẫu
- 404.html       link sp/ của mẫu đã hết hàng vẫn mở được trang sản phẩm (GitHub Pages)
- sitemap.xml    chỉ trang chính + mẫu còn hàng, lastmod = ngày chạy
- robots.txt
- merchant-feed.xml  danh sách hàng sẵn cho Google Merchant Center (tab Mua sắm của Google, miễn phí)
- index.html     dòng tải trước ảnh giày ở banner đầu trang (giữa hai dòng đánh dấu hero-preload); khối link hãng / dòng
                 có sẵn trong HTML (giữa hai dòng đánh dấu noi-dung-tinh)

Tự chạy sau build_products.py, import_image_zip.py, extract_images.py và mỗi lần mở xem-web.bat. Chạy tay:
    python scripts/static_pages.py
Địa chỉ website lấy từ siteUrl trong data/shop.js — đổi tên miền thì chạy lại lệnh trên.
"""
import datetime
import html
import json
import re
from pathlib import Path
import sys
import unicodedata
from urllib.parse import quote

sys.path.insert(0, str(Path(__file__).resolve().parent))
import image_manifest  # noqa: E402
import chuan_hoa_anh  # noqa: E402

try:
    from PIL import Image
except ImportError:
    Image = None

ROOT = Path(__file__).resolve().parent.parent
SP_DIR = ROOT / "sp"
SP_IMG = SP_DIR / "anh"
LOC_DIR = SP_DIR / "loc"
IMG_DIR = ROOT / "images" / "products"
LOGO = "images/brand/slife-logo-square-1200.jpg"
MAIN_PAGES = ["", "shop.html", "size-guide.html", "policy.html", "gioi-thieu.html", "lien-he.html", "chinh-sach-bao-mat.html"]
PRELOAD_RE = re.compile(r"<!-- hero-preload -->.*?<!-- /hero-preload -->", re.S)
VERIFY_RE = re.compile(r"<!-- google-verify -->.*?<!-- /google-verify -->", re.S)


def read_js(path, var):
    """Đọc `window.VAR = [...]` / `{...}` trong file .js tự sinh."""
    if not path.exists():
        return None
    text = path.read_text(encoding="utf-8")
    m = re.search(r"window\." + var + r"\s*=\s*(.*);\s*$", text, re.S)
    return json.loads(m.group(1)) if m else None


def site_url():
    m = re.search(r'siteUrl:\s*"([^"]+)"', (ROOT / "data" / "shop.js").read_text(encoding="utf-8"))
    return m.group(1).rstrip("/") + "/" if m else None


def money(k):
    return "{:,}".format(int(k) * 1000).replace(",", ".") + "₫"


def size_key(s):
    try:
        return float(str(s).replace(",", ".").rstrip("yY")) - (0.01 if str(s)[-1:] in "yY" else 0)
    except ValueError:
        return 999


def share_image(code, shots):
    """Ảnh chính của mẫu -> sp/anh/<MÃ>.jpg (tối đa 1200px). Trả về (đường dẫn, rộng, cao) hoặc None."""
    if not shots:
        return None
    src = IMG_DIR / shots[0]
    if not src.exists():
        return None
    out = SP_IMG / (code + ".jpg")
    if Image is None:
        return None  # chưa cài Pillow (pip install pillow): dùng logo
    if not out.exists() or out.stat().st_mtime < src.stat().st_mtime:
        with Image.open(src) as im:
            im = im.convert("RGBA")
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, mask=im.split()[3])
            bg.thumbnail((1200, 1200))
            SP_IMG.mkdir(parents=True, exist_ok=True)
            bg.save(out, "JPEG", quality=82, optimize=True, progressive=True)
    with Image.open(out) as im:
        w, h = im.size
    return "sp/anh/" + out.name, w, h


GENDER_PILL = {"nam": "Code nam", "nu": "Code nữ", "gs": "GS", "kid": "Kid"}
NOSCRIPT = "<noscript><style>[data-static]{display:block !important}</style></noscript>"


def line_of(p, lines):
    """Dòng giày của mẫu — giống lineOf() trong app.js (None = "Các dòng khác")."""
    return next((n for n, rx in lines.get(p.get("brand"), []) if rx.search(p.get("name", ""))), None)


def prices_of(p):
    return [x for x in (s.get("p") or p.get("price") for s in p["sizes"]) if x]


def full_name(p):
    return ("" if p.get("cat") == "ao" else "Giày ") + p["name"] + (" " + p["code"] if p.get("code") else "")


def return_days():
    m = re.search(r"returnDays:\s*(\d+)", (ROOT / "data" / "shop.js").read_text(encoding="utf-8"))
    return m.group(1) if m else "3"


def sub1(pattern, repl, text, what):
    """Thay đúng một chỗ trong trang khuôn; khuôn đổi mà không còn chỗ đó thì báo ngay."""
    out, n = re.subn(pattern, lambda m: repl, text, count=1, flags=re.S)
    if n != 1:
        raise SystemExit("static_pages.py: không tìm thấy %s trong trang khuôn" % what)
    return out


def from_template(tpl, depth, title, desc, canonical, og, query, ld=None):
    """Trang tĩnh dựng từ product.html / shop.html: thêm <base> để dùng chung đường dẫn, thay tiêu đề và các thẻ og."""
    e = lambda s: html.escape(str(s), quote=True)  # noqa: E731
    text = tpl.replace("<!doctype html>\n", "<!doctype html>\n<!-- File tự sinh bởi scripts/static_pages.py — không sửa tay. -->\n", 1)
    text = sub1(r'<meta charset="utf-8">\n', '<meta charset="utf-8">\n<base href="%s">\n' % ("../" * depth), text, "meta charset")
    text = sub1(r"<title>.*?</title>", "<title>%s</title>" % e(title), text, "<title>")
    text = sub1(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % e(desc), text, "meta description")
    text = re.sub(r'<meta property="og:(?:title|description|image|type)" content="[^"]*">\n', "", text)
    text = CANON_RE.sub("", text)
    head = ['<link rel="canonical" href="%s">' % e(canonical)] + og + [NOSCRIPT]
    if ld:
        head.append('<script type="application/ld+json" data-ld="%s">%s</script>' % (e(ld["@type"]), json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")))
    text = sub1(r'<meta name="theme-color"', "\n".join(head) + '\n<meta name="theme-color"', text, "meta theme-color")
    text, n = re.subn(r'<body data-page="(\w+)">', lambda m: '<body data-page="%s" data-q="%s">' % (m.group(1), e(query)), text, count=1)
    if n != 1:
        raise SystemExit("static_pages.py: không tìm thấy <body data-page> trong trang khuôn")
    return text


def crumbs_html(trail):
    e = lambda s: html.escape(str(s), quote=True)  # noqa: E731
    return '<nav class="breadcrumb" aria-label="Breadcrumb">' + '<span aria-hidden="true">/</span>'.join(
        ('<a href="%s">%s</a>' % (e(u), e(n))) if u else '<b style="font-weight:500">%s</b>' % e(n) for n, u in trail) + "</nav>"


def share_page(p, base, img, tpl, lines, manifest, related, days):
    """sp/<mã>.html: trang mẫu có sẵn nội dung trong HTML; app.js dựng lại đầy đủ (chọn size, giỏ, ảnh) khi chạy."""
    e = lambda s: html.escape(str(s), quote=True)  # noqa: E731
    pid = quote(p["id"])
    url = base + "sp/" + pid + ".html"
    ao = p.get("cat") == "ao"
    prices = prices_of(p)
    if not prices:
        price = "Giá: liên hệ shop"
    elif min(prices) == max(prices):
        price = "Giá " + money(prices[0])
    else:
        price = "Giá từ " + money(min(prices))
    title = full_name(p)
    sizes = [size_text(s["s"]) for s in sorted(p["sizes"], key=lambda s: size_key(s["s"]))] if not ao else [s["s"] for s in p["sizes"]]
    og_desc = price + " · Hàng chính hãng, có sẵn tại S&LIFE Sneaker. Xem size còn và hỏi size qua Facebook."
    # Mô tả giống app.js (initProduct)
    desc = "%s chính hãng, có sẵn tại S&LIFE Sneaker. %sSize còn: %s. Tư vấn size theo form, đổi size %s ngày." % (
        title, (price.replace("Giá: liên hệ shop", "") + ". ") if prices else "", ", ".join(sizes), days)
    path, w, h = img
    alt = title if path != LOGO else "S&LIFE Sneaker"
    og = [
        '<meta property="og:type" content="product">',
        '<meta property="og:site_name" content="S&amp;LIFE Sneaker">',
        '<meta property="og:locale" content="vi_VN">',
        '<meta property="og:url" content="%s">' % e(url),
        '<meta property="og:title" content="%s">' % e(title),
        '<meta property="og:description" content="%s">' % e(og_desc),
        '<meta property="og:image" content="%s">' % e(base + path),
        '<meta property="og:image:type" content="image/jpeg">',
        '<meta property="og:image:width" content="%d">' % w,
        '<meta property="og:image:height" content="%d">' % h,
        '<meta property="og:image:alt" content="%s">' % e(alt),
    ]
    if prices:
        og += ['<meta property="product:price:amount" content="%d">' % (min(prices) * 1000),
               '<meta property="product:price:currency" content="VND">']
    og.append('<meta name="twitter:card" content="summary_large_image">')

    shots = ["images/products/" + f for f in (manifest.get(p.get("code") or p["id"]) or [])]
    ld = {"@context": "https://schema.org", "@type": "Product", "name": p["name"], "sku": p.get("code") or p["id"],
          "brand": {"@type": "Brand", "name": p.get("brand")}, "description": desc, "url": url}
    if p.get("code"):
        ld["mpn"] = p["code"]
    if shots:
        ld["image"] = [base + quote(s) for s in shots[:6]]
    if prices:
        avail = "https://schema.org/InStock"
        if max(prices) > min(prices):
            ld["offers"] = {"@type": "AggregateOffer", "priceCurrency": "VND", "lowPrice": min(prices) * 1000, "highPrice": max(prices) * 1000,
                            "offerCount": len(p["sizes"]), "availability": avail, "url": url}
        else:
            ld["offers"] = {"@type": "Offer", "priceCurrency": "VND", "price": prices[0] * 1000, "availability": avail,
                            "itemCondition": "https://schema.org/NewCondition", "url": url, "seller": {"@type": "Organization", "name": "S&LIFE Sneaker"}}

    brand = p.get("brand") or ""
    line = None if ao else line_of(p, lines)
    home = "shop.html?loai=quan-ao" if ao else "sp/loc/" + slug(brand) + ".html"
    trail = [("Trang chủ", "index.html"), ("Quần áo", home) if ao else (brand, home)]
    if line:
        trail.append((line, "sp/loc/" + loc_key(brand, line, None) + ".html"))
    trail.append((p["name"], ""))
    if shots:
        media = '<div class="media has-photo"><img class="media__img ok" src="%s" alt="%s" fetchpriority="high" decoding="async"></div>' % (e(quote(shots[0])), e(title))
    else:
        media = ('<div class="media"><div class="media__ph" aria-hidden="true"><img src="images/brand/slife-mark-gradient.svg" alt="" width="60" height="61">'
                 "<span>Ảnh đang cập nhật</span></div></div>")
    pills = '<span class="pill pill--ok">Có sẵn · %d size</span>' % len(p["sizes"])
    if GENDER_PILL.get(p.get("gender")):
        pills += '<span class="pill pill--g">%s</span>' % GENDER_PILL[p["gender"]]
    price_html = (("<small>Từ</small>" if max(prices) > min(prices) else "") + money(min(prices))) if prices else "Liên hệ"
    body = (
        '<div class="pd-top">' + crumbs_html(trail) + "</div>\n"
        '<div class="pd">\n<div class="gallery"><div class="gallery__main">' + media + "</div></div>\n"
        '<div class="pd__info">\n<div class="pd__brand"><a href="%s">%s</a>' % (e(home), e(brand))
        + ('<span class="pd__code">Mã %s</span>' % e(p["code"]) if p.get("code") else "") + "</div>\n"
        "<h1>%s</h1>\n" % e(p["name"])
        + '<div class="pd__pills">%s</div>\n' % pills
        + '<div class="pd__price">%s</div>\n' % price_html
        + ('<div class="pd__note"><b>Ghi chú của shop:</b> %s</div>\n' % e(p["note"]) if p.get("note") else "")
        + '<p class="pd__hint">Size%s đang còn: %s</p>\n' % ("" if ao else " (EU)", e(" · ".join(sizes)))
        + '<p class="pd__call">%s</p>\n' % e(desc)
        + "</div>\n</div>")
    text = from_template(tpl, 1, title + " chính hãng, có sẵn — S&LIFE Sneaker", desc, url, og, "id=" + pid, ld)
    text = sub1(r"<div data-product></div>", "<div data-product>\n" + body + "\n</div>", text, "data-product")
    if related:
        rel = ('<nav data-static aria-label="Mẫu liên quan"><h2>%s</h2><ul>' % e("Cùng dòng " + line_title(brand, line) if line else "Mẫu khác đang có sẵn")
               + "".join('<li><a href="sp/%s.html">%s</a></li>' % (e(quote(x["id"])), e(full_name(x))) for x in related) + "</ul></nav>")
        text = sub1(r"<div data-related></div>", "<div data-related>" + rel + "</div>", text, "data-related")
    return text


def page_404(base):
    home = html.escape(base, quote=True)
    return """<!doctype html>
<!-- File tự sinh bởi scripts/static_pages.py — không sửa tay. -->
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Không tìm thấy trang — S&amp;LIFE Sneaker</title>
<script>
  // Link chia sẻ sp/<mã>.html của mẫu đã bán hết: mở trang sản phẩm như bình thường
  var m = location.pathname.match(/^(.*\\/)sp\\/([^\\/]+?)(?:\\.html)?\\/?$/);
  if (m) location.replace(m[1] + "product.html?id=" + m[2]);
  // Link lọc sp/loc/<hãng>--<dòng>--size-<size>.html không còn (size đã hết): mở trang danh mục cùng bộ lọc
  var l = location.pathname.match(/^(.*\/)sp\/loc\/([^\/]+?)(?:\.html)?\/?$/);
  if (l) {
    var q = [], parts = l[2].split("--");
    if (/^size-/.test(parts[parts.length - 1])) q.push("size=" + parts.pop().slice(5).replace("-", "."));
    if (parts[0]) q.unshift("brand=" + parts[0] + (parts[1] ? "&line=" + parts[1] : ""));
    location.replace(l[1] + "shop.html" + (q.length ? "?" + q.join("&") : ""));
  }
</script>
<style>body{margin:64px 16px;font:16px/1.5 system-ui,sans-serif;color:#16122B;text-align:center}a{color:#004AAD}</style>
</head>
<body>
<h1>Không tìm thấy trang</h1>
<p>Trang này không còn hoặc link bị sai. <a href="%s">Về trang chủ S&amp;LIFE Sneaker</a></p>
</body>
</html>
""" % home


def write_site_images():
    """Banner và ảnh khách đang có -> images/anh-khac.js (web đọc danh sách này thay vì dò tên file)."""
    out = {}
    for key, folder in (("banners", "banners"), ("khach-hang", "khach-hang")):
        d = ROOT / "images" / folder
        out[key] = sorted(f.name for f in d.iterdir() if f.is_file() and re.search(r"\.(jpe?g|png|webp)$", f.name, re.I)) if d.exists() else []
    (ROOT / "images" / "anh-khac.js").write_text(
        "// File tự sinh bởi scripts/static_pages.py (chạy khi mở xem-web.bat) — không sửa tay.\n"
        "window.SITE_IMAGES = " + json.dumps(out, ensure_ascii=False) + ";\n", encoding="utf-8")
    return out


def hero_star(in_stock, manifest):
    """Giống app.js (initHome): mẫu có ảnh thật, nhiều size nhất, đứng trước trong bảng."""
    photos = [p for p in in_stock if manifest.get(p.get("code") or p["id"])]
    if not photos:
        return None
    photos.sort(key=lambda p: (-len(p["sizes"]), p.get("order", 0)))
    return manifest[photos[0].get("code") or photos[0]["id"]][0]


def write_preload(star):
    idx = ROOT / "index.html"
    text = idx.read_text(encoding="utf-8")
    if not PRELOAD_RE.search(text):
        return
    link = ('<link rel="preload" as="image" href="images/products/%s" fetchpriority="high">' % html.escape(star, quote=True)
            if star else "")
    new = PRELOAD_RE.sub(lambda _: "<!-- hero-preload -->" + link + "<!-- /hero-preload -->", text)
    if new != text:
        idx.write_text(new, encoding="utf-8")


def slug(s):
    """Giống slug() trong app.js: bỏ dấu, chữ thường, nối bằng gạch ngang."""
    s = unicodedata.normalize("NFD", str(s).lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn").replace("đ", "d")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def read_lines():
    """Dòng giày từng hãng (window.LINES trong data/shop.js): {hãng: [(tên dòng, regex), …]}."""
    text = (ROOT / "data" / "shop.js").read_text(encoding="utf-8")
    m = re.search(r"window\.LINES\s*=\s*\{(.*?)\n\};", text, re.S)
    out, brand = {}, None
    if not m:
        return out
    for t in re.finditer(r'^\s*"([^"]+)":\s*\[|\[\s*"([^"]+)"\s*,\s*/((?:\\/|[^/\n])+)/([a-z]*)\s*\]', m.group(1), re.M):
        if t.group(1):
            brand = t.group(1)
            out[brand] = []
        elif brand:
            try:
                out[brand].append((t.group(2), re.compile(t.group(3).replace("\\/", "/"), re.I if "i" in t.group(4) else 0)))
            except re.error:
                pass
    return out


def category_urls(in_stock):
    """Trang hãng và trang dòng giày đang có hàng (Google tìm "giày new balance 530 có sẵn" ra đúng trang)."""
    lines, urls, seen = read_lines(), [], set()
    for p in in_stock:
        b = p.get("brand")
        if not b or p.get("cat") == "ao":
            continue
        ln = line_of(p, lines)
        for u in ["sp/loc/" + loc_key(b, None, None) + ".html"] + (["sp/loc/" + loc_key(b, ln, None) + ".html"] if ln else []):
            if u not in seen:
                seen.add(u)
                urls.append(u)
    return urls


def size_text(s):
    return str(s).replace(".", ",")


def loc_key(brand, line, size):
    """Tên file trang chia sẻ link lọc — giống locKey() trong app.js."""
    parts = ([slug(brand)] if brand else []) + ([slug(line)] if brand and line else []) + (["size-" + slug(size)] if size else [])
    return "--".join(parts)


def line_title(brand, line):
    """Giống lineTitle() trong app.js."""
    if line.startswith("Giày "):
        return line + " " + brand
    return line if line.startswith(brand.split(" ")[0]) else brand + " " + line


def loc_static(items, b, ln, lines):
    """Nội dung có sẵn trong HTML của trang hãng / dòng: đường dẫn, tiêu đề, link các dòng, danh sách mẫu (ẩn khi app.js chạy)."""
    e = lambda s: html.escape(str(s), quote=True)  # noqa: E731
    trail = [("Trang chủ", "index.html"), ("Hàng sẵn", "shop.html"), ("Giày " + b, "sp/loc/" + loc_key(b, None, None) + ".html" if ln else "")]
    if ln:
        trail.append((ln, ""))
    names = []
    for _, l2 in items:
        if l2 and l2 not in names:
            names.append(l2)
    order = [n for n, _ in lines.get(b, [])]
    names.sort(key=lambda n: order.index(n) if n in order else 999)
    tiles = "".join('<a class="chip" href="sp/loc/%s.html">%s</a>' % (e(loc_key(b, n, None)), e(n)) for n in names) if not ln else ""
    rows = []
    for p, _ in sorted(items, key=lambda x: x[0]["name"]):
        prices = prices_of(p)
        price = (("từ " if max(prices) > min(prices) else "") + money(min(prices))) if prices else "liên hệ"
        rows.append('<li><a href="sp/%s.html">%s</a> — %s · size %s</li>' % (
            e(quote(p["id"])), e(full_name(p)), price, e(", ".join(size_text(s["s"]) for s in sorted(p["sizes"], key=lambda s: size_key(s["s"]))))))
    grid = '<div data-static style="grid-column:1/-1"><ul>\n' + "\n".join(rows) + "\n</ul></div>"
    return crumbs_html(trail), tiles, grid


def filter_pages(base, in_stock, share_imgs, share_dims, tpl):
    """Trang hãng, hãng + dòng (dựng từ shop.html, có sẵn danh sách mẫu) và trang chia sẻ cho link lọc theo size:
    size, hãng + size, hãng + dòng + size (chỉ bộ lọc đang có hàng)."""
    lines = read_lines()
    groups = {}
    for p in in_stock:
        if p.get("cat") == "ao":
            continue  # link lọc chỉ cho giày (hãng / dòng / size EU)
        b = p.get("brand")
        ln = line_of(p, lines) if b else None
        combos = [(b, None, None)] + ([(b, ln, None)] if ln else [])
        for s in p["sizes"]:
            combos += [(None, None, s["s"])] + ([(b, None, s["s"])] if b else []) + ([(b, ln, s["s"])] if ln else [])
        for c in combos:
            groups.setdefault(c, []).append((p, ln))
    e = lambda s: html.escape(str(s), quote=True)  # noqa: E731
    pages = {}
    for (b, ln, s), items in groups.items():
        key = loc_key(b, ln, s)
        if not key:
            continue
        what = ("Giày " + line_title(b, ln)) if ln else ("Giày " + b) if b else "Giày chính hãng"
        title = what + (" size " + size_text(s) if s else "") + " có sẵn"
        prices = [(x.get("p") or p.get("price")) for p, _ in items for x in p["sizes"] if not s or x["s"] == s]
        prices = [x for x in prices if x]
        desc = ("Giá từ " + money(min(prices)) + " · ") if prices else ""
        if b and not ln:
            tops = {}
            for _, l2 in items:
                if l2:
                    tops[l2] = tops.get(l2, 0) + 1
            names = sorted(tops, key=lambda k: -tops[k])[:4]
            if names:
                desc += "Các dòng " + ", ".join(names) + ". "
        desc += "Hàng chính hãng" + (", còn size " + size_text(s) if s else ", có sẵn size") + " tại S&LIFE Sneaker. Bấm để xem mẫu, giá và chọn size."
        imgs = [share_imgs[p.get("code") or p["id"]] for p, _ in items if (p.get("code") or p["id"]) in share_imgs]
        # Ảnh xem trước: ưu tiên ảnh từ 600px (Facebook hiện ảnh lớn), không có thì ảnh đầu tiên
        img = next((x for x in imgs if share_dims.get(x, (0, 0))[0] >= 600), imgs[0] if imgs else None)
        iw, ih = share_dims.get(img, (1200, 1200))
        q = ([("brand", slug(b))] if b else []) + ([("line", slug(ln))] if ln else []) + ([("size", s.replace(",", "."))] if s else [])
        target = "shop.html?" + "&".join(k + "=" + quote(v) for k, v in q)
        if b and not s:
            # Trang hãng / dòng: trang thật, Google đọc được danh sách mẫu ngay trong HTML
            url = base + "sp/loc/" + key + ".html"
            h1 = line_title(b, ln) if ln else "Giày " + b
            tops = [n for n, _ in lines.get(b, []) if any(l2 == n for _, l2 in items)][:4]
            page_desc = h1 + " chính hãng, có sẵn size tại S&LIFE Sneaker" + (": " + ", ".join(tops) if tops and not ln else "") + ". Xem size còn, giá và hỏi size qua Facebook."
            og = [x for x in [
                '<meta property="og:type" content="website">',
                '<meta property="og:site_name" content="S&amp;LIFE Sneaker">',
                '<meta property="og:locale" content="vi_VN">',
                '<meta property="og:url" content="%s">' % e(url),
                '<meta property="og:title" content="%s">' % e(title),
                '<meta property="og:description" content="%s">' % e(desc),
                '<meta property="og:image" content="%s">' % e(base + (img or LOGO)),
                '<meta property="og:image:type" content="image/jpeg">',
                '<meta property="og:image:width" content="%d">' % iw,
                '<meta property="og:image:height" content="%d">' % ih,
                '<meta property="og:image:alt" content="%s">' % e(title),
                '<meta name="twitter:card" content="summary_large_image">',
            ]]
            text = from_template(tpl, 2, h1 + " chính hãng, có sẵn — S&LIFE Sneaker", page_desc, url, og, "&".join(k + "=" + quote(v) for k, v in q))
            crumbs, tiles, grid = loc_static(items, b, ln, lines)
            text = sub1(r'<div class="pd-top" data-crumbs></div>', '<div class="pd-top" data-crumbs>' + crumbs + "</div>", text, "data-crumbs")
            text = sub1(r'(<h1 class="coll__title" data-title>).*?</h1>', '<h1 class="coll__title" data-title>%s</h1>' % e(h1), text, "data-title")
            if tiles:
                text = sub1(r'(<nav class="chiprow" data-tiles[^>]*>)</nav>', '<nav class="chiprow" data-tiles aria-label="Chọn hãng / dòng giày"><div data-static>' + tiles + "</div></nav>", text, "data-tiles")
            text = sub1(r'<div class="grid" data-grid></div>', '<div class="grid" data-grid>' + grid + "</div>", text, "data-grid")
            pages[key + ".html"] = text
            continue
        meta = [
            '<meta charset="utf-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
            "<title>%s — S&amp;LIFE Sneaker</title>" % e(title),
            '<meta name="description" content="%s">' % e(desc),
            '<meta name="robots" content="noindex, follow">',
            '<link rel="canonical" href="%s">' % e(base + target),
            '<meta property="og:type" content="website">',
            '<meta property="og:site_name" content="S&amp;LIFE Sneaker">',
            '<meta property="og:locale" content="vi_VN">',
            '<meta property="og:url" content="%s">' % e(base + "sp/loc/" + key + ".html"),
            '<meta property="og:title" content="%s">' % e(title),
            '<meta property="og:description" content="%s">' % e(desc),
            '<meta property="og:image" content="%s">' % e(base + (img or LOGO)),
            '<meta property="og:image:type" content="image/jpeg">',
            '<meta property="og:image:width" content="%d">' % iw,
            '<meta property="og:image:height" content="%d">' % ih,
            '<meta property="og:image:alt" content="%s">' % e(title),
            '<meta name="twitter:card" content="summary_large_image">',
            '<link rel="icon" type="image/png" sizes="32x32" href="../../images/brand/favicon-32.png">',
            "<script>location.replace(%s + location.search.replace(/^\\?/, '&') + location.hash);</script>" % json.dumps("../../" + target),
            "<style>body{margin:48px 16px;font:16px/1.5 system-ui,sans-serif;color:#16122B;text-align:center}a{color:#004AAD}</style>",
        ]
        body = '<p>Đang mở danh sách giày…</p>\n<p><a href="../../%s">%s</a></p>' % (e(target), e(title))
        pages[key + ".html"] = ("<!doctype html>\n<!-- File tự sinh bởi scripts/static_pages.py — không sửa tay. -->\n"
                                '<html lang="vi">\n<head>\n' + "\n".join(meta) + "\n</head>\n<body>\n" + body + "\n</body>\n</html>\n")
    LOC_DIR.mkdir(parents=True, exist_ok=True)
    for name, text in pages.items():
        out = LOC_DIR / name
        if not out.exists() or out.read_text(encoding="utf-8") != text:
            out.write_text(text, encoding="utf-8")
    for f in LOC_DIR.glob("*.html"):
        if f.name not in pages:
            f.unlink()  # size đã hết: link cũ vẫn mở được danh mục nhờ 404.html
    return len(pages)


HTML_PAGES = ["index.html", "shop.html", "product.html", "cart.html", "dat-hang.html", "yeu-cau.html", "gioi-thieu.html",
              "lien-he.html", "policy.html", "chinh-sach-bao-mat.html", "size-guide.html", "anh.html"]
CANONICAL = {"index.html": "", "gioi-thieu.html": "gioi-thieu.html", "lien-he.html": "lien-he.html", "policy.html": "policy.html",
             "chinh-sach-bao-mat.html": "chinh-sach-bao-mat.html", "size-guide.html": "size-guide.html"}
OG_IMAGE_RE = re.compile(r'(<meta property="og:image" content=")[^"]*?(images/brand/[^"]+")')
CANON_RE = re.compile(r'<link rel="canonical" href="[^"]*">\n?')


def write_site_meta(base):
    """Địa chỉ tuyệt đối trong <head> các trang (ảnh xem trước og:image, link chuẩn canonical) lấy theo siteUrl:
    đổi tên miền chỉ cần sửa siteUrl rồi chạy lại file này. Trang sản phẩm / danh mục: canonical do app.js đặt."""
    for name in HTML_PAGES:
        path = ROOT / name
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        new = OG_IMAGE_RE.sub(lambda m: m.group(1) + base + m.group(2), text)
        if name in CANONICAL:
            tag = '<link rel="canonical" href="%s">\n' % html.escape(base + CANONICAL[name], quote=True)
            new = CANON_RE.sub("", new)
            new = new.replace('<meta property="og:type" content="website">\n', '<meta property="og:type" content="website">\n' + tag, 1)
        if new != text:
            path.write_text(new, encoding="utf-8")


def write_verify():
    """Thẻ xác minh Google Search Console (googleVerify trong data/shop.js) vào trang chủ."""
    m = re.search(r'googleVerify:\s*"((?:\\.|[^"\\])*)"', (ROOT / "data" / "shop.js").read_text(encoding="utf-8"))
    code = re.sub(r"\\(.)", r"\1", m.group(1)).strip() if m else ""
    code = re.sub(r'^.*content="([^"]+)".*$', r"\1", code)  # lỡ dán cả thẻ <meta …>
    tag = '<meta name="google-site-verification" content="%s">' % html.escape(code, quote=True) if code else ""
    index = ROOT / "index.html"
    text = index.read_text(encoding="utf-8")
    new = VERIFY_RE.sub(lambda _: "<!-- google-verify -->" + tag + "<!-- /google-verify -->", text)
    if new != text:
        index.write_text(new, encoding="utf-8")


def write_feed(base, in_stock, manifest, share_imgs):
    """merchant-feed.xml: danh sách hàng sẵn cho Google Merchant Center (hiển thị miễn phí trên tab Mua sắm).
    Mỗi mẫu còn hàng có ảnh = một dòng; giá thấp nhất trong các size, đúng như trang sản phẩm."""
    e = lambda s: html.escape(str(s), quote=False)  # noqa: E731
    returns = re.search(r"returnDays:\s*(\d+)", (ROOT / "data" / "shop.js").read_text(encoding="utf-8"))
    days = returns.group(1) if returns else "3"
    lines = read_lines()
    gender = {"nu": ("female", "adult"), "nam": ("male", "adult"), "unisex": ("unisex", "adult"), "gs": ("unisex", "kids"), "kid": ("unisex", "kids")}
    items = []
    for p in in_stock:
        code = p.get("code") or p["id"]
        img = share_imgs.get(code)
        if not img:
            continue
        prices = [s.get("p") or p.get("price") for s in p["sizes"]]
        prices = [x for x in prices if x]
        if not prices:
            continue
        sizes = ", ".join(s["s"] for s in p["sizes"])
        line = next((n for n, rx in lines.get(p.get("brand"), []) if rx.search(p.get("name", ""))), "")
        g, age = gender.get(p.get("gender"), ("unisex", "adult"))
        extra = ["images/products/" + f for f in (manifest.get(code) or [])[1:11]]
        ao = p.get("cat") == "ao"
        title = (("" if ao else "Giày ") + p["name"] + (" " + p["code"] if p.get("code") else ""))[:150]
        desc = ("%s%s chính hãng. Size còn: %s. Tư vấn size theo chiều cao, cân nặng, đổi size %s ngày nếu còn nguyên tem mác." if ao else
                "%s%s chính hãng. Size còn (EU): %s. Tư vấn size theo form từng dòng, đổi size %s ngày nếu còn nguyên hộp, tem.") % (
            p["name"], " (" + p["code"] + ")" if p.get("code") else "", sizes, days)
        row = [
            "<g:id>%s</g:id>" % e(code),
            "<g:title>%s</g:title>" % e(title),
            "<g:description>%s</g:description>" % e(desc),
            "<g:link>%s</g:link>" % e(base + "sp/" + quote(p["id"]) + ".html"),
            "<g:image_link>%s</g:image_link>" % e(base + img),
        ] + ["<g:additional_image_link>%s</g:additional_image_link>" % e(base + quote(x)) for x in extra] + [
            "<g:availability>in_stock</g:availability>",
            "<g:price>%d VND</g:price>" % (min(prices) * 1000),
            "<g:condition>new</g:condition>",
            "<g:brand>%s</g:brand>" % e(p.get("brand") or "S&LIFE Sneaker"),
        ] + (["<g:mpn>%s</g:mpn>" % e(p["code"])] if p.get("code") else ["<g:identifier_exists>no</g:identifier_exists>"]) + [
            "<g:google_product_category>%d</g:google_product_category>" % (1604 if ao else 187),
            "<g:product_type>%s</g:product_type>" % e(" > ".join(x for x in (["Quần áo", p.get("brand")] if ao else ["Giày", p.get("brand"), line]) if x)),
            "<g:gender>%s</g:gender>" % g,
            "<g:age_group>%s</g:age_group>" % age,
        ]
        items.append("<item>\n  " + "\n  ".join(row) + "\n</item>")
    text = ('<?xml version="1.0" encoding="UTF-8"?>\n<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n<channel>\n'
            "<title>S&amp;LIFE Sneaker — hàng sẵn</title>\n<link>%s</link>\n<description>Giày chính hãng, hàng sẵn size</description>\n" % e(base)
            + "\n".join(items) + "\n</channel>\n</rss>\n")
    out = ROOT / "merchant-feed.xml"
    if not out.exists() or out.read_text(encoding="utf-8") != text:
        out.write_text(text, encoding="utf-8")
    return len(items)


HOME_RE = re.compile(r"<!-- noi-dung-tinh -->.*?<!-- /noi-dung-tinh -->", re.S)


def write_home_links(in_stock, lines):
    """Trang chủ: link các hãng / dòng đang có giày, có sẵn trong HTML (máy đọc không chạy JavaScript vẫn lần ra các trang).
    Ẩn với khách (app.js đã dựng menu, ô hãng, ô dòng); nằm giữa hai dòng đánh dấu noi-dung-tinh trong index.html."""
    e = lambda s: html.escape(str(s), quote=True)  # noqa: E731
    path = ROOT / "index.html"
    text = path.read_text(encoding="utf-8")
    if not HOME_RE.search(text):
        return
    brands = {}
    for p in in_stock:
        b = p.get("brand")
        if not b or p.get("cat") == "ao":
            continue
        got = brands.setdefault(b, {"n": 0, "lines": []})
        got["n"] += 1
        ln = line_of(p, lines)
        if ln and ln not in got["lines"]:
            got["lines"].append(ln)
    rows = []
    for b in sorted(brands, key=lambda k: -brands[k]["n"]):
        order = [n for n, _ in lines.get(b, [])]
        names = sorted(brands[b]["lines"], key=order.index)
        rows.append('<li><a href="sp/loc/%s.html">Giày %s</a>%s</li>' % (e(loc_key(b, None, None)), e(b), (": " + ", ".join(
            '<a href="sp/loc/%s.html">%s</a>' % (e(loc_key(b, n, None)), e(line_title(b, n))) for n in names)) if names else ""))
    block = ('<!-- noi-dung-tinh --><nav data-static aria-label="Giày chính hãng có sẵn theo hãng"><h2>Giày chính hãng có sẵn theo hãng</h2>\n<ul>\n'
             + "\n".join(rows) + '\n</ul>\n<p><a href="shop.html">Tất cả giày có sẵn</a>'
             + (' · <a href="shop.html?loai=quan-ao">Quần áo chính hãng</a>' if any(p.get("cat") == "ao" for p in in_stock) else "")
             + ' · <a href="size-guide.html">Hướng dẫn chọn size</a> · <a href="policy.html">Chính sách</a> · <a href="lien-he.html">Liên hệ</a></p></nav><!-- /noi-dung-tinh -->')
    new = HOME_RE.sub(lambda m: block, text)
    if new != text:
        path.write_text(new, encoding="utf-8")


def write_sitemap(base, in_stock):
    today = datetime.date.today().isoformat()
    fresh = [p for p in in_stock if p.get("since") and (datetime.date.today() - datetime.date.fromisoformat(p["since"])).days < 14]
    urls = MAIN_PAGES + (["shop.html?moi=1"] if fresh else []) + (["shop.html?loai=quan-ao"] if any(p.get("cat") == "ao" for p in in_stock) else []) + category_urls(in_stock) + ["sp/" + quote(p["id"]) + ".html" for p in in_stock]
    body = "\n".join("  <url><loc>%s</loc><lastmod>%s</lastmod></url>" % (html.escape(base + u), today) for u in urls)
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + body + "\n</urlset>\n", encoding="utf-8")
    (ROOT / "robots.txt").write_text(
        "User-agent: *\nDisallow: /anh.html\nDisallow: /dat-hang.html\nDisallow: /cart.html\nDisallow: /yeu-cau.html\n\n"
        "Sitemap: " + base + "sitemap.xml\n", encoding="utf-8")
    return len(urls)


def main():
    image_manifest.write()  # ảnh chép tay vào images/products cũng được đưa vào danh sách
    chuan_hoa_anh.run()     # ảnh bìa mới / vừa thay: đưa về ảnh vuông nền trắng, giày cùng cỡ
    write_site_images()
    base = site_url()
    products = read_js(ROOT / "data" / "products.js", "PRODUCTS")
    if not base or products is None:
        print("Bỏ qua trang tĩnh: thiếu siteUrl trong data/shop.js hoặc data/products.js")
        return
    manifest = read_js(IMG_DIR / "danh-sach.js", "PRODUCT_IMAGES") or {}
    in_stock = [p for p in products if p.get("sizes")]

    write_verify()
    write_site_meta(base)  # trước khi dựng trang tĩnh: product.html / shop.html là khuôn của sp/
    lines, days = read_lines(), return_days()
    tpl_product = (ROOT / "product.html").read_text(encoding="utf-8")
    tpl_shop = (ROOT / "shop.html").read_text(encoding="utf-8")
    # Mẫu liên quan (link có sẵn trong HTML): cùng hãng + dòng, quần áo thì cùng hãng
    groups = {}
    for p in in_stock:
        groups.setdefault((p.get("cat"), p.get("brand"), line_of(p, lines)), []).append(p)

    SP_DIR.mkdir(exist_ok=True)
    keep_html, keep_img, with_photo, share_imgs, share_dims = set(), set(), 0, {}, {}
    for p in in_stock:
        img = share_image(p.get("code") or p["id"], manifest.get(p.get("code") or p["id"]))
        if img:
            keep_img.add(Path(img[0]).name)
            share_imgs[p.get("code") or p["id"]] = img[0]
            share_dims[img[0]] = (img[1], img[2])
            with_photo += 1
        name = p["id"] + ".html"
        keep_html.add(name)
        out = SP_DIR / name
        same = groups[(p.get("cat"), p.get("brand"), line_of(p, lines))]
        k = same.index(p)
        related = [x for x in same[k + 1:] + same[:k]][:12]  # 12 mẫu kế tiếp trong nhóm: mỗi mẫu được nhiều trang trỏ tới
        text = share_page(p, base, img or (LOGO, 1200, 1200), tpl_product, lines, manifest, related, days)
        if not out.exists() or out.read_text(encoding="utf-8") != text:
            out.write_text(text, encoding="utf-8")
    # Mẫu đã hết hàng / ảnh đã đổi: xoá trang cũ (link cũ vẫn mở được nhờ 404.html)
    for f in SP_DIR.glob("*.html"):
        if f.name not in keep_html:
            f.unlink()
    if SP_IMG.exists():
        for f in SP_IMG.glob("*.jpg"):
            if f.name not in keep_img:
                f.unlink()

    (ROOT / "404.html").write_text(page_404(base), encoding="utf-8")
    n = write_sitemap(base, in_stock)
    write_preload(hero_star(in_stock, manifest))
    write_home_links(in_stock, lines)
    feed = write_feed(base, in_stock, manifest, share_imgs)
    locs = filter_pages(base, in_stock, share_imgs, share_dims, tpl_shop)
    print(f"Trang chia sẻ sp/: {len(keep_html)} mẫu còn hàng ({with_photo} có ảnh thật, còn lại dùng logo), sp/loc/: {locs} link lọc; sitemap.xml: {n} link; merchant-feed.xml: {feed} mẫu")


if __name__ == "__main__":
    main()
