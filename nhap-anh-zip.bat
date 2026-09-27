@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>nul && (set PY=py) || (set PY=python)
if "%~1"=="" (
  echo.
  echo  Cách dùng: kéo thả file .zip lớn ^(mỗi mẫu giày là một zip nhỏ hoặc thư mục, đặt tên theo mã^) vào file nhap-anh-zip.bat này.
  echo.
  pause
  exit /b
)
echo  Đang cài thư viện xử lý ảnh (chỉ lần đầu)...
%PY% -m pip install -q pillow
echo  Đang nhập ảnh từ file zip bạn vừa kéo thả...
%PY% scripts\import_image_zip.py "%~1"
echo.
echo  Xong. Kiểm tra dòng KHÔNG khớp (nếu có), rồi trong Antigravity: Source Control - Commit - Sync.
pause
