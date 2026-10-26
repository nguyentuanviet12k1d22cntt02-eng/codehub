# Đánh giá và kế hoạch bổ sung minh chứng theo góp ý giảng viên hướng dẫn

Ngày đối chiếu: 26/10/2026. Đề tài: hệ thống học lập trình thích ứng dựa trên PAL-Net của Nguyễn Tuấn Việt. Mốc Git đã kiểm tra: `a9c519ff943534274581466ab45b0a13ae2bc57d`; thư mục làm việc có nhiều thay đổi chưa commit, vì vậy HEAD chưa đại diện toàn bộ sản phẩm hiện tại.

## 1. Kết luận và phạm vi đánh giá

**Dự án đã đủ cơ sở để viết báo cáo giai đoạn 2 giải trình phần lớn góp ý về triển khai, quy trình thực nghiệm và giới hạn của kết luận. Chưa đủ cơ sở để khẳng định PAL-Net đã cải thiện kết quả học tập của người dùng thật hoặc đã hoàn tất triển khai thích ứng bằng mô hình trên hệ thống vận hành.**

Điểm cần làm trước là hợp nhất minh chứng và sửa tính nhất quán của thực nghiệm. Không cần mở rộng thêm chức năng Multi-Agent/LLM để trả lời các góp ý hiện tại. Cần tách ba kết quả: dự đoán câu trả lời trong benchmark, kiểm thử chức năng thích ứng của sản phẩm, và tác động thực sự đến kết quả học tập.

Đã đọc đầy đủ nội dung văn bản, bảng và kiểm tra phần comment của [báo cáo giai đoạn 1](Bao_Cao_Tien_Do_Thuc_Tap_Tot_Nghiep_Nguyen_Tuan_Viet.docx), [góp ý](GÓP%20Ý.docx), đồng thời đối chiếu mã nguồn, Git, JSON kết quả, CSV và các phần liên quan trong [báo cáo tổng hợp hiện tại](../Bao_Cao_Thực%20Tập.docx). Đây là đánh giá nội dung và truy vết kỹ thuật; chưa đánh giá bố cục in Word, chưa huấn luyện lại, chưa kiểm thử dịch vụ trực tiếp hoặc xác nhận website đang hoạt động tại ngày đối chiếu.

Báo cáo giai đoạn 1 ghi ngày 29/09/2026 và hạn hoàn thành 15/10/2026. Ngày đối chiếu đã qua hạn đó. Báo cáo mới cần ghi đúng ngày thực hiện và kỳ báo cáo; xác nhận lại hạn nộp với giảng viên, không đưa công việc tháng 10 vào giai đoạn 1 hoặc ghi lùi ngày. Lịch bên dưới dùng ngày làm việc tương đối, không giả định trường đã gia hạn.

## 2. Đối chiếu năm góp ý

| Góp ý | Cơ sở đã tìm thấy | Mức đáp ứng hiện tại | Minh chứng cần bổ sung |
| --- | --- | --- | --- |
| Git history, mã nguồn, demo | Có commit sau 29/09, mã nguồn ba dịch vụ và grader; có biên bản kiểm thử và ảnh của một số luồng | Có cơ sở nhưng chưa thành bộ hồ sơ thống nhất | Bảng công việc → commit/diff → file → ca kiểm thử → ảnh/video; tách thay đổi chưa commit |
| Kết quả thực nghiệm PAL-Net | Có ASSISTments G1–G3 và kết quả notebook BKT/DKT/PAL-Net cho ba ngôn ngữ | Có kết quả; bộ mô phỏng đang lệch phiên bản | Bảng kết quả có nguồn, split, seed, checksum, giới hạn; đồng bộ dataset–graph–notebook–báo cáo |
| Quy trình train/test, đánh giá, so sánh trước khi mở rộng LLM | Có protocol, split theo người học, lựa chọn bằng validation, prediction, checkpoint, ablation và CI trong G3 | Khá đầy đủ cho benchmark; cần làm rõ trong báo cáo | Sơ đồ quy trình, bảng cấu hình, kiểm tra không rò rỉ, gói tái lập; ưu tiên phần này trước phụ lục LLM |
| Thận trọng về cold-start, mã độc, Golden Zone | Báo cáo tổng hợp hiện tại đã có nhiều đoạn sửa theo hướng thận trọng | Đã cải thiện nhưng cần gắn minh chứng và rà soát toàn bộ hồ sơ | Bảng câu cũ → câu sửa → cơ sở; kiểm thử riêng cold-start/sandbox; Golden Zone ghi là giả thuyết chưa xác nhận |
| Hoàn thiện, kiểm thử, triển khai, đánh giá thích ứng cốt lõi | Có Pre-test, hồ sơ kỹ năng, lộ trình ưu tiên kỹ năng yếu, mở khóa tuần tự; có PAL-Net pilot riêng | Đã có sản phẩm để demo; chưa chứng minh hiệu quả học tập và PAL-Net vận hành chính thức | Quay luồng đầu vào → đề xuất → nộp bài → cập nhật → mở khóa; log policy/model/fallback; kiểm tra bản triển khai thực tế |

