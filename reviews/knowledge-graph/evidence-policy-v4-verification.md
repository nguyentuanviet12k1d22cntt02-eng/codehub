# Báo cáo kiểm định cá nhân hóa tri thức Python

- Thời điểm kiểm định: 2026-09-22 (Asia/Bangkok)
- Policy: `evidence_policy_v4`
- Phạm vi: cây tri thức Python, tổng hợp mastery, giao diện bản đồ tri thức và số liệu Dashboard

## Nguyên tắc đã áp dụng

1. Chỉ dùng kết quả `PASSED`/`FAILED` từ sandbox làm bằng chứng năng lực.
2. Kỹ năng chưa có lượt kiểm định không được gán phần trăm mastery.
3. Mỗi quan sát được cân theo độ khó; làm lại cùng bài chỉ có trọng số `0.35`.
4. Mastery và confidence được tính riêng. Confidence dùng tổng trọng số bằng chứng, không dùng số lần thử thô.
5. Bằng chứng từ khóa học, đấu trường và bài thích ứng được phát lại theo thứ tự thời gian qua cùng một policy.
6. Lỗi hạ tầng không làm tăng hoặc giảm mastery.
7. Lộ trình AI không phát hành template giả khi provider không trả dữ liệu hợp lệ.

## Tính toàn vẹn graph

- 35 kỹ năng.
- 49 cạnh tiên quyết.
- Graph là DAG, không có chu trình.
- Trường `prerequisites` của node khớp với cạnh đi vào.
- Bốn bản graph runtime có cùng SHA-256.
- Mọi kỹ năng `PUBLISHED` có ít nhất một học liệu thật.
- Bài `LS-04.07` được ánh xạ đồng thời tới `PY-EXC-02` và `PY-EXC-03`.

## Kết quả kiểm tra tự động

| Kiểm tra | Kết quả |
| --- | --- |
| `backend: npm run build` | Đạt |
| `backend: node --test tests/adaptive.test.cjs` | 14/14 đạt |
| `frontend: npm run build` | Đạt |
| `ai-service: python -m unittest tests.test_knowledge_graph_integrity` | 4/4 đạt |
| `python -m py_compile` cho planner và graph service | Đạt |
| `docker compose config --quiet` | Đạt |
| `git diff --check` | Không có lỗi whitespace |

## Kiểm tra tích hợp với dữ liệu thật

Kiểm tra được chạy trực tiếp qua Prisma với cơ sở dữ liệu cấu hình của dự án. Không gọi model, không tạo mock và không ghi thông tin người dùng vào báo cáo.

### Hồ sơ chưa có bằng chứng

```json
{
  "status": "PASSED",
  "engine": "evidence_policy_v4",
  "observed_skills": 0,
  "total_skills": 35,
  "total_actions": 0,
  "total_evidence_weight": 0,
  "unobserved_skills_are_null": true
}
```

### Hồ sơ có submission đã kiểm định

```json
{
  "status": "PASSED",
  "engine": "evidence_policy_v4",
  "observed_skills": 6,
  "total_actions": 31,
  "total_evidence_weight": 17.63,
  "mastery_values_valid": true,
  "confidence_values_valid": true,
  "sources": ["COURSE_SANDBOX", "ADAPTIVE_SANDBOX"]
}
```

## Hành vi giao diện đã kiểm định

- Hiển thị `Chưa đánh giá` khi chưa có bằng chứng.
- Trạng thái khóa dựa trên tiên quyết có mastery và confidence đạt ngưỡng.
- Đề xuất kỹ năng tiếp theo xét toàn bộ node đủ điều kiện.
- Có chế độ đồ thị và danh sách theo giai đoạn, hỗ trợ bàn phím.
- Dashboard đọc streak, số bài hoàn thành và số kỹ năng quan sát từ Evidence API.
- Không hiển thị phần trăm, streak, thời gian học hoặc output chạy code giả.
