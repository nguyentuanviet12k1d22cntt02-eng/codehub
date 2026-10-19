#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import signal
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Any

try:
    import resource
except ImportError:  # Local Windows verification only; production images are Linux.
    resource = None


WORK = Path(os.getenv("GRADER_WORK_DIR", "/work"))


def _read_limited(handle: Any, limit: int) -> tuple[str, bool]:
    handle.seek(0)
    raw = handle.read(limit + 1)
    # RLIMIT_FSIZE stops the child exactly at ``limit`` bytes. Some runtimes
    # turn SIGXFSZ into an ordinary write error and exit non-zero, so waiting
    # for limit + 1 bytes would misclassify the event as a runtime error.
    exceeded = len(raw) >= limit
    return raw[:limit].decode("utf-8", errors="replace"), exceeded


def _limits(memory_kb: int, output_limit: int, limit_virtual_memory: bool):
    def apply() -> None:
        if resource is None:
            return
        memory_bytes = memory_kb * 1024
        resource.setrlimit(resource.RLIMIT_CORE, (0, 0))
        resource.setrlimit(resource.RLIMIT_FSIZE, (output_limit, output_limit))
        resource.setrlimit(resource.RLIMIT_NOFILE, (32, 32))
        if hasattr(resource, "RLIMIT_NPROC"):
            resource.setrlimit(resource.RLIMIT_NPROC, (32, 32))
        if limit_virtual_memory and hasattr(resource, "RLIMIT_AS"):
            resource.setrlimit(resource.RLIMIT_AS, (memory_bytes, memory_bytes))
        os.setsid()
    return apply if os.name == "posix" else None


def _run(
    command: list[str],
    stdin: str,
    timeout_ms: int,
    memory_kb: int,
    output_limit: int,
    limit_virtual_memory: bool,
) -> dict[str, Any]:
    started = time.monotonic()
    with tempfile.TemporaryFile() as stdout_file, tempfile.TemporaryFile() as stderr_file:
        process = subprocess.Popen(
            command,
            cwd=WORK,
            stdin=subprocess.PIPE,
            stdout=stdout_file,
            stderr=stderr_file,
            start_new_session=os.name != "posix",
            preexec_fn=_limits(memory_kb, output_limit, limit_virtual_memory),
        )
        timed_out = False
        try:
            process.communicate(stdin.encode("utf-8"), timeout=timeout_ms / 1000)
        except subprocess.TimeoutExpired:
            timed_out = True
            if os.name == "posix":
                try:
                    os.killpg(process.pid, signal.SIGKILL)
                except ProcessLookupError:
                    pass
            else:
                process.kill()
            process.wait(timeout=1)
        runtime_ms = max(0, round((time.monotonic() - started) * 1000))
        stdout, stdout_exceeded = _read_limited(stdout_file, output_limit)
        stderr, stderr_exceeded = _read_limited(stderr_file, output_limit)

    if timed_out:
        return {"stdout": stdout, "stderr": stderr, "status": "TIMEOUT", "runtimeMs": runtime_ms}
    file_limit_signal = getattr(signal, "SIGXFSZ", None)
    if stdout_exceeded or stderr_exceeded or (file_limit_signal is not None and process.returncode == -file_limit_signal):
        return {
            "stdout": stdout,
            "stderr": "Output limit exceeded",
            "status": "ERROR",
            "runtimeMs": runtime_ms,
            "failureType": "OUTPUT_LIMIT_EXCEEDED",
        }
    if process.returncode != 0:
        return {
            "stdout": stdout,
            "stderr": stderr or f"Process exited with status {process.returncode}",
            "status": "ERROR",
            "runtimeMs": runtime_ms,
            "failureType": "RUNTIME_ERROR",
        }
    return {"stdout": stdout, "stderr": stderr, "status": "SUCCESS", "runtimeMs": runtime_ms}


def _compile(command: list[str], timeout_ms: int, output_limit: int) -> tuple[bool, str, int]:
    # Compilation gets the container memory boundary; learner runtime gets the stricter per-request boundary.
    started = time.monotonic()
    try:
        completed = subprocess.run(
            command,
            cwd=WORK,
            stdin=subprocess.DEVNULL,
            capture_output=True,
            timeout=max(5, min(15, timeout_ms / 1000 + 5)),
            check=False,
        )
        elapsed = max(0, round((time.monotonic() - started) * 1000))
        stderr = (completed.stderr or completed.stdout)[:output_limit].decode("utf-8", errors="replace")
        return completed.returncode == 0, stderr, elapsed
    except subprocess.TimeoutExpired:
        return False, "Compilation timed out", max(0, round((time.monotonic() - started) * 1000))


def _commands(language: str, source: Path) -> tuple[list[str], list[str]]:
    if language == "PYTHON":
        return [sys.executable, "-m", "py_compile", str(source)], [sys.executable, "-I", str(source)]
    if language == "JAVASCRIPT":
        return ["node", "--check", str(source)], ["node", "--no-addons", "--max-old-space-size=96", str(source)]
    if language == "C":
        return ["gcc", "-O2", "-pipe", "-std=c17", str(source), "-o", str(WORK / "program")], [str(WORK / "program")]
    if language == "CPP":
        return ["g++", "-O2", "-pipe", "-std=c++17", str(source), "-o", str(WORK / "program")], [str(WORK / "program")]
    raise ValueError("Unsupported language")


def main() -> int:
    if len(sys.argv) != 2:
        raise ValueError("request path is required")
    request = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    language = str(request["language"])
    suffixes = {"PYTHON": ".py", "JAVASCRIPT": ".js", "C": ".c", "CPP": ".cpp"}
    if language not in suffixes:
        raise ValueError("Unsupported language")
    source_code = str(request["source_code"])
    inputs = request["inputs"]
    timeout_ms = int(request["timeout_ms"])
    memory_kb = int(request["memory_kb"])
    output_limit = int(request["output_limit_bytes"])
    if not isinstance(inputs, list) or not inputs:
        raise ValueError("inputs are required")

    WORK.mkdir(parents=True, exist_ok=True)
    source = WORK / f"main{suffixes[language]}"
    source.write_text(source_code, encoding="utf-8")
    compile_command, run_command = _commands(language, source)
    compiled, compile_error, compile_ms = _compile(compile_command, timeout_ms, output_limit)
    if not compiled:
        prefix = {"PYTHON": "Python", "JAVASCRIPT": "JavaScript", "C": "C", "CPP": "C++"}[language]
        item = {
            "stdout": "",
            "stderr": f"[Lỗi biên dịch {prefix}] {compile_error}".rstrip(),
            "status": "ERROR",
            "runtimeMs": compile_ms,
            "failureType": "COMPILE_ERROR",
        }
        print(json.dumps({"results": [item for _ in inputs]}, ensure_ascii=True, separators=(",", ":")))
        return 0

    results = [
        _run(run_command, str(value), timeout_ms, memory_kb, output_limit, language != "JAVASCRIPT")
        for value in inputs
    ]
    print(json.dumps({"results": results}, ensure_ascii=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(json.dumps({"error": type(exc).__name__}, separators=(",", ":")))
        raise SystemExit(70)

