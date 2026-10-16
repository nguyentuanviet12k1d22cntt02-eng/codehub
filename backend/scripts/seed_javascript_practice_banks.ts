/**
 * Reproducible JavaScript module-practice banks.
 *
 * Each of the 14 curriculum modules receives exactly 30 standalone Judge0
 * exercises: 10 EASY, 10 MEDIUM and 10 HARD.  Every exercise ships with a
 * starter, reference solution, one visible case and two hidden cases.
 */

import { prisma } from '../src/infrastructure/database/prisma';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type TestCaseDef = { input: string; expectedOutput: string; isHidden: boolean };
export type JavaScriptExercise = {
    title: string;
    difficulty: Difficulty;
    problemDescription: string;
    starterCode: string;
    solutionCode: string;
    testCases: TestCaseDef[];
};

type ModuleSpec = {
    code: string;
    title: string;
    topic: string;
    requirement: string;
    kind: 'VARIABLES' | 'TYPES' | 'INPUT' | 'CONDITION' | 'LOOP' | 'FUNCTION' | 'ARRAY' |
        'STRING' | 'OBJECT' | 'ES6' | 'EXECUTION' | 'OOP' | 'ERROR' | 'MODULE';
};

export const javascriptModules: readonly ModuleSpec[] = [
    { code: 'JS1-01', title: 'Làm quen với JavaScript & Khai báo biến', topic: 'biến let/const và console.log', requirement: 'Dùng let hoặc const để lưu dữ liệu trước khi in.', kind: 'VARIABLES' },
    { code: 'JS1-02', title: 'Kiểu dữ liệu & Toán tử', topic: 'kiểu dữ liệu, Number và phép toán', requirement: 'Chuyển dữ liệu bằng Number trước khi tính toán.', kind: 'TYPES' },
    { code: 'JS1-03', title: 'Nhập xuất & Ép kiểu', topic: 'đọc stdin và parse dữ liệu', requirement: "Đọc dữ liệu với fs.readFileSync(0, 'utf8').", kind: 'INPUT' },
    { code: 'JS1-04', title: 'Rẽ nhánh & Logic', topic: 'if/else và so sánh', requirement: 'Dùng if/else hoặc toán tử điều kiện để phân nhánh.', kind: 'CONDITION' },
    { code: 'JS1-05', title: 'Vòng lặp', topic: 'for, while và điều kiện lặp', requirement: 'Dùng vòng lặp để duyệt các giá trị.', kind: 'LOOP' },
    { code: 'JS1-06', title: 'Hàm & Arrow Function', topic: 'hàm, tham số và arrow function', requirement: 'Tách phép tính thành một hàm hoặc arrow function.', kind: 'FUNCTION' },
    { code: 'JS1-07', title: 'Mảng & Higher-order Methods', topic: 'Array, map, filter và reduce', requirement: 'Xử lý danh sách bằng Array hoặc higher-order method.', kind: 'ARRAY' },
    { code: 'JS1-08', title: 'Chuỗi & Template Literals', topic: 'chuỗi JavaScript', requirement: 'Dùng phương thức chuỗi phù hợp, không xử lý từng ký tự bằng dữ liệu có sẵn.', kind: 'STRING' },
    { code: 'JS2-09', title: 'Object & Dữ liệu có cấu trúc', topic: 'Object key-value', requirement: 'Tạo Object và đọc/ghi thuộc tính qua key.', kind: 'OBJECT' },
    { code: 'JS2-10', title: 'ES6+: Destructuring, Spread, Set & Map', topic: 'destructuring, spread, Set và Map', requirement: 'Dùng ít nhất một cú pháp ES6+ phù hợp.', kind: 'ES6' },
    { code: 'JS2-11', title: 'Execution Context, Closure & this', topic: 'closure và this', requirement: 'Thể hiện closure hoặc method dùng this trong lời giải.', kind: 'EXECUTION' },
    { code: 'JS2-12', title: 'Prototype & Class', topic: 'class, instance và kế thừa', requirement: 'Khai báo class hoặc prototype để thực hiện phép tính.', kind: 'OOP' },
    { code: 'JS2-13', title: 'Error Handling & Validation', topic: 'try/catch và kiểm tra đầu vào', requirement: 'Ném và bắt lỗi khi đầu vào không hợp lệ.', kind: 'ERROR' },
    { code: 'JS2-14', title: 'Module hóa mã nguồn', topic: 'CommonJS/ES module theo mô hình một tệp', requirement: 'Đóng gói hàm trong một object module trước khi sử dụng.', kind: 'MODULE' },
];

