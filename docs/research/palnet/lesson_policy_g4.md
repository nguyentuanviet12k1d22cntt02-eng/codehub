# G4 — Hợp đồng chọn bài học và pilot Python Basics

**Policy version:** `palnet-lesson-policy/1.0.0` (theo G0). **Đơn vị quyết định:** một `lessonId` tại lúc tạo roadmap. Không xếp lại roadmap đang học. Chỉ có tối đa một mục `AVAILABLE`/`IN_PROGRESS`.

## Ranh giới dữ liệu

`choose_lesson` trong `ai-service/app/recommendation/lesson_policy.py` là lõi quyết định thuần cho nghiên cứu. Adapter sản phẩm Python Basics hiện thực quy tắc `WEAK_SKILL` tương ứng tại `backend/src/modules/onboarding/roadmapPlanner.ts`, đọc dữ liệu tin cậy từ DB, khóa catalog pilot theo SHA, rồi tạo roadmap tại `POST /api/roadmaps`. Chỉ adapter phía server được cấp đầu vào; không tin payload do client tự khai. Survey/tự đánh giá, kết quả ngôn ngữ khác, score không có bằng chứng không phải mastery.

`SkillEvidence` chỉ được xét nếu nguồn là `PRETEST`, `PASSED_SUBMISSION` hoặc `GRADED_SUBMISSION`, cùng user/language/goal/graph, count > 0 và score/confidence trong [0,1]. `satisfies_prerequisite` phải lấy từ đánh giá có kiểm chứng, không được suy từ secondary skill hay tự khai. Lõi còn giao `state.satisfied_skill_ids` với tập bằng chứng hợp lệ trước khi xét tiền đề. Nếu assessment thiếu hoặc không khớp thì không chọn bài.

Lọc eligibility chạy **trước** xếp hạng: đúng ngôn ngữ/goal closure, chưa hoàn thành, đủ tiền đề lesson và skill, `PUBLISHED`, `VALIDATED`, mapping `VERIFIED`, và policy/mapping/graph version khớp. Roadmap đã có item mở thì không quyết định thêm; nhiều item mở là lỗi hợp đồng. Không có bài hợp lệ trả `NO_ELIGIBLE_LESSON`, không tự mở bài bị khóa.

## Bốn chính sách để đối chuẩn sau này

Mọi chính sách dùng cùng tập bài hợp lệ và tie-break theo `curriculumOrder`, rồi `lessonId`.

| Policy | Công thức điểm cho bài `l`, kỹ năng chính `k` | Khi thiếu tín hiệu |
| --- | --- | --- |
| `CURRICULUM_ORDER` | thứ tự chương trình tăng dần | Không suy diễn score |
| `WEAK_SKILL` | `(1 - verifiedScore[k]) × confidence[k]` | Kỹ năng chưa quan sát nhận điểm −1, cuối hàng |
| `ZPD_0775` | `1 - abs(predictedCorrectness[k] - 0.775)` | Fallback `WEAK_SKILL` hoặc `CURRICULUM_ORDER` |
| `EVIDENCE_ZPD_V1` | `0.40 × weakness + 0.35 × zpd + 0.15 × confidence + 0.10 × difficultyFit`, với `difficultyFit = 1 - abs(difficulty - predictedCorrectness[k])` | Thiếu signal của bất kỳ ứng viên nào → cùng fallback trên |

Trong công thức mới, điểm thành phần thiếu bằng chứng là 0; xác suất chỉ hợp lệ khi có checkpoint vận hành đã kiểm định cho đúng ngôn ngữ và graph. `difficulty` là số chuẩn hóa [0,1] từ catalog đã duyệt; ngoài miền thì thành phần đó bằng 0. Đây là **heuristic xếp hạng**, không phải ước lượng lợi ích học tập. `predictedCorrectness` là xác suất trả lời đúng, **không** phải mastery. Chưa có thí nghiệm kết quả sau học nên chưa thể nói chính sách mới cải thiện học tập.