## 3. Những minh chứng có thể sử dụng

### 3.1. Benchmark ASSISTments có hồ sơ truy vết

Nguồn: [protocol](../../research/palnet/protocol.md), [báo cáo G3](../../research/palnet/assistments_g3_report.md), [kết quả test gốc](../../../ai-service/data/external/assistments_2009_2010/g2_final_test_result.json) và [phân tích G3](../../../ai-service/data/external/assistments_2009_2010/g3_final_analysis.json).

Run `final-g2-20261005T182731Z` lưu 769 người học test, 38.553 event được chấm; tập development/train cuối có 3.076 người học. Protocol mô tả giữ riêng 20% người học test, 5 fold development theo người học và bootstrap 2.000 lần theo người học. G3 có thêm baseline đơn giản, PAL-Net không graph và PAL-Net không history.

| Mô hình | AUC | RMSE | F1 |
| --- | ---: | ---: | ---: |
| BKT | 0,6901 | 0,4456 | 0,8138 |
| DKT-LSTM | 0,7580 | 0,4254 | 0,8190 |
| PAL-Net | 0,7517 | 0,4267 | 0,8211 |
| PAL-Net không graph | 0,7588 | 0,4241 | 0,8213 |

Được phép kết luận: PAL-Net đã được huấn luyện và so sánh trong thiết lập benchmark này; PAL-Net không đứng đầu về AUC. Không suy từ F1 nhỉnh hơn sang kết luận tốt hơn toàn diện. Dữ liệu ASSISTments thuộc học toán, không chứng minh chất lượng học lập trình hay hiệu quả chính sách gợi ý trong sản phẩm.

Đối chiếu tại ngày kiểm tra: 9 tệp đầu vào/truy vết của G3 gồm dataset, split, config, config lock, development summary, final result, latency, run record và analysis script đều tồn tại, có SHA-256 trùng provenance. Prediction, checkpoint/tham số và result của cả 7 mô hình cũng tồn tại. Đây là kiểm tra tồn tại và checksum các tệp nêu trên, chưa phải chạy lại training hoặc xác minh lại toàn bộ phép tính metric.

### 3.2. Kết quả mô phỏng trên bài tập thật phải giữ nhãn nguồn

[Tài liệu so sánh ba mô hình](../../research/palnet/three_model_synthetic_courses.md) và 9 `report.json` trong `ai-service/outputs/notebook_fair_kt/{language}/seed_{seed}/` lưu kết quả với 60 người học mô phỏng mỗi ngôn ngữ, chia 40 train, 10 validation, 10 test. Đã kiểm tra ba tập người học không giao nhau ở cả 9 report. Ba seed là `20261013`, `20261014`, `20261015`.

| Ngôn ngữ | AUC BKT trung bình | AUC DKT trung bình | AUC PAL-Net trung bình |
| --- | ---: | ---: | ---: |
| Python | 0,5863 | 0,5354 | 0,6449 |
| JavaScript | 0,5921 | 0,5183 | 0,6338 |
| C++ | 0,5673 | 0,5353 | 0,6167 |

