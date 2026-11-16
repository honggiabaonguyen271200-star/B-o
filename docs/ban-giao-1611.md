# Bàn giao phiên làm việc (27/10 → 16/11/2026)

Viết cho phiên Claude kế tiếp. Ký hiệu: **[đã kiểm]** = đã chạy, đo hoặc xem bằng mắt trong phiên; **[đoán]** = suy luận, chưa kiểm. Quy tắc chi tiết vẫn nằm ở `AGENTS.md` (đọc trước). Không ghi link bảng NCC vào repo: repo công khai, link chỉ nằm trong lịch tự động.

## 1. Website hiện có gì

**Hosting**
- GitHub Pages, repo `honggiabaonguyen271200-star/B-o`, nhánh làm việc `claude/shoe-shop-website-3dln52`.
- Địa chỉ đang dùng (`siteUrl` trong `data/shop.js`): `https://honggiabaonguyen271200-star.github.io/B-o/` [đã kiểm trong file].
- Chưa có tên miền riêng, không có file CNAME [đã kiểm]. Hướng dẫn mua tên miền: `HUONG-DAN-TEN-MIEN.md`.
- Nhánh nào đang được Pages xuất bản thì tôi chưa xem trong cài đặt GitHub [đoán: chủ shop đã trỏ Pages vào nhánh này].

**Công nghệ**
- HTML/CSS/JS thuần: không build, không npm.
- Python chỉ dùng cho script sinh dữ liệu (cần `openpyxl` và Pillow).

**Các trang**
- Trang chủ, danh mục `shop.html`: lọc hãng / dòng / size / giá, `?moi=1` hàng mới về, `?loai=quan-ao` quần áo.
- Trang mẫu `product.html?id=`, giỏ hàng, `dat-hang.html` (gửi yêu cầu qua Facebook), `yeu-cau.html`.
- Trang thông tin, chính sách, bảng size.
- `anh.html`: trang nội bộ để kéo thả ảnh.

**Tính năng chính**
- Chỉ hiện hàng sẵn.
- Chốt đơn qua Facebook cá nhân của chủ shop (mở app, không tự chuyển trang). Không thu tiền trên web.
- Yêu thích, tìm kiếm có biệt danh.
- Cài được như app trên điện thoại (manifest, không dùng service worker).
- Mã đo GA4 / Clarity / Meta Pixel: để trống thì không tải.
- SEO: JSON-LD, canonical, sitemap, `merchant-feed.xml`.

**Mới trong phiên này**
- Bán quần áo.
- Nút chia sẻ ở đầu trang.
- Link chia sẻ bộ lọc có ảnh và tiêu đề xem trước (`sp/loc/…`).

**Dữ liệu sản phẩm**
- `data/products.js` là file tự sinh, không sửa tay.
- Nguồn từ 24/10 là 5 bảng Google Sheet của nhà cung cấp:
  - Đọc bằng `scripts/nguon_hang.py <thư mục .xlsx>`.
  - Nhận diện bảng theo tên file: `ctv`, `hana`, `trung`, `thang`, `ncc5`. Mỗi bảng có cấu trúc riêng.
  - Gộp theo mã; mỗi size lấy giá CTV thấp nhất.
- Giá bán: CTV < 3 triệu thì +300k; từ 3 triệu thì +10%, làm tròn lên 10k. Giày và quần áo như nhau.
- Tên mẫu, theo thứ tự ưu tiên: `data/ten-mau.csv` > tên đang có > tên trong bảng NCC > tên dòng của mẫu cùng mã gốc.
- Sau khi cập nhật, script tự chạy `scripts/static_pages.py`. Script này sinh `sp/`, `sitemap.xml`, feed, chuẩn hoá ảnh bìa và `images/products/danh-sach.js`.

**Cập nhật hàng**
- Lịch tự động "Kiểm hàng sẵn S&LIFE" (`trig_01BCbAnFjkVica4SxvqggYHk`, 8h57 ngày 1 và 15 hằng tháng) gửi quy trình 8 bước vào session này. Link các bảng nằm trong lời nhắn của lịch.
- Bảng Trung và Thắng không công khai: chép bằng Google Drive vào thư mục Drive của chủ shop rồi tải .xlsx.

**Số liệu lúc bàn giao (lần cập nhật 09/11)** [đã kiểm]
- 1.789 mẫu trong dữ liệu, 1.444 mẫu còn hàng (76 là quần áo).
- 1.380 mẫu có ảnh.
- `images/products` có 4.908 file, nặng 153 MB; repo `.git` khoảng 294 MB.

## 2. Việc đã làm, theo thứ tự

1. **Bán thêm quần áo và thêm bảng NCC thứ 5** (commit `1be22ded`). Đã kiểm bằng Playwright.
   - Quần áo có `cat:"ao"`, size chữ S/M/L… (`S Âu` / `S Á`).
   - Trang `shop.html?loai=quan-ao`, menu "Quần áo", dãy quần áo ở trang chủ.
   - Trang chung, trang hãng và link lọc chỉ có giày; tìm kiếm, yêu thích và hàng mới gồm cả hai.
   - Quần áo mà bảng chỉ ghi mã thì ẩn cho tới khi có tên trong `ten-mau.csv`.
   - Giá quần áo lúc đầu tôi để +20%; chủ shop chốt lại là như giày.
