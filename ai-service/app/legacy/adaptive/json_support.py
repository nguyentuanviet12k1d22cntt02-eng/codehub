import sys
import json
import re
from typing import Dict, Any, List
try:
    from app.llm.omniroute_client import generate_json_content
except ImportError:
    from core.omniroute_client import generate_json_content

try:
    from app.utils.sanitizer import sanitize_exercise_object
except ImportError:
    def sanitize_exercise_object(obj): return obj

# Đảm bảo UTF-8 encoding
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


def extract_json_from_llm(text: str) -> Dict[str, Any]:
    """Trích xuất và parse JSON an toàn từ phản hồi LLM"""
    if not text or not text.strip():
        raise ValueError("Phản hồi từ AI Gateway rỗng.")

    cleaned = text.strip()

    # 1. Tìm block code ```json { ... } ```
    code_block_match = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", cleaned, re.IGNORECASE)
    if code_block_match:
        raw_json = code_block_match.group(1).strip()
        try:
            return json.loads(raw_json, strict=False)
        except Exception:
            # Thử xóa dấu phẩy thừa (trailing commas)
            cleaned_block = re.sub(r",\s*([\]}])", r"\1", raw_json)
            try:
                return json.loads(cleaned_block, strict=False)
            except Exception:
                pass

    # 2. Xóa trailing comma trên toàn bộ text
    cleaned_no_trailing = re.sub(r",\s*([\]}])", r"\1", cleaned)

    # 3. Tìm vị trí '{' đầu tiên và dùng JSONDecoder.raw_decode
    first_brace = cleaned_no_trailing.find("{")
    if first_brace != -1:
        try:
            decoder = json.JSONDecoder(strict=False)
            obj, _ = decoder.raw_decode(cleaned_no_trailing[first_brace:])
            return obj
        except Exception:
            last_brace = cleaned_no_trailing.rfind("}")
            if last_brace != -1 and last_brace > first_brace:
                try:
                    return json.loads(cleaned_no_trailing[first_brace:last_brace + 1], strict=False)
                except Exception:
                    pass

    # 4. Parse trực tiếp với strict=False
    return json.loads(cleaned, strict=False)

def normalize_test_cases(raw_cases: Any) -> List[Dict[str, Any]]:
    """Chuẩn hóa cấu trúc test_cases từ LLM, bảo vệ chống lỗi 'list object has no attribute get'"""
    if not isinstance(raw_cases, list):
        return []

    normalized = []
    i = 0
    while i < len(raw_cases):
        item = raw_cases[i]
        if isinstance(item, dict):
            # Nếu expected_output trống hoặc bị rỗng mà item kế tiếp lại là list hoặc dict
            exp = item.get("expected_output", "")
            if (exp == "" or exp is None) and (i + 1 < len(raw_cases)) and not isinstance(raw_cases[i+1], dict):
                next_item = raw_cases[i+1]
                item["expected_output"] = json.dumps(next_item, ensure_ascii=False) if isinstance(next_item, (list, dict)) else str(next_item)
                i += 1

            inp = item.get("input", "")
            exp_val = item.get("expected_output", "")
            normalized.append({
                "input": json.dumps(inp, ensure_ascii=False) if isinstance(inp, (list, dict)) else str(inp),
                "expected_output": json.dumps(exp_val, ensure_ascii=False) if isinstance(exp_val, (list, dict)) else str(exp_val),
                "is_hidden": bool(item.get("is_hidden", False)),
                "explanation": str(item.get("explanation", ""))
            })
        elif isinstance(item, (list, tuple)):
            if len(item) >= 2:
                normalized.append({
                    "input": json.dumps(item[0], ensure_ascii=False) if isinstance(item[0], (list, dict)) else str(item[0]),
                    "expected_output": json.dumps(item[1], ensure_ascii=False) if isinstance(item[1], (list, dict)) else str(item[1]),
                    "is_hidden": False,
                    "explanation": ""
                })
        i += 1
    return normalized
