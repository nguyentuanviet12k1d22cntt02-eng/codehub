import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const writeCrlf = (relative, text) => fs.writeFileSync(path.join(root, relative), text.replace(/\r?\n/g, '\r\n'));

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

const lessons = [
  {
    lessonId: 'LS-03.01', title: 'Lặp theo số lần với for và range()',
    objective: 'Hiểu tư duy lặp và viết vòng lặp for khi biết trước số lượt.',
    keyKnowledge: 'Cú pháp for, range(stop), range(start, stop), range(start, stop, step).',
    difficulty: 'Dễ', durationMinutes: 30, file: 'Lession1.md',
    exercises: [
      ex('In lời chào N lần', 'EASY', 'Nhập số nguyên dương `n`. In dòng `Xin chào Python` đúng `n` lần, mỗi lần trên một dòng.', 'n = int(input())\nfor _ in range(n):\n    print("Xin chào Python")', [tc('3\n', 'Xin chào Python\nXin chào Python\nXin chào Python\n'), tc('1\n', 'Xin chào Python\n', true)], ['Lấy ký tự áp chót']),
      ex('In các số từ 1 đến N', 'EASY', 'Nhập số nguyên dương `n`. Dùng `for` và `range()` để in các số từ 1 đến `n`, mỗi số trên một dòng.', 'n = int(input())\nfor so in range(1, n + 1):\n    print(so)', [tc('5\n', '1\n2\n3\n4\n5\n'), tc('1\n', '1\n', true)], ['Lấy ký tự đặc trưng']),
      ex('In các số chẵn đến N', 'EASY', 'Nhập số nguyên dương `n`. In các số chẵn từ 2 đến `n`, mỗi số trên một dòng.', 'n = int(input())\nfor so in range(2, n + 1, 2):\n    print(so)', [tc('8\n', '2\n4\n6\n8\n'), tc('5\n', '2\n4\n', true)])
    ]
  },
  {
    lessonId: 'LS-03.02', title: 'Tính tổng và đếm bằng vòng lặp for',
    objective: 'Áp dụng mẫu cộng dồn, đếm và nhân dồn trong vòng lặp for.',
    keyKnowledge: 'Biến tổng, biến đếm, biến tích và kết hợp for với if.',
    difficulty: 'Dễ', durationMinutes: 35, file: 'Lession2.md',
    exercises: [
      ex('Tính tổng từ 1 đến N bằng for', 'EASY', 'Nhập số nguyên dương `n`. Tính và in tổng các số từ 1 đến `n`.', 'n = int(input())\ntong = 0\nfor so in range(1, n + 1):\n    tong += so\nprint(tong)', [tc('5\n', '15\n'), tc('1\n', '1\n', true)], ['Cắt ghép tên file']),
      ex('Đếm số chia hết cho 3', 'EASY', 'Nhập số nguyên dương `n`. Đếm các số từ 1 đến `n` chia hết cho 3 và in kết quả.', 'n = int(input())\ndem = 0\nfor so in range(1, n + 1):\n    if so % 3 == 0:\n        dem += 1\nprint(dem)', [tc('10\n', '3\n'), tc('2\n', '0\n', true)], ['Đảo ngược chuỗi']),
      ex('Tính tích từ 1 đến N', 'EASY', 'Nhập số nguyên không âm `n`. Tính tích từ 1 đến `n`. Với `n = 0`, in `1`.', 'n = int(input())\ntich = 1\nfor so in range(1, n + 1):\n    tich *= so\nprint(tich)', [tc('5\n', '120\n'), tc('0\n', '1\n', true)])
    ]
  },
  {
    lessonId: 'LS-03.03', title: 'Vòng lặp while và điều kiện dừng',
    objective: 'Viết vòng lặp while an toàn bằng ba bước khởi tạo, kiểm tra và cập nhật.',
    keyKnowledge: 'Cú pháp while, điều kiện dừng, biến chạy và giá trị báo hiệu.',
    difficulty: 'Dễ', durationMinutes: 35, file: 'Lession3.md',
    exercises: [
      ex('Đếm ngược bằng while', 'EASY', 'Nhập số nguyên dương `n`. Dùng `while` để in từ `n` về 1, mỗi số trên một dòng.', 'n = int(input())\nwhile n >= 1:\n    print(n)\n    n -= 1', [tc('4\n', '4\n3\n2\n1\n'), tc('1\n', '1\n', true)], ['Chuẩn hóa tên đăng nhập']),
      ex('Tính tổng từ 1 đến N bằng while', 'EASY', 'Nhập số nguyên dương `n`. Dùng `while` để tính tổng từ 1 đến `n`.', 'n = int(input())\ni = 1\ntong = 0\nwhile i <= n:\n    tong += i\n    i += 1\nprint(tong)', [tc('5\n', '15\n'), tc('2\n', '3\n', true)], ['Thay thế từ nhạy cảm']),
      ex('Cộng đến khi gặp 0', 'MEDIUM', 'Nhập các số nguyên, mỗi số trên một dòng. Khi gặp `0`, dừng và in tổng các số trước đó.', 'tong = 0\nso = int(input())\nwhile so != 0:\n    tong += so\n    so = int(input())\nprint(tong)', [tc('5\n3\n0\n', '8\n'), tc('-2\n7\n0\n', '5\n', true)])
    ]
  },
  {
    lessonId: 'LS-03.04', title: 'Dừng và bỏ qua với break, continue',
    objective: 'Dừng sớm hoặc bỏ qua một lượt lặp bằng break và continue.',
    keyKnowledge: 'Phân biệt break, continue và điều kiện dừng thông thường.',
    difficulty: 'Trung bình', durationMinutes: 30, file: 'Lession4.md',
    exercises: [
      ex('Tìm số chia hết cho 7 đầu tiên', 'EASY', 'Nhập `a`, `b` với `a <= b`. In số đầu tiên trong đoạn `[a, b]` chia hết cho 7. Nếu không có, in `KHONG CO`.', 'a = int(input())\nb = int(input())\ntim_thay = False\nfor so in range(a, b + 1):\n    if so % 7 == 0:\n        print(so)\n        tim_thay = True\n        break\nif not tim_thay:\n    print("KHONG CO")', [tc('10\n20\n', '14\n'), tc('1\n5\n', 'KHONG CO\n', true)], ['In hóa đơn chi tiết']),
      ex('Bỏ qua các số chia hết cho 3', 'EASY', 'In các số từ 1 đến 10 trên từng dòng, nhưng dùng `continue` để bỏ qua số chia hết cho 3.', 'for so in range(1, 11):\n    if so % 3 == 0:\n        continue\n    print(so)', [tc('', '1\n2\n4\n5\n7\n8\n10\n')], ['Tạo câu chào tự động']),
      ex('Tính tổng số dương đến khi dừng', 'MEDIUM', 'Nhập các số nguyên. Khi gặp số `0` hoặc số âm, dùng `break` để dừng và in tổng các số dương đã nhập.', 'tong = 0\nwhile True:\n    so = int(input())\n    if so <= 0:\n        break\n    tong += so\nprint(tong)', [tc('5\n10\n-1\n', '15\n'), tc('0\n', '0\n', true)])
    ]
  }
];

