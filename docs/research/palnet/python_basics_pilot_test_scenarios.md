# Kịch bản kiểm tra đầy đủ — Pre-test & bài học pilot Python cơ bản

**Phạm vi:** `GOAL_PY_BASICS`, Python graph `2.1`, 12 câu `PT-PYB-001`…`012`. **Dùng nội bộ:** tài liệu này chứa đáp án và ca kiểm thử ẩn; không đưa cho học viên. Bản nháp được duyệt phải có SHA-256 `9048eb9f86553977e47f5f99760c73e85c0d8c7122b002cc4de3c0629f1aba68`. Nếu SHA khác, dừng và duyệt lại bản mới.

Trạng thái hiện tại: phần **A–C** có thể kiểm tra ngay; phần **D** cần Docker; phần **E–G** là tiêu chí nghiệm thu khi API và dữ liệu thật được triển khai, **chưa thể báo đạt**. Tình huống ghi `PENDING_IMPLEMENTATION` hoặc `PENDING_REAL_DATA` là tiêu chí cần chạy sau này, **không phải PASS**. Mọi bước FAIL/UNAVAILABLE phải giữ bank phát hành rỗng; không sửa kết quả bằng cách điền cờ `APPROVED` hoặc dùng dữ liệu synthetic. Phạm vi này là pilot **Python Basics**, không chứng nhận JavaScript/C++/SQL hay toàn bộ 59 bài Python.

## A. Kiểm tra đúng phiên bản và cấu trúc đề — chạy ngay

Mở PowerShell tại `D:\Project\LearnPython`:

```powershell
Get-FileHash -LiteralPath 'backend/src/infrastructure/data/pretestBank.pythonBasics.draft.json' -Algorithm SHA256
python ai-service/scripts/validate_pretest_python_basics_draft.py
```

Kết quả cần thấy: hash như đầu tài liệu; `DRAFT_TECHNICAL_CHECK_PASSED`, `questionCount=12`, `CONCEPT=3`, `TRACING=4`, `BUG_HUNTING=2`, `PRACTICAL=3`, `goalSkillsCovered=9`, `gatewaySkillsCovered=5`, `technicalCasesPassed=15`, `knownWrongSolutionsCaught=3`, `issues=[]`. `contentApproved=false` và `servingEligible=false` **là đúng** ở giai đoạn nháp. Lệnh này chỉ kiểm tra kỹ thuật bằng Python cục bộ, không chứng nhận runner sản phẩm.

Chạy tiếp từ `D:\Project\LearnPython\backend`:

```powershell
node --test tests/pretestBankGate.test.cjs tests/pretestProfile.test.cjs tests/pretestRunnerIsolation.test.cjs
npx tsc --noEmit
```

Kết quả hiện tại: **11/11 kiểm tra đạt**, TypeScript không lỗi. Nếu có lỗi thì dừng; không đổi bank phát hành.

## B. Hai người duyệt nội dung — làm độc lập

Mỗi người đọc trực tiếp `backend/src/infrastructure/data/pretestBank.pythonBasics.draft.json` và ghi **riêng**: tên hoặc định danh có thể đối chiếu, vai trò, ngày giờ, SHA-256 ở đầu tài liệu, `PASS/NEEDS_FIX` cho từng ID, lý do sửa nếu có và chữ ký/xác nhận. Không chỉ ghi tên chức danh. Sau khi sửa bất kỳ câu nào, chạy lại A và cả hai người xác nhận **hash mới**.

| ID | Điều phải tự kiểm tra | Kết quả chuẩn để đối chiếu |
| --- | --- | --- |
| PT-PYB-001 | Tên biến hợp lệ, không có hai đáp án đúng | B — `ten_2` |
| PT-PYB-002 | Phân biệt phép chia, chia nguyên, phần dư | C — `%` |
| PT-PYB-003 | `strip()` chỉ bỏ khoảng trắng hai đầu | A — `strip()`; sourceRef lesson còn chờ mapping |
| PT-PYB-004 | Ép `'7'` thành số rồi cộng | B — in `9` |
| PT-PYB-005 | Slice `[1:4]` không gồm vị trí 4 | B — in `yth` |
| PT-PYB-006 | Thứ tự `if/elif/else` | B — in `dat` |
| PT-PYB-007 | `while` tăng đến 3 rồi dừng | C — in `6` |
| PT-PYB-008 | `=` không phải phép so sánh trong `if` | A — `if diem == 5:` |
| PT-PYB-009 | Bỏ qua 3 nhưng tiếp tục vòng lặp | A — `continue` |
| PT-PYB-010 | Đọc hai dòng, in tổng, không in prompt phụ | `5,3→8`; `-2,7→5`; `0,0→0` |
| PT-PYB-011 | Chẵn/lẻ kể cả âm và 0; phân biệt chữ hoa/thường | `4→CHAN`; `-3→LE`; `0→CHAN`; không thêm chữ/khoảng trắng |
| PT-PYB-012 | `range(1,n+1)` và biên `n=0` | `3→6`; `0→0`; `5→15` |

