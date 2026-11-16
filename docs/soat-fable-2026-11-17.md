# Soát website S&LIFE theo góc nhìn khách hàng (17/11/2026)

Soát chất lượng, **chưa sửa gì trên web**. Web thật (`honggiabaonguyen271200-star.github.io/B-o`) đang giống hệt nhánh `claude/shoe-shop-website-3dln52` (đã so 13 file chính, trùng khớp).

Nhãn: **[Chắc chắn]** = đã chạy, đo hoặc đọc trực tiếp trên web thật. **[Có khả năng cao]** = suy từ mã nguồn hoặc tài liệu của nền tảng, chưa thử trên máy thật. **[Ước đoán]** = phỏng đoán, cần kiểm thêm.

## Giới hạn của lần soát

- **Không có điện thoại thật.** Hành trình chạy bằng trình duyệt giả lập iPhone 13 và Pixel 7. Tôi thấy được web gọi lệnh gì khi bấm nút Facebook, nhưng không thấy được app Facebook/Messenger thật mở ra sao. Bạn cần thử lại 4 trường hợp ở mục 1.3.
- **Không tìm thấy nguyên văn chính sách duyệt 16/11.** Tôi đối chiếu theo: (a) tóm tắt trong yêu cầu của bạn, (b) mục A.2 và A.3 được trích trong `bao-cao-60-sales.md` trên Drive, (c) câu cam kết "Chính hãng, bao check" trong Luật chung 16/11. Phần đổi size **hàng sẵn** tôi không có văn bản gốc, nên chỉ liệt kê chỗ đang ghi, không kết luận đúng sai.
- **Bảng nguồn hàng là bản tải ngày 09/11.** Lịch kiểm hàng 15/11 chưa chạy.
- Không dùng được công cụ xem trước của Facebook (cần đăng nhập). Phần chia sẻ được kiểm bằng cách đọc thẻ trên trang và gọi trang với danh tính của bot Facebook, Zalo, Google.

---

## A. Danh sách lỗi, xếp theo mức ảnh hưởng tới số khách nhắn Messenger

### Nhóm 1 — Chặn hoặc làm rơi khách ngay trên đường tới Messenger

**L1. Nút Facebook không mở Messenger, và không mang theo thông tin mẫu.** [Chắc chắn về lệnh web gọi; chưa thử máy thật]
- Trang: mọi nút Facebook, rõ nhất ở `product.html?id=401581-01`.
- Tái hiện: chọn size 37,5 → bấm "Tư vấn qua Facebook".
  - iPhone: web gọi `fb://profile/100080431367928` (mở **trang cá nhân** trong app Facebook).
  - Android: web gọi lệnh mở app Facebook tới `facebook.com/honggiabaoslife`.
  - Thông tin mẫu (tên, mã, size 37,5, giá 2.000.000₫, link) chỉ được **chép vào bộ nhớ tạm**. Khách phải tự bấm "Nhắn tin" trên trang cá nhân, rồi nhấn giữ để dán.
- Ảnh hưởng: sau khi bấm nút còn 3–4 thao tác nữa mới gửi được tin. Dòng báo "Đã chép sẵn thông tin mẫu" hiện đúng lúc máy chuyển app nên khách dễ không thấy, và sẽ gõ tay "còn không shop" mà không có mã.

**L2. Màn hình đầu của trang mẫu trên điện thoại không có tên, giá, size hay nút mua.** [Chắc chắn]
- Trang: `product.html?id=…`, iPhone 13 (cao 664px).
- Tái hiện: mở trang mẫu. Màn đầu chỉ có thanh chữ chạy, logo, ô tìm, đường dẫn và ảnh. Hàng size nằm ở 953px (kéo gần 1,5 màn hình). Nút "Tư vấn qua Facebook" ở 1.338px (kéo 2 màn hình).
- Ảnh hưởng: khách đến từ Facebook/TikTok thường quyết trong vài giây đầu. Trong trình duyệt trong app, màn hình còn thấp hơn nữa.

**L3. Nút Facebook dễ thấy nhất (biểu tượng ở đầu trang) không chép thông tin mẫu.** [Chắc chắn]
- Trang: mọi trang mẫu.
- Tái hiện: bấm biểu tượng Facebook cạnh giỏ hàng. Bộ nhớ tạm không có gì. Chỉ nút "Tư vấn qua Facebook" ở giữa trang mới chép.
- Ảnh hưởng: khách bấm nút gần tay nhất thì bạn nhận tin trống, phải hỏi lại "bạn xem mẫu nào".

