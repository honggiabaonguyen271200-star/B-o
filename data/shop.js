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