Khi không có bằng chứng kỹ năng, chọn bài chẩn đoán hợp lệ trước (nếu catalog có đánh dấu), rồi theo chương trình. Fallback có tên: `DIAGNOSTIC_FIRST`, `NO_COMPLETE_VALIDATED_IN_DOMAIN_SIGNALS`, `NO_VERIFIED_SKILL_EVIDENCE`. Mọi fallback vẫn phải qua bộ lọc eligibility. Mapping toàn khóa G0 còn chờ duyệt; pilot riêng Python Basics đã khóa 26 bài/9 kỹ năng bằng manifest và kiểm tra nội dung thực tế, không mở các bài ngoài phạm vi này.

## Hợp đồng API dự kiến cho adapter nội bộ

Endpoint đề xuất: `POST /internal/lesson-decisions` (chưa công khai). Client chỉ gửi lựa chọn ngôn ngữ/goal và `assessmentId`; backend lấy toàn bộ dữ liệu tin cậy, không nhận trực tiếp `completedLessonIds`, evidence, candidate hay `modelVersion` từ client. Đáp ứng server:

```json
{
  "status": "READY",
  "fallback": "NO_COMPLETE_VALIDATED_IN_DOMAIN_SIGNALS",
  "eligibleLessonIds": ["LS-01.01"],
  "recommendation": {
    "lessonId": "LS-01.01",
    "targetSkillIds": ["PY-BASICS-01"],
    "reasonCodes": ["CURRICULUM_ORDER"],
    "evidenceSources": [],
    "confidence": null,
    "predictedCorrectness": null,
    "score": null,
    "modelVersion": null,
    "policyVersion": "palnet-lesson-policy/1.0.0",
    "graphVersion": "2.1",
    "mappingVersion": "lesson-skill-mapping/1.0.0",
    "effectivePolicy": "CURRICULUM_ORDER"
  }
}
```

`status` khác `READY` thì `recommendation=null`; `eligibleLessonIds` là tập sau lọc để kiểm toán, không phải danh sách công khai cho người học. Sau khi chọn, backend phải tạo item trong transaction có kiểm tra bất biến một item mở; lõi chọn bài không ghi DB. Các trường camelCase trên là wire contract; Python dataclass hiện dùng snake_case. Việc nối API/DB và migration metadata là việc còn lại trước nghiệm thu sản phẩm.

## Model registry và phát hành

`ai-service/models/serving/registry.json` chỉ dành cho checkpoint LearnPython đúng miền, theo từng ngôn ngữ. Hiện `models={}`. Một entry cần `language`, `trainingDomain=LEARNPYTHON`, `evaluationStatus=VALIDATED`, `mappingStatus=VERIFIED`, `graphVersion`, `mappingVersion`, danh sách `skillIds` có thứ tự, `modelVersion`, đường dẫn checkpoint dưới thư mục serving và SHA-256. Checkpoint phải mang lại cùng metadata và state dict load nghiêm ngặt. Loader dùng `weights_only=True`, thiếu/sai graph, version, checksum, domain hoặc checkpoint đều `not ready`; không dùng trọng số khởi tạo ngẫu nhiên. Artifact ASSISTments ở `ai-service/data/external/...` chỉ dùng nghiên cứu G1–G3, không được đưa vào registry. Mỗi ngôn ngữ cần huấn luyện/hiệu chuẩn và đánh giá in-domain riêng; dữ liệu còn ít thì dùng fallback quy tắc đã nêu, không tự gọi là baseline “đã hiệu chuẩn”.

`GET /model-status` báo `palnet_active`, `readiness`, `model_version`, fallback. Legacy `GET /recommend` là API **bài tập** của dashboard, khác hợp đồng chọn **bài học** này; đã trả 410 để checkpoint mới không đi qua luồng lịch sử chưa lọc ngôn ngữ. Backend dashboard hiện chuyển sang fallback `FALLBACK_RULE_BASED`. Fallback legacy đó chưa qua cổng mapping G0 và **không** được dùng để tạo roadmap hoặc tuyên bố đạt G4. Legacy `/user_mastery` cũng trả 410; backend đã có hồ sơ mastery dựa trên bằng chứng theo ngôn ngữ. Legacy `POST /train` đã ngừng để không train dữ liệu mock rồi nạp nhầm thành checkpoint vận hành.