**L4. Nút nổi bật nhất dẫn sang đường dài nhất.** [Chắc chắn]
- Trang: trang mẫu, thanh dính đáy màn hình.
- Tái hiện: thanh đáy chỉ có "Thêm vào giỏ". Từ đó tới lúc gửi tin: thêm giỏ → mở giỏ → "Gửi yêu cầu cho shop" → trang có 4 ô điền → "Chép tin nhắn và mở Facebook shop" → trang cá nhân → "Nhắn tin" → dán → gửi. Khoảng 10 thao tác.
- Ảnh hưởng: khách mua 1 đôi (đa số) bị kéo qua giỏ hàng thay vì nhắn thẳng.

**L5. Giá trên danh sách khác giá của size khách đang tìm.** [Chắc chắn]
- Link: `sp/loc/puma--size-37-5.html` → `shop.html?brand=puma&size=37.5`.
- Tái hiện: thẻ Speedcat Ballet Metallic Silver ghi 1.700.000₫. Vào trang mẫu chọn 37,5 thì giá là 2.000.000₫ (1.700.000₫ là giá size 35,5). Thẻ không có chữ "từ".
- Quy mô: 163 mẫu có giá riêng theo size; 42 mẫu có size đắt hơn giá trên thẻ từ 30% (VD 553558-063: thẻ 1.800.000₫, size đắt nhất 3.200.000₫).
- Ảnh hưởng: khách thấy bị "treo giá", dễ thoát hoặc mặc cả khi nhắn.

**L6. Size trong link không được chọn sẵn ở trang mẫu.** [Chắc chắn]
- Tái hiện: vào từ link "size 37,5", bấm một mẫu. Trang mẫu ghi "chưa chọn size", khách phải kéo xuống chọn lại.
- Ảnh hưởng: thêm một lần kéo và một lần bấm ở đúng chỗ khách hay rơi (L2).

**L7. Trong trình duyệt của Instagram, TikTok, Zalo, lệnh mở app Facebook có thể bị chặn.** [Có khả năng cao]
- Tái hiện (giả lập): khi lệnh mở app không chạy, web chờ 2,5 giây rồi hiện hộp 4 lựa chọn (mở lại app / chép link / chép tin nhắn / mở tab mới). Hộp này tôi đã thấy hiện đúng.
- Ảnh hưởng: đây chính là nơi phần lớn khách của bạn đang đứng. 2,5 giây không có gì xảy ra đủ để khách nghĩ nút hỏng. Nếu khách chọn "mở tab mới" mà chưa đăng nhập Facebook trên trình duyệt thì gặp trang đăng nhập [Chắc chắn: `facebook.com/honggiabaoslife` chuyển sang trang đăng nhập khi chưa đăng nhập].

**L8. Tồn kho trên web cũ 8 ngày.** [Chắc chắn về ngày; số mẫu lệch là ước đoán]
- Dữ liệu là bản 09/11. Lịch 15/11 chưa chạy.
- Ước tính: đợt 27/10 → 09/11 có 34 mẫu hết và 134 mẫu đổi size trong 13 ngày, tức mỗi tuần khoảng 70–90 mẫu lệch [Ước đoán].
- Ảnh hưởng: khách nhắn hỏi mẫu đã hết, hoặc size đã hết.

### Nhóm 2 — Giảm lòng tin trước khi khách nhắn

**L9. Web không có chữ "bao check" và không có cam kết hàng giả.** [Chắc chắn]
- Tìm trên mọi trang: không có "bao check", không có "30 ngày", không có "đền". Cam kết hiện tại là "Mã sản phẩm khớp tem hộp".
- Ảnh hưởng: cam kết mạnh nhất của shop (hoàn 100% và đền thêm 100%) không xuất hiện ở nơi khách đang cân nhắc. Chi tiết ở mục E.

**L10. Tên mẫu trùng nhau và tên không phân biệt được màu.** [Chắc chắn]
- 33 mẫu cùng tên "Nike Air Force 1"; 10 mẫu "Nike Cortez Leather"; 9 mẫu "New Balance 2002R"; 9 mẫu "New Balance 530"; 5 mẫu chỉ ghi "Air Jordan" (DN4321-100, IQ5490-007, IZ5846-101, JA4395-041, IU2268-100). Tổng 76 tên bị dùng cho nhiều mã.
- Ảnh hưởng: khách không biết mình đang xem phối màu nào; tin nhắn gửi shop cũng chỉ ghi tên chung.

