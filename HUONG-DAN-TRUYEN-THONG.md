# Truyền thông website — phần việc cần tài khoản của chủ shop

Làm theo "Kế hoạch truyền thông website S&LIFE Sneaker" (07/10). Phần code website đã làm xong ngày 17/10:
tiêu đề + mô tả Google cho từng trang mẫu, dữ liệu sản phẩm (giá, còn hàng), sitemap có cả trang hãng / dòng giày,
danh sách hàng cho Google Mua sắm (`merchant-feed.xml`), trang **Hàng mới về**, chỗ dán mã đo lường, link riêng từng kênh, mã QR.

Những việc dưới đây cần đăng nhập tài khoản của bạn nên bạn tự làm. Mỗi mã lấy được: mở `data/shop.js`, dán vào đúng ô
(giữ dấu ngoặc kép), rồi nhờ trợ lý (Antigravity / Claude) đưa lên web, hoặc mở `xem-web.bat` rồi Commit + Push.

> Nên mua tên miền trước (xem `HUONG-DAN-TEN-MIEN.md`) rồi mới làm Search Console và Merchant Center bằng tên miền đó,
> đỡ phải làm lại. Analytics, Clarity, Pixel làm lúc nào cũng được.

## 1. Google Analytics 4 — khách đến từ kênh nào (10 phút)

1. Vào https://analytics.google.com → **Bắt đầu đo lường** → đặt tên tài khoản "S&LIFE", tên thuộc tính "Website S&LIFE", múi giờ Việt Nam, tiền tệ VND.
2. Chọn nền tảng **Web** → nhập địa chỉ website → **Tạo luồng**.
3. Chép **Mã đo lường** dạng `G-XXXXXXXXXX` → dán vào `ga4Id: "G-XXXXXXXXXX",` trong `data/shop.js`.
4. Sau khi web có mã 1–2 ngày: **Quản trị → Sự kiện** → bật "Đánh dấu là sự kiện chính" cho `open_facebook` (khách bấm nhắn Facebook) và `request_sent` (khách gửi yêu cầu mua).

Website đã tự gửi các sự kiện: xem mẫu (`view_item`), thêm giỏ (`add_to_cart`), bấm Facebook (`open_facebook`), gửi yêu cầu (`request_sent`), tìm kiếm (`search`).

## 2. Google Search Console — Google thấy web thế nào (10 phút)

1. Vào https://search.google.com/search-console → **Thêm tài sản** → chọn **Tiền tố URL** → dán địa chỉ website (có dấu `/` cuối).
2. Chọn cách xác minh **Thẻ HTML**. Google đưa một dòng `<meta name="google-site-verification" content="…">`.
3. Dán **cả dòng đó** (hoặc chỉ phần trong `content="…"`) vào `googleVerify: "",` trong `data/shop.js`, mở `xem-web.bat` một lần (tự chèn vào trang chủ), đưa lên web, chờ 2 phút rồi bấm **Xác minh**.
4. Menu trái **Sơ đồ trang web** → nhập `sitemap.xml` → **Gửi**.

## 3. Microsoft Clarity — khách bấm, cuộn ra sao (5 phút, miễn phí)

1. Vào https://clarity.microsoft.com → đăng nhập → **New project** → nhập tên và địa chỉ website.
2. **Settings → Setup** → chép **Project ID** (khoảng 10 chữ, số) → dán vào `clarityId: "",`.
3. Các ô khách điền (tên gọi, chiều dài chân, ghi chú) đã được che, Clarity không ghi lại.

## 4. Meta Pixel — để sau này quảng cáo lại người đã xem web (10 phút)

1. Vào https://business.facebook.com/events_manager → **Kết nối nguồn dữ liệu → Web → Meta Pixel** → đặt tên "S&LIFE website".
2. Chép **ID tập dữ liệu / Pixel** (dãy số dài) → dán vào `metaPixelId: "",`.
3. Khi Meta hỏi **Đối sánh nâng cao tự động**: để **tắt** (website không gửi số điện thoại, email của khách).

Website gửi cho Pixel: xem trang, xem mẫu (ViewContent), thêm giỏ (AddToCart), bấm nhắn Facebook (Contact), gửi yêu cầu (Lead), tìm kiếm (Search).

