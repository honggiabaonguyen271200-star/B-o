/**
 * Lưu đơn hàng từ website S&LIFE Sneakers vào Google Sheet.
 * Cách cài: xem HUONG-DAN-DON-HANG.md ở thư mục gốc của website.
 */
var SHEET_NAME = "Đơn hàng";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var order = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Thời gian", "Mã đơn", "Họ tên", "SĐT", "Email", "Tỉnh/thành", "Địa chỉ",
        "Chân (cm)", "Sản phẩm", "Tổng tiền", "Thanh toán", "Ghi chú", "Trạng thái"]);
      sheet.setFrozenRows(1);
    }
    var items = (order.items || []).map(function (it) {
      return (it.code || "") + " / size " + it.size + " / " + it.name + " — " + Number(it.price || 0).toLocaleString("vi-VN") + "đ";
    }).join("\n");
    sheet.appendRow([
      new Date(), clean(order.code), clean(order.name), "'" + clean(order.phone), clean(order.email),
      clean(order.province), clean(order.address), clean(order.foot), items,
      Number(order.total || 0), clean(order.payment), clean(order.note), "Mới",
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Chặn công thức lạ chèn vào bảng (VD nội dung bắt đầu bằng "=")
function clean(v) {
  var s = String(v == null ? "" : v).slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
