# Website — hoàn thiện thẩm mỹ và trải nghiệm toàn diện

Cập nhật 30/09/2026 theo yêu cầu mới nhất. “Đẹp, dễ thao tác, có gu” là phần trọng tâm cần thực hiện ngay. Không chờ quyết định phương thức thanh toán mới bắt đầu thiết kế. Đây là phạm vi giao việc, chưa phải báo cáo mọi hạng mục đã được sửa.

## Hướng thiết kế ban đầu

S&LIFE Sneakers: điềm đạm, tinh gọn, dành nhiều diện tích cho sản phẩm; ưu tiên nền trung tính ấm, chữ rõ, màu nhấn có kiểm soát. Đây là hướng đề xuất từ giọng thương hiệu trong Claude, chưa phải gu website đã được bạn duyệt. Không áp nguyên bố cục bài mạng xã hội lên website.

Claude tạo hai hướng bằng hình/bản thử: A — cửa hàng tối giản, ảnh sản phẩm và khoảng trắng; B — phong cách tạp chí sneaker, tiêu đề nổi bật và khu vực tuyển chọn có cá tính. So sánh trên cùng trang chủ, danh mục và chi tiết sản phẩm với dữ liệu thật. Nêu lý do chọn một hướng rồi triển khai bản thử để bạn đánh giá. Không chỉ gửi moodboard hoặc liệt kê font.

## Các hạng mục phải giao

| Hạng mục | Công việc cụ thể | Bằng chứng hoàn thành |
|---|---|---|
| Nhận diện | Màu, font có tiếng Việt, cấp chữ, nhịp khoảng cách, độ rộng nội dung, icon, nút, card, bo góc, bóng; quy tắc dùng ảnh | Một trang mẫu thành phần và biến CSS thống nhất |
| Trang chủ | Header gọn; thông điệp đầu trang rõ; khu giày tuyển chọn; khám phá theo hãng/nhu cầu; lý do tin shop; CTA có thứ bậc | Bản thử desktop/mobile, mọi nút dẫn tới nơi hữu ích |
| Danh mục | Card đồng đều; tên/giá/tình trạng dễ quét; tìm theo mẫu và mã; lọc hãng/size/giá phù hợp dữ liệu; sắp xếp; xóa bộ lọc; trạng thái không có kết quả | Thử tìm mã thật, kết hợp lọc, quay lại từ trang sản phẩm giữ ngữ cảnh |
| Chi tiết sản phẩm | Gallery/zoom; tên và mã; giá; chọn size; hàng sẵn/order; hướng dẫn size; giao/đổi trả; tư vấn; sản phẩm liên quan có logic | Một trang đầy đủ ảnh và một trang thiếu ảnh vẫn dùng được; không bịa mô tả |
| Mobile | Menu, tìm kiếm, bộ lọc dạng panel; vùng bấm đủ rộng; hành động mua/tư vấn dễ với tay; form không bị bàn phím che | Kiểm ở 360/390/768 px, không tràn ngang hay nút nổi che nội dung |
| Tương tác | Hover/focus/active/disabled, loading, lỗi, empty state, thông báo đã thêm giỏ; animation nhẹ và nhất quán | Quay luồng thao tác thật, không chỉ ảnh chụp màn hình tĩnh |
| Nội dung và độ tin cậy | Giới thiệu shop, liên hệ, FAQ, hướng dẫn chọn size, vận chuyển/đổi trả, hàng order, nội dung nút/thông báo | Không còn lorem ipsum, link chết, chính sách tự bịa, review hoặc huy hiệu giả |
| Giỏ và đơn | Sửa size/số lượng, xóa sản phẩm, phí rõ, giữ giỏ, nhập dữ liệu, xử lý gửi lỗi/gửi lặp | Luồng thành công và luồng lỗi; không báo đã nhận đơn khi máy chủ chưa xác nhận |
| Hiệu năng và truy cập | Ảnh đúng kích thước/tải trì hoãn phù hợp, tránh nhảy layout, tải JS hợp lý, keyboard/focus, nhãn form, contrast | Số đo trước/sau cùng điều kiện; kiểm thực tế bên cạnh công cụ tự động |
| Tìm kiếm và chia sẻ | Title/description theo trang, dữ liệu sản phẩm có căn cứ, ảnh chia sẻ, liên kết chuẩn, sitemap phù hợp hạ tầng | Mở URL trực tiếp, chia sẻ thử, không đánh dấu dữ liệu sai hoặc giá giả |
| Dữ liệu và vận hành | Cập nhật kho/giá/ảnh, hướng dẫn nhập ảnh, xử lý dữ liệu thiếu, sao lưu, cách triển khai/khôi phục | Hướng dẫn người dùng làm được, thử một lần cập nhật và khôi phục bản thử |
| Đo lường | Xác định các sự kiện xem sản phẩm/tìm kiếm/thêm giỏ/gửi yêu cầu phù hợp luồng thật | Danh sách sự kiện và kiểm tra phát sinh; dịch vụ mới chỉ cấu hình khi đã chọn |

