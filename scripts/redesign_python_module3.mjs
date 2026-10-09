import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const seedPath = path.join(root, 'backend/prisma/seed/seed_course_data.json');
const lessonDir = path.join(root, 'docs/Dữ liệu nội dung bài học/Python/Cấu trúc bài học/Chapter 05');
const crlf = (text) => text.replace(/\r?\n/g, '\r\n');
const write = (file, text) => fs.writeFileSync(file, crlf(text), 'utf8');
const tc = (input, expectedOutput, isHidden = false) => ({ input, expectedOutput, isHidden });
const ex = (title, difficulty, problemDescription, solutionCode, testCases, legacyTitles = []) => ({
  title,
  ...(legacyTitles.length ? { legacyTitles } : {}),
  difficulty,
  problemDescription,
  starterCode: '# Viết code của bạn ở đây\n',
  solutionCode,
  testCases
});

const lesson = (id, title, difficulty, duration, prerequisites, body, exercises) => ({
  lessonId: id,
  title,
  difficulty,
  durationMinutes: duration,
  isFree: true,
  objective: body.objective,
  keyKnowledge: body.knowledge,
  exercises,
  content: `---
lessonId: "${id}"
title: "${title}"
difficulty: "${difficulty}"
estimatedDuration: ${duration}
prerequisites: ${JSON.stringify(prerequisites)}
---

# ${title}

## Mục tiêu

${body.objective}

## Kiến thức chính

${body.knowledge}

## Hiểu

${body.understand}

## Làm theo

${body.guided}

## Tự làm

${body.practice}

## Vận dụng

${body.apply}
`
});

