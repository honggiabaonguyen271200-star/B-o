# Điểm chốt từ câu trả lời WEB của chủ shop (30/09/2026, 23:52)

Nguồn chính: `TRA-LOI-WEB.md` (90 câu WEB, chủ shop trả lời dần; link Sheet đơn hàng đã được bỏ khỏi file vì repo công khai). File này là bản đối chiếu nhanh để không sót điểm nào; khi hai file khác nhau, **file gốc thắng**. Câu để trống hoặc ghi "Bỏ qua" thì không suy diễn.

## A. Thay đổi bắt buộc so với mốc 1 (nhánh `thiet-ke-moi`, commit a4806ce)

1. **Kênh tư vấn và chốt đơn là Messenger qua Facebook cá nhân** của chủ shop: https://www.facebook.com/honggiabaoslife/ (WEB-01, WEB-03). Lý do chủ shop nêu: Page mới lập, khách tin Facebook cá nhân hơn.
   - Đổi mọi nút và câu "Tư vấn Zalo", "Nhắn Zalo", "Hỏi order qua Zalo", tin nhắn soạn sẵn, footer, FAQ, trang chính sách/liên hệ sang Messenger.
   - Link gợi ý `https://m.me/honggiabaoslife`; kiểm tra mở được hội thoại trên iPhone và Android, nếu không thì dùng link trang cá nhân. Thêm trường vào `data/shop.js` (đã có `facebookOwner`).
   - Messenger không điền sẵn nội dung được, nên web soạn sẵn tóm tắt (tên mẫu, mã, size, giá, link) và có hai nút "Sao chép" + "Mở Messenger".
   - Zalo và số điện thoại chỉ là kênh phụ nhỏ ở trang Liên hệ, không làm nút chính.
2. **Website chỉ hiện hàng sẵn** (WEB-36). Danh mục, tìm kiếm, gợi ý, khối hãng chỉ hiện mẫu còn size. Bỏ nhãn "Hết size · nhận order", không có mục hàng order. Ai vào link trực tiếp một mẫu đã hết size thì thấy "Tạm hết size — nhắn Messenger để shop tư vấn" (WEB-48).
3. **Không ghi cứng tiền cọc hay COD** (WEB-56, WEB-57). Khách chuyển cọc khi chủ shop gửi số tài khoản trong tin nhắn; mức cọc shop báo sau khi xác nhận. Bỏ "COD cọc 30%" ở mọi chỗ; không hiện số tài khoản/VietQR trong luồng mua công khai (giữ dữ liệu trong `shop.js`, chỉ không hiển thị). Câu thay thế: "Shop xác nhận size, phí ship và tiền cọc qua Messenger."
4. **Yêu thích để giai đoạn sau** (WEB-45): ẩn tim trên card, trang sản phẩm, header và mục "Yêu thích" ở footer. Có thể giữ code, tắt bằng một cờ trong `shop.js`.
5. **Tên thương hiệu viết đúng "S&LIFE Sneaker"** (WEB-21): thay "S&LIFE Sneakers" trong title, meta, footer, dữ liệu có cấu trúc và nội dung.
6. **Font mới** (WEB-23): giữ màu logo, đề xuất lại font khác biệt nhưng dễ đọc, thuận mắt, không phải font "AI hay dùng" (Inter, Roboto, Poppins, Montserrat, Be Vietnam Pro, Plus Jakarta Sans, Manrope…). Bắt buộc có tiếng Việt. Làm 2–3 phương án có ảnh thử dấu ("GIÀY CHÍNH HÃNG · ĐỔI SIZE 3 NGÀY · Nguyễn Hồng Gia Bảo"), chọn một để triển khai, để các phương án còn lại trong ảnh so sánh cho chủ shop xem. Ứng viên để tự kiểm subset tiếng Việt: Bricolage Grotesque, Hanken Grotesk, Archivo/Archivo Narrow, Familjen Grotesk, Big Shoulders.
7. **Ít chuyển động, không nút nổi che nội dung** (WEB-25): tránh nhiều animation, nền sặc sỡ, chữ khó đọc, pop-up, nút nổi che nội dung, bố cục đại trà.
   - Nút chat nổi: bỏ trên điện thoại (đã có thanh mua dính đáy ở trang sản phẩm và icon Messenger trên header); trên máy tính chỉ giữ nếu không che gì.
   - Hero: không tự chạy nhanh; nếu tự chạy thì chậm và có nút dừng.
   - Gradient chỉ là điểm nhấn, không phủ nhiều khối liền nhau.
