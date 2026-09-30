// Thông tin cửa hàng — sửa tại đây, toàn bộ website tự cập nhật.
window.SHOP = {
  name: "S&LIFE Sneakers",
  tagline: "Giày chính hãng, hàng sẵn tại shop",
  owner: "Mr. Bảo",
  phone: "0941598395",
  phoneDisplay: "0941 598 395",
  zalo: "https://zalo.me/0941598395",
  facebook: "https://www.facebook.com/profile.php?id=61594467666215", // Facebook shop Sneaker (Fanpage chính thức, nút Messenger)
  facebookSneaker: "https://www.facebook.com/profile.php?id=61594467666215",
  facebookOwner: "https://www.facebook.com/honggiabaoslife/", // Facebook cá nhân chủ shop
  facebookGarment: "https://www.facebook.com/profile.php?id=61594441897601", // Facebook shop Garment
  facebookName: "Nguyễn Hồng Gia Bảo",
  instagram: "https://www.instagram.com/s.life_sneakers/", // Instagram shop Sneaker
  instagramSneaker: "https://www.instagram.com/s.life_sneakers/",
  instagramGarment: "https://www.instagram.com/s.life_garment/", // Instagram shop Garment
  tiktok: "https://www.tiktok.com/@slifesneaker",
  bank: {
    name: "Techcombank",
    bin: "TCB",            // mã ngân hàng để tạo mã QR chuyển khoản (VietQR)
    number: "19035107259014",
    holder: "Nguyen Hong Gia Bao",
  },
  depositPercent: 30,
  returnDays: 3,
  openHours: "9:00 – 21:00",

  // --- Thông tin pháp lý: điền khi có, ô nào để trống sẽ tự ẩn trên website ---
  legalName: "",           // Tên hộ kinh doanh / công ty, VD: "Hộ kinh doanh S&LIFE Sneakers"
  address: "",             // Địa chỉ cửa hàng / nơi đăng ký kinh doanh
  email: "",               // VD: "lienhe@slifesneakers.vn"
  taxCode: "",             // Mã số thuế / số giấy phép kinh doanh
  bctUrl: "",              // Link hồ sơ "Đã thông báo Bộ Công Thương" trên online.gov.vn

  // --- Website ---
  siteUrl: "https://honggiabaonguyen271200-star.github.io/B-o/", // đổi thành tên miền .vn khi có
  orderEndpoint: "",       // Link Google Apps Script để lưu đơn vào Google Sheet (xem HUONG-DAN-DON-HANG.md)
  announcement: "S&LIFE SNEAKERS — ONLY AUTHENTIC · GIÀY CHÍNH HÃNG, HÀNG SẴN",
  // Thanh chữ chạy đầu trang (tự đổi câu). Chỉ ghi điều shop thực sự áp dụng. Để [] thì dùng dòng announcement ở trên.
  announcements: [
    "Giày chính hãng — mã sản phẩm khớp tem hộp",
    "Đồng kiểm: mở hộp kiểm tra trước khi trả tiền",
    "Đổi size trong 3 ngày nếu còn nguyên hộp, tem",
  ],
  // Câu hỏi thường gặp ở trang chủ: [câu hỏi, trả lời]
  faq: [
    ["Làm sao biết giày chính hãng?", "Mỗi đôi có mã sản phẩm khớp với tem hộp. Bạn tra mã đó trên trang chủ của hãng sẽ ra đúng mẫu, đúng màu. Giao đủ hộp, giấy gói, tem và phụ kiện đi kèm."],
    ["Chọn size thế nào cho vừa?", "Đo chiều dài bàn chân (cm) rồi xem lưu ý form của từng dòng ở trang Hướng dẫn chọn size. Còn phân vân, gửi shop số cm chân kèm tên đôi giày đang đi vừa nhất để được tư vấn."],
    ["Được kiểm tra hàng trước khi trả tiền không?", "Có. Shop gửi ảnh chụp thật trước khi đóng gói, bạn được mở hộp kiểm tra khi nhận hàng rồi mới trả tiền."],
    ["Đổi size như thế nào?", "Đổi trong 3 ngày kể từ khi giao hàng, giày còn nguyên hộp, tem và chưa đi ngoài trời; khách hỗ trợ phí đổi trả. Sai size do shop tư vấn thì shop chịu phí đổi."],
    ["Thanh toán và giao hàng ra sao?", "Ship toàn quốc qua SPX Express, Viettel Post…; nội thành Hà Nội, TP.HCM có ship nhanh (chuyển khoản trước). COD đặt cọc 30% giá bán, phần còn lại trả khi nhận hàng."],
    ["Mẫu hoặc size mình cần không có trên web?", "Size không có trong danh sách là đã hết tại shop. Bạn nhắn Zalo tên mẫu và size, shop kiểm tra và báo giá order."],
  ],
  // Ưu đãi hiện ở trang sản phẩm. Chỉ ghi những gì shop thực sự áp dụng.
  perks: [
    "Mã sản phẩm khớp tem hộp, tra trên trang chủ hãng ra đúng mẫu",
    "Đồng kiểm: mở hộp kiểm tra trước khi trả tiền",
    "Đổi size trong 3 ngày nếu còn nguyên hộp, tem, chưa đi ngoài trời",
    "Shop gửi ảnh chụp thật đôi giày trước khi đóng gói",
  ],
};

