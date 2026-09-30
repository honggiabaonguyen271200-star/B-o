# Thiết kế mới website S&LIFE Sneakers — ĐỌC TRƯỚC

Cập nhật 30/09/2026. Tài liệu giao việc cho trợ lý đang làm website (Claude Code). Chủ shop giao ba yêu cầu mới:

1. Làm website **đẹp và "xịn" như hai website mẫu**: **807GARAGE** (807garage.com) và **81 Sneaker** (81sneaker.vn). Chủ shop gửi video quay màn hình hai website; ảnh chụp các màn hình quan trọng nằm trong `tham-khao/`.
2. **Màu sắc website theo logo S&LIFE**: nền gradient xanh cobalt → tím → đỏ, logo trắng. Bộ logo và bảng màu đã tách sẵn trong `images/brand/`.
3. **Làm đúng bộ chuẩn bị của Codex** trong `codex/` (lệnh kiểm tra, phạm vi thẩm mỹ/UX, hiện trạng, bảng kiểm tra).

Khi tài liệu cũ mâu thuẫn với ba yêu cầu này, ưu tiên ba yêu cầu này. Ví dụ: `codex/05-PHAM-VI-THAM-MY-UX.md` đề xuất "nền trung tính ấm"; nay màu nhấn là gradient của logo, nền vẫn trắng/sáng để ảnh giày nổi bật.

## Thứ tự đọc

1. File này.
2. `codex/01-LENH-KIEM-TRA.txt` (lệnh đợt đầu) và `codex/05-PHAM-VI-THAM-MY-UX.md` (phạm vi + tiêu chí nghiệm thu).
3. `codex/03-HIEN-TRANG.md` (hiện trạng repo, luồng đơn, `orderEndpoint`) và `codex/04-BAN-KIEM-TRA.md` (chủ shop sẽ kiểm theo bảng này).
4. Mở xem **từng ảnh** trong `tham-khao/` (danh sách ở cuối file).
5. `images/brand/README.md` (cách dùng logo, màu).
6. `hien-trang-truoc/` — ảnh chụp website hiện tại ngày 30/09 để so sánh trước/sau.
7. `codex/02-LENH-THUC-HIEN.txt` — dùng sau khi chủ shop duyệt bản thử đầu tiên.

## Quy tắc giữ nguyên (không thương lượng)

- Theo `AGENTS.md`: HTML/CSS/JS thuần, không framework/npm/Tailwind/bundler; chạy trên GitHub Pages.
- Không sửa tay `data/products.js` (sinh từ bảng hàng bằng `scripts/build_products.py`). Giá theo nghìn đồng.
- Không đổi tên, xóa hay thay ảnh trong `images/products/`. Chủ shop đang tự tải ảnh lên nhánh chính.
- Shop **chỉ bán giày**, **chỉ bán online** (không có cửa hàng để khách ghé). Không làm mục "Cửa hàng của chúng tôi" như 807GARAGE.
- Giọng điềm đạm, có gu. Không "SALE SỐC", không đồng hồ đếm ngược, không giá gạch ngang giả, không review/huy hiệu/số liệu bịa. Chỉ dùng chính sách có trong `data/shop.js`.
- Không bắt chước tài sản của hai website mẫu (logo, ảnh, chữ, khuyến mãi, Fundiin, hàng quần áo). Học **bố cục, thành phần, nhịp, tương tác**, không chép.

## Cách làm và giao bản thử

