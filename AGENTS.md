# Hướng dẫn cho trợ lý AI (Antigravity, Claude Code…)

Website bán giày chính hãng **S&LIFE Sneakers**. Chủ shop không phải lập trình viên: trả lời bằng tiếng Việt, giải thích ngắn gọn, làm từng bước.

## Công nghệ

- HTML/CSS/JavaScript thuần, **không build, không framework, không npm**. Chạy trên GitHub Pages.
- Mở trực tiếp `index.html` là chạy được; xem thử: `python -m http.server 8080` rồi mở http://localhost:8080.
- Không thêm thư viện, bundler hay framework nếu chủ shop không yêu cầu rõ.

## Cấu trúc

| File | Vai trò |
| --- | --- |
| `index.html`, `shop.html`, `product.html`, `cart.html`, `dat-hang.html` | Trang chủ, danh mục (hãng `?brand=` / dòng `&line=`), sản phẩm (`?id=`), giỏ hàng, đặt hàng |
| `gioi-thieu.html`, `lien-he.html`, `policy.html`, `chinh-sach-bao-mat.html`, `size-guide.html` | Trang thông tin, chính sách |
| `anh.html` | Trang nội bộ: kiểm tra mẫu nào đã có ảnh |
| `assets/js/app.js` | Toàn bộ chức năng (header, menu, lọc, giỏ hàng, đặt hàng, ảnh). Mỗi trang chạy hàm `init…` theo `<body data-page>` |
| `assets/css/style.css` | Giao diện |
| `data/shop.js` | **Thông tin shop** (SĐT, Zalo, ngân hàng, pháp lý, siteUrl), lưu ý form (`FIT_NOTES`), dòng giày từng hãng (`LINES`) |
| `data/products.js` | **Tự sinh — không sửa tay.** Tạo bằng `scripts/build_products.py` |
| `scripts/build_products.py` | Đọc bảng hàng Google Sheet (.xlsx) → `data/products.js`, `sitemap.xml`, `robots.txt` |
| `images/products/` | Ảnh sản phẩm, tên file = mã sản phẩm (`U204LMMC.jpg`, ảnh phụ `U204LMMC-2.jpg`) |
| `xem-web.bat`, `cap-nhat-hang.bat` | Windows: bấm đúp để xem web trên máy; kéo thả file .xlsx vào để cập nhật hàng |
| `images/banners/`, `images/khach-hang/` | Banner (`banner-1.jpg`…, `new-balance.jpg`…), ảnh khách (`1.jpg`…) |

## Quy tắc quan trọng

1. **Không sửa tay `data/products.js`.** Cập nhật hàng: `pip install openpyxl` rồi `python scripts/build_products.py <file.xlsx>` (file tải từ Google Sheet: Tệp → Tải xuống → .xlsx).
2. Giá trong dữ liệu tính theo **nghìn đồng** (`2600` = 2.600.000₫). Hiển thị qua hàm `money()`.
3. Ảnh được website tự dò theo tên file, không cần khai báo ở đâu. Không đổi quy ước đặt tên.
4. Shop **chỉ bán giày**; không thêm quần áo, phụ kiện.
5. Giọng văn: điềm đạm, đáng tin, không "SALE SỐC", không đồng hồ đếm ngược giả, không giá gạch ngang khi không có giá gốc thật.
6. Thông tin pháp lý, liên hệ chỉ sửa trong `data/shop.js`; ô để trống sẽ tự ẩn.
7. Đơn hàng không có máy chủ: khách gửi đơn qua Zalo (tin nhắn soạn sẵn); tuỳ chọn ghi vào Google Sheet qua `orderEndpoint` (xem `HUONG-DAN-DON-HANG.md`).
8. Trước khi sửa: **Pull** code mới nhất. Sau khi sửa: mở web kiểm tra trên cỡ điện thoại và máy tính, không có lỗi trong Console, rồi mới Commit và Push.

## Hướng dẫn cho chủ shop

- `HUONG-DAN-CAP-NHAT-ANH.md` — tải ảnh
- `HUONG-DAN-DON-HANG.md` — lưu đơn vào Google Sheet
- `HUONG-DAN-TEN-MIEN.md` — tên miền .vn, pháp lý, SEO
- `README.md` — tổng quan
