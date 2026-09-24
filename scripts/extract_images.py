#!/usr/bin/env python3
"""Lấy ảnh sản phẩm có sẵn trong bảng hàng Google Sheet (.xlsx) -> images/products/<MÃ>.webp

Cách dùng:
    python3 scripts/extract_images.py bang-hang.xlsx            # chỉ thêm ảnh cho mẫu chưa có ảnh
    python3 scripts/extract_images.py bang-hang.xlsx --ghi-de   # thay luôn ảnh đã có

Đọc được 3 kiểu chèn ảnh của Google Sheet:
  - Ảnh đặt trên ô (Chèn > Hình ảnh > Hình ảnh trên các ô)
  - Ảnh nằm trong ô (Chèn > Hình ảnh > Hình ảnh trong ô)
  - Công thức =IMAGE("https://...")
Ảnh được gán cho sản phẩm cùng dòng; dòng có nhiều ảnh -> MÃ.webp, MÃ-2.webp … MÃ-12.webp
Ảnh được thu nhỏ (cạnh dài tối đa 1200px) và lưu WebP (nhẹ hơn JPG ~40%) để web tải nhanh.
"""
import io
import posixpath
import re
import sys
import urllib.request
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_products as bp  # noqa: E402

MAX_SIDE = 1200
QUALITY = 80
MAX_SHOTS = 12  # tối đa ảnh mỗi mẫu: MÃ, MÃ-2 … MÃ-12 (khớp với assets/js/app.js)


def local(tag):
    return tag.rsplit("}", 1)[-1]


def attr(el, name):
    """Lấy thuộc tính bất kể namespace (VD r:embed, r:id)."""
    for k, v in el.attrib.items():
        if local(k) == name:
            return v
    return None


def read_xml(z, path):
    try:
        return ET.fromstring(z.read(path))
    except KeyError:
        return None


def rels_of(z, path):
    """{rId: đường dẫn tuyệt đối trong file zip} cho một phần của xlsx."""
    folder, name = posixpath.split(path)
    root = read_xml(z, posixpath.join(folder, "_rels", name + ".rels"))
    out = {}
    if root is None:
        return out
    for rel in root:
        target = rel.get("Target", "")
        if rel.get("TargetMode") == "External":
            continue
        full = posixpath.normpath(target.lstrip("/")) if target.startswith("/") else posixpath.normpath(posixpath.join(folder, target))
        out[rel.get("Id")] = full
    return out


def cell_row_col(ref):
    m = re.match(r"([A-Z]+)(\d+)", ref or "")
    if not m:
        return None, None
    col = 0
    for ch in m.group(1):
        col = col * 26 + ord(ch) - 64
    return int(m.group(2)), col - 1


def sheet_paths(z):
    wb = read_xml(z, "xl/workbook.xml")
    rels = rels_of(z, "xl/workbook.xml")
    out = []
    for el in wb.iter():
        if local(el.tag) == "sheet":
            path = rels.get(attr(el, "id"))
            if path:
                out.append((el.get("name"), path))
    return out


def drawing_images(z, sheet_path):
    """Ảnh đặt trên ô: (dòng, cột, đường dẫn ảnh trong zip)."""
    for rid, drawing in rels_of(z, sheet_path).items():
        if "/drawings/" not in drawing or not drawing.endswith(".xml"):
            continue
        root = read_xml(z, drawing)
        if root is None:
            continue
        drels = rels_of(z, drawing)
        for anchor in root:
            if local(anchor.tag) not in ("twoCellAnchor", "oneCellAnchor"):
                continue
            row = col = None
            for el in anchor:
                if local(el.tag) == "from":
                    for sub in el:
                        if local(sub.tag) == "row":
                            row = int(sub.text) + 1
                        elif local(sub.tag) == "col":
                            col = int(sub.text)
            for el in anchor.iter():
                if local(el.tag) == "blip":
                    media = drels.get(attr(el, "embed"))
                    if media and row:
                        yield row, col, media


def richdata_map(z):
    """vm (chỉ số trong ô) -> đường dẫn ảnh, cho ảnh nằm trong ô."""
    meta = read_xml(z, "xl/metadata.xml")
    values = read_xml(z, "xl/richData/rdrichvalue.xml")
    relroot = read_xml(z, "xl/richData/richValueRel.xml")
    if meta is None or values is None or relroot is None:
        return {}
    # vm -> chỉ số futureMetadata -> chỉ số rich value
    future = []
    for fm in meta:
        if local(fm.tag) == "futureMetadata" and fm.get("name") == "XLRICHVALUE":
            for bk in fm:
                if local(bk.tag) != "bk":
                    continue
                rvb = next((e for e in bk.iter() if local(e.tag) == "rvb"), None)
                future.append(int(rvb.get("i")) if rvb is not None else None)
    value_meta = []
    for vmeta in meta:
        if local(vmeta.tag) == "valueMetadata":
            for bk in vmeta:
                rc = next((e for e in bk if local(e.tag) == "rc"), None)
                value_meta.append(int(rc.get("v")) if rc is not None else None)
    # Vị trí khoá ảnh trong từng cấu trúc
    key_pos = {}
    structs = read_xml(z, "xl/richData/rdrichvaluestructure.xml")
    if structs is not None:
        for i, st in enumerate(e for e in structs if local(e.tag) == "s"):
            keys = [k.get("n") for k in st if local(k.tag) == "k"]
            key_pos[i] = keys.index("_rvRel:LocalImageIdentifier") if "_rvRel:LocalImageIdentifier" in keys else 0
    rich = []
    for rv in values:
        if local(rv.tag) != "rv":
            continue
        vs = [v.text for v in rv if local(v.tag) == "v"]
        pos = key_pos.get(int(rv.get("s", 0)), 0)
        rich.append(int(vs[pos]) if len(vs) > pos and (vs[pos] or "").isdigit() else None)
    rel_ids = [attr(r, "id") for r in relroot if local(r.tag) == "rel"]
    targets = rels_of(z, "xl/richData/richValueRel.xml")
    out = {}
    for vm, fut in enumerate(value_meta, start=1):
        try:
            rv_index = future[fut] if future else fut
            media = targets.get(rel_ids[rich[rv_index]])
        except (IndexError, TypeError):
            continue
        if media:
            out[vm] = media
    return out


