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
| `data/shop.js` | **Thông tin shop** (`facebookChat` — kênh chính, `openFacebookApp`, `facebookId`, `desktopAskChrome`, pháp lý, siteUrl, `features.wishlist`, `heroPicks` (mẫu trong chùm banner), `announcements`, `faq`, biệt danh tìm kiếm `aliases`, `orderEndpoint`, `ga4Id`), lưu ý form (`FIT_NOTES`), dòng giày từng hãng (`LINES`), bảng size theo hãng (`SIZE_CHARTS`: mỗi hãng nhiều bảng Nam / Nữ / Trẻ em, chép từ bảng size chính thức chủ shop gửi, cột đầu là EU) |
| `data/products.js` | **Tự sinh — không sửa tay.** Tạo bằng `scripts/build_products.py` |
| `scripts/build_products.py` | Đọc bảng hàng Google Sheet (.xlsx) → `data/products.js`, rồi tự chạy `static_pages.py` |
| `scripts/static_pages.py` | **Tự sinh** từ `products.js` + `danh-sach.js` + `siteUrl`: `sp/<id>.html` (link chia sẻ có og:image, tự chuyển sang `product.html?id=`), `sp/anh/<MÃ>.jpg`, `404.html`, `sitemap.xml` (trang chính + mẫu còn hàng), `robots.txt`, dòng preload ảnh hero trong `index.html`. Chạy lại sau khi đổi ảnh/`siteUrl` (`xem-web.bat` và các script ảnh tự chạy) |
| `sp/`, `404.html` | **Tự sinh — không sửa tay.** Tin nhắn soạn sẵn và nút chia sẻ dùng link `sp/<id>.html` |
| `scripts/import_image_zip.py` | Nhập ảnh hàng loạt từ zip lớn (mỗi mẫu = zip nhỏ/thư mục đặt tên theo mã hoặc tên trong bảng) → `images/products/`; `--ghi-de` thay bộ cũ |
| `scripts/extract_images.py` | Lấy ảnh chèn trong bảng .xlsx (cùng dòng với sản phẩm) → `images/products/<MÃ>.webp`; `--ghi-de` để thay ảnh đã có |
| `images/products/danh-sach.js`, `images/anh-khac.js` | **Tự sinh** — danh sách ảnh sản phẩm / banner + ảnh khách đang có (`static_pages.py`, anh.html, script ảnh tự ghi). Web chỉ hiện ảnh trong danh sách; thiếu file danh sách thì tự dò như cũ |
| `images/brands/` | Logo các hãng (PNG nền trong suốt, một màu; web tô màu bằng CSS mask). Tên file = slug hãng (`new-balance.png`…). Hãng chưa có logo → hiện tên in hoa. Thêm logo: sửa danh sách `BRAND_LOGOS` trong `app.js` |
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
7. Tư vấn và chốt đơn qua **Facebook cá nhân** của chủ shop (`SHOP.facebookChat`): nút Facebook mở thẳng app Facebook trên điện thoại (`openFacebookApp`, iPhone chắc hơn khi có `facebookId`). **Không bao giờ tự chuyển trang web sang facebook.com** khi gọi app: trong Zalo/TikTok, app hỏi "Bạn sẽ thoát Zalo…" lâu, trang tự chuyển thì khách quay lại mất trang web (lỗi chủ shop quay video 02/10). Sau 2,5 giây chưa rời trang thì hiện hộp chọn (mở lại app / chép link / chép tin nhắn / mở tab mới); khách rời trang rồi quay lại thì hộp tự đóng; máy tính dùng Chrome mở tab mới, trình duyệt khác (Edge, Cốc Cốc…) hiện hộp "Sao chép link để mở bằng Chrome / Mở luôn" (`desktopAskChrome`) vì trang web không tự bật được Chrome; thông tin mẫu được chép sẵn để khách dán vào tin nhắn. Không còn nút "Gửi yêu cầu mua" ở trang sản phẩm; mua nhiều đôi đi qua giỏ → Gửi yêu cầu. Không thu tiền, không hiện số tài khoản/VietQR, không ghi cứng tiền cọc/COD. Không tự xoá giỏ, không bao giờ báo "đã nhận đơn". Sổ yêu cầu tuỳ chọn qua `orderEndpoint` (xem `HUONG-DAN-DON-HANG.md`).
8. Trước khi sửa: **Pull** code mới nhất. Sau khi sửa: mở web kiểm tra trên cỡ điện thoại và máy tính, không có lỗi trong Console, rồi mới Commit và Push.
9. **Chỉ hiện hàng sẵn** (mẫu còn size). Không có mục/nhãn hàng order. Tên thương hiệu: **S&LIFE Sneaker**.
10. Chuyển động (chủ shop chọn ở mốc 6 và 7): **có** thanh chữ chạy + nền màu chảy ở đầu trang, **banner tự chuyển mỗi 6 giây** (mở theo vòng tròn; dừng khi rê chuột, chạm, dùng bàn phím, banner khuất màn hình; có nút tạm dừng), ánh đèn sân khấu trôi chậm, chùm mẫu ở banner đầu tự đổi chỗ + thay mẫu mỗi 2,6 giây, banner dòng giày mỗi lần hiện là một dòng khác, dải logo các hãng chạy dưới banner, viền ba màu chạy quanh nút "Xem … mẫu có sẵn", nút "Tìm" nền màu chảy, nền đốm màu trôi khi cuộn, khối nội dung hiện dần, thẻ nổi khi rê chuột. **Vẫn không**: pop-up tự bật, nút nổi che nội dung, đồ vật bay lơ lửng. Mọi chuyển động tắt (và banner không tự chuyển) khi máy bật "giảm chuyển động".

