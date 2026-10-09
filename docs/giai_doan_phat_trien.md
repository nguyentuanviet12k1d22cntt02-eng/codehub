# Các giai đoạn phát triển Pre-test, Learner Profile và roadmap

**Tài liệu nền:** [Kế hoạch chức năng](ke_hoach.md), [đặc tả Giai đoạn 0](dac_ta_giai_doan_0.md) và hợp đồng thực thi `.agent/specs/current-task.md`.

**Trạng thái:** Giai đoạn 0 đã đặc tả; Giai đoạn 1 và 2 đã triển khai, trong đó Giai đoạn 2 đã nghiệm thu trên Supabase. Giai đoạn 3–7 là kế hoạch triển khai.

## 1. Quy tắc xuyên suốt

Luồng bắt buộc cho một roadmap mới:

`Chọn ngôn ngữ → Khảo sát → Pre-test đã nộp và chấm hợp lệ → Learner Profile → Chỉ mục roadmap → Học từng mục theo thứ tự`.

Phạm vi hoàn thành là **Python, JavaScript, C++ và SQL**. Mỗi ngôn ngữ dùng graph, mục tiêu, ngân hàng câu, runner và bằng chứng riêng. Phát triển adapter theo thứ tự kỹ thuật được phép, nhưng mốc phát hành chức năng yêu cầu cả bốn luồng đạt nghiệm thu. `C` có trong enum bài nộp nhưng chưa có skill graph và nội dung khóa học; nếu công bố roadmap C, phải bổ sung hai tài sản này và kiểm định runner C trước khi bật lựa chọn.

- Roadmap ban đầu chỉ chứa **metadata của các mục**. Không sinh sẵn lý thuyết, quiz, bài tập của bất kỳ mục nào.
- Chỉ mục đầu tiên có thể bắt đầu. Mục `n + 1` chỉ mở sau khi server xác nhận mục `n` đã hoàn thành đủ yêu cầu. Tại một thời điểm chỉ có tối đa một mục chưa hoàn thành được mở.
- Khi học viên chọn **Bắt đầu học** ở mục đang mở, hệ thống mới tạo và kiểm định nội dung cho đúng mục đó. `READY` là nội dung đã sẵn sàng; `COMPLETED` là người học đã đạt yêu cầu. Hai trạng thái này độc lập.
- Pre-test và lời tự khai có thể làm thay đổi **những mục được đưa vào roadmap của ngôn ngữ đã chọn**, nhưng không tự hoàn thành hoặc mở khóa một mục đã nằm trong roadmap. Không dùng điểm hoặc graph của ngôn ngữ khác để lấp thiếu dữ liệu.
- Bài nộp, chấm điểm, cập nhật hồ sơ và mở khóa phải có bằng chứng lưu trên server. Gửi lại yêu cầu hoặc gọi API trực tiếp không được tạo kết quả khác.

## 2. Bản đồ giai đoạn

| Giai đoạn | Mục tiêu | Đầu ra có thể kiểm tra | Phụ thuộc |
| --- | --- | --- | --- |
| 0. Chốt hợp đồng sản phẩm — đã đặc tả | Chốt luật chung và cấu hình riêng cho từng ngôn ngữ. | Mục tiêu, gateway skills, blueprint đề, rubric, trạng thái và API cho cả bốn ngôn ngữ. | Kế hoạch hiện tại. |
| 1. Nền tảng dữ liệu | Lưu trạng thái khảo sát, Pre-test, hồ sơ, roadmap. | Migration và hợp đồng dữ liệu có phiên bản. | Giai đoạn 0. |
| 2. Khảo sát đầu vào | Thu mục tiêu và tín hiệu chọn đề. | Form có lưu nháp, đối chiếu tiến độ MCODE. | Giai đoạn 1. |
| 3. Tạo và làm Pre-test | Phát hành đề phù hợp với ngôn ngữ và nhận bài làm. | Đề đã kiểm định theo đúng runner, phiên làm bài tiếp tục được. | Giai đoạn 2. |
| 4. Chấm và tạo Learner Profile | Chấm có căn cứ, xử lý thiếu dữ liệu. | Báo cáo năng lực theo kỹ năng. | Giai đoạn 3. |
| 5. Tạo chỉ mục roadmap | Xếp mục học theo kỹ năng và tiền đề. | Roadmap metadata, chỉ mục đầu mở khóa. | Giai đoạn 4. |
| 6. Tạo nội dung và mở khóa tuần tự | Tạo nội dung khi được yêu cầu, xác nhận hoàn thành. | Học được mục 1 rồi mở mục 2; API chặn nhảy cóc. | Giai đoạn 5. |
| 7. Cập nhật và phát hành | Cập nhật hồ sơ, điều chỉnh phần chưa học, kiểm tra toàn luồng ở cả bốn ngôn ngữ. | Bản dùng thử có báo cáo lỗi, bằng chứng kiểm định theo ngôn ngữ. | Giai đoạn 6. |

