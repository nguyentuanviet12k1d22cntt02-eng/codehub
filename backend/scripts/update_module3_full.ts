import { prisma } from '../src/infrastructure/database/prisma';
import * as fs from 'fs';
import * as path from 'path';

interface TestCaseDef {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface ExerciseDef {
  title: string;
  lessonId: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  starterCode?: string;
  solutionCode: string;
  testCases?: TestCaseDef[];
}

const exercises: ExerciseDef[] = [
  // --- LS-03.MP_FOR (15 bài) ---
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Đảo ngược danh sách',
    solutionCode: `n = int(input())
arr = [input().strip() for _ in range(n)]
print(*(arr[::-1]))
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Đếm ký tự nguyên âm trong chuỗi',
    solutionCode: `s = input()
vowels = "aeiouAEIOU"
cnt = 0
for c in s:
    if c in vowels:
        cnt += 1
print(cnt)
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Đếm số lượng số chẵn và lẻ từ 1 đến n',
    solutionCode: `n = int(input())
chan = 0
le = 0
for i in range(1, n + 1):
    if i % 2 == 0:
        chan += 1
    else:
        le += 1
print(f"Số chẵn: {chan}, Số lẻ: {le}")
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'In bảng cửu chương',
    solutionCode: `n = int(input())
for i in range(1, n + 1):
    for j in range(1, 11):
        print(f"{i}x{j} = {i * j}")
`,
    testCases: [
      {
        input: "3\n",
        expectedOutput: "1x1 = 1\n1x2 = 2\n1x3 = 3\n1x4 = 4\n1x5 = 5\n1x6 = 6\n1x7 = 7\n1x8 = 8\n1x9 = 9\n1x10 = 10\n2x1 = 2\n2x2 = 4\n2x3 = 6\n2x4 = 8\n2x5 = 10\n2x6 = 12\n2x7 = 14\n2x8 = 16\n2x9 = 18\n2x10 = 20\n3x1 = 3\n3x2 = 6\n3x3 = 9\n3x4 = 12\n3x5 = 15\n3x6 = 18\n3x7 = 21\n3x8 = 24\n3x9 = 27\n3x10 = 30\n",
        isHidden: false
      },
      {
        input: "1\n",
        expectedOutput: "1x1 = 1\n1x2 = 2\n1x3 = 3\n1x4 = 4\n1x5 = 5\n1x6 = 6\n1x7 = 7\n1x8 = 8\n1x9 = 9\n1x10 = 10\n",
        isHidden: true
      },
      {
        input: "2\n",
        expectedOutput: "1x1 = 1\n1x2 = 2\n1x3 = 3\n1x4 = 4\n1x5 = 5\n1x6 = 6\n1x7 = 7\n1x8 = 8\n1x9 = 9\n1x10 = 10\n2x1 = 2\n2x2 = 4\n2x3 = 6\n2x4 = 8\n2x5 = 10\n2x6 = 12\n2x7 = 14\n2x8 = 16\n2x9 = 18\n2x10 = 20\n",
        isHidden: true
      }
    ]
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'In bảng số nguyên từ 1 đến n²',
    solutionCode: `n = int(input())
num = 1
for i in range(n):
    row = []
    for j in range(n):
        row.append(str(num))
        num += 1
    print(" ".join(row))
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Kiểm tra chuỗi palindrome',
    solutionCode: `s = input().strip()
is_palin = True
for i in range(len(s) // 2):
    if s[i] != s[-1 - i]:
        is_palin = False
        break
print("YES" if is_palin else "NO")
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Kiểm tra số hoàn hảo',
    solutionCode: `n = int(input())
s = 0
for i in range(1, n):
    if n % i == 0:
        s += i
print("YES" if s == n and n > 0 else "NO")
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Tìm số Fibonacci thứ n',
    solutionCode: `n = int(input())
if n <= 2:
    print(1)
else:
    a, b = 1, 1
    for _ in range(3, n + 1):
        a, b = b, a + b
    print(b)
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Tìm số lớn nhất trong danh sách',
    solutionCode: `n = int(input())
max_val = int(input())
for _ in range(n - 1):
    x = int(input())
    if x > max_val:
        max_val = x
print(max_val)
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Tìm ước chung lớn nhất (GCD)',
    solutionCode: `a = int(input())
b = int(input())
while b != 0:
    a, b = b, a % b
print(a)
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Tính giai thừa',
    solutionCode: `n = int(input())
gt = 1
for i in range(1, n + 1):
    gt *= i
print(gt)
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Tính tổng các chữ số của một số',
    solutionCode: `n = abs(int(input()))
s = 0
while n > 0:
    s += n % 10
    n //= 10
print(s)
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Tính tổng các số chẵn',
    solutionCode: `n = int(input())
total = 0
for i in range(1, n + 1):
    if i % 2 == 0:
        total += i
print(total)
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Tính tổng các số đảo ngược',
    solutionCode: `n = int(input())
primes = []
for i in range(2, n + 1):
    is_p = True
    for j in range(2, int(i**0.5) + 1):
        if i % j == 0:
            is_p = False
            break
    if is_p and i % 10 in [3, 5, 7, 9]:
        primes.append(str(i))
print(",".join(primes))
`
  },
  {
    lessonId: 'LS-03.MP_FOR',
    title: 'Tính tổng dãy số nhập từ người dùng',
    solutionCode: `total = 0
while True:
    x = int(input())
    if x == -1:
        break
    total += x
print(total)
`
  },

