# S&LIFE Sneakers — Website bán giày

Website cho shop giày chính hãng S&LIFE Sneakers, dựng từ bảng hàng sẵn trên Google Sheet.
Giao diện theo mẫu Sneaker Daily: logo giữa, nút **MENU** mở danh sách hãng giày → trang hãng hiện các dòng giày và mẫu giày → trang sản phẩm chọn size, **Mua ngay** / **Thêm vào giỏ**, đặt hàng qua Zalo.

Website là HTML/CSS/JS thuần: không cần server, không cần build, đưa lên GitHub Pages là chạy (miễn phí).

## Có gì trong website

| Trang | Nội dung |
| --- | --- |
| `index.html` — Trang chủ | Thanh thông báo, slider banner (ảnh tự tải lên), cam kết, dòng giày nổi bật, thương hiệu, khối sản phẩm từng hãng, khoảnh khắc khách hàng, 4 bước đặt hàng |
| Menu | Máy tính: menu ngang, rê chuột vào hãng xổ ra các dòng. Điện thoại: nút MENU mở danh sách hãng → dòng |
| `shop.html` | Tất cả giày / trang hãng (`?brand=`) / trang dòng (`&line=`) / tìm kiếm. Banner hãng, ô các dòng, bộ lọc size · màu · giá · code nam/nữ (cột trái trên máy tính), sắp xếp, phân trang, sản phẩm đã xem |
| `product.html` — Sản phẩm | Ảnh + ảnh phụ, chia sẻ, cam kết & ưu đãi, chọn size, Thêm vào giỏ (popup), Mua ngay (Zalo), tab mô tả / thông tin / đổi trả, cùng dòng, cùng tầm giá, đã xem |
| `cart.html` → `dat-hang.html` | Giỏ hàng có ghi chú, gợi ý → đặt hàng 3 bước: thông tin giao hàng (tỉnh/thành) → COD cọc 30% hoặc chuyển khoản → mã đơn, mã QR chuyển khoản (VietQR), gửi đơn qua Zalo, tuỳ chọn lưu vào Google Sheet |
| `gioi-thieu.html`, `lien-he.html`, `policy.html`, `chinh-sach-bao-mat.html`, `size-guide.html` | Giới thiệu, liên hệ, đổi trả · vận chuyển · thanh toán · khiếu nại, bảo mật thông tin, chọn size |
| `anh.html` — Kiểm tra ảnh | Trang cho chủ shop: tên file ảnh cần đặt cho từng mẫu, mẫu nào đã có / chưa có ảnh |

Hướng dẫn cho chủ shop:
- `HUONG-DAN-CAP-NHAT-ANH.md` — tải ảnh sản phẩm, banner, ảnh khách hàng
- `HUONG-DAN-DON-HANG.md` — lưu đơn tự động vào Google Sheet
- `HUONG-DAN-TEN-MIEN.md` — việc cần làm trước và sau khi có tên miền .vn

Khách đặt hàng bằng cách: chọn size → website sao chép tin nhắn dạng
`Mã: U204LMMC / Size: 40 / Chân dài: 25 cm` → mở Zalo của shop → khách dán và gửi.

## Cấu trúc thư mục

```
index.html, shop.html, product.html, cart.html, size-guide.html, policy.html
assets/css/style.css      Giao diện
assets/js/app.js          Toàn bộ chức năng (lọc, giỏ hàng, tạo tin nhắn Zalo…)
data/shop.js              Thông tin shop, lưu ý form, danh sách dòng giày của từng hãng (LINES)
data/products.js          Danh sách sản phẩm (tự sinh từ bảng hàng, không sửa tay)
images/products/          Ảnh sản phẩm, đặt tên theo mã (VD: U204LMMC.jpg)
scripts/build_products.py Chuyển bảng hàng Google Sheet → data/products.js
```

## Cập nhật hàng sẵn (mỗi khi bảng Google Sheet thay đổi)

1. Mở Google Sheet → **Tệp → Tải xuống → Microsoft Excel (.xlsx)**.
2. Chạy:
   ```bash
   pip install openpyxl        # chỉ cần lần đầu
   python3 scripts/build_products.py ~/Downloads/bang-hang.xlsx
   ```
3. Commit và push `data/products.js`, `sitemap.xml`, `robots.txt` lên GitHub, website tự cập nhật sau khoảng 1 phút.

Script đọc bảng theo đúng quy ước đang dùng cho khách:
- Mỗi trang tính là một thương hiệu / dòng giày; dòng tiêu đề bắt đầu bằng ô **Tên**.
- Ô size có số `1` **hoặc tô màu xanh lá** = còn size. Ô trống = hết.
- Giá lấy ở cột **GIÁ BÁN** (đơn vị nghìn đồng: `2.600` = 2.600.000đ). `HẾT` = hết hàng.
- Ô size ghi thêm giá, ví dụ `1 2000`, là **giá riêng của size đó**; ghi `1 ib` / `1 hcm` thành ghi chú size.
- Tên có `(code nữ)`, `(W)`, `(GS)`, `(code kid)`, `(code nam)` được gắn nhãn tương ứng; `XẢ KHO`, `HÀNG TRUNG`, ghi chú trong ngoặc (lỗi ngoại quan…) hiển thị thành ghi chú của shop.

Website chỉ bán giày: các dòng quần áo, phụ kiện trong bảng được bỏ qua.

**Thêm / sửa dòng giày**: mở `data/shop.js`, mục `window.LINES`. Ví dụ thêm dòng 9060 cho New Balance: `["9060", /9060/i],`.

## Ảnh sản phẩm

Tải ảnh vào thư mục `images/products/`, **tên file = mã sản phẩm** (`U204LMMC.jpg`; ảnh phụ `U204LMMC-2.jpg`…). Website tự nhận ảnh, không cần chạy lệnh.
Hướng dẫn từng bước (tải ảnh bằng trình duyệt trên GitHub): **[HUONG-DAN-CAP-NHAT-ANH.md](HUONG-DAN-CAP-NHAT-ANH.md)**.

## Sửa thông tin shop

Mở `data/shop.js`: số điện thoại, link Zalo, Instagram, TikTok, tài khoản ngân hàng, % đặt cọc, số ngày đổi trả.
Điền `facebook: "https://facebook.com/…"` để hiện thêm nút Messenger.

## Xem thử trên máy

```bash
python3 -m http.server 8080
# mở http://localhost:8080
```
(Mở thẳng file `index.html` bằng trình duyệt cũng chạy được.)

## Đưa website lên mạng miễn phí (GitHub Pages)

1. Vào repo trên GitHub → **Settings → Pages**.
2. *Source*: **Deploy from a branch**, chọn nhánh chứa code và thư mục `/ (root)` → **Save**.
3. Sau 1–2 phút website chạy ở `https://<tên-tài-khoản>.github.io/<tên-repo>/`.
4. Muốn dùng tên miền riêng (VD `slifesneakers.vn`): mua tên miền, thêm vào mục **Custom domain** trong trang Pages và trỏ DNS theo hướng dẫn của GitHub.
