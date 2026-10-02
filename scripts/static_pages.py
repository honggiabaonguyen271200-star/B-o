#!/usr/bin/env python3
"""Sinh các file tĩnh đi kèm website từ data/products.js (không cần file .xlsx):

- images/products/danh-sach.js  danh sách ảnh sản phẩm (web chỉ hiện ảnh có trong danh sách, không dò tên file → không lỗi 404)
- images/anh-khac.js           danh sách banner (images/banners/) và ảnh khách (images/khach-hang/)
- sp/<mã>.html   trang chia sẻ nhẹ cho từng mẫu còn hàng: có og:title, og:image, og:description để
                 Facebook hiện ảnh + tên + giá khi dán link, rồi tự chuyển sang product.html?id=…
- sp/anh/<MÃ>.jpg ảnh xem trước (JPEG, Facebook đọc chắc chắn hơn WebP), lấy từ ảnh chính của mẫu
- 404.html       link sp/ của mẫu đã hết hàng vẫn mở được trang sản phẩm (GitHub Pages)
- sitemap.xml    chỉ trang chính + mẫu còn hàng, lastmod = ngày chạy
- robots.txt
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
from urllib.parse import quote

sys.path.insert(0, str(Path(__file__).resolve().parent))
import image_manifest  # noqa: E402

try:
    from PIL import Image
except ImportError:
    Image = None

ROOT = Path(__file__).resolve().parent.parent
SP_DIR = ROOT / "sp"
SP_IMG = SP_DIR / "anh"
IMG_DIR = ROOT / "images" / "products"
LOGO = "images/brand/slife-logo-square-1200.jpg"
MAIN_PAGES = ["", "shop.html", "size-guide.html", "policy.html", "gioi-thieu.html", "lien-he.html", "chinh-sach-bao-mat.html"]
PRELOAD_RE = re.compile(r"<!-- hero-preload -->.*?<!-- /hero-preload -->", re.S)


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
        "<title>%s — S&amp;LIFE Sneaker</title>" % e(title),
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
        # Chỉ chuyển bằng JavaScript: Facebook không chạy JS nên vẫn đọc được các thẻ og ở trên
        "<script>location.replace(%s + location.hash);</script>" % json.dumps("../product.html?id=" + pid),
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


def write_sitemap(base, in_stock):
    today = datetime.date.today().isoformat()
    urls = MAIN_PAGES + ["product.html?id=" + quote(p["id"]) for p in in_stock]
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
    write_site_images()
    base = site_url()
    products = read_js(ROOT / "data" / "products.js", "PRODUCTS")
    if not base or products is None:
        print("Bỏ qua trang tĩnh: thiếu siteUrl trong data/shop.js hoặc data/products.js")
        return
    manifest = read_js(IMG_DIR / "danh-sach.js", "PRODUCT_IMAGES") or {}
    in_stock = [p for p in products if p.get("sizes")]

    SP_DIR.mkdir(exist_ok=True)
    keep_html, keep_img, with_photo = set(), set(), 0
    for p in in_stock:
        img = share_image(p.get("code") or p["id"], manifest.get(p.get("code") or p["id"]))
        if img:
            keep_img.add(Path(img[0]).name)
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
    print(f"Trang chia sẻ sp/: {len(keep_html)} mẫu còn hàng ({with_photo} có ảnh thật, còn lại dùng logo); sitemap.xml: {n} link")


if __name__ == "__main__":
    main()
