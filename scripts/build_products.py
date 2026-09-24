#!/usr/bin/env python3
"""Chuyển bảng hàng sẵn (Google Sheet) thành data/products.js cho website.

Cách dùng:
    python3 scripts/build_products.py bang-hang.xlsx
    python3 scripts/build_products.py bang-hang.md      # bản xuất markdown của Google Drive

File .xlsx: trên Google Sheet chọn Tệp > Tải xuống > Microsoft Excel (.xlsx).
Mỗi trang tính là một thương hiệu / dòng giày. Dòng tiêu đề bắt đầu bằng ô "Tên",
các cột size nằm giữa cột "Hình ảnh" và cột "GIÁ BÁN". Ô có số 1 hoặc tô màu xanh lá
nghĩa là size đó còn hàng.

Ảnh sản phẩm: đặt file vào images/products/ và đặt tên theo mã sản phẩm,
ví dụ images/products/U204LMMC.jpg. Script tự gắn ảnh khi chạy lại.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "products.js"
IMG_DIR = ROOT / "images" / "products"
IMG_EXT = (".webp", ".jpg", ".jpeg", ".png")

# Thứ tự quan trọng: Jordan trước Nike, Onitsuka trước Asics.
BRAND_RULES = [
    ("Onitsuka Tiger", r"onitsuka|mexico 66"),
    ("Asics", r"asics|gel[- ]"),
    ("New Balance", r"new balance|\bnb\b"),
    ("Salomon", r"salomon|xt-6"),
    ("Jordan", r"jordan"),
    ("Nike", r"nike|air force|air max|dunk|vapor|cortez"),
    ("Adidas", r"adidas|samba|gazelle|spezial|handball|campus|superstar|sl 72|taekwondo|adizero|forum"),
    ("Puma", r"puma|speedcat|palermo|suede"),
    ("Vans", r"vans|knu-skool|old skool"),
    ("Converse", r"converse|chuck"),
    ("On", r"\bon the roger|\bon cloud|\bcloudmonster|\bcloudtilt"),
]

GENDER_RULES = [
    ("kid", r"\(\s*code kid\s*\)|\bkids?\b|\(\s*ps\s*\)|\(\s*td\s*\)"),
    ("gs", r"\(\s*gs\s*\)|\bgs\b"),
    ("unisex", r"cho nam nữ|nam nữ"),
    ("nu", r"\(\s*code nữ\s*\)|\(\s*w\s*\)|cho nữ|dành cho nữ|\bwmns\b|women"),
    ("nam", r"\(\s*code nam\s*\)|cho nam|dành cho nam"),
]

CODE_PATTERNS = [
    r"\b[A-Z0-9]{4,8}-[A-Z0-9]{2,4}\b",  # 1183C102-001, FV5029-141, 401698-01
    r"\b[A-Z]{1,3}[0-9][A-Z0-9]{3,9}\b",  # U204LMMC, IG1968, VN0009QC6BT
    r"\b[0-9]{3,4}[A-Z]{2,4}[0-9]?\b",  # 1906LNS
    r"\b[0-9]{6}\b",  # 416635 (Salomon)
    r"\b[0-9][A-Z]{2}[0-9]{8}\b",  # 3WD10600975 (On)
]
MODEL_LIKE = re.compile(r"^(\d{3,4}[A-Z]?|\d{3}V\d|[A-Z]{1,2}\d{1,3}|XT-\d+|GT-\d+|FF\d)$", re.I)

APPAREL = re.compile(
    r"\b(tee|t-shirt|shirt|jersey|top|jacket|hoodie|sweatshirt|pants|shorts|beanie|cap|socks?|áo|quần)\b", re.I
)

PARENS_TAGS = re.compile(
    r"\(\s*(code nữ|code nam|code kid|gs|w)\s*\)", re.I
)


def slugify(text):
    text = unicodedata.normalize("NFD", text.replace("đ", "d").replace("Đ", "D"))
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def clean(text):
    text = str(text or "")
    text = text.replace("&#9;", " ").replace("\t", " ").replace("\\", "")
    text = text.replace("‘", "'").replace("’", "'")
    return re.sub(r"\s+", " ", text).strip()


def parse_price(value):
    """Trả về giá theo nghìn đồng (2600 = 2.600.000đ) hoặc None."""
    s = clean(value).lower().replace("đ", "").strip()
    if not s or "hết" in s or "#" in s:
        return None
    if re.fullmatch(r"\d{1,3}(\.\d{3})*(,\d+)?", s):  # 2.600,00
        return int(s.split(",")[0].replace(".", ""))
    if re.fullmatch(r"\d+([.,]\d+)?", s):
        n = float(s.replace(",", "."))
        return int(n / 1000) if n >= 100000 else int(n)
    return None


def find_code(name):
    # Ưu tiên phần sau dấu "/" (ví dụ "Jordan 1 Mid Linen / 554724-082")
    parts = [p for p in name.split("/")]
    candidates = [parts[-1]] if len(parts) > 1 else []
    candidates.append(name)
    for chunk in candidates:
        for pat in CODE_PATTERNS:
            for m in re.finditer(pat, chunk.upper()):
                tok = m.group(0)
                if MODEL_LIKE.match(tok) or not re.search(r"\d", tok):
                    continue
                return tok
    return ""


def detect(rules, text, default=None):
    low = text.lower()
    for value, pat in rules:
        if re.search(pat, low):
            return value
    return default


def display_name(raw, code):
    name = raw
    if code:
        name = re.sub(re.escape(code), " ", name, count=1, flags=re.I)
    name = PARENS_TAGS.sub(" ", name)
    name = re.sub(r"^\s*giày\s+", "", name, flags=re.I)
    name = re.sub(r"\s+giày\s+", " ", name, flags=re.I)
    name = re.sub(r"\s*/\s*$|^\s*/\s*", "", name)
    name = re.sub(r"\s*/\s*/\s*", " / ", name)
    name = re.sub(r"\bcode (nam|nữ)\b", "", name, flags=re.I)
    name = re.sub(r"\s+(dành )?cho (nam nữ|nam|nữ)\b", "", name, flags=re.I)
    name = re.sub(r"\s+", " ", name).strip(" -/,.")
    return name


def parse_size_cell(value):
    """'1' -> còn; '1 2000' -> còn, giá riêng 2000; '1 ib' -> còn, ghi chú."""
    s = clean(value)
    if not s:
        return None
    info = {}
    rest = re.sub(r"^1\b", "", s).strip()
    m = re.match(r"^(\d[\d.,]*)\s*(.*)$", rest)
    if m:
        price = parse_price(m.group(1))
        if price and price > 100:
            info["price"] = price
        rest = m.group(2).strip()
    rest = rest.strip("() ")
    if rest:
        low = rest.lower()
        if low in ("ib", "ib trước"):
            rest = "Nhắn shop kiểm tra trước"
        elif low == "hcm":
            rest = "Hàng đang ở TP.HCM"
        info["note"] = rest[0].upper() + rest[1:]
    return info


def normalise_size(label):
    s = clean(label).replace(".", ",")
    return s


def is_size_header(label):
    return bool(re.fullmatch(r"\d{2}(,5)?Y?", normalise_size(label)))


def rows_from_markdown(path):
    text = Path(path).read_text(encoding="utf-8")
    table = []
    for line in text.split("\n"):
        if not line.startswith("|"):
            if table:
                yield table
            table = []
            continue
        cells = [clean(clean(c).replace("[merged]", "")) for c in line.strip().strip("|").split("|")]
        if set("".join(cells)) <= set(":- "):
            continue
        table.append({"cells": cells, "green": set()})
    if table:
        yield table


def is_green(cell):
    fill = cell.fill
    if not fill or fill.fill_type != "solid":
        return False
    color = fill.fgColor
    rgb = getattr(color, "rgb", None)
    if not isinstance(rgb, str) or len(rgb) < 6:
        return False
    r, g, b = (int(rgb[-6:][i:i + 2], 16) for i in (0, 2, 4))
    return g > 150 and g > r + 30 and g > b + 20


def rows_from_xlsx(path):
    try:
        import openpyxl
    except ImportError:
        sys.exit("Cần cài openpyxl: pip install openpyxl")
    wb = openpyxl.load_workbook(path, data_only=True)
    for ws in wb.worksheets:
        table = []
        for row in ws.iter_rows():
            cells = [clean(c.value) for c in row]
            green = {i for i, c in enumerate(row) if is_green(c)}
            table.append({"cells": cells, "green": green, "sheet": ws.title, "row": row[0].row if row else None})
        yield table


def parse_table(table, index):
    header = None
    size_cols = []
    price_col = None
    products = []
    sheet = table[0].get("sheet", "") if table else ""
    default_brand = detect(BRAND_RULES, sheet)
    for row in table:
        cells = row["cells"]
        if not cells:
            continue
        first = cells[0]
        if first == "Tên":
            if header is None:
                header = cells
                size_cols = [i for i, h in enumerate(cells) if is_size_header(h)]
                price_cols = [i for i, h in enumerate(cells) if h.upper() == "GIÁ BÁN"]
                if not price_cols:
                    price_cols = [i for i, h in enumerate(cells) if h.upper().startswith("GIÁ")]
                price_col = price_cols[-1] if price_cols else None
            continue
        if header is None or not first or first.startswith("Giá bán nằm"):
            continue

        sizes = []
        for i in size_cols:
            value = cells[i] if i < len(cells) else ""
            if not value and i in row["green"]:
                value = "1"
            info = parse_size_cell(value)
            if info is not None:
                entry = {"s": normalise_size(header[i])}
                if "price" in info:
                    entry["p"] = info["price"]
                if "note" in info:
                    entry["n"] = info["note"]
                sizes.append(entry)

        price = parse_price(cells[price_col]) if price_col is not None and price_col < len(cells) else None
        # Ô "2500 (box thay thế)" -> giá của size đó, không phải ghi chú
        for s in sizes:
            if "n" in s and "p" not in s:
                m = re.match(r"^(\d+)\s*(.*)$", s["n"])
                if m and parse_price(m.group(1)):
                    s["p"] = parse_price(m.group(1))
                    s["n"] = m.group(2).strip("() ") or None
                    if not s["n"]:
                        del s["n"]

        raw = clean(first)
        raw = re.sub(r"\b([A-Z0-9]{5,8}) -(\d{2,3})\b", r"\1-\2", raw)  # "CW2288 -111"
        raw = re.sub(r"(?<![A-Za-z])didas\b", "adidas", raw)
        if APPAREL.search(raw):
            continue  # Shop chỉ bán giày trên website
        code = find_code(raw)
        name = display_name(raw, code)
        name = re.sub(r"^[A-Z0-9-]{5,}\s*/\s*", "", name)  # "GR740WN / New Balance 740"
        name = re.sub(r"^(wmns|men|women)\s+", "", name, flags=re.I)
        notes = []
        m = re.search(r"\s+-\s+([^-]*[à-ỹ][^-]*)$", name)  # "... - phom bé, nên lên 1 size"
        if m and m.group(1)[:1].islower():
            notes.append(m.group(1)[0].upper() + m.group(1)[1:])
            name = name[:m.start()]
        clearance = bool(re.search(r"xả kho", name, re.I))
        if clearance:
            notes.append("Xả kho, không hoàn huỷ")
            name = re.sub(r"[-\s]*xả kho( không hoàn hủy| không hoàn huỷ)?", " ", name, flags=re.I)
        if re.search(r"hàng trung", name, re.I):
            notes.append("Hàng nội địa Trung")
            name = re.sub(r"\s*hàng trung\b", " ", name, flags=re.I)
        name = re.sub(r"^\d{2}(,5)?\s+(?=[A-Za-z])", "", name)
        for m in re.finditer(r"\(([^)]*)\)", name):
            notes.append(m.group(1).strip())
        name = re.sub(r"\s*\([^)]*\)\s*", " ", name).strip()
        name = re.sub(r"\s+", " ", name)

        name = re.sub(r"\s+-\s+\d{2}(,5)?$", "", name)
        name = re.sub(r"\s+-\s+", " ", name)
        brand = detect(BRAND_RULES, raw, default_brand)
        gender = detect(GENDER_RULES, raw, "unisex")
        pid = slugify(code or name)
        products.append({
            "id": pid,
            "code": code,
            "name": name,
            "brand": brand,
            "gender": gender,
            "price": price,
            "sizes": sizes,
            "note": "; ".join(n for n in notes if n) or None,
            "sale": clearance or None,
            "raw": raw,
            "_sheet": row.get("sheet"),
            "_row": row.get("row"),
        })
    # Dòng không ghi tên hãng (ví dụ "Samba OG ...") lấy theo hãng chiếm đa số trong bảng
    counts = {}
    for p in products:
        if p["brand"]:
            counts[p["brand"]] = counts.get(p["brand"], 0) + 1
    majority = max(counts, key=counts.get) if counts else None
    for p in products:
        p["brand"] = p["brand"] or majority or "Khác"
        # Tên luôn có tên hãng: "Samba OG ..." -> "Adidas Samba OG ..."
        first_word = p["brand"].split()[0]
        if not re.search(r"\b" + re.escape(first_word) + r"\b", p["name"], re.I):
            p["name"] = p["brand"] + " " + p["name"]
        p["name"] = re.sub(r"^(adidas|nike|puma|asics|jordan)\b", lambda m: m.group(1).capitalize(), p["name"], flags=re.I)
        p["name"] = re.sub(r"^ASICS\b", "Asics", p["name"])
    return products


def find_image(code):
    if not code or not IMG_DIR.exists():
        return None
    for ext in IMG_EXT:
        for candidate in (code + ext, code.lower() + ext):
            p = IMG_DIR / candidate
            if p.exists():
                return "images/products/" + candidate
    return None


def write_sitemap(products):
    """Tạo sitemap.xml cho Google từ danh sách sản phẩm và địa chỉ website trong data/shop.js."""
    import datetime
    from urllib.parse import quote
    shop_js = (ROOT / "data" / "shop.js").read_text(encoding="utf-8")
    m = re.search(r'siteUrl:\s*"([^"]+)"', shop_js)
    if not m:
        return
    base = m.group(1).rstrip("/") + "/"
    today = datetime.date.today().isoformat()
    urls = ["", "shop.html", "size-guide.html", "policy.html", "gioi-thieu.html", "lien-he.html", "chinh-sach-bao-mat.html"]
    for brand in sorted({p["brand"] for p in products if p["sizes"]}):
        urls.append("shop.html?brand=" + slugify(brand))
    urls += ["product.html?id=" + quote(p["id"]) for p in products if p["sizes"]]
    body = "\n".join(
        "  <url><loc>%s</loc><lastmod>%s</lastmod></url>" % ((base + u).replace("&", "&amp;"), today) for u in urls
    )
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + body + "\n</urlset>\n", encoding="utf-8")
    (ROOT / "robots.txt").write_text(
        "User-agent: *\nDisallow: /anh.html\nDisallow: /dat-hang.html\nDisallow: /cart.html\n\nSitemap: " + base + "sitemap.xml\n",
        encoding="utf-8")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = sys.argv[1]
    tables = rows_from_xlsx(src) if src.lower().endswith((".xlsx", ".xlsm")) else rows_from_markdown(src)

    products, seen = [], {}
    for idx, table in enumerate(tables):
        for p in parse_table(table, idx):
            if p["id"] in seen:
                # Cùng mã xuất hiện hai lần -> gộp size
                prev = seen[p["id"]]
                have = {s["s"] for s in prev["sizes"]}
                prev["sizes"] += [s for s in p["sizes"] if s["s"] not in have]
                prev["price"] = prev["price"] or p["price"]
                continue
            seen[p["id"]] = p
            products.append(p)

    for order, p in enumerate(products):
        p["order"] = order
        img = find_image(p["code"])
        if img:
            p["image"] = img
        for k in ("raw", "_sheet", "_row"):
            p.pop(k, None)
        for k in [k for k, v in p.items() if v is None]:
            del p[k]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    body = json.dumps(products, ensure_ascii=False, separators=(",", ":"))
    body = body.replace("},{", "},\n{")
    OUT.write_text(
        "// File tự sinh bởi scripts/build_products.py — không sửa tay.\n"
        "window.PRODUCTS = " + body + ";\n",
        encoding="utf-8",
    )
    write_sitemap(products)
    in_stock = sum(1 for p in products if p["sizes"] and p.get("price"))
    brands = {}
    for p in products:
        brands[p["brand"]] = brands.get(p["brand"], 0) + 1
    print(f"Đã ghi {OUT.relative_to(ROOT)}: {len(products)} mẫu, {in_stock} mẫu còn hàng")
    for b, n in sorted(brands.items(), key=lambda x: -x[1]):
        print(f"  {b}: {n}")


if __name__ == "__main__":
    main()