Các số trên thuộc **kết quả đã lưu của bộ 60 người học**, không phải kết quả của dữ liệu hiện tại có 300 người. Danh mục bài tập lấy từ database thật; danh tính, hành vi, đúng/sai, thời gian và lỗi của người học được mô phỏng. Chỉ trình bày kết quả cũ như một thí nghiệm lịch sử khi khôi phục được đúng snapshot và khóa nguồn; chưa gắn chúng cho bộ dữ liệu mới.

### 3.3. Thích ứng cốt lõi có thể chứng minh bằng chức năng

Nguồn: [biên bản Pre-test → roadmap](../../research/palnet/python_basics_roadmap_pilot_2026-10-06.md), `backend/src/modules/onboarding/pretestProfile.ts`, `roadmapPlanner.ts`, `roadmapRuntimeService.ts`, `roadmapCompletionEvidence.ts`, và các kiểm thử tương ứng trong `backend/tests/`.

Biên bản ngày 06/10 ghi Pre-test 12 câu, lưu hồ sơ 9 kỹ năng và roadmap Python Basics 26 bài. Mã hiện tại xác nhận policy `WEAK_SKILL` hoặc `CURRICULUM_ORDER`, `modelVersion: null` và fallback có tên. Đây là cơ sở cho cá nhân hóa dựa trên bằng chứng và quy tắc; không nên gọi roadmap đó là kết quả suy luận PAL-Net.

[Serving registry](../../../ai-service/models/serving/registry.json) hiện có `models: {}`. `ai-service/main.py` kiểm tra readiness và trả HTTP 410 cho `/recommend` cũ. Đồng thời vẫn có đường PAL-Net pilot riêng tại `ai-service/app/api/module_practice_pilot.py` và adapter `backend/src/modules/courses/modulePracticeRecommendation.ts`, dùng engine `PALNET_SYNTHETIC_LOCAL_PILOT` hoặc `PALNET_SYNTHETIC_MULTILINGUAL_PILOT`. Vì vậy cần mô tả chính xác: **roadmap dùng quy tắc; PAL-Net có thí nghiệm/pilot dùng mô phỏng; chưa có model được đăng ký phục vụ chính thức qua registry**. Trạng thái endpoint trên máy/server phải đo trực tiếp trước khi ghi là đang triển khai.

### 3.4. Git và sandbox có nguồn trực tiếp

Các commit sau mốc giai đoạn 1 đã đối chiếu bằng `git log`:

| Commit | Ngày theo Git | Nội dung ghi trong commit |
| --- | --- | --- |
| `22fd610` | 09/10/2026 | Mở rộng adaptive learning và training telemetry |
| `c5ca2d2` | 16/10/2026 | Kích hoạt artifact PAL-Net pilot tương thích |
| `2a73be8` | 16/10/2026 | Thêm practice pilot JavaScript và C++ |
| `06f0325` | 19/10/2026 | Thêm dịch vụ AWS Docker grading |
| `5a88fba` | 22/10/2026 | Chuyển thực thi bài tập sang EC2 Docker |
| `a9c519f` | 22/10/2026 | Đồng bộ nhãn EC2 sandbox khi chấm bài |

Tên commit là chỉ mục tra cứu. Khi lập phụ lục chính thức phải xem diff, tác giả và kết quả kiểm thử của từng commit; không dùng tên commit để thay bằng chứng hành vi hoặc suy ra tác giả cá nhân.

[Grader README](../../../grader-service/README.md), `grader-service/app/executor.py` và `grader-service/tests/test_docker_e2e.py` có cơ chế cô lập mạng, filesystem chỉ đọc, UID không đặc quyền, giới hạn tài nguyên, timeout và dọn container. Đó là cơ sở thiết kế và ca kiểm thử sẵn có; chưa phải bằng chứng các ca đã được chạy lại ngày 26/10. [Biên bản 24/10](../../../reviews/ai-pipeline/reliability-report-2026-10-24.md) có kết quả thực thi EC2 thực tế và ảnh chấm bài, nhưng không thay thế biên bản kiểm thử an toàn đầy đủ.

## 4. Các thiếu sót cần xử lý trước khi nộp

### 4.1. Dataset mới và kết quả cũ đang không cùng phiên bản

Đã đếm trực tiếp CSV và kiểm tra checksum khớp metadata hiện tại:

| Ngôn ngữ | Người học hiện tại | Lượt mô phỏng hiện tại | Bài trong catalog theo metadata | Người học trong mỗi report cũ |
| --- | ---: | ---: | ---: | ---: |
| Python | 300 | 32.943 | 322 | 60 |
| JavaScript | 300 | 19.063 | 547 | 60 |
| C++ | 300 | 19.267 | 48 | 60 |

Ba notebook vẫn chia mỗi nhóm hành vi bằng `ids[:8]`, `ids[8:10]`, `ids[10:12]`. Khi mỗi nhóm có 60 người, hàm chỉ lấy 12; tổng mỗi seed còn 60/300 người, bỏ 240 người. Không được chỉ bấm Run All rồi gọi là thực nghiệm trên toàn bộ 300 người.

Notebook JavaScript vẫn trỏ `javascriptSkillGraph.v3.0.0.json`, C++ trỏ `cppSkillGraph.v4.0.0.json`; checksum không khớp metadata mới tương ứng graph `3.2.0` và `4.1.0`. Theo mã kiểm tra hiện có, `load_course` sẽ từ chối nguồn không khớp. Python không có sai khác graph checksum trong kiểm tra này. Báo cáo tổng hợp và tài liệu so sánh vẫn mô tả bộ 60 người cùng catalog cũ, nên cần đồng bộ cả bảng và biểu đồ.

**Phương án ưu tiên:** đóng băng bộ mới, thống nhất graph và mapping, sửa split theo tỷ lệ đã khóa, bảo đảm bao phủ toàn bộ người học, huấn luyện/đánh giá lại và lưu run mới. Không ghi đè artifact cũ. Nếu không đủ thời gian, chọn hồ sơ ASSISTments làm kết quả chính; bộ mô phỏng 60 người chỉ dùng khi khôi phục được snapshot đúng, còn bộ 300 người ghi rõ chưa hoàn thành đánh giá. Tuyệt đối không lấy số đếm bộ mới ghép metric bộ cũ.

### 4.2. Báo cáo và mã vận hành còn mô tả không nhất quán

Một đoạn báo cáo tổng hợp vẫn ghi backend gửi mã sang Judge0, trong khi mã và commit gần đây chuyển sang EC2 Docker. Cần rà soát đồng bộ sơ đồ kiến trúc, tên dịch vụ, cấu hình tài nguyên và mô tả luồng. Giới hạn 4 worker trong báo cáo giai đoạn 1 không tự chứng minh cấu hình hiện tại; grader README khuyến nghị concurrency 1 cho máy EC2 1 GiB. Đo hoặc chụp cấu hình thực tế trước khi ghi con số.

Hồ sơ G5 ngày 06/10 ghi `NOT_READY / NO_CAUSAL_RESULT`. Các kiểm kê database ngày 06/10 hoặc lúc xuất catalog là snapshot lịch sử, không phải số người học hiện tại. Cần kiểm kê read-only mới nếu muốn nêu lượng dữ liệu thật hiện nay. Không xem log QA, demo hay tài khoản seed là một cohort học viên thực nghiệm.

### 4.3. Ba câu cần sửa và cách chứng minh

| Cách nêu ở giai đoạn 1 | Câu đề xuất cho báo cáo mới | Minh chứng và giới hạn |
| --- | --- | --- |
| Pre-test 5 câu giải quyết triệt để cold-start | Pre-test cung cấp bằng chứng ban đầu để xây dựng hồ sơ kỹ năng; kỹ năng chưa quan sát vẫn giữ trạng thái chưa biết và hệ thống có quy tắc dự phòng | Ảnh trước/sau Pre-test, assessment, score/confidence/evidenceCount, ca bỏ trống và thiếu bằng chứng; cập nhật đúng số câu thực tế, không giữ 5 nếu demo dùng 12 |
| Sandbox ngăn chặn mã độc can thiệp máy chủ | Sandbox cô lập và hạn chế tài nguyên để giảm rủi ro khi thực thi mã không tin cậy; kết quả chỉ áp dụng cho cấu hình và ca đã kiểm thử | Ca timeout, vượt RAM, truy cập mạng, ghi filesystem, giới hạn tiến trình/output, dọn container; không tuyên bố an toàn tuyệt đối |
| Golden Zone 0,70–0,85 là khoảng tối ưu | Khoảng xác suất làm đúng 0,70–0,85 là tham số chính sách đề xuất, chưa được xác nhận tối ưu trong nghiên cứu này | Định nghĩa rõ P(correct), tách khỏi mastery; tài liệu lý thuyết có thể giải thích động cơ nhưng không thay thực nghiệm xác nhận chính xác hai ngưỡng |