**L11. Sai hãng, và chữ "Khác" nằm trong tên mẫu.** [Chắc chắn]
- `M2022RDA`: ghi "Puma 2002R Protection Pack Rain Cloud", thật ra là New Balance. Mẫu này còn hiện trong "Có thể bạn sẽ thích" của giỏ hàng Puma.
- `U6AFCSU63H2`, `U4CFCTW14B1`: ghi Puma, bảng nguồn ghi Champion.
- `FU7205`: ghi "Adidas REEBOK COMFORT SLIDE", bảng nguồn ghi Reebok.
- `KH6225`: ghi "Asics KH6225", dạng mã giống Adidas [Ước đoán].
- 7 mẫu xếp hãng "Khác" và tên bắt đầu bằng chữ "Khác": `618919` (Nike Benassi), `CP101051M` / `CP101062M` / `CP101052M` (Champion), `A12FW708` (Mihara Yasuhiro), `1116109-CHE` (UGG), `3027502-100` (Under Armour Curry 11).
- Trang chủ có ô hãng tên "KHÁC" trong dải "16 thương hiệu".
- Ảnh hưởng: lọc theo hãng sai; khách thấy "Puma 2002R" sẽ nghi cả trang.

**L12. Tên lạ hoặc gây hiểu sai.** [Chắc chắn]
- `KE3892`: "Adidas Fake Denim" (chữ "Fake" trên web bán hàng chính hãng).
- `3ME10570462`: tên hiện là "On 3WE10630462" (tên là mã của mẫu khác).
- `CW2288`: "Nike Air Force 1 '07 'Triple White' / -111".
- 23 tên viết HOA cả câu; dép Puma có số "01, 02, 03" ở cuối tên; 28 tên chỉ có hãng và dòng (VD "Wilson", "Adidas JI3202").
- `PX231WAS575`: bảng nguồn có cả màu nâu và xám dưới cùng một mã, web chỉ ghi "Nâu".

**L13. Ghi chú nội bộ của nhà cung cấp hiện cho khách.** [Chắc chắn]
- 69 trang mẫu có dòng "Ghi chú của shop: Giá xả không giảm thêm" (VD `product.html?id=ao9944-441`, kèm "flaw nhẹ").
- Ảnh hưởng: "giá xả" là giọng thanh lý mà Luật chung cấm; "không giảm thêm" gợi cho khách mặc cả. Riêng "flaw nhẹ" và "Xước logo phản quang" là thông tin khách cần biết, nên giữ nhưng viết lại.

**L14. Thiếu nhãn nữ và trẻ em.** [Chắc chắn với các mẫu đã đối chiếu]
- Trong 256 mẫu Nike/Jordan/Adidas tôi có tên StockX: 59 mẫu StockX ghi "Women's" nhưng web ghi unisex (VD AQ9129-101, DC0774-xxx, BQ6472-xxx); 11 mẫu StockX ghi "GS" nhưng web ghi unisex (VD FV5948-100, FV5948-103, DM0985-100, DA4086-100).
- Ảnh hưởng: bảng size hiện theo nhãn này. Khách nam mua nhầm mã nữ hoặc mã trẻ em sẽ đổi trả.

**L15. Ảnh.** [Chắc chắn về số lượng]
- 64 mẫu còn hàng chưa có ảnh; 495 mẫu dưới 3 ảnh (danh sách ở `docs/anh-can-chup.md`).
- 550 mẫu còn hàng có ảnh bìa dưới 600px, nhìn mờ trên điện thoại màn hình nét.
- Ảnh StockX thêm ngày 09/11: mới xem bằng mắt khoảng 55/242 mẫu, phần còn lại chỉ so màu tự động. Có thể còn ảnh lệch tông [Ước đoán].

### Nhóm 3 — Giảm số khách tới được web

**L16. Link mẫu khi chia sẻ: 550 mẫu chỉ hiện ảnh nhỏ.** [Chắc chắn về kích thước ảnh; cách Facebook hiển thị là theo tài liệu của họ]
- Ảnh xem trước `sp/anh/<MÃ>.jpg`: 539 ảnh dưới 600px, 11 ảnh dưới 200px (VD `sp/anh/553558-081.jpg` là 355×355). Facebook cần từ 600px để hiện thẻ ảnh lớn; dưới 200px có thể không hiện ảnh.
- Nhiều mẫu trong số này đã có ảnh 1.000px tải ngày 09/11 nhưng đang nằm ở vị trí ảnh góc thứ 2, không phải ảnh bìa.

**L17. Link chép từ thanh địa chỉ vẫn ra khung xem trước chung chung.** [Chắc chắn]
- `shop.html?brand=puma&size=37.5` → tiêu đề "Giày chính hãng — S&LIFE Sneaker", ảnh logo.
- `product.html?id=…` → tiêu đề "Sản phẩm — S&LIFE Sneaker", ảnh logo.
- Chỉ link lấy bằng **nút chia sẻ** (`sp/…`, `sp/loc/…`) mới có ảnh và tiêu đề đúng. Link lọc theo từ khoá, nhiều size hoặc mức giá cũng ra khung chung.