8. **Chính sách hiển thị theo câu trả lời**:
   - Vận chuyển qua SPX Express hoặc Viettel Post; phí ship do đơn vị vận chuyển tính, shop báo khi xác nhận; TP.HCM và Hà Nội có thể giao trong ngày; không hứa miễn phí ship (WEB-62 đến WEB-65).
   - Đồng kiểm: shop xác nhận riêng từng đơn, không hứa cho mọi đơn (WEB-66).
   - Đổi size: giữ chính sách đang có nhưng ghi rõ thời hạn và tình trạng hàng; trả hàng/hoàn tiền chỉ khi giao sai hoặc lỗi đã xác nhận; shop chịu phí khi giao sai/lỗi, khách chịu khi đổi theo nhu cầu (WEB-67 đến WEB-69).
   - Thông tin pháp lý, thuế chưa rà soát: chưa đưa lên (WEB-70).
9. **Trang sản phẩm, trước nút mua**: giá, size, tình trạng hàng, tư vấn form và bảng size (WEB-44). Bảng size theo bảng chính hãng từng hãng kết hợp ghi chú form (WEB-38). Không cần phần tình trạng hộp/lỗi ngoại quan (WEB-39).
10. **Bộ lọc**: hãng, size, giá và **dòng giày của từng hãng** (WEB-41). **Tìm kiếm**: theo mã, tên và biệt danh mẫu (WEB-42); thêm bảng biệt danh trong `data/shop.js` và tìm được khi gõ không dấu.
11. **Nội dung và giọng**:
    - Trang chủ dẫn khách trước tới hàng sẵn mua ngay, rồi khám phá theo hãng và nhu cầu (WEB-26).
    - Trang giới thiệu: cách shop chọn và kiểm hàng, cách tư vấn và chăm sóc khách; ngắn, không kể chuyện cá nhân (WEB-27).
    - Lời hứa được dùng: tư vấn size sát nhu cầu, minh bạch nguồn hàng và tình trạng (WEB-29).
    - Giọng điềm đạm như cửa hàng cao cấp, gần gũi nhưng ngắn gọn (WEB-30); cảm giác tinh tế, đáng tin, chuyên nghiệp, rõ ràng, tiện lợi (WEB-19).
    - Khách chính: sinh viên/người mới đi làm, nhân viên văn phòng, người chơi sneaker; tầm giá 1,5–5 triệu trở lên (WEB-11, WEB-12). Khách hay chần chừ vì size/form, nguồn hàng, đổi trả (WEB-15, WEB-16): ưu tiên khối tư vấn size và FAQ trả lời đúng các nỗi lo này.

## B. Luồng mua (WEB-01, WEB-46 đến WEB-56, WEB-60, WEB-81, WEB-88)

