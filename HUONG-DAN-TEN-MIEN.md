# Chuẩn bị trước khi dùng tên miền .vn

Danh sách việc cần làm để website "chuẩn chỉnh" — đúng luật, dễ tìm trên Google, khách tin tưởng.
Đánh dấu ✅ khi làm xong. Quy định có thể thay đổi, nên kiểm tra lại tại trang của cơ quan nhà nước trước khi nộp hồ sơ.

## 1. Nội dung website (làm ngay, miễn phí)

- [ ] **Ảnh thật cho sản phẩm** — quan trọng nhất. Ưu tiên các mẫu còn nhiều size (xem `anh.html`). Hướng dẫn: `HUONG-DAN-CAP-NHAT-ANH.md`.
- [ ] **Banner**: 1–3 ảnh ngang cho trang chủ (`images/banners/banner-1.jpg`…), ảnh đầu trang từng hãng.
- [ ] **Ảnh khách hàng** (khi khách đồng ý): `images/khach-hang/1.jpg`…
- [ ] Mở `data/shop.js`, điền: `facebook` (link Page), `address`, `email`, `legalName`, `taxCode`. Ô nào điền, website tự hiện ở chân trang, trang Giới thiệu, Liên hệ.
- [ ] (Nên có) Cài lưu đơn vào Google Sheet: `HUONG-DAN-DON-HANG.md`.

## 2. Pháp lý (trước khi chạy quảng cáo / công khai rộng)

- [ ] **Đăng ký hộ kinh doanh** (hoặc công ty) và có **mã số thuế**. Bán hàng online thường xuyên là hoạt động kinh doanh, phải kê khai thuế.
- [ ] **Thông báo website bán hàng với Bộ Công Thương** tại https://online.gov.vn (theo Nghị định 52/2013/NĐ-CP, sửa đổi bởi Nghị định 85/2021/NĐ-CP). Miễn phí, nộp online. Khi được xác nhận, bạn nhận đoạn mã / link logo "Đã thông báo Bộ Công Thương" → dán link vào `bctUrl` trong `data/shop.js`, website tự hiện logo ở chân trang.
- [ ] Trên website phải có đủ: tên người bán, địa chỉ, số điện thoại, email, MST; chính sách đổi trả, vận chuyển, thanh toán, bảo mật thông tin, giải quyết khiếu nại. **Các trang này đã có sẵn** (policy.html, chinh-sach-bao-mat.html, gioi-thieu.html, lien-he.html) — chỉ cần điền thông tin ở mục 1.
- [ ] **Dữ liệu cá nhân của khách** (tên, SĐT, địa chỉ): chỉ dùng để giao hàng, không chia sẻ cho bên khác. Trang đặt hàng đã có ô đồng ý chính sách bảo mật.
- [ ] Không quảng cáo sai sự thật: không ghi "giảm 50%" nếu không có giá gốc thật, không đồng hồ đếm ngược giả. Website hiện tại không dùng các kiểu này.

## 3. Tên miền .vn

1. **Chọn tên**: ngắn, dễ đọc qua điện thoại, VD `slifesneakers.vn`, `slife.vn`, `slifesneakers.com.vn`. Tránh dấu gạch ngang và chữ dễ nhầm.
2. **Mua tại nhà đăng ký được VNNIC công nhận** (VD: Mắt Bão, PA Việt Nam, Nhân Hòa, iNET, Tenten…). Tra tên còn trống và danh sách nhà đăng ký tại https://vnnic.vn.
   - Cá nhân đăng ký được, cần CCCD; chủ tên miền phải **xác thực thông tin** theo hướng dẫn của nhà đăng ký.
   - Nên đăng ký bằng **tên và thông tin thật của chủ shop**, bật tự động gia hạn, lưu lại tài khoản quản lý tên miền.
   - Chi phí: phí đăng ký năm đầu + phí duy trì hằng năm, thường vài trăm nghìn đến khoảng 1 triệu đồng/năm tuỳ đuôi và nhà đăng ký.
3. **Trỏ tên miền về website** (trong trang quản lý DNS của nhà đăng ký):

   | Loại | Tên (Host) | Giá trị |
   | --- | --- | --- |
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | honggiabaonguyen271200-star.github.io |

4. Vào GitHub → repo → **Settings → Pages → Custom domain**, nhập tên miền, **Save**. Đợi kiểm tra DNS (vài phút đến vài giờ), sau đó tích **Enforce HTTPS** để có ổ khoá bảo mật.
5. **Báo lại tên miền cho người làm web** để: thêm file `CNAME`, đổi `siteUrl` trong `data/shop.js`, tạo lại `sitemap.xml`.
6. (Nên làm) GitHub → ảnh đại diện → **Settings → Pages → Add a domain** để xác minh tên miền thuộc tài khoản của bạn.

## 4. Sau khi có tên miền

- [ ] **Google Search Console** (https://search.google.com/search-console): thêm tên miền, gửi `https://tên-miền/sitemap.xml` để Google lập chỉ mục sản phẩm.
- [ ] **Google Business Profile**: tạo hồ sơ cửa hàng để hiện trên Google Maps (nếu có điểm bán / nhận hàng).
- [ ] **Email theo tên miền** (VD `lienhe@slifesneakers.vn`): Zoho Mail (có gói miễn phí) hoặc Google Workspace.
- [ ] Cập nhật link website vào bio Instagram, TikTok, Facebook, Zalo.
- [ ] (Tuỳ chọn) Google Analytics / Meta Pixel để đo lượt xem, chạy quảng cáo.

## 5. Khi nào nên chuyển sang nền tảng bán hàng (Haravan, Sapo…)?

Website hiện tại chạy miễn phí trên GitHub Pages, đơn chốt qua Zalo — phù hợp khi đơn còn vừa phải và tồn kho quản lý bằng Google Sheet.
Nên cân nhắc nền tảng trả phí (N&N Shoes Shop đang dùng Haravan) khi cần: thanh toán online tự động, trừ tồn kho tự động, kết nối đơn vị vận chuyển, nhiều nhân viên cùng quản lý đơn.
