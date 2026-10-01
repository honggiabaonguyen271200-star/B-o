# S&LIFE Sneaker — Website bán giày chính hãng

Website của shop **S&LIFE Sneaker**, dựng từ bảng hàng sẵn trên Google Sheet. Khách xem giày (chỉ hàng sẵn) theo hãng → dòng → mẫu, chọn size, rồi gửi yêu cầu cho shop qua **Facebook** — tư vấn và chốt đơn trong tin nhắn, website không thu tiền.

- Web đang chạy: https://honggiabaonguyen271200-star.github.io/B-o/
- HTML/CSS/JavaScript thuần: **không cần server, không build, không cài gì thêm**. Đưa lên GitHub Pages là chạy (miễn phí).

> Mở file này dạng dễ đọc trong Antigravity / VS Code: nhấn **Ctrl + Shift + V**.

---

## Bắt đầu nhanh (Windows)

| Muốn làm | Cách làm |
| --- | --- |
| Xem web trên máy | Bấm đúp **`xem-web.bat`** (hoặc gõ `.\xem-web.bat` trong Terminal) → trình duyệt mở http://localhost:8080 |
| Cập nhật hàng từ Google Sheet | Tải bảng hàng dạng .xlsx, **kéo thả file vào `cap-nhat-hang.bat`** |
| Thêm ảnh sản phẩm | Chép ảnh vào `images/products/`, tên file = mã sản phẩm (`U204LMMC.jpg`) |
| Sửa link Facebook, thông tin shop, câu hỏi thường gặp… | Mở `data/shop.js` |
| Đưa thay đổi lên web thật | Source Control → **Commit** → **Sync Changes**. Web tự cập nhật sau 1–2 phút |