## Tình trạng nghiệm thu

Đã có lõi lọc/xếp hạng 4 policy phục vụ đối chuẩn và registry checkpoint fail-closed. **Pilot G4 Python Basics có thể thử trên sản phẩm**: adapter DB xác thực, manifest 26 bài, tạo lộ trình, một bài mở và đồng bộ hoàn thành đã qua kiểm thử. G4 cho toàn bộ bốn ngôn ngữ chưa nghiệm thu; chưa có checkpoint LearnPython kiểm định, chưa có thử nghiệm tác động G5. Xem [biên bản pilot](python_basics_roadmap_pilot_2026-10-06.md).

## Pilot DB thật, chỉ đọc (06/10/2026)

`ai-service/scripts/shadow_lesson_pilot.py` là adapter vận hành thủ công ở chế độ shadow; không phải endpoint công khai, không tạo/sửa roadmap và không xuất user ID. Chạy từ thư mục gốc repo:

```powershell
python ai-service/scripts/shadow_lesson_pilot.py --audit
python ai-service/scripts/shadow_lesson_pilot.py --assessment-id <UUID_ASSESSMENT_DA_FINALIZE>
```

Script dùng `DATABASE_URL` từ môi trường hoặc `backend/.env`, đặt kết nối PostgreSQL chỉ đọc và giới hạn thời gian truy vấn. `--audit` trả số đếm tổng hợp; `--assessment-id` chỉ chạy khi có assessment đúng user/language/goal/graph, attempt đã `SUBMITTED`/`TIMED_OUT` và survey không phải draft. Bằng chứng Pre-test được lấy từ câu đã chấm `CURATED_VALIDATED`, chỉ tính primary skill và khử trùng `questionFamilyId`; công thức mastery/confidence và điều kiện prerequisite theo đặc tả G0. Bài nộp pass được đếm riêng, **không** chuyển thành bằng chứng kỹ năng khi item-to-skill mapping chưa VERIFIED. Catalog phải khớp stable lesson ID và title, nhưng hiện Course không có trường language và không có QC/đăng phát hành đủ tin cậy; vì vậy ứng viên vẫn `releaseStatus=UNKNOWN`, `contentValidationStatus=UNVERIFIED`, mapping version review. Lõi G4 sẽ loại toàn bộ ứng viên, đúng thiết kế fail-closed.

Ảnh chụp DB chỉ đọc ngày 06/10/2026: 181 lesson có stable ID; 59/59 mapping Python review khớp ID + title catalog; 514 submission Python `PASSED` từ **7 học viên** (JavaScript 9 từ 1, C++ 20 từ 1); 0 Pre-test assessment, 0 câu Pre-test đã chấm, 0 roadmap, 0 mapping `VERIFIED`. Đây là **độ phủ dữ liệu và điều kiện triển khai**, không phải kết quả chất lượng gợi ý hay lợi ích học tập. Không có assessment thật để chạy quyết định cho một học viên; không tạo assessment giả để báo kết quả. Bảy học viên có bài nộp pass cũng không đủ cơ sở để tuyên bố đã huấn luyện/kiểm định checkpoint LearnPython.

Phần kiểm kê DB ở trên là ảnh chụp **trước** khi runtime Pre-test và roadmap pilot được triển khai. Hiện Python Basics có bank 12 câu, chấm Docker và adapter tạo roadmap; catalog ngoài pilot cùng shadow log sản phẩm còn phải làm. Chỉ checkpoint LearnPython đã kiểm định riêng mới được phép cung cấp `predictedCorrectness`; pilot hiện dùng quy tắc/fallback.
