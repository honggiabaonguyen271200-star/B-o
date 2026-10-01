# Hướng dẫn cho trợ lý AI (Antigravity, Claude Code…)

Website bán giày chính hãng **S&LIFE Sneakers**. Chủ shop không phải lập trình viên: trả lời bằng tiếng Việt, giải thích ngắn gọn, làm từng bước.

## Công nghệ

- HTML/CSS/JavaScript thuần, **không build, không framework, không npm**. Chạy trên GitHub Pages.
- Mở trực tiếp `index.html` là chạy được; xem thử: `python -m http.server 8080` rồi mở http://localhost:8080.
- Không thêm thư viện, bundler hay framework nếu chủ shop không yêu cầu rõ.

## Cấu trúc

| File | Vai trò |
| --- | --- |
| `index.html`, `shop.html`, `product.html`, `cart.html`, `dat-hang.html`, `yeu-cau.html` | Trang chủ, danh mục (hãng `?brand=` / dòng `&line=`), sản phẩm (`?id=`), giỏ hàng, gửi yêu cầu qua Facebook, tóm tắt yêu cầu (`?r=`) |
| `gioi-thieu.html`, `lien-he.html`, `policy.html`, `chinh-sach-bao-mat.html`, `size-guide.html` | Trang thông tin, chính sách |
| `anh.html` | Trang nội bộ: kiểm tra mẫu nào đã có ảnh; kéo thả ảnh để lưu đúng tên vào `images/products` (Chrome/Edge) |
| `assets/js/app.js` | Toàn bộ chức năng (header, menu, lọc, giỏ hàng, gửi yêu cầu). Mỗi trang chạy hàm `init…` theo `<body data-page>` |
| `assets/js/anh.js` | Công cụ ảnh của `anh.html` (chỉ tải ở trang đó), dùng hàm chung qua `window.SLIFE` |
| `assets/css/style.css` | Giao diện |
| `data/shop.js` | **Thông tin shop** (`facebookChat` — kênh chính, `openFacebookApp`, `facebookId`, `desktopAskChrome`, pháp lý, siteUrl, `features.wishlist`, `announcements`, `faq`, biệt danh tìm kiếm `aliases`, `orderEndpoint`, `ga4Id`), lưu ý form (`FIT_NOTES`), dòng giày từng hãng (`LINES`), bảng size theo hãng (`SIZE_CHARTS`: mỗi hãng nhiều bảng Nam / Nữ / Trẻ em, chép từ bảng size chính thức chủ shop gửi, cột đầu là EU) |
| `data/products.js` | **Tự sinh — không sửa tay.** Tạo bằng `scripts/build_products.py` |
| `scripts/build_products.py` | Đọc bảng hàng Google Sheet (.xlsx) → `data/products.js`, rồi tự chạy `static_pages.py` |
| `scripts/static_pages.py` | **Tự sinh** từ `products.js` + `danh-sach.js` + `siteUrl`: `sp/<id>.html` (link chia sẻ có og:image, tự chuyển sang `product.html?id=`), `sp/anh/<MÃ>.jpg`, `404.html`, `sitemap.xml` (trang chính + mẫu còn hàng), `robots.txt`, dòng preload ảnh hero trong `index.html`. Chạy lại sau khi đổi ảnh/`siteUrl` (`xem-web.bat` và các script ảnh tự chạy) |
| `sp/`, `404.html` | **Tự sinh — không sửa tay.** Tin nhắn soạn sẵn và nút chia sẻ dùng link `sp/<id>.html` |
| `scripts/import_image_zip.py` | Nhập ảnh hàng loạt từ zip lớn (mỗi mẫu = zip nhỏ/thư mục đặt tên theo mã hoặc tên trong bảng) → `images/products/`; `--ghi-de` thay bộ cũ |
| `scripts/extract_images.py` | Lấy ảnh chèn trong bảng .xlsx (cùng dòng với sản phẩm) → `images/products/<MÃ>.webp`; `--ghi-de` để thay ảnh đã có |
| `images/products/danh-sach.js`, `images/anh-khac.js` | **Tự sinh** — danh sách ảnh sản phẩm / banner + ảnh khách đang có (`static_pages.py`, anh.html, script ảnh tự ghi). Web chỉ hiện ảnh trong danh sách; thiếu file danh sách thì tự dò như cũ |
| `images/brands/` | Logo các hãng (PNG nền trong suốt, một màu; web tô màu bằng CSS mask). Tên file = slug hãng (`new-balance.png`…). Thiếu Puma → hiện chữ "PUMA". Thêm logo: sửa danh sách `BRAND_LOGOS` trong `app.js` |
| `images/brand/` | Logo S&LIFE (SVG/PNG), favicon, icon; màu thương hiệu trong `images/brand/README.md` |
| `images/products/` | Ảnh sản phẩm, tên file = mã sản phẩm: `U204LMMC.webp`, ảnh phụ `U204LMMC-2.webp` … `-12` (tối đa 12, `MAX_SHOTS`). Ưu tiên WebP ≤1200px; không chép ảnh gốc điện thoại |
| `xem-web.bat`, `cap-nhat-hang.bat`, `nhap-anh-zip.bat` | Windows: bấm đúp để xem web trên máy; kéo thả file .xlsx vào để cập nhật hàng; kéo thả zip ảnh lớn để nhập ảnh hàng loạt |
| `images/banners/`, `images/khach-hang/` | Banner (`banner-1.jpg`…, `new-balance.jpg`…), ảnh khách (`1.jpg`…) |

