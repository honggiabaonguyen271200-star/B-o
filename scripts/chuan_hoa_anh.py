#!/usr/bin/env python3
"""Đưa ảnh bìa (ảnh chính) của mọi mẫu về cùng một khuôn để danh sách giày nhìn đồng đều:

- ảnh vuông, nền trắng (nền xám nhạt / xám xanh của ảnh hãng được đưa về trắng; nền xám vừa chỉ làm
  trắng phần nền quanh giày để giày trắng không bị bạc);
- giày được cắt sát rồi đặt giữa ảnh, cùng một cỡ: rộng tối đa 86%, cao tối đa 68% khung;
- không phóng to ảnh nhỏ (giữ nét như ảnh gốc), ảnh lớn thu về tối đa 1200px.

Ảnh nền màu đậm / ảnh chụp ngoài trời: giữ nguyên nền, chỉ đưa về ảnh vuông cùng cỡ.
Chỉ xử lý ảnh bìa <MÃ>.webp (ảnh đầu tiên của mẫu trong danh-sach.js), ảnh phụ -2, -3… giữ nguyên.
Ảnh gốc được chép sang images/goc/ (không đưa lên GitHub) trước khi thay.
Ảnh đã chuẩn hoá được ghi vào scripts/anh-da-chuan-hoa.json để lần sau bỏ qua; thay ảnh mới
(cùng tên) thì lần chạy sau tự chuẩn hoá lại.

Tự chạy trong static_pages.py (xem-web.bat, sau khi cập nhật hàng / nhập ảnh). Chạy tay:
    python scripts/chuan_hoa_anh.py            # chỉ ảnh mới / ảnh vừa thay
    python scripts/chuan_hoa_anh.py --lam-lai  # làm lại tất cả từ ảnh gốc trong images/goc/ (nếu có)
Cần Pillow: pip install pillow
"""
import hashlib
import json
import math
import re
import shutil
import sys
from pathlib import Path

try:
    from PIL import Image, ImageChops, ImageFilter, ImageOps
except ImportError:
    Image = None

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "images" / "products"
BACKUP = ROOT / "images" / "goc"
RECORD = Path(__file__).resolve().parent / "anh-da-chuan-hoa.json"

BOX_W, BOX_H = 0.86, 0.68   # khung chứa giày trong ảnh vuông
MAX_SIDE = 1200
WHITE = (255, 255, 255)


def sha(path):
    return hashlib.sha1(path.read_bytes()).hexdigest()[:16]


def covers():
    """Tên file ảnh bìa của từng mẫu, theo images/products/danh-sach.js."""
    path = IMG_DIR / "danh-sach.js"
    if not path.exists():
        return []
    m = re.search(r"window\.PRODUCT_IMAGES\s*=\s*(.*);\s*$", path.read_text(encoding="utf-8"), re.S)
    data = json.loads(m.group(1)) if m else {}
    return [files[0] for files in data.values() if files]


def border_pixels(im):
    small = im.copy()
    small.thumbnail((240, 240))
    w, h = small.size
    b = max(2, round(min(w, h) * 0.02))
    px = []
    for box in ((0, 0, w, b), (0, h - b, w, h), (0, b, b, h - b), (w - b, b, w, h - b)):
        part = small.crop(box)
        px.extend(part.get_flattened_data() if hasattr(part, "get_flattened_data") else part.getdata())
    return px


