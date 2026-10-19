#!/usr/bin/env python3
"""Tải ảnh bìa nét hơn từ kho ảnh chính thức của hãng, theo mã sản phẩm.

Ảnh bìa lấy từ bảng hàng chỉ rộng khoảng 300px nên lên web bị mờ. Script này tìm ảnh cùng mã trên kho ảnh
của hãng (New Balance, Asics, Onitsuka Tiger, Puma, Nike, Jordan), chọn ảnh **giống ảnh bìa đang có nhất**
(cùng góc chụp, cùng màu) và chỉ thay khi đủ giống — tránh lấy nhầm màu khác của cùng dòng giày.

    python scripts/tai_anh_hang.py               # tải cho mọi mẫu có ảnh bìa nhỏ (< 800px)
    python scripts/tai_anh_hang.py --so 50       # chỉ 50 mẫu đầu
    python scripts/tai_anh_hang.py --hang Nike   # chỉ một hãng (tên như trong bảng, nhiều hãng cách nhau dấu phẩy)
    python scripts/tai_anh_hang.py --ma U740WM2 FV5029-141
    python scripts/tai_anh_hang.py --thu         # chỉ tải về images/tai-ve/ để xem, không thay ảnh trên web
    python scripts/tai_anh_hang.py --ap-dung     # đưa ảnh đã tải thử lên web (trừ mã trong anh-khong-tai.txt)

Ảnh bìa cũ được giữ ở images/goc/bang/ (không đưa lên GitHub). Kết quả ghi ở scripts/anh-tai-ve.json
(mẫu đã tìm không thấy thì lần sau bỏ qua; thêm --tim-lai để tìm lại). Mẫu bị thay sai ảnh: ghi mã vào
scripts/anh-khong-tai.txt rồi chạy `python scripts/tai_anh_hang.py --tra-lai` để lấy lại ảnh cũ.
Sau khi chạy: `python scripts/static_pages.py` (tự chuẩn hoá nền trắng, cập nhật danh sách ảnh).
Cần Pillow: pip install pillow
"""
import argparse
import datetime
import io
import json
import re
import shutil
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chuan_hoa_anh as ch  # noqa: E402
from PIL import Image, ImageChops, ImageOps, ImageStat  # noqa: E402

ROOT = ch.ROOT
IMG_DIR = ch.IMG_DIR
OLD_DIR = ch.BACKUP / "bang"          # ảnh bìa cũ (từ bảng hàng) trước khi thay
TRY_DIR = ROOT / "images" / "tai-ve"  # --thu: ảnh tải về để xem
LOG = Path(__file__).resolve().parent / "anh-tai-ve.json"
SKIP = Path(__file__).resolve().parent / "anh-khong-tai.txt"

SMALL = 800        # ảnh bìa gốc nhỏ hơn cỡ này thì tìm ảnh mới
MIN_SIDE = 900     # ảnh tải về phải lớn hơn cỡ này
MIN_SCORE = 0.5    # Nike/Jordan: độ giống tối thiểu với ảnh bìa đang có (trang Nike có cả ảnh màu khác)
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
NIKE_REGIONS = ["", "sg", "my", "vn", "ph", "id", "th", "jp", "kr", "au", "gb", "in"]


