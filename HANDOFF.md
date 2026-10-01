# HANDOFF — Thiết kế mới S&LIFE Sneaker (nhánh `thiet-ke-moi`)

Cập nhật 01/10/2026 · **Mốc 4**: logo hãng + hệ màu mới (xem mục "Mốc 4"). **Mốc 3**: làm theo 8 góp ý của chủ shop (logo, nhãn hãng, menu, Facebook thay Messenger, bỏ "Gửi yêu cầu mua", bảng size, bỏ "Mới về", hết lỗi 404). Nối tiếp mốc 2b và mốc 2 (bên dưới).

Nhánh chính `claude/shoe-shop-website-3dln52` **chưa bị sửa**: web khách đang xem vẫn là bản cũ. Chưa gộp, chưa mua dịch vụ, chưa tạo tài khoản nào, chưa ghi vào Google Sheet thật.

> Từ mốc 3, kênh tư vấn là **Facebook** (`facebookChat` trong `data/shop.js`). Các chỗ ghi "Messenger" ở mục mốc 2 / 2b bên dưới là lịch sử, không còn đúng.

## Chủ shop cần duyệt

**Mốc 4 — giao diện mới (xem ảnh trong `docs/thiet-ke-moi/so-sanh-moc-4/`):**

- **Còn thiếu logo Puma.** Gửi file logo Puma (nền trắng, logo đen, giống các logo khác) thì ô Puma sẽ có logo; hiện đang ghi chữ "PUMA".
- **Higgsfield:** không có trong danh mục kết nối của Claude, nên Claude không tự kết nối được (và không tạo tài khoản thay bạn). Giao diện mới làm bằng CSS và logo / ảnh thật của shop. Website **không dùng ảnh giày do AI vẽ** (quy tắc "chỉ ảnh thật").
- Logo các hãng hiện **một màu mực**, rê chuột đổi sang tím, để tường logo đồng đều. Muốn giữ màu gốc (VD Asics xanh navy) thì báo.

**Nút Facebook — cập nhật 01/10 theo video bạn gửi (thử lại giúp):**

1. **Điện thoại:** bấm nút Facebook (icon đầu trang, "Tư vấn qua Facebook", "Chép tin nhắn và mở Facebook shop") là **mở thẳng app Facebook**, vào trang `honggiabaoslife`.
   - Android: gọi thẳng app Facebook (gói `com.facebook.katana`).
   - iPhone: gọi app Facebook qua `fb://`.
   - Đang ở trong app Facebook / Messenger: mở ngay tại đó.
   - Máy không có app hoặc app (Zalo, TikTok…) chặn: sau khoảng 1,5 giây tự mở link Facebook như thường.
   - Ở trang sản phẩm, sau khi bấm, vào khung chat và **dán**: phải có tên mẫu, mã, size đã chọn, giá, link.
   - **iPhone:** đã điền ID số `100080431367928` (chủ shop gửi 01/10) vào `facebookId`, nên iPhone mở thẳng `fb://profile/100080431367928` trong app.
     - **Cần kiểm 1 lần:** mở `https://www.facebook.com/profile.php?id=100080431367928`. Phải ra đúng trang Nguyễn Hồng Gia Bảo.
     - Lý do: số "userId" trong mã nguồn trang là của tài khoản **đang đăng nhập**. Nếu lúc đó bạn đăng nhập bằng tài khoản khác thì số sẽ sai.
     - Sai thì xoá số trong `facebookId` (để `""`), iPhone sẽ mở bằng link thường.
2. **Máy tính — vì sao video của bạn mở Edge:** bạn đang xem web bằng **Edge**, nên link mở trong Edge.
   - Trang web **không có cách nào tự bật Chrome** từ Edge (Windows không cho, Chrome cũng không có lệnh mở từ web).
   - Khách xem web bằng **Chrome** thì link Facebook mở ngay trong Chrome, đã đăng nhập sẵn.
   - Xem web bằng trình duyệt khác (Edge, Cốc Cốc, Firefox): bấm nút Facebook sẽ hiện hộp nhỏ **"Mở Facebook của shop"**, có 3 lựa chọn:
     - **Sao chép link Facebook shop**: dán vào Chrome;
     - **Sao chép tin nhắn**: dán vào khung chat;
     - **Mở luôn bằng Edge**: có ô "lần sau không hỏi lại".
   - Ảnh hộp chọn: `docs/thiet-ke-moi/so-sanh-moc-3/07-hop-chon-trinh-duyet-edge.jpg`.
   - Muốn bỏ hộp này: đặt `desktopAskChrome: false` trong `data/shop.js`.
   - **Mẹo cho chính bạn:** đặt Chrome làm trình duyệt mặc định (Windows: Cài đặt → Ứng dụng → Ứng dụng mặc định → Google Chrome → Đặt mặc định). Khi đó link từ Zalo, Antigravity… đều mở bằng Chrome.
3. **Logo đầu trang:** giờ là logo gốc ô vuông (đủ "S&LIFE" và "Since 2021"), cao 52px trên điện thoại, 62px trên máy tính. Ở cỡ này chữ "Since 2021" rất nhỏ nhưng không bị cắt. Muốn logo to hơn thì báo, header sẽ cao thêm.

