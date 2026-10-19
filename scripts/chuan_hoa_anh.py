#!/usr/bin/env python3
"""Đưa ảnh bìa (ảnh chính) của mọi mẫu về cùng một khuôn để danh sách giày nhìn đồng đều:

- ảnh vuông, nền trắng (nền xám nhạt / xám xanh của ảnh hãng được đưa về trắng; nền xám vừa chỉ làm
  trắng phần nền quanh giày để giày trắng không bị bạc);
- giày được cắt sát rồi đặt giữa ảnh, cùng một cỡ: rộng tối đa 86%, cao tối đa 68% khung;
- không phóng to ảnh nhỏ (giữ nét như ảnh gốc), ảnh lớn thu về tối đa 1200px.

Ảnh nền màu đậm / ảnh chụp ngoài trời: giữ nguyên nền, chỉ đưa về ảnh vuông cùng cỡ. Mẫu nào làm trắng tự động
không đẹp: ghi mã vào scripts/anh-giu-nen.txt (mỗi dòng một mã) rồi chạy --lam-lai.
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
    from PIL import Image, ImageChops, ImageFilter, ImageOps, ImageStat
except ImportError:
    Image = None

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "images" / "products"
BACKUP = ROOT / "images" / "goc"
RECORD = Path(__file__).resolve().parent / "anh-da-chuan-hoa.json"
KEEP = Path(__file__).resolve().parent / "anh-giu-nen.txt"  # mã mẫu giữ nguyên nền (làm trắng tự động không đẹp)

BOX_W, BOX_H = 0.86, 0.68   # khung chứa giày trong ảnh vuông
EDGE = 3                    # giày cách mép ảnh gốc ≤ 3px: coi như bị cắt sẵn
MAX_SIDE = 1200
SMALL_SRC = 800             # ảnh gốc nhỏ hơn (ảnh chèn trong bảng hàng): làm rõ giày sáng màu (lift_white)
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
        # thu nhỏ kiểu "có là giữ": đường viền mảnh (đế trắng, dây giày) không bị mất
        m = m.resize((round(m.width / scale), round(m.height / scale)), Image.BOX).point(lambda v: 255 if v > 8 else 0)
    # Không lọc nhiễu kiểu trung vị: nó xoá luôn đường viền mảnh của giày trắng (đáy đế, mép cổ giày).
    # Chấm nhiễu, đường kẻ viền, chữ tách rời do main_part bỏ đi (tách khỏi giày bằng khoảng trống, ít điểm).
    box = main_part(m)
    if not box:
        return None
    x0, y0, x1, y1 = box
    return (max(0, math.floor(x0 * scale)), max(0, math.floor(y0 * scale)),
            min(im.width, math.ceil(x1 * scale)), min(im.height, math.ceil(y1 * scale)))


def content_box(im, bg):
    """Khung chứa giày, tính cả chỗ rất nhạt (dây giày, cổ giày trắng trên nền trắng) để không cắt mất phần nào;
    chấm nhiễu, đường kẻ viền, chữ nhỏ tách rời được bỏ qua (main_part)."""
    return _mask_box(im, bg, 10) or _mask_box(im, bg, 30)


def region_white(im, bg, near=40, far=56, step=6, model=None):
    """Nền xám vừa (giày trắng dễ bị bạc nếu kéo sáng cả ảnh): chỉ làm trắng vùng nền nối liền với mép ảnh.
    Loang từ mép vào theo điểm ảnh liền kề gần màu nhau (nền loang dần vẫn theo được), dừng ở viền giày;
    bóng đổ nhạt dần thành trắng, không bị cắt cứng."""
    small = im
    if max(im.size) > 500:
        small = im.copy()
        small.thumbnail((500, 500))
    w, h = small.size
    px = small.load()
    if model is not None:
        mp = model.resize((w, h), Image.BILINEAR).load()
        dist = None
    else:
        dist = lambda p: max(abs(p[0] - bg[0]), abs(p[1] - bg[1]), abs(p[2] - bg[2]))  # noqa: E731

    def far_from(x, y):
        p = px[x, y]
        if dist:
            return dist(p)
        q = mp[x, y]
        return max(abs(p[0] - q[0]), abs(p[1] - q[1]), abs(p[2] - q[2]))
    seen = bytearray(w * h)
    stack = []
    for x in range(w):
        stack += [(x, 0), (x, h - 1)]
    for y in range(h):
        stack += [(0, y), (w - 1, y)]
    stack = [(x, y) for x, y in stack if far_from(x, y) <= near]
    for x, y in stack:
        seen[y * w + x] = 1
    while stack:
        x, y = stack.pop()
        p = px[x, y]
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                q = px[nx, ny]
                if far_from(nx, ny) <= far and max(abs(q[0] - p[0]), abs(q[1] - p[1]), abs(q[2] - p[2])) <= step:
                    seen[ny * w + nx] = 1
                    stack.append((nx, ny))
    alpha = Image.new("L", (w, h), 0)
    ap = alpha.load()
    for y in range(h):
        for x in range(w):
            if seen[y * w + x]:
                d = far_from(x, y)
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


def bg_model(im, bg, size=96):
    """Màu nền ước theo từng vị trí (nền chụp thường sáng tối dần từ trên xuống / từ giữa ra): nội suy từ 4 mép ảnh,
    bỏ qua chỗ giày chạm mép."""
    small = im.copy()
    small.thumbnail((size, size))
    w, h = small.size
    px = small.load()
    # Ngưỡng "là nền" theo độ loang thật của nền: nền đều (trắng, xám phẳng) thì chặt, để chỗ giày chạm mép ảnh
    # (kể cả giày kem, trắng ngà) không bị tính là nền; nền loang dần thì nới ra
    ring = [px[x, 0] for x in range(w)] + [px[x, h - 1] for x in range(w)] + [px[0, y] for y in range(h)] + [px[w - 1, y] for y in range(h)]
    dists = sorted(max(abs(c[i] - bg[i]) for i in range(3)) for c in ring)
    tol = max(6, min(30, dists[int(len(dists) * 0.6)] * 1.5 + 4))

    def clean(seq):
        ok = [max(abs(c[i] - bg[i]) for i in range(3)) <= tol for c in seq]
        if not any(ok):
            return [bg] * len(seq)
        out = list(seq)
        idx = [i for i, k in enumerate(ok) if k]
        for i in range(len(seq)):
            if not ok[i]:
                a = max([j for j in idx if j < i], default=None)
                b = min([j for j in idx if j > i], default=None)
                if a is None or b is None:
                    out[i] = seq[a if b is None else b]
                else:
                    t = (i - a) / (b - a)
                    out[i] = tuple(seq[a][c] * (1 - t) + seq[b][c] * t for c in range(3))
        r = 2  # làm mượt
        return [tuple(sum(out[j][c] for j in range(max(0, i - r), min(len(out), i + r + 1))) / (min(len(out), i + r + 1) - max(0, i - r)) for c in range(3)) for i in range(len(out))]

    top = clean([px[x, 0] for x in range(w)])
    bottom = clean([px[x, h - 1] for x in range(w)])
    left = clean([px[0, y] for y in range(h)])
    right = clean([px[w - 1, y] for y in range(h)])
    model = Image.new("RGB", (w, h))
    mp = model.load()
    for y in range(h):
        v = y / (h - 1) if h > 1 else 0
        for x in range(w):
            u = x / (w - 1) if w > 1 else 0
            mp[x, y] = tuple(max(1, min(255, round(
                (1 - v) * top[x][c] + v * bottom[x][c] + (1 - u) * left[y][c] + u * right[y][c]
                - ((1 - u) * (1 - v) * top[0][c] + u * (1 - v) * top[-1][c] + (1 - u) * v * bottom[0][c] + u * v * bottom[-1][c]))))
                for c in range(3))
    return model


def divide(im, model):
    """Làm sáng theo nền: mỗi điểm ảnh nhân 255 / màu nền tại chỗ đó — nền thành trắng, giày giữ nguyên độ tương phản."""
    big = model.resize(im.size, Image.BILINEAR)
    bands = []
    for a, b in zip(im.split(), big.split()):
        out = bytes(min(255, x * 255 // y) for x, y in zip(a.tobytes(), b.tobytes()))
        bands.append(Image.frombytes("L", a.size, out))
    return Image.merge("RGB", bands)


def flatten(im):
    im = ImageOps.exif_transpose(im)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        flat = Image.new("RGB", im.size, WHITE)
        flat.paste(im, mask=im.split()[3])
        return flat
    return im.convert("RGB")


def whiten(im):
    """Đưa nền về trắng. Trả về (ảnh, màu nền cuối, cách làm: 'trang' | 'keo' | 'vung' | 'mau').
    - 'keo': giày tối hơn hoặc gần màu nền → làm sáng toàn ảnh theo màu nền từng chỗ (không mất chi tiết giày);
    - 'vung': giày sáng hơn nền (giày trắng trên nền xám) → chỉ làm trắng phần nền nối liền mép ảnh, ngưỡng chặt."""
    px = border_pixels(im)
    bg = tuple(median([p[i] for p in px]) for i in range(3))
    close = sum(1 for p in px if max(abs(p[i] - bg[i]) for i in range(3)) <= 14) / len(px)
    neutral = max(bg) - min(bg) <= 12
    if close < 0.5 or not neutral or min(bg) < 185:
        return im, bg, "mau"
    if min(bg) >= 252 and all(min(p) >= 250 for p in px):
        return im, WHITE, "trang"  # nền trắng sạch quanh mép: giữ nguyên
    model = bg_model(im, bg)
    if min(min(p) for p in (model.get_flattened_data() if hasattr(model, "get_flattened_data") else model.getdata())) >= 250:
        return im, WHITE, "trang"  # nền thực chất đã trắng đều (giày chạm mép ảnh): giữ nguyên
    if lighter_than_bg(im, bg) <= 0.35:
        # Nền còn loang nhẹ quanh giày → trắng hẳn (chỉ phần nối liền mép ảnh, không đụng vào giày)
        out, how = region_white(divide(im, model), WHITE, near=6, far=9, step=3), "keo"
    else:
        out, how = region_white(im, bg, near=10, far=22, step=4, model=model), "vung"
    # Nền có vân (giấy, vải, ảnh chụp ngoài): làm trắng không sạch, loang lổ → giữ nguyên nền.
    # Chỉ xét những điểm ở mép vốn là nền (chỗ giày chạm mép ảnh không tính).
    was_bg = [max(abs(p[i] - bg[i]) for i in range(3)) <= 14 for p in px]
    after = border_pixels(out)
    left = sum(1 for k, p in zip(was_bg, after) if k and min(p) < 245) / max(1, sum(was_bg))
    if left > 0.12:
        return im, bg, "mau"
    return out, WHITE, how


def stop_at_gap(im, fill, box, crop):
    """Phần lề quanh khung giày: giữ chi tiết dính liền với giày (dây, quai thò ra), nhưng dừng trước thứ nằm tách
    riêng sau một khoảng trống (logo, chữ của ảnh gốc) để không còn mẩu vụn của chúng ở mép ảnh."""
    diff = ImageChops.difference(im, Image.new("RGB", im.size, fill))
    r, g, b = diff.split()
    m = ImageChops.lighter(ImageChops.lighter(r, g), b).point(lambda v: 255 if v > 10 else 0)
    x0, y0, x1, y1 = box
    c0, r0, c1, r1 = crop
    gap = max(3, round(0.03 * max(x1 - x0, y1 - y0)))

    def scan(lines):
        empty = None
        for i, strip in enumerate(lines):
            if m.crop(strip).getbbox():
                if empty is not None and i - empty >= gap:
                    return empty + gap // 2
            elif empty is None:
                empty = i
            continue
        return None

    t = scan([(x0, y, x1, y + 1) for y in range(y0 - 1, r0 - 1, -1)])
    if t is not None:
        r0 = y0 - t
    t = scan([(x0, y, x1, y + 1) for y in range(y1, r1)])
    if t is not None:
        r1 = y1 + t
    t = scan([(x, y0, x + 1, y1) for x in range(x0 - 1, c0 - 1, -1)])
    if t is not None:
        c0 = x0 - t
    t = scan([(x, y0, x + 1, y1) for x in range(x1, c1)])
    if t is not None:
        c1 = x1 + t
    return c0, r0, c1, r1


def feather(size, sides):
    """Mặt nạ mờ dần ở các mép có lề (mép vùng cắt nằm trong ảnh), để chỗ cắt hoà vào nền, không thành đường kẻ.
    sides = độ rộng lề trái, trên, phải, dưới (0 = mép ảnh gốc, không làm mờ)."""
    w, h = size
    left, top, right, bottom = sides

    def ramp(n, a, b):
        out = []
        for i in range(n):
            v = 1.0
            if a:
                v = min(v, (i + 0.5) / a)
            if b:
                v = min(v, (n - i - 0.5) / b)
            out.append(max(0, min(255, round(255 * v))))
        return out
    hx = Image.new("L", (w, 1))
    hx.putdata(ramp(w, left, right))
    vy = Image.new("L", (1, h))
    vy.putdata(ramp(h, top, bottom))
    return ImageChops.darker(hx.resize((w, h), Image.NEAREST), vy.resize((w, h), Image.NEAREST))


def unframe(im):
    """Ảnh chụp nền xám dán lên khung trắng (ô xám có mép cứng): bỏ khung trắng để phần nền xám được làm trắng đều."""
    diff = ImageChops.difference(im, Image.new("RGB", im.size, WHITE))
    r, g, b = diff.split()
    m = ImageChops.lighter(ImageChops.lighter(r, g), b).point(lambda v: 255 if v > 6 else 0).filter(ImageFilter.MedianFilter(5))
    box = m.getbbox()
    if not box or box == (0, 0) + im.size:
        return im
    inner = im.crop(box)
    if inner.width * inner.height < 0.3 * im.width * im.height:
        return im
    px = border_pixels(inner)
    bg = tuple(median([p[i] for p in px]) for i in range(3))
    close = sum(1 for p in px if max(abs(p[i] - bg[i]) for i in range(3)) <= 10) / len(px)
    if close >= 0.8 and max(bg) - min(bg) <= 12 and 185 <= min(bg) <= 250:
        return inner
    return im


def normalize(im, keep_bg=False):
    """Trả về (ảnh vuông đã chuẩn hoá, loại nền: 'trang' | 'mau')."""
    im = flatten(im)
    if keep_bg:
        px = border_pixels(im)
        fill, how = tuple(median([p[i] for p in px]) for i in range(3)), "mau"
    else:
        im = unframe(im)
        im, fill, how = whiten(im)
    box = content_box(im, fill)
    if not box:
        return None, None
    if fill == WHITE and not keep_bg:
        # Ảnh nền xám dán lên nền trắng: phần quanh giày trong khung vẫn còn ô xám → làm trắng nốt rồi đo lại khung
        sub, _, how2 = whiten(im.crop(box))
        if how2 in ("keo", "vung"):
            im = im.copy()
            im.paste(sub, box[:2])
            box = content_box(im, fill) or box
    x0, y0, x1, y1 = box
    bw, bh = x1 - x0, y1 - y0
    # Cắt có chừa lề quanh giày; mép vùng cắt mờ dần về màu nền
    pad = max(3, round(0.05 * max(bw, bh)))
    c0, r0, c1, r1 = max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)
    c0, r0, c1, r1 = stop_at_gap(im, fill, box, (c0, r0, c1, r1))
    part = im.crop((c0, r0, c1, r1))
    mask = feather(part.size, (x0 - c0 if c0 > 0 else 0, y0 - r0 if r0 > 0 else 0,
                               c1 - x1 if c1 < im.width else 0, r1 - y1 if r1 < im.height else 0))
    # Giày bị cắt cả mũi lẫn gót trong ảnh gốc (chạm cả hai mép): cho giày rộng hết khung như ảnh chụp cận
    # (chủ shop báo 19/10: Air Force 1 mất mũi, gót). Chỉ chạm một mép: vẫn đặt giữa (chủ shop muốn giày luôn ở giữa)
    cut_l, cut_r = (x0 <= EDGE, x1 >= im.width - EDGE) if how != "mau" else (False, False)
    box_w = 1.0 if cut_l and cut_r else BOX_W
    side = min(MAX_SIDE, math.ceil(max(bw / box_w, bh / BOX_H)))
    k = min(box_w * side / bw, BOX_H * side / bh, 1)
    if k < 1:
        size = (max(1, round(part.width * k)), max(1, round(part.height * k)))
        part, mask = part.resize(size, Image.LANCZOS), mask.resize(size, Image.BILINEAR)
    out = Image.new("RGB", (side, side), fill)
    # Đặt tâm khung giày vào giữa ảnh
    ox = round(side / 2 - ((x0 + x1) / 2 - c0) * k)
    oy = round(side / 2 - ((y0 + y1) / 2 - r0) * k)
    out.paste(part, (ox, oy), mask)
    return out, ("trang" if how != "mau" else "mau")


def lift_white(out):
    """Giày trắng / màu sáng trong ảnh nhỏ của bảng hàng bị bạc, khó thấy đường may (chủ shop báo 19/10):
    kéo tông sáng xuống một chút (nền trắng 255 giữ nguyên), làm nét nhẹ. Giày càng sáng kéo càng nhiều."""
    g = out.convert("L")
    shoe = g.point(lambda v: 255 if v < 246 else 0)
    if not shoe.getbbox():
        return out
    light = ImageStat.Stat(g, shoe).mean[0]
    t = min(1.0, max(0.0, (light - 175) / 35))
    if t <= 0:
        return out
    gamma = 1 + 0.6 * t
    lut = [round(255 * (v / 255) ** gamma) for v in range(256)]
    return out.point(lut * 3).filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))


def run(redo=False, quiet=False):
    if Image is None:
        print("Bỏ qua chuẩn hoá ảnh bìa: chưa cài Pillow (pip install pillow)")
        return 0
    record = json.loads(RECORD.read_text(encoding="utf-8")) if RECORD.exists() else {}
    keep = set()
    if KEEP.exists():
        keep = {ln.split("#")[0].strip().upper() for ln in KEEP.read_text(encoding="utf-8").splitlines()} - {""}
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
                out, kind = normalize(im, keep_bg=name.rsplit(".", 1)[0].upper() in keep)
        except Exception as e:  # ảnh hỏng: để nguyên
            print(f"  Không đọc được {name}: {e}")
            continue
        if out is None:
            continue
        if kind == "trang" and max(Image.open(src).size) < SMALL_SRC:
            out = lift_white(out)
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