Không cần tổ chức thí nghiệm mới chỉ để bảo vệ một ngưỡng chưa có cơ sở. Có thể công khai giới hạn và chuyển kiểm định ngưỡng sang hướng phát triển tiếp theo. Nếu bổ sung tài liệu tham khảo ngoài repository, phải kiểm tra nguồn gốc và nội dung thật trước khi trích dẫn; kế hoạch này không coi các nguồn bên ngoài là đã xác minh.

## 5. Kế hoạch ưu tiên theo ngày làm việc

Ước lượng 5–7 ngày làm việc cho đóng gói kỹ thuật và báo cáo, phụ thuộc thời gian train và tình trạng server. Đây không phải thời lượng đủ cho nghiên cứu hiệu quả học tập dài hạn. Người thực hiện chính là sinh viên; nhờ giảng viên/đơn vị thực tập hỗ trợ chốt phạm vi, ngân hàng đánh giá và tuyển người học nếu triển khai nghiên cứu tiếp.

| Thứ tự | Thời lượng dự kiến | Việc làm | Sản phẩm | Điều kiện hoàn thành |
| --- | --- | --- | --- | --- |
| P0.1 | Ngày 1 | Chốt phạm vi kỳ báo cáo; chọn dataset/snapshot; lập bảng phản hồi đủ 5 góp ý; kiểm kê Git và thay đổi chưa commit | Danh mục nguồn và ma trận truy vết | Mỗi nhận định có nguồn hoặc nhãn chưa xác minh; không ghi lùi ngày |
| P0.2 | Ngày 1–2 | Đồng bộ dataset–graph–catalog; sửa split; khóa cấu hình trước khi đánh giá bộ mới | Manifest, split, config và run ID mới | Checksum đúng; train/val/test rời nhau; hợp bằng toàn bộ 300 người nếu chọn bộ mới |
| P0.3 | Ngày 2–3 | Train và đánh giá BKT/DKT/PAL-Net cùng dữ liệu/split; tổng hợp metric và giới hạn; giữ ASSISTments thành bảng riêng | Bảng kết quả, loss curve, ROC/calibration, predictions, checkpoints | Cùng event/nhãn; chỉ chọn bằng validation; mọi số trong báo cáo truy ra artifact |
| P0.4 | Ngày 3–4 | Kiểm tra luồng Pre-test → hồ sơ → roadmap → nộp bài → mở khóa; phân biệt rule/pilot/model chính thức | Biên bản E2E, ảnh và log quyết định | Đúng người học/ngôn ngữ; prerequisite hợp lệ; đúng một mục mở; ghi rõ policy/model/fallback |
| P0.5 | Ngày 4–5 | Kiểm tra môi trường triển khai và ca sandbox đã định nghĩa; ghi failure mode và latency | Biên bản build/deploy, health/readiness, báo cáo test | Bản demo gắn commit/snapshot; không chạy code ở backend ngoài sandbox; mọi kết quả có ngày/môi trường |
| P1.1 | Ngày 5–6 | Chụp 6–8 hình, quay demo 5–8 phút, xuất Git evidence; sửa câu khẳng định và kiến trúc cũ | Bộ minh chứng có chú thích và video | Có luồng thích ứng đầy đủ; hiển thị rõ pilot/fallback; không lộ bí mật/đáp án ẩn |
| P1.2 | Ngày 6–7 | Viết báo cáo giai đoạn 2 theo 5 mục cô yêu cầu; kiểm tra chéo số liệu với báo cáo tổng hợp và slide | Báo cáo giai đoạn 2 và phụ lục giải trình | Không còn dữ liệu/metric khác phiên bản; tất cả góp ý được trả lời |
| P2 | Sau khi chốt đề cương nghiên cứu và có người học | Pilot thu thập dữ liệu thật; nếu muốn kết luận tác động thì thiết kế đối chứng và đánh giá độc lập | Dataset thật và báo cáo giới hạn hoặc nghiên cứu tác động | Không suy hiệu quả học tập từ AUC, demo hoặc synthetic; cỡ mẫu do thiết kế nghiên cứu quyết định |

