# Đặc tả Giai đoạn 0 — Pre-test, Learner Profile và roadmap đa ngôn ngữ

**Trạng thái:** Hợp đồng sản phẩm đã chốt theo quyết định ngày 04/10/2026; đây là đầu ra thiết kế, chưa phải chức năng đã triển khai.

**Phạm vi:** Python, JavaScript, C++ và SQL. C chỉ có trong enum bài nộp, chưa có khóa học và skill graph tương ứng nên không thuộc phạm vi roadmap hiện tại.

**Tài liệu liên quan:** [Kế hoạch](ke_hoach.md), [các giai đoạn phát triển](giai_doan_phat_trien.md) và hợp đồng API/Gherkin tại .agent/specs/current-task.md.

## 1. Quyết định sản phẩm và bất biến

| Chủ đề | Quy tắc đã chốt |
| --- | --- |
| Khởi tạo | Mỗi roadmap mới bắt buộc có khảo sát và một Pre-test đã chấm hợp lệ của **cùng người học, ngôn ngữ và mục tiêu**. |
| Độ dài đề | 12–15 câu, thời gian 30 phút tính trên server; câu hỏi tập trung vào kỹ năng cổng và tiền đề thuộc mục tiêu đã chọn. |
| Nguồn câu | Ưu tiên câu đã duyệt. AI chỉ tạo câu dự phòng khi thiếu câu hợp lệ cho một kỹ năng/loại câu cần thiết; câu mới phải qua kiểm tra schema, đáp án và runner đúng ngôn ngữ trước khi phát hành. |
| Chấm điểm | Đáp án khách quan và test thực thi quyết định điểm. AI phân tích lỗi và viết phản hồi dựa trên bằng chứng; không được tự tuyên bố bài sai là đạt. |
| Hoàn thành mục | Học đủ phần lý thuyết bắt buộc, quiz đạt ít nhất 80%, bài thực hành đạt **100% test công khai và test ẩn**; trong đó toàn bộ test ẩn phải đạt. |
| Mở khóa | Mục đầu tiên AVAILABLE; các mục sau LOCKED. Chỉ khi server xác nhận mục hiện tại COMPLETED thì mở đúng mục kế tiếp trong một giao dịch. |
| Nội dung | Khi tạo roadmap chỉ ghi chỉ mục. Chỉ tạo lý thuyết, quiz và bài thực hành cho **mục đang mở mà học viên chọn bắt đầu**. |
| Làm lại Pre-test | 24 giờ kể từ lúc phiên cùng ngôn ngữ kết thúc bằng nộp bài/hết giờ; được làm lại ngay khi hoàn thành 100% roadmap hiện tại của ngôn ngữ đó. Lỗi hạ tầng không tiêu lượt. |
| SQL | Giữ giáo trình SQL Server/T-SQL. Pre-test và bài thực hành SQL phải được kiểm định/chấm bằng môi trường tương thích T-SQL; runner SQLite hiện có không đủ cho câu dùng cú pháp riêng của T-SQL. |

Không có fallback sang Python hay C++ khi thiếu câu hỏi, graph hoặc runner của ngôn ngữ được chọn. Lỗi thiếu năng lực hệ thống phải được báo rõ và không sinh hồ sơ/roadmap từ kết quả chưa được chấm hợp lệ.

## 2. Nguồn kỹ năng và mục tiêu học

### 2.1. Skill graph

| Ngôn ngữ | Tệp trong ai-service/data | Phiên bản | Số module | Số skills |
| --- | --- | ---: | ---: | ---: |
| Python | pythonSkillGraph.json | 2.1 | 6 | 35 |
| JavaScript | javascriptSkillGraph.json | 3.0.0 | 9 | 23 |
| C++ | cppSkillGraph.json | 4.0.0 | 7 | 21 |
| SQL | sqlSkillGraph.json | 2.0 | 7 | 7 |

Đã đối chiếu cả bốn tệp với bản sao tại backend/src/infrastructure/data: nội dung hiện đồng bộ. Mỗi graph không có ID trùng, không tham chiếu tiền đề thiếu và là DAG. Mỗi bản khảo sát, đề, hồ sơ và roadmap lưu language cùng graphVersion; triển khai phải kiểm tra phiên bản thực tế trước khi sử dụng.

