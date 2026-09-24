@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>nul && (set PY=py) || (set PY=python)
if "%~1"=="" (
  echo.
  echo  Cách dùng: kéo thả file bảng hàng .xlsx ^(tải từ Google Sheet: Tệp - Tải xuống - Microsoft Excel^) vào file cap-nhat-hang.bat này.
  echo.
  pause
  exit /b
)
echo  Đang cài thư viện đọc Excel (chỉ lần đầu)...
%PY% -m pip install -q openpyxl pillow
echo  Đang cập nhật hàng từ file bạn vừa kéo thả...
%PY% scripts\build_products.py "%~1"
echo.
echo  Đang lấy ảnh sản phẩm có sẵn trong bảng (mẫu nào đã có ảnh thì giữ nguyên)...
%PY% scripts\extract_images.py "%~1"
echo.
echo  Xong. Bước tiếp theo: trong Antigravity mở Source Control, Commit rồi Sync để đưa lên web.
pause