const forPractice = [
  ex('In lời chào N lần', 'EASY', 'Nhập `n`. In `Xin chào Python` đúng `n` lần.', 'n=int(input())\nfor _ in range(n):\n    print("Xin chào Python")', [tc('2\n','Xin chào Python\nXin chào Python\n')], ['Đảo ngược danh sách']),
  ex('In các số từ 1 đến N', 'EASY', 'Nhập `n`. In từ 1 đến `n`, mỗi số trên một dòng.', 'n=int(input())\nfor i in range(1,n+1):\n    print(i)', [tc('3\n','1\n2\n3\n')], ['Đếm ký tự nguyên âm trong chuỗi']),
  ex('In các số chẵn đến N', 'EASY', 'Nhập `n`. In các số chẵn từ 2 đến `n`.', 'n=int(input())\nfor i in range(2,n+1,2):\n    print(i)', [tc('6\n','2\n4\n6\n')], ['Đếm số lượng số chẵn và lẻ từ 1 đến n']),
  ex('Đếm ngược bằng for', 'EASY', 'Nhập `n`. In từ `n` về 1.', 'n=int(input())\nfor i in range(n,0,-1):\n    print(i)', [tc('3\n','3\n2\n1\n')], ['In bảng cửu chương']),
  ex('Tính tổng từ 1 đến N', 'EASY', 'Nhập `n`. In tổng từ 1 đến `n`.', 'n=int(input())\ntong=0\nfor i in range(1,n+1):\n    tong+=i\nprint(tong)', [tc('5\n','15\n')], ['In bảng số nguyên từ 1 đến n²']),
  ex('Tính tổng các số chẵn', 'EASY', 'Nhập `n`. In tổng số chẵn từ 1 đến `n`.', 'n=int(input())\ntong=0\nfor i in range(2,n+1,2):\n    tong+=i\nprint(tong)', [tc('10\n','30\n')], ['Kiểm tra chuỗi palindrome']),
  ex('Đếm số chia hết cho 3', 'EASY', 'Nhập `n`. Đếm số từ 1 đến `n` chia hết cho 3.', 'n=int(input())\ndem=0\nfor i in range(1,n+1):\n    if i%3==0:\n        dem+=1\nprint(dem)', [tc('10\n','3\n')], ['Kiểm tra số hoàn hảo']),
  ex('Tính tích từ 1 đến N', 'MEDIUM', 'Nhập `n >= 0`. In tích từ 1 đến `n`.', 'n=int(input())\ntich=1\nfor i in range(1,n+1):\n    tich*=i\nprint(tich)', [tc('5\n','120\n'),tc('0\n','1\n',true)], ['Tìm số Fibonacci thứ n']),
  ex('In bảng nhân của một số', 'MEDIUM', 'Nhập `n`. In bảng nhân của `n` từ 1 đến 10 theo mẫu `n x i = ket_qua`.', 'n=int(input())\nfor i in range(1,11):\n    print(f"{n} x {i} = {n*i}")', [tc('2\n','2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20\n')], ['Tìm số lớn nhất trong danh sách']),
  ex('Tổng số chia hết cho 3 hoặc 5', 'MEDIUM', 'Nhập `n`. Tính tổng số từ 1 đến `n` chia hết cho 3 hoặc 5.', 'n=int(input())\ntong=0\nfor i in range(1,n+1):\n    if i%3==0 or i%5==0:\n        tong+=i\nprint(tong)', [tc('10\n','33\n')], ['Tìm ước chung lớn nhất (GCD)']),
  ex('Đếm số chẵn dương trong đoạn', 'MEDIUM', 'Nhập `a`, `b` với `a <= b`. Đếm số chẵn dương trong `[a,b]`.', 'a=int(input())\nb=int(input())\ndem=0\nfor i in range(a,b+1):\n    if i>0 and i%2==0:\n        dem+=1\nprint(dem)', [tc('-2\n6\n','3\n')], ['Tính giai thừa']),
  ex('Tìm số chia hết cho 7 đầu tiên', 'MEDIUM', 'Nhập `a`, `b`. In số đầu tiên chia hết cho 7 hoặc `KHONG CO`.', 'a=int(input())\nb=int(input())\ntim=False\nfor i in range(a,b+1):\n    if i%7==0:\n        print(i)\n        tim=True\n        break\nif not tim:\n    print("KHONG CO")', [tc('8\n20\n','14\n'),tc('1\n5\n','KHONG CO\n',true)], ['Tính tổng các chữ số của một số']),
  ex('Đếm số lẻ trong đoạn', 'MEDIUM', 'Nhập `a`, `b`. Đếm số lẻ trong đoạn `[a,b]`.', 'a=int(input())\nb=int(input())\ndem=0\nfor i in range(a,b+1):\n    if i%2!=0:\n        dem+=1\nprint(dem)', [tc('2\n8\n','3\n')], ['Tính tổng các số chẵn']),
  ex('In bình phương từ 1 đến N', 'MEDIUM', 'Nhập `n`. Với mỗi số từ 1 đến `n`, in bình phương của số đó.', 'n=int(input())\nfor i in range(1,n+1):\n    print(i*i)', [tc('4\n','1\n4\n9\n16\n')], ['Tính tổng các số đảo ngược']),
  ex('Tính tổng trong đoạn A đến B', 'MEDIUM', 'Nhập `a`, `b` với `a <= b`. Tính tổng mọi số trong đoạn `[a,b]`.', 'a=int(input())\nb=int(input())\ntong=0\nfor i in range(a,b+1):\n    tong+=i\nprint(tong)', [tc('3\n6\n','18\n')], ['Tính tổng dãy số nhập từ người dùng'])
];

