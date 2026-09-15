const rawInput1 = '"Sữa", 20, 5, false';
const rawInput2 = '"Bánh", 10, 8, true';
const rawInput3 = '"Kẹo", 8, 5, false';

function parseArgs(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    
    // Normalize Python booleans/None if any
    let norm = trimmed
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/\bNone\b/g, 'null');
        
    // If it starts with '(' or '[' and ends with ')' or ']', replace outer brackets with []
    if ((norm.startsWith('(') && norm.endsWith(')')) || (norm.startsWith('[') && norm.endsWith(']'))) {
        norm = norm.slice(1, -1);
    }
    
    try {
        const parsed = eval('[' + norm + ']');
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch(e) {
        // Fallback: split by comma
        try {
            return norm.split(',').map(s => {
                const t = s.trim();
                if (t === 'true') return true;
                if (t === 'false') return false;
                if (!isNaN(t)) return Number(t);
                return t.replace(/^["']|["']$/g, '');
            });
        } catch(e2) {
            return [raw];
        }
    }
}

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

    return `Sản phẩm ${itemName}: Tồn kho ${currentStock} (${status})${warning}`;
}

console.log("Test 1:", manageInventory(...parseArgs(rawInput1)));
console.log("Test 2:", manageInventory(...parseArgs(rawInput2)));
console.log("Test 3:", manageInventory(...parseArgs(rawInput3)));