const lessons = [
  lesson(
    'LS-03.01', 'Lesson 3.1: Tại sao cần vòng lặp?', 'EASY', 25, ['LS-02.04'],
    {
      objective: 'Nhận ra những tình huống cần lặp lại thao tác và mô tả được việc cần lặp.',
      knowledge: 'Một vòng lặp giúp thực hiện cùng một công việc nhiều lần mà không sao chép câu lệnh.',
      understand: 'In lời chào 100 lần, kiểm tra 30 bài làm hoặc cộng các số từ 1 đến N đều có một việc lặp lại. Ta cần xác định: lặp việc gì và lặp bao nhiêu lần.',
      guided: 'So sánh hai cách:\n\n```python\nprint("Xin chào")\nprint("Xin chào")\nprint("Xin chào")\n```\n\nVà ý tưởng ngắn gọn: “lặp 3 lần, mỗi lần in Xin chào”. Cú pháp Python sẽ được học ở Lesson 3.3.',
      practice: '1. Chỉ ra việc lặp trong các tình huống: điểm danh 40 bạn, nhập 5 số, in bảng nhân.\n2. Viết bằng lời: chương trình cần lặp việc gì, đến khi nào dừng.',
      apply: 'Khi gặp nhiều câu lệnh giống nhau, hãy dừng lại và hỏi: “đây có phải là một việc lặp không?”'
    },
    [
      ex('Lặp lại lời chào', 'EASY', 'Nhập số nguyên dương `n`. In `Xin chào Python` đúng `n` lần, mỗi lần trên một dòng.', 'n = int(input())\nfor _ in range(n):\n    print("Xin chào Python")', [tc('3\n', 'Xin chào Python\nXin chào Python\nXin chào Python\n'), tc('1\n', 'Xin chào Python\n', true)], ['In lời chào N lần']),
      ex('In các lượt từ 1 đến N', 'EASY', 'Nhập `n`. In lần lượt các số từ 1 đến `n`, mỗi số trên một dòng.', 'n = int(input())\nfor lan in range(1, n + 1):\n    print(lan)', [tc('4\n', '1\n2\n3\n4\n'), tc('1\n', '1\n', true)], ['In các số từ 1 đến N']),
      ex('In các số chẵn đến N', 'EASY', 'Nhập `n`. In các số chẵn từ 2 đến `n`.', 'n = int(input())\nfor so in range(2, n + 1, 2):\n    print(so)', [tc('8\n', '2\n4\n6\n8\n'), tc('5\n', '2\n4\n', true)], ['In các số chẵn đến N'])
    ]
  ),
  lesson(
    'LS-03.02', 'Lesson 3.2: Tư duy vòng lặp', 'EASY', 30, ['LS-03.01'],
    {
      objective: 'Mô tả được một vòng lặp theo bốn bước: khởi tạo, điều kiện, thực hiện và cập nhật.',
      knowledge: 'Khởi tạo → kiểm tra điều kiện → thực hiện → cập nhật. Thiếu cập nhật dễ tạo vòng lặp vô hạn.',
      understand: 'Để đếm từ 1 đến 3: bắt đầu `dem = 1`; còn khi `dem <= 3` thì in; sau đó tăng `dem` lên 1.',
      guided: 'Theo dõi từng lượt bằng bảng nhỏ:\n\n| Lượt | `dem` trước khi in | Sau cập nhật |\n|---|---:|---:|\n| 1 | 1 | 2 |\n| 2 | 2 | 3 |\n| 3 | 3 | 4 |\n\nKhi `dem` là 4, điều kiện sai và vòng lặp dừng.',
      practice: '1. Điền ba giá trị còn thiếu khi đếm từ 2 đến 6, bước nhảy 2.\n2. Chỉ ra lỗi trong ý tưởng “đếm mãi nhưng quên tăng biến đếm”.',
      apply: 'Trước khi viết vòng lặp, hãy viết ra giá trị bắt đầu, điều kiện dừng và câu lệnh cập nhật.'
    },
    [
      ex('Theo dõi biến đếm', 'EASY', 'Nhập `n`. Dùng biến đếm để in từ 1 đến `n`.', 'n = int(input())\ndem = 1\nwhile dem <= n:\n    print(dem)\n    dem += 1', [tc('3\n', '1\n2\n3\n'), tc('1\n', '1\n', true)], ['Tính tổng từ 1 đến N bằng for']),
      ex('Cộng dồn theo lượt', 'EASY', 'Nhập `n`. Dùng biến `tong` để tính tổng từ 1 đến `n`.', 'n = int(input())\ntong = 0\nfor so in range(1, n + 1):\n    tong += so\nprint(tong)', [tc('4\n', '10\n'), tc('1\n', '1\n', true)], ['Đếm số chia hết cho 3']),
      ex('Tính tích theo lượt', 'EASY', 'Nhập `n >= 0`. Tính tích từ 1 đến `n`; với `n = 0`, in `1`.', 'n = int(input())\ntich = 1\nfor so in range(1, n + 1):\n    tich *= so\nprint(tich)', [tc('4\n', '24\n'), tc('0\n', '1\n', true)], ['Tính tích từ 1 đến N'])
    ]
  ),
  lesson(
    'LS-03.03', 'Lesson 3.3: Vòng lặp for và range()', 'EASY', 35, ['LS-03.02'],
    {
      objective: 'Viết được vòng lặp `for` khi biết trước số lượt lặp.',
      knowledge: '`for`, biến lặp và `range(stop)`, `range(start, stop)`, `range(start, stop, step)`.',
      understand: '`range(5)` tạo 0 đến 4; `range(1, 6)` tạo 1 đến 5. Giá trị cuối không được lấy.',
      guided: 'Ví dụ in từ 1 đến 5:\n\n```python\nfor so in range(1, 6):\n    print(so)\n```\n\nVí dụ in số chẵn:\n\n```python\nfor so in range(2, 11, 2):\n    print(so)\n```',
      practice: '1. In từ N về 1.\n2. In các bội của 3 không vượt quá N.',
      apply: 'Chọn `for` khi số lượt hoặc miền giá trị đã biết trước.'
    },
    [
      ex('Đếm ngược bằng for', 'EASY', 'Nhập `n`. Dùng `for` để in từ `n` về 1.', 'n = int(input())\nfor so in range(n, 0, -1):\n    print(so)', [tc('4\n', '4\n3\n2\n1\n'), tc('1\n', '1\n', true)], ['Đếm ngược bằng while']),
      ex('Tổng số chẵn bằng for', 'EASY', 'Nhập `n`. Tính tổng các số chẵn từ 1 đến `n`.', 'n = int(input())\ntong = 0\nfor so in range(2, n + 1, 2):\n    tong += so\nprint(tong)', [tc('10\n', '30\n'), tc('1\n', '0\n', true)], ['Tính tổng từ 1 đến N bằng while']),
      ex('In bảng nhân', 'EASY', 'Nhập `n`. In bảng nhân của `n` từ 1 đến 5 theo mẫu `n x i = ket_qua`.', 'n = int(input())\nfor i in range(1, 6):\n    print(f"{n} x {i} = {n * i}")', [tc('2\n', '2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n'), tc('1\n', '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n', true)], ['Cộng đến khi gặp 0'])
    ]
  ),
  lesson(
    'LS-03.04', 'Lesson 3.4: Vòng lặp while và điều kiện dừng', 'EASY', 35, ['LS-03.03'],
    {
      objective: 'Viết được `while` có điều kiện dừng rõ ràng và tránh vòng lặp vô hạn.',
      knowledge: '`while` phù hợp khi chưa biết trước số lượt; luôn kiểm tra khởi tạo, điều kiện và cập nhật.',
      understand: 'Trong `while`, điều kiện được kiểm tra trước mỗi lượt. Biến liên quan đến điều kiện phải thay đổi để vòng lặp có lúc dừng.',
      guided: 'Ví dụ đếm ngược:\n\n```python\nn = int(input())\nwhile n >= 1:\n    print(n)\n    n -= 1\n```\n\nNếu bỏ dòng `n -= 1`, điều kiện luôn đúng và chương trình không dừng.',
      practice: '1. In các số lẻ từ 1 đến N bằng `while`.\n2. Nhập số liên tiếp, gặp 0 thì dừng.',
      apply: 'Trước khi chạy chương trình, tự hỏi: “biến nào làm điều kiện chuyển từ đúng sang sai?”'
    },
    [
      ex('Đếm ngược bằng while', 'EASY', 'Nhập `n`. In từ `n` về 1 bằng `while`.', 'n = int(input())\nwhile n >= 1:\n    print(n)\n    n -= 1', [tc('3\n', '3\n2\n1\n'), tc('1\n', '1\n', true)], ['Tìm số chia hết cho 7 đầu tiên']),
      ex('Tổng từ 1 đến N bằng while', 'EASY', 'Nhập `n`. Dùng `while` tính tổng từ 1 đến `n`.', 'n = int(input())\ni = 1\ntong = 0\nwhile i <= n:\n    tong += i\n    i += 1\nprint(tong)', [tc('5\n', '15\n'), tc('2\n', '3\n', true)], ['Bỏ qua các số chia hết cho 3']),
      ex('Dừng khi gặp 0', 'MEDIUM', 'Nhập các số nguyên, mỗi số trên một dòng. Gặp `0` thì dừng và in tổng các số trước đó.', 'tong = 0\nso = int(input())\nwhile so != 0:\n    tong += so\n    so = int(input())\nprint(tong)', [tc('5\n3\n0\n', '8\n'), tc('-2\n7\n0\n', '5\n', true)], ['Tính tổng số dương đến khi dừng'])
    ]
  ),
  lesson(
    'LS-03.05', 'Lesson 3.5: Điều khiển vòng lặp với break và continue', 'MEDIUM', 30, ['LS-03.04'],
    {
      objective: 'Dùng `break` để dừng sớm và `continue` để bỏ qua đúng một lượt lặp.',
      knowledge: '`break` kết thúc vòng lặp gần nhất; `continue` bỏ phần còn lại của lượt hiện tại.',
      understand: 'Khi tìm thấy phần tử cần tìm, `break` tránh phải duyệt tiếp. Khi gặp giá trị không hợp lệ, `continue` cho phép bỏ qua giá trị đó.',
      guided: 'Ví dụ bỏ qua số chia hết cho 3:\n\n```python\nfor so in range(1, 8):\n    if so % 3 == 0:\n        continue\n    print(so)\n```\n\nVí dụ dừng khi gặp số âm:\n\n```python\nif so < 0:\n    break\n```',
      practice: '1. Tìm số đầu tiên chia hết cho 7 trong một đoạn.\n2. In từ 1 đến 10 nhưng bỏ qua các số chẵn.',
      apply: 'Chỉ dùng `break` khi đã xác định rõ điều kiện kết thúc sớm; không dùng nó để che một điều kiện lặp chưa đúng.'
    },
    [
      ex('Tìm số chia hết cho 7 đầu tiên', 'EASY', 'Nhập `a`, `b` với `a <= b`. In số đầu tiên trong đoạn `[a, b]` chia hết cho 7; nếu không có, in `KHONG CO`.', 'a = int(input())\nb = int(input())\nfor so in range(a, b + 1):\n    if so % 7 == 0:\n        print(so)\n        break\nelse:\n    print("KHONG CO")', [tc('10\n20\n', '14\n'), tc('1\n5\n', 'KHONG CO\n', true)]),
      ex('Bỏ qua số chẵn', 'EASY', 'Nhập `n`. In các số lẻ từ 1 đến `n` bằng `continue`.', 'n = int(input())\nfor so in range(1, n + 1):\n    if so % 2 == 0:\n        continue\n    print(so)', [tc('7\n', '1\n3\n5\n7\n'), tc('1\n', '1\n', true)])
    ]
  ),
  lesson(
    'LS-03.06', 'Lesson 3.6: Kết hợp vòng lặp với if', 'MEDIUM', 40, ['LS-03.05'],
    {
      objective: 'Dùng vòng lặp cùng `if` để lọc, đếm, tính tổng và tìm kiếm.',
      knowledge: 'Mẫu lọc điều kiện, biến đếm, biến tổng và cờ tìm kiếm.',
      understand: 'Ta duyệt từng giá trị; chỉ khi điều kiện đúng mới đếm, cộng hoặc xử lý. Đây là mẫu rất thường gặp trong bài toán dữ liệu.',
      guided: 'Ví dụ đếm số chia hết cho 3:\n\n```python\ndem = 0\nfor so in range(1, n + 1):\n    if so % 3 == 0:\n        dem += 1\n```\n\nVí dụ cộng số dương: chỉ thêm vào `tong` khi `so > 0`.',
      practice: '1. Đếm số chẵn trong đoạn A đến B.\n2. Tính tổng số chia hết cho 5 từ 1 đến N.',
      apply: 'Gạch chân điều kiện trong đề bài. Nó thường là phần thân của câu lệnh `if`.'
    },
    [
      ex('Đếm số chẵn trong đoạn', 'EASY', 'Nhập `a`, `b` với `a <= b`. Đếm các số chẵn trong đoạn `[a, b]`.', 'a = int(input())\nb = int(input())\ndem = 0\nfor so in range(a, b + 1):\n    if so % 2 == 0:\n        dem += 1\nprint(dem)', [tc('2\n8\n', '4\n'), tc('3\n3\n', '0\n', true)]),
      ex('Tổng số chia hết cho 5', 'EASY', 'Nhập `n`. Tính tổng các số từ 1 đến `n` chia hết cho 5.', 'n = int(input())\ntong = 0\nfor so in range(1, n + 1):\n    if so % 5 == 0:\n        tong += so\nprint(tong)', [tc('12\n', '15\n'), tc('4\n', '0\n', true)]),
      ex('Tìm điểm đạt đầu tiên', 'MEDIUM', 'Nhập `n`, sau đó nhập `n` điểm nguyên. In vị trí đầu tiên (tính từ 1) có điểm từ 5 trở lên; nếu không có, in `KHONG CO`.', 'n = int(input())\nfor vi_tri in range(1, n + 1):\n    diem = int(input())\n    if diem >= 5:\n        print(vi_tri)\n        break\nelse:\n    print("KHONG CO")', [tc('4\n3\n4\n7\n8\n', '3\n'), tc('2\n1\n4\n', 'KHONG CO\n', true)])
    ]
  ),
  lesson(
    'LS-03.07', 'Lesson 3.7: Vòng lặp lồng nhau', 'MEDIUM', 35, ['LS-03.06'],
    {
      objective: 'Hiểu `for` trong `for` và dùng được cho bảng, hình chữ nhật nhỏ.',
      knowledge: 'Vòng ngoài điều khiển hàng; vòng trong điều khiển cột. Bắt đầu với dữ liệu nhỏ để dễ quan sát.',
      understand: 'Nếu có 3 hàng, mỗi hàng 4 dấu sao, vòng ngoài chạy 3 lần; mỗi lần đó vòng trong in 4 dấu sao.',
      guided: 'Ví dụ hình chữ nhật 2 hàng, 3 cột:\n\n```python\nfor _ in range(2):\n    for _ in range(3):\n        print("*", end="")\n    print()\n```\n\nMỗi lần vòng trong hoàn thành, `print()` chuyển sang hàng mới.',
      practice: '1. In hình 3 hàng, 5 cột.\n2. In bảng nhân 2 đến 3, mỗi phép tính trên một dòng.',
      apply: 'Chỉ dùng lồng nhau khi đề bài thật sự có hai chiều: hàng–cột, từng nhóm–từng phần tử.'
    },
    [
      ex('In hình chữ nhật sao', 'EASY', 'Nhập `hang` và `cot`. In hình chữ nhật gồm `hang` dòng, mỗi dòng có đúng `cot` dấu `*` liền nhau.', 'hang = int(input())\ncot = int(input())\nfor _ in range(hang):\n    for _ in range(cot):\n        print("*", end="")\n    print()', [tc('2\n3\n', '***\n***\n'), tc('1\n4\n', '****\n', true)]),
      ex('Bảng nhân nhỏ', 'MEDIUM', 'Nhập `a`, `b` với `a <= b`. In bảng nhân từ `a` đến `b`, mỗi số nhân từ 1 đến 3 theo mẫu `x i = ket_qua`.', 'a = int(input())\nb = int(input())\nfor so in range(a, b + 1):\n    for i in range(1, 4):\n        print(f"{so} x {i} = {so * i}")', [tc('2\n3\n', '2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n'), tc('1\n1\n', '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n', true)])
    ]
  ),
  lesson(
    'LS-03.08', 'Lesson 3.8: Luyện tập tổng hợp và mini project', 'MEDIUM', 45, ['LS-03.07'],
    {
      objective: 'Chọn được mẫu vòng lặp phù hợp và ghép các kỹ năng đã học vào một bài toán nhỏ.',
      knowledge: 'Chọn `for` hoặc `while`; dùng `if` để lọc; dùng tổng, đếm, `break` hoặc lồng nhau khi cần.',
      understand: 'Đọc đề theo bốn câu hỏi: lặp qua cái gì, dừng lúc nào, điều kiện nào cần lọc, kết quả cần tổng/đếm/tìm gì?',
      guided: 'Ví dụ mini project “Báo cáo điểm”: nhập số học viên, duyệt từng điểm, đếm điểm đạt và cộng tổng để tính trung bình.',
      practice: 'Làm theo thứ tự: 1) in dãy số; 2) lọc và đếm; 3) bài có điều kiện dừng; 4) bài lồng nhau; 5) mini project.',
      apply: 'Mini project: **Báo cáo điểm lớp học**. Nhập `n` và `n` điểm nguyên; in số học viên đạt (điểm từ 5) và tổng điểm. Sau đó tự mở rộng: tìm điểm cao nhất.'
    },
    [
      ex('Thống kê điểm đạt', 'MEDIUM', 'Nhập `n`, sau đó nhập `n` điểm nguyên. In số điểm từ 5 trở lên, rồi in tổng điểm; mỗi kết quả trên một dòng.', 'n = int(input())\ndem_dat = 0\ntong = 0\nfor _ in range(n):\n    diem = int(input())\n    tong += diem\n    if diem >= 5:\n        dem_dat += 1\nprint(dem_dat)\nprint(tong)', [tc('4\n3\n5\n8\n4\n', '2\n20\n'), tc('1\n10\n', '1\n10\n', true)]),
      ex('Mini project: Báo cáo nhiệt độ', 'MEDIUM', 'Nhập `n`, sau đó nhập `n` nhiệt độ nguyên. In số ngày nóng (nhiệt độ từ 30 trở lên), rồi in tổng nhiệt độ.', 'n = int(input())\nngay_nong = 0\ntong = 0\nfor _ in range(n):\n    nhiet_do = int(input())\n    tong += nhiet_do\n    if nhiet_do >= 30:\n        ngay_nong += 1\nprint(ngay_nong)\nprint(tong)', [tc('5\n28\n31\n30\n25\n33\n', '3\n147\n'), tc('2\n20\n21\n', '0\n41\n', true)])
    ]
  )
];

