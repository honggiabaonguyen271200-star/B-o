# Làm việc với website trên Antigravity

> Mở file này dạng dễ đọc: bấm vào file trong cột Explorer rồi nhấn **Ctrl + Shift + V**.

Thư mục web trên máy: `D:\B-o` (đã chuyển từ `C:\Users\HP\Documents\B-o` vì ổ C đầy)

---

## A. Mỗi lần ngồi vào làm (2 phút)

1. Mở **Antigravity**. Thư mục **B-o** thường tự mở lại; nếu không: **File → Open Recent → B-o**.
2. **Lấy bản mới nhất từ GitHub** (bắt buộc, để không lệch với chỗ khác):
   bấm biểu tượng **Source Control** (hình nhánh cây, cột trái) → nút **… (More Actions)** → **Pull**.
   Hoặc bấm biểu tượng vòng tròn mũi tên cạnh chữ `claude/shoe-shop-website-3dln52` ở góc dưới bên trái.
3. **Chạy web để xem**: menu **Terminal → New Terminal**, gõ `.\xem-web.bat` rồi Enter.
   Trình duyệt mở `http://localhost:8080`. Muốn tắt: bấm vào Terminal, nhấn **Ctrl + C**.

## B. Vòng làm việc với trợ lý (Agent)

Mỗi thay đổi đều đi theo 5 bước:

| Bước | Làm gì |
| --- | --- |
| 1. Giao việc | Gõ yêu cầu vào khung **Agent** bên phải. Mỗi lần **một việc**, nói rõ muốn gì. |
| 2. Duyệt | Agent sẽ hỏi phép chạy lệnh / sửa file. Đọc qua, bấm **Accept / Run**. Thấy lạ thì bấm **Reject** và hỏi lại. |
| 3. Xem kết quả | Sang trình duyệt nhấn **F5**. Xem cả dạng điện thoại: nhấn **F12** → **Ctrl + Shift + M**. |
| 4. Lưu lên GitHub | Nói với agent: *"Commit và push các thay đổi lên GitHub với mô tả tiếng Việt."* — hoặc tự làm ở mục C. |
| 5. Kiểm tra web thật | 1–2 phút sau mở https://honggiabaonguyen271200-star.github.io/B-o/ (sau khi đã bật GitHub Pages — mục D1). |

**Câu mở đầu mỗi cuộc trò chuyện mới với Agent:**

```
Đọc file AGENTS.md và làm theo quy tắc trong đó. Trả lời tôi bằng tiếng Việt, ngắn gọn.
Trước khi sửa, pull code mới nhất. Sửa xong thì chạy thử và báo tôi cần kiểm tra gì.
```

## C. Tự lưu và đẩy lên GitHub (không cần Agent)

1. Bấm **Source Control** (hình nhánh cây). Các file đã thay đổi hiện trong mục **Changes**.
2. Bấm vào từng file để xem khác biệt (đỏ = bỏ, xanh = thêm).
3. Gõ mô tả vào ô **Message**, ví dụ `Thêm ảnh New Balance 204L`.
4. Bấm **Commit** (nếu hỏi *stage all changes?* → **Yes**).
5. Bấm **Sync Changes**. Lần đầu sẽ mở trình duyệt để đăng nhập GitHub → đồng ý.

**Lỡ sửa hỏng, chưa Commit:** trong Source Control, rê chuột vào file → biểu tượng mũi tên cong **Discard Changes**.
**Đã Commit rồi mới thấy hỏng:** nhờ Agent *"Hoàn tác commit gần nhất bằng git revert rồi push."*

---

## D. Danh sách việc để hoàn thiện website (làm theo thứ tự)

### D1. Bật GitHub Pages — có link gửi khách (làm 1 lần, trên trình duyệt)
https://github.com/honggiabaonguyen271200-star/B-o/settings/pages → **Source: Deploy from a branch** → nhánh `claude/shoe-shop-website-3dln52`, thư mục **/ (root)** → **Save**.

### D2. Điền thông tin shop
Dán vào Agent (sửa phần trong ngoặc):

```
Mở data/shop.js và điền:
- facebook: [link Facebook Page của shop]
- address: [địa chỉ cửa hàng hoặc nơi nhận hàng]
- email: [email của shop]
- openHours: [giờ làm việc, VD 9:00 – 21:00]
Chưa có thông tin nào thì để trống. Chạy thử web, kiểm tra chân trang và trang Liên hệ.
```