- Làm trên **nhánh mới `thiet-ke-moi`** tách từ nhánh chính hiện tại. Không sửa nhánh chính cho đến khi chủ shop duyệt, vì GitHub Pages xuất bản ngay nhánh chính.
- Link xem thử bấm được, không cần cài gì: `https://raw.githack.com/honggiabaonguyen271200-star/B-o/thiet-ke-moi/index.html` (mọi đường dẫn trong site là tương đối nên chạy được). Nếu link này không chạy, báo cách xem thử khác.
- Mỗi mốc gửi: link xem thử, ảnh chụp 390px và 1440px (trước/sau) của **trang chủ, danh mục, chi tiết sản phẩm**, danh sách đã kiểm tra và việc còn thiếu.
- Chủ shop duyệt rồi mới gộp `thiet-ke-moi` vào nhánh chính. Trước khi gộp, lấy các commit ảnh mới nhất của chủ shop trên nhánh chính (merge/rebase), không ghi đè ảnh.
- Trong lúc bạn làm, không có trợ lý nào khác (Antigravity) sửa repo này.
- Giữ `HANDOFF.md` ở gốc nhánh `thiet-ke-moi`: đã làm gì, đã kiểm gì (có bằng chứng), còn thiếu gì, bước tiếp theo.

## Nhận diện S&LIFE mới

### Màu (lấy mẫu trực tiếp từ logo)

```css
:root {
  --c-cobalt: #004AAD;   /* góc trên trái logo */
  --c-indigo: #3E32AD;
  --c-violet: #771CAE;   /* giữa logo */
  --c-berry:  #AD2571;
  --c-red:    #DB3137;   /* góc dưới phải logo */
  --grad-brand: linear-gradient(135deg, #004AAD 0%, #771CAE 50%, #DB3137 100%);
  --ink:   #16122B;      /* chữ chính, hơi ngả tím */
  --ink-2: #4A4560;
  --muted: #8C879C;
  --line:  #E7E4F0;
  --mist:  #F6F4FB;      /* nền khu vực, nền ảnh sản phẩm */
  --paper: #FFFFFF;
}
```

- Chữ trắng trên mọi điểm của gradient đạt tương phản ≥ 4,6:1 (đã tính). Chữ tím/xanh trên nền trắng dùng `--c-violet` hoặc `--c-cobalt`.
- Gradient dùng có chủ đích: thanh thông báo đầu trang, nút chính, trạng thái đang chọn (chip size, bộ lọc, ô danh mục khi hover), dải thương hiệu ở trang chủ, viền/điểm nhấn footer, tiêu đề lớn dạng chữ gradient. Nền trang, card, khu ảnh giữ trắng/`--mist` như 807GARAGE để giày là nhân vật chính.
- Màu trạng thái: Hàng sẵn (xanh lá dịu), Order (tím), Hết size (xám). Không dùng đỏ cho giá.

### Chữ

- Tiêu đề lớn: chữ **condensed đậm, viết hoa** kiểu 81 Sneaker ("HÀNG MỚI VỀ", "81 SELECTION"). Gợi ý: `Barlow Condensed` 700–800 (có tiếng Việt). Có thể dùng `Dosis` 700–800 cho nhãn nhỏ để hợp nét chữ bo tròn của logo.
- Nội dung: giữ `Be Vietnam Pro`.
- Bắt buộc thử dấu tiếng Việt trước khi chốt font: "GIÀY CHÍNH HÃNG · ĐỔI SIZE 3 NGÀY · ĐỒNG KIỂM". Không dùng font không có tiếng Việt (ví dụ Bebas Neue).

### Logo

`images/brand/`: logo mark (dây giày hình chữ S), chữ S&LIFE, bản đầy đủ "Since 2021"; mỗi bản có SVG (`currentColor` hoặc gradient) và PNG trắng/gradient; favicon, apple-touch-icon, icon 192/512, ảnh vuông 1200 cho ảnh chia sẻ. Header nền trắng dùng mark gradient + chữ S&LIFE màu `--ink`; nền tối/gradient dùng bản trắng. Thay favicon chữ "S&L" hiện tại bằng `favicon-32.png`/`favicon-48.png`, thêm `apple-touch-icon.png`, `og:image` dùng `slife-logo-square-1200.jpg` khi trang không có ảnh sản phẩm.

## Học gì từ 807GARAGE — thương mại gọn, dễ mua

Xem `tham-khao/807-*.jpg`.

