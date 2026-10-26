const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Danh sách các bài tập Python mẫu trong CSDL (lấy từ các bài tập thật đã kiểm tra)
const EXERCISES_MAP = [
  {
    id: "95da3927-ea49-47d9-8ca4-41843864062b",
    title: "Chào hỏi người dùng",
    difficulty: "EASY",
    beginner_fails: [
      'ten = input("hay nhap ten: ")\nprint("Xin chào, [ten]!")',
      'ten = input("hay nhap ten:")\nprint("Xin chào", ten !)',
      'ten = input()\nprint("Xin chào, " + ten + " !")' // thừa dấu cách
    ],
    beginner_pass: 'ten = input("")\nprint("Xin chào, ", ten, "!", sep="")',
    inter_fails: [
      'ten = input()\nprint("Xin chào, " + ten)' // thiếu dấu chấm than
    ],
    inter_pass: 'ten = input()\nprint("Xin chào, " + ten + "!")',
    advanced_pass: 'ten = input()\nprint(f"Xin chào, {ten}!")'
  },
  {
    id: "029c70e9-ccf5-48ed-9d67-bc541aea6724",
    title: "Nhập món ăn yêu thích",
    difficulty: "EASY",
    beginner_fails: [
      'mon = input("mon an: ")\nprint("Mon an:", mon)',
      'mon = input()\nprint("Mon an yeu thich cua ban la: " + mon)' // thiếu dấu tiếng Việt
    ],
    beginner_pass: 'mon_an = input("")\nprint("Món ăn yêu thích của bạn là:", mon_an)',
    inter_fails: [
      'mon = input()\nprint("Món ăn yêu thích:", mon)' // sai chuỗi mẫu
    ],
    inter_pass: 'mon_an = input()\nprint("Món ăn yêu thích của bạn là: " + mon_an)',
    advanced_pass: 'food = input()\nprint(f"Món ăn yêu thích của bạn là: {food}")'
  },
  {
    id: "17d39d5a-7b73-4653-abec-ce7804982b39",
    title: "Tính tổng hai số thực",
    difficulty: "EASY",
    beginner_fails: [
      'a = input()\nb = input()\nprint(a + b)', // lỗi cộng chuỗi
      'a = int(input())\nb = int(input())\nprint(a + b)' // dùng int thay vì float
    ],
    beginner_pass: 'so1 = float(input(""))\nso2 = float(input(""))\ntong = so1 + so2\nprint(tong)',
    inter_fails: [
      'a = float(input())\nb = float(input())\nprint("Tong la:", a + b)' // in thừa chữ
    ],
    inter_pass: 'num1 = float(input())\nnum2 = float(input())\nprint(num1 + num2)',
    advanced_pass: 'a, b = float(input()), float(input())\nprint(a + b)'
  },
  {
    id: "40fe74a6-b7e8-4c23-9529-6c1768005d59",
    title: "Tính chu vi diện tích hình chữ nhật",
    difficulty: "EASY",
    beginner_fails: [
      'dai = input()\nrong = input()\nprint((dai+rong)*2)', // lỗi cộng chuỗi
      'dai = int(input())\nrong = int(input())\nprint(dai*rong)\nprint((dai+rong)*2)' // ngược thứ tự cv và dt
    ],
    beginner_pass: 'chieu_dai = int(input())\nchieu_rong = int(input())\nchu_vi = (chieu_dai + chieu_rong) * 2\ndien_tich = chieu_dai * chieu_rong\nprint(chu_vi)\nprint(dien_tich)',
    inter_fails: [
      'a = int(input())\nb = int(input())\np = a + b * 2\ns = a * b\nprint(p)\nprint(s)' // thiếu ngoặc tính chu vi
    ],
    inter_pass: 'cd = int(input())\ncr = int(input())\nprint((cd + cr) * 2)\nprint(cd * cr)',
    advanced_pass: 'l, w = int(input()), int(input())\nprint(f"{(l + w) * 2}\\n{l * w}")'
  },
  {
    id: "9bfc2ca5-9217-4e36-93f8-a1deabc52d46",
    title: "Tính toán chia chia lấy dư pizza",
    difficulty: "EASY",
    beginner_fails: [
      'tien = 350000\nprint(tien / 4)', // quên in phần dư
      'print(350000 // 4)\nprint(350000 % 4)' // dùng // thay vì /
    ],
    beginner_pass: 'tong_tien = 350000\nnguoi = 4\nchia_deu = tong_tien / nguoi\ndu = tong_tien % nguoi\nprint(chia_deu)\nprint(du)',
    inter_fails: [
      'print(350000 / 4)\nprint("Du:", 350000 % 4)'
    ],
    inter_pass: 'so_tien_moi_nguoi = 350000 / 4\nso_tien_du = 350000 % 4\nprint(so_tien_moi_nguoi)\nprint(so_tien_du)',
    advanced_pass: 't = 350000\nprint(t / 4)\nprint(t % 4)'
  },
  {
    id: "4f02cdc5-0400-4537-838d-c8f961df3012",
    title: "Kiểm tra thông tin đăng nhập",
    difficulty: "MEDIUM",
    beginner_fails: [
      'u = input()\np = input()\nif u = "admin" and p = "123456":\n    print("Dang nhap")', // dùng = thay vì ==
      'u = input()\np = input()\nif u == "admin":\n    if p == "123456":\n        print("Đăng nhập thành công")\n# thiếu else'
    ],
    beginner_pass: 'u = input()\np = input()\nif u == "admin":\n    if p == "123456":\n        print("Đăng nhập thành công")\n    else:\n        print("Sai thông tin")\nelse:\n    print("Sai thông tin")',
    inter_fails: [
      'u = input()\np = input()\nif u == "admin" or p == "123456":\n    print("Đăng nhập thành công")\nelse:\n    print("Sai thông tin")' // nhầm or thay vì and
    ],
    inter_pass: 'username = input()\npassword = input()\nif username == "admin" and password == "123456":\n    print("Đăng nhập thành công")\nelse:\n    print("Sai thông tin")',
    advanced_pass: 'u, p = input(), input()\nprint("Đăng nhập thành công" if u == "admin" and p == "123456" else "Sai thông tin")'
  },
  {
    id: "50544039-a6da-4dfc-879c-61f908371ced",
    title: "Kiểm tra năm nhuận",
    difficulty: "MEDIUM",
    beginner_fails: [
      'nam = int(input())\nif nam % 4 == 0:\n    print("Năm nhuận")\nelse:\n    print("Năm thường")', // thiếu điều kiện chia hết cho 100
      'nam = int(input())\nif nam % 400 == 0:\n    print("Năm nhuận")'
    ],
    beginner_pass: 'nam = int(input())\nif nam % 400 == 0:\n    print("Năm nhuận")\nelif nam % 4 == 0 and nam % 100 != 0:\n    print("Năm nhuận")\nelse:\n    print("Năm thường")',
    inter_fails: [
      'nam = int(input())\nif nam % 4 == 0 and nam % 100 == 0:\n    print("Năm nhuận")\nelse:\n    print("Năm thường")'
    ],
    inter_pass: 'year = int(input())\nif (year % 400 == 0) or (year % 4 == 0 and year % 100 != 0):\n    print("Năm nhuận")\nelse:\n    print("Năm thường")',
    advanced_pass: 'y = int(input())\nis_leap = (y % 400 == 0) or (y % 4 == 0 and y % 100 != 0)\nprint("Năm nhuận" if is_leap else "Năm thường")'
  },
  {
    id: "93fff21a-50e6-48a1-b935-bf83dcddabc2",
    title: "Tổng số chẵn bằng for",
    difficulty: "EASY",
    beginner_fails: [
      'n = int(input())\ntong = 0\nfor i in range(1, n):\n    if i % 2 == 0:\n    tong = tong + i\nprint(tong)', // lỗi Indentation
      'n = int(input())\ntong = 0\nfor i in range(1, n):\n    if i % 2 == 0:\n        tong += i\nprint(tong)' // lỗi range(1, n) thiếu n
    ],
    beginner_pass: 'n = int(input())\ntong = 0\ni = 1\nwhile i <= n:\n    if i % 2 == 0:\n        tong = tong + i\n    i = i + 1\nprint(tong)',
    inter_fails: [
      'n = int(input())\ntong = 0\nfor i in range(1, n + 1):\n    if i % 2 == 1:\n        tong += i\nprint(tong)' // tính nhầm tổng lẻ
    ],
    inter_pass: 'n = int(input())\ntong = 0\nfor so in range(2, n + 1, 2):\n    tong += so\nprint(tong)',
    advanced_pass: 'n = int(input())\nprint(sum(range(2, n + 1, 2)))'
  },
  {
    id: "b4e62eee-a7b3-4c72-8409-d473244f507a",
    title: "In bảng nhân",
    difficulty: "EASY",
    beginner_fails: [
      'n = int(input())\nfor i in range(1, 5):\n    print(n, "x", i, "=", n*i)', // thiếu 1 phép nhân (1-5 thay vì 1-6)
      'n = int(input())\ni = 1\nwhile i <= 5:\n    print(f"{n} x {i} = {n*i}")' // quên i += 1 gây lặp vô tận
    ],
    beginner_pass: 'n = int(input())\ni = 1\nwhile i <= 5:\n    print(str(n) + " x " + str(i) + " = " + str(n * i))\n    i += 1',
    inter_fails: [
      'n = int(input())\nfor i in range(0, 6):\n    print(f"{n} x {i} = {n * i}")' // chạy từ 0 thay vì 1
    ],
    inter_pass: 'n = int(input())\nfor i in range(1, 6):\n    print(f"{n} x {i} = {n * i}")',
    advanced_pass: 'n = int(input())\nfor i in range(1, 6):\n    print(f"{n} x {i} = {n * i}")'
  },
  {
    id: "0bd771f1-8b93-48d4-a210-600f83a54f61",
    title: "Đếm ngược bằng while",
    difficulty: "EASY",
    beginner_fails: [
      'n = int(input())\nwhile n > 1:\n    print(n)\n    n -= 1', // thiếu in số 1
      'n = int(input())\nwhile n >= 1:\n    print(n)' // quên n -= 1
    ],
    beginner_pass: 'n = int(input())\nwhile n >= 1:\n    print(n)\n    n = n - 1',
    inter_fails: [
      'n = int(input())\nwhile n > 0:\n    n -= 1\n    print(n)' // giảm trước khi in
    ],
    inter_pass: 'n = int(input())\nwhile n >= 1:\n    print(n)\n    n -= 1',
    advanced_pass: 'n = int(input())\nwhile n:\n    print(n)\n    n -= 1'
  },
  {
    id: "e64a265d-efaa-4075-846b-8c8d659d06ff",
    title: "Tổng từ 1 đến N bằng while",
    difficulty: "EASY",
    beginner_fails: [
      'n = int(input())\ntong = 0\nwhile n > 0:\n    tong += n\nprint(tong)', // thiếu n -= 1
      'n = int(input())\ni = 1\ntong = 0\nwhile i < n:\n    tong += i\n    i += 1\nprint(tong)' // thiếu dấu =
    ],
    beginner_pass: 'n = int(input())\ni = 1\ntong = 0\nwhile i <= n:\n    tong += i\n    i += 1\nprint(tong)',
    inter_fails: [
      'n = int(input())\ni = 0\ntong = 0\nwhile i <= n:\n    i += 1\n    tong += i\nprint(tong)' // cộng sai thứ tự
    ],
    inter_pass: 'n = int(input())\ntong = 0\ni = 1\nwhile i <= n:\n    tong += i\n    i += 1\nprint(tong)',
    advanced_pass: 'n = int(input())\nprint(n * (n + 1) // 2)' // dùng công thức toán học O(1)
  },
  {
    id: "b02b9df3-f3b0-4d24-b2fe-f2fd30becfc9",
    title: "In hình chữ nhật sao",
    difficulty: "EASY",
    beginner_fails: [
      'hang = int(input())\ncot = int(input())\nfor i in range(hang):\n    print("*")', // in mỗi sao 1 dòng
      'hang = int(input())\ncot = int(input())\nfor i in range(hang):\n    print("*" * cot)' // không dùng vòng lặp lồng
    ],
    beginner_pass: 'h = int(input())\nc = int(input())\nfor i in range(h):\n    for j in range(c):\n        print("*", end="")\n    print()',
    inter_fails: [
      'hang = int(input())\ncot = int(input())\nfor i in range(hang):\n    for j in range(cot):\n        print("*")\n    print()' // thiếu end=""
    ],
    inter_pass: 'hang = int(input())\ncot = int(input())\nfor _ in range(hang):\n    for _ in range(cot):\n        print("*", end="")\n    print()',
    advanced_pass: 'r, c = int(input()), int(input())\nfor _ in range(r):\n    print("*" * c)'
  },
  {
    id: "094deb05-580e-4e82-a715-e7830c9b42ef",
    title: "Bảng nhân nhỏ",
    difficulty: "MEDIUM",
    beginner_fails: [
      'a = int(input())\nb = int(input())\nfor i in range(a, b):\n    for j in range(1, 4):\n        print(i, "x", j, "=", i*j)', // range(a, b) thiếu b
      'a = int(input())\nb = int(input())\nfor so in range(a, b + 1):\n    print(f"{so} x 1 = {so*1}")'
    ],
    beginner_pass: 'a = int(input())\nb = int(input())\ni = a\nwhile i <= b:\n    j = 1\n    while j <= 3:\n        print(str(i) + " x " + str(j) + " = " + str(i * j))\n        j += 1\n    i += 1',
    inter_fails: [
      'a = int(input())\nb = int(input())\nfor so in range(a, b + 1):\n    for i in range(1, 3):\n        print(f"{so} x {i} = {so * i}")' // range(1, 3) thiếu 3
    ],
    inter_pass: 'a = int(input())\nb = int(input())\nfor so in range(a, b + 1):\n    for i in range(1, 4):\n        print(f"{so} x {i} = {so * i}")',
    advanced_pass: 'a, b = int(input()), int(input())\nfor num in range(a, b + 1):\n    for i in range(1, 4):\n        print(f"{num} x {i} = {num * i}")'
  },
  {
    id: "1ac520b8-5f10-4b2c-a759-9c39c6110ea8",
    title: "Duyệt mảng và in bình phương",
    difficulty: "EASY",
    beginner_fails: [
      's = input()\nfor x in s:\n    print(int(x)**2)', // duyệt từng ký tự thay vì split
      'nums = input().split()\nfor x in nums:\n    print(x * x)' // lỗi nhân chuỗi
    ],
    beginner_pass: 'day_so = input().split()\nfor item in day_so:\n    so = int(item)\n    print(so * so)',
    inter_fails: [
      'nums = list(map(int, input().split()))\nfor i in range(len(nums)):\n    print(i ** 2)' // in bình phương của chỉ số i
    ],
    inter_pass: 'nums = list(map(int, input().split()))\nfor x in nums:\n    print(x ** 2)',
    advanced_pass: 'for x in map(int, input().split()):\n    print(x ** 2)'
  },
  {
    id: "0c367f73-8c6c-4e32-a146-7c4af461f514",
    title: "Đếm phần tử chia hết cho 3",
    difficulty: "EASY",
    beginner_fails: [
      'nums = list(map(int, input().split()))\ndem = 0\nfor x in nums:\n    if x % 3 == 0:\n    dem += 1\nprint(dem)', // lỗi thụt lề
      'nums = list(map(int, input().split()))\ndem = 0\nfor x in nums:\n    if x / 3 == 0:\n        dem += 1\nprint(dem)' // nhầm / với %
    ],
    beginner_pass: 'mang = list(map(int, input().split()))\ndem = 0\nfor so in mang:\n    if so % 3 == 0:\n        dem = dem + 1\nprint(dem)',
    inter_fails: [
      'nums = list(map(int, input().split()))\nprint(len([x for x in nums if x % 3 != 0]))' // đếm nhầm số không chia hết
    ],
    inter_pass: 'nums = list(map(int, input().split()))\ncount = 0\nfor x in nums:\n    if x % 3 == 0:\n        count += 1\nprint(count)',
    advanced_pass: 'print(sum(1 for x in map(int, input().split()) if x % 3 == 0))'
  }
];