**L18. Google và các trình đọc link không thấy nội dung.** [Chắc chắn về những gì trang trả ra]. Chi tiết và cách sửa ở mục D.

### Rủi ro ngoài chuyện tin nhắn (nên biết ngay)

**R1. Tài liệu nội bộ và công thức giá đang mở công khai trên web.** [Chắc chắn]
- Ai cũng mở được: `…/B-o/AGENTS.md` (ghi rõ "CTV < 3 triệu +300k, từ 3 triệu +10%"), `HANDOFF.md`, `docs/ban-giao-1611.md`, `docs/anh-can-chup.md`, `scripts/nguon_hang.py`, `data/ten-mau.csv`, `anh.html`.
- Khách hoặc shop khác đọc được mức lời trên từng đôi và cách bạn lấy hàng.

**R2. Số tài khoản cá nhân nằm trong file công khai.** [Chắc chắn]
- `data/shop.js` có Techcombank, số tài khoản và tên chủ tài khoản. Web không hiện ra, nhưng ai mở file cũng đọc được. Xem thêm mục E, dòng thanh toán.

**R3. `robots.txt` không có tác dụng.** [Chắc chắn]
- File nằm ở `/B-o/robots.txt`. Công cụ tìm kiếm chỉ đọc ở gốc tên miền, và ở đó trả về 404. Dòng chặn `anh.html`, giỏ hàng và dòng khai sitemap đều không được đọc.

---

## B. Phần 1 — Hành trình trên điện thoại

### 1.1 Đếm bước (đường ngắn nhất, đã chạy trên web thật)

| # | Khách làm | Web làm | Ghi chú |
| --- | --- | --- | --- |
| 1 | Bấm link `sp/loc/puma--size-37-5.html` trong Facebook | Tự chuyển sang danh sách Puma, đã lọc size 37,5 (8 mẫu) | 1,0–1,9 giây; đuôi `?fbclid=` của Facebook không làm hỏng link |
| 2 | Kéo nhẹ, bấm một mẫu | Mở trang mẫu | Ảnh mẫu đầu tiên bắt đầu ở 533/664px, gần hết màn đầu là tiêu đề và bộ lọc |
| 3 | Kéo gần 1,5 màn hình | Tới hàng size | Điểm rơi L2 |
| 4 | Bấm size 37,5 | Giá đổi 1.700.000₫ → 2.000.000₫, ghi "giá riêng size 37,5" | Điểm rơi L5 |
| 5 | Kéo tiếp, bấm "Tư vấn qua Facebook" | Chép tin nhắn, gọi app Facebook | Máy có thể hỏi "Mở bằng Facebook?" |
| 6 | Bấm "Nhắn tin" trên trang cá nhân | — | Điểm rơi L1 |
| 7 | Nhấn giữ, chọn Dán | — | |
| 8 | Bấm Gửi | — | |

Tổng: **6 lần bấm, 3 lần kéo, 1 lần dán**. Đường qua giỏ hàng khoảng 10 thao tác.

Tin nhắn web soạn (đã đọc từ bộ nhớ tạm) đúng và đủ: tên, mã 401581-01, size 37,5, giá 2.000.000₫, dòng "Chân mình dài: … cm", link `sp/401581-01.html`. [Chắc chắn]

Không có lỗi Console, không có file 404, không tràn ngang trên cả hai máy giả lập. [Chắc chắn]

### 1.2 Nút có mở đúng Messenger trang cá nhân của bạn không

- **Không mở Messenger.** Nút mở **trang cá nhân** `facebook.com/honggiabaoslife` trong app Facebook. [Chắc chắn]
- **Không mang theo thông tin mẫu vào khung chat.** Thông tin chỉ nằm trong bộ nhớ tạm. [Chắc chắn]
- iPhone dùng mã số `100080431367928`. Tôi không đăng nhập Facebook nên không xác nhận được mã này đúng là trang của bạn. [Ước đoán: đúng, vì bạn gửi ngày 01/10]
- Facebook không cho điền sẵn nội dung tin nhắn gửi tới trang cá nhân; chỉ Trang (Page) mới có. Nên "mang theo thông tin" theo nghĩa tự điền vào khung chat là không làm được với tài khoản cá nhân. [Có khả năng cao]
- Có thể rút 1 bước bằng link `m.me/honggiabaoslife`, mở thẳng khung chat Messenger. Link này có chuyển hướng đúng tới `messenger.com/t/honggiabaoslife` [Chắc chắn], nhưng tôi chưa thấy nó mở app trên máy thật [Ước đoán].