for (const [index, definition] of lessons.entries()) {
  write(path.join(lessonDir, `Lession${index + 1}.md`), definition.content);
}

const source = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
const module3 = source.find((item) => item.moduleId === 'MOD-03');
const chapter = module3.chapters.find((item) => item.chapterId === 'CH-05');
const currentById = new Map(chapter.lessons.map((item) => [item.lessonId, item]));

module3.title = 'Module 3: Vòng lặp trong Python';
module3.objective = 'Học vòng lặp theo tiến trình hiểu vấn đề, viết được mã, tự giải bài cơ bản và vận dụng vào bài toán nhỏ.';
module3.keyKnowledge = 'Tư duy lặp, for, range(), while, break, continue, if trong vòng lặp và vòng lặp lồng nhau.';
module3.skillsAcquired = 'Chọn được vòng lặp phù hợp, tránh vòng lặp vô hạn, lọc–đếm–tính tổng–tìm kiếm và xử lý bài toán hai chiều đơn giản.';
chapter.title = 'Chapter 5: Vòng lặp trong Python';
chapter.objective = 'Đi từ hiểu nhu cầu lặp đến viết và vận dụng các mẫu vòng lặp cơ bản.';
chapter.coreKnowledge = 'Khởi tạo, điều kiện, cập nhật; for/range; while; break/continue; if; lồng nhau.';
chapter.skillsAcquired = 'Viết vòng lặp có điểm dừng rõ ràng và giải các bài toán đếm, tổng, lọc, tìm kiếm, bảng nhỏ.';