Mỗi giai đoạn chỉ được coi là xong khi đạt các điều kiện nghiệm thu bên dưới. Có thể chuẩn bị nội dung và giao diện song song, nhưng không phát hành bước sau khi dữ liệu và luật của bước trước chưa ổn định.

## Giai đoạn 0 — Chốt hợp đồng sản phẩm và đánh giá

**Mục tiêu:** biến ý tưởng thành quy tắc rõ để frontend, backend và AI cùng thực hiện một cách.

**Kết quả:** Đã hoàn thành ở mức đặc tả trong [docs/dac_ta_giai_doan_0.md](dac_ta_giai_doan_0.md) và `.agent/specs/current-task.md`. Hai tài liệu này là đầu vào của Giai đoạn 1; ngân hàng câu, runner T-SQL, migration và giao diện chưa được triển khai.

### Việc cần làm

1. Lập bảng ánh xạ mục tiêu học → `skillId`, gateway skills và các tiền đề cho **cả bốn graph**: `pythonSkillGraph.json`, `javascriptSkillGraph.json`, `cppSkillGraph.json`, `sqlSkillGraph.json`. Mỗi ngôn ngữ có tập mục tiêu và gateway riêng.
2. Chốt phiên bản form khảo sát, các nhánh câu hỏi **theo ngôn ngữ**, câu “đã học xong lộ trình MCODE của ngôn ngữ này chưa?” và cách đối chiếu tiến độ thật với lời tự khai.
3. Chốt blueprint Pre-test theo từng ngôn ngữ: số câu/thời lượng, tỷ lệ câu khái niệm/đọc code hoặc truy vấn/sửa lỗi/bài thực hành, tiêu chí đủ bằng chứng cho từng kỹ năng và chính sách làm lại. Với SQL có 7 skills, 12–15 câu phải phân bổ nhiều câu cho một số skills thay vì giả định có 12 gateway khác nhau.
4. Chốt rubric chấm câu mở, cách tính điểm theo kỹ năng, độ tin cậy, ngưỡng `NEEDS_FOUNDATION`/`DEVELOPING`/`PROFICIENT`, quy tắc `UNKNOWN`.
5. Chốt **định nghĩa hoàn thành một mục**: nội dung nào bắt buộc, quiz bao nhiêu điểm, bài code nào phải vượt test; cách xử lý mục chỉ có lý thuyết, lỗi hạ tầng và lần nộp chưa đạt.
6. Viết hợp đồng trạng thái và API có `language` xuyên suốt, bao gồm hành vi `409 LOCKED_ITEM`, retry, idempotency và định dạng lỗi có thể hiển thị cho học viên. Kiểm tra server từ chối `skillId` không thuộc graph đã chọn; không fallback sang Python.
7. Đối chiếu giáo trình SQL Server/T-SQL với runner SQL hiện dùng SQLite; đã chọn T-SQL làm chuẩn, vì vậy phải có runner tương thích T-SQL trước khi phát hành câu SQL thực hành.

**Đầu ra:** đặc tả luật chung, bảng kỹ năng/mục tiêu/gateway và rubric mẫu cho từng ngôn ngữ, kèm ví dụ chấm người mới, người đã học MCODE và người học bên ngoài trong ít nhất một tình huống cho mỗi ngôn ngữ.

**Nghiệm thu:** một người triển khai độc lập có thể xác định từ đặc tả khi nào một kỹ năng thuộc đúng graph là `UNKNOWN`, khi nào mục được hoàn thành, và khi nào mục kế tiếp mở ở cả Python, JavaScript, C++ và SQL; không cần suy đoán từ câu trả lời AI.

## Giai đoạn 1 — Nền tảng dữ liệu và hợp đồng API

**Mục tiêu:** tạo trạng thái bền vững trước khi dựng giao diện hoặc gọi AI.