### 1.3 Bốn trường hợp bạn cần thử trên máy thật

Mở một link mẫu rồi bấm "Tư vấn qua Facebook", lần lượt từ:
1. Safari trên iPhone.
2. Chrome trên Android.
3. Trình duyệt trong app Facebook (bấm link từ một bài đăng).
4. Trình duyệt trong app TikTok hoặc Instagram.

Ghi lại: app nào mở ra, có thấy nút "Nhắn tin" ngay không, dán có ra tin nhắn không. Thử thêm link `m.me/honggiabaoslife` ở cả 4 nơi.

---

## C. Phần 2 — Dữ liệu

**Đối chiếu với 5 bảng nguồn (bản 09/11):** [Chắc chắn]
- 1.444/1.444 mẫu còn hàng đều có mã trong bảng nguồn.
- **Giá: 0 mẫu lệch công thức** (CTV < 3 triệu +300k; từ 3 triệu +10% làm tròn lên 10k).
- **Size: 0 mẫu lệch** so với bảng nguồn.
- Không có giá bất thường (dưới 400k hoặc trên 15 triệu).
- Xem tay 24 mẫu ngẫu nhiên (tên, hãng, size, giá CTV, giá bán): giá và size đều khớp; lỗi chỉ ở tên và hãng (FU7205 Reebok, PX231WAS575 hai màu chung mã).

Kết luận: **phần tính giá và đọc size đáng tin; phần tên, hãng, nhãn nam/nữ là chỗ yếu** (L10–L14). Nguyên nhân chung: tên và hãng của lần cập nhật trước được giữ nguyên cho lần sau, nên lỗi cũ không tự hết. [Chắc chắn, đọc trong `scripts/nguon_hang.py`]

Lưu ý: phép so này dùng chính bộ đọc bảng của web, nên nó bắt được lỗi tính giá và gộp size, nhưng không bắt được lỗi nếu bộ đọc hiểu sai một cột của nhà cung cấp. 24 mẫu xem tay không thấy dấu hiệu đó.

---

## D. Phần 3 và 4 — Hiển thị khi chia sẻ, khả năng được tìm thấy

### Chia sẻ

| Link | Tiêu đề | Ảnh | Đánh giá |
| --- | --- | --- | --- |
| Trang chủ | "S&LIFE Sneaker — Giày chính hãng, hàng sẵn" | Logo vuông 1.200px | Đúng, nhưng mô tả có "đổi size 3 ngày"; ảnh là logo, không phải giày [Chắc chắn] |
| `sp/loc/puma--size-37-5.html` | "Giày Puma size 37,5 có sẵn" | Ảnh một mẫu Puma, 1.142px | Đúng. Mô tả "Giá từ 890.000₫ · Các dòng Speedcat Ballet, Speedcat OG" [Chắc chắn] |
| `sp/<mã>.html` | "Giày <tên> <mã>" + giá | Ảnh bìa của mẫu | Đúng, nhưng 550 mẫu ảnh nhỏ (L16); 64 mẫu chưa có ảnh nên dùng logo [Chắc chắn] |
| `shop.html?…`, `product.html?id=…` | Chung chung | Logo | Sai kỳ vọng (L17) [Chắc chắn] |

- Bot của Facebook, Zalo và Google đều nhận được đúng trang và ảnh (mã 200). [Chắc chắn]
- 685 trang `sp/loc` không khai kích thước ảnh. Lần đầu dán link, Facebook có thể chưa hiện ảnh ngay. [Có khả năng cao]
- Ảnh xem trước là ảnh vuông. Ở vài vị trí Facebook cắt ngang, giày cổ cao có thể bị cắt. [Ước đoán]
- Chưa thấy khung thật trong Messenger, Facebook, Zalo. Bạn dán thử 3 link (trang chủ, một link lọc, một link mẫu ảnh nhỏ như `sp/553558-081.html`) là biết.

### Công cụ đọc trang thấy gì khi không chạy JavaScript [Chắc chắn]

| Trang | Chữ đọc được | Số link |
| --- | --- | --- |
| Trang chủ | 338 ký tự: một câu giới thiệu và 5 tiêu đề mục trống | 1 |
| `shop.html?brand=puma&size=37.5` | 107 ký tự: "Bộ lọc, Sắp xếp…" | 0 |
| `product.html?id=401581-01` | 0 ký tự | 0 |
| `sp/401581-01.html` | "Đang mở trang sản phẩm…" và tên mẫu | 1 |
| `policy.html` | Đầy đủ (1.948 ký tự) | 5 |

