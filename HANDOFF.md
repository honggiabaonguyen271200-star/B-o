# HANDOFF — Thiết kế mới S&LIFE (nhánh `thiet-ke-moi`)

Cập nhật 30/09/2026 · Mốc 1: trang chủ, danh mục, chi tiết sản phẩm (điện thoại + máy tính).
Nhánh chính `claude/shoe-shop-website-3dln52` **chưa bị sửa** — website đang chạy vẫn là bản cũ cho tới khi chủ shop duyệt.

## Xem thử

- Link bấm được: https://raw.githack.com/honggiabaonguyen271200-star/B-o/thiet-ke-moi/index.html
  (raw.githack lưu đệm vài phút; thấy bản cũ thì nhấn Ctrl+F5.)
- Trên máy: trong Antigravity chuyển sang nhánh `thiet-ke-moi` (góc dưới trái → chọn nhánh) → chạy `xem-web.bat`.
  **Nhớ chuyển lại nhánh chính trước khi tải ảnh mới**, để ảnh không lẫn vào nhánh thử.
- Ảnh so sánh trước/sau (cùng điều kiện, có font): `docs/thiet-ke-moi/so-sanh/` —
  `trang-chu-390.jpg`, `trang-chu-1440.jpg`, `danh-muc-390.jpg`, `danh-muc-1440.jpg`, `san-pham-390.jpg`, `san-pham-1440.jpg`.

## Hướng thiết kế

Codex yêu cầu so sánh hai hướng:

- **A — cửa hàng tối giản** (gần 807GARAGE): nền trắng, ảnh sản phẩm lớn, tìm/lọc mạnh, trang trí tối thiểu.
- **B — tạp chí sneaker** (gần 81 Sneaker): hero ảnh lớn, chữ condensed in hoa, khối thương hiệu có cá tính.

**Đã chọn: A làm nền, B làm điểm nhấn.** Mọi chỗ khách thao tác mua (header, lọc, thẻ, trang sản phẩm) theo A: gọn, trắng, dễ quét. Chữ condensed, gradient logo và khối lớn chỉ dùng ở hero, tiêu đề khu vực, khối "S&LIFE — Since 2021" và "Theo dõi S&LIFE". Lý do: chủ shop muốn cả hai. Hiện chỉ 16/496 mẫu có ảnh thật, nên một bản thuần B sẽ lộ nhiều ô trống. Hướng A giữ giày làm nhân vật chính, đúng giọng điềm đạm của S&LIFE.

Hệ nhận diện:

- **Màu:** gradient `#004AAD → #771CAE → #DB3137` (biến CSS ở đầu `assets/css/style.css`), nền trắng / `--mist #F6F4FB`.
  Riêng `--muted` sửa từ `#8C879C` thành `#6E6980`, vì chữ nhỏ màu cũ chỉ đạt khoảng 3,5:1 trên nền trắng (chưa đủ 4,5:1). `#8C879C` vẫn giữ làm `--muted-2` cho viền và biểu tượng.
- **Chữ:** tiêu đề Barlow Condensed 800 in hoa (có tiếng Việt, đã kiểm dấu Ấ/Ệ/Ở); nội dung Be Vietnam Pro.
- **Logo, favicon:**
  - Header dùng mark gradient + chữ S&LIFE màu mực.
  - Footer và khối gradient dùng bản trắng.
  - Favicon, apple-touch-icon và `og:image` lấy từ `images/brand/`.
  - Thêm 4 file SVG đổi màu từ bản gốc (không vẽ lại): `slife-wordmark-ink.svg`, `slife-wordmark-white.svg`, `slife-mark-white.svg`, `slife-full-white.svg`.

## Đã làm

### Chung (mọi trang)

- **Thanh thông báo gradient:** tự đổi 3 câu thật từ `shop.js` (`announcements`), có nút ẩn; tắt chuyển động khi máy bật giảm chuyển động.
- **Header:**
  - Dính khi cuộn.
  - Ô tìm kiếm lớn luôn thấy, có gợi ý tức thì: ảnh nhỏ, tên, mã, giá, chọn bằng phím mũi tên.
  - Tìm được mã viết thường, có hay không có gạch (`1183C102 001` ra `1183C102-001`); gõ đúng mã rồi Enter là vào thẳng trang sản phẩm.
- **Menu máy tính:** Tất cả giày · Thương hiệu ▾ (mega menu hãng → dòng, kèm số mẫu) · Theo nhu cầu ▾ (giày nữ, GS/Kid, giày tennis, tầm giá — số lấy từ dữ liệu) · Hướng dẫn size · Liên hệ.
  - Điện thoại: ngăn kéo menu có các dòng của từng hãng.
