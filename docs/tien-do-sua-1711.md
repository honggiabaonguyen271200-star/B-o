# Tiến độ sửa theo báo cáo soát 17/11

Chủ shop duyệt 17/11: "việc gì sửa được, đề xuất nên sửa thì sửa toàn bộ". Nguyên văn chính sách 16/11: tạm bỏ qua (chưa thêm "bao check", điều khoản order, tài khoản hộ kinh doanh). Chủ shop sẽ tự thử trên điện thoại sau khi xong.

Nếu phiên bị ngắt (hết hạn mức): đọc file này và `docs/soat-fable-2026-11-17.md`, làm tiếp từ việc đầu tiên chưa đánh dấu xong.

## Việc

- [x] 1. Trang mẫu trên điện thoại + nút nhắn shop (commit `00d763c3`): tên/giá trên ảnh, thanh đáy có "Nhắn shop", chọn sẵn size theo link, giá "Từ", giá theo size đang lọc, mở thẳng Messenger (`SHOP.openMessenger`), hộp chọn ngay trong app TikTok/IG/Zalo, bỏ câu "mở hộp kiểm tra trước khi trả tiền", bỏ số tài khoản khỏi `data/shop.js`, `cart.html` noindex.
- [x] 2. Làm sạch dữ liệu: hãng sai (M2022RDA, 2 mẫu Champion, FU7205 Reebok, 7 mẫu "Khác"), tên trùng (tên theo mã từ StockX), nhãn nữ/GS, ghi chú "Giá xả không giảm thêm", tên viết HOA, mã bảng Thắng thiếu đuôi màu (343881 gộp 2 màu).
- [x] 3. Chạy kiểm hàng 15/11 (quy trình 8 bước của lịch "Kiểm hàng sẵn S&LIFE").
- [ ] 4. Ảnh xem trước: nâng ảnh bìa < 600px bằng ảnh lớn đúng mã; khai kích thước ảnh cho `sp/loc`.
- [ ] 5. Nội dung tĩnh cho Google: trang `sp/<mã>`, trang hãng/dòng, trang chủ có sẵn nội dung trong HTML; sitemap trỏ về trang tĩnh.
- [ ] 6. Kiểm tra cuối 390px/1280px, cập nhật `AGENTS.md`, báo chủ shop danh sách cần thử trên điện thoại.

## Ghi chú cho phiên sau

- Công cụ tạm ở scratchpad có thể đã mất; cách làm ghi trong `AGENTS.md`.
- Không tự thêm chữ chính sách mới khi chưa có nguyên văn 16/11.
- Việc chủ shop cần thử: nút "Nhắn shop" mở Messenger trên iPhone/Android, trong app Facebook, TikTok/Instagram. Hỏng thì đặt `openMessenger: false` trong `data/shop.js`.