Reviewer 1 tập trung wording/độ khó/đúng primary skill; reviewer 2 kiểm tra độc lập đáp án, code, output và test. Cả hai cần xem chính **nội dung câu**, không chỉ đọc báo cáo tự động. Một câu `NEEDS_FIX` làm bộ đề hiện tại chưa thể phát hành.

Nếu dùng AI khác để tìm lỗi, gửi cho nó [phiếu giao phản biện độc lập](python_basics_ai_reviewer_prompt.md) cùng các file nguồn nêu trong phiếu. Phản biện AI là **bằng chứng hỗ trợ**, không được tự ghi thành hai chữ ký cá nhân hoặc kết quả Docker. Yêu cầu AI trả cả `FAIL` và `NOT_CHECKED`; một lời khen chung cho 12 câu không đủ nghiệm thu.

Kiểm tra thêm các biến thể dễ gây đáp án mơ hồ: `class` là keyword chứ không phải tên biến; câu 002 giới hạn **số nguyên dương**; `strip()` không xóa khoảng trắng giữa chuỗi; slice `[1:4]` không lấy index 4; câu 008 yêu cầu đúng với **mọi** `diem` chứ không chỉ `5`; câu 009 phải in tiếp `4,5`; câu 011 phân biệt `CHAN`/`LE` viết hoa; câu 012 chỉ nhận `n` không âm. Nếu một biến thể làm nhiều phương án cùng đúng, đánh `NEEDS_FIX` dù script kỹ thuật vẫn pass.

## C. Kiểm tra lesson–skill mapping — chưa được tự duyệt

Đối chiếu từng lesson pilot với DB/catalog, skill graph và nội dung bài. Với mỗi lesson cần xác nhận `(language, lessonId, graphVersion)`, title/skill chính và phụ, prerequisite lesson/skill, trạng thái `PUBLISHED`, nội dung `VALIDATED`, reviewer và checksum nguồn. Không gán `VERIFIED` chỉ vì title giống. Các nguồn cần chốt trước khi sửa `sourceRefs`:

| Câu | Nguồn hiện tại | Lesson ứng viên, **chưa VERIFIED** | Việc cần kết luận |
| --- | --- | --- | --- |
| PT-PYB-003 | Tài liệu String Module 4 | `LS-04.03`, đang `BLOCKED_CONFLICT` | Chốt skill/tiền đề và xung đột mã bài cũ |
| PT-PYB-010 | Bài Easy Module 1 | `LS-01.MP`, `REVIEW_REQUIRED_TITLE_ONLY` | Xác nhận đây thực sự là bài dạy/chấm tương ứng |
| PT-PYB-012 | Bài for/range Module 3 | `LS-03.03`, `REVIEW_REQUIRED_CONSISTENT` | Xác nhận ID/title/nội dung/prerequisite |

Kiểm thêm toàn bộ lesson thuộc pilot Python Basics mà policy có thể trả, không chỉ ba nguồn trên. Bài thiếu mapping, sai ngôn ngữ, chưa xuất bản, thiếu nội dung kiểm định hoặc có tiền đề treo phải bị loại. Nếu chưa có ít nhất một lesson hợp lệ, kết quả đúng của policy là `NO_ELIGIBLE_LESSON`, **không** cố tạo roadmap.

Ca mapping âm cần thử riêng: lesson ID trùng nhưng title khác; primary skill ngoài goal; prerequisite lesson không tồn tại/tạo chu trình; lesson đã hoàn thành; lesson `DRAFT` hoặc content chưa QC; mapping version/graph version cũ; khóa học chỉ khớp chữ “Python” trong title nhưng chưa có language chuẩn. Mỗi ca phải bị loại trước khi xếp hạng. Không coi sourceRef tài liệu là bằng chứng đã xác minh mapping.

## D. Kiểm định ba bài thực hành trên runner cách ly — cần Docker

Từ `D:\Project\LearnPython\backend`:

```powershell
docker info --format '{{.ServerVersion}}'
docker image inspect python:3.10-alpine --format '{{.Id}}'
node scripts/verify_python_basics_runner.cjs 9048eb9f86553977e47f5f99760c73e85c0d8c7122b002cc4de3c0629f1aba68
```

