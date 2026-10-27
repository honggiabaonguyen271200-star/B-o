#!/usr/bin/env python3
"""Sinh các file tĩnh đi kèm website từ data/products.js (không cần file .xlsx):

- ảnh bìa images/products/<MÃ>.webp  chuẩn hoá cho đồng đều (scripts/chuan_hoa_anh.py: vuông, nền trắng, giày cùng cỡ)
- images/products/danh-sach.js  danh sách ảnh sản phẩm (web chỉ hiện ảnh có trong danh sách, không dò tên file → không lỗi 404)
- images/anh-khac.js           danh sách banner (images/banners/) và ảnh khách (images/khach-hang/)
- sp/<mã>.html   trang chia sẻ nhẹ cho từng mẫu còn hàng: có og:title, og:image, og:description để
                 Facebook hiện ảnh + tên + giá khi dán link, rồi tự chuyển sang product.html?id=…
- sp/loc/<hãng>[--<dòng>][--size-<size>].html  trang chia sẻ cho link lọc (VD: Giày Puma size 37,5): có tiêu đề, mô tả, ảnh
                 một mẫu trong bộ lọc, tự chuyển sang shop.html?brand=…&size=…. Nút "Chia sẻ" ở trang danh mục dùng link này
- sp/anh/<MÃ>.jpg ảnh xem trước (JPEG, Facebook đọc chắc chắn hơn WebP), lấy từ ảnh chính của mẫu
- 404.html       link sp/ của mẫu đã hết hàng vẫn mở được trang sản phẩm (GitHub Pages)
- sitemap.xml    chỉ trang chính + mẫu còn hàng, lastmod = ngày chạy
- robots.txt
- merchant-feed.xml  danh sách hàng sẵn cho Google Merchant Center (tab Mua sắm của Google, miễn phí)
- index.html     dòng tải trước ảnh giày ở banner đầu trang (giữa hai dòng đánh dấu hero-preload)

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


def share_page(p, base, img):
    e = lambda s: html.escape(str(s), quote=True)  # noqa: E731
    pid = quote(p["id"])
    product = base + "product.html?id=" + pid
    prices = [s.get("p") or p.get("price") for s in p["sizes"]]
    prices = [x for x in prices if x]
    if not prices:
        price = "Giá: liên hệ shop"
    elif min(prices) == max(prices):
        price = "Giá " + money(prices[0])
    else:
        price = "Giá từ " + money(min(prices))
    title = "Giày " + p["name"] + (" " + p["code"] if p.get("code") else "")
    desc = price + " · Hàng chính hãng, có sẵn tại S&LIFE Sneaker. Xem size còn và hỏi size qua Facebook."
    path, w, h = img
    alt = title if path != LOGO else "S&LIFE Sneaker"
    meta = [
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        "<title>%s chính hãng, có sẵn — S&amp;LIFE Sneaker</title>" % e(title),
        '<meta name="description" content="%s">' % e(desc),
        '<link rel="canonical" href="%s">' % e(product),
        '<meta property="og:type" content="product">',
        '<meta property="og:site_name" content="S&amp;LIFE Sneaker">',
        '<meta property="og:locale" content="vi_VN">',
        '<meta property="og:url" content="%s">' % e(base + "sp/" + pid + ".html"),
        '<meta property="og:title" content="%s">' % e(title),
        '<meta property="og:description" content="%s">' % e(desc),
        '<meta property="og:image" content="%s">' % e(base + path),
        '<meta property="og:image:type" content="image/jpeg">',
        '<meta property="og:image:width" content="%d">' % w,
        '<meta property="og:image:height" content="%d">' % h,
        '<meta property="og:image:alt" content="%s">' % e(alt),
    ]
    if prices:
        meta += ['<meta property="product:price:amount" content="%d">' % (min(prices) * 1000),
                 '<meta property="product:price:currency" content="VND">']
    meta += [
        '<meta name="twitter:card" content="summary_large_image">',
        '<link rel="icon" type="image/png" sizes="32x32" href="../images/brand/favicon-32.png">',
        # Chỉ chuyển bằng JavaScript: Facebook không chạy JS nên vẫn đọc được các thẻ og ở trên.
        # Giữ ?utm_source=… của link chia sẻ để Analytics biết khách đến từ kênh nào.
        "<script>location.replace(%s + location.search.replace(/^\\?/, '&') + location.hash);</script>" % json.dumps("../product.html?id=" + pid),
        "<style>body{margin:48px 16px;font:16px/1.5 system-ui,sans-serif;color:#16122B;text-align:center}a{color:#004AAD}</style>",
    ]
    body = '<p>Đang mở trang sản phẩm…</p>\n<p><a href="../product.html?id=%s">%s</a></p>' % (e(pid), e(title))
    return ("<!doctype html>\n<!-- File tự sinh bởi scripts/static_pages.py — không sửa tay. -->\n"
            '<html lang="vi">\n<head>\n' + "\n".join(meta) + "\n</head>\n<body>\n" + body + "\n</body>\n</html>\n")


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
        if not b:
            continue
        u = "shop.html?brand=" + slug(b)
        if u not in seen:
            seen.add(u)
            urls.append(u)
        for name, rx in lines.get(b, []):
            if rx.search(p.get("name", "")):
                u2 = u + "&line=" + slug(name)
                if u2 not in seen:
                    seen.add(u2)
                    urls.append(u2)
                break
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


def filter_pages(base, in_stock, share_imgs):
    """Trang chia sẻ cho link lọc: hãng, hãng + dòng, size, hãng + size, hãng + dòng + size (chỉ bộ lọc đang có hàng)."""
    lines = read_lines()
    groups = {}
    for p in in_stock:
        b = p.get("brand")
        ln = next((n for n, rx in lines.get(b, []) if rx.search(p.get("name", ""))), None) if b else None
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
        img = next((share_imgs[p.get("code") or p["id"]] for p, _ in items if (p.get("code") or p["id"]) in share_imgs), None)
        q = ([("brand", slug(b))] if b else []) + ([("line", slug(ln))] if ln else []) + ([("size", s.replace(",", "."))] if s else [])
        target = "shop.html?" + "&".join(k + "=" + quote(v) for k, v in q)
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
        title = ("Giày " + p["name"] + (" " + p["code"] if p.get("code") else ""))[:150]
        desc = "%s%s chính hãng. Size còn (EU): %s. Tư vấn size theo form từng dòng, đổi size %s ngày nếu còn nguyên hộp, tem." % (
            p["name"], " (" + p["code"] + ")" if p.get("code") else "", sizes, days)
        row = [
            "<g:id>%s</g:id>" % e(code),
            "<g:title>%s</g:title>" % e(title),
            "<g:description>%s</g:description>" % e(desc),
            "<g:link>%s</g:link>" % e(base + "product.html?id=" + quote(p["id"])),
            "<g:image_link>%s</g:image_link>" % e(base + img),
        ] + ["<g:additional_image_link>%s</g:additional_image_link>" % e(base + quote(x)) for x in extra] + [
            "<g:availability>in_stock</g:availability>",
            "<g:price>%d VND</g:price>" % (min(prices) * 1000),
            "<g:condition>new</g:condition>",
            "<g:brand>%s</g:brand>" % e(p.get("brand") or "S&LIFE Sneaker"),
        ] + (["<g:mpn>%s</g:mpn>" % e(p["code"])] if p.get("code") else ["<g:identifier_exists>no</g:identifier_exists>"]) + [
            "<g:google_product_category>187</g:google_product_category>",
            "<g:product_type>%s</g:product_type>" % e(" > ".join(x for x in ["Giày", p.get("brand"), line] if x)),
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


def write_sitemap(base, in_stock):
    today = datetime.date.today().isoformat()
    fresh = [p for p in in_stock if p.get("since") and (datetime.date.today() - datetime.date.fromisoformat(p["since"])).days < 14]
    urls = MAIN_PAGES + (["shop.html?moi=1"] if fresh else []) + category_urls(in_stock) + ["product.html?id=" + quote(p["id"]) for p in in_stock]
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

    SP_DIR.mkdir(exist_ok=True)
    keep_html, keep_img, with_photo, share_imgs = set(), set(), 0, {}
    for p in in_stock:
        img = share_image(p.get("code") or p["id"], manifest.get(p.get("code") or p["id"]))
        if img:
            keep_img.add(Path(img[0]).name)
            share_imgs[p.get("code") or p["id"]] = img[0]
            with_photo += 1
        name = p["id"] + ".html"
        keep_html.add(name)
        out = SP_DIR / name
        text = share_page(p, base, img or (LOGO, 1200, 1200))
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
    write_verify()
    write_site_meta(base)
    feed = write_feed(base, in_stock, manifest, share_imgs)
    locs = filter_pages(base, in_stock, share_imgs)
    print(f"Trang chia sẻ sp/: {len(keep_html)} mẫu còn hàng ({with_photo} có ảnh thật, còn lại dùng logo), sp/loc/: {locs} link lọc; sitemap.xml: {n} link; merchant-feed.xml: {feed} mẫu")


if __name__ == "__main__":
    main()