- **Header** (807-01, 807-11): thanh thông báo mảnh trên cùng, có nút đóng; logo trái, **ô tìm kiếm lớn** ngay header, menu chữ in hoa nhỏ, mega menu thả xuống theo hãng/dòng giày; icon giỏ, yêu thích; header dính khi cuộn.
- **Trang chủ**: banner trượt bo góc; câu định vị ngắn dưới banner; băng "Gợi ý cho bạn/Hàng mới về" dạng cuộn ngang; "Thương hiệu nổi bật" dạng ô ảnh lớn có tên hãng (807-02); khối cam kết 5 biểu tượng ngay trên footer; FAQ dạng accordion.
- **Danh mục** (807-03, 807-04): cột lọc trái: chip màu, **lưới chip size** (35.5, 36, 36 2/3…), **thanh trượt khoảng giá** kèm ô nhập, danh sách dòng giày có checkbox; sắp xếp góc phải; lưới 5 cột, card ảnh vuông nền xám nhạt, tim yêu thích góc card, tên 2 dòng, giá đậm; phân trang.
- **Chi tiết sản phẩm** (807-05, 807-06): breadcrumb; ảnh lớn có chấm chuyển ảnh; tên to, giá, link "Size Chart"; chip màu, **lưới chip size**; nút mua chính + nút phụ + tim; accordion "đổi size", "chính hãng"; nút chia sẻ; "Mô tả sản phẩm", "Về shop", "Sản phẩm liên quan" + nút "Xem thêm".
- **Footer** (807-08): dải màu thương hiệu, cột thông tin/chính sách/liên hệ/mạng xã hội.
- **Chat** (807-10): **một** nút nổi, bấm mới mở bảng chọn kênh (với S&LIFE: Zalo, Messenger, Gọi). Thay cho ba nút nổi hiện tại đang **che chữ ở khối cam kết trên điện thoại** (xem `hien-trang-truoc/trang-chu-390.jpg`).
- Không lấy: đăng nhập/tài khoản (807-09) vì site không có máy chủ; "Buy on Shopee"; mục cửa hàng vật lý; banner khuyến mãi theo tháng.

## Học gì từ 81 Sneaker — cá tính, văn hóa sneaker

Xem `tham-khao/81-*.jpg`.

- **Hero toàn màn hình** (81-01, 81-02, 81-03): ảnh lớn, chữ condensed rất to, câu ngắn có khí chất ("MORE THAN SNEAKER", "NOT JUST BUSINESS. WE ARE CULTURE"), chữ lồng ảnh. Với S&LIFE: 2–4 slide từ **ảnh giày thật đang có** (hoặc banner trong `images/banners/`) phủ gradient thương hiệu, câu đúng giọng S&LIFE, ví dụ "ONLY AUTHENTIC", "GIÀY CHÍNH HÃNG — CÓ GU", "S&LIFE · SINCE 2021". Tự chuyển có nút dừng, vuốt được trên điện thoại, tôn trọng `prefers-reduced-motion`.
- **Top danh mục** (81-04): lưới ô hãng có logo/biểu tượng + tên + số mẫu, hover đổi nền màu thương hiệu (với S&LIFE: gradient). Số mẫu lấy từ dữ liệu thật.
- **Tiêu đề khu vực** (81-05): chữ condensed in hoa, căn giữa, màu thương hiệu.
- **Cam kết** (81-06): ba–bốn biểu tượng tròn màu thương hiệu + tiêu đề + mô tả ngắn.
- **Danh mục** (81-07): hover card hiện nút "Thêm vào giỏ".
- **Chi tiết sản phẩm** (81-08, 81-09): mã + tên in hoa màu thương hiệu, nhãn "Loại/Tình trạng" dạng pill, chọn size, **bộ tăng giảm số lượng**, hai nút "Thêm vào giỏ" (đặc) + "Mua ngay" (viền), "Hover to zoom", thumbnail có mũi tên, accordion "Giao hàng và đổi trả", "Sản phẩm cùng loại".
- **Review** (81-10): lưới ảnh khách thật. Chỉ làm khi có ảnh thật trong `images/khach-hang/`; không bịa.
- **Khối đăng ký cuối trang** (81-11): nền tối, logo trong khối màu. S&LIFE không có máy chủ nhận email: đổi thành khối "Theo dõi S&LIFE" (Instagram, TikTok, Facebook, Zalo) thay vì form email.

