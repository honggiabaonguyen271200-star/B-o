# Bộ nhận diện S&LIFE cho website

Tách từ logo gốc của chủ shop (ảnh vuông nền gradient, logo trắng) ngày 30/09/2026. Không vẽ lại, không đổi hình logo.

## File

| File | Dùng khi |
|---|---|
| `slife-mark.svg` | Logo mark (dây giày hình chữ S), màu theo `currentColor` — dùng inline để đổi màu bằng CSS |
| `slife-mark-gradient.svg` | Logo mark tô gradient thương hiệu — header nền trắng |
| `slife-wordmark.svg` / `slife-wordmark-gradient.svg` | Chữ "S&LIFE" |
| `slife-full.svg` / `slife-full-gradient.svg` | Mark + S&LIFE + "Since 2021" |
| `slife-mark-white.png`, `slife-full-white.png`, `slife-wordmark-white.png` | Bản trắng trên nền tối/gradient (PNG trong suốt) |
| `slife-mark-gradient.png`, `slife-full-gradient.png`, `slife-wordmark-ink.png` | Bản trên nền sáng |
| `favicon-32.png`, `favicon-48.png` | Favicon (mark trắng trên nền gradient) |
| `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` | Icon điện thoại / manifest |
| `slife-logo-square-1200.jpg` | Logo gốc 1200×1200 cho `og:image` mặc định |

## Màu lấy mẫu từ logo

| Tên | Mã | Vị trí trên logo |
|---|---|---|
| Cobalt | `#004AAD` | góc trên trái |
| Indigo | `#3E32AD` | 1/4 đường chéo |
| Violet | `#771CAE` | giữa |
| Berry | `#AD2571` | 3/4 đường chéo |
| Red | `#DB3137` | góc dưới phải |

Gradient: `linear-gradient(135deg, #004AAD 0%, #771CAE 50%, #DB3137 100%)`.

## Quy tắc

- Nền trắng/sáng: mark gradient hoặc mark `--ink`; chữ S&LIFE màu `--ink`.
- Nền tối hoặc gradient: bản trắng.
- Chừa khoảng trống quanh logo tối thiểu bằng 1/4 chiều cao mark. Không kéo méo, không đổ bóng, không đổi màu từng phần.
