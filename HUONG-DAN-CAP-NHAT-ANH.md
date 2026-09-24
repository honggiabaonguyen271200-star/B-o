# Cập nhật ảnh sản phẩm — cách nhanh nhất cho hàng trăm mẫu

Website tự tìm ảnh theo tên file trong `images/products/`: **tên file = mã sản phẩm**.
Mỗi mẫu **tối đa 12 ảnh**: `U204LMMC.webp` (ảnh chính) rồi `U204LMMC-2.webp` … `U204LMMC-12.webp`. Trang sản phẩm hiện ảnh lớn, nút ‹ › , vuốt trên điện thoại và dãy ảnh nhỏ.
Các công cụ bên dưới tự lưu ảnh dạng **WebP** (nhẹ hơn JPG khoảng một nửa); file .jpg / .png đặt tay vẫn dùng được.
Có 3 cách, làm theo thứ tự — cách 1 làm trước vì hoàn toàn tự động.

---

## Cách 1 — Lấy ảnh có sẵn trong Google Sheet (tự động, vài phút)

Bảng hàng đã có cột **Hình ảnh**. Ảnh chèn trong bảng được lấy ra tự động, đặt đúng tên mã, thu nhỏ cho web.

1. Mở Google Sheet → **Tệp → Tải xuống → Microsoft Excel (.xlsx)**.
2. Mở thư mục `Documents\B-o` bằng File Explorer → **kéo file .xlsx thả vào `cap-nhat-hang.bat`**.
   Cửa sổ đen sẽ: cập nhật hàng → lấy ảnh → báo "Đã lưu … ảnh".
3. Trong Antigravity: **Source Control → Commit → Sync** để đưa ảnh lên web.

- Ảnh phải nằm **cùng dòng** với tên giày trong bảng. Một dòng nhiều ảnh → ảnh chính + ảnh phụ.
- Nhận cả 3 kiểu chèn ảnh của Google Sheet: ảnh trên ô, ảnh trong ô, công thức `=IMAGE("link")`.
- Mẫu **đã có ảnh thì giữ nguyên** (để không mất ảnh đẹp bạn tự thêm). Muốn lấy lại toàn bộ từ bảng: nhờ Agent chạy
  `python scripts/extract_images.py <file.xlsx> --ghi-de`.
- Mỗi lần cập nhật hàng, mẫu mới có ảnh trong bảng cũng tự có ảnh trên web.

## Cách 2 — Kéo thả ảnh vào trang `anh.html` (cho mẫu còn thiếu)

Không cần đổi tên file bằng tay.

1. Chạy web bằng `xem-web.bat`, mở **http://localhost:8080/anh.html** bằng **Chrome hoặc Edge**.
2. Bấm **Chọn thư mục images/products** → chọn `Documents\B-o\images\products` → cho phép **Chỉnh sửa / Lưu thay đổi**.
3. Ô lọc chọn **Chưa có ảnh**, gõ mã vào ô tìm nếu cần.
4. **Kéo ảnh từ máy thả vào dòng của đôi giày** (hoặc bấm "Kéo ảnh vào đây" để chọn file).
   **Kéo cả 10 ảnh một lần**: ảnh được xếp theo tên file — ảnh điện thoại đặt tên theo thứ tự chụp (`IMG_0101`, `IMG_0102`…), nên **ảnh chụp đầu tiên thành ảnh chính**, các ảnh sau thành `-2` … `-10`.
   Mẫu đã có ảnh thì ảnh mới được thêm tiếp vào số còn trống.
5. Xong một đợt → Commit + Sync trong Antigravity.

Ảnh được tự thu nhỏ (cạnh dài 1200px) và đổi sang JPG. Ảnh iPhone dạng HEIC: gửi qua Zalo/Messenger cho chính mình rồi tải về (thành JPG), hoặc cài iPhone: **Cài đặt → Camera → Định dạng → Tương thích nhất**.

### Dùng Canva: 1 thiết kế = 1 đôi giày, kéo thẳng file zip

1. Trên Canva tạo thiết kế cỡ **1200 × 1200 px** (vuông), đặt tên theo mã giày cho dễ tìm, VD `U204LMMC`.
2. Mỗi **trang** là một ảnh: trang 1 = ảnh chính, trang 2…10 = các góc còn lại. Làm xong đôi đầu, dùng **Tạo bản sao** thiết kế cho đôi sau để giữ bố cục, nền, logo giống nhau.
3. **Chia sẻ → Tải xuống** → loại tệp **JPG** (hoặc PNG) → chọn **tất cả các trang** → Tải xuống. Canva trả về **một file .zip**.
4. Mở `anh.html` → tìm mã giày → **kéo nguyên file .zip thả vào dòng đó**. Web tự giải nén, giữ đúng thứ tự trang (trang 1 thành ảnh chính), thu nhỏ, đổi sang WebP và lưu đúng tên. Không cần giải nén hay đổi tên.