## Thứ tự làm cụ thể

1. Đọc repo hiện hành, AGENTS.md và các skill đã có; chạy bản thử, chụp trang chủ/danh mục/chi tiết/giỏ ở mobile và desktop. Tách lỗi đã thấy khỏi ý tưởng cải thiện. Giữ bản trước để so sánh.
2. Đưa hai hướng thiết kế, chọn hướng đề xuất và dựng ba trang lõi trên bản thử. Chưa cần ảnh đầy đủ toàn kho; dùng sản phẩm thật đã có ảnh và trạng thái thiếu ảnh trung thực.
3. Chuẩn hóa thành phần rồi hoàn thiện tìm kiếm, lọc, chọn size, gallery, menu, FAQ/chính sách và các trạng thái rỗng/lỗi. Đảm bảo phong cách thống nhất cả trang phụ.
4. Hoàn thiện giỏ và xử lý đơn song song với các việc giao diện độc lập. Phương án nhận yêu cầu qua Zalo hoặc thanh toán đầy đủ chỉ quyết định kiến trúc phần giao dịch. Nếu chưa chốt, giao diện vẫn tiếp tục; không giả vờ đã tích hợp thanh toán.
5. Đo hiệu năng, thử bàn phím và mobile, rà nội dung, chia sẻ/SEO, kiểm cập nhật dữ liệu, sửa lỗi. Bàn giao bản thử có thể bấm và ảnh trước/sau cùng điều kiện.

## Giữ đúng bối cảnh mã nguồn đã kiểm tra

Repo Antigravity đã đọc trước đó: D:\B-o; nhánh claude/shoe-shop-website-3dln52, commit 148ef6e ở thời điểm kiểm tra. Phải kiểm lại trước khi sửa. HTML/CSS/JS thuần; có các skill frontend-design, ui-ux-pro-max, brand, design-system và các skill thiết kế khác. Không tự chuyển framework hoặc sửa dữ liệu sinh tự động cho tiện.

Đã ghi nhận orderEndpoint trống và luồng gửi đơn cần xác nhận đáng tin cậy; xem 11-HIEN-TRANG-ANTIGRAVITY.md. Đây là một phần của phạm vi, không đại diện toàn bộ chất lượng website.

Không để Claude Code và Antigravity sửa cùng nhánh cùng lúc. Tôn trọng ảnh bạn đang cập nhật, không đổi tên/xóa/thay ảnh gốc. Không đưa khẳng định “100% hoàn thiện” chỉ từ một lần test đặt hàng hay một điểm Lighthouse.

## Cách bạn đánh giá bản đầu tiên

Mở điện thoại và làm 5 việc: hiểu shop bán gì từ màn đầu; tìm một mã giày; lọc đến size phù hợp; xem ảnh và phân biệt hàng sẵn/order; gửi yêu cầu mua hoặc thêm giỏ theo luồng đang chọn. Sau đó nhận xét ba điểm bằng ví dụ: quá rối ở đâu, chữ khó đọc chỗ nào, phần nào chưa đúng gu. AI phải sửa quy tắc chung, không vá từng trang theo kiểu khác nhau.

Mốc hoàn thành thiết kế đầu tiên: **trang chủ + danh mục + chi tiết sản phẩm có thể dùng thử trên điện thoại và desktop, cùng một gu thiết kế rõ ràng**, có ảnh so sánh và các thao tác chính chạy được.