const whilePractice = [
  ex('Đếm từ 1 đến N bằng while', 'EASY', 'Nhập `n`. In từ 1 đến `n` bằng `while`.', 'n=int(input())\ni=1\nwhile i<=n:\n    print(i)\n    i+=1', [tc('3\n','1\n2\n3\n')], ['Bội chung nhỏ nhất (LCM)']),
  ex('Đếm ngược đơn giản', 'EASY', 'Nhập `n`. In từ `n` về 1 bằng `while`.', 'n=int(input())\nwhile n>=1:\n    print(n)\n    n-=1', [tc('3\n','3\n2\n1\n')], ['Đảo ngược một số nguyên']),
  ex('In số chẵn bằng while', 'EASY', 'Nhập `n`. In số chẵn từ 2 đến `n`.', 'n=int(input())\ni=2\nwhile i<=n:\n    print(i)\n    i+=2', [tc('6\n','2\n4\n6\n')], ['Dãy Fibonacci đến N']),
  ex('In bội của 5 đến N', 'EASY', 'Nhập `n`. In các bội dương của 5 không vượt quá `n`.', 'n=int(input())\ni=5\nwhile i<=n:\n    print(i)\n    i+=5', [tc('16\n','5\n10\n15\n')], ['Đếm chữ số của một số nguyên']),
  ex('Tính tổng từ 1 đến N bằng while', 'EASY', 'Nhập `n`. Tính tổng từ 1 đến `n` bằng `while`.', 'n=int(input())\ni=1\ntong=0\nwhile i<=n:\n    tong+=i\n    i+=1\nprint(tong)', [tc('5\n','15\n')], ['Đếm ngược đơn giản']),
  ex('Tính tổng số lẻ bằng while', 'EASY', 'Nhập `n`. Tính tổng số lẻ từ 1 đến `n`.', 'n=int(input())\ni=1\ntong=0\nwhile i<=n:\n    tong+=i\n    i+=2\nprint(tong)', [tc('7\n','16\n')], ['Đếm số ước của một số']),
  ex('Đếm chữ số', 'EASY', 'Nhập số nguyên dương `n`. In số chữ số của `n`.', 'n=int(input())\ndem=0\nwhile n>0:\n    dem+=1\n    n//=10\nprint(dem)', [tc('12345\n','5\n')], ['Kiểm tra số Armstrong']),
  ex('Tính tổng các chữ số', 'MEDIUM', 'Nhập số nguyên dương `n`. In tổng các chữ số.', 'n=int(input())\ntong=0\nwhile n>0:\n    tong+=n%10\n    n//=10\nprint(tong)', [tc('1234\n','10\n')], ['Kiểm tra số nguyên tố']),
  ex('Cộng đến khi gặp 0', 'MEDIUM', 'Nhập nhiều số. Gặp 0 thì dừng và in tổng các số trước đó.', 'tong=0\nso=int(input())\nwhile so!=0:\n    tong+=so\n    so=int(input())\nprint(tong)', [tc('5\n3\n0\n','8\n')], ['Kiểm tra số Palindrome (Số)']),
  ex('Đếm số dương đến khi gặp số âm', 'MEDIUM', 'Nhập nhiều số. Gặp số âm thì dừng và in số lượng giá trị dương.', 'dem=0\nso=int(input())\nwhile so>=0:\n    if so>0:\n        dem+=1\n    so=int(input())\nprint(dem)', [tc('5\n0\n2\n-1\n','2\n')], ['Nhập số đến khi gặp số âm']),
  ex('Giới hạn ba lần nhập mã PIN', 'MEDIUM', 'Mã đúng là `1234`. Cho nhập tối đa ba lần. In `DUNG` nếu đúng, nếu không in `KHOA`.', 'lan=0\ndung=False\nwhile lan<3:\n    pin=int(input())\n    lan+=1\n    if pin==1234:\n        dung=True\n        break\nprint("DUNG" if dung else "KHOA")', [tc('1111\n1234\n','DUNG\n'),tc('1\n2\n3\n','KHOA\n',true)], ['Tìm chữ số lớn nhất của một số']),
  ex('Tìm chữ số lớn nhất', 'MEDIUM', 'Nhập số nguyên dương `n`. In chữ số lớn nhất.', 'n=int(input())\nlon_nhat=0\nwhile n>0:\n    chu_so=n%10\n    if chu_so>lon_nhat:\n        lon_nhat=chu_so\n    n//=10\nprint(lon_nhat)', [tc('51823\n','8\n')], ['Tính lũy thừa (không dùng )']),
  ex('Đảo ngược số nguyên', 'MEDIUM', 'Nhập số nguyên dương `n`. In số có các chữ số đảo ngược.', 'n=int(input())\ndao=0\nwhile n>0:\n    dao=dao*10+n%10\n    n//=10\nprint(dao)', [tc('1234\n','4321\n')], ['Tính tổng các số từ 1 đến N']),
  ex('Tính tích từ 1 đến N bằng while', 'MEDIUM', 'Nhập `n >= 0`. Tính tích từ 1 đến `n` bằng `while`.', 'n=int(input())\ni=1\ntich=1\nwhile i<=n:\n    tich*=i\n    i+=1\nprint(tich)', [tc('5\n','120\n'),tc('0\n','1\n',true)], ['Ước chung lớn nhất (GCD) - Thuật toán Euclid']),
  ex('Tìm bội của 5 đầu tiên', 'MEDIUM', 'Nhập số nguyên `a`. Tìm và in số đầu tiên lớn hơn hoặc bằng `a` chia hết cho 5.', 'a=int(input())\nwhile a%5!=0:\n    a+=1\nprint(a)', [tc('17\n','20\n')], ['Vòng lặp với số tiền rút từ ATM'])
];