def median(vals):
    vals = sorted(vals)
    return vals[len(vals) // 2]


def _span(counts, gap):
    """Khoảng chứa phần chính: bỏ các dải tách rời có rất ít điểm (đường kẻ viền, chấm, chữ nhỏ ở góc)."""
    runs, start, end, empty = [], None, 0, 0
    for i, c in enumerate(counts):
        if c:
            if start is None:
                start = i
            end, empty = i, 0
        elif start is not None:
            empty += 1
            if empty > gap:
                runs.append((start, end))
                start = None
    if start is not None:
        runs.append((start, end))
    if not runs:
        return None
    mass = [sum(counts[a:b + 1]) for a, b in runs]
    keep = [r for r, n in zip(runs, mass) if n >= 0.15 * max(mass)]
    return keep[0][0], keep[-1][1] + 1


def main_part(m):
    """Khung phần chính của mặt nạ (chiếu theo hàng rồi theo cột, 2 lượt)."""
    w, h = m.size
    data = m.tobytes()
    x0, x1, y0, y1 = 0, w, 0, h
    for _ in range(2):
        rows = [x1 - x0 - data[y * w + x0:y * w + x1].count(0) for y in range(h)]
        ys = _span(rows, max(1, h // 100))
        if not ys:
            return None
        y0, y1 = ys
        band = m.crop((0, y0, w, y1)).transpose(Image.Transpose.ROTATE_90 if hasattr(Image, "Transpose") else Image.ROTATE_90)
        bd, bh = band.tobytes(), y1 - y0
        cols = [bh - bd[i * bh:(i + 1) * bh].count(0) for i in range(w)][::-1]
        xs = _span(cols, max(1, w // 100))
        if not xs:
            return None
        x0, x1 = xs
    return x0, y0, x1, y1


def _mask_box(im, bg, thresh):
    diff = ImageChops.difference(im, Image.new("RGB", im.size, bg))
    r, g, b = diff.split()
    m = ImageChops.lighter(ImageChops.lighter(r, g), b).point(lambda v: 255 if v > thresh else 0)
    scale = 1
    if max(m.size) > 600:
        scale = max(m.size) / 600
        m = m.resize((round(m.width / scale), round(m.height / scale)), Image.BILINEAR).point(lambda v: 255 if v > 96 else 0)
    m = m.filter(ImageFilter.MedianFilter(5))  # bỏ chấm nhiễu
    box = main_part(m)
    if not box:
        return None
    x0, y0, x1, y1 = box
    return (max(0, math.floor(x0 * scale)), max(0, math.floor(y0 * scale)),
            min(im.width, math.ceil(x1 * scale)), min(im.height, math.ceil(y1 * scale)))


def content_box(im, bg):
    """Khung chứa giày. Ngưỡng rõ (30) bỏ qua bóng mờ; nếu giày màu rất nhạt (kem, trắng ngà) thì khung
    theo ngưỡng rõ chỉ bắt được đế → dùng ngưỡng nhạt (12) để không cắt mất thân giày."""
    core = _mask_box(im, bg, 30)
    light = _mask_box(im, bg, 12)
    if not core:
        return light
    if light:
        cw, ch = core[2] - core[0], core[3] - core[1]
        lw, lh = light[2] - light[0], light[3] - light[1]
        if ch < 0.75 * lh or cw < 0.75 * lw:
            return light
    return core


def region_white(im, bg, near=40, far=56, step=6):
    """Nền xám vừa (giày trắng dễ bị bạc nếu kéo sáng cả ảnh): chỉ làm trắng vùng nền nối liền với mép ảnh.
    Loang từ mép vào theo điểm ảnh liền kề gần màu nhau (nền loang dần vẫn theo được), dừng ở viền giày;
    bóng đổ nhạt dần thành trắng, không bị cắt cứng."""
    small = im
    if max(im.size) > 500:
        small = im.copy()
        small.thumbnail((500, 500))
    w, h = small.size
    px = small.load()
    dist = lambda p: max(abs(p[0] - bg[0]), abs(p[1] - bg[1]), abs(p[2] - bg[2]))
    seen = bytearray(w * h)
    stack = []
    for x in range(w):
        stack += [(x, 0), (x, h - 1)]
    for y in range(h):
        stack += [(0, y), (w - 1, y)]
    stack = [(x, y) for x, y in stack if dist(px[x, y]) <= near]
    for x, y in stack:
        seen[y * w + x] = 1
    while stack:
        x, y = stack.pop()
        p = px[x, y]
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                q = px[nx, ny]
                if dist(q) <= far and max(abs(q[0] - p[0]), abs(q[1] - p[1]), abs(q[2] - p[2])) <= step:
                    seen[ny * w + nx] = 1
                    stack.append((nx, ny))
    alpha = Image.new("L", (w, h), 0)
    ap = alpha.load()
    for y in range(h):
        for x in range(w):
            if seen[y * w + x]:
                d = dist(px[x, y])
                ap[x, y] = 255 if d <= near else max(0, round(255 * (far - d) / (far - near)))
    if alpha.size != im.size:
        alpha = alpha.resize(im.size, Image.BILINEAR)
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.8))
    return Image.composite(Image.new("RGB", im.size, WHITE), im, alpha)


def lighter_than_bg(im, bg):
    """Tỉ lệ điểm ảnh của giày sáng hơn nền (giày trắng / kem trên nền xám)."""
    small = im.copy()
    small.thumbnail((200, 200))
    lb = sum(bg) / 3
    hit = lit = 0
    for p in (small.get_flattened_data() if hasattr(small, "get_flattened_data") else small.getdata()):
        if max(abs(p[0] - bg[0]), abs(p[1] - bg[1]), abs(p[2] - bg[2])) > 10:
            hit += 1
            lit += sum(p) / 3 > lb + 4
    return lit / hit if hit else 0


def normalize(im):
    """Trả về (ảnh vuông đã chuẩn hoá, loại nền: 'trang' | 'mau')."""
    im = ImageOps.exif_transpose(im)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        flat = Image.new("RGB", im.size, WHITE)
        flat.paste(im, mask=im.split()[3])
        im = flat
    else:
        im = im.convert("RGB")

    px = border_pixels(im)
    bg = tuple(median([p[i] for p in px]) for i in range(3))
    close = sum(1 for p in px if max(abs(p[i] - bg[i]) for i in range(3)) <= 14) / len(px)
    neutral = max(bg) - min(bg) <= 12
    plain = close >= 0.5 and neutral and min(bg) >= 232
    grey = close >= 0.5 and neutral and 185 <= min(bg) < 232

    if plain and min(bg) < 252 and lighter_than_bg(im, bg) > 0.35:
        grey = True  # giày sáng hơn nền: kéo sáng cả ảnh sẽ làm mất giày → chỉ làm trắng phần nền

    if grey:
        im = region_white(im, bg)
        fill = WHITE
        plain = True
    elif plain:
        if min(bg) < 252:
            # Nền xám nhạt → trắng: kéo màu nền về 255 (giày sáng lên rất ít, tối đa ~10%)
            lut = []
            for c in bg:
                lut += [min(255, round(v * 255 / c)) for v in range(256)]
            im = im.point(lut)
            # Nền còn loang nhẹ quanh giày → trắng hẳn (chỉ phần nối liền mép ảnh, không đụng vào giày)
            im = region_white(im, WHITE, near=6, far=9, step=3)
        fill = WHITE
    else:
        fill = bg

    box = content_box(im, fill)
    if not box:
        return None, None
    shoe = im.crop(box)
    if fill == WHITE:
        # Ảnh gốc là ảnh nền xám dán lên nền trắng: phần quanh giày sau khi cắt vẫn còn ô xám → làm trắng nốt
        px = border_pixels(shoe)
        bg2 = tuple(median([p[i] for p in px]) for i in range(3))
        if 185 <= min(bg2) < 250 and max(bg2) - min(bg2) <= 12:
            shoe = region_white(shoe, bg2, near=14, far=26, step=4)
    bw, bh = shoe.size
    side = min(MAX_SIDE, math.ceil(max(bw / BOX_W, bh / BOX_H)))
    k = min(BOX_W * side / bw, BOX_H * side / bh, 1)
    if k < 1:
        shoe = shoe.resize((max(1, round(bw * k)), max(1, round(bh * k))), Image.LANCZOS)
    out = Image.new("RGB", (side, side), fill)
    out.paste(shoe, ((side - shoe.width) // 2, (side - shoe.height) // 2))
    return out, ("trang" if plain else "mau")


def run(redo=False, quiet=False):
    if Image is None:
        print("Bỏ qua chuẩn hoá ảnh bìa: chưa cài Pillow (pip install pillow)")
        return 0
    record = json.loads(RECORD.read_text(encoding="utf-8")) if RECORD.exists() else {}
    done = kinds_mau = 0
    for name in covers():
        path = IMG_DIR / name
        if not path.exists():
            continue
        backup = BACKUP / name
        if redo and backup.exists():
            src = backup
        elif record.get(name) == sha(path):
            continue
        else:
            src = path
        try:
            with Image.open(src) as im:
                out, kind = normalize(im)
        except Exception as e:  # ảnh hỏng: để nguyên
            print(f"  Không đọc được {name}: {e}")
            continue
        if out is None:
            continue
        if src == path:
            BACKUP.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, backup)
        fmt = {"webp": "WEBP", "jpg": "JPEG", "jpeg": "JPEG", "png": "PNG"}.get(name.rsplit(".", 1)[-1].lower(), "WEBP")
        opts = {"WEBP": {"quality": 86, "method": 6}, "JPEG": {"quality": 88, "optimize": True}, "PNG": {"optimize": True}}[fmt]
        out.save(path, fmt, **opts)
        record[name] = sha(path)
        done += 1
        kinds_mau += kind == "mau"
    if done or not RECORD.exists():
        RECORD.write_text(json.dumps(dict(sorted(record.items())), ensure_ascii=False, indent=0) + "\n", encoding="utf-8")
    if done and not quiet:
        print(f"Chuẩn hoá ảnh bìa: {done} ảnh" + (f" ({kinds_mau} ảnh nền màu giữ nguyên nền)" if kinds_mau else ""))
    return done


if __name__ == "__main__":
    run(redo="--lam-lai" in sys.argv)