### 2.2. Mục tiêu theo ngôn ngữ

Tập kỹ năng của một mục tiêu là **toàn bộ skills trong các module liệt kê, cộng bao đóng tiền đề**. Các tập dưới đây đã kiểm tra bao đóng và không thiếu tiền đề. ID mục tiêu chỉ có nghĩa trong cặp (language, goalId).

| Ngôn ngữ | goalId | Các module thuộc mục tiêu | Số skills | Số câu |
| --- | --- | --- | ---: | ---: |
| Python | GOAL_PY_BASICS | MOD-BASICS, MOD-FLOW | 9 | 12 |
| Python | GOAL_PY_DATA | Hai module trên + MOD-COLLECTIONS | 17 | 14 |
| Python | GOAL_PY_FOUNDATION | Ba module trên + MOD-FUNC, MOD-EXC-IO | 29 | 15 |
| Python | GOAL_PY_FULL | Toàn bộ 6 module | 35 | 15 |
| JavaScript | GOAL_JS_BASICS | MOD-JS-VAR, MOD-JS-TYPE, MOD-JS-CONTROL | 6 | 12 |
| JavaScript | GOAL_JS_PRACTICAL | Ba module trên + MOD-JS-FUNC, MOD-JS-DATA, MOD-JS-ES6 | 15 | 14 |
| JavaScript | GOAL_JS_FULL | Toàn bộ 9 module | 23 | 15 |
| C++ | GOAL_CPP_BASICS | MOD-CPP-SYNTAX, MOD-CPP-CONTROL | 6 | 12 |
| C++ | GOAL_CPP_DATA | Hai module trên + MOD-CPP-DATA, MOD-CPP-RECORDS | 13 | 14 |
| C++ | GOAL_CPP_FULL | Toàn bộ 7 module | 21 | 15 |
| SQL | GOAL_SQL_BASICS | MOD-SQL-RDBMS, MOD-SQL-DQL, MOD-SQL-FILTER, MOD-SQL-LOGIC, MOD-SQL-SORT | 5 | 12 |
| SQL | GOAL_SQL_ANALYTICS | Năm module trên + MOD-SQL-AGG | 6 | 14 |
| SQL | GOAL_SQL_FULL | Toàn bộ 7 module | 7 | 15 |

### 2.3. Kỹ năng cổng ưu tiên kiểm tra

Đây là **pool ưu tiên**, không phải kết luận rằng các skills khác đã thành thạo. Chỉ lấy kỹ năng thuộc mục tiêu và tiền đề của nó. Những kỹ năng không có bằng chứng đã xác thực giữ UNKNOWN.

- **Python (12):** PY-BASICS-01, PY-BASICS-03, PY-STRING-02, PY-FLOW-01, PY-FLOW-03, PY-LIST-01, PY-DICT-01, PY-FUNC-01, PY-EXC-01, PY-IO-01, PY-OOP-01, PY-OOP-04.
- **JavaScript (12):** JS-VAR-01, JS-TYPE-01, JS-COND-01, JS-LOOP-01, JS-FUNC-01, JS-ARRAY-01, JS-OBJECT-01, JS-SCOPE-01, JS-ARRAY-HOF-01, JS-CLASS-01, JS-ERROR-01, JS-MODULE-01.
- **C++ (12):** CPP-SYNTAX-01, CPP-TYPE-01, CPP-COND-01, CPP-LOOP-01, CPP-FUNC-01, CPP-ARRAY-01, CPP-VECTOR-01, CPP-STRUCT-01, CPP-PTR-01, CPP-RECUR-01, CPP-BUILD-01, CPP-SMARTPTR-01.
- **SQL (7):** SQL-RDBMS-01, SQL-DQL-01, SQL-WHERE-01, SQL-LOGIC-01, SQL-SORT-01, SQL-AGG-01, SQL-JOIN-01.