const regularLessons = lessons.map((definition, index) => ({
  ...(currentById.get(definition.lessonId) || {}),
  lessonId: definition.lessonId,
  title: definition.title,
  objective: definition.objective,
  keyKnowledge: definition.keyKnowledge,
  difficulty: definition.difficulty === 'EASY' ? 'Dễ' : 'Trung bình',
  orderIndex: index + 1,
  isFree: true,
  durationMinutes: definition.durationMinutes,
  content: definition.content,
  codingExercises: definition.exercises
}));

const forPractice = currentById.get('LS-03.MP_FOR');
const whilePractice = currentById.get('LS-03.MP_WHILE');
forPractice.orderIndex = 9;
whilePractice.orderIndex = 10;
forPractice.title = 'Luyện thêm với vòng lặp for';
whilePractice.title = 'Luyện thêm với vòng lặp while';
chapter.lessons = [...regularLessons, forPractice, whilePractice];
write(seedPath, `${JSON.stringify(source, null, 2)}\n`);

const graphPaths = [
  'ai-service/data/skill_graph.json',
  'ai-service/data/pythonSkillGraph.json',
  'backend/src/infrastructure/data/pythonSkillGraph.json',
  'frontend/src/data/pythonSkillGraph.json'
];
const skillMap = {
  'LS-03.01': 'PY-FLOW-03',
  'LS-03.02': 'PY-FLOW-03',
  'LS-03.03': 'PY-FLOW-03',
  'LS-03.04': 'PY-FLOW-02',
  'LS-03.05': 'PY-FLOW-04',
  'LS-03.06': 'PY-FLOW-01',
  'LS-03.07': 'PY-FLOW-03',
  'LS-03.08': 'PY-FLOW-03'
};
for (const relativePath of graphPaths) {
  const graphPath = path.join(root, relativePath);
  const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
  Object.assign(graph.lesson_mappings, skillMap);
  for (const item of lessons) graph.lesson_title_mappings[item.title] = skillMap[item.lessonId];
  graph.lesson_title_mappings['Luyện thêm với vòng lặp for'] = 'PY-FLOW-03';
  graph.lesson_title_mappings['Luyện thêm với vòng lặp while'] = 'PY-FLOW-02';
  write(graphPath, `${JSON.stringify(graph, null, 2)}\n`);
}

console.log('Đã thiết kế lại Module 3 thành 8 Lesson và đồng bộ dữ liệu nguồn.');