## Bản đồ trang S&LIFE sau thiết kế

**Header chung**: thanh thông báo gradient (xoay 2–3 câu thật từ `shop.js`: chính hãng khớp tem hộp · đồng kiểm · đổi size 3 ngày); logo lockup; ô tìm kiếm có **gợi ý tức thì** (ảnh nhỏ + tên + mã + giá, tìm cả mã viết thường/hoa); menu: Hàng mới · Thương hiệu ▾ (mega menu hãng → dòng) · Theo nhu cầu ▾ (theo dữ liệu thật) · Hướng dẫn size · Liên hệ; icon yêu thích (lưu trình duyệt) + giỏ có số. Điện thoại: nút menu mở ngăn kéo toàn màn hình, ô tìm kiếm luôn thấy.

**Trang chủ** (thứ tự đề xuất): hero trượt → dải cam kết → Top danh mục (ô hãng) → Hàng mới về (cuộn ngang) → Dòng giày nổi bật (ô ảnh lớn) → khối thương hiệu "S&LIFE — Since 2021" nền gradient, câu chuyện ngắn, logo trắng → Gợi ý theo hãng (giữ các khối hãng hiện có nhưng gọn hơn, "Xem tất cả") → ảnh khách thật (nếu có) → FAQ → Theo dõi S&LIFE → footer.

**Danh mục**: breadcrumb, tiêu đề, số kết quả, sắp xếp; cột lọc trái (desktop) / bảng lọc trượt từ dưới (điện thoại): hãng, dòng giày, **chip size**, **khoảng giá kéo**, giới tính/kid nếu dữ liệu có; chip bộ lọc đang chọn + "Xóa tất cả"; trạng thái lọc giữ trên URL để bấm Back quay lại đúng chỗ; card: ảnh vuông nền `--mist`, **ảnh thứ hai khi hover**, tim, nhãn trạng thái, hãng, tên 2 dòng, mã, size còn gọn, giá; nút thêm nhanh; "Xem thêm"/phân trang; trạng thái không có kết quả có gợi ý.

**Chi tiết sản phẩm**: thư viện ảnh (zoom khi rê chuột, chạm để mở toàn màn hình, vuốt, thumbnail), tên condensed, mã, nhãn trạng thái, giá, lưu ý form (`FIT_NOTES`), chip size (hết size làm mờ), "Hướng dẫn chọn size" mở hộp thoại, số lượng, nút "Thêm vào giỏ" (gradient) + "Mua ngay" + "Tư vấn Zalo" + tim, accordion cam kết từ `shop.perks`, chia sẻ (Zalo, Facebook, sao chép link), mô tả chỉ từ dữ liệu thật, cùng dòng/cùng hãng, "Đã xem gần đây". Điện thoại: thanh mua dính đáy màn hình (giá + chọn size/thêm giỏ), nút chat không được che thanh này. `?id=` phải nhận cả chữ hoa: hiện `product.html?id=U204LMMC` báo "Không tìm thấy sản phẩm", chỉ `u204lmmc` chạy.

**Giỏ và đặt hàng**: thêm giỏ → giỏ trượt từ phải + thông báo; sửa size/số lượng; phần giao dịch làm đúng `codex/03-HIEN-TRANG.md` (không xóa giỏ trước khi có trạng thái thật, không báo "đã nhận đơn" khi chưa được xác nhận, chống gửi lặp).

**Trang phụ** (giới thiệu, liên hệ, chính sách, size guide, bảo mật): cùng hệ thiết kế, nội dung thật từ `shop.js`, không còn chỗ trống/link chết.

**Ảnh thiếu**: nhiều mẫu chưa có ảnh thật. Thay hình giày vẽ minh họa bằng ô trung tính gọn gàng: logo mark mờ + "Ảnh thật đang cập nhật" + nút "Nhắn Zalo nhận ảnh". Trung thực, không giả ảnh sản phẩm.