### D3. Ảnh sản phẩm (quan trọng nhất) — xem chi tiết `HUONG-DAN-CAP-NHAT-ANH.md`
1. **Tự động từ Google Sheet:** tải bảng về dạng .xlsx → kéo thả vào `cap-nhat-hang.bat`. Ảnh chèn trong bảng được lấy ra, đặt đúng tên mã, thu nhỏ.
2. **Mẫu còn thiếu ảnh:** mở `http://localhost:8080/anh.html` (Chrome/Edge) → **Chọn nơi lưu: thư mục website B-o** → lọc **Chưa có ảnh** → **kéo cả 10 ảnh (hoặc nguyên file .zip tải từ Canva) của đôi đó thả vào đúng dòng** (ảnh đầu tiên / trang 1 thành ảnh chính). Không cần đổi tên file. Tối đa 12 ảnh/mẫu.
3. Commit + Sync (mục C).

### D4. Banner và ảnh khách hàng
- Banner trang chủ: `images/banners/banner-1.jpg`, `banner-2.jpg`… (ảnh ngang ~1600×700).
- Banner hãng: `images/banners/new-balance.jpg`, `onitsuka-tiger.jpg`, `jordan.jpg`, `adidas.jpg`…
- Ảnh khách: `images/khach-hang/1.jpg`, `2.jpg`… (ảnh dọc, khách đã đồng ý).
Cách chép và lưu giống D3.

### D5. Cập nhật hàng từ Google Sheet (mỗi khi bảng thay đổi)
1. Google Sheet → **Tệp → Tải xuống → Microsoft Excel (.xlsx)**.
2. Mở **File Explorer** → `D:\B-o` → **kéo file .xlsx thả vào `cap-nhat-hang.bat`**.
   (Hoặc nhờ Agent: *"Cập nhật hàng từ file C:\Users\HP\Downloads\<tên file>.xlsx bằng scripts/build_products.py."*)
3. F5 trình duyệt kiểm tra vài mẫu, rồi Commit + Sync (mục C).

Giữ nguyên cách trình bày bảng: dòng tiêu đề có ô **Tên**, các cột size, cột **GIÁ BÁN**; ô có số 1 hoặc tô xanh = còn size.

### D6. (Nên có) Lưu đơn vào Google Sheet
Làm theo `HUONG-DAN-DON-HANG.md` (~10 phút), rồi nhờ Agent dán link vào `orderEndpoint` trong `data/shop.js`.

### D7. Chỉnh giao diện, nội dung bằng lời
Ví dụ yêu cầu cho Agent:
- *"Đổi dòng chữ trên thanh đen đầu trang thành: …"*
- *"Thêm dòng giày 9060 cho New Balance vào menu."* (sửa `LINES` trong `data/shop.js`)
- *"Trang chủ: đưa khối Onitsuka Tiger lên trước New Balance."*
- *"Thêm câu hỏi thường gặp vào trang Chính sách: …"*

- *"Đổi mẫu trong chùm ảnh banner đầu trang thành U204LMMC, 553560-132, IG1024."* (sửa `heroPicks` trong `data/shop.js`)
- *"Thêm logo hãng Vans: file ở D:\Downloads\vans.png."* (đặt `images/brands/vans.png`, thêm vào `BRAND_LOGOS`)

Gửi kèm ảnh chụp màn hình khi muốn sửa một chỗ cụ thể (bấm dấu **+** trong khung Agent để đính ảnh).

### D8. Tên miền .vn, pháp lý, Google
Làm theo `HUONG-DAN-TEN-MIEN.md`. Khi đã mua tên miền, nhờ Agent:
*"Tôi đã mua tên miền [tên miền]. Thêm file CNAME, đổi siteUrl trong data/shop.js, chạy lại build để tạo sitemap mới, rồi push."*

---

## E. Những điều nên tránh