- **Yêu thích:** nút tim trên mọi thẻ, lưu trên trình duyệt; icon ở header có số; trang `shop.html?wish=1`.
- **Giỏ hàng:**
  - Giỏ trượt từ phải khi thêm giỏ.
  - Giỏ có **số lượng** (tối đa 5 đôi mỗi size). Trang giỏ tăng/giảm được; tin nhắn đơn ghi "SL".
- **Một nút chat nổi**, bấm mới mở Zalo / Messenger / Gọi. Thay ba nút cũ đang che khối cam kết trên điện thoại.
- **Footer:** nền mực, dải gradient, 4 cam kết thật, logo trắng.
- **Ảnh thiếu:** ô trung tính (logo mờ + "Ảnh thật đang cập nhật"), bỏ hình giày vẽ minh hoạ.
- **Danh sách ảnh `images/products/danh-sach.js` (tự sinh):**
  - Giúp web biết mẫu nào có ảnh thật: xếp mẫu có ảnh lên trước, hiện ảnh thứ 2 khi rê chuột, trang sản phẩm biết trước số ảnh, bớt tải thử ảnh không có.
  - Tự cập nhật bởi `anh.html`, `nhap-anh-zip.bat` / `import_image_zip.py`, `extract_images.py`; chạy tay bằng `python scripts/image_manifest.py`.
  - Thiếu hoặc cũ vẫn chạy: web tự dò ảnh `.webp` / `.jpg` như trước.
- **Sửa cấu trúc và truy cập:** sửa thẻ `<main>` lồng nhau ở 8 trang; thêm link "Bỏ qua, tới nội dung chính"; vòng focus tím; hộp thoại giữ phím Tab và đóng bằng Esc.

### Trang chủ

Thứ tự khối:

1. **Hero 3 slide:** ảnh giày thật + chữ condensed "ONLY AUTHENTIC"; dòng 204L có nhiều ảnh thật nhất; "Mở hộp kiểm tra rồi trả tiền".
   - Tự chuyển, có nút dừng, vuốt được trên điện thoại, không tự chạy khi máy bật giảm chuyển động.
   - Banner `images/banners/banner-N.jpg` do shop tải lên sẽ tự thêm vào cuối.
2. **Cam kết:** 4 biểu tượng tròn gradient.
3. **Thương hiệu:** ô hãng + số mẫu thật; rê chuột đổi nền gradient.
4. **Gợi ý cho bạn:** cuộn ngang, có nút ‹ ›.
5. **Dòng giày nổi bật:** ô lớn; dòng chưa có ảnh dùng ô chữ gradient, không giả ảnh.
6. **Khối "S&LIFE — Since 2021":** số liệu thật (393 mẫu, 9 hãng, đổi size 3 ngày).
7. **Theo thương hiệu:** tab hãng + băng sản phẩm.
8. **Ảnh khách:** chỉ hiện khi có ảnh thật trong `images/khach-hang/`.
9. **Câu hỏi thường gặp:** lấy từ `shop.js` `faq`, nội dung chép từ chính sách hiện có.
10. **Theo dõi S&LIFE:** Instagram, TikTok, Facebook, Zalo — không có form email vì web không có máy chủ.

### Danh mục (`shop.html`)

- Tiêu đề condensed. Hàng chip điều hướng: hãng (trang tất cả) hoặc dòng (trang hãng).
- Bộ lọc là cột trái trên máy tính, bảng trượt từ dưới lên trên điện thoại. Gồm:
  - thương hiệu (nhiều lựa chọn);
  - **lưới chip size**;
  - **thanh kéo khoảng giá** + ô nhập + nút nhanh;
  - màu;
  - code nam/nữ/GS/Kid;
  - hiện cả mẫu hết size (nhận order).
- Chip bộ lọc đang chọn + "Xoá tất cả". Toàn bộ trạng thái ghi lên URL, nên bấm Back từ trang sản phẩm quay lại đúng chỗ.
- Sắp xếp: Nổi bật (có ảnh thật + nhiều size), giá tăng/giảm, còn nhiều size, tên.
- Thẻ sản phẩm:
  - ảnh vuông nền `--mist`, ảnh thứ 2 khi rê chuột, tim yêu thích;
  - nhãn thật: "Còn 1 size", "Hết size · nhận order", code nữ/GS, "Xả kho";
  - tên 2 dòng, mã, size còn, giá;
  - nút **Thêm nhanh** mở hộp chọn size.
- Không có kết quả: gợi ý bỏ từng bộ lọc, nút Zalo, băng gợi ý.
- Dòng chung nhiều hãng: `shop.html?line=giay-tennis`.

