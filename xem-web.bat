@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>nul && (set PY=py) || (set PY=python)
echo.
echo  Đang mở website S^&LIFE tại http://localhost:8080
echo  Giữ cửa sổ này mở trong lúc xem. Đóng cửa sổ để tắt.
echo.
start "" http://localhost:8080
%PY% -m http.server 8080
if errorlevel 1 (
  echo.
  echo  Không chạy được Python. Cài Python tại https://python.org và tích ô "Add Python to PATH".
  pause
)