Lệnh cuối dùng **BatchCodeRunner của backend** ở chế độ `strictIsolation=true`: Docker không chạy, image không có, hoặc Docker lỗi giữa chừng thì báo `RUNNER_QC_UNAVAILABLE`/FAIL; **không** được chạy Python cục bộ để thay. Trên máy hiện tại Docker daemon chưa khả dụng, nên chưa có báo cáo PASS. Người kiểm định cần chạy trên máy có Docker và image `python:3.10-alpine` đã chuẩn bị; không coi việc cài/tải image là một phần của kiểm tra đã đạt.

Kết quả chấp nhận là JSON `RUNNER_QC_PASSED`, đúng `draftSha256`, `strictIsolation=true`, `fallbackToLocalAllowed=false`, có Docker server version/image ID và mã nguồn runner hash. Với từng câu `010`/`011`/`012`: `testCases=3`, `hiddenCases=2`, `referencePassed=3`, `incorrectCaught>=1`, `passed=true`. Lưu **nguyên văn JSON đầu ra** thành báo cáo, tính SHA-256 file báo cáo và gửi cùng dấu xác nhận của reviewer 2. Không chép input/output test ẩn vào ảnh màn hình dành cho học viên.

## E. API Pre-test — kiểm tra cổng hiện có và việc chưa triển khai

Hiện backend mới có `GET /api/onboarding/goals`, survey và `GET /api/onboarding/pretest-readiness/:surveyId`. Với survey Python Basics đã hoàn tất, gọi readiness bằng token của **chính chủ survey** phải trả HTTP **503** `PRETEST_UNAVAILABLE`, `attemptCreationAvailable=false`, `missingByType={3,4,2,3}`; không có prompt/đáp án/test ẩn trong response. Token người khác phải bị từ chối; survey nháp không được qua cổng.

Các API `POST /api/pretests`, lưu nháp, nộp bài, hồ sơ và roadmap trong đặc tả **chưa tồn tại**. Không gửi request và diễn giải 404 là “đề đã sẵn sàng”. Khi được triển khai, nghiệm thu theo các ca sau:

| Ca | Tác động cần thử | Kết quả bắt buộc |
| --- | --- | --- |
| E1 | Tạo/resume attempt cùng user + language | Tối đa một ACTIVE, 12 câu snapshot bất biến, 30 phút tính server |
| E2 | Người khác xem/sửa attempt | 403; không lộ câu/đáp án/test ẩn |
| E3 | Lưu nháp rồi nộp lại cùng idempotency key/payload | Một assessment; cùng key payload khác → 409 |
| E4 | Bỏ trống/hết giờ | Câu trống không sinh bằng chứng 0; attempt hết giờ được khóa/chấm câu đã trả lời |
| E5 | Đáp án sai hợp lệ | Điểm 0 cho skill chính; không tự cộng skill phụ |
| E6 | Runner lỗi hạ tầng | `ASSESSMENT_FAILED`, không quy thành sai/không kích cooldown |
| E7 | Làm lại trước 24 giờ | `PRETEST_COOLDOWN`; ngoại lệ chỉ theo contract hoàn tất roadmap |
| E8 | Graph/language/goal sai hoặc câu chưa duyệt | `PRETEST_UNAVAILABLE`, không phát đề thay bằng ngôn ngữ khác |
| E9 | Bank thiếu một loại câu, thiếu gateway hoặc trùng questionFamily/ID | Không phát đề 11 câu hoặc đếm hai biến thể là hai bằng chứng |
| E10 | Bank ghi hai reviewer giống nhau khác hoa/thường/khoảng trắng | Không tính là hai người độc lập |
| E11 | Nội dung/graph/test đổi sau khi reviewer xác nhận hash | Từ chối snapshot cũ, yêu cầu duyệt lại checksum mới |
| E12 | Hai request tạo attempt đồng thời từ hai thiết bị | Chỉ một ACTIVE/user/language; request kia resume hoặc lỗi rõ, không tạo hai đề |
| E13 | Tạo attempt Python và JavaScript cùng user | Phạm vi cooldown/ACTIVE theo language, không tráo đề/runner |
| E14 | Sửa câu sau `expiresAt`, kể cả đồng hồ client bị chỉnh | Server từ chối; trạng thái do giờ server quyết định |
| E15 | Nộp bài đúng lúc timeout và đồng thời có worker hết giờ | Một finalization/assessment duy nhất, không cộng bằng chứng hai lần |
| E16 | Code quá dài, ID không phải UUID, option không thuộc đề, question ID từ attempt khác | 400/403/409 theo loại lỗi; không chấm, không lộ câu khác |
| E17 | GET attempt/assessment của người khác hoặc response công khai | Từ chối quyền; không có `correctOption`, `correctAnswerHash`, referenceSolution, hidden input/output |
| E18 | Nộp lại sau lỗi chấm hạ tầng | Có đường retry/chấm lại an toàn, không kích cooldown và không ghi score 0 giả |
| E19 | Attempt đã kết thúc, cùng key/payload hoặc key khác | Idempotent theo contract; không tạo assessment/profile thứ hai |
| E20 | Đủ 24 giờ hoặc hoàn tất 100% roadmap hiện tại | Cho phép retake đúng ngoại lệ; thời gian tính từ `submittedAt`/`expiresAt` server |