### Chi tiết sản phẩm (`product.html`)

- **`?id=` nhận cả chữ hoa và mã sản phẩm:** `product.html?id=U204LMMC` đã chạy. Không tìm thấy thì có nút tìm lại theo mã.
- **Thư viện ảnh:**
  - thumbnail cuộn ngang, nút ‹ ›, bộ đếm, vuốt được;
  - **rê chuột để phóng to** (máy tính);
  - bấm ảnh để xem toàn màn hình (phím ← →, vuốt, Esc).
- **Mẫu chưa có ảnh:** ô trung tính + nút "Nhắn Zalo nhận ảnh thật".
- **Thông tin chính:**
  - tên condensed in hoa;
  - chip mã (bấm để sao chép);
  - nhãn "Có sẵn · N size" / "Hết size · nhận order", "Mới · đủ hộp, tem";
  - giá đổi theo size nếu size có giá riêng;
  - ghi chú shop, lưu ý form (`FIT_NOTES`).
- **Chọn size:**
  - lưới size theo dải size của hãng: size đang có đậm, **size đã hết làm mờ** (bấm để hỏi order qua Zalo);
  - hộp thoại **Hướng dẫn chọn size**: form của dòng này, cách đo chân, bảng lưu ý form, nút hỏi Zalo.
- **Mua hàng:**
  - bộ tăng/giảm số lượng;
  - **Thêm vào giỏ** (gradient) → giỏ trượt;
  - **Mua ngay** → thêm giỏ rồi sang Đặt hàng;
  - **Tư vấn Zalo** (tin nhắn soạn sẵn kèm link);
  - nút tim.
- **Thông tin thêm:**
  - accordion Cam kết (`shop.perks`) / Giao hàng & thanh toán / Đổi size & đổi trả — nội dung chỉ lấy từ chính sách có sẵn;
  - chia sẻ Facebook, sao chép link, chia sẻ của điện thoại (Zalo, Messenger…);
  - mô tả và bảng thông tin chỉ dùng dữ liệu thật;
  - khối "Về S&LIFE";
  - băng Cùng dòng / Cùng tầm giá / Đã xem gần đây.
- **Điện thoại:** thanh mua dính đáy màn hình (giá, size đang chọn, Thêm vào giỏ) hiện khi đã cuộn qua nút mua. Nút chat tự đẩy lên, không che thanh này.

### Tài liệu

- `AGENTS.md`: thêm file mới, quy tắc giao diện.
- `HUONG-DAN-ANTIGRAVITY.md`, `HUONG-DAN-CAP-NHAT-ANH.md`: đường dẫn `D:\B-o`; anh.html lưu WebP và ghi danh sách ảnh.
- `policy.html` / `README.md`: câu mô tả nút Mua ngay mới.

## Đã kiểm (có bằng chứng)

Chạy bằng Chromium tự động (Playwright) trên bản thử tại máy, có tải font Google.

- **34/34 thao tác đạt.** Tất cả chạy trên máy tính, trừ nhóm "Điện thoại" chạy trên màn 390px có cảm ứng.
  - **Tìm kiếm:**
    - gợi ý khi gõ mã thường `u204lmmc`;
    - Enter với mã đúng vào thẳng sản phẩm;
    - tìm `1183C102 001`;
    - chọn gợi ý bằng phím mũi tên.
  - **Menu:** mega menu mở khi rê chuột.
  - **Trang sản phẩm:**
    - `?id=U204LMMC` mở được;
    - chưa chọn size mà bấm thêm giỏ → nhắc chọn size;
    - chọn size 40, số lượng 2 → giỏ trượt ghi "Size 40 · SL 2", icon giỏ = 2;
    - bật tim;
    - bấm size đã hết → gợi ý hỏi order;
    - mở hộp hướng dẫn size;
    - xem ảnh toàn màn hình, chuyển ảnh bằng phím.
  - **Yêu thích, giỏ:**
    - trang Yêu thích có mẫu đã lưu;
    - tải lại trang giỏ vẫn còn;
    - tăng số lượng trong giỏ.
  - **Danh mục:**
    - lọc size + giá ghi lên URL, hiện chip;
    - bấm Back giữ nguyên bộ lọc;
    - xoá tất cả;
    - không có kết quả → hướng dẫn + Zalo;
    - trang giày tennis;
    - Thêm nhanh từ thẻ.
  - **Mẫu chưa có ảnh:** ô trung tính + nút Zalo.
  - **Bàn phím:** phím Tab đầu tiên vào link "Bỏ qua…".
  - **Điện thoại:**
    - mở menu và các dòng của hãng;
    - nút chat mở Zalo / Messenger / Gọi;
    - bảng lọc trượt lên, nút "Xem N mẫu";
    - thanh mua hiện khi cuộn qua nút mua, ẩn khi lên đầu;
    - **nút chat không che thanh mua** (đáy nút chat 752px < đỉnh thanh mua 775px).
