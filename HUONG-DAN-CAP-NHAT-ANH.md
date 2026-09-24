# Cập nhật ảnh sản phẩm — cách nhanh nhất cho hàng trăm mẫu

Website tự tìm ảnh theo tên file trong `images/products/`: **tên file = mã sản phẩm** (`U204LMMC.jpg`, ảnh phụ `U204LMMC-2.jpg`, `-3`… tối đa `-8`).
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
   Kéo nhiều ảnh cùng lúc: ảnh đầu là ảnh chính, các ảnh sau thành `-2`, `-3`…
5. Xong một đợt → Commit + Sync trong Antigravity.

Ảnh được tự thu nhỏ (cạnh dài 1200px) và đổi sang JPG. Ảnh iPhone dạng HEIC: gửi qua Zalo/Messenger cho chính mình rồi tải về (thành JPG), hoặc cài iPhone: **Cài đặt → Camera → Định dạng → Tương thích nhất**.

### Mẹo chụp nhanh một lô 50–100 đôi
- Xếp giày theo thứ tự trong bảng, chụp liền một mạch 1–3 ảnh/đôi (ngang thân, mũi giày quay trái, cùng một góc để trang web đồng bộ).
- Nền trắng hoặc tờ giấy A2/A3, ánh sáng cửa sổ ban ngày; hộp chụp (lightbox) mini giúp ảnh đều màu hơn.
- Chuyển ảnh sang máy tính một lần (Zalo "Cloud của tôi", Google Photos, hoặc cáp), rồi kéo thả theo cách 2.

## Cách 3 — Công cụ bên thứ ba (khi cần ảnh đẹp, đồng bộ hơn)

| Công cụ | Dùng cho | Ghi chú |
| --- | --- | --- |
| **Canva** | Banner trang chủ, banner hãng, ảnh khách hàng, ảnh đăng mạng xã hội | Có mẫu sẵn đúng kích thước. Xoá nền ảnh làm từng ảnh (gói Pro) — hợp với vài chục ảnh, không phải vài trăm. |
| **Photoroom** (app điện thoại / web) | Xoá nền, đặt nền trắng đồng bộ **hàng loạt** | Có chế độ xử lý nhiều ảnh một lúc; bản miễn phí có giới hạn, gói trả phí bỏ giới hạn. Xuất ảnh xong kéo thả theo cách 2. |
| **remove.bg** | Xoá nền hàng loạt trên máy tính | Trả phí theo số ảnh. |

**Không nên** tải ảnh từ website/fanpage shop khác (ảnh có bản quyền, nhiều ảnh có logo shop khác). Ảnh chính thức của hãng chỉ dùng khi được phép.

---

## Banner và ảnh khách hàng

Chép vào thư mục tương ứng (chuột phải thư mục trong Antigravity → **Reveal in File Explorer**), rồi Commit + Sync:

- **Banner trang chủ** → `images/banners/banner-1.jpg`, `banner-2.jpg`… (ảnh ngang ~1600 × 700). Có từ 2 ảnh sẽ tự chạy slider.
- **Banner đầu trang hãng** → `images/banners/new-balance.jpg`, `onitsuka-tiger.jpg`, `jordan.jpg`, `adidas.jpg`…
- **Ảnh khách hàng** → `images/khach-hang/1.jpg`, `2.jpg`, `3.jpg`… (khách đã đồng ý).

Làm banner trên Canva: tạo thiết kế cỡ **1600 × 700 px**, xuất **JPG**, đặt tên như trên.