const seedPath = 'backend/prisma/seed/seed_course_data.json';
const courseData = JSON.parse(read(seedPath));
const module3 = courseData.find((module) => module.moduleId === 'MOD-03');
if (!module3) throw new Error('Không tìm thấy MOD-03');
module3.objective = 'Hiểu vòng lặp theo lộ trình từ biết trước số lượt đến điều kiện dừng và điều hướng lặp.';
module3.keyKnowledge = 'Vòng lặp for với range(), mẫu cộng dồn và đếm, vòng lặp while, break và continue.';
module3.skillsAcquired = 'Viết vòng lặp có điểm dừng rõ ràng, tính tổng, đếm, lọc và dừng sớm ở các bài toán cơ bản.';
const chapter = module3.chapters.find((item) => item.chapterId === 'CH-05');
chapter.title = 'Chapter 5: Vòng lặp từ cơ bản đến điều kiện dừng';
chapter.objective = 'Xây dựng vòng lặp an toàn theo mức độ tăng dần.';
chapter.coreKnowledge = 'for, range(), cộng dồn, đếm, while, break và continue.';
chapter.skillsAcquired = 'Chọn for hoặc while phù hợp và kiểm soát chính xác điểm dừng.';

for (const definition of lessons) {
  const lesson = chapter.lessons.find((item) => item.lessonId === definition.lessonId);
  if (!lesson) throw new Error(`Không tìm thấy ${definition.lessonId}`);
  Object.assign(lesson, {
    title: definition.title,
    objective: definition.objective,
    keyKnowledge: definition.keyKnowledge,
    difficulty: definition.difficulty,
    durationMinutes: definition.durationMinutes,
    content: read(`docs/Dữ liệu nội dung bài học/Python/Cấu trúc bài học/Chapter 05/${definition.file}`).replace(/\r\n/g, '\n'),
    codingExercises: definition.exercises
  });
}

