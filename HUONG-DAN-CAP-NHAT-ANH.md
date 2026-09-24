# Hướng dẫn cập nhật ảnh giày lên website

Làm trên **máy tính** (trình duyệt Chrome) là dễ nhất. Không cần cài phần mềm, không cần chạy lệnh.

## Bước 1 — Chuẩn bị ảnh

1. Chụp hoặc lấy ảnh đôi giày. Ảnh đẹp nhất là **ảnh vuông, nền trắng**, chụp ngang thân giày.
2. **Đổi tên file ảnh thành mã sản phẩm**, ví dụ đôi *New Balance 204L Timberwolf* mã `U204LMMC` → đặt tên `U204LMMC.jpg`.
   - Mã có dấu gạch ngang thì giữ nguyên: `1183C102-001.jpg`, `FV5029-141.jpg`.
   - Viết **chữ hoa** giống hệt mã trên website.
3. Muốn có nhiều ảnh (nhiều góc) cho một đôi: thêm `-2`, `-3`… vào sau mã:
   `U204LMMC.jpg` (ảnh chính), `U204LMMC-2.jpg`, `U204LMMC-3.jpg`, … tối đa `-8`.
4. Ảnh nặng quá 1MB thì nên nén trước ở https://squoosh.app hoặc https://tinypng.com cho web tải nhanh.

> Không chắc tên file? Mở trang **Kiểm tra ảnh** của website: `…/anh.html`.
> Trang này liệt kê tất cả mẫu giày, tên file cần đặt (có nút **Chép tên**) và mẫu nào **đã có / chưa có ảnh**.

## Bước 2 — Tải ảnh lên GitHub

1. Mở thư mục ảnh của website:
   https://github.com/honggiabaonguyen271200-star/B-o/tree/claude/shoe-shop-website-3dln52/images/products
2. Bấm nút **Add file** (góc phải) → **Upload files**.
3. **Kéo thả** các file ảnh vào khung (được chọn nhiều ảnh một lúc).
4. Kéo xuống dưới, bấm nút xanh **Commit changes**.

## Bước 3 — Kiểm tra

Đợi khoảng **1–2 phút**, mở lại website (bấm tải lại trang). Ảnh thật sẽ thay cho hình minh hoạ.
Nếu chưa thấy: kiểm tra lại tên file ở trang `anh.html`, rồi tải lại bằng Ctrl + F5.

## Thay hoặc xoá ảnh

- **Thay ảnh**: tải lên file mới **trùng tên** → GitHub tự thay file cũ.
- **Xoá ảnh**: bấm vào file trong thư mục `images/products` → nút **…** (góc phải) → **Delete file** → **Commit changes**.

## Câu hỏi thường gặp

- **Ảnh từ iPhone (.HEIC)?** Gửi ảnh qua Zalo/Messenger cho chính mình rồi tải về (sẽ thành .jpg), hoặc chụp ở chế độ “Tương thích nhất” trong Cài đặt → Camera → Định dạng.
- **Làm trên điện thoại được không?** Được: mở link ở Bước 2 bằng Chrome, bật “Trang web cho máy tính” (Desktop site) để thấy nút **Add file**.
- **Mẫu giày không có mã?** Tên file là mã đặc biệt hiển thị ở trang `anh.html` (ví dụ `samba-og-white-gum.jpg`).