2. **Link chia sẻ có xem trước và nút chia sẻ** (commit `b5d189b9`).
   - 686 trang tĩnh `sp/loc/<hãng>[--<dòng>][--size-<size>].html`.
   - Nút chia sẻ ở đầu trang: điện thoại mở bảng chia sẻ, máy tính chép link.
   - Sửa lỗi `size=37%2C5` bị hiểu thành size 37 và 5. Size trong link giờ viết `37.5`, link cũ vẫn hiểu đúng.
3. **Kiểm hàng định kỳ 09/11** (commit `76c9c07b`): 1.456 → 1.444 mẫu còn hàng. 22 mẫu mới, 34 mẫu hết, 134 mẫu đổi size, 37 mẫu đổi giá.
   - Tra được tên cho 2 mẫu: KI3438, IH9166.
   - Bản sao Drive tạo trong lần này: "trung 2026-11-09", "thang 2026-11-09".
4. **Ảnh cho mẫu chưa có ảnh** (commit `f8b6c23c`).
   - 22 ảnh chính thức của hãng.
   - 73 ảnh chèn trong bảng NCC. Khoảng 1/3 ảnh trong bảng bị lệch dòng (sai mẫu); tôi soát bằng mắt và chỉ giữ 74/117 ảnh.
5. **Ảnh nhiều góc** (`tai_anh_hang.py --goc`, tối đa 5 ảnh/mẫu; commit `90e29862`, `92a8dec6`). Nguồn: New Balance, Asics, Onitsuka, Puma, Nike/Jordan (nike.com) và Adidas (khung xoay 360° của StockX). Đã soát ngẫu nhiên khoảng 80 mẫu.
6. **Ảnh từ web chính hãng khác** (commit `141ca3fa`; chủ shop cho phép).
   - Babolat, Wilson (`products.json` công khai của Shopify), Skechers, On (web Anh), UGG, Under Armour.
   - Dép Puma Cool Cat (ghép thêm mã màu lấy từ tên mẫu), Uniqlo (1 ảnh đúng màu), áo Nike Dri-FIT.
   - Đã soát từng mẫu.
7. **Ảnh StockX cho Nike/Jordan/Adidas đời cũ** (commit `3e8b883b`; chủ shop cho phép dùng web bán lại).
   - Tra trang StockX theo mã bằng tìm kiếm web; ghép tên ảnh từ đường dẫn trang và chữ hoa trong tiêu đề; kiểm tra link thật.
   - Thêm 702 ảnh cho 242 mẫu. Bỏ 4 mẫu lệch màu: IB0018-004, CU8591-101, DC0774-102, DR6966-700.
   - Ghi thêm vào `scripts/anh-stockx.csv`.
8. **Onitsuka web Nhật / Trung Quốc** (theo gợi ý của chủ shop) [đã kiểm]: web Nhật dùng chung kho ảnh `asics.scene7.com`, không có 4 mã còn thiếu; web Trung Quốc không mở được.
9. **Danh sách mẫu cần chụp** `docs/anh-can-chup.md` (495 mẫu chưa đủ 3 ảnh, 64 mẫu chưa có ảnh nào) và ghi chú nguồn ảnh vào `AGENTS.md` (commit `73f2e3b1`).
10. **Cập nhật lời nhắn của lịch tự động**: thêm `ncc5`, quần áo và giá chung cho giày lẫn quần áo.

## 3. Việc còn dở, lỗi đã biết, rủi ro

**Việc chưa làm**
- **Lịch kiểm hàng 15/11 đã chạy nhưng chưa làm** [đã kiểm]. Lời nhắn của lịch tới session lúc 15/11 01:57 UTC; tôi đọc được ngày 16/11 và chưa chạy. Web đang là dữ liệu của 09/11.
- **Quần áo chờ tên**: 18 mã quần áo Nike/Adidas mà bảng chỉ ghi mã nên đang ẩn. Tìm kiếm web không tra ra tên đúng mã.

**Tên mẫu cần xem lại**
- Tên tạm của vài mẫu Nike/Jordan: FQ4155-800, HV1488-300, IU2268-100, IZ5846-101, JA6918-001.
- Tên đáng ngờ, chưa sửa:
  - M2022RDA ghi "Puma 2002R…" nhưng đây là New Balance.
  - "Puma Champion Birkenstock…", "Puma Old Order Turbo GT" đang xếp sai hãng.
  - Mã JQ04775 có thể là JQ4775 gõ nhầm [đoán].
- Một vài tên trong bảng NCC không khớp với mã trên StockX (VD DC0774-102: bảng ghi "Sail Off-Noir", StockX ghi "Dark Grey").

