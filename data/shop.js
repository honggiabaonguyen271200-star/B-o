// Thông tin cửa hàng — sửa tại đây, toàn bộ website tự cập nhật.
window.SHOP = {
  name: "S&LIFE Sneaker",
  tagline: "Giày chính hãng, hàng sẵn tại shop",
  owner: "Mr. Bảo",
  phone: "0941598395",
  phoneDisplay: "0941 598 395",
  // Kênh tư vấn và chốt đơn chính: Messenger Facebook cá nhân của chủ shop.
  // messenger: link mở hội thoại. Nếu trên điện thoại link m.me không mở đúng, đổi thành link trang cá nhân (facebookOwner).
  messenger: "https://m.me/honggiabaoslife",
  messengerName: "Nguyễn Hồng Gia Bảo",
  zalo: "https://zalo.me/0941598395",   // kênh phụ, chỉ hiện ở trang Liên hệ
  facebook: "https://www.facebook.com/profile.php?id=61594467666215", // Facebook Page S&LIFE Sneaker
  facebookSneaker: "https://www.facebook.com/profile.php?id=61594467666215",
  facebookOwner: "https://www.facebook.com/honggiabaoslife/", // Facebook cá nhân chủ shop
  facebookGarment: "https://www.facebook.com/profile.php?id=61594441897601", // Facebook shop Garment
  facebookName: "Nguyễn Hồng Gia Bảo",
  instagram: "https://www.instagram.com/s.life_sneakers/", // Instagram shop Sneaker
  instagramSneaker: "https://www.instagram.com/s.life_sneakers/",
  instagramGarment: "https://www.instagram.com/s.life_garment/", // Instagram shop Garment
  tiktok: "https://www.tiktok.com/@slifesneaker",
  // Tài khoản ngân hàng: KHÔNG hiện trên website. Shop gửi số tài khoản và tiền cọc qua tin nhắn.
  bank: {
    name: "Techcombank",
    bin: "TCB",
    number: "19035107259014",
    holder: "Nguyen Hong Gia Bao",
  },
  returnDays: 3,
  openHours: "9:00 – 21:00",

  // Bật/tắt tính năng. wishlist: nút tim "Yêu thích" (để giai đoạn sau).
  features: { wishlist: false },

  // --- Thông tin pháp lý: điền khi đã rà soát xong, ô nào để trống sẽ tự ẩn trên website ---
  legalName: "",           // Tên hộ kinh doanh / công ty
  address: "",             // Địa chỉ đăng ký kinh doanh
  email: "",
  taxCode: "",             // Mã số thuế / số giấy phép kinh doanh
  bctUrl: "",              // Link hồ sơ "Đã thông báo Bộ Công Thương" trên online.gov.vn

  // --- Website ---
  siteUrl: "https://honggiabaonguyen271200-star.github.io/B-o/", // đổi thành tên miền .vn khi có
  // Sổ yêu cầu (không bắt buộc): link Web app của Google Apps Script, xem HUONG-DAN-DON-HANG.md. Để trống vẫn gửi qua Messenger bình thường.
  orderEndpoint: "",
  // Đo lượt xem và hành trình mua (không bắt buộc): mã Google Analytics 4 dạng "G-XXXXXXX". Để trống thì không gửi dữ liệu đi đâu.
  ga4Id: "",
  announcement: "S&LIFE SNEAKER — ONLY AUTHENTIC · GIÀY CHÍNH HÃNG, HÀNG SẴN",
  // Dòng chữ đầu trang (máy tính hiện cả 3, điện thoại hiện câu đầu). Chỉ ghi điều shop thực sự áp dụng.
  announcements: [
    "Giày chính hãng — mã sản phẩm khớp tem hộp",
    "Tư vấn size theo form từng dòng qua Messenger",
    "Đổi size trong 3 ngày nếu còn nguyên hộp, tem",
  ],
  // Câu hỏi thường gặp ở trang chủ: [câu hỏi, trả lời]
  faq: [
    ["Làm sao biết giày chính hãng?", "Mỗi đôi có mã sản phẩm khớp với tem hộp. Bạn tra mã đó trên trang chủ của hãng sẽ ra đúng mẫu, đúng màu. Shop gửi ảnh chụp thật đôi giày trước khi giao."],
    ["Chọn size thế nào cho vừa?", "Xem lưu ý form và bảng size ngay trên trang sản phẩm. Còn phân vân, nhắn Messenger cho shop số cm chân kèm tên đôi giày đang đi vừa nhất — shop tư vấn cụ thể cho từng mẫu."],
    ["Đặt mua như thế nào?", "Chọn mẫu và size, bấm Gửi yêu cầu. Website soạn sẵn tin nhắn (tên mẫu, mã, size, giá); bạn sao chép và gửi cho shop qua Messenger. Không cần tạo tài khoản."],
    ["Đặt cọc và thanh toán ra sao?", "Sau khi xác nhận còn size, shop gửi số tài khoản và mức cọc qua Messenger. Website không thu tiền và không lưu thông tin thanh toán."],
    ["Giao hàng mất bao lâu, phí ship bao nhiêu?", "Shop gửi qua SPX Express hoặc Viettel Post; phí ship do đơn vị vận chuyển tính, shop báo khi xác nhận đơn. Hà Nội và TP.HCM có thể giao trong ngày."],
    ["Đổi size như thế nào?", "Đổi size trong 3 ngày kể từ khi nhận hàng, giày còn nguyên hộp, tem và chưa đi ngoài trời. Đổi theo nhu cầu thì bạn chịu phí ship; giao sai hoặc hàng lỗi đã xác nhận thì shop chịu."],
    ["Có được kiểm hàng khi nhận không?", "Việc đồng kiểm tuỳ đơn vị vận chuyển, shop xác nhận riêng với bạn khi chốt đơn."],
    ["Mẫu hoặc size mình cần không có trên web?", "Website chỉ hiện hàng đang có sẵn. Bạn nhắn Messenger tên mẫu và size, shop tư vấn thêm."],
  ],
  // Cam kết hiện ở trang sản phẩm. Chỉ ghi những gì shop thực sự áp dụng.
  perks: [
    "Mã sản phẩm khớp tem hộp, tra trên trang chủ hãng ra đúng mẫu",
    "Tư vấn size theo form từng dòng trước khi chốt đơn",
    "Shop gửi ảnh chụp thật đôi giày trước khi giao",
    "Đổi size trong 3 ngày nếu còn nguyên hộp, tem, chưa đi ngoài trời",
  ],
  // Biệt danh khi tìm kiếm: gõ bên trái sẽ tìm thêm các cụm bên phải (gõ không dấu cũng được). Thêm tuỳ ý.
  aliases: {
    "af1": ["air force 1"],
    "aj1": ["jordan 1"],
    "jd1": ["jordan 1"],
    "aj4": ["jordan 4"],
    "nb": ["new balance"],
    "ot": ["onitsuka tiger"],
    "mexico": ["mexico 66"],
    "panda": ["panda", "white black", "black white"],
    "giay tennis": ["vapor", "court lite", "gp challenge", "dedicate", "resolution", "solution speed", "challenger", "court ff", "game ff"],
    "tennis": ["vapor", "court lite", "gp challenge", "dedicate", "resolution", "solution speed", "challenger", "court ff", "game ff"],
    "chay bo": ["kayano", "nimbus", "cumulus", "gt-2160", "gt-1000"],
    "de gum": ["gum"],
  },
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


// Bảng size tham khảo theo hãng (nam / unisex): [US, UK, EU, cm chiều dài bàn chân].
// CHỦ SHOP KIỂM LẠI với bảng size trên web chính thức của hãng trước khi đưa lên bản chính.
// Hãng chưa có bảng: trang sản phẩm ghi "shop đang cập nhật" và mời nhắn Messenger.
window.SIZE_CHARTS = {
  "Nike": [
    ["3.5", "3", "35,5", "22,5"], ["4", "3.5", "36", "23"], ["4.5", "4", "36,5", "23,5"], ["5", "4.5", "37,5", "23,5"],
    ["5.5", "5", "38", "24"], ["6", "5.5", "38,5", "24"], ["6.5", "6", "39", "24,5"], ["7", "6", "40", "25"],
    ["7.5", "6.5", "40,5", "25,5"], ["8", "7", "41", "26"], ["8.5", "7.5", "42", "26,5"], ["9", "8", "42,5", "27"],
    ["9.5", "8.5", "43", "27,5"], ["10", "9", "44", "28"], ["10.5", "9.5", "44,5", "28,5"], ["11", "10", "45", "29"],
    ["11.5", "10.5", "45,5", "29,5"], ["12", "11", "46", "30"],
  ],
  "New Balance": [
    ["4", "3.5", "36", "22"], ["4.5", "4", "37", "22,5"], ["5", "4.5", "37,5", "23"], ["5.5", "5", "38", "23,5"],
    ["6", "5.5", "38,5", "24"], ["6.5", "6", "39,5", "24,5"], ["7", "6.5", "40", "25"], ["7.5", "7", "40,5", "25,5"],
    ["8", "7.5", "41,5", "26"], ["8.5", "8", "42", "26,5"], ["9", "8.5", "42,5", "27"], ["9.5", "9", "43", "27,5"],
    ["10", "9.5", "44", "28"], ["10.5", "10", "44,5", "28,5"], ["11", "10.5", "45", "29"], ["11.5", "11", "45,5", "29,5"],
    ["12", "11.5", "46,5", "30"],
  ],
};
window.SIZE_CHARTS["Jordan"] = window.SIZE_CHARTS["Nike"];