**Bảng size — cần bạn xem lại 4 điểm:**

4. **Salomon:** ảnh bạn gửi là bảng của trang **giày trượt tuyết** (S/PRO DELTA Ski Boots), số đo theo khoảng (VD chân 26–26,9 cm → EU 41 – 42 2/3).
   - Claude chép đúng như ảnh và bỏ hai cột chỉ dành cho boot trượt tuyết (dài đế, độ rộng).
   - Nên thay bằng bảng size **giày** (footwear) của Salomon nếu có.
   - Vì là khoảng nên web không tô "còn" cho Salomon.
5. **Nike trẻ em:** ảnh chỉ có bảng "Younger kids" từ 8C tới 12C (EU 25–29,5). Bảng GS (trẻ em lớn, EU 35,5–40) **chưa có ảnh**. Mẫu GS của Nike/Jordan đang mở bảng Nam.
6. **Adidas trẻ em lớn (8–16 tuổi):** ảnh chỉ thấy tới EU 40 và đo bằng inch (không có cm). Web ghi đúng như ảnh.
7. **Nike** và **On**: ảnh không có thanh địa chỉ (Nike) hoặc là bảng trong trang một mẫu giày (On); web ghi nguồn là "nike.com" / "on.com". Các hãng khác ghi đúng đường link trong ảnh.

**Câu trả lời trước vẫn giữ:**

8. Đã bỏ câu "Sai size do shop tư vấn: shop chịu phí đổi" (theo WEB-69). Muốn giữ thì báo.
9. **Sitemap bỏ các trang hãng.** Muốn Google thấy thêm trang hãng thì báo.

**Giả định đã chọn (không phản đối thì giữ):**

10. **Trang sản phẩm chỉ còn hai nút: Thêm vào giỏ + Tư vấn qua Facebook.** Mua một đôi: bấm "Tư vấn qua Facebook" (thông tin mẫu + size đã chép sẵn). Mua nhiều đôi: thêm vào giỏ → **Gửi yêu cầu cho shop** (trang này vẫn giữ, giờ chỉ còn **một nút** "Chép tin nhắn và mở Facebook shop").
11. Bỏ nhãn hãng nhỏ trên **mọi** thẻ sản phẩm (trước đây chỉ hiện khi tên mẫu không bắt đầu bằng tên hãng, VD "Air Jordan 4"). Tên hãng vẫn có ở trang sản phẩm.
12. Menu "Thương hiệu": chữ dòng giày 14 → 16px, tên hãng 20 → 22px.
13. **Ảnh:** web chỉ hiện ảnh có trong danh sách (`images/products/danh-sach.js`, `images/anh-khac.js`) nên không còn lỗi 404. Hai danh sách **tự cập nhật mỗi lần bấm đúp `xem-web.bat`**, dùng anh.html hoặc kéo thả vào `cap-nhat-hang.bat` / `nhap-anh-zip.bat`. Chép ảnh tay mà chưa mở `xem-web.bat` thì ảnh **chưa hiện** — nhớ mở rồi Commit cả file danh sách.
14. Size đã hết vẫn hiện mờ trong dải size của hãng (bấm vào thì mời nhắn Facebook). Mỗi size 1 đôi trong giỏ. Giữ lọc "Dành cho" (code nữ/GS). Mô tả link chia sẻ chỉ ghi giá, không ghi size.

**Tuỳ chọn:** cài sổ yêu cầu theo `HUONG-DAN-DON-HANG.md`; tạo Google Analytics 4 và dán `ga4Id` vào `shop.js`.

**Trước khi gộp (Claude làm khi bạn duyệt):**

- lấy commit ảnh mới trên nhánh chính (merge, không ghi đè ảnh);
- chạy `python scripts/static_pages.py` (cập nhật danh sách ảnh, trang chia sẻ, sitemap);
- chạy lại bộ kiểm tra;
- rồi mới gộp vào `claude/shoe-shop-website-3dln52`;
- sau khi gộp: kiểm link chia sẻ bằng https://developers.facebook.com/tools/debug/ (mốc 2b — **chưa kiểm**).

## Xem thử

- **Link:** https://raw.githack.com/honggiabaonguyen271200-star/B-o/thiet-ke-moi/index.html
  - Máy làm việc của Claude bị chặn truy cập raw.githack, nên chưa tự mở kiểm được link này.
  - Nếu link không chạy: trong Antigravity chuyển sang nhánh `thiet-ke-moi` rồi chạy `xem-web.bat`.
  - Xem xong nhớ chuyển lại nhánh chính trước khi tải ảnh mới.
- **Ảnh mốc 3** (logo, menu Thương hiệu, nút Facebook, điện thoại, bảng size): `docs/thiet-ke-moi/so-sanh-moc-3/`.
- **Ảnh trước/sau mốc 2** (web đang chạy ↔ bản mới): `docs/thiet-ke-moi/so-sanh-moc-2/` — trang chủ, danh mục, sản phẩm, gửi yêu cầu; mỗi trang ở 390px và 1440px.
- **Ảnh so sánh font:** `docs/thiet-ke-moi/font/so-sanh-font.png` (mở thử: `so-sanh-font.html`).
- **Ảnh mốc 1** vẫn ở `docs/thiet-ke-moi/so-sanh/`.