- Sitemap có 1.503 link, trong đó 1.444 link là `product.html?id=…`, tức các trang rỗng ở bảng trên.
- Trang `sp/loc` tự khai "không lập chỉ mục"; trang `sp/<mã>` khai trang chuẩn là trang rỗng.
- Search Console chưa xác minh (`googleVerify` trống), nên sitemap chưa được nộp. [Có khả năng cao]
- Google có chạy JavaScript nên về lý thuyết vẫn đọc được, nhưng với một trang con trên `github.io`, chưa có link trỏ về, khả năng được lập chỉ mục đầy đủ là thấp. [Ước đoán] Tôi thử tìm `site:…github.io` nhưng công cụ tìm kiếm của tôi không hỗ trợ kiểu tìm này, nên chưa kết luận.

### Đề xuất sửa, hợp với GitHub Pages (không cần máy chủ, không cần framework)

1. **Dựng sẵn nội dung vào file tĩnh** bằng chính `scripts/static_pages.py` (script này đã sinh 1.444 trang `sp/` mỗi lần cập nhật hàng):
   - Trang `sp/<mã>.html` chứa sẵn tên, mã, giá, size còn, ảnh, cam kết, dữ liệu sản phẩm cho Google. Bỏ lệnh tự chuyển trang; trang tự nạp phần chọn size và giỏ hàng tại chỗ.
   - Thêm trang tĩnh cho từng hãng và từng dòng, liệt kê mẫu kèm link.
   - Chèn vào trang chủ một khối tĩnh: link các hãng và các mẫu nổi bật.
   - Sitemap trỏ về các trang tĩnh này.
   - Lợi thêm: link chép từ thanh địa chỉ cũng có khung xem trước đúng (hết L17), và trang mẫu hiện chữ ngay cả khi mạng chậm.
2. **Xác minh Search Console** (điền `googleVerify`), nộp sitemap bằng tay.
3. **Tên miền riêng (.vn).** Khi đó `robots.txt` mới nằm đúng gốc (hết R3), và khách thấy địa chỉ đáng tin hơn `…github.io/B-o`.
4. **Tách phần nội bộ khỏi phần xuất bản** (R1): chỉ xuất bản thư mục web, hoặc chuyển tài liệu và script sang kho riêng tư. Cần bạn quyết vì ảnh hưởng cách làm việc với Antigravity.

Việc 1 là thay đổi lớn nhất, nên làm sau 5 việc ở mục F.

---

## E. Phần 5 — Chính sách

### Chính sách duyệt 16/11 mà tôi dùng để so

| Mục | Nội dung | Nguồn |
| --- | --- | --- |
| Cam kết | Đúng một câu: "Chính hãng, bao check". Không "100%" | Luật chung 16/11 |
| Bao check | Phát hiện hàng giả trong 30 ngày, còn hộp và tag: hoàn 100% và đền thêm 100% | Yêu cầu của bạn |
| Đổi size hàng order (A.2) | Đi theo size shop tư vấn mà không vừa: shop đổi và chịu ship. Khách tự đoán size: không đổi, shop đăng pass giúp miễn phí. Quà Noel: đổi đến 31/12, khách trả ship | `bao-cao-60-sales.md` |
| Order về trễ (A.3) | Trễ 1–7 ngày: freeship hoặc giảm 100k. Trễ hơn 7 ngày hoặc lỡ ngày khách đã báo: được huỷ, hoàn cọc | `bao-cao-60-sales.md` |
| Thanh toán | Chỉ nhận tiền qua tài khoản hộ kinh doanh | Yêu cầu của bạn |

### Từng câu trên web

