# S&LIFE Sneakers — Website bán giày

Website cho shop giày chính hãng S&LIFE Sneakers, dựng từ bảng hàng sẵn trên Google Sheet.
Bố cục lấy cảm hứng từ các shop sneaker Việt Nam (trang chủ có danh mục thương hiệu, trang danh mục có bộ lọc, trang sản phẩm chọn size, đặt hàng qua Zalo).

Website là HTML/CSS/JS thuần: không cần server, không cần build, đưa lên GitHub Pages là chạy (miễn phí).

## Có gì trong website

| Trang | Nội dung |
| --- | --- |
| `index.html` — Trang chủ | Banner, cam kết (chính hãng, đồng kiểm, đổi size 3 ngày, ship toàn quốc), thương hiệu, hàng sẵn theo hãng, mẫu dưới 2 triệu, 4 bước đặt hàng |
| `shop.html` — Danh mục | Lọc theo thương hiệu, size EU, khoảng giá, code nam/nữ/GS/kid, giày/quần áo; tìm theo tên hoặc mã; sắp xếp theo giá / số size |
| `product.html` — Sản phẩm | Mã sản phẩm (bấm sao chép), size còn hàng, giá riêng từng size, lưu ý form theo dòng giày, nút **Đặt nhanh qua Zalo** |
| `cart.html` — Giỏ hàng | Gom nhiều đôi, điền tên / SĐT / địa chỉ / số cm chân, chọn COD cọc 30% hoặc chuyển khoản → tạo sẵn tin nhắn đặt hàng gửi Zalo |
| `size-guide.html` | Cách đo chân, lưu ý form từng dòng, giải thích code nữ / GS / 40Y |
| `policy.html` | Cách đặt hàng, cam kết chính hãng, đổi trả, ship và thanh toán, liên hệ |

Khách đặt hàng bằng cách: chọn size → website sao chép tin nhắn dạng
`Mã: U204LMMC / Size: 40 / Chân dài: 25 cm` → mở Zalo của shop → khách dán và gửi.

## Cấu trúc thư mục

```
index.html, shop.html, product.html, cart.html, size-guide.html, policy.html
assets/css/style.css      Giao diện
assets/js/app.js          Toàn bộ chức năng (lọc, giỏ hàng, tạo tin nhắn Zalo…)
data/shop.js              Thông tin shop: SĐT, Zalo, Facebook, ngân hàng, lưu ý form
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
3. Commit và push `data/products.js` lên GitHub, website tự cập nhật sau khoảng 1 phút.

Script đọc bảng theo đúng quy ước đang dùng cho khách:
- Mỗi trang tính là một thương hiệu / dòng giày; dòng tiêu đề bắt đầu bằng ô **Tên**.
- Ô size có số `1` **hoặc tô màu xanh lá** = còn size. Ô trống = hết.
- Giá lấy ở cột **GIÁ BÁN** (đơn vị nghìn đồng: `2.600` = 2.600.000đ). `HẾT` = hết hàng.
- Ô size ghi thêm giá, ví dụ `1 2000`, là **giá riêng của size đó**; ghi `1 ib` / `1 hcm` thành ghi chú size.
- Tên có `(code nữ)`, `(W)`, `(GS)`, `(code kid)`, `(code nam)` được gắn nhãn tương ứng; `XẢ KHO`, `HÀNG TRUNG`, ghi chú trong ngoặc (lỗi ngoại quan…) hiển thị thành ghi chú của shop.

Hiện chưa đưa lên web: bảng Vans dạng "Tên / Size / Số lượng" và bảng phụ kiện – quần áo có cột **Giá CTV**, vì hai bảng này khác định dạng và có giá cộng tác viên.

## Ảnh sản phẩm

Cột "Hình ảnh" trong Google Sheet là ảnh nhúng nên không xuất ra được. Mẫu chưa có ảnh sẽ hiện hình minh hoạ tự vẽ theo màu trong tên giày.
Để dùng ảnh thật: chép ảnh vào `images/products/`, đặt tên đúng mã sản phẩm (`U204LMMC.jpg`), rồi chạy lại script ở trên.

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