## 5. Google Merchant Center — hiện miễn phí trên tab Mua sắm (20 phút)

1. Vào https://merchants.google.com → tạo tài khoản, chọn **Việt Nam**, tên doanh nghiệp "S&LIFE Sneaker", nhập website.
2. Xác minh website: chọn liên kết với Search Console (làm bước 2 trước).
3. **Cài đặt → Vận chuyển và đổi trả**: ghi đúng cách shop đang làm (phí ship theo đơn vị vận chuyển; đổi size 3 ngày nếu còn nguyên hộp, tem).
4. **Sản phẩm → Thêm sản phẩm → Thêm từ tệp → Tìm nạp theo lịch** (hằng ngày), đường link tệp:
   `https://honggiabaonguyen271200-star.github.io/B-o/merchant-feed.xml` (đổi theo tên miền khi có).
5. Danh sách tự cập nhật mỗi lần bạn cập nhật bảng hàng. Chỉ mẫu còn hàng, có ảnh mới vào danh sách — luôn gỡ mẫu đã bán trong ngày để không bị Google khoá.

## 6. Link riêng cho từng kênh (dán đúng link vào đúng chỗ)

Mỗi kênh một link để Analytics tách được kênh nào mang khách về (mục **Thu nạp → Thu nạp lưu lượng truy cập**).
Gửi link một mẫu cụ thể thì thêm đuôi kênh vào sau link mẫu, VD `…/sp/cw2288-111.html?utm_source=messenger&utm_medium=chat`.

| Dán ở đâu | Link |
| --- | --- |
| TikTok — link bio (khi đủ điều kiện) | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=tiktok&utm_medium=social&utm_campaign=bio` |
| TikTok — bình luận ghim dưới video | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=tiktok&utm_medium=social&utm_campaign=video` |
| Instagram s.life_sneakers — bio | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| Instagram s.life_sneakers — sticker link Story | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=instagram&utm_medium=social&utm_campaign=story` |
| Instagram s.life_garment — bio | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=instagram_garment&utm_medium=social&utm_campaign=bio` |
| Facebook cá nhân — giới thiệu, bài ghim | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=facebook&utm_medium=social&utm_campaign=ca_nhan` |
| Facebook Page S&LIFE Sneaker — ô website, caption | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=facebook_page&utm_medium=social&utm_campaign=page` |
| Nhóm Facebook — bài đăng, bình luận | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=facebook_group&utm_medium=social&utm_campaign=nhom` |
| Threads — trang cá nhân | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=threads&utm_medium=social&utm_campaign=bio` |
| Messenger — câu trả lời nhanh | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=messenger&utm_medium=chat&utm_campaign=tra_loi_nhanh` |
| Zalo | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=zalo&utm_medium=chat&utm_campaign=tin_nhan` |
| Tin nhắn báo khách cũ | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=messenger&utm_medium=chat&utm_campaign=khach_cu` |
| Creator / KOC (mỗi người một tên) | `https://honggiabaonguyen271200-star.github.io/B-o/?utm_source=creator&utm_medium=koc&utm_campaign=TEN-NGUOI` |
| Mã QR trên thẻ cảm ơn, tem hộp | đã có sẵn trong `docs/truyen-thong/qr-the-cam-on.png` (in) và `.svg` (thiết kế) |

Khi có tên miền: thay phần `https://honggiabaonguyen271200-star.github.io/B-o/` bằng tên miền mới, nhờ trợ lý tạo lại mã QR
(`siteUrl` trong `data/shop.js`). Link cũ vẫn mở được vì GitHub tự chuyển sang tên miền mới.

## 7. Trang "Hàng mới về"

Mỗi lần cập nhật bảng hàng, mẫu mới (hoặc mẫu hết rồi có lại) được ghi ngày vào `data/ngay-ve.json`.
Trong 14 ngày, mẫu đó có nhãn **Mới về**, nằm ở trang `shop.html?moi=1`; menu có mục **Mới về** khi có mẫu mới,
trang chủ có khối "Hàng mới về" khi có từ 4 mẫu. Link mời khách xem mỗi tuần:
`https://honggiabaonguyen271200-star.github.io/B-o/shop.html?moi=1&utm_source=facebook&utm_medium=social&utm_campaign=hang_moi`
