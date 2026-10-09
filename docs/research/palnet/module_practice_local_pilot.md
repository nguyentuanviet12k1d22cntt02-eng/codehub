# PAL-Net cho bài tập tổng hợp Python — pilot local

## Phạm vi ánh xạ đã kiểm tra

| Bài tổng hợp | Skill PAL-Net | Bài có thể gợi ý | Mức độ hiện có |
| --- | --- | ---: | --- |
| `LS-01.MP` | Chủ yếu `PY-BASICS-03`; bài hoán đổi biến → `PY-BASICS-01` | 30 bài | Easy / Medium / Hard |
| `LS-02.MP` | Chủ yếu `PY-FLOW-01` | 28/30 bài | Easy / Medium / Hard |
| `LS-03.MP_FOR` | `PY-FLOW-03` | 15 bài có lời giải/testcase chạy đúng | Easy / Medium |
| `LS-03.MP_WHILE` | `PY-FLOW-02` | 15 bài có lời giải/testcase chạy đúng | Easy / Medium |

`LS-04.MP` trở đi và các môn khác **không** được đưa vào pilot vì nằm ngoài sáu skill của checkpoint. Hai bài Module 2 cần chỉ mục chuỗi hoặc generator expression bị loại vì gán một nhãn `PY-FLOW-01` sẽ sai lệch. Phần lớn bài Module 2 dùng điều kiện trên dữ liệu nhập; `PY-FLOW-01` là **skill chính**, không phải mô tả đầy đủ mọi kỹ năng phụ. Bài Module 3 mới được kiểm tra trên các testcase có sẵn (đa số một testcase/bài), chưa phải kiểm định toàn diện biên dữ liệu.

Model là checkpoint học từ **40 học viên tổng hợp**, không phải bằng chứng hiệu quả sư phạm trên người học thật. Xác suất của model chưa được hiệu chuẩn cho dữ liệu người học local; vì vậy chính sách chọn bài có thêm rào chắn: lượt đầu chọn Easy, mới làm sai thì ưu tiên Easy, chỉ tăng mức khi có lịch sử làm đúng và điểm sẵn sàng đủ cao. Khi model lỗi, sai checksum, hoặc bài không đạt điều kiện, UI quay về lựa chọn thủ công; với ngân hàng không có bài nào được kiểm chứng, UI chặn các thẻ độ khó để tránh đưa người học vào bài hỏng.

## Kết quả kiểm tra mã và dữ liệu nguồn

- 90 bài trong bốn bài tổng hợp: lời giải chạy đúng trên **276 testcase** từ seed (Module 1–2: 242; Module 3: 34). Trong đó 88 bài đủ điều kiện ánh xạ vào pilot.
- Đối chiếu **chỉ đọc** database development đang cấu hình: 30/30 bài Module 1 và 30/30 bài Module 2 trùng với nguồn `seed_course_data.json` ở đề, starter, lời giải, độ khó và testcase; không cần đồng bộ, không sửa database. Mỗi bài trong hai module này đã có submission, nên không được ghi đè testcase.
- Backend: các kiểm tra phạm vi skill, lọc placeholder/bài ngoài vocabulary, giảm/tăng độ khó theo lịch sử, và thực thi lời giải đều qua. Từng nhóm testcase của bốn module được chạy độc lập.
- AI-service: 11/11 test qua, gồm bật mặc định trên loopback, chặn client ngoài loopback, tùy chọn tắt, checksum checkpoint/dataset/graph, và đối chiếu điểm model.
- `npm run build` của backend và frontend đều qua.
- Smoke test HTTP có xác thực qua Express → database development → AI-service local: thiếu token trả `401`; token hợp lệ trả gợi ý `EASY` cho `LS-01.MP`. Gọi trực tiếp cùng luồng cho `LS-01.MP`, `LS-02.MP`, `LS-03.MP_FOR`, `LS-03.MP_WHILE` đều trả mode PAL-Net; `LS-04.MP` trả mode thủ công. Khi tắt AI-service, endpoint trả `MANUAL / LOCAL_MODEL_UNAVAILABLE`. Chưa kiểm thử tương tác trong trình duyệt sau khi người học nộp bài. Không có dữ liệu database nào được sửa trong lần triển khai này.
- Sau thay đổi mặc định: chạy nguyên lệnh `uvicorn main:app --reload --port 8000` không đặt biến môi trường, POST score trả `200 / PALNET_SYNTHETIC_LOCAL_PILOT`; backend đang chạy ở cổng 3000 trả gợi ý `EASY` qua endpoint thật. Vite cũng khởi động bằng `npm run dev` (nếu 5173 bận, nó tự chọn cổng khác).

## Chạy thử trên local

1. Sử dụng database development đang cấu hình; dữ liệu Module 1–2 đã được sửa và khớp JSON. Không chạy seed chỉ để bật pilot. Nếu dùng một database local mới, nạp dữ liệu khóa học theo quy trình hiện có và đảm bảo `seed_course_data.json` được dùng làm nguồn cho bài tổng hợp Module 1–2.
2. Từ `ai-service`, chạy đúng lệnh thường dùng: `uvicorn main:app --reload --port 8000`. Pilot tự bật cho request loopback; không cần đặt `PALNET_LOCAL_PILOT`. Có thể chủ động tắt bằng `PALNET_LOCAL_PILOT=0`.
3. Từ `backend` và `frontend`, mỗi bên chạy `npm run dev`. Backend mặc định gọi AI-service ở `127.0.0.1:8000`, frontend mặc định gọi backend ở `localhost:3000`. Đăng nhập, mở bài tập tổng hợp Python Module 1–3. Sau khi nộp đúng, nút “Bài phù hợp tiếp theo” sẽ gọi lại PAL-Net trên lịch sử submission mới. Cần khởi động lại AI-service/backend cũ để mã mới có hiệu lực.

Model chỉ đánh giá mức độ sẵn sàng theo skill và độ khó, không hiểu nội dung riêng của từng bài; trong cùng một mức, hệ thống chọn bài chưa qua theo thứ tự ổn định. Điều kiện nghiệm thu UI: thẻ gợi ý hiện ở Module 1–3 khi checkpoint, DB và API đều sẵn sàng; bài được mở đúng `exerciseId`; nộp đúng dẫn đến bài chưa qua tiếp theo; tắt AI-service hoặc đặt `PALNET_LOCAL_PILOT=0` làm giao diện báo rõ fallback. Chưa được tuyên bố đã nghiệm thu end-to-end cho đến khi chạy các ca này trong trình duyệt có đăng nhập.
