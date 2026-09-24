// Thông tin cửa hàng — sửa tại đây, toàn bộ website tự cập nhật.
window.SHOP = {
  name: "S&LIFE Sneakers",
  tagline: "Giày chính hãng, hàng sẵn tại shop",
  owner: "Mr. Bảo",
  phone: "0941598395",
  phoneDisplay: "0941 598 395",
  zalo: "https://zalo.me/0941598395",
  facebook: "", // Dán link Facebook cá nhân/Page vào đây để hiện nút Messenger
  facebookName: "Nguyễn Hồng Gia Bảo",
  instagram: "https://www.instagram.com/s.life_sneakers/",
  tiktok: "https://www.tiktok.com/@slifesneaker",
  bank: {
    name: "Techcombank",
    number: "19035107259014",
    holder: "Nguyen Hong Gia Bao",
  },
  depositPercent: 30,
  returnDays: 3,
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
