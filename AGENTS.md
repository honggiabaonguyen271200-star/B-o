# Hướng dẫn cho trợ lý AI (Antigravity, Claude Code…)

Website bán giày chính hãng **S&LIFE Sneakers**. Chủ shop không phải lập trình viên: trả lời bằng tiếng Việt, giải thích ngắn gọn, làm từng bước.

## Công nghệ

- HTML/CSS/JavaScript thuần, **không build, không framework, không npm**. Chạy trên GitHub Pages.
- Mở trực tiếp `index.html` là chạy được; xem thử: `python -m http.server 8080` rồi mở http://localhost:8080.
- Không thêm thư viện, bundler hay framework nếu chủ shop không yêu cầu rõ.

## Cấu trúc

| File | Vai trò |
| --- | --- |
| `index.html`, `shop.html`, `product.html`, `cart.html`, `dat-hang.html`, `yeu-cau.html` | Trang chủ, danh mục (hãng `?brand=` / dòng `&line=`), sản phẩm (`?id=`), giỏ hàng, gửi yêu cầu qua Messenger, tóm tắt yêu cầu (`?r=`) |
| `gioi-thieu.html`, `lien-he.html`, `policy.html`, `chinh-sach-bao-mat.html`, `size-guide.html` | Trang thông tin, chính sách |
| `anh.html` | Trang nội bộ: kiểm tra mẫu nào đã có ảnh; kéo thả ảnh để lưu đúng tên vào `images/products` (Chrome/Edge) |
| `assets/js/app.js` | Toàn bộ chức năng (header, menu, lọc, giỏ hàng, gửi yêu cầu). Mỗi trang chạy hàm `init…` theo `<body data-page>` |
| `assets/js/anh.js` | Công cụ ảnh của `anh.html` (chỉ tải ở trang đó), dùng hàm chung qua `window.SLIFE` |
| `assets/css/style.css` | Giao diện |
| `data/shop.js` | **Thông tin shop** (`messenger` — kênh chính, pháp lý, siteUrl, `features.wishlist`, `announcements`, `faq`, biệt danh tìm kiếm `aliases`, `orderEndpoint`, `ga4Id`), lưu ý form (`FIT_NOTES`), dòng giày từng hãng (`LINES`), bảng size theo hãng (`SIZE_CHARTS`) |
| `data/products.js` | **Tự sinh — không sửa tay.** Tạo bằng `scripts/build_products.py` |
| `scripts/build_products.py` | Đọc bảng hàng Google Sheet (.xlsx) → `data/products.js`, rồi tự chạy `static_pages.py` |
| `scripts/static_pages.py` | **Tự sinh** từ `products.js` + `danh-sach.js` + `siteUrl`: `sp/<id>.html` (link chia sẻ có og:image, tự chuyển sang `product.html?id=`), `sp/anh/<MÃ>.jpg`, `404.html`, `sitemap.xml` (trang chính + mẫu còn hàng), `robots.txt`, dòng preload ảnh hero trong `index.html`. Chạy lại sau khi đổi ảnh/`siteUrl` (`xem-web.bat` và các script ảnh tự chạy) |
| `sp/`, `404.html` | **Tự sinh — không sửa tay.** Tin nhắn Messenger và nút chia sẻ dùng link `sp/<id>.html` |
| `scripts/import_image_zip.py` | Nhập ảnh hàng loạt từ zip lớn (mỗi mẫu = zip nhỏ/thư mục đặt tên theo mã hoặc tên trong bảng) → `images/products/`; `--ghi-de` thay bộ cũ |
| `scripts/extract_images.py` | Lấy ảnh chèn trong bảng .xlsx (cùng dòng với sản phẩm) → `images/products/<MÃ>.webp`; `--ghi-de` để thay ảnh đã có |
| `images/products/danh-sach.js` | **Tự sinh** — danh sách ảnh đang có (anh.html, `import_image_zip.py`, `extract_images.py` tự ghi; chạy tay: `python scripts/image_manifest.py`). Thiếu/cũ thì web vẫn tự dò ảnh |
| `images/brand/` | Logo S&LIFE (SVG/PNG), favicon, icon; màu thương hiệu trong `images/brand/README.md` |
| `images/products/` | Ảnh sản phẩm, tên file = mã sản phẩm: `U204LMMC.webp`, ảnh phụ `U204LMMC-2.webp` … `-12` (tối đa 12, `MAX_SHOTS`). Ưu tiên WebP ≤1200px; không chép ảnh gốc điện thoại |
| `xem-web.bat`, `cap-nhat-hang.bat`, `nhap-anh-zip.bat` | Windows: bấm đúp để xem web trên máy; kéo thả file .xlsx vào để cập nhật hàng; kéo thả zip ảnh lớn để nhập ảnh hàng loạt |
| `images/banners/`, `images/khach-hang/` | Banner (`banner-1.jpg`…, `new-balance.jpg`…), ảnh khách (`1.jpg`…) |

