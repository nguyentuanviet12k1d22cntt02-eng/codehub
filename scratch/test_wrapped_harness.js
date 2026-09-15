const userCode = `
function manageInventory(itemName, initialStock, soldQty, isRestocked) {
    const MIN_STOCK = 5;

    let currentStock = initialStock - soldQty;
    let warning = "";

    if (isRestocked) {
        let bonus = 10;
        currentStock += bonus;

        var status = "Đã nhập thêm";
    } else {
        var status = "Bình thường";
    }

    if (currentStock < MIN_STOCK) {
        warning = " - Cần nhập hàng gấp!";
    }

    return \`Sản phẩm \${itemName}: Tồn kho \${currentStock} (\${status})\${warning}\`;
}
`;

function buildWrappedCode(code, rawInput) {
    return `
${code}

(function __runner() {
    let targetFn = null;

    // 1. Try finding function by matching names in code
    const funcRegex = /(?:function\\s+([a-zA-Z0-9_$]+)|(?:const|let|var)\\s+([a-zA-Z0-9_$]+)\\s*=\\s*(?:function|\\([^)]*\\)\\s*=>|[a-zA-Z0-9_$]+\\s*=>))/g;
    const candidates = [];
    let m;
    const codeStr = ${JSON.stringify(code)};
    while ((m = funcRegex.exec(codeStr)) !== null) {
        const fnName = m[1] || m[2];
        if (fnName && fnName !== '__runner') {
            try {
                const fnObj = eval(fnName);
                if (typeof fnObj === 'function') {
                    candidates.push({ name: fnName, fn: fnObj });
                }
            } catch (e) {}
        }
    }

    if (candidates.length > 0) {
        const pref = candidates.find(c => c.name === 'solution') || candidates[candidates.length - 1];
        targetFn = pref.fn;
    }

    if (!targetFn) {
        return;
    }

    const raw = ${JSON.stringify(rawInput)};
    let args = [];
    if (raw && raw.trim().length > 0) {
        let trimmed = raw.trim();
        let norm = trimmed
            .replace(/\\bTrue\\b/g, 'true')
            .replace(/\\bFalse\\b/g, 'false')
            .replace(/\\bNone\\b/g, 'null');

        if ((norm.startsWith('(') && norm.endsWith(')')) || (norm.startsWith('[') && norm.endsWith(']'))) {
            norm = norm.slice(1, -1).trim();
        }

        try {
            args = eval('[' + norm + ']');
            if (!Array.isArray(args)) args = [args];
        } catch (e1) {
            try {
                const p = JSON.parse(trimmed);
                args = Array.isArray(p) ? p : [p];
            } catch (e2) {
                if (trimmed.includes(',')) {
                    args = trimmed.split(',').map(s => {
                        const t = s.trim();
                        if (t === 'true') return true;
                        if (t === 'false') return false;
                        if (!isNaN(t) && t !== '') return Number(t);
                        return t.replace(/^["']|["']$/g, '');
                    });
                } else {
                    args = [trimmed];
                }
            }
        }
    }

    try {
        const out = targetFn(...args);
        if (out !== undefined && out !== null) {
            if (typeof out === 'object') {
                console.log(JSON.stringify(out));
            } else {
                console.log(out);
            }
        }
    } catch (err) {
        console.error(err);
    }
})();
`;
}

// Test case 1
const wrapped1 = buildWrappedCode(userCode, '"Sữa", 20, 5, false');
eval(wrapped1);

// Test case 2
const wrapped2 = buildWrappedCode(userCode, '"Bánh", 10, 8, true');
eval(wrapped2);

// Test case 3
const wrapped3 = buildWrappedCode(userCode, '"Kẹo", 8, 5, false');
eval(wrapped3);