Cần cài **Python** (https://python.org, nhớ tích ô *Add Python to PATH*) để chạy hai file `.bat`.

## Tài liệu hướng dẫn

| File | Dành cho việc |
| --- | --- |
| [HUONG-DAN-ANTIGRAVITY.md](HUONG-DAN-ANTIGRAVITY.md) | **Đọc đầu tiên.** Quy trình làm việc hằng ngày, nhờ trợ lý AI sửa web, lưu lên GitHub, danh sách việc cần hoàn thiện |
| [HUONG-DAN-CAP-NHAT-ANH.md](HUONG-DAN-CAP-NHAT-ANH.md) | Tải ảnh sản phẩm, banner, ảnh khách hàng |
| [HUONG-DAN-DON-HANG.md](HUONG-DAN-DON-HANG.md) | Sổ yêu cầu mua trên Google Sheet (không bắt buộc) |
| [HUONG-DAN-TEN-MIEN.md](HUONG-DAN-TEN-MIEN.md) | Tên miền .vn, thủ tục pháp lý, SEO |
| [AGENTS.md](AGENTS.md) | Quy tắc cho trợ lý AI (Antigravity, Claude Code…). Mở đầu mỗi cuộc trò chuyện: *"Đọc file AGENTS.md và làm theo quy tắc trong đó."* |

---

## Website có gì

| Trang | Nội dung |
| --- | --- |
| `index.html` — Trang chủ | Hàng sẵn mua ngay, cam kết, theo hãng, theo nhu cầu, dòng giày nổi bật, tư vấn size, mẫu theo hãng, câu hỏi thường gặp |
| Menu | Máy tính: menu ngang, rê chuột vào hãng xổ ra các dòng. Điện thoại: nút **MENU** → hãng → dòng |
| `shop.html` — Danh mục | Hàng sẵn / theo hãng (`?brand=`) / theo dòng (`&line=`) / tìm kiếm (mã, tên, biệt danh). Lọc hãng · dòng giày · size · giá · code nam/nữ, sắp xếp, phân trang, sản phẩm đã xem |
| `product.html` — Sản phẩm | Ảnh chính + ảnh phụ, chọn size, lưu ý form, lưu ý form + bảng size trước nút mua, **Thêm vào giỏ** / **Tư vấn qua Facebook** (mở thẳng Facebook shop, thông tin mẫu được chép sẵn), mô tả · thông tin · đổi trả, gợi ý cùng dòng / cùng tầm giá |
| `cart.html` → `dat-hang.html` → `yeu-cau.html` | Giỏ hàng → Gửi yêu cầu: web soạn sẵn tin nhắn, khách bấm **Chép tin nhắn và mở Facebook shop**; giỏ chỉ xoá khi khách bấm "Tôi đã gửi". `yeu-cau.html` là link tóm tắt yêu cầu gửi kèm tin nhắn |
| `gioi-thieu.html`, `lien-he.html`, `policy.html`, `chinh-sach-bao-mat.html`, `size-guide.html` | Giới thiệu, liên hệ, chính sách đổi trả · vận chuyển · thanh toán, bảo mật, hướng dẫn chọn size |
| `anh.html` — Kiểm tra ảnh | Trang nội bộ cho chủ shop: tên file ảnh cần đặt cho từng mẫu, mẫu nào đã có / chưa có ảnh |

**Khách mua thế nào:** chọn size → **Thêm vào giỏ** → **Gửi yêu cầu cho shop** → website soạn sẵn tin nhắn (mẫu, mã, size, giá, link tóm tắt) → một nút chép tin nhắn và mở Facebook của chủ shop, khách dán và gửi → shop xác nhận size, phí ship và tiền cọc trong tin nhắn. Không cần máy chủ, không thu tiền trên web.

## Cấu trúc thư mục

```
index.html, shop.html, product.html, cart.html, dat-hang.html   Các trang bán hàng
gioi-thieu.html, lien-he.html, policy.html,
chinh-sach-bao-mat.html, size-guide.html                        Trang thông tin, chính sách
anh.html                                                         Trang nội bộ kiểm tra ảnh
assets/css/style.css          Giao diện
assets/js/app.js              Toàn bộ chức năng (menu, lọc, giỏ hàng, gửi yêu cầu)
assets/js/anh.js              Công cụ ảnh của anh.html (chỉ tải ở trang đó)
data/shop.js                  Thông tin shop, lưu ý form (FIT_NOTES), dòng giày từng hãng (LINES)
data/products.js              Danh sách sản phẩm — TỰ SINH, không sửa tay
scripts/build_products.py     Bảng hàng .xlsx → data/products.js (rồi tự chạy static_pages.py)
scripts/static_pages.py       Tự sinh: sp/ (link chia sẻ có ảnh xem trước), 404.html, sitemap.xml, robots.txt
scripts/google-apps-script-don-hang.gs   Mã dán vào Google Sheet để lưu đơn
images/products/              Ảnh sản phẩm (tên = mã sản phẩm)
images/banners/               Banner trang chủ, banner từng hãng
images/khach-hang/            Ảnh khách hàng (1.jpg, 2.jpg…)
xem-web.bat, cap-nhat-hang.bat   Tiện ích Windows
```

---

## Cập nhật hàng sẵn

Làm mỗi khi bảng Google Sheet thay đổi:

1. Google Sheet → **Tệp → Tải xuống → Microsoft Excel (.xlsx)**.
2. Kéo thả file vừa tải vào **`cap-nhat-hang.bat`**.
   Hoặc gõ lệnh:
   ```bash
   pip install openpyxl        # chỉ cần lần đầu
   python scripts/build_products.py "C:\Users\HP\Downloads\bang-hang.xlsx"
   ```
3. Commit và Sync (push) tất cả file thay đổi: `data/products.js`, thư mục `sp/`, `sitemap.xml`, `robots.txt`, `index.html`.

Script đọc bảng theo quy ước đang dùng:
- Mỗi trang tính là một thương hiệu / dòng giày; dòng tiêu đề bắt đầu bằng ô **Tên**.
- Ô size có số `1` **hoặc tô màu xanh lá** = còn size. Ô trống = hết.
- Giá lấy ở cột **GIÁ BÁN**, đơn vị **nghìn đồng** (`2.600` = 2.600.000₫). `HẾT` = hết hàng.
- Ô size ghi thêm giá, ví dụ `1 2000`, là giá riêng của size đó; `1 ib` / `1 hcm` thành ghi chú size.
- Tên có `(code nữ)`, `(W)`, `(GS)`, `(code kid)`, `(code nam)` được gắn nhãn tương ứng; `XẢ KHO`, `HÀNG TRUNG`, ghi chú trong ngoặc (lỗi ngoại quan…) hiện thành ghi chú của shop.
- Shop **chỉ bán giày**: dòng quần áo, phụ kiện trong bảng tự bị bỏ qua.

## Ảnh sản phẩm

Chép ảnh vào `images/products/`, **tên file = mã sản phẩm**: `U204LMMC.jpg`, ảnh phụ `U204LMMC-2.jpg`, `U204LMMC-3.jpg`… Website tự nhận ảnh, không cần chạy lệnh. Mở `anh.html` để xem mẫu nào còn thiếu ảnh.
Chi tiết: [HUONG-DAN-CAP-NHAT-ANH.md](HUONG-DAN-CAP-NHAT-ANH.md).

## Sửa thông tin shop — `data/shop.js`

- **Liên hệ:** `facebookChat` (kênh chính, `openInChrome` mở bằng Chrome trên Android), Facebook, Instagram, TikTok, giờ trả lời; Zalo, số điện thoại chỉ hiện nhỏ ở trang Liên hệ.
- **Tài khoản ngân hàng:** chỉ lưu trong file, **không hiện trên web** — shop gửi qua tin nhắn.
- **Bật/tắt:** `features.wishlist` (nút Yêu thích, đang tắt). **Biệt danh tìm kiếm:** `aliases`. **Câu hỏi thường gặp:** `faq`.
- **Bảng size theo hãng:** `window.SIZE_CHARTS` (chủ shop kiểm lại với bảng trên web hãng).
- **Pháp lý:** tên hộ kinh doanh, địa chỉ, email, mã số thuế, link Bộ Công Thương. **Ô để trống sẽ tự ẩn** trên website.
- **Website:** `siteUrl` (đổi khi có tên miền .vn), `orderEndpoint` (sổ yêu cầu trên Google Sheet), `ga4Id` (đo lượt xem, không bắt buộc), dòng thông báo đầu trang, ưu đãi ở trang sản phẩm.
- **Dòng giày:** mục `window.LINES`. Ví dụ thêm dòng 9060 cho New Balance: `["9060", /9060/i],`.
- **Lưu ý form:** mục `window.FIT_NOTES` (lời khuyên chọn size theo dòng giày).

## Đưa web lên mạng (GitHub Pages)

1. Repo trên GitHub → **Settings → Pages**.
2. *Source*: **Deploy from a branch**, nhánh `claude/shoe-shop-website-3dln52`, thư mục **/ (root)** → **Save**.
3. Sau 1–2 phút web chạy tại https://honggiabaonguyen271200-star.github.io/B-o/
4. Có tên miền riêng (VD `slifesneakers.vn`): điền vào **Custom domain** trong trang Pages, trỏ DNS theo hướng dẫn của GitHub, rồi sửa `siteUrl` trong `data/shop.js`. Xem [HUONG-DAN-TEN-MIEN.md](HUONG-DAN-TEN-MIEN.md).

## Quy tắc khi sửa web

1. **Pull** bản mới nhất trước khi sửa.
2. Không sửa tay `data/products.js` — luôn tạo lại từ bảng hàng.
3. Giọng văn điềm đạm, đáng tin: không "SALE SỐC", không đồng hồ đếm ngược giả, không giá gạch ngang khi không có giá gốc thật.
4. Sửa xong: xem thử trên cỡ **điện thoại** (F12 → Ctrl + Shift + M) và **máy tính**, không có lỗi đỏ trong Console, rồi mới Commit và Push.