## F. Hồ sơ, roadmap, shadow — nghiệm thu sau E

| Ca | Dữ liệu thử | Kết quả bắt buộc |
| --- | --- | --- |
| F1 | Hai câu độc lập cùng skill, một đúng một sai | mastery `0.50`, confidence `0.84`, `DEVELOPING` |
| F2 | Không có câu đã chấm của skill | mastery `null`, confidence `0`, `UNKNOWN` |
| F3 | Một câu áp dụng + bằng chứng độc lập, điểm đủ ngưỡng | Chỉ `PROFICIENT` khi mastery ≥0.75, confidence ≥0.70 và có bằng chứng áp dụng |
| F4 | Tự khai giỏi, thiếu bằng chứng | Không tự lên `PROFICIENT` hoặc bỏ qua skill |
| F5 | Tạo roadmap từ assessment khác user/language/goal | Bị từ chối; không ghi roadmap |
| F6 | Roadmap mới | Chỉ một item `AVAILABLE`; các item sau `LOCKED`, chưa sinh hàng loạt nội dung |
| F7 | Gọi trực tiếp item bị khóa hoặc hoàn thành thiếu quiz/test | 409/`DOD_NOT_MET`; không mở item tiếp |
| F8 | Một item đủ DoD, gửi lại cùng submission từ hai máy | Hoàn thành đúng một lần, mở đúng item kế |
| F9 | Mapping/checkpoint sai phiên bản hoặc không có candidate | `NO_ELIGIBLE_LESSON`/fallback có tên; không dùng weights ngẫu nhiên hay ASSISTments |
| F10 | Chạy shadow | Log version, candidate/điểm/bài chọn giả định; lộ trình người học **không đổi** |
| F11 | Ba bằng chứng độc lập cho cùng skill | confidence `0.936`; nhiều lần nộp cùng family/bài không tăng count |
| F12 | Một câu objective đúng, không có bằng chứng áp dụng | confidence `0.60`, vẫn `DEVELOPING`, không tự `PROFICIENT` |
| F13 | Câu thực hành qua runner đạt một phần test | score = số test đạt/tổng test; lỗi compile/runtime hợp lệ = 0; lỗi hạ tầng = không có bằng chứng |
| F14 | Evidence sai language/user/goal/graph, secondary skill hoặc MCODE chưa VERIFIED | Không nhập vào profile hoặc đạt tiền đề |
| F15 | masterScore dưới `0.45`; tại `0.45`; tại `0.75` với/không application | Ranh giới trạng thái đúng thứ tự UNKNOWN → NEEDS_FOUNDATION → PROFICIENT → DEVELOPING |
| F16 | Toàn bộ skill goal đã PROFICIENT | `NO_GAPS`, không tạo roadmap rỗng giả |
| F17 | Skill mục tiêu có tiền đề chưa PROFICIENT | Tiền đề nằm trước trong thứ tự topo, không bỏ qua theo self-report/gateway khác |
| F18 | Bắt đầu item AVAILABLE hai lần hoặc content generation lỗi | Tối đa một job; `FAILED` không phát nội dung thiếu QC, có đường retry có kiểm soát |
| F19 | Lý thuyết chỉ có cờ “đã đọc” từ client | Không đủ DoD nếu thiếu checkpoint server xác nhận |
| F20 | Quiz <5 câu hoặc <80%, thực hành chỉ pass public hay thiếu hidden | `DOD_NOT_MET`, item sau vẫn LOCKED |
| F21 | Bài thực hành pass 100% public và hidden, quiz ≥80%, lý thuyết/checkpoint đủ | Transaction chuyển item hiện tại COMPLETED và mở đúng item kế; không có hai item mở |
| F22 | Candidate sai language/goal, đã hoàn thành, chưa published, thiếu tiền đề hoặc mapping chưa VERIFIED | Loại trước policy score, kể cả policy rất ưu tiên bài đó |
| F23 | Checkpoint không có, sai domain/graph/mapping/checksum | Registry fail closed; fallback có tên, không dùng trọng số ngẫu nhiên hoặc ASSISTments |
| F24 | Shadow log có candidate, điểm, policy/model/graph/mapping version, fallback và bài thực tế hiển thị | Có thể audit quyết định, không ghi email/code cá nhân/test ẩn; không đổi roadmap |
| F25 | Tỷ lệ fallback/latency hoặc phân bố bài bất thường khi shadow | Báo cảnh báo và dừng mở rộng pilot; không suy ra hiệu quả học tập từ log shadow |

