# Sổ yêu cầu mua trên Google Sheet (không bắt buộc)

Khách mua trên website theo cách:

1. Chọn mẫu và size.
2. Bấm **Gửi yêu cầu**. Website soạn sẵn tin nhắn: tên mẫu, mã, size, giá, kèm link tóm tắt.
3. Khách **Sao chép** rồi **Mở Messenger**, dán và gửi cho bạn.
4. Bạn xác nhận size, phí ship và tiền cọc ngay trong Messenger.

Website **không thu tiền**, không hiện số tài khoản. Giỏ hàng chỉ bị xoá khi khách bấm "Tôi đã gửi cho shop".

Nếu muốn có thêm một **sổ ghi lại các yêu cầu** trên Google Sheet (để không sót khách), làm theo các bước dưới đây, mất khoảng 10 phút. Không làm thì website vẫn chạy đầy đủ qua Messenger.

> Sổ này chỉ là danh sách yêu cầu khách đã bấm gửi, **không phải đơn đã xác nhận**. Giá, tồn kho và tiền cọc vẫn do bạn xác nhận trong Messenger.

## Cài đặt

1. Mở file Google Sheet quản lý đơn của bạn (hoặc tạo file mới) → **Tiện ích mở rộng → Apps Script**.
2. Xoá hết mã có sẵn. Mở file `scripts/google-apps-script-don-hang.gs` trong thư mục website, chép toàn bộ nội dung, dán vào → bấm biểu tượng **Lưu**.
3. Bấm **Triển khai → Tùy chọn triển khai mới**:
   - Loại: **Ứng dụng web**
   - Thực thi dưới dạng: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**
   - Bấm **Triển khai**. Google hỏi quyền truy cập Sheet → **Cho phép**.
4. Sao chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).
5. Nhắn trợ lý AI trong Antigravity: *"Dán link Apps Script này vào `orderEndpoint` trong `data/shop.js`: <link>"*. Sau đó Commit + Sync.

**Đừng dán link Google Sheet** vào code hay tài liệu của website: repo đang công khai. Chỉ dán URL Apps Script vào `orderEndpoint`, vì URL này chỉ cho phép thêm dòng, không cho người khác đọc Sheet.

## Thử một lần

1. Thêm một đôi vào giỏ → **Gửi yêu cầu** → bấm **Sao chép tin nhắn**.
2. Dưới nút bấm sẽ hiện "Đã ghi yêu cầu SL… vào sổ của shop".
3. Mở Sheet, xem tab **Yêu cầu web**: có một dòng mới.
4. Bấm Sao chép thêm lần nữa: **không có dòng trùng**, vì cùng một mã yêu cầu chỉ ghi một lần.
5. Xoá dòng thử.

Nếu báo "Chưa ghi được vào sổ": kiểm tra bước 3 (quyền truy cập **Bất kỳ ai**), và URL phải kết thúc bằng `/exec`.

Sửa mã Apps Script xong phải **Triển khai → Quản lý triển khai → Chỉnh sửa → Phiên bản mới**, không thì website vẫn gọi bản cũ.

## Cột trong sổ

| Cột | Nội dung |
| --- | --- |
| Thời gian, Mã yêu cầu | Mã dạng `SL261001-AB12`, cũng có trong tin nhắn khách gửi — dùng để đối chiếu |
| Tên gọi, Nhận hàng tại, Chân (cm), Ghi chú | Khách điền nếu muốn, đều không bắt buộc |
| Sản phẩm | Mã / size / giá trên web lúc khách gửi |
| Link tóm tắt | Mở ra xem đúng mẫu, size khách chọn (không phải trạng thái đơn) |
| Trạng thái | Bạn tự ghi (đã cọc, đã gửi hàng…) |

Khi khách đã cọc một size: nhắn trợ lý AI *"Mẫu <mã> size <size> đã được cọc, cập nhật bảng hàng"*, rồi làm theo hướng dẫn để web không còn hiện size đó.
