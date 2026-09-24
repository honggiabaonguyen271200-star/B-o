# Lưu đơn hàng vào Google Sheet (không bắt buộc)

Mặc định, khi khách bấm **Hoàn tất đơn hàng**, website tạo mã đơn (VD `SL260924123`), mã QR chuyển khoản
và tin nhắn để khách gửi qua Zalo. Nếu muốn **mọi đơn tự ghi vào một Google Sheet** (để không sót đơn), làm một lần như sau (~10 phút):

1. Tạo một Google Sheet mới, đặt tên VD "Đơn hàng website".
2. Menu **Tiện ích mở rộng → Apps Script**.
3. Xoá hết code có sẵn, dán toàn bộ nội dung file `scripts/google-apps-script-don-hang.gs`, bấm **Lưu**.
4. Bấm **Triển khai → Tùy chọn triển khai mới** → biểu tượng bánh răng → **Ứng dụng web**:
   - *Thực thi bằng tư cách*: **Tôi**
   - *Người có quyền truy cập*: **Bất kỳ ai**
   - Bấm **Triển khai**, cấp quyền cho tài khoản Google của bạn.
5. Sao chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/…/exec`).
6. Mở `data/shop.js` trên GitHub (bấm biểu tượng bút chì để sửa), dán link vào dòng
   `orderEndpoint: "",` → `orderEndpoint: "https://script.google.com/macros/s/…/exec",` rồi **Commit changes**.

Xong. Mỗi đơn mới sẽ thêm một dòng vào trang tính "Đơn hàng", cột **Trạng thái** để bạn tự ghi Đã xác nhận / Đã gửi / Hoàn tất.

> Tin nhắn Zalo vẫn được giữ làm kênh chính để chốt size với khách; Google Sheet là sổ ghi đơn dự phòng.