const forGroup = chapter.lessons.find((item) => item.lessonId === 'LS-03.MP_FOR');
Object.assign(forGroup, {
  title: 'Luyện tập nền tảng vòng lặp For - Module 3',
  objective: 'Củng cố for và range() theo ba mức, không dùng kiến thức của module sau.',
  keyKnowledge: 'Lặp theo số lần, cộng dồn, đếm và kết hợp điều kiện.',
  difficulty: 'Từ dễ đến trung bình', durationMinutes: 50,
  content: read('docs/Dữ liệu nội dung bài học/Python/modules/module3/btFor.md').replace(/\r\n/g, '\n'),
  codingExercises: forPractice
});
const whileGroup = chapter.lessons.find((item) => item.lessonId === 'LS-03.MP_WHILE');
Object.assign(whileGroup, {
  title: 'Luyện tập nền tảng vòng lặp While - Module 3',
  objective: 'Củng cố khởi tạo, điều kiện và cập nhật trước khi xử lý dữ liệu không biết trước số lượt.',
  keyKnowledge: 'Điều kiện dừng, cập nhật trạng thái, giá trị báo hiệu và break.',
  difficulty: 'Từ dễ đến trung bình', durationMinutes: 50,
  content: read('docs/Dữ liệu nội dung bài học/Python/modules/module3/btWhile.md').replace(/\r\n/g, '\n'),
  codingExercises: whilePractice
});
writeCrlf(seedPath, `${JSON.stringify(courseData, null, 2)}\n`);

