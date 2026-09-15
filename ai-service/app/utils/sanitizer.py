import re
from typing import Any, Dict, List, Union

# Regex nhận diện ký tự chữ Hán / CJK (Trung - Nhật - Hàn)
CJK_REGEX = re.compile(r'[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]')

# Bản đồ chuyển ngữ tự động các cụm từ code tiếng Trung phổ biến sang tiếng Việt
CJK_PHRASE_MAPPINGS = [
    ("在这里写代码", "Viết mã tại đây"),
    ("在此处编写代码", "Viết mã tại đây"),
    ("在下方编写代码", "Viết mã tại đây"),
    ("在下方写代码", "Viết mã tại đây"),
    ("请在此处编写代码", "Vui lòng viết mã tại đây"),
    ("写代码", "Viết mã"),
    ("编写代码", "Viết mã"),
    ("你的代码", "Mã của bạn"),
    ("代码", "mã nguồn"),
    ("输入", "Đầu vào"),
    ("输出", "Đầu ra"),
    ("测试用例", "Test case"),
    ("函数", "Hàm"),
    ("返回值", "Giá trị trả về"),
    ("参数", "Tham số"),
    ("例如", "Ví dụ"),
    ("注意", "Lưu ý"),
    ("提示", "Gợi ý"),
]


def contains_cjk(text: str) -> bool:
    """Kiểm tra chuỗi có chứa ký tự tiếng Trung/CJK hay không"""
    if not text or not isinstance(text, str):
        return False
    return bool(CJK_REGEX.search(text))


def sanitize_cjk_artifacts(text: str) -> str:
    """
    Làm sạch triệt để các ký tự và cụm từ tiếng Trung:
    1. Thay thế các cụm từ ngữ cảnh code sang tiếng Việt tự nhiên.
    2. Loại bỏ bất kỳ ký tự CJK đơn lẻ nào còn sót lại.
    """
    if not text or not isinstance(text, str):
        return text

    cleaned = text
    # 1. Thay thế cụm từ đã biết
    for cjk_phrase, vi_phrase in CJK_PHRASE_MAPPINGS:
        if cjk_phrase in cleaned:
            cleaned = cleaned.replace(cjk_phrase, vi_phrase)

    # 2. Xóa các ký tự CJK đơn lẻ còn sót lại
    if CJK_REGEX.search(cleaned):
        cleaned = CJK_REGEX.sub("", cleaned)
        # Làm sạch khoảng trắng thừa do xóa ký tự
        cleaned = re.sub(r"[ \t]+", " ", cleaned)

    # 3. Chuyển đổi các ký tự LaTeX toán học thô (như $\rightarrow$, \rightarrow) sang Unicode
    latex_arrows = [
        (r"\$\s*\\rightarrow\s*\$", "→"),
        (r"\\rightarrow", "→"),
        (r"\$\s*\\Rightarrow\s*\$", "⇒"),
        (r"\\Rightarrow", "⇒"),
        (r"\$\s*\\leftarrow\s*\$", "←"),
        (r"\\leftarrow", "←"),
    ]
    for pattern, uni_arrow in latex_arrows:
        cleaned = re.sub(pattern, uni_arrow, cleaned)

    return cleaned


def sanitize_exercise_object(data: Any) -> Any:
    """
    Duyệt đệ quy toàn bộ cấu trúc dữ liệu của bài tập (Dict, List, Str)
    và khử trùng 100% tiếng Trung sang tiếng Việt.
    """
    if isinstance(data, str):
        return sanitize_cjk_artifacts(data)
    elif isinstance(data, dict):
        return {k: sanitize_exercise_object(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_exercise_object(item) for item in data]
    return data