const scenarios = [
    'Tổng hợp chỉ số', 'Cân bằng ngân sách', 'Điểm hoạt động', 'Chỉ số nhiệt độ', 'Kho dữ liệu nhỏ',
    'Lượt truy cập', 'Điểm thưởng', 'Thời lượng học', 'Số lượng đơn hàng', 'Bộ đếm nhiệm vụ',
    'Phân tích doanh thu', 'Theo dõi năng lượng', 'Ước lượng khoảng cách', 'Tổng kết kết quả', 'Tính điểm xếp hạng',
    'Kiểm tra giới hạn', 'Báo cáo trạng thái', 'Dữ liệu cảm biến', 'Đánh giá tiến độ', 'Tối ưu lịch học',
    'Xử lý giao dịch', 'Thống kê cửa hàng', 'Quản lý hàng đợi', 'Theo dõi điểm số', 'Chuẩn hóa đầu vào',
    'Tổng hợp chuỗi', 'Đối chiếu dữ liệu', 'Báo cáo cuối ngày', 'Bộ lọc thông minh', 'Thử thách tổng hợp',
];

const levelFor = (index: number): Difficulty => index <= 10 ? 'EASY' : index <= 20 ? 'MEDIUM' : 'HARD';
const normalize = (value: unknown) => `${value}\n`;

function numericCases(index: number, solve: (left: number, right: number) => number | string): TestCaseDef[] {
    const rows: Array<[number, number]> = [
        [index + 2, index * 2 + 3],
        [index % 7, index + 11],
        [index * 3 + 1, index % 5 + 2],
    ];
    return rows.map(([left, right], caseIndex) => ({
        input: `${left} ${right}\n`, expectedOutput: normalize(solve(left, right)), isHidden: caseIndex > 0,
    }));
}

function numberProgram(body: string): string {
    return `const fs = require('fs');
const raw = fs.readFileSync(0, 'utf8').trim();
const [left = 0, right = 0] = raw ? raw.split(/\\s+/).map(Number) : [];
${body}
`;
}

function commonDescription(spec: ModuleSpec, index: number, input: string, output: string, extra: string): string {
    return `### Đề bài\nHoàn thành bài **${scenarios[index - 1]}** trong module **${spec.title}**. ${extra}\n\n` +
        `- **Đầu vào:** ${input}\n- **Đầu ra:** ${output}\n- **Yêu cầu kỹ thuật:** ${spec.requirement}\n\n` +
        `Chương trình phải đọc stdin và chỉ in kết quả cuối cùng, không in lời nhắc.`;
}

function scalarExercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    const mode = index % 5;
    const solve = (left: number, right: number) => {
        if (mode === 0) return left + right + index;
        if (mode === 1) return Math.abs(left - right) + index;
        if (mode === 2) return left * right + index;
        if (mode === 3) return left * 2 + right + index;
        return Math.max(left, right) + index;
    };
    const expression = mode === 0 ? 'left + right + bonus'
        : mode === 1 ? 'Math.abs(left - right) + bonus'
            : mode === 2 ? 'left * right + bonus'
                : mode === 3 ? 'left * 2 + right + bonus' : 'Math.max(left, right) + bonus';
    const technique = spec.kind === 'VARIABLES'
        ? `const bonus = ${index};\nlet result = ${expression};\nconsole.log(result);`
        : spec.kind === 'TYPES'
            ? `const bonus = Number(${index});\nconst result = ${expression};\nconsole.log(result);`
            : spec.kind === 'INPUT'
                ? `const parsedValues = raw ? raw.split(/\\s+/).map(Number) : [];\nconst bonus = ${index};\nconsole.log(${expression});`
                : `const bonus = ${index};\nconsole.log(${expression});`;
    return {
        title: `${spec.code} · ${scenarios[index - 1]}`,
        difficulty: levelFor(index),
        problemDescription: commonDescription(spec, index, 'Hai số nguyên `left right`.', 'Một số nguyên theo công thức của bài.', `Tính giá trị với hệ số cố định ${index}.`),
        starterCode: numberProgram('// Viết lời giải tại đây.'),
        solutionCode: numberProgram(technique),
        testCases: numericCases(index, solve),
    };
}

function conditionExercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    const labels = ['LEFT', 'RIGHT', 'EQUAL'];
    const solve = (left: number, right: number) => left > right ? labels[0] : left < right ? labels[1] : labels[2];
    return {
        title: `${spec.code} · ${scenarios[index - 1]}`,
        difficulty: levelFor(index),
        problemDescription: commonDescription(spec, index, 'Hai số nguyên `left right`.', '`LEFT` nếu left lớn hơn, `RIGHT` nếu right lớn hơn, ngược lại `EQUAL`.', 'So sánh hai chỉ số và phân loại trạng thái.'),
        starterCode: numberProgram('// Dùng if/else để phân loại.'),
        solutionCode: numberProgram(`let result;
if (left > right) result = 'LEFT';
else if (left < right) result = 'RIGHT';
else result = 'EQUAL';
console.log(result);`),
        testCases: [
            { input: `${index + 5} ${index}\n`, expectedOutput: 'LEFT\n', isHidden: false },
            { input: `${index} ${index + 5}\n`, expectedOutput: 'RIGHT\n', isHidden: true },
            { input: `${index} ${index}\n`, expectedOutput: 'EQUAL\n', isHidden: true },
        ],
    };
}

function loopExercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    const divisor = index % 4 + 2;
    const solve = (left: number, right: number) => {
        let total = 0;
        for (let value = 1; value <= left; value += 1) if (value % divisor === right % divisor) total += value;
        return total;
    };
    return {
        title: `${spec.code} · ${scenarios[index - 1]}`,
        difficulty: levelFor(index),
        problemDescription: commonDescription(spec, index, 'Hai số nguyên `n r`.', `Tổng các số từ 1 đến n có phần dư khi chia ${divisor} bằng phần dư của r.`, 'Duyệt từ 1 đến n và cộng các giá trị thỏa điều kiện.'),
        starterCode: numberProgram('// Dùng for hoặc while để tính tổng.'),
        solutionCode: numberProgram(`const divisor = ${divisor};
let total = 0;
for (let value = 1; value <= left; value += 1) {
    if (value % divisor === right % divisor) total += value;
}
console.log(total);`),
        testCases: numericCases(index, solve),
    };
}

function functionExercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    const mode = index % 3;
    const solve = (left: number, right: number) => mode === 0 ? left + right * index : mode === 1 ? left * index - right : Math.abs(left - right) * index;
    const expression = mode === 0 ? 'left + right * factor' : mode === 1 ? 'left * factor - right' : 'Math.abs(left - right) * factor';
    return {
        title: `${spec.code} · ${scenarios[index - 1]}`,
        difficulty: levelFor(index),
        problemDescription: commonDescription(spec, index, 'Hai số nguyên `left right`.', 'Một số nguyên được tính bởi hàm.', `Viết arrow function nhận hai tham số và hệ số ${index}.`),
        starterCode: numberProgram('// Khai báo một arrow function rồi gọi nó.'),
        solutionCode: numberProgram(`const calculate = (left, right, factor) => ${expression};
console.log(calculate(left, right, ${index}));`),
        testCases: numericCases(index, solve),
    };
}

function arrayExercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    const mode = index % 3;
    const solve = (values: number[]) => mode === 0
        ? values.filter((value) => value % 2 === 0).reduce((sum, value) => sum + value, 0)
        : mode === 1 ? values.map((value) => value + index).reduce((sum, value) => sum + value, 0)
            : values.filter((value) => value > index % 5).length;
    const code = mode === 0
        ? 'const result = values.filter((value) => value % 2 === 0).reduce((sum, value) => sum + value, 0);'
        : mode === 1 ? `const result = values.map((value) => value + ${index}).reduce((sum, value) => sum + value, 0);`
            : `const result = values.filter((value) => value > ${index % 5}).length;`;
    const cases = [[1, 2, 3, 4, 5], [index, 0, index + 1, 7], [9, 8, 7, 6, 5, 4]];
    return {
        title: `${spec.code} · ${scenarios[index - 1]}`,
        difficulty: levelFor(index),
        problemDescription: commonDescription(spec, index, 'Dòng đầu là n, sau đó là n số nguyên.', 'Một số nguyên tổng hợp từ mảng.', 'Đọc mảng, rồi dùng phương thức Array để xử lý.'),
        starterCode: `const fs = require('fs');\n// Đọc n và các phần tử, sau đó xử lý mảng.\n`,
        solutionCode: `const fs = require('fs');
const raw = fs.readFileSync(0, 'utf8').trim();
const tokens = raw ? raw.split(/\\s+/).map(Number) : [];
const values = tokens.slice(1, 1 + (tokens[0] || 0));
${code}
console.log(result);
`,
        testCases: cases.map((values, caseIndex) => ({
            input: `${values.length} ${values.join(' ')}\n`, expectedOutput: normalize(solve(values)), isHidden: caseIndex > 0,
        })),
    };
}

function stringExercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    const mode = index % 4;
    const solve = (text: string) => mode === 0 ? [...text].reverse().join('')
        : mode === 1 ? [...text].filter((letter) => 'aeiouAEIOU'.includes(letter)).length
            : mode === 2 ? text.toUpperCase() : `${text.length}:${text[0] || ''}`;
    const code = mode === 0 ? "const result = [...text].reverse().join('');"
        : mode === 1 ? "const result = [...text].filter((letter) => 'aeiouAEIOU'.includes(letter)).length;"
            : mode === 2 ? 'const result = text.toUpperCase();' : "const result = `${text.length}:${text[0] || ''}`;";
    const cases = ['javascript', 'CodeHub', `lesson${index}`];
    return {
        title: `${spec.code} · ${scenarios[index - 1]}`,
        difficulty: levelFor(index),
        problemDescription: commonDescription(spec, index, 'Một từ không có khoảng trắng.', 'Chuỗi hoặc số theo yêu cầu xử lý.', 'Áp dụng phương thức String/Template Literal phù hợp.'),
        starterCode: "const fs = require('fs');\nconst text = fs.readFileSync(0, 'utf8').trim();\n// Xử lý text và in kết quả.\n",
        solutionCode: `const fs = require('fs');
const text = fs.readFileSync(0, 'utf8').trim();
${code}
console.log(result);
`,
        testCases: cases.map((text, caseIndex) => ({ input: `${text}\n`, expectedOutput: normalize(solve(text)), isHidden: caseIndex > 0 })),
    };
}

function objectExercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    const solve = (left: number, right: number) => left * index + right;
    return {
        title: `${spec.code} · ${scenarios[index - 1]}`,
        difficulty: levelFor(index),
        problemDescription: commonDescription(spec, index, 'Hai số nguyên `left right`.', 'Giá trị được lấy từ dữ liệu Object.', `Tạo object chứa left, right và hệ số ${index}, sau đó tính kết quả.`),
        starterCode: numberProgram('// Tạo object và đọc thuộc tính của nó.'),
        solutionCode: numberProgram(`const report = { left, right, factor: ${index} };
const result = report.left * report.factor + report.right;
console.log(result);`),
        testCases: numericCases(index, solve),
    };
}

function es6Exercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    const solve = (left: number, right: number) => left + right + new Set([left, right, index]).size;
    return {
        title: `${spec.code} · ${scenarios[index - 1]}`,
        difficulty: levelFor(index),
        problemDescription: commonDescription(spec, index, 'Hai số nguyên `left right`.', 'Tổng hai số cộng số lượng giá trị khác nhau.', 'Dùng destructuring, spread và Set để tính kết quả.'),
        starterCode: numberProgram('// Dùng destructuring/spread/Set trong lời giải.'),
        solutionCode: numberProgram(`const values = [left, right, ${index}];
const [first, second, ...rest] = values;
const unique = new Set([...rest, first, second]);
console.log(first + second + unique.size);`),
        testCases: numericCases(index, solve),
    };
}

function executionExercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    const solve = (left: number, right: number) => left + right + 1 + index;
    return {
        title: `${spec.code} · ${scenarios[index - 1]}`,
        difficulty: levelFor(index),
        problemDescription: commonDescription(spec, index, 'Hai số nguyên `left right`.', 'Kết quả tạo qua closure và method dùng this.', 'Tạo closure giữ bộ đếm và object có method dùng this.'),
        starterCode: numberProgram('// Dùng closure và object method.'),
        solutionCode: numberProgram(`function createCounter(seed) {
    let calls = 0;
    return (value) => { calls += 1; return seed + value + calls; };
}
const calculator = { bonus: ${index}, combine(value) { return this.bonus + value; } };
const next = createCounter(left);
console.log(next(right) + calculator.combine(0));`),
        testCases: numericCases(index, solve),
    };
}

function oopExercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    const solve = (left: number, right: number) => left * index + right;
    return {
        title: `${spec.code} · ${scenarios[index - 1]}`,
        difficulty: levelFor(index),
        problemDescription: commonDescription(spec, index, 'Hai số nguyên `left right`.', 'Giá trị do instance của class trả về.', `Tạo class nhận hệ số ${index} và gọi method tính toán.`),
        starterCode: numberProgram('// Khai báo class, tạo instance và gọi method.'),
        solutionCode: numberProgram(`class Metric {
    constructor(factor) { this.factor = factor; }
    evaluate(left, right) { return left * this.factor + right; }
}
const metric = new Metric(${index});
console.log(metric.evaluate(left, right));`),
        testCases: numericCases(index, solve),
    };
}

function errorExercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    const solve = (left: number, right: number) => left < 0 || right < 0 ? 'INVALID' : left + right + index;
    return {
        title: `${spec.code} · ${scenarios[index - 1]}`,
        difficulty: levelFor(index),
        problemDescription: commonDescription(spec, index, 'Hai số nguyên `left right`.', '`INVALID` nếu một số âm, ngược lại là tổng có hệ số.', 'Kiểm tra dữ liệu, throw Error và xử lý bằng try/catch.'),
        starterCode: numberProgram('// Throw Error khi dữ liệu không hợp lệ và catch lỗi.'),
        solutionCode: numberProgram(`function calculate(left, right) {
    if (left < 0 || right < 0) throw new Error('INVALID_INPUT');
    return left + right + ${index};
}
try { console.log(calculate(left, right)); }
catch (error) { console.log('INVALID'); }`),
        testCases: [
            { input: `${index} ${index + 1}\n`, expectedOutput: normalize(solve(index, index + 1)), isHidden: false },
            { input: `-1 ${index}\n`, expectedOutput: 'INVALID\n', isHidden: true },
            { input: `${index} -2\n`, expectedOutput: 'INVALID\n', isHidden: true },
        ],
    };
}

function moduleExercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    const solve = (left: number, right: number) => left * index + right;
    return {
        title: `${spec.code} · ${scenarios[index - 1]}`,
        difficulty: levelFor(index),
        problemDescription: commonDescription(spec, index, 'Hai số nguyên `left right`.', 'Giá trị do module tính toán trả về.', 'Mô phỏng CommonJS trong một tệp bằng object exports và gọi hàm đã đóng gói.'),
        starterCode: numberProgram('// Khai báo object exports, gắn hàm rồi sử dụng nó.'),
        solutionCode: numberProgram(`const exports = {};
exports.compute = (left, right) => left * ${index} + right;
const mathModule = Object.freeze({ ...exports });
console.log(mathModule.compute(left, right));`),
        testCases: numericCases(index, solve),
    };
}

function buildExercise(spec: ModuleSpec, index: number): JavaScriptExercise {
    switch (spec.kind) {
        case 'CONDITION': return conditionExercise(spec, index);
        case 'LOOP': return loopExercise(spec, index);
        case 'FUNCTION': return functionExercise(spec, index);
        case 'ARRAY': return arrayExercise(spec, index);
        case 'STRING': return stringExercise(spec, index);
        case 'OBJECT': return objectExercise(spec, index);
        case 'ES6': return es6Exercise(spec, index);
        case 'EXECUTION': return executionExercise(spec, index);
        case 'OOP': return oopExercise(spec, index);
        case 'ERROR': return errorExercise(spec, index);
        case 'MODULE': return moduleExercise(spec, index);
        default: return scalarExercise(spec, index);
    }
}