## Mốc 4 — đã làm (01/10): logo hãng, hệ màu có chủ đích

**Vì sao đổi:** trước đây gradient logo phủ lên gần như mọi thứ (thanh chữ đầu trang, banner, nút, ô đang chọn, vạch footer, ô hãng khi rê chuột), nên nhìn đơn điệu và rối.

**Giờ mỗi màu có một việc riêng:**

| Màu | Dùng cho |
|---|---|
| **Gradient** | chỉ còn ở **logo S&LIFE** và **banner đầu** |
| **Mực** `#15112B` | chữ, nút chính "Thêm vào giỏ", thanh chữ đầu trang, ô đang chọn trong danh mục |
| **Tím** `#771CAE` | size đang chọn, thanh giá, số bộ lọc, logo hãng khi rê chuột |
| **Cobalt** `#004AAD` | rê chuột lên nút, link |
| **Đỏ** `#DB3137` | chỉ số lượng trong giỏ |
| **Xanh Facebook** | riêng các nút Facebook |

- **Banner đầu kiểu "sân khấu":** nền mực, ba vệt đèn cobalt → tím → đỏ chiếu sau ảnh giày; ảnh giày đặt thẳng, không xoay.
- **Cam kết:** bốn biểu tượng mỗi cái một màu của logo trên nền nhạt.
- **Tiêu đề khu vực:** dấu nhấn là ba vạch màu tách rời (không còn gradient).
- **"Theo thương hiệu":** tường logo thật của 8 hãng bạn gửi (`images/brands/`); ô "Tất cả hàng sẵn" nền mực. Trang hãng (VD Giày Jordan) có logo hãng trên tiêu đề.
- **Đã bỏ:** vạch gradient ở footer, chữ gradient ở ô dòng giày, nền gradient nhạt ở ô dòng giày.
- **Đã kiểm:** 47/47 hành trình đạt, 0 lỗi 404, Console sạch, axe 0 lỗi; ảnh ở 1440px và 390px.

## Mốc 3 — đã làm (01/10)

1. **Logo nguyên vẹn:**
   - Header dùng đúng logo gốc bạn gửi (ô vuông gradient, mark + S&LIFE + Since 2021), thu nhỏ thành `images/brand/slife-logo-square-192.webp` (5 KB).
   - Không vẽ lại, không cắt chữ.
2. **Bỏ nhãn hãng trên thẻ sản phẩm** ở mọi trang (danh mục, trang chủ, gợi ý).
   - Đã rà các chỗ khác: gợi ý tìm kiếm, giỏ, trang sản phẩm đều hiện thống nhất, không có kiểu "mẫu có mẫu không".
3. **Menu "Thương hiệu" chữ to hơn một chút:** dòng giày 16px, tên hãng 22px, số mẫu 13px.
4. **Facebook thay Messenger ở mọi nơi:** header, menu điện thoại, trang chủ, trang sản phẩm, giỏ, gửi yêu cầu, liên hệ, giới thiệu, chính sách, bảo mật, FAQ, footer.
   - Link: `facebookChat: "https://www.facebook.com/honggiabaoslife/"`.
   - Cách mở: xem mục cần duyệt số 1–2 (điện thoại mở app Facebook; máy tính không dùng Chrome thì hiện hộp chọn).
   - Trang Liên hệ bỏ dòng "Facebook cá nhân" (trùng nút chính).
5. **Bỏ nút "Gửi yêu cầu mua"** ở trang sản phẩm. Thay chỗ đó là "Tư vấn qua Facebook": bấm là mở thẳng Facebook, **không qua hộp thoại**, thông tin mẫu + size đã chép sẵn.
   - Trang Gửi yêu cầu (từ giỏ) gộp "Sao chép" + "Mở" thành **một nút**.
6. **Bảng size 8 hãng** (New Balance, Asics, Onitsuka Tiger, Adidas, Nike/Jordan, Puma, Salomon, On), chép từ 27 ảnh bạn gửi:
   - Mỗi hãng có bảng **Nam / Nữ / Trẻ em** nếu ảnh có. Bấm để đổi bảng.
   - Mẫu code nữ mở sẵn bảng Nữ. Bảng mở sẵn luôn là bảng chứa size shop đang có, size đó được tô "còn".
   - Dưới bảng ghi nguồn (trang của hãng).
   - **Cách chọn size** chung cho mọi hãng (theo ảnh Onitsuka bạn gửi) ở trang Hướng dẫn size và hộp "Hướng dẫn chọn size".
   - Adidas EU dạng "36 2/3" được hiểu là size "36,5" trong bảng hàng của shop.
   - Không đoán số nào; chỗ ảnh thiếu ghi ở mục cần duyệt số 4–7.
7. **Bỏ đề xuất cột "Mới về".**
8. **Hết lỗi 404:**
   - Web không dò tên file ảnh nữa mà đọc danh sách ảnh.
   - Banner và ảnh khách có danh sách riêng `images/anh-khac.js`; `scripts/static_pages.py` tạo hai danh sách và chạy mỗi lần mở `xem-web.bat`.
   - Trang nội bộ anh.html cũng không dò nữa.