SQL có bảy skills nên 12–15 câu sẽ có nhiều câu độc lập cho cùng một skill. Với mục tiêu nhập môn của ngôn ngữ khác, chỉ một phần pool gateway liên quan; các câu còn lại đo tiền đề, kỹ năng chưa quan sát hoặc tạo bằng chứng thứ hai cho kỹ năng quan trọng. Không gán điểm cho một tiền đề chỉ vì học viên trả lời đúng kỹ năng phía sau.

## 3. Khảo sát đầu vào

**surveyVersion: 2.0.** Form gồm language, goalId thuộc language đó, mcodeHistory (NEVER_ENROLLED / LEARNING / COMPLETED / NOT_SURE), externalExperience (NONE / LESS_THAN_3_MONTHS / 3_TO_12_MONTHS / OVER_1_YEAR), mức tự tin 1–3 theo các module của graph, giờ học mỗi tuần và ưu tiên thực hành/lý thuyết.

- Câu hỏi “đã học xong lộ trình MCODE của ngôn ngữ này chưa?” là lời tự khai. Backend đối chiếu Enrollment, LessonProgress, Submission và Certificate **trong khóa học tương ứng**. Enrollment hoặc số bài đã mở không phải bằng chứng thành thạo.
- Tiến độ được tính **theo từng khóa học**, không cộng dồn các khóa cùng ngôn ngữ: một khóa đạt 80% là `VERIFIED_ACTIVITY`; chứng chỉ hoặc hoàn thành 100% bài bắt buộc của một khóa là `VERIFIED_COURSE_COMPLETION`. Snapshot lưu thống kê từng khóa và khóa có tiến độ cao nhất để giải thích quyết định.
- Bảng `Course` hiện chưa có trường định danh ngôn ngữ, nên đối chiếu dùng pattern tiêu đề được kiểm tra cho Python, JavaScript, C++ và T-SQL; snapshot ghi `COURSE_TITLE_PATTERN_FALLBACK`. Khi mô hình khóa học được mở rộng, cần bổ sung `course.language` và chuyển truy vấn sang định danh đó trước khi thêm khóa có tên mơ hồ.
- Ghi riêng selfReportedHistory, verifiedCourseProgress và verificationStatus. VERIFIED_COURSE_COMPLETION cần chứng chỉ hoặc toàn bộ bài bắt buộc đã hoàn thành theo dữ liệu khóa học; tiến độ 80% chỉ là VERIFIED_ACTIVITY, chưa phải hoàn thành. Không có dữ liệu đối chiếu thì SELF_REPORTED_UNVERIFIED.
- Các câu tự đánh giá và kinh nghiệm chỉ điều chỉnh chọn đề. Không cộng thẳng vào masteryScore hoặc confidence.
- Cho lưu nháp; chỉ khảo sát hợp lệ mới tạo được phiên Pre-test. Chỉ chủ sở hữu được xem/sửa dữ liệu của mình.

## 4. Blueprint và vòng đời Pre-test

### 4.1. Cơ cấu đề trong 30 phút

Tỷ lệ 25% khái niệm, 30% đọc code/truy vấn, 20% sửa lỗi, 25% thực hành là **mục tiêu làm tròn**, không phải ràng buộc phân số không thể đạt với số câu nguyên.

| Số câu | Khái niệm | Đọc code/truy vấn | Sửa lỗi | Thực hành |
| ---: | ---: | ---: | ---: | ---: |
| 12 | 3 | 4 | 2 | 3 |
| 13 | 3 | 4 | 3 | 3 |
| 14 | 4 | 4 | 3 | 3 |
| 15 | 4 | 5 | 3 | 3 |

Mỗi câu có đúng một primarySkillId thuộc graph đã chọn; secondarySkillIds chỉ để giải thích, không tự tạo thêm điểm. Bộ chọn đề: lấy giao của mục tiêu với gateway pool, ưu tiên tiền đề chưa quan sát, phân bổ ít nhất một câu cho mỗi gateway được chọn trong giới hạn đề, rồi dùng slot còn lại cho kỹ năng tự khai đã vững nhưng thiếu bằng chứng và câu độc lập thứ hai. Không chọn hai biến thể cùng questionFamily để tăng confidence giả.

