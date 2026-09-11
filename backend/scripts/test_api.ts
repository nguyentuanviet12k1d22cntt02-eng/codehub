async function runTests() {
    const baseURL = 'http://localhost:3000/api/auth';
    console.log('--- KHỞI ĐỘNG KIỂM THỬ HỆ THỐNG APIS ARENA ---');

    // 1. Tạo tài khoản ngẫu nhiên để tránh xung đột
    const rand = Math.floor(Math.random() * 100000);
    const testUser = {
        username: `tester_${rand}`,
        email: `tester_${rand}@mcode.com`,
        password: 'password123'
    };

    console.log(`\n1. Đăng ký tài khoản: ${testUser.username}...`);
    try {
        const regRes = await fetch(`${baseURL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const data = await regRes.json() as any;
        if (!regRes.ok) throw new Error(data.message || 'Đăng ký lỗi');
        console.log('✓ Đăng ký thành công:', data.message);
    } catch (err: any) {
        console.error('✗ Đăng ký thất bại:', err.message);
        return;
    }

    // 2. Đăng nhập để lấy token
    console.log('\n2. Đăng nhập tài khoản...');
    let token = '';
    try {
        const loginRes = await fetch(`${baseURL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        const data = await loginRes.json() as any;
        if (!loginRes.ok) throw new Error(data.message || 'Đăng nhập lỗi');
        token = data.token;
        console.log('✓ Đăng nhập thành công, nhận token!');
    } catch (err: any) {
        console.error('✗ Đăng nhập thất bại:', err.message);
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // 3. Lấy danh sách bài tập
    console.log('\n3. Lấy danh sách bài tập (Practice Problems)...');
    let problems: any[] = [];
    try {
        const probRes = await fetch(`${baseURL}/practice/problems`, {
            headers
        });
        const data = await probRes.json() as any;
        if (!probRes.ok) throw new Error(data.error || 'Lấy danh sách lỗi');
        problems = data.problems;
        console.log(`✓ Tìm thấy ${problems.length} bài tập:`);
        problems.forEach(p => console.log(`  - [${p.difficulty}] ${p.title} (Status: ${p.status})`));
    } catch (err: any) {
        console.error('✗ Lấy danh sách thất bại:', err.message);
        return;
    }

    if (problems.length === 0) {
        console.log('✗ Không có bài tập nào để test tiếp.');
        return;
    }

    // 4. Lấy chi tiết bài tập Two Sum
    console.log('\n4. Lấy chi tiết bài tập "Two Sum"...');
    let twoSum: any = null;
    try {
        const detailRes = await fetch(`${baseURL}/practice/problems/two-sum`);
        const data = await detailRes.json() as any;
        if (!detailRes.ok) throw new Error(data.error || 'Lấy chi tiết lỗi');
        twoSum = data;
        console.log('✓ Lấy chi tiết thành công!');
        console.log('  Tiêu đề:', twoSum.title);
        console.log('  Số testcases công khai:', twoSum.testCases?.length);
    } catch (err: any) {
        console.error('✗ Lấy chi tiết thất bại:', err.message);
        return;
    }

    // 5. Chạy thử code (Run practice compiler)
    console.log('\n5. Chạy thử code Python (Two Sum)...');
    const dummyCode = `import sys
print("Hello Standard I/O")
`;
    try {
        const runRes = await fetch(`${baseURL}/practice/compiler/run`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: dummyCode,
                language: 'PYTHON',
                input: 'some dummy input'
            })
        });
        const data = await runRes.json() as any;
        if (!runRes.ok) throw new Error(data.error || 'Chạy thử lỗi');
        console.log('✓ Chạy thử hoàn tất. Output:');
        console.log(data.output);
    } catch (err: any) {
        console.error('✗ Chạy thử thất bại:', err.message);
        return;
    }

    // 6. Nộp bài giải Two Sum chính thức
    console.log('\n6. Nộp bài giải chính thức cho Two Sum...');
    const solutionCode = `import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    nums = [int(x) for x in input_data[1:n+1]]
    target = int(input_data[n+1])
    
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            print(seen[diff], i)
            break
        seen[num] = i

if __name__ == '__main__':
    solve()
`;

    try {
        const submitRes = await fetch(`${baseURL}/practice/problems/${twoSum.id}/submit`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                code: solutionCode,
                language: 'PYTHON'
            })
        });
        const data = await submitRes.json() as any;
        if (!submitRes.ok) throw new Error(data.error || 'Nộp bài lỗi');
        
        console.log('✓ Chấm điểm hoàn tất!');
        console.log('  Tất cả testcase đạt?:', data.allPassed);
        console.log('  Thời gian chạy trung bình:', data.runtimeMs, 'ms');
        console.log('  Hiệu năng beats:', data.runtimeBeats, '%');
        console.log('  Số lượng testcase trả về:', data.results?.length);
        console.log('  Chi tiết kết quả testcases:');
        data.results.forEach((r: any, idx: number) => {
            console.log(`    - Testcase #${idx+1} (${r.isHidden ? 'Hidden' : 'Public'}): Passed = ${r.passed}`);
            console.log(`      Input: ${JSON.stringify(r.input)}`);
            console.log(`      Expected: ${JSON.stringify(r.expectedOutput)}`);
            console.log(`      Actual: ${JSON.stringify(r.actualOutput)}`);
        });
    } catch (err: any) {
        console.error('✗ Nộp bài thất bại:', err.message);
        return;
    }

    // 7. Lấy Bảng xếp hạng để xác minh
    console.log('\n7. Lấy Bảng xếp hạng (Leaderboard)...');
    try {
        const lbRes = await fetch(`${baseURL}/practice/leaderboard`);
        const data = await lbRes.json() as any;
        if (!lbRes.ok) throw new Error('Tải bảng xếp hạng lỗi');
        console.log('✓ Tải bảng xếp hạng thành công:');
        data.forEach((entry: any) => {
            console.log(`  Hạng ${entry.rank}: ${entry.username} - ${entry.score} điểm (Giải được: ${entry.solvedCount} bài)`);
        });
    } catch (err: any) {
        console.error('✗ Tải bảng xếp hạng thất bại:', err.message);
        return;
    }

    console.log('\n--- TẤT CẢ KIỂM THỬ HOÀN TẤT VÀ THÀNH CÔNG ---');
}

runTests();
