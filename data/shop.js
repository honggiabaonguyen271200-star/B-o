// Thông tin cửa hàng — sửa tại đây, toàn bộ website tự cập nhật.
window.SHOP = {
  name: "S&LIFE Sneaker",
  tagline: "Giày chính hãng, hàng sẵn tại shop",
  owner: "Mr. Bảo",
  phone: "0941598395",
  phoneDisplay: "0941 598 395",
  // Kênh tư vấn và chốt đơn chính: Facebook cá nhân của chủ shop. Mọi nút "Tư vấn / Nhắn Facebook" mở link này.
  facebookChat: "https://www.facebook.com/honggiabaoslife/",
  facebookChatName: "Nguyễn Hồng Gia Bảo",
  // Điện thoại: bấm nút Facebook là mở thẳng app Facebook (false: mở như link thường trong trình duyệt).
  openFacebookApp: true,
  // ID số của Facebook cá nhân (không bắt buộc). Có ID thì iPhone mở đúng trang cá nhân trong app chắc chắn hơn.
  // Cách lấy: xem HANDOFF.md, mục "Chủ shop cần duyệt".
  facebookId: "",
  // Máy tính đang dùng trình duyệt khác Chrome (Edge, Cốc Cốc…): hỏi "Sao chép link để mở bằng Chrome" hay "Mở luôn".
  // false: mở luôn bằng trình duyệt đang dùng, không hỏi.
  desktopAskChrome: true,
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
  // Sổ yêu cầu (không bắt buộc): link Web app của Google Apps Script, xem HUONG-DAN-DON-HANG.md. Để trống vẫn gửi qua Facebook bình thường.
  orderEndpoint: "",
  // Đo lượt xem và hành trình mua (không bắt buộc): mã Google Analytics 4 dạng "G-XXXXXXX". Để trống thì không gửi dữ liệu đi đâu.
  ga4Id: "",
  announcement: "S&LIFE SNEAKER — ONLY AUTHENTIC · GIÀY CHÍNH HÃNG, HÀNG SẴN",
  // Dòng chữ đầu trang (máy tính hiện cả 3, điện thoại hiện câu đầu). Chỉ ghi điều shop thực sự áp dụng.
  announcements: [
    "Giày chính hãng — mã sản phẩm khớp tem hộp",
    "Tư vấn size theo form từng dòng qua Facebook",
    "Đổi size trong 3 ngày nếu còn nguyên hộp, tem",
  ],
  // Câu hỏi thường gặp ở trang chủ: [câu hỏi, trả lời]
  faq: [
    ["Làm sao biết giày chính hãng?", "Mỗi đôi có mã sản phẩm khớp với tem hộp. Bạn tra mã đó trên trang chủ của hãng sẽ ra đúng mẫu, đúng màu. Shop gửi ảnh chụp thật đôi giày trước khi giao."],
    ["Chọn size thế nào cho vừa?", "Xem lưu ý form và bảng size ngay trên trang sản phẩm. Còn phân vân, nhắn Facebook cho shop số cm chân kèm tên đôi giày đang đi vừa nhất — shop tư vấn cụ thể cho từng mẫu."],
    ["Đặt mua như thế nào?", "Chọn mẫu và size, bấm Thêm vào giỏ rồi Gửi yêu cầu cho shop. Website soạn sẵn tin nhắn (tên mẫu, mã, size, giá) và mở Facebook của shop; bạn dán vào khung chat và gửi. Không cần tạo tài khoản."],
    ["Đặt cọc và thanh toán ra sao?", "Sau khi xác nhận còn size, shop gửi số tài khoản và mức cọc qua Facebook. Website không thu tiền và không lưu thông tin thanh toán."],
    ["Giao hàng mất bao lâu, phí ship bao nhiêu?", "Shop gửi qua SPX Express hoặc Viettel Post; phí ship do đơn vị vận chuyển tính, shop báo khi xác nhận đơn. Hà Nội và TP.HCM có thể giao trong ngày."],
    ["Đổi size như thế nào?", "Đổi size trong 3 ngày kể từ khi nhận hàng, giày còn nguyên hộp, tem và chưa đi ngoài trời. Đổi theo nhu cầu thì bạn chịu phí ship; giao sai hoặc hàng lỗi đã xác nhận thì shop chịu."],
    ["Có được kiểm hàng khi nhận không?", "Việc đồng kiểm tuỳ đơn vị vận chuyển, shop xác nhận riêng với bạn khi chốt đơn."],
    ["Mẫu hoặc size mình cần không có trên web?", "Website chỉ hiện hàng đang có sẵn. Bạn nhắn Facebook tên mẫu và size, shop tư vấn thêm."],
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


// Bảng size theo hãng — chép từ ảnh chụp trang size chính thức của hãng do chủ shop gửi (30/09/2026).
// Mỗi hãng: source (trang gốc), tables: [{ name, cols, rows }]. Cột đầu luôn là EU (web dùng để tô size shop đang có).
// women: true / kids: true = bảng mở sẵn cho mẫu code nữ / GS, trẻ em. Hãng không có trong đây: trang sản phẩm ghi
// "shop đang cập nhật" và mời nhắn Facebook. Sửa số: sửa đúng dòng, giữ dấu phẩy thập phân như "36,5".
window.SIZE_CHARTS = {
  "New Balance": {
    source: "newbalance.com/size-guide.html",
    tables: [
      { name: "Nam / nữ", cols: ["EU", "US nam", "US nữ", "UK", "Chân (cm)"], rows: [
        ["34", "2,5", "4", "2", "20,5"], ["35", "3", "4,5", "2,5", "21"], ["35,5", "3,5", "5", "3", "21,5"], ["36", "4", "5,5", "3,5", "22"],
        ["37", "4,5", "6", "4", "22,5"], ["37,5", "5", "6,5", "4,5", "23"], ["38", "5,5", "7", "5", "23,5"], ["38,5", "6", "7,5", "5,5", "24"],
        ["39,5", "6,5", "8", "6", "24,5"], ["40", "7", "8,5", "6,5", "25"], ["40,5", "7,5", "9", "7", "25,5"], ["41,5", "8", "9,5", "7,5", "26"],
        ["42", "8,5", "10", "8", "26,5"], ["42,5", "9", "10,5", "8,5", "27"], ["43", "9,5", "11", "9", "27,5"], ["44", "10", "11,5", "9,5", "28"],
        ["44,5", "10,5", "12", "10", "28,5"], ["45", "11", "12,5", "10,5", "29"], ["45,5", "11,5", "13", "11", "29,5"], ["46,5", "12", "13,5", "11,5", "30"],
        ["47", "12,5", "14", "12", "30,5"], ["47,5", "13", "14,5", "12,5", "31"],
      ] },
    ],
  },
  "Asics": {
    source: "asics.com/vn/vi-vn — Hướng dẫn đo kích cỡ và vừa vặn",
    tables: [
      { name: "Nam / unisex", cols: ["EU", "US", "UK", "Chân (cm)"], rows: [
        ["36", "4", "3", "22,5"], ["37", "4,5", "3,5", "23"], ["37,5", "5", "4", "23,5"], ["38", "5,5", "4,5", "24"],
        ["39", "6", "5", "24,5"], ["39,5", "6,5", "5,5", "25"], ["40", "7", "6", "25,5"], ["40,5", "7,5", "6,5", "25,75"],
        ["41,5", "8", "7", "26"], ["42", "8,5", "7,5", "26,5"], ["42,5", "9", "8", "27"], ["43,5", "9,5", "8,5", "27,5"],
        ["44", "10", "9", "28"], ["44,5", "10,5", "9,5", "28,25"], ["45", "11", "10", "28,5"], ["46", "11,5", "10,5", "29"],
        ["46,5", "12", "11", "29,5"], ["47", "12,5", "11,5", "30"], ["48", "13", "12", "30,5"],
      ] },
      { name: "Nữ", women: true, cols: ["EU", "US", "UK", "Chân (cm)"], rows: [
        ["35,5", "5", "3", "22,5"], ["36", "5,5", "3,5", "22,75"], ["37", "6", "4", "23"], ["37,5", "6,5", "4,5", "23,5"],
        ["38", "7", "5", "24"], ["39", "7,5", "5,5", "24,5"], ["39,5", "8", "6", "25"], ["40", "8,5", "6,5", "25,5"],
        ["40,5", "9", "7", "25,75"], ["41,5", "9,5", "7,5", "26"], ["42", "10", "8", "26,5"], ["42,5", "10,5", "8,5", "27"],
        ["43,5", "11", "9", "27,5"], ["44", "11,5", "9,5", "28"], ["44,5", "12", "10", "28,5"],
      ] },
    ],
  },
  "Onitsuka Tiger": {
    source: "onitsukatiger.com/vn/vi-vn/size-guide",
    tables: [
      { name: "Nam / unisex", cols: ["EU", "US", "Chân (cm)"], rows: [
        ["36", "4", "22,5"], ["37", "4,5", "23"], ["37,5", "5", "23,5"], ["38", "5,5", "24"],
        ["39", "6", "24,5"], ["39,5", "6,5", "25"], ["40", "7", "25,25"], ["40,5", "7,5", "25,5"],
        ["41,5", "8", "26"], ["42", "8,5", "26,5"], ["42,5", "9", "27"], ["43,5", "9,5", "27,5"],
        ["44", "10", "28"], ["44,5", "10,5", "28,25"], ["45", "11", "28,5"], ["46", "11,5", "29"],
        ["46,5", "12", "29,5"], ["47", "12,5", "30"], ["48", "13", "30,5"], ["48,5", "13,5", "30,75"],
        ["49", "14", "31"],
      ] },
      { name: "Nữ", women: true, cols: ["EU", "US", "Chân (cm)"], rows: [
        ["34,5", "4", "21,5"], ["35", "4,5", "22"], ["35,5", "5", "22,5"], ["36", "5,5", "22,75"],
        ["37", "6", "23"], ["37,5", "6,5", "23,5"], ["38", "7", "24"], ["39", "7,5", "24,5"],
        ["39,5", "8", "25"], ["40", "8,5", "25,5"], ["40,5", "9", "25,75"], ["41,5", "9,5", "26"],
        ["42", "10", "26,5"], ["42,5", "10,5", "27"], ["43,5", "11", "27,5"], ["44", "11,5", "28"],
        ["44,5", "12", "28,5"], ["45", "12,5", "28,75"], ["46", "13", "29"], ["46,5", "13,5", "29,5"],
        ["47", "14", "30"],
      ] },
      { name: "Trẻ em", kids: true, cols: ["EU", "US", "Chân (cm)"], rows: [
        ["19,5", "K4", "12"], ["21", "K5", "13"], ["22,5", "K6", "13,5"], ["23,5", "K7", "14,5"],
        ["25", "K8", "15"], ["26", "K9", "16"], ["27", "K10", "17"], ["28,5", "K11", "17,5"],
        ["30", "K12", "18,5"], ["31,5", "K13", "19,5"], ["32,5", "1", "20"], ["33,5", "2", "21"],
        ["35", "3", "22"], ["36", "4", "22,5"],
      ] },
    ],
  },
  "Adidas": {
    source: "adidas.com/us/help/size_charts",
    tables: [
      { name: "Nam / nữ", cols: ["EU", "US nam", "US nữ", "UK", "Chân (cm)"], rows: [
        ["36", "4", "5", "3,5", "22,1"], ["36 2/3", "4,5", "5,5", "4", "22,5"], ["37 1/3", "5", "6", "4,5", "22,9"], ["38", "5,5", "6,5", "5", "23,3"],
        ["38 2/3", "6", "7", "5,5", "23,8"], ["39 1/3", "6,5", "7,5", "6", "24,2"], ["40", "7", "8", "6,5", "24,6"], ["40 2/3", "7,5", "8,5", "7", "25"],
        ["41 1/3", "8", "9", "7,5", "25,5"], ["42", "8,5", "9,5", "8", "25,9"], ["42 2/3", "9", "10", "8,5", "26,3"], ["43 1/3", "9,5", "10,5", "9", "26,7"],
        ["44", "10", "11", "9,5", "27,1"], ["44 2/3", "10,5", "11,5", "10", "27,6"], ["45 1/3", "11", "12", "10,5", "28"], ["46", "11,5", "12,5", "11", "28,4"],
      ] },
      { name: "Trẻ em lớn (8–16 tuổi)", kids: true, cols: ["EU", "US", "UK", "Chân (inch)"], rows: [
        ["35,5", "3,5", "3", "8,5"], ["36", "4", "3,5", "8,7"], ["36 2/3", "4,5", "4", "8,9"], ["37 1/3", "5", "4,5", "9,0"],
        ["38", "5,5", "5", "9,2"], ["38 2/3", "6", "5,5", "9,4"], ["39 1/3", "6,5", "6", "9,5"], ["40", "7", "6,5", "9,7"],
      ] },
    ],
  },
  "Nike": {
    source: "nike.com — Men’s / Women’s Shoe Size Chart",
    tables: [
      { name: "Nam", cols: ["EU", "US nam", "US nữ", "UK", "Chân (cm)", "Tem hộp (cm)"], rows: [
        ["35,5", "3,5", "5", "3", "21,6", "22,5"], ["36", "4", "5,5", "3,5", "22", "23"], ["36,5", "4,5", "6", "4", "22,4", "23,5"], ["37,5", "5", "6,5", "4,5", "22,9", "23,5"],
        ["38", "5,5", "7", "5", "23,3", "24"], ["38,5", "6", "7,5", "5,5", "23,7", "24"], ["39", "6,5", "8", "6", "24,1", "24,5"], ["40", "7", "8,5", "6", "24,5", "25"],
        ["40,5", "7,5", "9", "6,5", "25", "25,5"], ["41", "8", "9,5", "7", "25,4", "26"], ["42", "8,5", "10", "7,5", "25,8", "26,5"], ["42,5", "9", "10,5", "8", "26,2", "27"],
        ["43", "9,5", "11", "8,5", "26,7", "27,5"], ["44", "10", "11,5", "9", "27,1", "28"], ["44,5", "10,5", "12", "9,5", "27,5", "28,5"], ["45", "11", "12,5", "10", "27,9", "29"],
        ["45,5", "11,5", "13", "10,5", "28,3", "29,5"], ["46", "12", "13,5", "11", "28,8", "30"], ["47", "12,5", "14", "11,5", "29,2", "30,5"], ["47,5", "13", "14,5", "12", "29,6", "31"],
        ["48", "13,5", "15", "12,5", "30", "31,5"],
      ] },
      { name: "Nữ", women: true, cols: ["EU", "US nữ", "US nam", "UK", "Chân (cm)", "Tem hộp (cm)"], rows: [
        ["33,5", "3,5", "2", "1,5", "20,8", "21"], ["34,5", "4", "2,5", "1,5", "21,2", "21"], ["35", "4,5", "3", "2", "21,6", "21,5"], ["35,5", "5", "3,5", "2,5", "22", "22"],
        ["36", "5,5", "4", "3", "22,4", "22,5"], ["36,5", "6", "4,5", "3,5", "22,9", "23"], ["37,5", "6,5", "5", "4", "23,3", "23,5"], ["38", "7", "5,5", "4,5", "23,7", "24"],
        ["38,5", "7,5", "6", "5", "24,1", "24,5"], ["39", "8", "6,5", "5,5", "24,5", "25"], ["40", "8,5", "7", "6", "25", "25,5"], ["40,5", "9", "7,5", "6,5", "25,4", "26"],
        ["41", "9,5", "8", "7", "25,8", "26,5"], ["42", "10", "8,5", "7,5", "26,2", "27"], ["42,5", "10,5", "9", "8", "26,7", "27,5"], ["43", "11", "9,5", "8,5", "27,1", "28"],
        ["44", "11,5", "10", "9", "27,5", "28,5"], ["44,5", "12", "10,5", "9,5", "27,9", "29"], ["45", "12,5", "11", "10", "28,3", "29,5"], ["45,5", "13", "11,5", "10,5", "28,8", "30"],
        ["46", "13,5", "12", "11", "29,2", "30,5"],
      ] },
      { name: "Trẻ nhỏ", kids: true, cols: ["EU", "US", "UK", "Chân (cm)", "Tem hộp (cm)"], rows: [
        ["25", "8C", "7,5", "14", "14"], ["26", "9C", "8,5", "15", "15"], ["27", "10C", "9,5", "16", "16"], ["27,5", "10,5C", "10", "16,5", "16,5"],
        ["28", "11C", "10,5", "17", "17"], ["28,5", "11,5C", "11", "17,5", "17,5"], ["29,5", "12C", "11,5", "18", "18"],
      ] },
    ],
  },
  "Puma": {
    source: "vn.puma.com/vn/en/VN-size-guide-footer-2025.html",
    tables: [
      { name: "Unisex", cols: ["EU", "US nam", "US nữ", "UK", "cm (JP)"], rows: [
        ["35,5", "4", "5,5", "3", "22"], ["36", "4,5", "6", "3,5", "22,5"], ["37", "5", "6,5", "4", "23"], ["37,5", "5,5", "7", "4,5", "23,5"],
        ["38", "6", "7,5", "5", "24"], ["38,5", "6,5", "8", "5,5", "24,5"], ["39", "7", "8,5", "6", "25"], ["40", "7,5", "9", "6,5", "25,5"],
        ["40,5", "8", "9,5", "7", "26"], ["41", "8,5", "10", "7,5", "26,5"], ["42", "9", "10,5", "8", "27"], ["42,5", "9,5", "11", "8,5", "27,5"],
        ["43", "10", "11,5", "9", "28"], ["44", "10,5", "12", "9,5", "28,5"], ["44,5", "11", "12,5", "10", "29"], ["45", "11,5", "13", "10,5", "29,5"],
        ["46", "12", "13,5", "11", "30"], ["46,5", "12,5", "14", "11,5", "30,5"], ["47", "13", "14,5", "12", "31"], ["48,5", "14", "15,5", "13", "32"],
        ["49,5", "15", "16,5", "14", "—"], ["51", "16", "17,5", "15", "—"],
      ] },
    ],
  },
  "Salomon": {
    source: "salomon.com/en-us/sizingchart",
    tables: [
      { name: "Salomon", cols: ["EU", "US", "UK", "Chân (cm)"], rows: [
        ["38 – 39 2/3", "5,5 – 6,5", "5 – 6", "24 – 24,9"], ["39 2/3 – 41", "6,5 – 8", "6 – 7,5", "25 – 25,9"], ["41 – 42 2/3", "8 – 9", "7,5 – 8,5", "26 – 26,9"], ["42 2/3 – 44", "9 – 10", "8,5 – 9,5", "27 – 27,9"],
        ["44 – 45 2/3", "10 – 11,5", "9,5 – 11", "28 – 28,9"], ["45 2/3 – 47", "11,5 – 12,5", "11 – 12", "29 – 29,9"], ["47 – 48 2/3", "12,5 – 13,5", "12 – 13", "30 – 30,9"], ["48 2/3 – 50", "13,5 – 15", "13 – 14,5", "31 – 31,9"],
      ] },
    ],
  },
  "On": {
    source: "on.com — Size Guide (Mens / Womens Shoes)",
    tables: [
      { name: "Nam", cols: ["EU", "US", "UK", "cm (JP)"], rows: [
        ["40", "7", "6,5", "25"], ["40,5", "7,5", "7", "25,5"], ["41", "8", "7,5", "26"], ["42", "8,5", "8", "26,5"],
        ["42,5", "9", "8,5", "27"], ["43", "9,5", "9", "27,5"], ["44", "10", "9,5", "28"], ["44,5", "10,5", "10", "28,5"],
        ["45", "11", "10,5", "29"], ["46", "11,5", "11", "29,5"], ["47", "12", "11,5", "30"], ["47,5", "12,5", "12", "30,5"],
        ["48", "13", "12,5", "31"], ["48,5", "13,5", "13", "31,5"], ["49", "14", "13,5", "32"], ["50", "15", "14,5", "33"],
      ] },
      { name: "Nữ", women: true, cols: ["EU", "US", "UK", "cm (JP)"], rows: [
        ["36", "5", "3", "22"], ["36,5", "5,5", "3,5", "22,5"], ["37", "6", "4", "23"], ["37,5", "6,5", "4,5", "23,5"],
        ["38", "7", "5", "24"], ["38,5", "7,5", "5,5", "24,5"], ["39", "8", "6", "25"], ["40", "8,5", "6,5", "25,5"],
        ["40,5", "9", "7", "26"], ["41", "9,5", "7,5", "26,5"], ["42", "10", "8", "27"], ["42,5", "10,5", "8,5", "27,5"],
        ["43", "11", "9", "28"], ["44", "12", "10", "29"],
      ] },
    ],
  },
};
window.SIZE_CHARTS["Jordan"] = window.SIZE_CHARTS["Nike"];
