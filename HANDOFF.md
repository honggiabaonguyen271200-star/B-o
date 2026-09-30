# HANDOFF — Thiết kế mới S&LIFE Sneaker (nhánh `thiet-ke-moi`)

Cập nhật đêm 30/09/2026 · **Mốc 2b** (việc không cần chủ shop quyết), nối tiếp **Mốc 2** (làm theo câu trả lời WEB: `docs/thiet-ke-moi/TRA-LOI-WEB.md`, `01-DIEM-CHOT-TU-TRA-LOI.md`).

Nhánh chính `claude/shoe-shop-website-3dln52` **chưa bị sửa**: web khách đang xem vẫn là bản cũ. Chưa gộp, chưa mua dịch vụ, chưa tạo tài khoản nào, chưa ghi vào Google Sheet thật.

## Chủ shop cần duyệt

**Thử trên điện thoại (việc đầu tiên):**

1. Bấm icon Messenger ở đầu trang: có mở đúng hội thoại với tài khoản của bạn không? Nếu không, đổi `messenger` trong `data/shop.js` thành `https://www.facebook.com/honggiabaoslife/`.
2. Chạy trọn hai hành trình: tìm mã → chọn size → Gửi yêu cầu → Sao chép → Mở Messenger → dán; và "Tư vấn size" trên trang sản phẩm.

**Cần bạn trả lời / kiểm:**

3. **Bảng size** (WEB-88: không được sai size):
   - **Nike/Jordan** và **New Balance** đang theo bảng quy đổi phổ biến, ghi "để tham khảo" — cần bạn đối chiếu với bảng trên web hãng trước khi gộp.
   - **Asics, Onitsuka Tiger, Adidas, Puma, Salomon, On:** máy làm việc của Claude **bị chặn truy cập web chính thức** của cả 6 hãng (thử ngày 30/09/2026: asics.com, onitsukatiger.com, adidas.com, adidas.com.vn, asics.com.vn, puma.com, salomon.com, on.com — đều bị chặn). Không đoán số, nên các hãng này vẫn hiện "shop đang cập nhật" và mời nhắn Messenger.
   - Muốn thêm: gửi link hoặc ảnh chụp bảng size trên web hãng, Claude chép vào `SIZE_CHARTS` kèm link nguồn và ngày lấy, ghi "tham khảo — shop xác nhận".
4. **Câu "Sai size do shop tư vấn: shop chịu phí đổi" đã bỏ:** WEB-69 chỉ chọn hai trường hợp (shop giao sai/lỗi → shop chịu; đổi theo nhu cầu → khách chịu). Muốn giữ lời hứa này thì báo để thêm lại.
5. **"Hàng mới về"** (WEB-43) chưa làm.
   - Thứ tự hiện tại: có ảnh thật trước → còn nhiều size trước → theo thứ tự trong bảng.
   - Đề xuất: thêm cột tuỳ chọn **"Mới về"** (ghi ngày, VD `01/10/2026`) trong Google Sheet. Bạn đồng ý thì `build_products.py` đọc cột này để có mục "Hàng mới về".
6. **Link chia sẻ mới `…/sp/<mã>.html`** (mốc 2b, mục 3) — **chưa kiểm bằng công cụ Facebook Sharing Debugger**:
   - máy làm việc bị chặn Facebook;
   - các trang này chỉ có trên web thật sau khi gộp.
   Sau khi gộp, bạn làm:
   - mở https://developers.facebook.com/tools/debug/ → dán một link, ví dụ `https://honggiabaonguyen271200-star.github.io/B-o/sp/u204lmmc.html` → **Scrape Again** → xem có ảnh giày, tên, giá không;
   - rồi dán link đó vào Messenger cho chính mình.
7. **Sitemap bỏ các trang hãng** (`shop.html?brand=…`): làm đúng yêu cầu "chỉ trang chính + mẫu còn hàng". Muốn Google thấy thêm trang hãng thì báo để thêm lại.
8. **Lỗi 404 ảnh trong Console:** web vẫn tự dò ảnh `.webp`/`.jpg` cho mẫu chưa có trong `danh-sach.js`, để ảnh chép tay vẫn hiện. Mỗi mẫu chưa ảnh sinh 2 dòng lỗi đỏ trong Console, dù khách không thấy gì.
   - Đề xuất: khi đã có `danh-sach.js` thì thôi dò; bù lại, mỗi lần thêm ảnh phải cập nhật danh sách (anh.html, `cap-nhat-hang.bat`, `nhap-anh-zip.bat` đều tự làm).
   - Đồng ý thì báo.

**Giả định đã chọn (không phản đối thì giữ):**

9. Size đã hết vẫn hiện mờ trong dải size của hãng (bấm vào thì mời nhắn Messenger), để khách biết size mình có hay không. Không có chữ "order".
10. Mỗi size 1 đôi trong giỏ; mua nhiều đôi thì trao đổi trong tin nhắn (WEB-47).
11. Giữ lọc "Dành cho" (code nữ/GS, thu gọn) vì menu "Theo nhu cầu" dùng nó; bỏ lọc màu.
12. Trang gửi yêu cầu chỉ có các ô không bắt buộc (tên gọi, cm chân, tỉnh, ghi chú). Số điện thoại và địa chỉ trao đổi trong Messenger.
13. Trang chủ mở sẵn tab New Balance ở "Mẫu theo hãng" (hãng nhiều ảnh thật nhất).
14. Mô tả trong link chia sẻ chỉ ghi giá, **không ghi size còn**: Facebook lưu bản xem trước nhiều ngày, size ghi sẵn dễ sai khi hàng đã bán.
15. `xem-web.bat` giờ tự tạo lại `sp/`, `sitemap.xml`, ảnh xem trước mỗi lần mở, nên Source Control có thể báo `sitemap.xml` đổi ngày. Cứ Commit + Sync bình thường.

**Tuỳ chọn:** cài sổ yêu cầu theo `HUONG-DAN-DON-HANG.md`; tạo Google Analytics 4 và dán `ga4Id` vào `shop.js`.

**Trước khi gộp (Claude làm khi bạn duyệt):**

- lấy commit ảnh mới trên nhánh chính (merge, không ghi đè ảnh);
- chạy `python scripts/image_manifest.py` rồi `python scripts/static_pages.py`;
- chạy lại bộ kiểm tra;
- rồi mới gộp vào `claude/shoe-shop-website-3dln52`.

## Xem thử

- **Link:** https://raw.githack.com/honggiabaonguyen271200-star/B-o/thiet-ke-moi/index.html
  - Máy làm việc của Claude bị chặn truy cập raw.githack, nên chưa tự mở kiểm được link này.
  - Nếu link không chạy: trong Antigravity chuyển sang nhánh `thiet-ke-moi` rồi chạy `xem-web.bat`.
  - Xem xong nhớ chuyển lại nhánh chính trước khi tải ảnh mới.
- **Ảnh trước/sau mốc 2** (web đang chạy ↔ bản mới): `docs/thiet-ke-moi/so-sanh-moc-2/` — trang chủ, danh mục, sản phẩm, gửi yêu cầu; mỗi trang ở 390px và 1440px.
- **Ảnh so sánh font:** `docs/thiet-ke-moi/font/so-sanh-font.png` (mở thử: `so-sanh-font.html`).
- **Ảnh mốc 1** vẫn ở `docs/thiet-ke-moi/so-sanh/`.

## Mốc 2b — đã làm (đêm 30/09)

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