- **Không tràn ngang** ở 360 / 390 / 768 / 1024 / 1440px trên 11 trang (chủ, danh mục, 2 sản phẩm có/không ảnh, giỏ, đặt hàng, chính sách, size, liên hệ, giới thiệu, anh.html).
- **Không lỗi JavaScript** trong Console. Chỉ còn lỗi tải ảnh 404 của mẫu chưa có ảnh (web dò thử `.webp` / `.jpg`), đúng phạm vi cho phép trong tài liệu giao việc.
- Giỏ hàng, đặt hàng, chính sách tự nhận giao diện mới, không vỡ bố cục (đã xem ảnh 390px).
- Script Python: `image_manifest.py` chạy ra 16 mẫu / 118 ảnh; `import_image_zip.py`, `extract_images.py` nạp được sau khi thêm dòng ghi danh sách ảnh.

**Chưa kiểm được:**

- Trên điện thoại thật và Safari/iPhone.
- anh.html ghi `danh-sach.js` trên máy Windows của chủ shop: cần Chrome/Edge chọn thư mục thật; logic giống hệt `image_manifest.py`.
- Điểm Lighthouse / đo tốc độ trước–sau.

## Còn thiếu (mốc sau, theo `codex/05-PHAM-VI-THAM-MY-UX.md`)

1. **Giỏ và đơn** (`codex/03-HIEN-TRANG.md`), chưa sửa trong mốc này:
   - `setCart([])` vẫn xoá giỏ ngay khi tạo nội dung đơn;
   - `orderEndpoint` trống, gửi `no-cors` không chờ xác nhận;
   - chưa chống gửi lặp;
   - chưa sửa size trong giỏ.
2. **Trang phụ** (giới thiệu, liên hệ, chính sách, size, bảo mật): đã nhận màu/chữ mới nhưng chưa làm lại bố cục riêng (ví dụ bảng size đẹp hơn, liên hệ dạng thẻ).
3. **Hiệu năng:** đo trước/sau, preload ảnh hero, thử nén font; `app.js` giờ khoảng 2.100 dòng (vẫn một file, không build).
4. **SEO / chia sẻ:** `og:image` theo từng sản phẩm cần trang tĩnh hoặc bước build, vì máy tìm kiếm không chạy JS; `sitemap.xml` giữ nguyên.
5. **Đo lường:** danh sách sự kiện (xem sản phẩm, tìm kiếm, thêm giỏ, gửi đơn) — chờ chọn công cụ.
6. **Top danh mục đang dùng chữ tắt (NB, OT, J…)** thay logo hãng, vì repo chưa có file logo hãng; không lấy logo từ web khác.

## Câu hỏi cho chủ shop (chỉ những câu chặn việc)

1. **Duyệt hướng thiết kế:** mở link thử trên điện thoại, làm 5 việc trong `codex/05` rồi nhận xét 3 điểm (rối ở đâu, chữ khó đọc chỗ nào, chỗ nào chưa đúng gu).
2. **Nhận đơn:** giữ "khách gửi đơn qua Zalo, shop xác nhận" (có thể thêm lưu Google Sheet làm sổ chờ xác nhận), hay muốn thanh toán/nhận đơn tự động đầy đủ? Câu này quyết định cách sửa phần giỏ/đơn ở mốc sau.
3. **"Hàng mới về":** bảng hàng chưa có ngày nhập, nên web chưa làm mục/menu "Hàng mới" (tránh ghi sai). Nếu muốn, thêm một cột trong Google Sheet (ví dụ "Mới" = 1, hoặc ngày về hàng) để web đọc.

## Bước tiếp theo

1. Chủ shop xem link thử, trả lời 3 câu trên.
2. Sửa theo nhận xét → làm giỏ/đơn, trang phụ, hiệu năng, SEO (`codex/02-LENH-THUC-HIEN.txt`).
3. **Trước khi gộp:**
   - `git fetch` + merge nhánh chính (lấy các commit ảnh mới của chủ shop, không ghi đè ảnh);
   - chạy `python scripts/image_manifest.py` để danh sách ảnh đủ;
   - kiểm lại 34 thao tác;
   - mới gộp `thiet-ke-moi` vào `claude/shoe-shop-website-3dln52`.

Nếu gộp hỏng, khôi phục bằng `git revert` commit gộp. Nhánh `thiet-ke-moi` vẫn giữ nguyên để làm tiếp.