  // --- LS-03.MP_WHILE (15 bài) ---
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Bội chung nhỏ nhất (LCM)',
    solutionCode: `a = int(input())
b = int(input())
x, y = a, b
while y != 0:
    x, y = y, x % y
gcd = x
lcm = (a * b) // gcd
print(lcm)
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Đảo ngược một số nguyên',
    solutionCode: `n = int(input())
rev = 0
while n > 0:
    rev = rev * 10 + (n % 10)
    n //= 10
print(rev)
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Dãy Fibonacci đến N',
    solutionCode: `N = int(input())
a, b = 0, 1
while a <= N:
    print(a)
    a, b = b, a + b
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Đếm chữ số của một số nguyên',
    solutionCode: `n = abs(int(input()))
if n == 0:
    print(1)
else:
    cnt = 0
    while n > 0:
        cnt += 1
        n //= 10
    print(cnt)
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Đếm ngược đơn giản',
    solutionCode: `n = int(input())
while n >= 1:
    print(n)
    n -= 1
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Đếm số ước của một số',
    solutionCode: `n = int(input())
i = 1
cnt = 0
while i <= n:
    if n % i == 0:
        cnt += 1
    i += 1
print(cnt)
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Kiểm tra số Armstrong',
    solutionCode: `n = int(input())
temp = n
total = 0
while temp > 0:
    digit = temp % 10
    total += digit ** 3
    temp //= 10
print("YES" if total == n else "NO")
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Kiểm tra số nguyên tố',
    solutionCode: `n = int(input())
if n < 2:
    print("NO")
else:
    is_prime = True
    i = 2
    while i * i <= n:
        if n % i == 0:
            is_prime = False
            break
        i += 1
    print("YES" if is_prime else "NO")
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Kiểm tra số Palindrome (Số)',
    solutionCode: `n = int(input())
if n < 0:
    print("NO")
else:
    temp = n
    rev = 0
    while temp > 0:
        rev = rev * 10 + (temp % 10)
        temp //= 10
    print("YES" if rev == n else "NO")
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Nhập số đến khi gặp số âm',
    solutionCode: `total = 0
while True:
    x = int(input())
    if x < 0:
        break
    total += x
print(total)
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Tìm chữ số lớn nhất của một số',
    solutionCode: `n = abs(int(input()))
max_d = 0
while n > 0:
    d = n % 10
    if d > max_d:
        max_d = d
    n //= 10
print(max_d)
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Tính lũy thừa (không dùng )',
    solutionCode: `co_so = int(input())
so_mu = int(input())
res = 1
i = 0
while i < so_mu:
    res *= co_so
    i += 1
print(res)
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Tính tổng các số từ 1 đến N',
    solutionCode: `N = int(input())
total = 0
i = 1
while i <= N:
    total += i
    i += 1
print(total)
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Ước chung lớn nhất (GCD) - Thuật toán Euclid',
    solutionCode: `a = int(input())
b = int(input())
while b != 0:
    a, b = b, a % b
print(a)
`
  },
  {
    lessonId: 'LS-03.MP_WHILE',
    title: 'Vòng lặp với số tiền rút từ ATM',
    solutionCode: `ban_dau = int(input())
while True:
    rut = int(input())
    if rut <= ban_dau and rut % 50 == 0:
        print(ban_dau - rut)
        break
`
  },

  // --- Theory exercises with input in Module 3 ---
  {
    lessonId: 'LS-03.01',
    title: 'Lấy ký tự áp chót',
    solutionCode: `s = input().strip()
print(s[-2])
`,
    testCases: [
      { input: "PYTHON\n", expectedOutput: "O\n", isHidden: false },
      { input: "VIETNAM\n", expectedOutput: "A\n", isHidden: true },
      { input: "12345\n", expectedOutput: "4\n", isHidden: true }
    ]
  },
  {
    lessonId: 'LS-03.02',
    title: 'Đảo ngược chuỗi',
    solutionCode: `s = input().strip()
print(s[::-1])
`,
    testCases: [
      { input: "PYTHON\n", expectedOutput: "NOHTYP\n", isHidden: false },
      { input: "HELLO\n", expectedOutput: "OLLEH\n", isHidden: true },
      { input: "12345\n", expectedOutput: "54321\n", isHidden: true }
    ]
  },
  {
    lessonId: 'LS-03.03',
    title: 'Thay thế từ nhạy cảm',
    solutionCode: `sentence = input()
print(sentence.replace("xấu", "đẹp"))
`,
    testCases: [
      { input: "trời hôm nay xấu quá\n", expectedOutput: "trời hôm nay đẹp quá\n", isHidden: false },
      { input: "bức tranh này xấu\n", expectedOutput: "bức tranh này đẹp\n", isHidden: true },
      { input: "thời tiết rất đẹp\n", expectedOutput: "thời tiết rất đẹp\n", isHidden: true }
    ]
  },
  {
    lessonId: 'LS-03.04',
    title: 'In hóa đơn chi tiết',
    solutionCode: `item = input().strip()
price = int(input())
print(f"Sản phẩm {item} có giá {price} VNĐ")
`,
    testCases: [
      { input: "Bút bi\n5000\n", expectedOutput: "Sản phẩm Bút bi có giá 5000 VNĐ\n", isHidden: false },
      { input: "Vở kẻ ngang\n12000\n", expectedOutput: "Sản phẩm Vở kẻ ngang có giá 12000 VNĐ\n", isHidden: true },
      { input: "Thước kẻ\n7000\n", expectedOutput: "Sản phẩm Thước kẻ có giá 7000 VNĐ\n", isHidden: true }
    ]
  }
];

async function updateModule3() {
  console.log('🚀 Bắt đầu cập nhật Module 3 vào CSDL và Seed file...');

  for (const exDef of exercises) {
    const lesson = await prisma.lesson.findFirst({
      where: { lessonId: exDef.lessonId },
      include: { codingExercises: true }
    });

    if (!lesson) {
      console.warn(`⚠️ Lesson ${exDef.lessonId} không tìm thấy`);
      continue;
    }

    const existing = lesson.codingExercises.find(
      (e) => e.title.trim().toLowerCase() === exDef.title.trim().toLowerCase()
    );

    if (!existing) {
      console.warn(`⚠️ Không tìm thấy bài tập: "${exDef.title}" trong ${exDef.lessonId}`);
      continue;
    }

    console.log(`Đang cập nhật bài: "${exDef.title}" (${exDef.lessonId})...`);

    const updateData: any = {
      solutionCode: exDef.solutionCode
    };

    if (exDef.testCases) {
      await prisma.testCase.deleteMany({
        where: { exerciseId: existing.id }
      });
      updateData.testCases = {
        create: exDef.testCases.map((tc) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden
        }))
      };
    }

    await prisma.codingExercise.update({
      where: { id: existing.id },
      data: updateData
    });
    console.log(`  ✓ Xong.`);
  }

  // Cập nhật seed file
  const seedPath = path.resolve(__dirname, '../prisma/seed/seed_course_data.json');
  console.log(`\nĐang đồng bộ file seed: ${seedPath}...`);
  const rawSeed = fs.readFileSync(seedPath, 'utf-8');
  const seedData = JSON.parse(rawSeed);

  const mod3 = seedData.modules?.find((m: any) => m.title?.includes('Module 3') || m.moduleId === 'MOD-03');
  if (mod3 && mod3.lessons) {
    for (const l of mod3.lessons) {
      const matchExercises = exercises.filter((e) => e.lessonId === l.lessonId);
      if (matchExercises.length > 0 && l.codingExercises) {
        for (const exDef of matchExercises) {
          const seedEx = l.codingExercises.find(
            (e: any) => e.title?.trim().toLowerCase() === exDef.title.trim().toLowerCase()
          );
          if (seedEx) {
            seedEx.solutionCode = exDef.solutionCode;
            if (exDef.testCases) {
              seedEx.testCases = exDef.testCases;
            }
          }
        }
      }
    }
    fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2), 'utf-8');
    console.log('✓ Đã đồng bộ seed_course_data.json!');
  }

  console.log('\n🎉 HOÀN TẤT CẬP NHẬT CÁC BÀI TẬP MODULE 3!');
}

updateModule3()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