- **Không sửa tay** `data/products.js` — chỉ cập nhật qua `cap-nhat-hang.bat`.
- Không để Agent cài framework / thư viện lạ, đổi cấu trúc thư mục, hay xoá file hướng dẫn.
- Không dán mật khẩu, mã OTP, thông tin thẻ vào khung Agent hay vào code.
- Mỗi lần một việc; xong việc nào **Commit + Sync** việc đó.
- Nếu vừa sửa trên trang GitHub (tải ảnh bằng web) hoặc nhờ Claude sửa, nhớ **Pull** trước khi làm tiếp trong Antigravity.

---

## F. Khi khách đã cọc một size (cập nhật tồn kho)

Website chỉ hiện **hàng sẵn**, lấy từ bảng hàng Google Sheet. Khi khách đã cọc một đôi:

1. Trên Google Sheet: bỏ đánh dấu size đó (xoá số 1 hoặc bỏ tô xanh) ở dòng mẫu giày.
2. **Tệp → Tải xuống → Microsoft Excel (.xlsx)** → kéo file vào `cap-nhat-hang.bat`.
3. Commit + Sync. 1–2 phút sau web không còn hiện size đó.

Hoặc nhắn Agent: *"Khách đã cọc mẫu U204LMMC size 40. Tôi đã sửa Google Sheet và tải file về `D:\Downloads\<tên file>.xlsx` — cập nhật hàng bằng scripts/build_products.py rồi push."*

Không sửa tay `data/products.js`: lần cập nhật sau từ Sheet sẽ ghi đè mất.

---

## G. Chốt giao diện mới (mốc 1 → 9) cùng Antigravity

Giao diện mới làm trên nhánh `thiet-ke-moi`, chủ shop đã duyệt ngày 02/10. Chi tiết từng mốc ở `HANDOFF.md`, quy tắc thiết kế ở `AGENTS.md` (Antigravity tự đọc).

### G1. Kiểm tra lần cuối trên máy thật (khoảng 10 phút)

Dán nguyên đoạn dưới vào khung **Agent**:

```
Đọc AGENTS.md và HANDOFF.md. Chuyển sang nhánh thiet-ke-moi (git fetch rồi git checkout thiet-ke-moi), pull bản mới nhất,
chạy xem-web.bat. Mở http://localhost:8080 bằng Chrome và Edge, kiểm tra theo danh sách G2, chụp màn hình chỗ nào lỗi.
Không sửa data/products.js. Không gộp vào nhánh claude/shoe-shop-website-3dln52 khi tôi chưa đồng ý.
Báo tôi bằng tiếng Việt: mục nào đạt, mục nào lỗi.
```

### G2. Danh sách kiểm tra

- [ ] Logo đầu trang: đủ "S&LIFE · Since 2021", màu chảy, không có ô vuông nền.
- [ ] Banner 5 slide tự chuyển sau 6 giây; rê chuột vào thì dừng; nút ⏸ tạm dừng được.
- [ ] Dải logo 9 hãng chạy dưới banner (có Puma), bấm logo ra đúng hãng.
- [ ] "Hàng sẵn, mua ngay" có đủ các hãng.
- [ ] Chữ: tiêu đề Barlow Condensed, chữ thường IBM Plex Sans, dấu tiếng Việt không chạm nhau.
- [ ] Trang sản phẩm: chọn size → **Tư vấn qua Facebook** → điện thoại mở app Facebook; máy tính Edge hiện hộp "Sao chép link / Mở luôn".
- [ ] Giỏ hàng → Gửi yêu cầu → tin nhắn đã chép sẵn đủ mã, size, giá.
- [ ] Xem dạng điện thoại (F12 → Ctrl + Shift + M): không bị tràn ngang, chữ đọc rõ.

### G3. Đưa lên web thật

Chỉ làm khi G2 đạt hết **và chủ shop đồng ý**. Nhờ Claude hoặc dán vào Agent:

```
Gộp nhánh thiet-ke-moi vào nhánh claude/shoe-shop-website-3dln52 (merge, không rebase, không force push), push lên GitHub.
Đợi 2 phút rồi mở https://honggiabaonguyen271200-star.github.io/B-o/ kiểm tra lại danh sách G2.
```

**Lỡ thấy lỗi sau khi lên web thật:** nhắn Agent *"Hoàn tác commit gộp thiet-ke-moi bằng git revert -m 1 rồi push."* — web quay về bản cũ, không mất gì.

Sau khi gộp, quay về làm việc trên nhánh `claude/shoe-shop-website-3dln52` như mục A (nhớ **Pull**).