const exercisePath = 'backend/prisma/seed/exercises_data.ts';
let exerciseSource = read(exercisePath);
const start = exerciseSource.indexOf("  'LS-03.MP_FOR': [");
const end = exerciseSource.indexOf("  'LS-04.MP': [", start);
if (start < 0 || end < 0) throw new Error('Không tìm thấy vùng bài tập Module 3');
const toTs = (value) => JSON.stringify(value, null, 2)
  .replace(/"difficulty": "(EASY|MEDIUM|HARD)"/g, '"difficulty": ExerciseDifficulty.$1');
const replacement = `  'LS-03.MP_FOR': ${toTs(forPractice)},\n  'LS-03.MP_WHILE': ${toTs(whilePractice)},\n`;
exerciseSource = exerciseSource.slice(0, start) + replacement + exerciseSource.slice(end);
writeCrlf(exercisePath, exerciseSource);

const graphPaths = [
  'ai-service/data/skill_graph.json',
  'ai-service/data/pythonSkillGraph.json',
  'backend/src/infrastructure/data/pythonSkillGraph.json',
  'frontend/src/data/pythonSkillGraph.json'
];
for (const graphPath of graphPaths) {
  const graph = JSON.parse(read(graphPath));
  Object.assign(graph.lesson_mappings, {
    'LS-03.01': 'PY-FLOW-03',
    'LS-03.02': 'PY-FLOW-03',
    'LS-03.03': 'PY-FLOW-02',
    'LS-03.04': 'PY-FLOW-04'
  });
  Object.assign(graph.lesson_title_mappings, {
    'Lặp theo số lần với for và range()': 'PY-FLOW-03',
    'Tính tổng và đếm bằng vòng lặp for': 'PY-FLOW-03',
    'Vòng lặp while và điều kiện dừng': 'PY-FLOW-02',
    'Dừng và bỏ qua với break, continue': 'PY-FLOW-04',
    'Luyện tập nền tảng vòng lặp For - Module 3': 'PY-FLOW-03',
    'Luyện tập nền tảng vòng lặp While - Module 3': 'PY-FLOW-02'
  });
  writeCrlf(graphPath, `${JSON.stringify(graph, null, 2)}\n`);
}

console.log('Đã đồng bộ nội dung Module 3, bài tập và ánh xạ kỹ năng.');
