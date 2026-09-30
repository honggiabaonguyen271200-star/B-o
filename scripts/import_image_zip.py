#!/usr/bin/env python3
"""Nhập ảnh hàng loạt từ một file zip lớn -> images/products/<MÃ>.webp, <MÃ>-2.webp …

Cách dùng:
    python3 scripts/import_image_zip.py anh-giay.zip            # chỉ thêm cho mẫu chưa có ảnh
    python3 scripts/import_image_zip.py anh-giay.zip --ghi-de   # thay bộ ảnh cũ bằng bộ mới

Trong file zip lớn, mỗi mẫu giày là MỘT file zip nhỏ (hoặc một thư mục), đặt tên theo mã sản phẩm:
    anh-giay.zip
    ├── U204L9FU.zip        (VD file Canva tải về: 1.jpg, 2.jpg … 10.jpg)
    ├── 1183C102-001.zip
    └── Samba OG White Gum/ (mẫu không có mã: đặt đúng tên như trong Google Sheet)
Tên có thể là mã, hoặc nguyên dòng tên trong Google Sheet (chứa mã là được).
Ảnh trong mỗi mẫu được xếp theo tên file (1, 2, … 10): ảnh đầu tiên là ảnh chính.
"""
import io
import json
import re
import sys
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_products as bp  # noqa: E402
import image_manifest  # noqa: E402
from extract_images import MAX_SHOTS, to_webp  # noqa: E402

IMG_RE = re.compile(r"\.(jpe?g|png|webp)$", re.I)


def load_products():
    text = (bp.ROOT / "data" / "products.js").read_text(encoding="utf-8")
    return json.loads(text[text.index("["): text.rindex("]") + 1])


def natural_key(name):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", name)]


def junk(name):
    return "__MACOSX" in name or Path(name).name.startswith(".")


def collect(zf, prefix=""):
    """{tên mẫu: [(tên file, bytes ảnh)…]} từ zip lớn (zip con hoặc thư mục con)."""
    groups = {}
    for info in zf.infolist():
        name = info.filename
        if info.is_dir() or junk(name):
            continue
        parts = [p for p in name.split("/") if p]
        if name.lower().endswith(".zip"):
            key = Path(parts[-1]).stem
            with zipfile.ZipFile(io.BytesIO(zf.read(info))) as inner:
                for sub in inner.infolist():
                    if not sub.is_dir() and IMG_RE.search(sub.filename) and not junk(sub.filename):
                        groups.setdefault(key, []).append((sub.filename, inner.read(sub)))
        elif IMG_RE.search(name):
            # Ảnh nằm trong thư mục con: thư mục gần nhất là tên mẫu
            key = parts[-2] if len(parts) >= 2 else Path(parts[-1]).stem
            groups.setdefault(key, []).append((name, zf.read(info)))
    return groups


def matcher(products):
    by_code = {p["code"].upper(): p for p in products if p.get("code")}
    by_slug = {}
    for p in products:
        by_slug[p["id"]] = p
        by_slug.setdefault(bp.slugify(p["name"]), p)
        if p.get("code"):
            by_slug.setdefault(bp.slugify(p["name"] + " " + p["code"]), p)

    def match(label):
        text = bp.clean(label).replace("_", " ")
        if text.upper() in by_code:
            return by_code[text.upper()]
        code = bp.find_code(text)
        if code and code in by_code:
            return by_code[code]
        slug = bp.slugify(re.sub(r"^gi[aà]y\s+", "", text, flags=re.I))
        return by_slug.get(slug) or by_slug.get(bp.slugify(text))

    return match


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    overwrite = "--ghi-de" in sys.argv
    if not args:
        sys.exit(__doc__)
    try:
        import PIL  # noqa: F401
    except ImportError:
        sys.exit("Cần cài Pillow: pip install pillow")

    match = matcher(load_products())
    with zipfile.ZipFile(args[0]) as zf:
        groups = collect(zf)

    bp.IMG_DIR.mkdir(parents=True, exist_ok=True)
    done, skipped, unmatched, total = [], [], [], 0
    for label in sorted(groups, key=natural_key):
        p = match(label)
        if not p:
            unmatched.append(label)
            continue
        stem = p.get("code") or p["id"]
        existing = [f for f in bp.IMG_DIR.iterdir() if re.fullmatch(re.escape(stem) + r"(-\d+)?\.(webp|jpe?g|png|JPG)", f.name)]
        if existing and not overwrite:
            skipped.append(stem)
            continue
        for f in existing:  # --ghi-de: bỏ bộ ảnh cũ để không lẫn ảnh thừa
            f.unlink()
        files = sorted(groups[label], key=lambda x: natural_key(Path(x[0]).name))[:MAX_SHOTS]
        for i, (_, data) in enumerate(files):
            name = stem if i == 0 else "%s-%d" % (stem, i + 1)
            (bp.IMG_DIR / (name + ".webp")).write_bytes(to_webp(data))
            total += 1
        done.append("%s (%d ảnh)" % (stem, len(files)))

    image_manifest.write()  # cập nhật danh sách ảnh cho website
    print("Đã nhập %d ảnh cho %d mẫu:" % (total, len(done)))
    for d in done:
        print("  ✓ " + d)
    if skipped:
        print("Bỏ qua %d mẫu đã có ảnh (thêm --ghi-de để thay): %s" % (len(skipped), ", ".join(skipped)))
    if unmatched:
        print("KHÔNG khớp với mẫu nào trong bảng hàng (%d) — kiểm tra lại tên:" % len(unmatched))
        for u in unmatched:
            print("  ✗ " + u)


if __name__ == "__main__":
    main()