**Trạng thái triển khai ngày 04/10/2026:** Đã cập nhật schema Prisma, hợp đồng TypeScript và bộ kiểm tra cô lập. Migration được kiểm tra hai lần liên tiếp trên PostgreSQL 18 tạm, sau đó baseline migration gốc và triển khai thành công lên Supabase; `prisma migrate status` xác nhận database đã đồng bộ. Bộ nghiệm thu Supabase đạt cho Python, JavaScript, C++ và SQL, gồm kiểm tra cleanup theo số dòng trước/sau. Fixture năng lực do script cũ tạo trên tài khoản admin đã được audit, xóa theo phê duyệt và audit lại xác nhận không còn.

Các ràng buộc đã bổ sung gồm: tối đa một attempt `ACTIVE` cho mỗi người học/ngôn ngữ; tối đa một roadmap item ở `AVAILABLE`/`IN_PROGRESS`; composite foreign key chống trộn user/language/goal/attempt; từ chối C trong các bảng roadmap; lưu `questionVersion`/`rubricVersion`; bảng bằng chứng checkpoint, quiz, public/hidden tests; idempotency theo `user + scope + key + requestHash`.

### Việc cần làm

1. Thiết kế migration Prisma cho khảo sát, phiên Pre-test, bản chụp đề và đáp án, kết quả chấm, Learner Profile theo **người học + ngôn ngữ**, `Roadmap` và `RoadmapItem`; lưu `language` trên từng attempt, câu hỏi, assessment và roadmap để chống trộn dữ liệu.
2. Lưu `surveyVersion`, `questionVersion`, `rubricVersion`, `graphVersion`, `profileVersion` và nguồn bằng chứng để đọc lại kết quả cũ sau khi cập nhật thuật toán.
3. Tạo ràng buộc quan hệ/chỉ mục cho quyền sở hữu, thứ tự mục, ID bài nộp duy nhất và job tạo nội dung duy nhất theo `roadmapItemId`.
4. Định nghĩa hai máy trạng thái: `learningStatus = LOCKED | AVAILABLE | IN_PROGRESS | COMPLETED` và `contentStatus = PLANNED | GENERATING | READY | FAILED`; mọi truy vấn hồ sơ/roadmap lọc đúng ngôn ngữ.
5. Tách dữ liệu chỉ mục khỏi `PersonalizedLesson` hiện tại; chỉ liên kết đến nội dung đã kiểm định sau khi tạo theo yêu cầu.

**Vùng mã dự kiến:** `backend/prisma/schema.prisma`, migrations mới, module backend mới cho onboarding/assessment/roadmap, kiểu dữ liệu dùng chung phía frontend.

**Nghiệm thu:** migration tạo được và không làm mất dữ liệu hiện có; không thể có hai item cùng `orderIndex` trong một roadmap; đề đã công bố không đổi khi câu hỏi gốc được sửa; hồ sơ Python không nhận bằng chứng JavaScript/C++/SQL; một roadmap mới có đúng một mục `AVAILABLE` và phần còn lại `LOCKED`.

## Giai đoạn 2 — Khảo sát đầu vào

**Mục tiêu:** có tín hiệu chọn đề mà không nhầm tự đánh giá với năng lực đã chứng minh.

### Việc cần làm

1. Dựng màn khảo sát sau khi người học chọn tạo roadmap: chọn một trong bốn ngôn ngữ, rồi hiển thị mục tiêu, module/khái niệm và kinh nghiệm phù hợp với ngôn ngữ đó, lịch sử học MCODE và quỹ thời gian.
2. Cho lưu nháp, quay lại sửa và hiển thị tiến độ hoàn thành form; kiểm tra câu trả lời theo phiên bản form.
3. Backend đọc `Enrollment`, `LessonProgress`, `Submission` và bằng chứng năng lực đã xác thực **của khóa/ngôn ngữ được chọn** để gắn nhãn `VERIFIED` hay `SELF_REPORTED` cho dữ liệu liên quan.
4. Chỉ cho bắt đầu Pre-test sau khi các câu bắt buộc của khảo sát hợp lệ. Hiển thị rõ rằng khảo sát dùng để chọn đề, không phải điểm năng lực.

**Vùng mã dự kiến:** màn mới trong `frontend/src/features/`, module backend khảo sát, truy vấn tiến độ khóa học hiện có.