def cell_images(z, sheet_path, rich):
    """Ảnh nằm trong ô (vm=…) và công thức =IMAGE("url")."""
    root = read_xml(z, sheet_path)
    if root is None:
        return
    for c in root.iter():
        if local(c.tag) != "c":
            continue
        row, col = cell_row_col(c.get("r"))
        if row is None:
            continue
        vm = c.get("vm")
        if vm and int(vm) in rich:
            yield row, col, rich[int(vm)]
            continue
        f = next((e for e in c if local(e.tag) == "f"), None)
        if f is not None and f.text:
            m = re.search(r'IMAGE\(\s*"([^"]+)"', f.text, re.I)
            if m:
                yield row, col, m.group(1)


def load_bytes(z, src):
    if src.startswith("http"):
        req = urllib.request.Request(src, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.read()
    return z.read(src)


def to_webp(data):
    from PIL import Image
    im = Image.open(io.BytesIO(data))
    im.load()
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        im = bg
    else:
        im = im.convert("RGB")
    im.thumbnail((MAX_SIDE, MAX_SIDE))
    out = io.BytesIO()
    im.save(out, "WEBP", quality=QUALITY, method=6)
    return out.getvalue()


def existing(stem):
    return any((bp.IMG_DIR / (stem + ext)).exists() for ext in (".jpg", ".jpeg", ".png", ".webp", ".JPG"))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    overwrite = "--ghi-de" in sys.argv
    if not args:
        sys.exit(__doc__)
    try:
        import PIL  # noqa: F401
    except ImportError:
        sys.exit("Cần cài Pillow: pip install pillow")
    src = args[0]

    # Sản phẩm theo (trang tính, dòng) — dùng đúng cách đọc bảng của build_products.py
    by_row, filled = {}, set()
    for idx, table in enumerate(bp.rows_from_xlsx(src)):
        filled.update((r.get("sheet"), r.get("row")) for r in table if any(r["cells"][:1]))
        for p in bp.parse_table(table, idx):
            by_row[(p["_sheet"], p["_row"])] = p

    z = zipfile.ZipFile(src)
    rich = richdata_map(z)
    found = {}  # (sheet, row) -> [nguồn ảnh…]
    unmatched = 0
    for sheet, path in sheet_paths(z):
        for row, col, media in list(drawing_images(z, path)) + list(cell_images(z, path, rich)):
            key = (sheet, row) if (sheet, row) in by_row else None
            if key is None and (sheet, row) not in filled:
                # Ảnh nằm lệch sang dòng trống sát bên: gán cho sản phẩm ngay trên / dưới
                key = next(((sheet, r) for r in (row - 1, row + 1) if (sheet, r) in by_row), None)
            if key is None:
                unmatched += 1
                continue
            if media not in found.setdefault(key, []):
                found[key].append(media)

    bp.IMG_DIR.mkdir(parents=True, exist_ok=True)
    saved = skipped = failed = 0
    for key, medias in found.items():
        p = by_row[key]
        stem = p["code"] or p["id"]
        for i, media in enumerate(medias[:MAX_SHOTS]):
            name = stem if i == 0 else "%s-%d" % (stem, i + 1)
            if existing(name) and not overwrite:
                skipped += 1
                continue
            try:
                (bp.IMG_DIR / (name + ".webp")).write_bytes(to_webp(load_bytes(z, media)))
                saved += 1
            except Exception as err:  # ảnh hỏng / link chết: bỏ qua, báo lại
                failed += 1
                print("  ! Không lấy được ảnh cho %s: %s" % (name, err))

    print("Tìm thấy ảnh cho %d mẫu giày trong bảng." % len(found))
    print("  Đã lưu: %d ảnh vào images/products/" % saved)
    if skipped:
        print("  Bỏ qua %d ảnh vì mẫu đã có ảnh (thêm --ghi-de để thay)." % skipped)
    if failed:
        print("  Lỗi: %d ảnh." % failed)
    if unmatched:
        print("  %d ảnh không nằm cùng dòng với sản phẩm nào (logo, banner…) — đã bỏ qua." % unmatched)
    if not found:
        print("Không thấy ảnh nào gắn với sản phẩm. Bảng có thể chưa chèn ảnh, hoặc ảnh nằm trong Google Drive dạng link.")


if __name__ == "__main__":
    main()