**Đã kiểm sau mốc 3:**

- **15 trang** (kể cả anh.html và link `sp/`) ở 390px và 1440px: **0 lỗi 404, Console sạch**.
- **45/45 kiểm tra hành trình đạt.** Các kiểm tra mới: logo gốc; không còn nhãn hãng; không còn nút "Gửi yêu cầu mua"; nút Facebook mở đúng `facebook.com/honggiabaoslife` và đã chép mã, size, giá, link.
- axe-core 0 lỗi trên 9 trang.
- Không tràn ngang ở 360 / 390 / 768 / 1024px, kể cả khi mở bảng Nike 6 cột ở 360px.
- **Nút Facebook theo từng loại máy** (bản 01/10 sau video; giả lập trình duyệt bằng chuỗi nhận dạng, không phải máy thật):

  | Loại máy | Kết quả |
  |---|---|
  | Android (Chrome, Zalo, Cốc Cốc) | gọi app Facebook (`intent://…package=com.facebook.katana`) |
  | iPhone (Safari, Zalo, Chrome) | gọi app Facebook (`fb://facewebmodal/…`) |
  | Trong app Facebook | mở ngay trong app |
  | Máy tính Chrome | mở tab Facebook |
  | Máy tính Edge / Cốc Cốc | hiện hộp chọn |

  - Máy thử không có app Facebook, nên các trường hợp gọi app tự mở link Facebook sau 1,6 giây — đúng như thiết kế dự phòng.
  - Hộp chọn trên Edge: nút 1 chép đúng link Facebook, nút 2 chép đúng tin nhắn mẫu + size.
  - "Mở luôn" mở tab Facebook. Đánh dấu "không hỏi lại" thì lần sau mở thẳng.
  - Kết quả kiểm tra: **47/47 hành trình đạt**, 0 lỗi 404, Console sạch, axe 0 lỗi.
- Bảng size mở sẵn đúng bảng:
  - Nike code nữ → Nữ;
  - On (size 36,5–39) → Nữ;
  - Jordan GS → Nam (vì bảng trẻ nhỏ không có size đó).

## Mốc 2b — đã làm (đêm 30/09)

> Mục "Hàng mới về" / cột "Mới về" đã bỏ theo yêu cầu chủ shop (mốc 3).

1. **Ô "Dòng giày nổi bật" chưa có ảnh:**
   - Trước: hai lớp chữ chồng nhau ở 360/390px.
   - Giờ: tên hãng nhỏ phía trên, **tên dòng ghi một lần**, số mẫu phía dưới.
   - Ô có ảnh thật vẫn dùng ảnh thật.
   - Đã chụp kiểm ở 360 và 390px, cả khi có font và khi font chưa tải.
2. **"ONLY AUTHENTIC" khi font chưa tải:**
   - Thêm font dự phòng `Bricolage Fallback`: lấy Arial/Helvetica/Roboto có sẵn trên máy, thu nhỏ bằng `size-adjust: 72%` cho vừa khổ chữ hẹp.
   - Tiêu đề lớn được phép xuống dòng thay vì tràn.
   - Đã kiểm khi chặn tải font: không tràn ngang ở 360/390px.
3. **Link chia sẻ có ảnh xem trước:** script mới `scripts/static_pages.py` tự chạy sau `build_products.py`, `import_image_zip.py`, `extract_images.py`, `xem-web.bat`. Nó tạo:
   - `sp/<mã>.html` cho **393 mẫu còn hàng**:
     - có `og:title` (tên + mã), `og:description` (giá), `og:image`, `canonical` → `product.html?id=…`;
     - tự chuyển sang trang sản phẩm bằng JavaScript. Facebook không chạy JavaScript nên vẫn đọc được ảnh và tên.
   - `og:image`:
     - 16 mẫu có ảnh thật: `sp/anh/<MÃ>.jpg`, đổi sang JPEG vì Facebook đọc JPEG chắc chắn hơn WebP; tổng ~1 MB;
     - 377 mẫu chưa ảnh: logo S&LIFE.
   - `404.html`: mẫu đã bán hết thì trang `sp/` bị xoá, nhưng link cũ khách giữ vẫn tự mở trang sản phẩm (báo tạm hết size).
   - **Tin nhắn tư vấn, tin nhắn Gửi yêu cầu (mỗi mẫu một link), nút Chia sẻ Facebook, Sao chép link** đều dùng link `sp/`.
   - Không sửa tay `products.js`.
   - **Chưa kiểm bằng Facebook Sharing Debugger** (xem mục cần duyệt số 6).
4. **`sitemap.xml`:**
   - Chỉ còn 7 trang chính + 393 mẫu còn hàng (400 link), `lastmod` = ngày chạy script.
   - `robots.txt` chặn thêm `yeu-cau.html`.
