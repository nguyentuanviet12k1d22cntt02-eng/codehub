from __future__ import annotations

import os
from dataclasses import dataclass


def _bounded_int(name: str, default: int, minimum: int, maximum: int) -> int:
    raw = os.getenv(name, str(default))
    try:
        value = int(raw)
    except ValueError as exc:
        raise RuntimeError(f"{name} must be an integer") from exc
    if not minimum <= value <= maximum:
        raise RuntimeError(f"{name} must be between {minimum} and {maximum}")
    return value


@dataclass(frozen=True)
class Settings:
    api_token: str
    max_concurrency: int
    max_queue: int
    queue_timeout_seconds: int
    output_limit_bytes: int
    python_image: str
    javascript_image: str
    c_image: str
    cpp_image: str
    jobs_dir: str

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            api_token=os.getenv("GRADER_API_TOKEN", ""),
            max_concurrency=_bounded_int("GRADER_MAX_CONCURRENCY", 1, 1, 3),
            max_queue=_bounded_int("GRADER_MAX_QUEUE", 8, 0, 32),
            queue_timeout_seconds=_bounded_int("GRADER_QUEUE_TIMEOUT_SECONDS", 30, 1, 120),
            output_limit_bytes=_bounded_int("GRADER_OUTPUT_LIMIT_BYTES", 131_072, 4_096, 524_288),
            python_image=os.getenv("GRADER_PYTHON_IMAGE", "learnpython-grader-python:3.11"),
            javascript_image=os.getenv("GRADER_JAVASCRIPT_IMAGE", "learnpython-grader-node:20"),
            c_image=os.getenv("GRADER_C_IMAGE", "learnpython-grader-gcc:14"),
            cpp_image=os.getenv("GRADER_CPP_IMAGE", "learnpython-grader-gcc:14"),
            jobs_dir=os.getenv("GRADER_JOBS_DIR", "/var/lib/learnpython-grader/jobs"),
        )

