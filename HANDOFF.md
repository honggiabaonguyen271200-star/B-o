# HANDOFF — Thiết kế mới S&LIFE Sneaker (nhánh `thiet-ke-moi`)

Cập nhật đêm 30/09 → sáng 01/10/2026 · **Mốc 2**: làm theo câu trả lời WEB của chủ shop (`docs/thiet-ke-moi/TRA-LOI-WEB.md`, đối chiếu `01-DIEM-CHOT-TU-TRA-LOI.md`).

Nhánh chính `claude/shoe-shop-website-3dln52` **chưa bị sửa**: web khách đang xem vẫn là bản cũ. Chưa gộp, chưa mua dịch vụ, chưa tạo tài khoản nào, chưa ghi vào Google Sheet thật.

## Xem thử

- **Link:** https://raw.githack.com/honggiabaonguyen271200-star/B-o/thiet-ke-moi/index.html
  - Máy làm việc của Claude bị chặn truy cập raw.githack, nên chưa tự mở kiểm được link này.
  - Nếu link không chạy: trong Antigravity chuyển sang nhánh `thiet-ke-moi` rồi chạy `xem-web.bat`.
  - Xem xong nhớ chuyển lại nhánh chính trước khi tải ảnh mới.
- **Ảnh trước/sau mốc 2** (web đang chạy ↔ bản mới): `docs/thiet-ke-moi/so-sanh-moc-2/` — trang chủ, danh mục, sản phẩm, gửi yêu cầu; mỗi trang ở 390px và 1440px.
- **Ảnh so sánh font:** `docs/thiet-ke-moi/font/so-sanh-font.png` (mở thử: `so-sanh-font.html`).
- **Ảnh mốc 1** vẫn ở `docs/thiet-ke-moi/so-sanh/`.

## Đã làm theo câu trả lời WEB

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
- **Việc có thể làm thêm:** tải trước ảnh hero; tách `app.js` (~145 KB chưa nén, ~43 KB đã nén) theo trang.

**Truy cập:**

- Kiểm tự động bằng axe-core (chuẩn WCAG 2 A/AA) trên 9 trang: **0 lỗi**. Đã sửa tương phản nhãn "Có sẵn", chữ size đã hết, và gạch chân link trong đoạn văn.
- Chữ nội dung tăng lên 16px.
- Chọn size, thêm giỏ, đóng giỏ trượt đều làm được hoàn toàn bằng bàn phím; focus quay về đúng chỗ.

## Đã kiểm (có bằng chứng)

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

## Giả định đã chọn (chủ shop duyệt giúp)

1. **Bảng size theo hãng:**
   - Mới có **Nike/Jordan** và **New Balance** (nam/unisex), theo bảng quy đổi phổ biến của hãng, ghi rõ "để tham khảo".
   - **Chủ shop cần đối chiếu với bảng trên web hãng trước khi gộp** (WEB-88: không được sai size).
   - Các hãng khác hiện "shop đang cập nhật" và mời nhắn Messenger. Gửi bảng size chuẩn thì Claude thêm vào `SIZE_CHARTS`.
2. **Bỏ câu "Sai size do shop tư vấn: shop chịu phí đổi":** WEB-69 chỉ chọn hai trường hợp (shop giao sai/lỗi → shop chịu; đổi theo nhu cầu → khách chịu). Nếu vẫn muốn giữ lời hứa này, báo để thêm lại.
3. **Size đã hết vẫn hiện mờ** trong dải size của hãng (bấm vào mời nhắn Messenger tư vấn), để khách biết size mình có hay không. Không có chữ "order". Muốn chỉ hiện size còn thì tắt được.
4. **Mỗi size 1 đôi** trong giỏ; mua nhiều đôi trao đổi trong tin nhắn (WEB-47).
5. **Bộ lọc:** giữ lọc "Dành cho" (code nữ/GS, thu gọn) vì menu "Theo nhu cầu" dùng nó; bỏ lọc màu.
6. **Trang gửi yêu cầu chỉ có các ô không bắt buộc** (tên gọi, cm chân, tỉnh, ghi chú). Số điện thoại và địa chỉ trao đổi trong Messenger (WEB-85 bỏ qua → thu ít nhất).
7. **"Hàng mới về"** (WEB-43): chưa làm.
   - Thứ tự mặc định hiện tại: **có ảnh thật trước → còn nhiều size trước → theo thứ tự trong bảng**.
   - Đề xuất: thêm một cột tuỳ chọn **"Mới về"** (ghi ngày, VD `01/10/2026`) trong Google Sheet. Khi chủ shop đồng ý, `build_products.py` sẽ đọc cột này để có mục "Hàng mới về" và sắp xếp theo ngày.
8. **Mẫu theo hãng ở trang chủ** mở sẵn tab New Balance (hãng nhiều ảnh thật nhất), nên hơi trùng khối "Hàng sẵn, mua ngay". Khi có thêm ảnh hãng khác, có thể đổi tab mặc định.

## WEB-73 — những gì chưa công khai

- **Giao diện và tính năng mua mới** (mốc 1 + mốc 2) chỉ nằm trên nhánh `thiet-ke-moi`, chưa lên web thật.
- **Dữ liệu/ảnh:** đã `git fetch` lúc 01/10. Nhánh chính không có commit ảnh mới nào sau `148ef6e` (27/09). Nhánh thử có đủ 16 mẫu / 118 ảnh.
  - Ảnh chủ shop còn để trên máy mà chưa Commit + Sync thì Claude không thấy được — chủ shop kiểm trong Source Control của Antigravity.
- Không có nhánh nào khác ngoài `claude/shoe-shop-website-3dln52` và `thiet-ke-moi`.

## Dọn dẹp

- Bỏ `scripts/__pycache__` và các `__pycache__` trong skill khỏi repo.
- Thêm `.gitignore` (Python cache, file hệ điều hành, file tạm).

## Việc tiếp theo

1. **Sáng 01/10, chủ shop thử trên điện thoại:**
   - bấm icon Messenger ở đầu trang, xem có mở đúng hội thoại với tài khoản của mình không;
   - chạy trọn hai hành trình: tìm mã → chọn size → Gửi yêu cầu → Sao chép → Mở Messenger → dán; và tư vấn size trên trang sản phẩm.
2. Kiểm bảng size Nike/Jordan và New Balance (giả định 1); trả lời giả định 2 và 7.
3. (Tuỳ chọn) Cài sổ yêu cầu theo `HUONG-DAN-DON-HANG.md`; tạo GA4 và dán `ga4Id`.
4. Claude sửa theo nhận xét. **Trước khi gộp:**
   - lấy commit ảnh mới trên nhánh chính (merge, không ghi đè ảnh);
   - chạy `python scripts/image_manifest.py`;
   - chạy lại bộ kiểm tra;
   - rồi mới gộp vào `claude/shoe-shop-website-3dln52`.