5. **Tốc độ:**
   - **Tải trước ảnh giày ở banner đầu trang:** script ghi dòng `preload` vào `index.html`, chọn đúng ảnh web sẽ hiện (đã kiểm khớp).
   - Ảnh banner và ảnh chính trang sản phẩm **hiện ngay, không mờ dần 0,35 giây** — vì hiệu ứng mờ làm Google tính LCP muộn hơn.
   - **Tách `app.js`:** chỉ tách phần gọn:
     - công cụ ảnh nội bộ của `anh.html` → `assets/js/anh.js`, chỉ tải ở trang đó;
     - `app.js` của khách giảm từ 43 KB xuống 38,6 KB (đã nén).
   - **Chưa tách tiếp** trang chủ / danh mục / sản phẩm:
     - chúng dùng chung khoảng 30 hàm, tách ra phải chuyển mọi chỗ gọi hàm qua một đầu mối chung, dễ sót lỗi;
     - lợi ích ước tính chỉ ~20 KB ≈ 0,1 giây trên 4G yếu.
   - **Đo lại cùng điều kiện mốc 2** (điện thoại 390px, CPU ×4, gzip, trung vị 3 lần). Bảng so sánh bản mốc 2 → bản 2b:

| Mạng | Trang | FCP | LCP | Tải xong | Dữ liệu tải |
|---|---|---|---|---|---|
| 4G ổn định (9 Mbps, 60 ms, CPU x4) | Trang chủ | 0.38s → 0.36s | **1.78s → 1.32s** | 1.48s → 1.60s | 274 → 271 KB |
| 4G ổn định (9 Mbps, 60 ms, CPU x4) | Danh mục | 0.34s → 0.35s | 1.60s → 1.63s | 1.49s → 1.48s | 466 → 463 KB |
| 4G ổn định (9 Mbps, 60 ms, CPU x4) | Sản phẩm | 1.07s → 1.20s | **1.57s → 1.30s** | 1.16s → 1.83s | 730 → 726 KB |
| 4G yếu (1,6 Mbps, 150 ms, CPU x4) | Trang chủ | 0.77s → 0.86s | **2.39s → 1.68s** | 2.63s → 2.65s | 274 → 271 KB |
| 4G yếu (1,6 Mbps, 150 ms, CPU x4) | Danh mục | 0.81s → 0.78s | 2.62s → 2.52s | 3.59s → 3.55s | 466 → 463 KB |
| 4G yếu (1,6 Mbps, 150 ms, CPU x4) | Sản phẩm | 1.56s → 1.62s | **2.66s → 2.12s** | 5.11s → 5.10s | 730 → 726 KB |

   Kết luận trung thực:

   - **LCP trang chủ nhanh hơn 26–30%, trang sản phẩm nhanh hơn 17–20%.** Mọi phép đo LCP giờ dưới 2,5 giây (mức "tốt" của Google).
   - Danh mục gần như không đổi.
   - Chênh lệch FCP (±0,1s) và "tải xong" trang sản phẩm trên 4G ổn định (1,16 → 1,83s) nằm trong dao động giữa các lần đo. Cột này gồm cả ảnh tải sau, khách không phải chờ.
   - Muốn nhanh hơn nữa: viết sẵn banner đầu trang vào HTML (không chờ JavaScript) — để sau.
6. **Bảng size 6 hãng:** không vào được web chính thức (xem mục cần duyệt số 3), nên **không thêm số nào**.

**Đã kiểm lại sau mốc 2b:**

- 42/42 kiểm tra hành trình đạt; kiểm tra "tin nhắn tư vấn có link" giờ đòi link `sp/`.
- axe-core 0 lỗi trên 9 trang.
- Không tràn ngang ở 360 / 390 / 768 / 1024px.
- Không lỗi JavaScript.
- Kiểm riêng mốc 2b:
  - `sp/ct60scl1.html` chuyển đúng sang trang sản phẩm; ảnh og tải được (image/jpeg);
  - mẫu chưa ảnh dùng logo; link `sp/` của mẫu không còn thì 404.html chuyển đúng;
  - preload trùng ảnh banner; không cảnh báo "preload không dùng";
  - tin nhắn và nút Facebook dùng link `sp/`;
  - `anh.html` vẫn chạy sau khi tách file;
  - `build_products.py` chạy thử trên bản sao với bảng thử: tạo đúng `sp/`, sitemap, và xoá trang của mẫu đã hết.

## Mốc 2 — đã làm theo câu trả lời WEB

### A. Thay đổi bắt buộc

1. **Messenger Facebook cá nhân là kênh tư vấn và chốt đơn** (WEB-01, WEB-03).
   - **Link:** `data/shop.js` → `messenger: "https://m.me/honggiabaoslife"`.
   - **Chỗ có nút Messenger:** icon ở header, menu điện thoại, trang sản phẩm ("Tư vấn size qua Messenger"), ô ảnh thiếu ("Nhắn Messenger xin ảnh thật"), khối "Chưa chắc size?", footer, trang Liên hệ, trang Gửi yêu cầu.
   - **Tin nhắn soạn sẵn:** Messenger không cho điền sẵn nội dung, nên web soạn tin nhắn (tên mẫu, mã, size, giá, số cm chân, link) và có hai nút **Sao chép tin nhắn** + **Mở Messenger**.
   - **Zalo và số điện thoại** chỉ còn một dòng nhỏ "Kênh phụ" ở trang Liên hệ.