Đề gồm câu khách quan, đọc kết quả, sửa lỗi và ba bài thực hành nhỏ. Python/JavaScript/C++ dùng runner tương ứng; SQL dùng T-SQL trên fixture cô lập. Ngân hàng câu đã duyệt được ưu tiên. AI chỉ tạo phương án dự phòng cho đúng language + primarySkillId + loại câu còn thiếu. Câu AI phải đạt schema, cú pháp/khả năng thực thi, lời giải chuẩn vượt toàn bộ test, ít nhất một đáp án sai mẫu bị test bắt, giới hạn tài nguyên và kiểm tra không lộ đáp án/test ẩn. Nếu không đủ **số câu đã kiểm định theo mục tiêu đã chọn** trong bảng 2.2, trả PRETEST_UNAVAILABLE và không phát hành đề thiếu chất lượng.

### 4.2. Phiên làm bài

Mỗi người học có tối đa một attempt ACTIVE cho mỗi language. Tạo đề là snapshot bất biến (ID câu, prompt, đáp án/rubric và test phía server, graphVersion, bankVersion, startedAt, expiresAt). Frontend chỉ nhận phần công khai. Lưu nháp từng câu; khi hết 30 phút, server khóa phiên và chấm những câu đã trả lời. Câu bỏ trống không phải điểm 0 và không sinh bằng chứng cho skill đó; câu đã trả lời sai hợp lệ mới là điểm 0.

Cooldown 24 giờ tính từ submittedAt hoặc expiresAt của attempt kết thúc. Nếu việc chấm lỗi hạ tầng, attempt ở trạng thái ASSESSMENT_FAILED, không áp cooldown và cho tiếp tục/chấm lại hoặc tạo phiên mới sau khi xử lý lỗi. Bài nộp dùng idempotency key: gửi lại cùng key và cùng payload trả cùng kết quả; cùng key với payload khác trả 409. Chỉ attempt đã chấm hợp lệ mới được tạo roadmap.

## 5. Chấm điểm và Learner Profile

### 5.1. Bằng chứng hợp lệ

- Câu khách quan đúng/sai nhận score 1/0. Bài thực hành nhận tỷ lệ số test đạt trên toàn bộ test công khai và ẩn; compile/runtime error hợp lệ nhận 0, lỗi hạ tầng không tạo bằng chứng.
- AI giải thích lỗi, đưa phản hồi theo rubric và trích dẫn questionId/test summary. Điểm khách quan được tính từ đáp án và runner; AI không sửa điểm nếu thiếu bằng chứng thực thi.
- Chỉ bài nộp MCODE đã xác thực và ánh xạ chắc chắn tới cùng language + skillId mới được hợp nhất. Mỗi questionFamily hoặc bài tập MCODE chỉ góp một bằng chứng độc lập ở snapshot hiện tại; nhiều lần nộp cùng bài không tăng evidenceCount. Lưu nguồn và thời điểm của từng bằng chứng.

### 5.2. Công thức phiên bản 2.0

Với mỗi skill, lấy tập bằng chứng độc lập đã xác thực. Trọng số: câu khái niệm 1; đọc code/truy vấn 1,25; sửa lỗi 1,25; bài thực hành và bài nộp MCODE qua runner 2. masteryScore = tổng (trọng số × score) / tổng trọng số; nếu không có bằng chứng thì masteryScore = null. evidenceCount là số bằng chứng độc lập, không phải số lần bấm Nộp.

confidence = 1 − 0,4 ^ evidenceCount. Vì vậy 0 bằng chứng → 0; 1 → 0,60; 2 → 0,84; 3 → 0,936. Không gán confidence = 1 chỉ vì một bài đã pass. Một bằng chứng thực hành là câu áp dụng; câu trắc nghiệm nhận biết thuần túy không phải bằng chứng áp dụng.

Phân loại theo thứ tự, bao phủ mọi trường hợp:

1. UNKNOWN nếu evidenceCount = 0, masteryScore = null hoặc confidence < 0,50.
2. NEEDS_FOUNDATION nếu đã có bằng chứng hợp lệ và masteryScore < 0,45.
3. PROFICIENT nếu masteryScore ≥ 0,75 **và** confidence ≥ 0,70 **và** có ít nhất một bằng chứng áp dụng hợp lệ.
4. DEVELOPING cho mọi trường hợp còn lại.