## Chuyển động và cảm giác "xịn"

Chuyển động nhẹ, nhất quán: card nhấc nhẹ và đổi ảnh khi hover, ảnh hiện dần khi tải, khung chờ (skeleton) thay cho màn trắng, chip/nút có trạng thái hover/active/focus rõ (vòng focus tím), mega menu và ngăn kéo trượt mượt, hero chuyển mềm, thông báo "Đã thêm vào giỏ". Tắt chuyển động khi người dùng bật `prefers-reduced-motion`. Không hiệu ứng nặng làm chậm điện thoại.

## Hiệu năng và kiểm tra

- Ảnh lazy-load, có `width/height` để không nhảy bố cục; tải trước ảnh hero; font `display=swap`.
- Kiểm ở 360/390/768/1440px: không tràn ngang, nút nổi không che nội dung, không lỗi Console (trừ ảnh 404 do mẫu chưa có ảnh — nên chặn bằng cách dò ảnh gọn hơn nếu được).
- Sửa thẻ `<main>` lồng nhau (`codex/03-HIEN-TRANG.md`), nhãn form, bàn phím, tương phản.

## Mốc đầu tiên cần giao

Trang chủ + danh mục + chi tiết sản phẩm trên nhánh `thiet-ke-moi`, cùng một gu (807GARAGE gọn gàng + 81 Sneaker cá tính, màu logo S&LIFE), bấm thử được trên điện thoại và máy tính, kèm link xem thử và ảnh trước/sau. Sau khi chủ shop duyệt: hoàn thiện trang phụ, giỏ/đơn, hiệu năng, SEO theo `codex/05-PHAM-VI-THAM-MY-UX.md`, rồi gộp vào nhánh chính.

## Danh sách ảnh tham khảo (`tham-khao/`)

| File | Nội dung cần xem |
|---|---|
| 807-01-trang-chu-hero | Header + ô tìm kiếm lớn, banner, băng "Recommended For You" |
| 807-02-brand-popular | Ô "Brand Popular" ảnh lớn theo hãng |
| 807-03-danh-muc-bo-loc | Trang danh mục: cột lọc màu/size, lưới 5 cột, tim |
| 807-04-bo-loc-size-gia | Lưới chip size, thanh trượt giá, danh sách dòng giày |
| 807-05-chi-tiet-san-pham | Trang sản phẩm: ảnh, size chart, chip size, nút, accordion |
| 807-06-mo-ta-lien-quan | Mô tả, khối "About", sản phẩm liên quan |
| 807-07-cua-hang-bai-viet | Khối bài viết (không làm mục cửa hàng vì S&LIFE bán online) |
| 807-08-footer | Dải cam kết + footer màu thương hiệu |
| 807-09-dang-nhap | Trang đăng nhập (không làm, chỉ tham khảo độ gọn) |
| 807-10-chat-admin | Bảng chat mở từ một nút nổi |
| 807-11-mega-menu | Menu thả xuống theo dòng giày |
| 81-01-hero-sell-buy-trade | Hero ảnh lớn + chữ condensed |
| 81-02-hero-chu-anh | Chữ lồng ảnh "81SNEAKER" + câu khí chất |
| 81-03-hero-more-than-sneaker | Hero "MORE THAN SNEAKER" |
| 81-04-top-danh-muc | Lưới ô hãng, hover đổi màu |
| 81-05-hang-moi-ve | Tiêu đề khu vực condensed + băng sản phẩm |
| 81-06-cam-ket | Ba cam kết biểu tượng tròn |
| 81-07-danh-muc-sidebar | Danh mục cột trái, hover hiện "Thêm vào giỏ" |
| 81-08-chi-tiet-san-pham | Trang sản phẩm: pill Loại/Tình trạng, số lượng, 2 nút |
| 81-09-thumbnail-lien-quan | Thumbnail có mũi tên, accordion, "Sản phẩm cùng loại" |
| 81-10-review | Lưới ảnh khách thật |
| 81-11-newsletter | Khối cuối trang nền tối |