Các ngưỡng 500 người học/10.000 first-attempt trong protocol là cổng lựa chọn mô hình triển khai của dự án; không phải cỡ mẫu mặc định cho mọi nghiên cứu pre/post. Một pilot nhỏ có thể báo tính khả thi và lỗi hệ thống, nhưng không tự đủ để kết luận tác động hoặc tổng quát hóa. Retention ngày 30 chỉ báo khi đã theo dõi đủ, không hứa hoàn tất trong lịch 5–7 ngày.

### 5.1. Checklist nhỏ và phép kiểm tra tương ứng

Mỗi mục dưới đây là một đơn vị thao tác dự kiến dưới 15 phút; training, render hoặc phiên demo dài được tách thành công việc chạy riêng và một mục kiểm tra kết quả. Các phép kiểm tra nhanh dùng dữ liệu cục bộ, mục tiêu mỗi lệnh dưới 5 giây; phiên training/E2E thật có thời lượng riêng và không giả là unit test nhanh.

- [ ] Chốt danh sách nguồn và hash. Kiểm tra: mọi đường dẫn nguồn tồn tại; mỗi artifact được dùng có hash và ngày.
- [ ] Xuất Git log từ 30/09 đến ngày chốt, kèm author và ngày. Kiểm tra: mỗi commit trong bảng có thể mở bằng `git show`.
- [ ] Xuất diff thống kê và diff theo các chức năng được báo cáo. Kiểm tra: file được nêu có trong diff; tách rõ committed/working tree.
- [ ] Chọn duy nhất snapshot cho bảng mô phỏng chính. Kiểm tra: số người, event và catalog trong manifest khớp dữ liệu.
- [ ] Thống nhất graph và mapping cho JavaScript/C++. Kiểm tra: checksum graph thực tế bằng metadata, skill tham chiếu đều tồn tại.
- [ ] Thay split cố định bằng cách chia tỷ lệ đã công bố. Kiểm tra: `train ∩ val = train ∩ test = val ∩ test = ∅` và `train ∪ val ∪ test = all_users`.
- [ ] Khóa cấu hình, seed, chọn checkpoint và metric trước test bộ mới. Kiểm tra: config có ID/hash; không có lựa chọn siêu tham số dựa vào test.
- [ ] Kiểm tra đặc trưng nhân quả. Kiểm tra: thay nhãn event t không làm đổi đầu vào/dự đoán trước event t; đặc trưng thống kê và graph học từ dữ liệu chỉ dùng phạm vi train theo giao thức.
- [ ] Tạo lệnh/phiên chạy training riêng có output mới. Kiểm tra: không ghi đè run cũ; failure được ghi nhận.
- [ ] Kiểm tra prediction của ba mô hình. Kiểm tra: cùng event ID và label; xác suất hữu hạn trong [0,1].
- [ ] Tổng hợp chỉ số và biểu đồ từ artifact đã khóa. Kiểm tra: số trong bảng/ảnh trùng JSON, metric không xác định ghi NA.
- [ ] Lập bảng đối chiếu ASSISTments. Kiểm tra: giữ nguyên kết quả bất lợi cho PAL-Net, không trộn với ba khóa lập trình.
- [ ] Chuẩn bị hai hồ sơ đầu vào khác nhau cho demo. Kiểm tra: bằng chứng đánh giá khác nhau; chỉ so thứ tự ở nhánh đã đủ điều kiện, không ép bài nền phải khác nhau.
- [ ] Lập các ca E2E ở mục 6. Kiểm tra: mỗi ca có input, expected, actual, trace và môi trường.
- [ ] Kiểm tra chế độ model/policy của bản demo. Kiểm tra: log có engine, modelVersion hoặc null và lý do fallback thực tế.
- [ ] Đọc/chạy kiểm thử sandbox trên môi trường kiểm thử dành riêng theo kịch bản có sẵn. Kiểm tra: không dùng máy chủ sản xuất để thử tải/tấn công; mỗi ca đối chiếu đúng giới hạn cấu hình.
- [ ] Chụp ảnh và quay demo sau khi chức năng đạt. Kiểm tra: ảnh khớp phiên bản, video chạy được và đọc được nội dung.
- [ ] Sửa ba khẳng định và mô tả Judge0/EC2. Kiểm tra: tìm lại toàn văn báo cáo, slide và README liên quan; không còn mâu thuẫn chưa giải thích.
- [ ] Viết ma trận phản hồi cuối. Kiểm tra: đủ 5 góp ý, mỗi hàng có vị trí sửa và mã minh chứng.
- [ ] Kiểm tra báo cáo giai đoạn 2. Kiểm tra: đủ 5 mục giảng viên yêu cầu; hình/bảng/video truy được nguồn.

