# Bộ mascot thỏ — 8 hướng

Nguồn giữ nguyên: `D:/Project/LearnPython/assets/img/full frame.png`.
SHA-256: `E93D40CD3EBAF8D38682ECBA323F74CEA4705C48C021F0331D173A0509073BC6`.

| File trong frames/ | Hướng | Ô gốc |
| --- | --- | --- |
| n.png | 12h, nhìn lên | Hàng 1 cột 1 |
| ne.png | 1h30, chéo lên phải | Hàng 1 cột 2 |
| e.png | 3h, phải | Hàng 1 cột 3 |
| se.png | 4h30, chéo xuống phải | Hàng 1 cột 4 |
| s.png | 6h, xuống | Hàng 2 cột 1 |
| sw.png | 7h30, chéo xuống trái | Hàng 2 cột 2 |
| w.png | 9h, trái | Hàng 2 cột 3 |
| nw.png | 10h30, chéo lên trái | Hàng 2 cột 4, sửa riêng phần đầu |

- `source-frames/`: tám ô cắt lossless, còn nền caro để đối chiếu với nguồn.
- `*-enhanced.png`: ảnh nâng chất lượng/tách nền bằng built-in image_gen; không dùng CLI/API key dự án.
- `frames/`: tám PNG hoàn chỉnh 576×768, alpha thật, neo cổ chung; thân/áo/logo/chân dùng chung.
- `layers/`: thân cố định và tám đầu trên canvas giống nhau. Không lật logo, xoay hay scale thân khi đổi hướng.
- `frontend/public/mascots/rabbit/v1/`: các lớp 192×256, tổng khoảng 270 KB, đủ cho kích thước UI và màn hình mật độ cao.
- `contact-sheet.png`: bảng đối chiếu tám frame. `rabbit-8-frames.zip`: gói tám PNG hoàn chỉnh.

## Prompt set đã dùng (built-in image_gen)

Edit target: one existing crop from the source 8-frame rabbit. Supporting image:
the enhanced N frame, for color/detail/fixed body only, NOT a replacement head.
Background-extraction / identity-preserve. Produce one high-resolution PNG cutout
on genuine alpha transparency, full body on a vertical 2:3 canvas, with the entire
ears and feet and small transparent margins. Remove all baked checkerboard.
Preserve the original white rabbit, pink ears/nose, glossy dark eyes, subtle peach
cheeks, blue hood/polo/shorts, hands behind back, star and SAO VIET shirt mark.
Restore crisp natural detail and anti-aliased contours. No redesign, added props,
floor shadow, glow, halo, grid, cropped body, oversharpened outlines or extra text.
For N/NE/E/SE/S/SW/W, keep the exact source head pose/gaze/expression; only improve
quality and extraction. Direction names correspond to the clock labels above.

NW delta: the source head pointing up-right is wrong. Change ONLY head/hood/ears/
eyes above the collar to UP-LEFT at 10:30. Raise and turn the head in 3/4 toward
SCREEN LEFT; nose/muzzle point diagonally up-left, pupils toward upper-left.
Do not mirror the torso/logo. Keep chest, arms behind back, shorts, legs and feet
front-facing in their original pose and placement. The final pack uses the same
canonical body pixels for all directions rather than relying on AI to preserve them.

## Tái tạo và kiểm tra

Chạy từ project root, không ghi đè ảnh gốc:

```powershell
powershell -NoProfile -File scripts/assets/prepare-rabbit-frames.ps1
powershell -NoProfile -File scripts/assets/pack-rabbit-frames.ps1
powershell -NoProfile -File scripts/assets/verify-rabbit-frames.ps1
```

Kiểm tra pixel xác nhận toàn vùng thân từ y=470 trở xuống giống hệt giữa tám
frame; các cạnh canvas đều alpha=0, không cắt tai/chân. UI vẽ một ảnh thân cố
định và tám lớp đầu preload/decode sẵn, chỉ chuyển opacity. Có hysteresis và
lọc góc để tránh rung tại ranh giới hướng; reduced-motion tắt theo chuột/chuyển
mờ, cảm ứng dùng đổi hướng tự động chậm. Không thêm thư viện animation.