| # | Câu trên web | Ở đâu | So với chính sách | Nhãn |
| --- | --- | --- | --- | --- |
| 1 | (không có) "bao check", cam kết hàng giả 30 ngày, hoàn và đền | Toàn web | **Thiếu hẳn** | [Chắc chắn] |
| 2 | "Giày chính hãng — mã sản phẩm khớp tem hộp"; "Mã sản phẩm khớp tem hộp, tra trên trang chủ hãng ra đúng mẫu" | Thanh chữ chạy, cam kết trang mẫu, câu hỏi thường gặp, trang hãng | Không sai, nhưng không phải câu cam kết đã khoá "Chính hãng, bao check" | [Chắc chắn] |
| 3 | "đổi size 3 ngày" trong mô tả trang | Thẻ mô tả của 13 trang (kể cả trang chủ, trang mẫu, giỏ hàng); mô tả do web tự viết ở mỗi trang mẫu; dữ liệu sản phẩm cho Google; 1.380 dòng trong `merchant-feed.xml` | **Cần bạn xác nhận.** Tôi không có văn bản 16/11 cho hàng sẵn. Nếu số ngày đã đổi thì tất cả chỗ này sai cùng lúc | [Chắc chắn về vị trí] |
| 4 | "Đổi size trong 3 ngày nếu còn nguyên hộp, tem[, chưa đi ngoài trời]" | Thanh chữ chạy; dải cam kết trang chủ; cam kết trang mẫu; mục "Đổi size & đổi trả" trang mẫu; câu hỏi thường gặp; `policy.html`; `gioi-thieu.html`; phần "Đọc thêm" trang hãng; chân trang | Như dòng 3 | [Chắc chắn về vị trí] |
| 5 | "Đổi theo nhu cầu (muốn đổi size, đổi mẫu): bạn chịu phí ship hai chiều" | `policy.html`, trang mẫu, câu hỏi thường gặp | **Lệch**: chưa có trường hợp "đi theo size shop tư vấn mà không vừa thì shop chịu ship" | [Có khả năng cao] |
| 6 | (không có) điều khoản hàng order: đổi size, về trễ, thời gian 7–10 ngày | Toàn web. Web chỉ ghi "Website chỉ hiện hàng đang có sẵn… shop tư vấn thêm" | **Thiếu.** Khách hỏi order qua Messenger không có chỗ nào để đọc trước | [Chắc chắn] |
| 7 | "Sau khi xác nhận còn size, shop gửi số tài khoản và mức cọc qua Facebook" | Câu hỏi thường gặp, `policy.html`, trang mẫu, giỏ hàng | **Thiếu ý chính**: không nói chỉ chuyển vào tài khoản hộ kinh doanh, không nêu tên chủ tài khoản để khách đối chiếu | [Chắc chắn] |
| 8 | Tên hộ kinh doanh, mã số thuế, địa chỉ | Đang để trống trong `data/shop.js`, nên web không hiện | **Thiếu.** Đã nói "tài khoản hộ kinh doanh" thì khách cần thấy tên hộ kinh doanh | [Chắc chắn] |
| 9 | Tài khoản Techcombank đứng tên cá nhân | `data/shop.js` (không hiện, nhưng công khai) | **Có thể lệch** nếu tài khoản hộ kinh doanh là tài khoản khác | [Ước đoán] |
| 10 | "Khi nhận hàng bạn được mở hộp kiểm tra trước khi trả tiền" | Phần "Đọc thêm" cuối trang hãng (VD `shop.html?brand=puma`) | **Mâu thuẫn ngay trong web**: chỗ khác ghi "Đồng kiểm tuỳ đơn vị vận chuyển". Câu này còn ngầm hứa trả tiền khi nhận hàng, trái với quy trình đặt cọc | [Chắc chắn] |
| 11 | "Giao sai mẫu, sai size hoặc hàng lỗi đã được xác nhận: shop đổi lại hoặc hoàn tiền và chịu phí ship" | `policy.html`, trang mẫu, câu hỏi thường gặp | Không trái, nhưng chưa có trường hợp hàng giả (hoàn 100% + đền 100%) | [Chắc chắn] |
| 12 | "Shop gửi ảnh chụp thật đôi giày trước khi giao" | Cam kết trang mẫu, câu hỏi thường gặp | Không nằm trong các mục chính sách tôi có. Cần bạn xác nhận còn áp dụng | [Ước đoán] |
| 13 | "Hà Nội và TP.HCM có thể giao trong ngày" | Câu hỏi thường gặp, `policy.html`, trang mẫu | Như dòng 12 | [Ước đoán] |
| 14 | "Ghi chú của shop: Giá xả không giảm thêm" | 69 trang mẫu | **Lệch giọng**: Luật chung cấm giọng thanh lý | [Có khả năng cao] |
| 15 | "Từ 4 triệu — Mẫu hiếm, bản đặc biệt" | Ô "Theo nhu cầu" ở trang chủ | **Lệch**: Luật chung không cho ghi "hàng hiếm" khi bảng hàng không ghi | [Có khả năng cao] |
| 16 | "S&LIFE Sneaker có sẵn 30 mẫu Puma chính hãng"; nút "Tất cả 30"; "Chính hãng · 16 thương hiệu" | Trang hãng, trang chủ | Không thuộc chính sách 16/11, nhưng trái quyết định "không khoe số lượng" (mốc 10) | [Chắc chắn] |