def fetch(url, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.8"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.geturl(), r.read()


def fetch_text(url):
    try:
        final, body = fetch(url)
        return final, body.decode("utf-8", "ignore")
    except Exception:
        return None, ""


def fetch_image(url):
    try:
        _, body = fetch(url)
        im = Image.open(io.BytesIO(body))
        im.load()
        return im
    except Exception:
        return None


# ---------- Nơi tìm ảnh theo hãng: trả về danh sách (link ảnh nhỏ để so, link ảnh lớn) ----------

def scene7(base, names):
    return [(f"{base}/{n}?wid=240&fmt=jpg", f"{base}/{n}?wid=1200&fmt=png-alpha") for n in names]


def new_balance(code):
    c = code.lower()
    return scene7("https://nb.scene7.com/is/image/NB", [f"{c}_nb_{i:02d}_i" for i in (2, 1, 3, 4, 5)])


def asics(code):
    c = code.upper().replace("-", "_")
    return scene7("https://images.asics.com/is/image/asics",
                  [f"{c}_{v}_GLB" for v in ("SR_RT", "SR_LT", "SB_FR", "SB_BK", "SB_TP")])


def puma(code):
    m = re.fullmatch(r"(\d{6})[-_ ]?(\d{2})", code.strip())
    if not m:
        return []
    style, color = m.groups()
    return [(f"https://images.puma.com/image/upload/w_240/global/{style}/{color}/{v}/fnd/{reg}/fmt/png",
             f"https://images.puma.com/image/upload/w_1200/global/{style}/{color}/{v}/fnd/{reg}/fmt/png")
            for v in ("sv01", "sv02") for reg in ("PNA", "EEA", "SEA")]


NIKE_IMG = re.compile(r"https://static\.nike\.com/a/images/[^\"'\s\\]*?/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/([^\"'\s\\?]+)")


def nike_images(html, code=None):
    seen, out = set(), []
    for uid, name in NIKE_IMG.findall(html.replace("\\u002F", "/")):
        if uid in seen or not re.search(r"\.(png|jpe?g|webp)$", name, re.I):
            continue
        if code and code.lower() not in name.lower():
            continue
        seen.add(uid)
        base = "https://static.nike.com/a/images/{}/" + uid + "/" + name
        out.append((base.format("w_240,c_limit,f_png"), base.format("w_1200,c_limit,f_png")))
    return out


def nike_product(page, code):
    """Ảnh của đúng mã trên trang sản phẩm Nike (trang còn có ảnh các màu khác)."""
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', page, re.S)
    if not m:
        return []
    try:
        props = json.loads(m.group(1))["props"]["pageProps"]
    except Exception:
        return []
    for group in props.get("productGroups") or []:
        prod = (group.get("products") or {}).get(code)
        if prod:
            return nike_images(json.dumps(prod.get("contentImages") or []))
    return []


def nike(code):
    for reg in NIKE_REGIONS:
        pre = f"https://www.nike.com/{reg + '/' if reg else ''}"
        _, html = fetch_text(pre + "w?q=" + urllib.parse.quote(code))
        m = re.search(r'"url":"(https://www\.nike\.com/(?:[a-z]{2}/)?t/[^"]*/' + re.escape(code) + r')"', html)
        if m:
            _, page = fetch_text(m.group(1))
            found = nike_product(page, code)
            if found:
                return found
        time.sleep(0.3)
    for reg in ("sg", "my", ""):
        final, html = fetch_text(f"https://www.nike.com/{reg + '/' if reg else ''}launch/r/{code}")
        if final and "/launch/t/" in final:
            found = nike_images(html, code)
            if found:
                return found
    return []


EXACT = {"New Balance", "Asics", "Onitsuka Tiger", "Puma"}  # kho ảnh tra thẳng theo mã
SOURCES = {"New Balance": new_balance, "Asics": asics, "Onitsuka Tiger": asics, "Nike": nike, "Jordan": nike, "Puma": puma}


# ---------- So ảnh ----------

def thumb(im, size=48):
    """Ảnh nhỏ đã đưa về cùng khuôn (nền trắng, giày giữa khung) để so."""
    out, _ = ch.normalize(im)
    if out is None:
        return None
    return out.convert("RGB").resize((size, size), Image.BILINEAR)


def _shoe(im):
    return im.convert("L").point(lambda v: 255 if v < 236 else 0)


def similarity(a, b):
    """Độ giống của hai ảnh nhỏ cùng khuôn: trùng hình dáng, ít khác màu. Khoảng −1…1; ≥ 0,5 là cùng mẫu cùng màu."""
    ma, mb = _shoe(a), _shoe(b)
    both = ImageChops.lighter(ma, mb)
    if not ma.getbbox() or not mb.getbbox():
        return -1
    iou = ImageStat.Stat(ImageChops.multiply(ma, mb)).mean[0] / ImageStat.Stat(both).mean[0]
    diff = ImageStat.Stat(ImageChops.difference(a, b).convert("L"), both).mean[0]
    ca, cb = ImageStat.Stat(a, ma).mean, ImageStat.Stat(b, mb).mean
    color = sum(abs(x - y) for x, y in zip(ca, cb)) / 3
    return iou - diff / 100 - color / 60


def best_match(ref, t):
    """Ảnh hãng có thể chụp ngược chiều với ảnh cũ: so cả ảnh lật."""
    return max(similarity(ref, t), similarity(ref, ImageOps.mirror(t)))


def review_sheet(items, per_page=40, size=180):
    """Ảnh ghép cũ | mới cho chủ shop xem lại, mẫu ít giống ảnh cũ nhất lên đầu (mỗi trang 40 mẫu)."""
    items = sorted(items, key=lambda x: x[0])
    pages = [review_page(items[k:k + per_page], size, k // per_page + 1) for k in range(0, len(items), per_page)]
    return pages[0]


def review_page(items, size, no):
    from PIL import ImageDraw
    cols = 4
    rows = (len(items) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * size * 2, rows * (size + 18)), "white")
    d = ImageDraw.Draw(sheet)
    for k, (score, code, old, new) in enumerate(items):
        x, y = (k % cols) * size * 2, (k // cols) * (size + 18)
        for j, im in enumerate((Image.open(old), new)):
            t = ch.flatten(im)
            t.thumbnail((size - 6, size - 6))
            sheet.paste(t, (x + j * size + (size - t.width) // 2, y + 18 + (size - t.height) // 2))
        d.text((x + 4, y + 3), f"{code}  cu | moi", fill=(200, 0, 0))
    TRY_DIR.mkdir(parents=True, exist_ok=True)
    path = TRY_DIR / f"so-sanh-{datetime.date.today()}-{no}.jpg"
    sheet.save(path, "JPEG", quality=85)
    return path


# ---------- Chạy ----------

def load_products():
    text = (ROOT / "data" / "products.js").read_text(encoding="utf-8")
    m = re.search(r"=\s*(\[.*\])\s*;?\s*$", text, re.S)
    return json.loads(m.group(1))


def cover_name(code, files):
    return files.get(code) or files.get(code.upper())


def image_files():
    path = IMG_DIR / "danh-sach.js"
    m = re.search(r"window\.PRODUCT_IMAGES\s*=\s*(.*);\s*$", path.read_text(encoding="utf-8"), re.S)
    data = json.loads(m.group(1)) if m else {}
    return {k.upper(): v[0] for k, v in data.items() if v}


def original_side(name):
    for p in (ch.BACKUP / name, IMG_DIR / name):
        if p.exists():
            with Image.open(p) as im:
                return max(im.size)
    return 0


def read_skip():
    if not SKIP.exists():
        return set()
    return {ln.split("#")[0].strip().upper() for ln in SKIP.read_text(encoding="utf-8").splitlines()} - {""}


def restore(log):
    n = 0
    for code in read_skip():
        entry = log.get(code) or {}
        name = entry.get("file")
        old = OLD_DIR / name if name else None
        if old and old.exists():
            shutil.copy2(old, IMG_DIR / name)
            shutil.copy2(old, ch.BACKUP / name)
            entry["tra_lai"] = str(datetime.date.today())
            n += 1
    print(f"Đã trả lại ảnh cũ cho {n} mẫu. Chạy tiếp: python scripts/static_pages.py")


def apply(log):
    """Đưa ảnh đã tải thử (images/tai-ve/) lên web, trừ mẫu ghi trong scripts/anh-khong-tai.txt."""
    skip, n = read_skip(), 0
    for code, entry in log.items():
        name = entry.get("file")
        src = TRY_DIR / (name.rsplit(".", 1)[0] + ".png") if name and entry.get("thu") else None
        if not src or not src.exists() or code in skip:
            continue
        OLD_DIR.mkdir(parents=True, exist_ok=True)
        old = OLD_DIR / name
        if not old.exists():
            shutil.copy2(ch.BACKUP / name if (ch.BACKUP / name).exists() else IMG_DIR / name, old)
        with Image.open(src) as im:
            im.convert("RGB").save(IMG_DIR / name, "WEBP", quality=90, method=6)
        entry["url"] = entry.pop("thu")
        src.unlink()
        n += 1
    print(f"Đã thay ảnh bìa cho {n} mẫu. Chạy tiếp: python scripts/static_pages.py")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--so", type=int, default=0)
    ap.add_argument("--hang", default="")
    ap.add_argument("--ma", nargs="*", default=[])
    ap.add_argument("--thu", action="store_true")
    ap.add_argument("--tim-lai", action="store_true")
    ap.add_argument("--tra-lai", action="store_true")
    ap.add_argument("--ap-dung", action="store_true")
    args = ap.parse_args()

    log = json.loads(LOG.read_text(encoding="utf-8")) if LOG.exists() else {}
    if args.tra_lai or args.ap_dung:
        (restore if args.tra_lai else apply)(log)
        LOG.write_text(json.dumps(dict(sorted(log.items())), ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        return

    files = image_files()
    brands = {b.strip().lower() for b in args.hang.split(",") if b.strip()}
    wanted = {c.upper() for c in args.ma}
    skip = read_skip()
    todo = []
    for p in load_products():
        code = p["code"].upper()
        name = cover_name(code, files)
        src = SOURCES.get(p["brand"])
        if not name or not src or code in skip:
            continue
        if wanted and code not in wanted:
            continue
        if brands and p["brand"].lower() not in brands:
            continue
        done = log.get(code) or {}
        if not wanted and (done.get("url") or done.get("thu") or (done.get("khong_thay") and not args.tim_lai)):
            continue
        if not wanted and original_side(name) >= SMALL:
            continue
        todo.append((code, p, name, src))
    if args.so:
        todo = todo[: args.so]
    print(f"Tìm ảnh cho {len(todo)} mẫu…")

    got = 0
    review = []
    today = str(datetime.date.today())
    for i, (code, p, name, src) in enumerate(todo, 1):
        with Image.open(IMG_DIR / name) as cur:
            ref = cur.convert("RGB").resize((48, 48), Image.BILINEAR)
        cands = src(p["code"])
        exact = p["brand"] in EXACT
        best = (-9, None, None)
        for small, big in cands:
            im = fetch_image(small)
            t = thumb(im) if im is not None else None
            if t is None:
                continue
            s = best_match(ref, t)
            if exact:  # kho ảnh theo đúng mã: lấy góc nghiêng (ảnh đầu tiên có được), độ giống chỉ để ghi lại
                best = (s, small, big)
                break
            if s > best[0]:
                best = (s, small, big)
        score, _, big = best
        line = f"[{i}/{len(todo)}] {code}: "
        ok = big and (exact or score >= MIN_SCORE)
        full = fetch_image(big) if ok else None
        if full is None or max(full.size) < MIN_SIDE:
            log[code] = {"khong_thay": today}
            print(line + ("không tìm thấy" if not big else f"ảnh tìm được không giống ảnh cũ ({score:.2f}), bỏ qua"))
        else:
            flat = ch.flatten(full)
            flat.thumbnail((ch.MAX_SIDE * 2, ch.MAX_SIDE * 2))
            review.append((score, code, IMG_DIR / name, flat))
            if args.thu:
                TRY_DIR.mkdir(parents=True, exist_ok=True)
                flat.save(TRY_DIR / (name.rsplit(".", 1)[0] + ".png"), "PNG")
                log[code] = {"thu": big, "giong": round(score, 3), "ngay": today, "file": name}
            else:
                OLD_DIR.mkdir(parents=True, exist_ok=True)
                old = OLD_DIR / name
                if not old.exists():
                    shutil.copy2(ch.BACKUP / name if (ch.BACKUP / name).exists() else IMG_DIR / name, old)
                review[-1] = (score, code, old, flat)
                flat.save(IMG_DIR / name, "WEBP", quality=90, method=6)
                log[code] = {"url": big, "giong": round(score, 3), "ngay": today, "file": name}
            got += 1
            print(line + f"đã tải ({max(full.size)}px, giống {score:.2f})")
        if i % 10 == 0:
            LOG.write_text(json.dumps(dict(sorted(log.items())), ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    if True:
        LOG.write_text(json.dumps(dict(sorted(log.items())), ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    if review:
        sheet = review_sheet(review)
        print(f"Ảnh so sánh cũ / mới (ít giống nhất ở trên): {sheet.relative_to(ROOT)}")
    print(f"Xong: {got}/{len(todo)} mẫu có ảnh mới." + ("" if args.thu else " Chạy tiếp: python scripts/static_pages.py"))


if __name__ == "__main__":
    main()