**Rủi ro về ảnh**
- **Ảnh StockX**: chỉ khoảng 55/242 mẫu được xem bằng mắt (30 mẫu lệch màu nhiều nhất và một nhóm ngẫu nhiên); phần còn lại chỉ qua so màu tự động. Ảnh StockX hay đậm hoặc nhạt hơn hàng thật (VD Dunk High Laser Blue, Jordan 1 New Emerald).
- StockX là web bán lại, không phải nguồn chính hãng; chủ shop đã đồng ý dùng.
- Ảnh Uniqlo là ảnh người mẫu: bìa giữ nguyên nền, không giống phong cách các ảnh bìa khác.
- **Công cụ tạm không nằm trong repo**: các script lấy ảnh Babolat, Wilson, Skechers, On, StockX và công cụ ghép ảnh soát chỉ nằm trong scratchpad, sẽ mất khi container bị thu hồi. Cách làm đã ghi trong `AGENTS.md` (dòng `tai_anh_hang.py`), nhưng muốn chạy lại phải viết lại.
- `scripts/anh-tai-ve.json` (sổ `goc`) được ghi thêm bằng tay trong lúc chạy; trường `them` của vài mã có thể lệch với số file thật [đoán].
- **Dung lượng**: ảnh 153 MB, `.git` 294 MB, còn xa giới hạn 1 GB của GitHub Pages [đã kiểm]. Nếu chủ shop gửi nhiều ảnh chụp, cần nén WebP ≤ 1200px như quy ước.

**Hạn chế của môi trường**
- Adidas, Salomon, Vans, StockX và GOAT chặn trình duyệt tự động [đã kiểm].
- Hệ thống an toàn hai lần chặn việc dò API không công khai (ô tìm kiếm của web hãng, StockX/GOAT). Không cố lách.
- Lệnh chạy nền tối đa 2 giờ: `--goc` cho Nike bị dừng hai lần, đã chạy tiếp được vì script bỏ qua mã đã ghi sổ.
- Nike đời cũ không còn trên nike.com ở mọi nước (đã thử thêm 12 nước).

**Phụ thuộc vào nhà cung cấp**
- `nguon_hang.py` dựa vào cấu trúc từng bảng NCC. NCC đổi cột hoặc tên trang tính thì có thể ra 0 mẫu; lời nhắn của lịch có bước dừng khi còn hàng giảm > 30%.

## 4. Quyết định chủ shop đã chốt (trong phiên)

- Bán thêm quần áo; không bán phụ kiện.
- Thêm bảng NCC thứ 5.
- Giá quần áo như giày: < 3 triệu +300k; ≥ 3 triệu +10%, làm tròn lên 10k.
- Link chia sẻ phải có mô tả, VD "Giày Puma, size 37,5". Cần nút chia sẻ trong app điện thoại.
- Mỗi mẫu cần nhiều ảnh góc; "không muốn mẫu nào thiếu".
- Cho phép lấy ảnh từ mọi web chính hãng, không giới hạn 1–2 nguồn.
- Đồng ý dùng StockX/GOAT và tự chụp phần còn lại ("làm cả hai").
- Onitsuka có thể lấy từ web chính hãng Nhật hoặc Trung Quốc.

Các ràng buộc giữ từ trước:
- Không ghi vào bảng Google Sheet của NCC.
- Không ghi link bảng vào repo.
- Không mua dịch vụ, không tạo tài khoản.
- Không xoá file trên Drive khi chủ shop chưa yêu cầu.
- Không tạo PR khi chưa được yêu cầu.
- Trả lời bằng tiếng Việt, ngắn gọn.

## 5. Nên làm trước

1. **Chạy kiểm hàng 15/11 theo lời nhắn của lịch.** Dữ liệu đang cũ 1 tuần, trong khi web chỉ được hiện hàng sẵn; mẫu NCC đã bán hết vẫn hiện thì khách hỏi mua hàng không còn. Đây là việc định kỳ đã chốt, làm theo 8 bước trong lời nhắn. Nếu container mới, nhớ cài `openpyxl` và Pillow.
2. **Đưa các công cụ lấy ảnh tạm vào repo.** Gộp Babolat, Wilson, Skechers, Uniqlo, Puma ghép mã màu, StockX theo mã, ảnh ghép soát kèm tên mẫu và so màu với ảnh bìa vào `scripts/tai_anh_hang.py` hoặc một script riêng. Mỗi lần kiểm hàng đều có mẫu mới cần ảnh; công cụ chỉ nằm trong scratchpad nên sẽ mất, lần sau phải làm lại từ đầu.
3. **Nhận và nhập ảnh chủ shop chụp, đồng thời sửa tên sai.** Đây là phần còn lại của yêu cầu "không mẫu nào thiếu ảnh" (495 mẫu trong `docs/anh-can-chup.md`). Kèm sửa tên sai hãng (M2022RDA, các mẫu "Puma Champion…") qua `ten-mau.csv`, vì tên sai làm sai lọc theo hãng và SEO.