2. **Chỉ hiện hàng sẵn** (WEB-36).
   - Danh mục, tìm kiếm, gợi ý và các khối hãng chỉ tính mẫu còn size (393 mẫu).
   - Bỏ nhãn "Hết size · nhận order" và lọc "hiện mẫu hết size".
   - Ai vào thẳng link một mẫu đã hết thì thấy "Tạm hết size — nhắn Messenger để shop tư vấn" (WEB-48).
3. **Bỏ COD cọc 30%, không hiện số tài khoản/VietQR** (WEB-56, WEB-57).
   - Câu dùng thống nhất: "Shop xác nhận size, phí ship và tiền cọc qua Messenger. Website không thu tiền."
   - Số tài khoản vẫn nằm trong `shop.js` nhưng không hiện ở đâu.
4. **Ẩn Yêu thích** (WEB-45): cờ `features: { wishlist: false }` trong `shop.js`. Đổi thành `true` là bật lại, code vẫn giữ.
5. **Tên "S&LIFE Sneaker"** (WEB-21): sửa ở tiêu đề trang, mô tả, footer, dữ liệu có cấu trúc, nội dung.
6. **Font mới — Bricolage Grotesque** (WEB-23).
   - So sánh 3 phương án, đều có đủ dấu tiếng Việt, kể cả dấu chồng (Ổ, Ễ, Ồ):
     - Archivo (một họ chữ);
     - Big Shoulders Display + Hanken Grotesk;
     - **Bricolage Grotesque** (một họ chữ).
   - **Lý do chọn Bricolage:** nét có cá tính nhưng dễ đọc ở cỡ nhỏ; một họ chữ cho cả tiêu đề (bản hẹp, in hoa) và nội dung, nên nhẹ hơn và thống nhất; không thuộc nhóm font "AI hay dùng".
   - **Dung lượng font:** 120 KB, đã bỏ trục opsz; bản cũ Be Vietnam Pro 5 độ đậm là 232 KB.
   - Hai phương án còn lại xem trong ảnh so sánh.
   - **Lưu ý khi chỉnh CSS sau này:** tiêu đề in hoa cần khoảng cách dòng ≥ 1.05 để dấu chồng không đè lên dòng trên.
7. **Ít chuyển động, không nút nổi che nội dung** (WEB-25).
   - Bỏ nút chat nổi.
   - Hero không tự chuyển (khách bấm chấm, mũi tên hoặc vuốt).
   - Dòng chữ đầu trang đứng yên: máy tính hiện cả 3 câu, điện thoại hiện câu đầu.
   - Bỏ phóng ảnh khi rê chuột trên thẻ.
   - Gradient chỉ còn ở hero đầu tiên, nút chính và vạch nhấn dưới tiêu đề. Tiêu đề khu vực đổi sang chữ mực; biểu tượng cam kết đổi sang viền.
   - Không có pop-up tự bật.
8. **Chính sách theo câu trả lời** (WEB-62 đến WEB-69), ở trang Chính sách, accordion trang sản phẩm và FAQ:
   - SPX Express / Viettel Post; phí ship do đơn vị vận chuyển tính, shop báo khi xác nhận; Hà Nội, TP.HCM có thể giao trong ngày; không hứa miễn ship;
   - đồng kiểm: shop xác nhận riêng từng đơn;
   - đổi size 3 ngày, còn nguyên hộp, tem, chưa đi ngoài trời;
   - đổi theo nhu cầu thì khách chịu phí ship; giao sai hoặc lỗi đã xác nhận thì shop đổi hoặc hoàn tiền và chịu phí;
   - thông tin pháp lý và thuế chưa đưa lên (WEB-70).
9. **Trang sản phẩm, trước nút mua:** giá, size, tình trạng hàng, **lưu ý form** và **bảng size theo hãng** (EU · US · UK · cm; tô đậm size mẫu đang có) — WEB-38, WEB-44.
   - Bỏ phần tình trạng hộp / "Mới · đủ hộp" (WEB-39 bỏ qua).
   - Bỏ bộ tăng giảm số lượng: mua nhiều đôi thì trao đổi trong tin nhắn (WEB-47).
10. **Bộ lọc** (WEB-41): hãng, **dòng giày** (trong trang hãng, hoặc khi chọn 1–3 hãng), size, giá; giữ "Dành cho" (code nữ/GS) thu gọn; bỏ lọc màu.
    - **Tìm kiếm** (WEB-42): theo mã, tên và **biệt danh** — `aliases` trong `shop.js`, ví dụ af1, aj1, nb, mexico, panda, tennis, chạy bộ. Gõ không dấu được.
11. **Nội dung:**
    - Trang chủ dẫn tới "Hàng sẵn, mua ngay" ngay sau hero, rồi theo hãng, theo nhu cầu, dòng giày nổi bật, khối **"Chưa chắc size?"** (nỗi lo lớn nhất ở WEB-15), mẫu theo hãng, FAQ 8 câu, theo dõi.
    - Trang giới thiệu viết ngắn: cách chọn/kiểm hàng, cách tư vấn/chăm sóc.