**Nghiệm thu:** form của cả bốn ngôn ngữ chỉ hiển thị nhóm kỹ năng tương ứng; học viên nói “đã hoàn thành MCODE” nhưng không có dữ liệu đúng ngôn ngữ được ghi là tự khai; người dùng khác không đọc/sửa được khảo sát; lưu nháp rồi mở lại không mất câu trả lời.

### Cập nhật thực thi — 2026-10-04

- Đã có module `backend/src/modules/onboarding/` và Survey Wizard 5 bước tại `frontend/src/features/onboarding/`. API trả đúng `surveyId`, `DRAFT_SAVED` hoặc `READY_FOR_PRETEST`, cùng snapshot đối chiếu MCODE có kiểu dữ liệu dùng chung ở hai phía.
- Backend kiểm tra version form, enum, `goalId`, module ID và mức tự đánh giá 1–3 trước khi ghi dữ liệu. Module lạ hoặc thiếu tự đánh giá khi nộp chính thức bị từ chối.
- Đối chiếu MCODE ưu tiên dữ liệu thực tế hơn lời khai, xét từng khóa riêng biệt: 80% là `VERIFIED_ACTIVITY`, 100% hoặc chứng chỉ là `VERIFIED_COURSE_COMPLETION`; lời khai `NEVER_ENROLLED` mâu thuẫn không làm mất dữ liệu đã xác minh.
- `backend/scripts/verify_stage2_survey.ts` đã kiểm tra cả bốn đồ thị, chống tự khai khống, lưu nháp, quyền sở hữu, payload sai, ngưỡng 80%/100% và dọn toàn bộ fixture sau khi chạy thành công trên Supabase.

## Giai đoạn 3 — Đề Pre-test và trải nghiệm làm bài

**Mục tiêu:** phát hành đề đúng phạm vi kỹ năng và lưu bài làm ổn định.

### Việc cần làm

1. Xây ngân hàng câu mẫu **cho từng ngôn ngữ** có `language`, `skillId`, độ khó, loại câu, đáp án/rubric, test case và phiên bản. Ưu tiên câu đã duyệt cho bản đầu.
2. Tạo bộ chọn đề từ khảo sát, đồ thị kỹ năng đúng ngôn ngữ và bằng chứng cũ cùng ngôn ngữ: kiểm tra khoảng trống quan trọng, đi từ tiên quyết đến mục tiêu, giới hạn độ dài đề.
3. Nếu AI tạo biến thể mới, bắt buộc kiểm tra cấu trúc, đáp án, test case bằng runner tương ứng và chất lượng câu trước khi phát hành; SQL phải qua kiểm định dialect đã chốt. Đề không hợp lệ phải bị loại.
4. Dựng màn làm bài: câu hỏi, editor Python/JavaScript/C++ hoặc editor truy vấn SQL khi cần, tiến độ, lưu nháp, khôi phục phiên, nộp bài một lần; dữ liệu đáp án/test ẩn không được gửi về trình duyệt.
5. Chốt bản chụp đề tại lúc bắt đầu để việc chấm không thay đổi nếu ngân hàng câu được cập nhật.
6. Áp dụng thời gian làm bài và cooldown làm lại theo **người học + ngôn ngữ**; một phiên ở ngôn ngữ khác không chặn khởi tạo Pre-test mới.

**Vùng mã dự kiến:** module backend Pre-test, màn Pre-test trong frontend, dịch vụ AI chọn/tạo/kiểm định câu hỏi khi cần.

**Nghiệm thu:** ở cả bốn ngôn ngữ, mọi câu trong đề gắn kỹ năng thuộc đúng graph và chạy bằng đúng runner; học viên có thể rời trang rồi tiếp tục; cùng một phiên không nhận bài sau khi đã nộp; không thể đọc đáp án hay test ẩn từ API học viên.

## Giai đoạn 4 — Chấm bài và khởi tạo Learner Profile

**Mục tiêu:** biến bài nộp thành hồ sơ năng lực có căn cứ và độ tin cậy.

### Việc cần làm