## 6. Bộ ca demo ưu tiên cho phần thích ứng

| Mã | Kịch bản | Kỳ vọng cần quan sát |
| --- | --- | --- |
| AD-01 | Tài khoản mới, chưa có bằng chứng | Không tự coi thiếu dữ liệu là yếu hoặc thành thạo; có Pre-test/chẩn đoán hoặc fallback rõ ràng |
| AD-02 | Hai người học có kết quả Pre-test khác nhau | Hồ sơ kỹ năng và lý do ưu tiên khác nhau ở các nhánh đủ điều kiện; bài nền bắt buộc có thể giống nhau |
| AD-03 | Học viên bỏ trống câu đánh giá | Không tự biến bỏ trống thành bằng chứng đã làm sai; trạng thái chưa quan sát được giải thích |
| AD-04 | Gửi bài sai rồi sửa đúng | Kết quả chấm lưu đúng người, kỹ năng/ngôn ngữ; cập nhật trạng thái theo quy tắc thật, không cộng trùng |
| AD-05 | Chỉ một bài tập trong lesson đạt, sau đó toàn bộ bài đạt | Chưa mở sớm; khi đủ bằng chứng thì mở đúng mục kế tiếp theo contract hiện hành |
| AD-06 | Gửi yêu cầu lặp và truy cập bằng người dùng khác | Không tạo hồ sơ/lộ trình/cộng điểm trùng; không đọc hoặc sửa dữ liệu người khác |
| AD-07 | AI/model không sẵn sàng hoặc hash sai | Dừng hoặc fallback có tên; không trình bày trọng số chưa hợp lệ như model đã train sẵn sàng |
| AD-08 | Tách roadmap và PAL-Net practice pilot | Roadmap ghi rule/model null; pilot ghi engine mô phỏng và giới hạn; không gộp hai cơ chế |

Đo latency model-only, API gợi ý, chấm code và LLM ở các nhóm riêng. Nếu báo p50/p95 thì ghi số lượt, điều kiện warm-up/cold-start, phần cứng và tải đồng thời. Không dùng một trace thành công hoặc thời gian model-only để tuyên bố SLA toàn hệ thống dưới 150 ms.

## 7. Cấu trúc bộ minh chứng dự kiến

Thư mục đề xuất: `docs/bao_cao/minh_chung_giai_doan_2/`. Cấu trúc dưới đây là kế hoạch đầu ra, chưa phải các tệp đã được tạo hoặc các ca đã đạt.

```text
minh_chung_giai_doan_2/
  00_danh_muc_va_ma_tran_gop_y.md
  01_git/             # log, diff, author, HEAD, working-tree manifest
  02_ma_nguon/        # bảng file-hàm-dòng, phiên bản và trích đoạn cần thiết
  03_du_lieu/         # nguồn, số đếm, split, graph/mapping, checksum
  04_thuc_nghiem/     # config, run, log, prediction, metric, hình
  05_kiem_thu/        # expected/actual, trace, môi trường và lỗi còn lại
  06_demo/            # hình có chú thích, video và kịch bản
  07_trien_khai/      # build/snapshot, health, model-status và smoke test
  08_giai_trinh/      # câu cũ-câu mới, vị trí sửa và giới hạn
```

Quy ước một dòng minh chứng: `Mã | Góp ý | Nhận định | Nguồn | Commit/snapshot | Ngày/môi trường | Expected | Actual | Giới hạn`. Một ảnh nên trả lời một câu hỏi cụ thể. Ví dụ: “MC-AD05: chỉ mục 1 đang mở, mục 2 mở sau khi tất cả bài tập của mục 1 đạt; trace …; policy WEAK_SKILL; modelVersion null”.