Một câu bỏ trống hoặc lỗi runner không xóa các bằng chứng hợp lệ khác của cùng skill. Trạng thái module chỉ là thống kê số skill theo bốn trạng thái; không tuyên bố cả module PROFICIENT khi còn skill UNKNOWN. Roadmap chỉ được bỏ qua skill khi chính skill đó PROFICIENT theo bằng chứng, không suy rộng từ gateway hoặc lời tự khai.

## 6. Roadmap tuần tự và tiêu chí hoàn thành mục

Roadmap lưu language, goalId, assessmentId, profileVersion, graphVersion và danh sách RoadmapItem gồm orderIndex, skillId, mục tiêu, lý do đề xuất, tiền đề, learningStatus, contentStatus, contentId tùy chọn. Thuật toán chỉ lấy skill thuộc bao đóng mục tiêu, thêm mọi tiền đề chưa PROFICIENT, sắp topological theo graph, rồi chia thành mục học. Nếu toàn bộ skill mục tiêu đã PROFICIENT, trả NO_GAPS cùng gợi ý mục tiêu cao hơn; không tạo roadmap rỗng giả có mục đầu.

Khi tạo roadmap, chỉ mục đầu AVAILABLE, các mục sau LOCKED; mọi contentStatus = PLANNED và contentId = null. Chỉ mục AVAILABLE/IN_PROGRESS được bấm Bắt đầu học. Nội dung của đúng một item được sinh và kiểm định bằng language/runner tương ứng; thiếu quiz hoặc bài thực hành đạt QC thì contentStatus = FAILED, không phát hành nội dung chưa duyệt.

**DoD của mọi mục:** server ghi nhận nội dung lý thuyết bắt buộc đã được truy cập và các checkpoint đọc hiểu đã hoàn thành; quiz của mục có ít nhất năm câu đã kiểm định và tổng điểm ≥ 80%; bài thực hành bắt buộc đạt 100% test công khai và ẩn trên runner đúng ngôn ngữ. Riêng SQL là bài truy vấn hoặc thao tác T-SQL trên fixture có kết quả mong đợi. Chỉ sự kiện “đã đọc” do client gửi không đủ để hoàn thành mục.

Khi đủ DoD, backend khóa bản ghi roadmap, ghi bằng chứng, chuyển item hiện tại sang COMPLETED và mở đúng item kế tiếp sang AVAILABLE trong **một giao dịch**. Nộp lại cùng submissionId không chuyển trạng thái lần hai. Item LOCKED trả 409 LOCKED_ITEM kể cả gọi API trực tiếp. Trạng thái tạo nội dung PLANNED → GENERATING → READY/FAILED độc lập với trạng thái học LOCKED → AVAILABLE → IN_PROGRESS → COMPLETED. Tại mọi thời điểm, mỗi roadmap có tối đa một item chưa hoàn thành ở AVAILABLE hoặc IN_PROGRESS.

## 7. Hợp đồng hệ thống và bảo vệ dữ liệu

| API dự kiến | Mục đích | Cổng bắt buộc |
| --- | --- | --- |
| GET /api/onboarding/goals?language=... | Trả mục tiêu và nhóm tự đánh giá đúng graph. | Language thuộc bốn ngôn ngữ; graph/version hợp lệ. |
| POST /api/onboarding/survey | Lưu form hoặc nháp. | Xác thực, goalId thuộc language; không tin lời tự khai để cộng điểm. |
| POST /api/pretests | Tạo/resume attempt. | Survey hợp lệ, cooldown theo user + language, đủ 12–15 câu đã duyệt. |
| GET /api/pretests/:id; PUT /api/pretests/:id/answers | Xem đề công khai và lưu nháp. | Chủ sở hữu, phiên ACTIVE, không trả đáp án/test ẩn. |
| POST /api/pretests/:id/submit | Khóa, chấm, tạo assessment và profile. | Idempotency; xử lý expiry và lỗi hạ tầng; không đếm trùng. |
| GET /api/learner-profile?language=... | Xem điểm, confidence, nguồn bằng chứng và UNKNOWN. | Chỉ chủ sở hữu, đúng language. |
| POST /api/roadmaps; GET /api/roadmaps/:id | Tạo/xem **chỉ mục**. | Assessment hợp lệ cùng user + language + goal; không sinh nội dung. |
| POST /api/roadmaps/:id/items/:itemId/start | Sinh nội dung đúng một mục. | Chủ sở hữu; item AVAILABLE/IN_PROGRESS; một job/idempotency. |
| POST /api/roadmaps/:id/items/:itemId/complete | Xét DoD từ bằng chứng server rồi mở mục tiếp. | Không nhận điểm/flag hoàn thành tự khai; giao dịch tuần tự. |

