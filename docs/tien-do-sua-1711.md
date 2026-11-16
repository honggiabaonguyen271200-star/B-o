# Tiến độ sửa theo báo cáo soát 17/11

Chủ shop duyệt 17/11: "việc gì sửa được, đề xuất nên sửa thì sửa toàn bộ". Nguyên văn chính sách 16/11: tạm bỏ qua (chưa thêm "bao check", điều khoản order, tài khoản hộ kinh doanh). Chủ shop sẽ tự thử trên điện thoại sau khi xong.

Nếu phiên bị ngắt (hết hạn mức): đọc file này và `docs/soat-fable-2026-11-17.md`, làm tiếp từ việc đầu tiên chưa đánh dấu xong.

## Việc

- [x] 1. Trang mẫu trên điện thoại + nút nhắn shop (commit `00d763c3`): tên/giá trên ảnh, thanh đáy có "Nhắn shop", chọn sẵn size theo link, giá "Từ", giá theo size đang lọc, mở thẳng Messenger (`SHOP.openMessenger`), hộp chọn ngay trong app TikTok/IG/Zalo, bỏ câu "mở hộp kiểm tra trước khi trả tiền", bỏ số tài khoản khỏi `data/shop.js`, `cart.html` noindex.
- [x] 2. Làm sạch dữ liệu: hãng sai (M2022RDA, 2 mẫu Champion, FU7205 Reebok, 7 mẫu "Khác"), tên trùng (tên theo mã từ StockX), nhãn nữ/GS, ghi chú "Giá xả không giảm thêm", tên viết HOA, mã bảng Thắng thiếu đuôi màu (343881 gộp 2 màu).
- [x] 3. Chạy kiểm hàng 15/11 (quy trình 8 bước của lịch "Kiểm hàng sẵn S&LIFE").
- [x] 4. Ảnh xem trước (commit `7dc4d13f`): 211 ảnh bìa < 600px được thay bằng ảnh lớn đúng mã (đã xem từng cặp cũ/mới; 12 mẫu lệch tông giữ ảnh cũ, ghi ở `scripts/anh-khong-tai.txt`); `sp/loc` khai kích thước ảnh và ưu tiên ảnh ≥ 600px.
- [x] 5. Nội dung tĩnh cho Google: `sp/<mã>.html` là trang thật của mẫu (tên, mã, giá, size, ảnh, dữ liệu Product có sẵn trong HTML), `sp/loc/<hãng>[--<dòng>].html` là trang thật của hãng / dòng (có sẵn danh sách mẫu), trang chủ có khối link hãng / dòng; sitemap và merchant-feed trỏ về trang tĩnh. Sửa kèm: ảnh trang mẫu trên điện thoại bị co mất với mẫu chỉ có 1 ảnh (lỗi của lần sửa 1).
- [x] 6. Kiểm tra cuối 390px/1280px (không lỗi Console, không 404, không tràn ngang; cả bản tắt JavaScript), cập nhật `AGENTS.md`, báo chủ shop danh sách cần thử trên điện thoại.

## Ghi chú cho phiên sau

- Công cụ tạm ở scratchpad có thể đã mất; cách làm ghi trong `AGENTS.md`.
- Không tự thêm chữ chính sách mới khi chưa có nguyên văn 16/11.
- Việc chủ shop cần thử: nút "Nhắn shop" mở Messenger trên iPhone/Android, trong app Facebook, TikTok/Instagram. Hỏng thì đặt `openMessenger: false` trong `data/shop.js`.

## Còn lại (cần chủ shop quyết hoặc thử)

- Thử trên máy thật: nút "Nhắn shop" / "Tư vấn qua Facebook" (iPhone Safari, Android Chrome, trong app Facebook, TikTok, Instagram, Zalo); dán link `sp/<mã>.html` vào Messenger / Zalo xem ảnh xem trước.
- Chưa đồng bộ chữ chính sách theo bản 16/11 (chủ shop bảo tạm bỏ qua).
- Tài liệu nội bộ (`AGENTS.md`, `docs/`, công thức giá trong `scripts/`) vẫn công khai vì repo công khai — cần chủ shop chọn: repo riêng tư hay chỉ đăng thư mục web.
- 72 nhóm mẫu còn trùng tên (chủ yếu New Balance), 4 mẫu Adidas Evo SL mới chưa có ảnh (KH9575, KH9735, KI6900, KI9874), KH6225 chưa rõ hãng.