1. Chấm câu khách quan theo đáp án lưu trên server; chấm code Python/JavaScript/C++ hoặc truy vấn SQL bằng runner đúng ngôn ngữ và test đã kiểm định; AI đánh giá câu mở theo rubric và đưa phản hồi có dẫn chứng.
2. Ghi từng kết quả, lỗi hạ tầng, nhận xét, phiên bản rubric/model và trace. Chấm lại cùng `submissionId` phải trả cùng kết quả, không cộng điểm hai lần.
3. Tính điểm/độ tin cậy theo cặp `language + skillId`, hợp nhất bằng chứng Pre-test với bài nộp MCODE đã xác thực cùng ngôn ngữ; lời tự khai chỉ ảnh hưởng chọn đề.
4. Với kỹ năng không đủ câu, bỏ trống hoặc lỗi chấm, lưu `UNKNOWN` và đề nghị kiểm tra bổ sung thay vì gán điểm 0.
5. Dựng màn kết quả: điểm mạnh, khoảng trống, mức độ tin cậy, giải thích từng nhận định và liên kết xem lại bài.

**Vùng mã dự kiến:** chính sách mastery ở backend, `backend/src/modules/recommendations/`, sandbox/AI pipeline hiện có, màn Learner Profile mới.

**Nghiệm thu:** cả bốn ngôn ngữ có báo cáo theo đúng graph; người mới không có điểm năng lực giả; code/truy vấn sai không được AI nhận xét thành đạt; lỗi AI/runner không tạo roadmap từ kết quả chưa hợp lệ; mỗi kết luận có nguồn bằng chứng hoặc nhãn `UNKNOWN`.

## Giai đoạn 5 — Tạo chỉ mục roadmap

**Mục tiêu:** lập thứ tự học cá nhân hóa mà chưa sinh nội dung bài học.

### Việc cần làm

1. Chỉ nhận yêu cầu tạo roadmap khi có khảo sát và Pre-test đã nộp, chấm hợp lệ cho cùng người học/ngôn ngữ; snapshot `profileVersion` và `graphVersion`.
2. Chọn kỹ năng mục tiêu thuộc graph đã chọn, thêm tiền đề chưa vững, bỏ kỹ năng đã đủ bằng chứng nếu phù hợp, sắp thứ tự theo DAG **của ngôn ngữ đó** và chia thành mục có thể hoàn thành.
3. Với mỗi mục, lưu tiêu đề, mục tiêu, `skillId`, lý do đề xuất, tiền đề, ước lượng công sức; không lưu lý thuyết, quiz, bài tập.
4. Khởi tạo mục đầu `AVAILABLE`, các mục sau `LOCKED`, mọi mục `contentStatus = PLANNED` và `contentId = null`.
5. Dựng màn chỉ mục cho phép xem toàn tuyến, trạng thái khóa và mục đang học; nút **Bắt đầu học** chỉ hiện/hoạt động ở mục được mở.

**Vùng mã dự kiến:** module roadmap mới ở backend, skill graph trong `ai-service/data/`, trang roadmap frontend. Có thể dùng thuật toán xác định thứ tự ở backend hoặc AI service, nhưng kết quả phải được server kiểm tra lại theo graph.

**Nghiệm thu:** roadmap của cả bốn ngôn ngữ không có chu trình, skill lẫn ngôn ngữ hay tiền đề đứng sau; không có bản ghi `PersonalizedLesson` mới ở bước tạo chỉ mục; gọi API bắt đầu mục thứ hai khi mục đầu chưa xong bị từ chối.

## Giai đoạn 6 — Nội dung theo yêu cầu và mở khóa tuần tự

**Mục tiêu:** người học hoàn thành mục hiện tại rồi mới được học mục kế tiếp.

### Việc cần làm

1. Endpoint **Bắt đầu học** kiểm tra chủ sở hữu và `learningStatus`. Mục `LOCKED` trả lỗi ngay cả khi người dùng gửi ID trực tiếp; mục `AVAILABLE` chuyển sang `IN_PROGRESS` và tạo job cho đúng item.
2. Tái dùng pipeline tạo bài học/bài tập đã kiểm định của dự án cho đúng `language + skillId`; chỉ gắn nội dung vào item sau khi cổng kiểm định đúng runner đạt. Với SQL, bài thực hành là truy vấn trên fixture và bộ kết quả ẩn theo dialect đã chốt. Lỗi tạo nội dung giữ `contentStatus = FAILED`, cho retry cùng item, không mở khóa mục sau.
3. Quy định và lưu các hoạt động bắt buộc của item: học nội dung, quiz đạt ngưỡng, bài code/thực hành bắt buộc đạt. Không nhận cờ “đã học xong” do client tự gửi làm bằng chứng.
4. Khi đạt toàn bộ tiêu chí, giao dịch server cập nhật item hiện tại thành `COMPLETED`, ghi `completedAt` và bằng chứng, mở đúng item kế tiếp thành `AVAILABLE`; nếu là mục cuối, hoàn thành roadmap.
5. Tạo cơ chế chống trùng cho thao tác bắt đầu/nộp bài; yêu cầu song song không tạo hai job, hai lần hoàn thành hoặc mở nhiều mục.
6. Giao diện hiển thị rõ điều kiện còn thiếu, trạng thái tạo nội dung và nút thử lại khi lỗi; mục đã hoàn thành vẫn xem lại được.

