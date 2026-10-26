"""Build a concise learner-facing statement from the verified exercise data."""

import json
import re
from pydantic import BaseModel, ConfigDict, Field


class StatementSections(BaseModel):
    """Generation-only shape; learner/storage contracts remain Markdown strings."""
    model_config = ConfigDict(extra="forbid", strict=True)
    description_sentences: list[str] = Field(min_length=2, max_length=4)
    input: str = Field(min_length=5)
    output: str = Field(min_length=5)

    def markdown(self):
        return ("## Mô tả\n" + " ".join(sentence.strip() for sentence in self.description_sentences)
                + f"\n\n## Input\n{self.input.strip()}\n\n## Output\n{self.output.strip()}")
from pydantic import BaseModel, ConfigDict, Field


class StatementSections(BaseModel):
    """Generation-only shape; learner/storage contracts remain Markdown strings."""
    model_config = ConfigDict(extra="forbid", strict=True)
    description_sentences: list[str] = Field(min_length=2, max_length=4)
    input: str = Field(min_length=5)
    output: str = Field(min_length=5)

    def markdown(self):
        return ("## Mô tả\n" + " ".join(sentence.strip() for sentence in self.description_sentences)
                + f"\n\n## Input\n{self.input.strip()}\n\n## Output\n{self.output.strip()}")


SECTION = re.compile(r"(?m)^#{1,3}\s+(Mô tả|Input|Output|Ví dụ|Ràng buộc)\s*$")


def sections(statement):
    matches = list(SECTION.finditer(statement))
    return {match.group(1): statement[match.end():matches[index + 1].start() if index + 1 < len(matches) else None].strip()
            for index, match in enumerate(matches)}


def example_values(test, mode):
    if mode == "function":
        value = json.dumps(test.get("arguments"), ensure_ascii=False, separators=(",", ":"))
    elif mode == "sql":
        value = test.get("fixture_sql") or ""
    else:
        value = test.get("input") or ""
    return value, test.get("expected_output") or ""


def format_statement(draft, mode):
    """Use the first public test as the sole example; never trust a second LLM answer."""
    original = draft.get("problem_statement", "")
    if isinstance(original, dict):
        try:
            original = StatementSections.model_validate(original).markdown()
        except (ValueError, TypeError):
            # Leave malformed model data to SchemaValidator; never invent prose.
            return original
    if not isinstance(original, str):
        return original
    if isinstance(original, dict):
        try:
            original = StatementSections.model_validate(original).markdown()
        except (ValueError, TypeError):
            # Leave malformed model data to SchemaValidator; never invent prose.
            return original
    if not isinstance(original, str):
        return original
    parts = sections(original)
    if not all(parts.get(name) for name in ("Mô tả", "Input", "Output")):
        return original
    public = next((test for test in draft.get("test_cases", []) if not test.get("is_hidden")), None)
    if public is None:
        return original
    sample_input, sample_output = example_values(public, mode)
    # Fences cannot represent literal triple-backticks inside an example.
    fence = "````" if "```" in sample_input + sample_output else "```"
    statement = (f"## Mô tả\n{parts['Mô tả']}\n\n"
                 f"## Input\n{parts['Input']}\n\n"
                 f"## Output\n{parts['Output']}\n\n"
                 f"## Ví dụ\n**Input**\n{fence}text\n{sample_input.rstrip(chr(10))}\n{fence}\n\n"
                 f"**Output**\n{fence}text\n{sample_output.rstrip(chr(10))}\n{fence}")
    constraints = [item.strip() for item in draft.get("constraints", []) if isinstance(item, str) and item.strip()]
    if constraints:
        statement += "\n\n## Ràng buộc\n" + "\n".join(f"- {item}" for item in constraints)
    return statement


def validate_statement(draft, mode):
    statement = draft.problem_statement
    matches = list(SECTION.finditer(statement))
    names = [match.group(1) for match in matches]
    expected_names = ["Mô tả", "Input", "Output", "Ví dụ"]
    if draft.constraints:
        expected_names.append("Ràng buộc")
    if not matches or names != expected_names or statement[:matches[0].start()].strip():
        return ["Đề bài phải theo thứ tự Mô tả, Input, Output, Ví dụ; chỉ có Ràng buộc khi cần."]
    parts = sections(statement)
    errors = []
    description = parts["Mô tả"]
    if not parts["Input"] or not parts["Output"]:
        errors.append("Input và Output phải mô tả dữ liệu/kết quả cụ thể, không được để trống.")
    sentences = [part for part in re.split(r"(?<=[.!?])\s+", description) if part.strip()]
    if not 2 <= len(sentences) <= 4:
        errors.append("Mô tả cần 2–4 câu ngắn, chỉ nêu nhiệm vụ lập trình.")
    if len(description.split()) > 85 or len(parts["Input"].split()) > 45 or len(parts["Output"].split()) > 45:
        errors.append("Mô tả/Input/Output còn dài; hãy viết ngắn gọn, đi thẳng vào nhiệm vụ.")
    prose_words = len(" ".join((draft.title, description, parts["Input"], parts["Output"],
                                 parts.get("Ràng buộc", ""))).split())
    if prose_words > (190 if mode == "sql" else 130):
        errors.append("Phần lời của đề quá dài; ưu tiên khoảng 50–100 từ, trừ dữ liệu ví dụ cần thiết.")
    if re.search(r"(?i)\b(?:lý thuyết|gợi ý|cách giải|bước 1|bước 2)\b", description):
        errors.append("Đề không được đưa lý thuyết hay hướng dẫn giải vào phần Mô tả.")
    if len(draft.title.split()) > 12 or re.search(r"[\n.!?]", draft.title):
        errors.append("Tên bài phải ngắn gọn và không chứa lời dẫn.")
    public = next((test for test in draft.test_cases if not test.is_hidden), None)
    if public:
        expected_example = sections(format_statement(draft.model_dump(), mode)).get("Ví dụ")
        if parts["Ví dụ"] != expected_example:
            errors.append("Ví dụ Input/Output phải khớp chính xác với test công khai đầu tiên.")
    if draft.constraints and parts.get("Ràng buộc") != "\n".join(f"- {item.strip()}" for item in draft.constraints):
        errors.append("Ràng buộc hiển thị phải khớp danh sách ràng buộc của bài.")
    return errors


def validate_task_wording(draft, spec):
    """Text-only requirements, shared by the validator and repair dispatcher."""
    errors = []
    if spec.target_concept not in {"PY-FLOW-02", "PY-FLOW-03", "JS-LOOP-01", "CPP-LOOP-01"}:
        return errors
    visible_task = " ".join([draft.problem_statement, *draft.constraints])
    for construct in ("for", "while"):
        if construct in spec.required_constructs and not re.search(rf"\b{construct}\b", visible_task, re.I):
            errors.append(f"Đề bài phải nói rõ học viên cần luyện vòng lặp {construct}.")
        if construct in spec.forbidden_constructs:
            for match in re.finditer(
                rf"\b(?:dùng|sử dụng|áp dụng|viết|triển khai|bằng)\s+(?:vòng lặp\s+)?{construct}\b",
                visible_task, re.I):
                prefix = visible_task[max(0, match.start() - 24):match.start()].casefold()
                if not re.search(r"(?:không(?:\s+được)?|tránh|cấm|đừng)\s*$", prefix):
                    errors.append(f"Đề bài đòi dùng {construct} dù đặc tả cấm cấu trúc này.")
                    break
    return errors
