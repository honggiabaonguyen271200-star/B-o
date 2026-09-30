/**
 * Sổ yêu cầu mua từ website S&LIFE Sneaker → Google Sheet của chủ shop.
 * Cách cài: xem HUONG-DAN-DON-HANG.md ở thư mục gốc của website.
 *
 * - Đây là SỔ YÊU CẦU, không phải hệ thống xác nhận đơn: giá/tồn/tiền cọc vẫn do chủ shop xác nhận trong Messenger.
 * - Chống ghi trùng: mỗi yêu cầu có một mã (VD SL261001-AB12). Mã đã có trong sổ thì không ghi thêm dòng mới.
 * - Website gọi bằng GET (JSONP) để biết chắc đã ghi hay chưa; POST vẫn nhận nếu cần.
 * - Không lưu số điện thoại, địa chỉ chi tiết hay thông tin thanh toán (website không thu các thông tin này).
 */
var SHEET_NAME = "Yêu cầu web";
var HEADERS = ["Thời gian", "Mã yêu cầu", "Tên gọi", "Nhận hàng tại", "Chân (cm)", "Sản phẩm (mã / size / giá trên web)",
  "Tạm tính (đ)", "Ghi chú", "Link tóm tắt", "Trạng thái (shop tự ghi)"];

function doGet(e) {
  var cb = (e && e.parameter && e.parameter.callback) || "";
  var result;
  try {
    result = save(JSON.parse((e && e.parameter && e.parameter.data) || "{}"));
  } catch (err) {
    result = { ok: false, error: "Dữ liệu không đọc được" };
  }
  return reply(result, cb);
}

function doPost(e) {
  var result;
  try {
    result = save(JSON.parse(e.postData.contents));
  } catch (err) {
    result = { ok: false, error: "Dữ liệu không đọc được" };
  }
  return reply(result, "");
}

function save(req) {
  var code = clean(req.code, 40);
  if (!/^SL\d{6}-[A-Z0-9]{4}$/.test(code)) return { ok: false, error: "Mã yêu cầu không hợp lệ" };
  if (!Array.isArray(req.items) || !req.items.length || req.items.length > 20) return { ok: false, error: "Không có sản phẩm" };

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    // Chống trùng: đã có mã này thì trả về ok, không ghi thêm
    var last = sheet.getLastRow();
    if (last > 1) {
      var found = sheet.getRange(2, 2, last - 1, 1).createTextFinder(code).matchEntireCell(true).findNext();
      if (found) return { ok: true, code: code, duplicate: true };
    }
    var items = req.items.map(function (it) {
      return clean(it.code, 40) + " / size " + clean(it.size, 10) + " / " + clean(it.name, 120) + " — " + Number(it.price || 0).toLocaleString("vi-VN") + "đ";
    }).join("\n");
    sheet.appendRow([
      new Date(), code, clean(req.name, 80), clean(req.province, 60), clean(req.foot, 10), items,
      Number(req.total || 0), clean(req.note, 500), clean(req.link, 1500), "",
    ]);
    return { ok: true, code: code };
  } finally {
    lock.releaseLock();
  }
}

function reply(obj, cb) {
  var json = JSON.stringify(obj);
  // Chỉ nhận tên hàm callback an toàn
  if (cb && /^[A-Za-z_$][\w$]{0,40}$/.test(cb)) {
    return ContentService.createTextOutput(cb + "(" + json + ");").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

// Cắt độ dài và chặn công thức lạ chèn vào bảng (nội dung bắt đầu bằng = + - @)
function clean(v, max) {
  var s = String(v == null ? "" : v).slice(0, max || 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