## Quy tắc quan trọng

1. **Không sửa tay `data/products.js`.** Cập nhật hàng: `pip install openpyxl` rồi `python scripts/build_products.py <file.xlsx>` (file tải từ Google Sheet: Tệp → Tải xuống → .xlsx).
2. Giá trong dữ liệu tính theo **nghìn đồng** (`2600` = 2.600.000₫). Hiển thị qua hàm `money()`.
3. Ảnh được website tự dò theo tên file, không cần khai báo ở đâu. Không đổi quy ước đặt tên.
4. Shop **chỉ bán giày**; không thêm quần áo, phụ kiện.
5. Giọng văn: điềm đạm, đáng tin, không "SALE SỐC", không đồng hồ đếm ngược giả, không giá gạch ngang khi không có giá gốc thật.
6. Thông tin pháp lý, liên hệ chỉ sửa trong `data/shop.js`; ô để trống sẽ tự ẩn.
7. Tư vấn và chốt đơn qua **Messenger Facebook cá nhân** của chủ shop (`SHOP.messenger`): web soạn sẵn tin nhắn → khách Sao chép + Mở Messenger. Không thu tiền, không hiện số tài khoản/VietQR, không ghi cứng tiền cọc/COD. Không tự xoá giỏ, không bao giờ báo "đã nhận đơn". Sổ yêu cầu tuỳ chọn qua `orderEndpoint` (xem `HUONG-DAN-DON-HANG.md`).
8. Trước khi sửa: **Pull** code mới nhất. Sau khi sửa: mở web kiểm tra trên cỡ điện thoại và máy tính, không có lỗi trong Console, rồi mới Commit và Push.
9. **Chỉ hiện hàng sẵn** (mẫu còn size). Không có mục/nhãn hàng order. Tên thương hiệu: **S&LIFE Sneaker**.
10. Ít chuyển động: không pop-up tự bật, không nút nổi che nội dung, không tự chạy slider.

## Giao diện

- Màu theo logo: gradient `#004AAD → #771CAE → #DB3137` chỉ làm điểm nhấn, nền trắng/`--mist`; biến màu ở đầu `assets/css/style.css`. Font: **Bricolage Grotesque** (một họ chữ; tiêu đề in hoa ở `font-stretch: 75%`). Không dùng Inter/Roboto/Poppins/Be Vietnam Pro.
- Mẫu chưa có ảnh hiện ô trung tính "Ảnh thật đang cập nhật" — không vẽ/giả ảnh sản phẩm.
- Thiết kế mới đang làm trên nhánh `thiet-ke-moi` (xem `HANDOFF.md`, `docs/thiet-ke-moi/`).

## Skill thiết kế cho trợ lý AI

- `.claude/skills/` (Claude Code) và `.agents/skills/` (Antigravity) chứa skill hỗ trợ thiết kế giao diện: `frontend-design` (Anthropic) và bộ `ui-ux-pro-max` (cài bằng `npm install -g ui-ux-pro-max-cli` rồi `uipro init --ai claude` / `--ai antigravity`).
- Chỉ dùng để tham khảo khi chỉnh giao diện. Website vẫn là HTML/CSS/JS thuần: không đưa npm, framework, Tailwind hay thư viện từ các skill này vào website. Giữ giọng văn và bố cục theo quy tắc ở trên.

## Hướng dẫn cho chủ shop

- `HUONG-DAN-ANTIGRAVITY.md` — quy trình làm việc hằng ngày trên Antigravity
- `HUONG-DAN-CAP-NHAT-ANH.md` — tải ảnh
- `HUONG-DAN-DON-HANG.md` — lưu đơn vào Google Sheet
- `HUONG-DAN-TEN-MIEN.md` — tên miền .vn, pháp lý, SEO
- `README.md` — tổng quan
