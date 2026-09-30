#!/usr/bin/env python3
"""Ghi danh sách ảnh sản phẩm -> images/products/danh-sach.js

Website đọc file này để biết mẫu nào đã có ảnh thật (xếp mẫu có ảnh lên trước, hiện ảnh thứ hai khi rê chuột,
biết trước số ảnh trong trang sản phẩm). Thiếu file hoặc file cũ vẫn chạy: website tự dò ảnh như trước.

Các công cụ nhập ảnh (anh.html, import_image_zip.py, extract_images.py) tự cập nhật file này.
Chạy tay khi cần: python scripts/image_manifest.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "images" / "products"
OUT = IMG_DIR / "danh-sach.js"
NAME_RE = re.compile(r"^(.+?)(?:-(\d{1,2}))?\.(webp|jpe?g|png|JPG)$")


def build():
    shots = {}
    for f in IMG_DIR.iterdir():
        m = NAME_RE.match(f.name)
        if not m or not f.is_file():
            continue
        stem, n = m.group(1), int(m.group(2) or 1)
        # Cùng số ảnh có nhiều đuôi: giữ WebP (nhẹ nhất)
        cur = shots.setdefault(stem, {}).get(n)
        if cur is None or f.name.endswith(".webp"):
            shots[stem][n] = f.name
    # Chỉ nhận bộ ảnh có ảnh chính (MÃ.webp), ảnh phụ liền số 2, 3, …
    out = {}
    for stem in sorted(shots):
        files, n = [], 1
        while n in shots[stem]:
            files.append(shots[stem][n])
            n += 1
        if files:
            out[stem] = files
    return out


def write():
    data = build()
    OUT.write_text(
        "// File tự sinh (anh.html / scripts/image_manifest.py) — danh sách ảnh sản phẩm đang có. Không cần sửa tay.\n"
        "window.PRODUCT_IMAGES = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    return data


if __name__ == "__main__":
    d = write()
    print("Đã ghi danh sách ảnh: %d mẫu, %d ảnh -> %s" % (len(d), sum(len(v) for v in d.values()), OUT.relative_to(ROOT)))