**Vùng mã dự kiến:** module roadmap backend, `backend/src/modules/adaptive/`, `backend/src/modules/learning-path/`, frontend workspace/lesson viewer.

**Nghiệm thu:** lặp lại luồng mục 1 → mục 2 cho Python, JavaScript, C++ và SQL: nộp chưa đạt thì mục 2 vẫn khóa, nộp đạt thì chỉ mục 2 mở; không thể nhảy mục bằng URL hoặc API; nội dung mục 3 chưa hề được tạo; nộp lặp không thay đổi trạng thái thêm lần nữa.

## Giai đoạn 7 — Cập nhật hồ sơ, kiểm thử toàn luồng và phát hành

**Mục tiêu:** giữ roadmap đúng khi năng lực thay đổi và đưa chức năng vào dùng có kiểm soát.

### Việc cần làm

1. Sau mỗi bài nộp đã xác thực, cập nhật hồ sơ theo kỹ năng và ghi phiên bản/bằng chứng mới.
2. Nếu cần điều chỉnh chỉ mục, chỉ sửa các mục chưa bắt đầu **sau** mục đang học; giữ nguyên mục đã hoàn thành, nội dung đã phát hành và thứ tự mở khóa. Lưu lý do thay đổi để học viên xem.
3. Kiểm tra các nhánh **trên từng ngôn ngữ**: người mới, đã học MCODE, trả lời khảo sát cao nhưng làm bài thấp, bỏ trống câu, lỗi AI/runner, nộp lặp, truy cập trái quyền, hai thiết bị bấm cùng lúc; kiểm tra đặc biệt T-SQL so với SQLite.
4. Đo tỷ lệ hoàn tất khảo sát/Pre-test, tỷ lệ `UNKNOWN`, thời gian chấm, thời gian tạo một mục, lỗi kiểm định và tỷ lệ vượt qua từng mục **theo ngôn ngữ**; dùng kết quả để sửa blueprint/rubric.
5. Bật thử cho nhóm nhỏ của **cả bốn ngôn ngữ**, thu phản hồi học viên/giảng viên; chỉ công bố chức năng đa ngôn ngữ sau khi cả bốn đạt cùng tiêu chí chất lượng.

**Nghiệm thu:** toàn luồng khảo sát → Pre-test → hồ sơ → chỉ mục → học mục 1 → mở mục 2 chạy được với AI và runner thật **riêng cho Python, JavaScript, C++ và SQL**; log/trace phân biệt thành công với lỗi; không có đường đi nào mở mục sau khi mục trước chưa hoàn thành.

## 3. Mốc bàn giao và cách kiểm tra

| Mốc | Sau giai đoạn | Điều người dùng có thể xem |
| --- | --- | --- |
| M1 | 2 | Hoàn thành khảo sát và xem dữ liệu đã khai/đối chiếu. |
| M2 | 4 | Làm Pre-test, xem kết quả và Learner Profile có bằng chứng cho từng ngôn ngữ. |
| M3 | 5 | Xem chỉ mục roadmap của từng ngôn ngữ với mục đầu mở và các mục sau khóa. |
| M4 | 6 | Học mục đầu, đạt yêu cầu, mở mục tiếp theo; nội dung được tạo theo yêu cầu ở cả bốn ngôn ngữ. |
| M5 | 7 | Bản dùng thử đa ngôn ngữ ổn định, có theo dõi lỗi và điều chỉnh phần chưa học. |

Các kiểm tra logic nhỏ nên chạy độc lập, mỗi lệnh dưới 5 giây theo quy tắc dự án. Kết quả giả lập chỉ chứng minh luật xử lý; bằng chứng AI và sandbox thật được ghi riêng trong kiểm tra tích hợp. Không triển khai giai đoạn tiếp theo bằng cách bỏ qua lỗi dữ liệu hoặc giả lập một lần chấm thành công.