- Không cần tài khoản, không đăng nhập.
- Giỏ → "Gửi yêu cầu cho shop": web tạo tóm tắt yêu cầu → "Sao chép" + "Mở Messenger". Mua nhiều đôi hay nhiều size thì trao đổi trong inbox (WEB-47).
- Không tự xoá giỏ. Chỉ xoá khi khách bấm "Tôi đã gửi cho shop" hoặc tự xoá. Lỗi mạng: giữ giỏ, hiện link Messenger (WEB-49). Không bao giờ báo "đã nhận đơn".
- Sổ yêu cầu (tùy chọn): chủ shop quản lý đơn trên Google Sheets (link riêng, không đưa lên repo). Chuẩn bị Apps Script có chống ghi trùng và hướng dẫn chủ shop tự dán vào Sheet đơn, rồi dán URL web app vào `orderEndpoint`. Trạng thái đơn xử lý trong inbox (WEB-53). Chưa có endpoint thì luồng Messenger vẫn phải chạy đủ.
- Tra cứu đơn bằng link riêng (WEB-60): cân nhắc link tóm tắt yêu cầu (dữ liệu nằm trong URL, không cần máy chủ) để khách gửi kèm tin nhắn và chủ shop mở ra xem đúng mẫu/size. Ghi rõ đây không phải trạng thái đơn.
- Tồn kho: chủ shop nhắn Antigravity cập nhật size đã được cọc vào bảng hàng (WEB-54); giữ công cụ nhập hiện có, viết hướng dẫn dễ hơn (WEB-76).

## C. Đo lường, tốc độ, truy cập

- Chưa có công cụ đo (WEB-78) nhưng muốn đo từng bước hành trình (WEB-50, WEB-89): gắn sẵn sự kiện (xem mẫu, tìm, lọc, thêm giỏ, sao chép yêu cầu, mở Messenger) qua một hàm trung gian, chưa gửi đi đâu; đề xuất một công cụ miễn phí để chủ shop tự kết nối sau. Không tự tạo tài khoản.
- Tải khoảng 3 giây trên 4G ổn định và nhanh rõ hơn bản cũ (WEB-83); đo trước/sau cùng điều kiện.
- Chữ lớn, tương phản tốt, dùng được bằng bàn phím, đủ nhãn/focus/đọc màn hình (WEB-84).
- Hai hành trình bắt buộc chạy trọn (WEB-81): tìm giày → chọn size → gửi yêu cầu; xem trên điện thoại → tư vấn → chốt qua Messenger. Kiểm ở kích thước iPhone (Safari) và Android (Chrome) (WEB-82); chạy thêm WebKit nếu môi trường có.
- Lỗi không được phép còn (WEB-88): sai giá, sai size, sai trạng thái; mất/trùng yêu cầu, mất giỏ; lỗi mobile, nút hỏng, nội dung bị che.

## D. Trả lời 3 câu hỏi ở cuối mốc 1

1. Thử trên điện thoại: chủ shop sẽ xem sáng 01/10. Không chờ, làm tiếp.
2. Nhận đơn: tư vấn và chốt qua Messenger Facebook cá nhân, không thanh toán tự động; sổ đơn trên Google Sheets (mục B).
3. "Hàng mới về": chủ shop chưa có ý tưởng thứ tự (WEB-43). Chưa làm mục này. Đề xuất thứ tự mặc định (ví dụ có ảnh thật trước, nhiều size trước) và ghi vào HANDOFF; đề xuất thêm một cột tùy chọn trong Sheet (ví dụ "Mới về" = ngày) để chủ shop quyết.

## E. Dọn dẹp

- Bỏ `scripts/__pycache__/*.pyc` khỏi repo và thêm `.gitignore`.
- WEB-73: kiểm tra còn thay đổi nào chưa công khai (nhánh khác, ảnh chưa đồng bộ) và liệt kê trong HANDOFF.

## F. Làm việc qua đêm

Chủ shop đi ngủ, sáng 01/10 mới xem. Làm tiếp trên `thiet-ke-moi` theo thứ tự: A → B → trang phụ (giới thiệu, liên hệ, chính sách, size guide, giỏ, gửi yêu cầu) → C → cập nhật HANDOFF và ảnh trước/sau. Không gộp vào nhánh chính, không mua dịch vụ, không tạo tài khoản, không ghi vào Google Sheet thật. Câu hỏi không chặn tiến độ: chọn phương án hợp lý nhất và ghi giả định trong HANDOFF để chủ shop duyệt.