F1–F3 hiện có test logic thuần; **chưa phải** thử nghiệm API/DB trên học viên. F10 chỉ được bật khi E và mapping C đạt. Không công bố “gợi ý hiệu quả” từ shadow.

## G. Đo hiệu quả học tập — sau pilot, không thay bằng kiểm tra kỹ thuật

Khi có học viên thật và bài đánh giá **độc lập** chưa dùng để train/rank: khóa cỡ mẫu/power, gán chính sách theo **người học**, so sánh lộ trình hiện hành với đúng một policyVersion, đo tiến bộ pre→post và retention ngày 30. Báo số học viên, chênh lệch, CI 95%, missingness, completion/thời gian/fallback; phân tích intention-to-treat. Chưa đủ người học hoặc thiếu post-test thì ghi `CHƯA ĐỦ BẰNG CHỨNG`, không lấy AUC ASSISTments, 11 unit test hay 15 ca runner làm kết quả học tập.

Ca G5 cần kiểm: người học không đổi nhánh khi đăng nhập thiết bị khác; post-test không trùng câu dùng để chọn bài/train; hai nhánh cùng cửa sổ học và quyền truy cập; người bỏ học vẫn nằm trong phân tích intention-to-treat; giữ riêng kết quả Python với ngôn ngữ khác; không xem test sớm rồi đổi outcome; retention ngày 30 ghi cả mất theo dõi. Trước khi tuyển người học phải có bản bổ sung khóa power/cỡ mẫu, outcome và xử lý missingness. Nếu chưa có, `PENDING_REAL_DATA`.

Ca G6 cần kiểm: model card ghi miền áp dụng/version/checksum/giới hạn; registry chỉ bật đúng ngôn ngữ đã kiểm định; dashboard giám sát drift, calibration, lỗi tải, latency p50/p95 và fallback; có nút tắt policy mới/rollback mà không sửa điểm học viên hoặc mở khóa bài trái contract. Trạng thái hiện nay là `SERVING_DISABLED`, không ghi “đã vận hành”.

## Gói bằng chứng gửi lại để đối chiếu

1. Hai phiếu duyệt **riêng** có định danh, chữ ký/xác nhận, `PASS/NEEDS_FIX` cho 12 ID và SHA bản nháp.
2. JSON báo cáo D `RUNNER_QC_PASSED` cùng SHA-256 file báo cáo; nếu Docker chưa chạy, gửi trạng thái `UNAVAILABLE` để xử lý trước.
3. Bảng mapping pilot đã chốt: lessonId, skillId, tiền đề, bằng chứng PUBLISHED/VALIDATED, reviewer, checksum; nêu rõ cách xử lý `LS-04.03` và hai lesson ứng viên còn lại.
4. Khi E–F được triển khai, gửi kết quả test có thời gian/version và ID giả danh, **không** gửi token, email người học, đáp án/test ẩn công khai.

Chỉ khi A–F đạt mới tính là pilot chọn bài chạy được; G cần nghiên cứu học viên thật mới tính là đạt mục tiêu cuối.

## Mẫu ghi kết quả bắt buộc

Với **mỗi ca** ghi: `caseId`, `PASS | FAIL | NOT_CHECKED | PENDING_IMPLEMENTATION | PENDING_REAL_DATA`, người kiểm, ngày giờ, phiên bản/hash draft–graph–mapping–runner–policy, môi trường (Docker image ID nếu liên quan), input giả danh, output mong đợi, output thực tế, đường dẫn log/screenshot và issue cần sửa. Chỉ `PASS` khi có bằng chứng trực tiếp; `NOT_CHECKED` hoặc `PENDING_*` không được cộng vào tổng ca đạt. Sau mỗi lần sửa nội dung, mapping hoặc runner, chạy lại các ca phụ thuộc và ghi version/hash mới.