### B. Luồng mua (WEB-46 đến WEB-60, WEB-81)

**Giỏ → "Gửi yêu cầu cho shop"** (`dat-hang.html`):

- Các ô tên gọi, số cm chân, tỉnh/thành, ghi chú đều không bắt buộc. Không hỏi số điện thoại hay địa chỉ.
- Web soạn tin nhắn có **mã yêu cầu** (dạng `SL261001-AB12`) → khách bấm **1. Sao chép tin nhắn** → **2. Mở Messenger**.

**Giỏ không tự xoá:**

- Chỉ xoá khi khách bấm "Tôi đã gửi cho shop — xoá giỏ" (có hỏi lại).
- Không có câu "đã nhận đơn" ở bất cứ đâu.
- Mất mạng thì báo thật, giữ giỏ (WEB-49).

**Link tóm tắt yêu cầu** `yeu-cau.html?r=…` (WEB-60):

- Dữ liệu nằm ngay trong link, không cần máy chủ.
- Khi mở ra: đúng mẫu, size, ảnh; ghi rõ "không phải trạng thái đơn"; có nút thêm lại vào giỏ.
- Trang có `noindex` để Google không đưa lên kết quả tìm kiếm.

**Sổ yêu cầu Google Sheet (tuỳ chọn):**

- Code: `scripts/google-apps-script-don-hang.gs`. Hướng dẫn chủ shop tự cài: `HUONG-DAN-DON-HANG.md`.
- **Chống ghi trùng hai lớp:**
  - web giữ nguyên mã yêu cầu khi giỏ không đổi, và chỉ gửi một lần cho mỗi mã (kể cả tải lại trang);
  - Apps Script bỏ qua mã đã có trong sổ.
- **Chống dữ liệu xấu:** chặn công thức (`=`, `+`, `-`, `@`), kiểm tra tên hàm callback.
- Dùng JSONP (GET) để web **biết chắc** đã ghi hay chưa: báo "Đã ghi vào sổ… chưa phải đơn đã xác nhận", hoặc "Chưa ghi được — vẫn gửi Messenger bình thường".
- **Chưa có `orderEndpoint` thì luồng Messenger vẫn chạy đủ.** Link Google Sheet riêng của chủ shop không đưa vào repo.

**Cập nhật tồn kho khi khách cọc** (WEB-54, WEB-76): thêm mục F vào `HUONG-DAN-ANTIGRAVITY.md`.

### Trang phụ

- **Giới thiệu, Liên hệ** (Messenger là nút chính), **Mua hàng · giao hàng · đổi size** (có mục lục), **Hướng dẫn size** (lưu ý form + bảng size từ `shop.js`), **Bảo mật** (viết lại đúng luồng mới: web không thu số điện thoại, địa chỉ hay thanh toán), **Giỏ hàng**, **Gửi yêu cầu**.
- Bỏ các link Facebook/Instagram Garment ở trang Liên hệ, vì web chỉ bán giày.

### C. Đo lường, tốc độ, truy cập

**Đo lường:**

- Mọi sự kiện đi qua hàm `track()`: xem mẫu, tìm, lọc, thêm giỏ, bắt đầu gửi yêu cầu, sao chép tin nhắn, mở Messenger, đã gửi.
- Hiện chỉ lưu tạm trong `window.slifeEvents` — **chưa gửi đi đâu**.
- Đề xuất công cụ miễn phí: **Google Analytics 4**. Chủ shop tự tạo tài khoản, lấy mã `G-…`, dán vào `ga4Id` trong `shop.js`; web tự nạp và gửi đúng các sự kiện trên.

**Tốc độ** — đo cùng điều kiện: điện thoại 390px, CPU chậm ×4, có nén gzip như GitHub Pages, trung vị 3 lần, bản cũ = nhánh chính đang chạy.

| Mạng | Trang | Hiện chữ đầu (FCP) | Phần lớn nhất (LCP) | Tải xong | Dữ liệu tải |
|---|---|---|---|---|---|
| 4G ổn định (9 Mbps, 60 ms, CPU x4) | Trang chủ | 0.41s → 0.34s | 0.41s → 1.57s | 2.10s → 1.27s | 178 → 274 KB |
| 4G ổn định (9 Mbps, 60 ms, CPU x4) | Danh mục | 0.32s → 0.32s | 1.42s → 1.45s | 1.73s → 1.32s | 404 → 466 KB |
| 4G ổn định (9 Mbps, 60 ms, CPU x4) | Sản phẩm | 0.72s → 1.00s | 1.24s → 1.44s | 2.38s → 1.03s | 699 → 730 KB |
| 4G yếu (1,6 Mbps, 150 ms, CPU x4) | Trang chủ | 0.64s → 0.74s | 0.64s → 2.26s | 3.52s → 2.57s | 178 → 274 KB |
| 4G yếu (1,6 Mbps, 150 ms, CPU x4) | Danh mục | 0.58s → 0.74s | 2.25s → 2.53s | 3.86s → 3.54s | 404 → 466 KB |
| 4G yếu (1,6 Mbps, 150 ms, CPU x4) | Sản phẩm | 1.14s → 1.62s | 1.38s → 2.38s | 7.13s → 5.10s | 699 → 730 KB |