// Lưu ý form theo từng dòng giày (lấy từ mục "3. CHỌN SIZE" trong bảng hàng).
// match: biểu thức so với tên sản phẩm; advice: lời khuyên hiển thị ở trang sản phẩm.
window.FIT_NOTES = [
  { match: /1906(r|d|a)|1906l.*(da bóng|leather|croc|patent)/i, line: "New Balance 1906R / 1906D / 1906A", advice: "Nên lên 0,5cm so với size thường đi." },
  { match: /new balance/i, line: "New Balance 204L, 2002R, 574, 740, 1906L", advice: "Đúng size. Form thoải mái, chân bè đi vẫn dễ chịu." },
  { match: /mexico 66|onitsuka/i, line: "Onitsuka Tiger Mexico 66", advice: "Thân giày hẹp và ngắn hơn bình thường. Chân bè hoặc mu cao nên lên 0,5 size." },
  { match: /samba|gazelle|spezial|handball|sl 72|taekwondo/i, line: "Adidas Samba, Gazelle, Spezial", advice: "Đúng size về chiều dài nhưng thân hẹp. Chân bè nên lên 0,5cm." },
  { match: /speedcat/i, line: "Puma Speedcat", advice: "Đế mỏng, form bó sát kiểu giày đua. Phần lớn khách nên lên 0,5cm." },
  { match: /air force 1|af1/i, line: "Nike Air Force 1", advice: "Giữ nguyên size là vừa." },
  { match: /jordan 4|aj4/i, line: "Jordan 4", advice: "Ôm hơn ở mu bàn chân, chân bè cân nhắc lên 0,5cm." },
  { match: /jordan 1|aj1/i, line: "Jordan 1", advice: "Đúng size." },
  { match: /dedicate|vapor|court ff|resolution|challenger|solution speed|game ff|all court/i, line: "Giày tennis (Asics Gel-Dedicate, Nike Zoom Vapor…)", advice: "Nên lên 0,5cm (nếu chân thon có thể giữ nguyên)." },
  { match: /kayano|cumulus|nimbus|gt-2160|gt-1000|kahana/i, line: "Asics Gel-Kayano và các mẫu chạy", advice: "Bắt buộc phải lên 0,5cm." },
];

// Các dòng giày của từng hãng, hiện ở trang hãng và trong Menu.
// Mỗi dòng: tên hiển thị + biểu thức nhận diện theo tên sản phẩm (dòng đứng trước được ưu tiên).
// Mẫu không khớp dòng nào sẽ vào "Các dòng khác".
window.LINES = {
  "New Balance": [
    ["204L", /204l/i],
    ["1906", /1906/i],
    ["740", /\b740/i],
    ["2002R", /2002r/i],
    ["860v2", /\b860/i],
    ["725", /\b725/i],
    ["574", /\b574/i],
  ],
  "Asics": [
    ["Gel-NYC", /gel[- ]?nyc/i],
    ["Gel-Kayano", /kayano/i],
    ["Giày tennis", /resolution|resution|court ff|solution speed|challenger|dedicate|game ff|gel-game|court slide/i],
    ["Giày bóng chuyền", /upcourt|bóng chuyền/i],
  ],
  "Onitsuka Tiger": [
    ["Mexico 66 SD", /mexico 66 sd/i],
    ["Mexico 66 TGRS", /tgrs/i],
    ["Mexico 66 Slip-on & Paraty", /slip[- ]?on|paraty/i],
    ["Mexico 66", /mexico 66/i],
  ],
  "Jordan": [
    ["Jordan 1 Low", /\b1\b.*\blow\b/i],
    ["Jordan 1 Mid", /\b1\b.*\bmid\b/i],
    ["Jordan 1 High", /\b1\b.*\bhigh\b/i],
    ["Jordan 4", /jordan 4/i],
  ],
  "Nike": [
    ["Air Force 1", /force 1/i],
    ["Air Max", /air max|max (1|90|97)/i],
    ["Giày tennis", /vapor|court lite|gp challenge|zoom lite/i],
  ],
  "Adidas": [
    ["Samba", /samba/i],
    ["Gazelle", /gazelle/i],
    ["Handball Spezial", /spezial/i],
    ["Taekwondo", /taekwondo/i],
    ["Campus", /campus/i],
    ["Stan Smith", /stan smith/i],
    ["Adizero", /adizero/i],
  ],
  "Puma": [
    ["Speedcat Ballet", /speedcat ballet/i],
    ["Speedcat OG", /speedcat/i],
    ["Palermo", /palermo/i],
  ],
  "Salomon": [["XT-6", /xt-6/i]],
  "On": [["The Roger", /roger/i]],
};