Lưu ý: không đặt chữ to che giày; logo shop nhỏ ở góc là đủ. Ảnh gốc vẫn nên chụp rõ nét — Canva chỉ giúp đồng bộ khung, nền, bố cục.

### Quy trình 10 ảnh / đôi cho một lô 50–100 đôi
- Dùng **một thứ tự góc chụp cố định** cho mọi đôi, VD: 1 ngang thân phải (ảnh chính) → 2 ngang thân trái → 3 mũi → 4 gót → 5 trên xuống → 6 đế → 7 cận chất liệu → 8 cận logo → 9 tem size/mã trong lưỡi gà → 10 cả đôi kèm hộp.
  Khách xem đôi nào cũng thấy cùng thứ tự; ảnh 9 (tem mã) giúp khách tin hàng chính hãng.
- Xếp giày theo thứ tự trong bảng, chụp hết 10 ảnh đôi này rồi mới sang đôi khác (không xen kẽ).
- Trên máy tính, tạo **mỗi đôi một thư mục** (hoặc chọn 10 ảnh liền nhau trong thư mục ảnh) → kéo cả nhóm vào đúng dòng ở `anh.html`.
- Nền trắng hoặc tờ giấy A2/A3, ánh sáng cửa sổ ban ngày; hộp chụp (lightbox) mini giúp ảnh đều màu hơn.
- Chuyển ảnh sang máy tính một lần (Zalo "Cloud của tôi", Google Photos, hoặc cáp), rồi kéo thả theo cách 2.

## Cách 3 — Công cụ bên thứ ba (khi cần ảnh đẹp, đồng bộ hơn)

| Công cụ | Dùng cho | Ghi chú |
| --- | --- | --- |
| **Canva** | Banner trang chủ, banner hãng, ảnh khách hàng, ảnh đăng mạng xã hội | Có mẫu sẵn đúng kích thước. Xoá nền ảnh làm từng ảnh (gói Pro) — hợp với vài chục ảnh, không phải vài trăm. |
| **Photoroom** (app điện thoại / web) | Xoá nền, đặt nền trắng đồng bộ **hàng loạt** | Có chế độ xử lý nhiều ảnh một lúc; bản miễn phí có giới hạn, gói trả phí bỏ giới hạn. Xuất ảnh xong kéo thả theo cách 2. |
| **remove.bg** | Xoá nền hàng loạt trên máy tính | Trả phí theo số ảnh. |

**Không nên** tải ảnh từ website/fanpage shop khác (ảnh có bản quyền, nhiều ảnh có logo shop khác). Ảnh chính thức của hãng chỉ dùng khi được phép.

## Dung lượng — lưu ý khi có hàng nghìn ảnh

- GitHub Pages cho **mỗi website tối đa khoảng 1 GB**. Giới hạn này **giống nhau cho tài khoản miễn phí và trả phí** — mua gói GitHub không tăng được. (Gói trả phí chỉ tăng "Git LFS", nhưng GitHub Pages không phát được file LFS ra web.)
- Ảnh WebP 1200px thường ~80–150 KB → 400 mẫu × 10 ảnh ≈ **0,3–0,6 GB**: vẫn vừa.
- Luôn dùng công cụ ở trên (tự thu nhỏ + WebP); **không chép thẳng ảnh gốc điện thoại** (3–8 MB/ảnh) vào `images/products`.
- Mẫu đã bán hết lâu ngày: có thể xoá bớt ảnh phụ, giữ ảnh chính.
- **Khi vượt ~800 MB**: chuyển ảnh sang dịch vụ lưu ảnh riêng, website giữ nguyên trên GitHub. Gợi ý **Cloudflare R2** (gói miễn phí 10 GB, không tính phí băng thông) hoặc Cloudinary. Việc chuyển do người làm web thực hiện: đổi đường dẫn thư mục ảnh trong code và cách tải ảnh lên.

---

## Banner và ảnh khách hàng

Chép vào thư mục tương ứng (chuột phải thư mục trong Antigravity → **Reveal in File Explorer**), rồi Commit + Sync:

- **Banner trang chủ** → `images/banners/banner-1.jpg`, `banner-2.jpg`… (ảnh ngang ~1600 × 700). Có từ 2 ảnh sẽ tự chạy slider.
- **Banner đầu trang hãng** → `images/banners/new-balance.jpg`, `onitsuka-tiger.jpg`, `jordan.jpg`, `adidas.jpg`…
- **Ảnh khách hàng** → `images/khach-hang/1.jpg`, `2.jpg`, `3.jpg`… (khách đã đồng ý).

Làm banner trên Canva: tạo thiết kế cỡ **1600 × 700 px**, xuất **JPG**, đặt tên như trên.