Một điểm cần bạn quyết: quy tắc của web là "chỉ hiện hàng sẵn, không có mục hàng order", trong khi chính sách 16/11 có hai mục riêng cho hàng order. Đưa điều khoản order lên trang chính sách thì không cần mở mục bán hàng order trên web.

---

## F. 5 việc nên sửa đầu tiên

Xếp theo số tin nhắn Messenger có thể lấy lại, không theo độ khó.

1. **Sửa trang mẫu trên điện thoại** (L2, L3, L4, L5, L6).
   - Đưa tên, giá, hàng size lên sát ảnh.
   - Thanh dính đáy có thêm nút nhắn shop cạnh "Thêm vào giỏ".
   - Biểu tượng Facebook ở đầu trang cũng chép thông tin mẫu.
   - Vào từ link có size thì chọn sẵn size đó.
   - Thẻ mẫu ghi "từ …" khi các size khác giá; đang lọc theo size thì hiện giá của size đó.

2. **Cho nút mở thẳng khung chat Messenger** (L1, L7).
   - Thử `m.me/honggiabaoslife` trên 4 trường hợp ở mục 1.3 trước khi đổi.
   - Trong app TikTok, Instagram, Zalo: hiện hộp lựa chọn ngay, không chờ 2,5 giây.
   - Việc này cần bạn thử trên máy thật; tôi không tự xác nhận được.

3. **Đồng bộ chính sách 16/11 lên web** (L9, mục E).
   - Thêm "Chính hãng, bao check" và điều khoản 30 ngày vào cam kết trang mẫu, câu hỏi thường gặp, `policy.html`.
   - Thêm điều khoản hàng order (đổi size, về trễ) vào `policy.html`.
   - Thêm câu "chỉ chuyển khoản vào tài khoản hộ kinh doanh <tên>".
   - Bỏ câu "mở hộp kiểm tra trước khi trả tiền".
   - Chốt lại số ngày đổi size hàng sẵn rồi sửa một lần ở mọi chỗ trong dòng 3 và 4.
   - Tôi cần bạn gửi nguyên văn chính sách 16/11 để chép đúng chữ.

4. **Làm mới và làm sạch dữ liệu** (L8, L10–L14).
   - Chạy lần kiểm hàng 15/11 đang treo.
   - Sửa hãng cho 5 mẫu sai và 7 mẫu "Khác".
   - Đặt lại tên cho các mẫu trùng tên: tôi đã có sẵn tên chính thức theo mã của 256 mẫu Nike/Jordan/Adidas từ đợt tra StockX.
   - Gắn nhãn nữ / trẻ em cho 70 mẫu đã đối chiếu.
   - Ẩn ghi chú "Giá xả không giảm thêm"; viết lại ghi chú về lỗi nhẹ.

5. **Sửa ảnh xem trước khi chia sẻ** (L16).
   - Với các mẫu ảnh bìa dưới 600px mà đã có ảnh lớn cùng góc: đổi ảnh lớn lên làm bìa.
   - Khai kích thước ảnh cho 685 trang `sp/loc`.
   - Sau đó dán thử 3 link vào Messenger, Facebook, Zalo.

**Làm ngay sau 5 việc này:**
- Dựng nội dung tĩnh cho Google (mục D).
- Gỡ tài liệu nội bộ, công thức giá và số tài khoản khỏi web công khai (R1, R2). Việc này không liên quan tới số tin nhắn nhưng là rủi ro kinh doanh, và làm nhanh được nếu bạn đồng ý cách tách.

---

## Phụ lục — Cách kiểm

- Hành trình: trình duyệt giả lập iPhone 13 và Pixel 7, chạy trên web thật, đọc bộ nhớ tạm và lệnh điều hướng sau mỗi lần bấm.
- Dữ liệu: đọc lại 5 file bảng nguồn tải ngày 09/11, tính lại giá và size cho cả 1.444 mẫu còn hàng, so với `data/products.js`; xem tay 24 mẫu ngẫu nhiên.
- Nhãn nam/nữ/trẻ em: so với tiêu đề trang StockX của 256 mã đã tra ngày 09/11.
- Chia sẻ: đọc thẻ của toàn bộ 685 trang `sp/loc` và 1.444 trang `sp/`, đo kích thước 1.380 ảnh xem trước, gọi trang bằng danh tính bot Facebook, Zalo, Google.
- Không chạy JavaScript: mở 6 trang với JavaScript tắt, đếm chữ và link.
- Chính sách: quét mọi câu có từ khoá chính sách trên 11 trang (kể cả phần chỉ hiện khi bấm mở), cộng `data/shop.js`, `merchant-feed.xml` và thẻ mô tả của 13 file trang.