## Giao diện

- **Mốc 10 (07/10, mới nhất):** không hiện số mẫu của từng hãng / dòng (menu, ô hãng, tường logo, top 5, thẻ dòng, tab); banner không hiện giá; không dùng câu "ảnh chụp thật" cho ảnh trên web (ảnh lấy từ bảng hàng); ô chưa có ảnh ghi "Ảnh đang cập nhật"; dải chữ đầu trang lặp đủ dài để chạy liền mạch.
- **Mốc 9:** đổi sang 2 font Barlow Condensed + IBM Plex Sans (xem dòng "Font" bên dưới).
- **Mốc 8:** logo đầu trang nét dày hơn, to hơn, màu bên trong chảy liên tục (mặt nạ `images/brand/slife-logo-mask.svg` + dải màu CSS; tạo lại mặt nạ từ `slife-full-gradient.svg` nếu đổi logo). Dải logo hãng không ghi số. "Hàng sẵn, mua ngay" trộn lần lượt mỗi hãng một mẫu (`mixBrands`), không ưu tiên mẫu có ảnh.
- **Mốc 7:** logo đầu trang là logo gốc đầy đủ **nền trong suốt**, không còn ô vuông màu. Nút "Tìm" nền ba màu chảy. Banner 5 slide: (1) "Only Authentic" + chùm mẫu nổi bật của 5 hãng — mẫu có ảnh hiện ảnh thật, mẫu chưa có ảnh hiện **thẻ chữ** (logo hãng, tên dòng, giá), chọn tay bằng `SHOP.heroPicks`; (2) tường logo các hãng nền sáng; (3) "Top 5 dòng giày" nền cobalt + vòng đỏ, đếm từ bảng hàng (không ghi "bán chạy"); (4) dòng có ảnh thật; (5) hỏi size. CSS ở khối "Mốc 7" cuối `style.css`.
- **Mốc 6 (ghi đè mốc 5):** chủ shop không thích mảng **tím đặc** — tím chỉ còn trong logo, ánh đèn banner, dải màu chảy; `--c-violet` được đặt bằng cobalt. Nút chính màu mực, hover cobalt ("Tìm" đổi ở mốc 7). "Theo nhu cầu": 3 ô loại giày màu đặc (cobalt/đỏ mận/đỏ) + 5 ô mức giá nền nhạt. "Chưa chắc size?" nền mực có ánh đèn. Banner đầu: chùm 5 ảnh giày thật.
- **Mốc 5 (chủ shop muốn sặc sỡ hơn):** màu shop thành từng mảng màu đặc — thanh đầu trang 3 khối cobalt/tím/đỏ, nút chính và thứ đang chọn màu tím, ô "Theo nhu cầu" mỗi ô một màu, khối "Chưa chắc size?" nền tím, dải cam kết nền xanh nhạt. Vẫn không phủ gradient lên chữ/nút. Khối "Mốc 5" ở cuối `style.css` ghi đè mốc 4.
- Màu theo logo, dùng có chủ đích (mốc 4): **gradient chỉ ở logo và "ánh đèn" banner đầu** (nền mực + ba vệt sáng cobalt/tím/đỏ). Mực `#15112B`: chữ, nút chính. Tím `#771CAE`: thứ đang chọn (size, lọc). Cobalt `#004AAD`: link, rê chuột. Đỏ `#DB3137`: chỉ để gây chú ý (số giỏ). Nền trắng/`--mist` `#F4F2FA`. Không phủ gradient lên nút, thanh, ô. Biến màu ở đầu `assets/css/style.css`, khối "Mốc 4" ở cuối file. Font (mốc 9, chủ shop yêu cầu **bắt buộc 2 font**, không "AI hoá", có tiếng Việt): **Barlow Condensed** cho tiêu đề / chữ lớn in hoa (`--font-display`: banner, tiêu đề khu vực, tên dòng, tên mẫu trang sản phẩm, số thứ hạng) và **IBM Plex Sans** cho chữ đọc (`--font`: đoạn văn, menu, nút, ô tìm, tên mẫu trên thẻ, giá, size, mã). Giá/size/mã dùng số đều bề ngang (`tabular-nums`). Tiêu đề in hoa giữ `line-height` ≥ 1.1 để dấu chồng (Ọ, Ạ, Ầ) không chạm dòng. Không thêm font thứ ba; không dùng Inter/Roboto/Poppins/Montserrat/Be Vietnam Pro/Bricolage. Ảnh thử: `docs/thiet-ke-moi/font-moc-9/`.
- Mẫu chưa có ảnh hiện ô trung tính "Ảnh thật đang cập nhật" — không vẽ/giả ảnh sản phẩm.
- Thiết kế mới (mốc 1 → 9) đã lên web thật ngày 02/10, gộp từ nhánh `thiet-ke-moi`. Lịch sử từng mốc: `HANDOFF.md`, ảnh: `docs/thiet-ke-moi/`. Từ nay làm việc trên nhánh `claude/shoe-shop-website-3dln52`.

## Skill thiết kế cho trợ lý AI

- `.claude/skills/` (Claude Code) và `.agents/skills/` (Antigravity) chứa skill hỗ trợ thiết kế giao diện: `frontend-design` (Anthropic) và bộ `ui-ux-pro-max` (cài bằng `npm install -g ui-ux-pro-max-cli` rồi `uipro init --ai claude` / `--ai antigravity`).
- Chỉ dùng để tham khảo khi chỉnh giao diện. Website vẫn là HTML/CSS/JS thuần: không đưa npm, framework, Tailwind hay thư viện từ các skill này vào website. Giữ giọng văn và bố cục theo quy tắc ở trên.

## Hướng dẫn cho chủ shop

- `HUONG-DAN-ANTIGRAVITY.md` — quy trình làm việc hằng ngày trên Antigravity
- `HUONG-DAN-CAP-NHAT-ANH.md` — tải ảnh
- `HUONG-DAN-DON-HANG.md` — lưu đơn vào Google Sheet
- `HUONG-DAN-TEN-MIEN.md` — tên miền .vn, pháp lý, SEO
- `README.md` — tổng quan