Kết luận trung thực:

- **Tải xong nhanh hơn ở cả 6 phép đo** (nhanh hơn 8–57%), đạt mục tiêu "khoảng 3 giây trên 4G ổn định" (WEB-83).
- **LCP chậm hơn:** màn đầu giờ là ảnh giày thật (bản cũ chỉ là khối chữ) và nội dung dựng bằng JavaScript. LCP vẫn dưới 2,5s — mức "tốt" của Google — ở mọi phép đo.
- **FCP chậm hơn chút** vì font mới.
- Việc tải trước ảnh hero và tách `app.js` đã làm ở mốc 2b (bảng đo mới ở trên).

**Truy cập:**

- Kiểm tự động bằng axe-core (chuẩn WCAG 2 A/AA) trên 9 trang: **0 lỗi**. Đã sửa tương phản nhãn "Có sẵn", chữ size đã hết, và gạch chân link trong đoạn văn.
- Chữ nội dung tăng lên 16px.
- Chọn size, thêm giỏ, đóng giỏ trượt đều làm được hoàn toàn bằng bàn phím; focus quay về đúng chỗ.

## Đã kiểm ở mốc 2 (có bằng chứng)

Kiểm bằng Chromium tự động (Playwright), có font thật, giả lập điện thoại iPhone 390px và Android 360px. Môi trường không có WebKit/Safari thật (xem mục chưa kiểm).

**42/42 kiểm tra đạt:**

- **Hành trình 1 — tìm giày → chọn size → gửi yêu cầu:**
  - biệt danh `af1` / `mexico` ra đúng dòng; gõ mã U204LMMC + Enter vào thẳng sản phẩm;
  - bảng size và lưu ý form nằm trước nút mua; chưa chọn size thì nhắc, không chuyển trang;
  - tin nhắn có mã, size, giá, số cm chân, tỉnh, link tóm tắt; không có COD hay số tài khoản;
  - đã sao chép đúng nội dung;
  - sổ Sheet (giả lập): ghi 1 lần; bấm lại không trùng; tải lại trang vẫn không trùng;
  - lỗi mạng: báo thật, giữ giỏ;
  - "Tôi đã gửi": có lời cảm ơn, không có "đã nhận đơn", giỏ xoá đúng lúc;
  - link tóm tắt mở đúng mẫu/size.
- **Hành trình 2 — xem trên điện thoại → tư vấn → chốt qua Messenger:**
  - hộp tư vấn có sẵn mã, cm chân, giá, link, cùng hai nút Sao chép và Mở Messenger (m.me);
  - thanh mua dính đáy hiện, không bị nút nổi che;
  - từ giỏ trượt sang Gửi yêu cầu.
- **Danh mục và trang sản phẩm:**
  - danh mục đúng 393 mẫu có sẵn;
  - lọc dòng Samba trong trang Adidas; chọn hãng Nike thì hiện lọc dòng;
  - mẫu hết size báo đúng.
- **Chung:**
  - hero không tự chuyển; không nút chat nổi; không nút Yêu thích;
  - **không tràn ngang** ở 360 / 390 / 768 / 1024 / 1440px;
  - **không lỗi JavaScript**.

**Apps Script:** chạy trên bản giả lập Google Sheet. Kết quả: ghi 1 dòng; gửi trùng mã thì trả `duplicate`, không ghi thêm; mã sai bị từ chối; tên chứa công thức bị vô hiệu; callback lạ bị bỏ.

Không có lỗi JS trong Console. Chỉ còn lỗi tải ảnh 404 khi web dò ảnh cho mẫu chưa có ảnh.

**Chưa kiểm được:**

- Trên iPhone và Android thật, Safari thật.
- **Link `m.me/honggiabaoslife` mở đúng hội thoại trên điện thoại** — việc đầu tiên chủ shop nên thử sáng nay. Nếu không mở đúng, đổi `messenger` trong `shop.js` thành `https://www.facebook.com/honggiabaoslife/`.
- Apps Script trên Google thật (chủ shop tự cài theo hướng dẫn).
- raw.githack (bị chặn từ máy làm việc).
- Xem trước link khi dán vào Messenger/Facebook (xem mốc 2b).

## WEB-73 — những gì chưa công khai

- **Giao diện và tính năng mua mới** (mốc 1 + mốc 2) chỉ nằm trên nhánh `thiet-ke-moi`, chưa lên web thật.
- **Dữ liệu/ảnh:** đã `git fetch` lúc 01/10. Nhánh chính không có commit ảnh mới nào sau `148ef6e` (27/09). Nhánh thử có đủ 16 mẫu / 118 ảnh.
  - Ảnh chủ shop còn để trên máy mà chưa Commit + Sync thì Claude không thấy được — chủ shop kiểm trong Source Control của Antigravity.
- Không có nhánh nào khác ngoài `claude/shoe-shop-website-3dln52` và `thiet-ke-moi`.

## Dọn dẹp

- Bỏ `scripts/__pycache__` và các `__pycache__` trong skill khỏi repo.
- Thêm `.gitignore` (Python cache, file hệ điều hành, file tạm).