Tất cả ID từ client được kiểm tra định dạng và quyền sở hữu. Prompt, code và truy vấn có giới hạn kích thước; runner cô lập, giới hạn thời gian/tài nguyên và không dùng dữ liệu sản xuất làm fixture. Không trả đáp án chuẩn, reference solution hay test ẩn qua API học viên. SQL chỉ phát hành câu và bài thực hành đã chạy đúng chuẩn T-SQL; không âm thầm chuyển sang SQLite.

## 8. Kịch bản kiểm tra hợp đồng

| Kịch bản | Kết quả bắt buộc |
| --- | --- |
| Python: hai câu độc lập cùng PY-BASICS-01, một đúng và một sai, cùng trọng số | masteryScore = 0,50; confidence = 0,84; trạng thái DEVELOPING. |
| JavaScript: một câu áp dụng và một bài MCODE khác đã pass cùng JS-VAR-01 | confidence = 0,84; nếu masteryScore ≥ 0,75 thì PROFICIENT; không cộng bài nộp JavaScript vào hồ sơ Python. |
| C++: người học tự khai đã vững nhưng code CPP-FUNC-01 compile lỗi hợp lệ | Điểm thực hành 0, không tự nâng PROFICIENT; tiền đề chưa vững nằm trước mục nâng cao. |
| SQL: đề hoặc bài dùng TOP/fixture T-SQL | Chỉ phát hành khi runner T-SQL xác minh lời giải và test; SQLite không được xác nhận thay. |
| Bỏ trống/hết giờ/lỗi hạ tầng | Câu bỏ trống không tạo bằng chứng; lỗi chấm không thành điểm 0 hoặc kích hoạt cooldown. |
| Không đủ câu đã kiểm định | PRETEST_UNAVAILABLE; không tạo đề thiếu câu hoặc bài kiểm tra dùng sai ngôn ngữ. |
| Cố mở item 2 khi item 1 chưa COMPLETED | HTTP 409 LOCKED_ITEM; không tạo job/nội dung item 2. |
| Item 1 đạt DoD rồi gửi lại cùng submissionId từ hai thiết bị | Item 1 COMPLETED một lần, chỉ item 2 AVAILABLE; item 3 LOCKED và chưa có nội dung. |

## 9. Ranh giới và đầu ra Giai đoạn 0

1. Không tạo hàng loạt lý thuyết, quiz hay bài thực hành khi tạo roadmap; chỉ mục metadata được tạo lúc đó.
2. Không tin cờ hoàn thành, điểm quiz hay kết quả test do client tự khai; chỉ bằng chứng server xác minh mở khóa.
3. Không dùng lời tự khai, bằng chứng ngôn ngữ khác hoặc fallback graph/runner để cấp PROFICIENT hay bỏ qua tiền đề.

**Đầu ra của Giai đoạn 0:** bốn cấu hình mục tiêu và gateway được đối chiếu graph; hợp đồng khảo sát/đề/chấm/hồ sơ/roadmap; công thức điểm bao phủ mọi trường hợp; quyết định T-SQL; chính sách cooldown; bất biến mở khóa; bảng kịch bản nghiệm thu. Việc viết ngân hàng câu, xây runner T-SQL, migration và UI thuộc các giai đoạn triển khai tiếp theo.