## Quy tắc quan trọng

1. **Không sửa tay `data/products.js`.** Cập nhật hàng: `pip install openpyxl` rồi `python scripts/build_products.py <file.xlsx>` (file tải từ Google Sheet: Tệp → Tải xuống → .xlsx).
2. Giá trong dữ liệu tính theo **nghìn đồng** (`2600` = 2.600.000₫). Hiển thị qua hàm `money()`.
3. Ảnh đặt tên theo mã sản phẩm. Web chỉ hiện ảnh có trong `images/products/danh-sach.js` (banner, ảnh khách: `images/anh-khac.js`) nên không có lỗi 404; hai danh sách tự cập nhật khi mở `xem-web.bat`, dùng anh.html hoặc các script ảnh (chạy tay: `python scripts/static_pages.py`). Không đổi quy ước đặt tên.
4. Shop **chỉ bán giày**; không thêm quần áo, phụ kiện.
5. Giọng văn: điềm đạm, đáng tin, không "SALE SỐC", không đồng hồ đếm ngược giả, không giá gạch ngang khi không có giá gốc thật.
6. Thông tin pháp lý, liên hệ chỉ sửa trong `data/shop.js`; ô để trống sẽ tự ẩn.
7. Tư vấn và chốt đơn qua **Facebook cá nhân** của chủ shop (`SHOP.facebookChat`): nút Facebook mở thẳng app Facebook trên điện thoại (`openFacebookApp`, iPhone chắc hơn khi có `facebookId`); máy tính dùng Chrome mở tab mới, trình duyệt khác (Edge, Cốc Cốc…) hiện hộp "Sao chép link để mở bằng Chrome / Mở luôn" (`desktopAskChrome`) vì trang web không tự bật được Chrome; thông tin mẫu được chép sẵn để khách dán vào tin nhắn. Không còn nút "Gửi yêu cầu mua" ở trang sản phẩm; mua nhiều đôi đi qua giỏ → Gửi yêu cầu. Không thu tiền, không hiện số tài khoản/VietQR, không ghi cứng tiền cọc/COD. Không tự xoá giỏ, không bao giờ báo "đã nhận đơn". Sổ yêu cầu tuỳ chọn qua `orderEndpoint` (xem `HUONG-DAN-DON-HANG.md`).
8. Trước khi sửa: **Pull** code mới nhất. Sau khi sửa: mở web kiểm tra trên cỡ điện thoại và máy tính, không có lỗi trong Console, rồi mới Commit và Push.
9. **Chỉ hiện hàng sẵn** (mẫu còn size). Không có mục/nhãn hàng order. Tên thương hiệu: **S&LIFE Sneaker**.
10. Chuyển động (chủ shop chọn ở mốc 6): **có** thanh chữ chạy + nền màu chảy ở đầu trang, banner chuyển slide khi khách bấm/vuốt (mở theo vòng tròn), nền đốm màu trôi khi cuộn, khối nội dung hiện dần, thẻ nổi khi rê chuột. **Vẫn không**: pop-up tự bật, nút nổi che nội dung, slider tự chuyển. Mọi chuyển động tắt khi máy bật "giảm chuyển động".

## Giao diện

- **Mốc 6 (mới nhất, ghi đè mốc 5):** chủ shop không thích mảng **tím đặc** — tím chỉ còn trong logo, ánh đèn banner, dải màu chảy; `--c-violet` được đặt bằng cobalt. Nút chính và "Tìm" màu mực, hover cobalt. "Theo nhu cầu": 3 ô loại giày màu đặc (cobalt/đỏ mận/đỏ) + 5 ô mức giá nền nhạt. "Chưa chắc size?" nền mực có ánh đèn. Banner đầu: chùm 5 ảnh giày thật.
- **Mốc 5 (chủ shop muốn sặc sỡ hơn):** màu shop thành từng mảng màu đặc — thanh đầu trang 3 khối cobalt/tím/đỏ, nút chính và thứ đang chọn màu tím, ô "Theo nhu cầu" mỗi ô một màu, khối "Chưa chắc size?" nền tím, dải cam kết nền xanh nhạt. Vẫn không phủ gradient lên chữ/nút. Khối "Mốc 5" ở cuối `style.css` ghi đè mốc 4.
- Màu theo logo, dùng có chủ đích (mốc 4): **gradient chỉ ở logo và "ánh đèn" banner đầu** (nền mực + ba vệt sáng cobalt/tím/đỏ). Mực `#15112B`: chữ, nút chính. Tím `#771CAE`: thứ đang chọn (size, lọc). Cobalt `#004AAD`: link, rê chuột. Đỏ `#DB3137`: chỉ để gây chú ý (số giỏ). Nền trắng/`--mist` `#F4F2FA`. Không phủ gradient lên nút, thanh, ô. Biến màu ở đầu `assets/css/style.css`, khối "Mốc 4" ở cuối file. Font: **Bricolage Grotesque** (một họ chữ; tiêu đề in hoa ở `font-stretch: 75%`). Không dùng Inter/Roboto/Poppins/Be Vietnam Pro.
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