async function seedSubmissions() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("🚀 Kết nối Supabase PostgreSQL thành công.");

    // Lấy 70 học viên mới (loại trừ admin, teacher, QA bot, và 15 học viên cũ)
    const OLD_STUDENT_EMAILS = [
      'tienthinh6099@gmail.com', 'nguyen@gmail.com', 'tugiabao910@gmail.com',
      'giahan@gmail.com', 'trannamnb20041990@gmail.com', 'quanquan007719@gmail.com',
      'ntp.long1703@gmail.com', 'nguyenkhainguyennguyen274@gmail.com', 'anhanhpro102@gmail.com',
      'pminhkhoi208@gmail.com', 'minhthuph2303@gmail.com', 'phammaikhoi2626@gmail.com',
      'duchai07072001@gmail.com', 'zeno11275@gmail.com', 'phucdoan390@gmail.com'
    ];

    const usersRes = await client.query(`
      SELECT id, username, email, created_at
      FROM users
      WHERE role = 'STUDENT'
        AND NOT (email = ANY($1))
        AND NOT (email LIKE '%@example.invalid')
      ORDER BY created_at ASC;
    `, [OLD_STUDENT_EMAILS]);

    const students = usersRes.rows;
    console.log(`Tìm thấy ${students.length} học viên mới sẵn sàng nhận dữ liệu giải bài.`);

    if (students.length === 0) {
      console.log("Không tìm thấy học viên mục tiêu!");
      return;
    }

    // Phân bổ 70 học viên thành 3 nhóm cấp độ:
    // 16 ADVANCED (Top giỏi)
    // 36 INTERMEDIATE (Trung bình/Chăm chỉ)
    // 18 BEGINNER (Mới học/Thử & Sai nhiều)
    const advancedStudents = students.slice(0, 16);
    const intermediateStudents = students.slice(16, 52);
    const beginnerStudents = students.slice(52, 70);

    console.log(`- Nhóm Khá / Giỏi (ADVANCED): ${advancedStudents.length} bạn`);
    console.log(`- Nhóm Trung bình / Chăm chỉ (INTERMEDIATE): ${intermediateStudents.length} bạn`);
    console.log(`- Nhóm Mới học / Thử & Sai nhiều (BEGINNER): ${beginnerStudents.length} bạn`);

    const allSubmissions = [];

    // 1. Sinh bài nộp cho nhóm ADVANCED
    for (const student of advancedStudents) {
      let currentTime = new Date(student.created_at);
      // Giải từ 12 đến 15 bài
      const exCount = 12 + Math.floor(Math.random() * 4); // 12-15 bài
      const chosenExercises = EXERCISES_MAP.slice(0, exCount);

      for (const ex of chosenExercises) {
        // Mỗi bài cách nhau từ 1 đến 3 ngày
        currentTime = new Date(currentTime.getTime() + (1 + Math.random() * 2) * 86400000 + Math.random() * 3600000);
        if (currentTime.getHours() < 8) currentTime.setHours(9 + Math.floor(Math.random() * 3));
        if (currentTime.getHours() > 22) currentTime.setHours(19 + Math.floor(Math.random() * 3));

        // 85% nộp 1 lần pass ngay, 15% nộp 1 lần fail rồi pass ở lần 2
        const needRetry = Math.random() < 0.15;
        if (needRetry && ex.inter_fails.length > 0) {
          const failCode = ex.inter_fails[0];
          allSubmissions.push({
            user_id: student.id,
            exercise_id: ex.id,
            language: 'PYTHON',
            code: failCode,
            status: 'FAILED',
            runtime: Math.round(150 + Math.random() * 200),
            submitted_at: new Date(currentTime)
          });
          // 2 phút sau nộp lại pass
          currentTime = new Date(currentTime.getTime() + (60 + Math.random() * 120) * 1000);
        }

        allSubmissions.push({
          user_id: student.id,
          exercise_id: ex.id,
          language: 'PYTHON',
          code: ex.advanced_pass,
          status: 'PASSED',
          runtime: Math.round(120 + Math.random() * 150),
          submitted_at: new Date(currentTime)
        });
      }
    }

    // 2. Sinh bài nộp cho nhóm INTERMEDIATE
    for (const student of intermediateStudents) {
      let currentTime = new Date(student.created_at);
      // Giải từ 9 đến 13 bài
      const exCount = 9 + Math.floor(Math.random() * 5); // 9-13 bài
      const chosenExercises = EXERCISES_MAP.slice(0, exCount);

      for (const ex of chosenExercises) {
        currentTime = new Date(currentTime.getTime() + (1 + Math.random() * 3) * 86400000);
        if (currentTime.getHours() < 8) currentTime.setHours(8 + Math.floor(Math.random() * 4));
        if (currentTime.getHours() > 22) currentTime.setHours(20 + Math.floor(Math.random() * 2));

        // Nộp từ 2 đến 3 lần: 1-2 lần FAILED, 1 lần PASSED
        const failAttempts = 1 + (Math.random() < 0.4 ? 1 : 0);
        for (let f = 0; f < failAttempts; f++) {
          const failCode = ex.inter_fails[f % ex.inter_fails.length] || ex.beginner_fails[0];
          allSubmissions.push({
            user_id: student.id,
            exercise_id: ex.id,
            language: 'PYTHON',
            code: failCode,
            status: 'FAILED',
            runtime: Math.round(200 + Math.random() * 300),
            submitted_at: new Date(currentTime)
          });
          // 1 - 3 phút sau sửa lỗi nộp lại
          currentTime = new Date(currentTime.getTime() + (60 + Math.random() * 180) * 1000);
        }

        allSubmissions.push({
          user_id: student.id,
          exercise_id: ex.id,
          language: 'PYTHON',
          code: ex.inter_pass,
          status: 'PASSED',
          runtime: Math.round(180 + Math.random() * 250),
          submitted_at: new Date(currentTime)
        });
      }
    }

    // 3. Sinh bài nộp cho nhóm BEGINNER (Thử sai bền bỉ)
    for (const student of beginnerStudents) {
      let currentTime = new Date(student.created_at);
      // Giải từ 6 đến 10 bài cơ bản
      const exCount = 6 + Math.floor(Math.random() * 5); // 6-10 bài
      const chosenExercises = EXERCISES_MAP.slice(0, exCount);

      for (const ex of chosenExercises) {
        currentTime = new Date(currentTime.getTime() + (1 + Math.random() * 3) * 86400000);
        if (currentTime.getHours() < 8) currentTime.setHours(9 + Math.floor(Math.random() * 3));
        if (currentTime.getHours() > 22) currentTime.setHours(20 + Math.floor(Math.random() * 2));

        // Nộp từ 3 đến 6 lần: 2-5 lần FAILED, sau đó PASSED
        const failCount = 2 + Math.floor(Math.random() * 4); // 2-5 lần fail
        for (let f = 0; f < failCount; f++) {
          const failCode = ex.beginner_fails[f % ex.beginner_fails.length];
          allSubmissions.push({
            user_id: student.id,
            exercise_id: ex.id,
            language: 'PYTHON',
            code: failCode,
            status: 'FAILED',
            runtime: Math.round(250 + Math.random() * 400),
            submitted_at: new Date(currentTime)
          });
          // 30s - 90s nộp lại (thử sai nhanh)
          currentTime = new Date(currentTime.getTime() + (30 + Math.random() * 60) * 1000);
        }

        // Lần cuối cùng PASSED
        allSubmissions.push({
          user_id: student.id,
          exercise_id: ex.id,
          language: 'PYTHON',
          code: ex.beginner_pass,
          status: 'PASSED',
          runtime: Math.round(220 + Math.random() * 350),
          submitted_at: new Date(currentTime)
        });
      }
    }

    console.log(`\n⏳ Đang nạp ${allSubmissions.length} bài nộp code vào CSDL Supabase...`);

    // Chèn dữ liệu theo batch 100 bản ghi để tối ưu tốc độ
    const BATCH_SIZE = 100;
    let insertedCount = 0;

    for (let i = 0; i < allSubmissions.length; i += BATCH_SIZE) {
      const batch = allSubmissions.slice(i, i + BATCH_SIZE);
      const values = [];
      const params = [];
      let paramIdx = 1;

      for (const sub of batch) {
        values.push(`(gen_random_uuid(), $${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2}, $${paramIdx + 3}, $${paramIdx + 4}, $${paramIdx + 5}, $${paramIdx + 6})`);
        params.push(sub.user_id, sub.exercise_id, sub.language, sub.code, sub.status, sub.runtime, sub.submitted_at);
        paramIdx += 7;
      }

      await client.query(
        `INSERT INTO submissions (id, user_id, exercise_id, language, code, status, runtime, submitted_at)
         VALUES ${values.join(', ')}`,
        params
      );

      insertedCount += batch.length;
      process.stdout.write(`Đã nạp ${insertedCount}/${allSubmissions.length} bài nộp...\r`);
    }

    console.log(`\n\n🎉 HOÀN TẤT NẠP DỮ LIỆU SUBMISSIONS!`);
    console.log(`- Tổng số bài nộp code đã nạp mới: ${insertedCount}`);

    // Thống kê tổng số submissions hiện tại trong toàn hệ thống
    const totalSubRes = await client.query(`
      SELECT 
        status, 
        COUNT(*) as count,
        ROUND((COUNT(*)::numeric / SUM(COUNT(*)) OVER ()) * 100, 1) as percentage
      FROM submissions
      GROUP BY status;
    `);
    console.log("\n📊 THỐNG KÊ TOÀN BỘ BÀI NỘP TRÊN HỆ THỐNG HIỆN TẠI:");
    console.table(totalSubRes.rows);

  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    await client.end();
  }
}

seedSubmissions();
