import { prisma } from '../config/prisma';
import { ExerciseDifficulty } from '@prisma/client';

async function main() {
    console.log('Bắt đầu nạp danh sách bài tập luyện tập độc lập...');

    // 1. Tạo các Tags
    const tagArray = await prisma.problemTag.upsert({
        where: { slug: 'array' },
        update: {},
        create: { name: 'Array', slug: 'array' }
    });

    const tagHashTable = await prisma.problemTag.upsert({
        where: { slug: 'hash-table' },
        update: {},
        create: { name: 'Hash Table', slug: 'hash-table' }
    });

    const tagLinkedList = await prisma.problemTag.upsert({
        where: { slug: 'linked-list' },
        update: {},
        create: { name: 'Linked List', slug: 'linked-list' }
    });

    const tagMath = await prisma.problemTag.upsert({
        where: { slug: 'math' },
        update: {},
        create: { name: 'Math', slug: 'math' }
    });

    const tagString = await prisma.problemTag.upsert({
        where: { slug: 'string' },
        update: {},
        create: { name: 'String', slug: 'string' }
    });

    const tagSlidingWindow = await prisma.problemTag.upsert({
        where: { slug: 'sliding-window' },
        update: {},
        create: { name: 'Sliding Window', slug: 'sliding-window' }
    });

    // 2. Bài 1: Two Sum
    const twoSumStarter = {
        PYTHON: `import sys

def solve():
    # Đọc toàn bộ đầu vào từ Standard Input (stdin)
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    n = int(input_data[0])
    nums = [int(x) for x in input_data[1:n+1]]
    target = int(input_data[n+1])
    
    # Viết code xử lý của bạn ở đây và in chỉ số ra stdout
    pass

if __name__ == '__main__':
    solve()`,
        JAVASCRIPT: `const fs = require('fs');

function solve() {
    // Đọc toàn bộ đầu vào từ Standard Input (stdin)
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (input.length < 3) return;
    
    const n = parseInt(input[0], 10);
    const nums = [];
    for (let i = 0; i < n; i++) {
        nums.push(parseInt(input[1 + i], 10));
    }
    const target = parseInt(input[1 + n], 10);
    
    // Viết code xử lý của bạn ở đây
    
}

solve();`,
        CPP: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Đọc toàn bộ đầu vào từ Standard Input (stdin)
    int n;
    if (!(cin >> n)) return 0;
    
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    
    int target;
    cin >> target;
    
    // Viết code xử lý của bạn ở đây
    
    return 0;
}`,
        C: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Đọc toàn bộ đầu vào từ Standard Input (stdin)
    int n;
    if (scanf("%d", &n) != 1) return 0;
    
    int *nums = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &nums[i]) != 1) return 0;
    }
    
    int target;
    if (scanf("%d", &target) != 1) return 0;
    
    // Viết code xử lý của bạn ở đây
    
    free(nums);
    return 0;
}`
    };

    const twoSumSolution = {
        PYTHON: `import sys

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
    solve()`,
        JAVASCRIPT: `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (input.length < 3) return;
    const n = parseInt(input[0], 10);
    const nums = [];
    for (let i = 0; i < n; i++) {
        nums.push(parseInt(input[1 + i], 10));
    }
    const target = parseInt(input[1 + n], 10);
    
    const seen = {};
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (seen[diff] !== undefined) {
            console.log(seen[diff] + ' ' + i);
            break;
        }
        seen[nums[i]] = i;
    }
}

solve();`,
        CPP: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;
    
    unordered_map<int, int> seen;
    for (int i = 0; i < n; i++) {
        int diff = target - nums[i];
        if (seen.count(diff)) {
            cout << seen[diff] << " " << i << endl;
            break;
        }
        seen[nums[i]] = i;
    }
    return 0;
}`,
        C: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *nums = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        if (scanf("%d", &nums[i]) != 1) return 0;
    }
    int target;
    if (scanf("%d", &target) != 1) return 0;
    
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                printf("%d %d\\n", i, j);
                free(nums);
                return 0;
            }
        }
    }
    free(nums);
    return 0;
}`
    };

    const twoSumProblem = await prisma.practiceProblem.upsert({
        where: { slug: 'two-sum' },
        update: {},
        create: {
            title: 'Two Sum',
            slug: 'two-sum',
            difficulty: ExerciseDifficulty.EASY,
            description: `### Đề bài
Cho một mảng số nguyên \`nums\` và một số nguyên \`target\`. Hãy tìm chỉ số (index) của hai số trong mảng sao cho tổng của chúng bằng \`target\`.

Bạn có thể giả định rằng mỗi đầu vào sẽ có **chính xác một giải pháp**, và bạn không thể sử dụng cùng một phần tử hai lần.

Kết quả đầu ra có thể trả về theo bất kỳ thứ tự nào.

### Định dạng Đầu vào (Standard Input)
- Dòng đầu tiên chứa số nguyên \`N\` — số lượng phần tử của mảng.
- Dòng thứ hai chứa \`N\` số nguyên phân tách bởi khoảng trắng đại diện cho các phần tử của mảng \`nums\`.
- Dòng thứ ba chứa số nguyên \`target\`.

### Định dạng Đầu ra (Standard Output)
- In ra chỉ số của hai số trên cùng một dòng, phân tách bởi khoảng trắng.

### Ví dụ
**Đầu vào:**
\`\`\`text
4
2 7 11 15
9
\`\`\`

**Đầu ra:**
\`\`\`text
0 1
\`\`\``,
            starterCodes: twoSumStarter,
            solutionCodes: twoSumSolution,
            tags: {
                connect: [
                    { id: tagArray.id },
                    { id: tagHashTable.id }
                ]
            }
        }
    });

    // Generate a large testcase for Two Sum (N=3000) to measure algorithm complexity differences
    const largeN = 3000;
    const largeNums = Array.from({ length: largeN - 1 }, (_, i) => i * 2 + 1); // 1, 3, 5, ...
    largeNums.push(10000);
    const largeInput = `${largeN}\n${largeNums.join(' ')}\n10001`;
    const largeExpected = `0 ${largeN - 1}`;

    // Seed test cases for Two Sum
    const twoSumTCs = [
        { input: '4\n2 7 11 15\n9', expectedOutput: '0 1', isHidden: false },
        { input: '3\n3 2 4\n6', expectedOutput: '1 2', isHidden: false },
        { input: '2\n3 3\n6', expectedOutput: '0 1', isHidden: true },
        { input: '4\n-1 -2 -4 -5\n-5', expectedOutput: '0 2', isHidden: true },
        { input: '5\n10 20 30 40 50\n90', expectedOutput: '3 4', isHidden: true },
        { input: largeInput, expectedOutput: largeExpected, isHidden: true }
    ];

    // Clear and recreate to sync properly
    await prisma.practiceTestCase.deleteMany({
        where: { problemId: twoSumProblem.id }
    });

    for (const tc of twoSumTCs) {
        await prisma.practiceTestCase.create({
            data: {
                problemId: twoSumProblem.id,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                isHidden: tc.isHidden
            }
        });
    }

    // 3. Bài 2: Add Two Numbers
    const addTwoNumbersStarter = {
        PYTHON: `import sys

def solve():
    # Đọc toàn bộ đầu vào từ Standard Input (stdin)
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    n1 = int(input_data[0])
    l1 = [int(x) for x in input_data[1:n1+1]]
    
    n2 = int(input_data[n1+1])
    l2 = [int(x) for x in input_data[n1+2:n1+2+n2]]
    
    # Viết code xử lý của bạn ở đây và in kết quả ra stdout
    pass

if __name__ == '__main__':
    solve()`,
        JAVASCRIPT: `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (input.length < 4) return;
    
    const n1 = parseInt(input[0], 10);
    const l1 = [];
    for (let i = 0; i < n1; i++) {
        l1.push(parseInt(input[1 + i], 10));
    }
    
    const n2 = parseInt(input[1 + n1], 10);
    const l2 = [];
    for (let i = 0; i < n2; i++) {
        l2.push(parseInt(input[2 + n1 + i], 10));
    }
    
    // Viết code xử lý của bạn ở đây
    
}

solve();`,
        CPP: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n1;
    if (!(cin >> n1)) return 0;
    vector<int> l1(n1);
    for (int i = 0; i < n1; i++) cin >> l1[i];
    
    int n2;
    if (!(cin >> n2)) return 0;
    vector<int> l2(n2);
    for (int i = 0; i < n2; i++) cin >> l2[i];
    
    // Viết code xử lý của bạn ở đây
    
    return 0;
}`,
        C: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n1;
    if (scanf("%d", &n1) != 1) return 0;
    int *l1 = (int*)malloc(n1 * sizeof(int));
    for (int i = 0; i < n1; i++) {
        if (scanf("%d", &l1[i]) != 1) return 0;
    }
    
    int n2;
    if (scanf("%d", &n2) != 1) return 0;
    int *l2 = (int*)malloc(n2 * sizeof(int));
    for (int i = 0; i < n2; i++) {
        if (scanf("%d", &l2[i]) != 1) return 0;
    }
    
    // Viết code xử lý của bạn ở đây
    
    free(l1);
    free(l2);
    return 0;
}`
    };

    const addTwoNumbersSolution = {
        PYTHON: `import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    n1 = int(input_data[0])
    l1 = [int(x) for x in input_data[1:n1+1]]
    
    n2 = int(input_data[n1+1])
    l2 = [int(x) for x in input_data[n1+2:n1+2+n2]]
    
    res = []
    carry = 0
    i, j = 0, 0
    while i < len(l1) or j < len(l2) or carry:
        val1 = l1[i] if i < len(l1) else 0
        val2 = l2[j] if j < len(l2) else 0
        total = val1 + val2 + carry
        carry = total // 10
        res.append(total % 10)
        i += 1
        j += 1
    print(*(res))

if __name__ == '__main__':
    solve()`,
        JAVASCRIPT: `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (input.length < 4) return;
    
    const n1 = parseInt(input[0], 10);
    const l1 = [];
    for (let i = 0; i < n1; i++) {
        l1.push(parseInt(input[1 + i], 10));
    }
    
    const n2 = parseInt(input[1 + n1], 10);
    const l2 = [];
    for (let i = 0; i < n2; i++) {
        l2.push(parseInt(input[2 + n1 + i], 10));
    }
    
    const res = [];
    let carry = 0;
    let i = 0, j = 0;
    while (i < l1.length || j < l2.length || carry) {
        const val1 = i < l1.length ? l1[i] : 0;
        const val2 = j < l2.length ? l2[j] : 0;
        const total = val1 + val2 + carry;
        carry = Math.floor(total / 10);
        res.push(total % 10);
        i++;
        j++;
    }
    console.log(res.join(' '));
}

solve();`,
        CPP: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n1;
    if (!(cin >> n1)) return 0;
    vector<int> l1(n1);
    for (int i = 0; i < n1; i++) cin >> l1[i];
    
    int n2;
    if (!(cin >> n2)) return 0;
    vector<int> l2(n2);
    for (int i = 0; i < n2; i++) cin >> l2[i];

    vector<int> res;
    int carry = 0;
    int i = 0, j = 0;
    while (i < n1 || j < n2 || carry) {
        int val1 = (i < n1) ? l1[i] : 0;
        int val2 = (j < n2) ? l2[j] : 0;
        int total = val1 + val2 + carry;
        carry = total / 10;
        res.push_back(total % 10);
        i++;
        j++;
    }
    for (size_t k = 0; k < res.size(); k++) {
        cout << res[k] << (k == res.size() - 1 ? "" : " ");
    }
    cout << endl;
    return 0;
}`,
        C: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n1;
    if (scanf("%d", &n1) != 1) return 0;
    int *l1 = (int*)malloc(n1 * sizeof(int));
    for (int i = 0; i < n1; i++) {
        if (scanf("%d", &l1[i]) != 1) return 0;
    }
    
    int n2;
    if (scanf("%d", &n2) != 1) return 0;
    int *l2 = (int*)malloc(n2 * sizeof(int));
    for (int i = 0; i < n2; i++) {
        if (scanf("%d", &l2[i]) != 1) return 0;
    }

    int *res = (int*)malloc((n1 > n2 ? n1 + 1 : n2 + 1) * sizeof(int));
    int carry = 0;
    int i = 0, j = 0, count = 0;
    while (i < n1 || j < n2 || carry) {
        int val1 = (i < n1) ? l1[i] : 0;
        int val2 = (j < n2) ? l2[j] : 0;
        int total = val1 + val2 + carry;
        carry = total / 10;
        res[count++] = total % 10;
        i++;
        j++;
    }
    for (int k = 0; k < count; k++) {
        printf("%d%s", res[k], (k == count - 1 ? "" : " "));
    }
    printf("\\n");
    free(l1);
    free(l2);
    free(res);
    return 0;
}`
    };

    const addTwoNumbersProblem = await prisma.practiceProblem.upsert({
        where: { slug: 'add-two-numbers' },
        update: {},
        create: {
            title: 'Add Two Numbers',
            slug: 'add-two-numbers',
            difficulty: ExerciseDifficulty.MEDIUM,
            description: `### Đề bài
Bạn được cho hai danh sách liên kết không rỗng đại diện cho hai số nguyên không âm. Các chữ số được lưu trữ theo thứ tự đảo ngược, và mỗi nút chứa một chữ số đơn lẻ. Hãy cộng hai số và trả về tổng dưới dạng một danh sách liên kết.

Bạn có thể giả định rằng hai số không chứa số 0 ở đầu, ngoại trừ chính số 0.

### Định dạng Đầu vào (Standard Input)
- Dòng 1: Số lượng phần tử \`N1\` của danh sách liên kết thứ nhất.
- Dòng 2: \`N1\` chữ số cách nhau bởi khoảng trắng đại diện cho danh sách liên kết thứ nhất.
- Dòng 3: Số lượng phần tử \`N2\` của danh sách liên kết thứ hai.
- Dòng 4: \`N2\` chữ số cách nhau bởi khoảng trắng đại diện cho danh sách liên kết thứ hai.

### Định dạng Đầu ra (Standard Output)
- In ra các chữ số của danh sách liên kết kết quả, phân tách bởi khoảng trắng.

### Ví dụ
**Đầu vào:**
\`\`\`text
3
2 4 3
3
5 6 4
\`\`\`

**Đầu ra:**
\`\`\`text
7 0 8
\`\`\`

**Giải thích:**
- Số thứ nhất: 342
- Số thứ hai: 465
- Tổng: 342 + 465 = 807 (được lưu dưới dạng 7 -> 0 -> 8)`,
            starterCodes: addTwoNumbersStarter,
            solutionCodes: addTwoNumbersSolution,
            tags: {
                connect: [
                    { id: tagLinkedList.id },
                    { id: tagMath.id }
                ]
            }
        }
    });

    const addTwoNumbersTCs = [
        { input: '3\n2 4 3\n3\n5 6 4', expectedOutput: '7 0 8', isHidden: false },
        { input: '1\n0\n1\n0', expectedOutput: '0', isHidden: false },
        { input: '7\n9 9 9 9 9 9 9\n4\n9 9 9 9', expectedOutput: '8 9 9 9 0 0 0 1', isHidden: true },
        { input: '2\n5 6\n3\n4 9 2', expectedOutput: '9 5 3', isHidden: true }
    ];

    // Clear and recreate to sync properly
    await prisma.practiceTestCase.deleteMany({
        where: { problemId: addTwoNumbersProblem.id }
    });

    for (const tc of addTwoNumbersTCs) {
        await prisma.practiceTestCase.create({
            data: {
                problemId: addTwoNumbersProblem.id,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                isHidden: tc.isHidden
            }
        });
    }

    // 4. Bài 3: Longest Substring Without Repeating Characters
    const longestSubstrStarter = {
        PYTHON: `import sys

def solve():
    # Đọc chuỗi từ Standard Input
    s = sys.stdin.read().rstrip('\\r\\n')
    
    # Viết code xử lý của bạn ở đây và in kết quả ra stdout
    pass

if __name__ == '__main__':
    solve()`,
        JAVASCRIPT: `const fs = require('fs');

function solve() {
    // Đọc chuỗi từ Standard Input
    const s = fs.readFileSync(0, 'utf-8').replace(/\\r?\\n$/, '');
    
    // Viết code xử lý của bạn ở đây
    
}

solve();`,
        CPP: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    if (!getline(cin, s)) {
        cout << 0 << endl;
        return 0;
    }
    
    // Viết code xử lý của bạn ở đây
    
    return 0;
}`,
        C: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main() {
    char *s = NULL;
    size_t len = 0;
    ssize_t read = getline(&s, &len, stdin);
    if (read == -1) {
        printf("0\\n");
        if (s) free(s);
        return 0;
    }
    // Loại bỏ ký tự xuống dòng
    while (read > 0 && (s[read - 1] == '\\n' || s[read - 1] == '\\r')) {
        s[read - 1] = '\\0';
        read--;
    }
    
    // Viết code xử lý của bạn ở đây
    
    free(s);
    return 0;
}`
    };

    const longestSubstrSolution = {
        PYTHON: `import sys

def solve():
    s = sys.stdin.read().rstrip('\\r\\n')
    char_map = {}
    max_len = 0
    start = 0
    for i, char in enumerate(s):
        if char in char_map and char_map[char] >= start:
            start = char_map[char] + 1
        char_map[char] = i
        max_len = max(max_len, i - start + 1)
    print(max_len)

if __name__ == '__main__':
    solve()`,
        JAVASCRIPT: `const fs = require('fs');

function solve() {
    const s = fs.readFileSync(0, 'utf-8').replace(/\\r?\\n$/, '');
    let charMap = new Map();
    let maxLen = 0;
    let start = 0;
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        if (charMap.has(char) && charMap.get(char) >= start) {
            start = charMap.get(char) + 1;
        }
        charMap.set(char, i);
        maxLen = Math.max(maxLen, i - start + 1);
    }
    console.log(maxLen);
}

solve();`,
        CPP: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    string s;
    if (!getline(cin, s)) {
        cout << 0 << endl;
        return 0;
    }
    vector<int> char_map(256, -1);
    int max_len = 0;
    int start = 0;
    for (int i = 0; i < s.length(); i++) {
        unsigned char c = s[i];
        if (char_map[c] >= start) {
            start = char_map[c] + 1;
        }
        char_map[c] = i;
        max_len = max(max_len, i - start + 1);
    }
    cout << max_len << endl;
    return 0;
}`,
        C: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main() {
    char *s = NULL;
    size_t len = 0;
    ssize_t read = getline(&s, &len, stdin);
    if (read == -1) {
        printf("0\\n");
        if (s) free(s);
        return 0;
    }
    while (read > 0 && (s[read - 1] == '\\n' || s[read - 1] == '\\r')) {
        s[read - 1] = '\\0';
        read--;
    }
    int char_map[256];
    for (int i = 0; i < 256; i++) char_map[i] = -1;
    int max_len = 0;
    int start = 0;
    for (int i = 0; i < read; i++) {
        unsigned char c = s[i];
        if (char_map[c] >= start) {
            start = char_map[c] + 1;
        }
        char_map[c] = i;
        int current_len = i - start + 1;
        if (current_len > max_len) {
            max_len = current_len;
        }
    }
    printf("%d\\n", max_len);
    free(s);
    return 0;
}`
    };

    const longestSubstrProblem = await prisma.practiceProblem.upsert({
        where: { slug: 'longest-substring-without-repeating-characters' },
        update: {},
        create: {
            title: 'Longest Substring Without Repeating Characters',
            slug: 'longest-substring-without-repeating-characters',
            difficulty: ExerciseDifficulty.MEDIUM,
            description: `### Đề bài
Cho một chuỗi \`s\`. Hãy tìm độ dài của chuỗi con dài nhất không chứa các ký tự lặp lại.

### Định dạng Đầu vào (Standard Input)
- Dòng đầu tiên và duy nhất chứa chuỗi \`s\` (chuỗi có thể chứa khoảng trắng và các ký tự đặc biệt).

### Định dạng Đầu ra (Standard Output)
- Một số nguyên duy nhất đại diện cho độ dài của chuỗi con dài nhất thỏa mãn yêu cầu.

### Ví dụ
**Đầu vào:**
\`\`\`text
abcabcbb
\`\`\`

**Đầu ra:**
\`\`\`text
3
\`\`\`

**Giải thích:**
- Các chuỗi con không lặp là "abc", "bca", "cab" đều có độ dài bằng 3.`,
            starterCodes: longestSubstrStarter,
            solutionCodes: longestSubstrSolution,
            tags: {
                connect: [
                    { id: tagString.id },
                    { id: tagHashTable.id },
                    { id: tagSlidingWindow.id }
                ]
            }
        }
    });

    const longestSubstrTCs = [
        { input: 'abcabcbb', expectedOutput: '3', isHidden: false },
        { input: 'bbbbb', expectedOutput: '1', isHidden: false },
        { input: 'pwwkew', expectedOutput: '3', isHidden: true },
        { input: 'abc def!@#abc', expectedOutput: '10', isHidden: true },
        { input: '', expectedOutput: '0', isHidden: true }
    ];

    // Clear and recreate to sync properly
    await prisma.practiceTestCase.deleteMany({
        where: { problemId: longestSubstrProblem.id }
    });

    for (const tc of longestSubstrTCs) {
        await prisma.practiceTestCase.create({
            data: {
                problemId: longestSubstrProblem.id,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                isHidden: tc.isHidden
            }
        });
    }

    console.log('Nạp dữ liệu mẫu luyện tập độc lập hoàn thành thành công!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