## 8. Dàn ý báo cáo giai đoạn 2 đúng yêu cầu cô

1. **Công việc từ sau giai đoạn 1 đến hiện tại:** trình bày theo nhóm nghiên cứu mô hình, dữ liệu, thích ứng, chấm code/triển khai; ghi thời gian và chỉ ra Git evidence. Không chỉ liệt kê tính năng mới.
2. **Kết quả và sản phẩm:** bảng PAL-Net/BKT/DKT, protocol, tập dữ liệu, demo luồng thích ứng, kết quả kiểm thử và tình trạng triển khai. Multi-Agent/LLM đặt sau nội dung cốt lõi hoặc trong phụ lục.
3. **Điều chỉnh so với giai đoạn 1:** nêu thay đổi cold-start, bảo mật, Golden Zone; giải thích roadmap rule và PAL-Net pilot; giải trình bộ dữ liệu và graph đổi phiên bản.
4. **Khó khăn và hỗ trợ cần thiết:** thiếu dữ liệu người học thật, ngân hàng post-test độc lập, xác nhận mapping nội dung, tình trạng triển khai; nhờ cô chốt mức kết luận và hỗ trợ tuyển mẫu nếu nghiên cứu tiếp.
5. **Sản phẩm cuối dự kiến:** source có phiên bản, hệ thống demo tái lập, báo cáo mô hình và giới hạn, bộ kiểm thử, hướng dẫn triển khai, slide/video. Thí nghiệm chưa hoàn thành ghi rõ trạng thái và điều kiện tiếp tục.

Đoạn giải trình có thể dùng sau khi đối chiếu lại số liệu cuối:

> Sau góp ý giai đoạn 1, em tập trung làm rõ quy trình đánh giá thành phần thích ứng và bổ sung khả năng truy vết từ dữ liệu đến kết quả mô hình. Dự án đã có thực nghiệm so sánh BKT, DKT và PAL-Net, đồng thời có luồng đánh giá đầu vào và xây dựng lộ trình dựa trên bằng chứng kỹ năng. Em phân biệt kết quả benchmark, lịch sử mô phỏng và chức năng của sản phẩm; chưa kết luận PAL-Net cải thiện kết quả học tập của người dùng thật. Các phát biểu về cold-start, an toàn thực thi mã và Golden Zone được điều chỉnh theo phạm vi minh chứng hiện có.

## 9. Điều kiện chốt hồ sơ

- [ ] Đủ 5 hàng giải trình góp ý, có vị trí sửa cụ thể trong báo cáo mới.
- [ ] Không ghép số đếm 300 người với kết quả mô hình 60 người.
- [ ] Notebook dùng graph/catalog/dataset khớp nhau; split không bỏ người ngoài chủ đích.
- [ ] Mỗi bảng metric có dataset, nguồn dữ liệu, seed, split, config và artifact.
- [ ] Nêu cả kết quả PAL-Net không đứng đầu trên ASSISTments và giới hạn mô phỏng.
- [ ] Có minh chứng phần thích ứng từ đầu vào đến mở khóa và fallback; trạng thái model được nói đúng.
- [ ] Kiểm thử an toàn có phạm vi, cấu hình và kết quả; không dùng tuyên bố tuyệt đối.
- [ ] Demo triển khai gắn đúng snapshot; trạng thái live được đo tại ngày quay.
- [ ] Báo cáo, slide, hình kiến trúc thống nhất EC2/runner và số liệu thực nghiệm.
- [ ] Ngày thực hiện/hạn nộp đúng thực tế; mục chưa hoàn tất được ghi rõ.

**Thứ tự hành động đề xuất:** đồng bộ thí nghiệm → hoàn thiện truy vết Git → kiểm thử và quay luồng thích ứng → cập nhật báo cáo giai đoạn 2. Nghiên cứu trên người học thật là phần cần bổ sung nếu mục tiêu cuối bao gồm khẳng định hiệu quả giáo dục, không nên thay bằng việc thêm tính năng LLM.