export const javascriptPracticeBanks: Record<string, JavaScriptExercise[]> = Object.fromEntries(
    javascriptModules.map((spec) => [spec.code, Array.from({ length: 30 }, (_, offset) => buildExercise(spec, offset + 1))]),
);

export async function seedJavaScriptPracticeBank(spec: ModuleSpec): Promise<void> {
    const anchor = await prisma.lesson.findFirst({ where: { lessonId: `${spec.code}.01` }, select: { chapterId: true } });
    if (!anchor) throw new Error(`Không tìm thấy lesson gốc ${spec.code}.01`);
    const practiceLessonId = `${spec.code}.MP`;
    const content = `# Bài tập thực hành tổng hợp ${spec.title}\n\nNgân hàng gồm 30 bài JavaScript: 10 Dễ, 10 Trung bình, 10 Khó. Mỗi bài có testcase công khai và testcase ẩn để tự đánh giá.`;
    let lesson = await prisma.lesson.findFirst({ where: { chapterId: anchor.chapterId, lessonId: practiceLessonId } });
    if (!lesson) {
        lesson = await prisma.lesson.create({
            data: { chapterId: anchor.chapterId, lessonId: practiceLessonId, title: `Bài tập thực hành tổng hợp: ${spec.title}`,
                objective: `Luyện tập ${spec.topic} qua 30 bài phân bậc.`, content, difficulty: 'MEDIUM', durationMinutes: 90, isFree: true, orderIndex: 99 },
        });
    } else {
        lesson = await prisma.lesson.update({ where: { id: lesson.id }, data: { title: `Bài tập thực hành tổng hợp: ${spec.title}`, objective: `Luyện tập ${spec.topic} qua 30 bài phân bậc.`, content, difficulty: 'MEDIUM', durationMinutes: 90, orderIndex: 99 } });
    }

    for (const exerciseData of javascriptPracticeBanks[spec.code]) {
        let exercise = await prisma.codingExercise.findFirst({ where: { lessonId: lesson.id, title: exerciseData.title } });
        if (!exercise) {
            exercise = await prisma.codingExercise.create({
                data: { lessonId: lesson.id, title: exerciseData.title, difficulty: exerciseData.difficulty,
                    problemDescription: exerciseData.problemDescription, starterCode: exerciseData.starterCode, solutionCode: exerciseData.solutionCode },
            });
        } else {
            exercise = await prisma.codingExercise.update({ where: { id: exercise.id }, data: {
                difficulty: exerciseData.difficulty, problemDescription: exerciseData.problemDescription,
                starterCode: exerciseData.starterCode, solutionCode: exerciseData.solutionCode,
            } });
        }
        await prisma.testCase.deleteMany({ where: { exerciseId: exercise.id } });
        await prisma.testCase.createMany({ data: exerciseData.testCases.map((testCase) => ({ exerciseId: exercise.id, ...testCase })) });
    }
    const created = await prisma.codingExercise.count({ where: { lessonId: lesson.id } });
    if (created !== 30) throw new Error(`${practiceLessonId} phải có đúng 30 bài, hiện có ${created}`);
    console.log(`✓ ${practiceLessonId}: ${created} bài (10 EASY / 10 MEDIUM / 10 HARD)`);
}

export async function seedJavaScriptPracticeBanks(moduleCodes: readonly string[] = javascriptModules.map(({ code }) => code)): Promise<void> {
    const requestedCodes = new Set(moduleCodes);
    const selectedModules = javascriptModules.filter(({ code }) => requestedCodes.has(code));
    if (selectedModules.length !== requestedCodes.size) {
        const knownCodes = new Set(selectedModules.map(({ code }) => code));
        throw new Error(`Module JavaScript không hợp lệ: ${[...requestedCodes].filter((code) => !knownCodes.has(code)).join(', ')}`);
    }
    for (const spec of selectedModules) await seedJavaScriptPracticeBank(spec);
}

if (require.main === module) {
    const requestedModules = process.argv.slice(2);
    seedJavaScriptPracticeBanks(requestedModules.length ? requestedModules : undefined)
        .catch((error) => { console.error(error); process.exitCode = 1; })
        .finally(async () => { await prisma.$disconnect(); });
}
