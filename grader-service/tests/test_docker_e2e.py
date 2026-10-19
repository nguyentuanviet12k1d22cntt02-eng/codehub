#!/usr/bin/env python3
"""End-to-end checks for a running Docker grader API.

Run this on the EC2 host so the real API, Docker daemon and runner images are
all exercised. The API token is read from GRADER_API_TOKEN and is never logged.
"""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any


BASE_URL = os.getenv("GRADER_TEST_URL", "http://127.0.0.1:8080").rstrip("/")
TOKEN = os.getenv("GRADER_API_TOKEN", "")


def request(path: str, payload: dict[str, Any] | None = None, *, authenticated: bool = True) -> tuple[int, Any]:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    headers = {"Content-Type": "application/json", "X-Request-ID": f"e2e-{time.time_ns()}"}
    if authenticated:
        headers["Authorization"] = f"Bearer {TOKEN}"
    req = urllib.request.Request(f"{BASE_URL}{path}", data=data, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=45) as response:
            raw = response.read()
            return response.status, json.loads(raw) if raw else None
    except urllib.error.HTTPError as exc:
        raw = exc.read()
        return exc.code, json.loads(raw) if raw else None


def execute(language: str, source: str, inputs: list[str], *, timeout_ms: int = 1500, memory_kb: int = 65536) -> list[dict[str, Any]]:
    status, body = request(
        "/v1/execute",
        {
            "language": language,
            "sourceCode": source,
            "inputs": inputs,
            "timeoutMs": timeout_ms,
            "memoryKb": memory_kb,
        },
    )
    assert status == 200, (language, status, body)
    assert body["provider"] == "aws-docker", body
    assert body["language"] == language, body
    assert len(body["results"]) == len(inputs), body
    return body["results"]


def assert_success(language: str, source: str, inputs: list[str], expected: list[str]) -> None:
    results = execute(language, source, inputs)
    assert [item["status"] for item in results] == ["SUCCESS"] * len(inputs), results
    assert [item["stdout"] for item in results] == expected, results


def test_health_and_auth() -> None:
    status, body = request("/health/ready", authenticated=False)
    assert status == 200 and body == {"status": "ready", "docker": "ok", "missingImages": []}, body
    status, _ = request(
        "/v1/execute",
        {"language": "PYTHON", "sourceCode": "print(1)", "inputs": [""]},
        authenticated=False,
    )
    assert status == 401, status


def test_all_languages() -> None:
    assert_success(
        "PYTHON",
        "value = int(input())\nprint(value * 2)\n",
        ["2\n", "7\n"],
        ["4\n", "14\n"],
    )
    assert_success(
        "JAVASCRIPT",
        "const fs=require('fs'); const n=Number(fs.readFileSync(0,'utf8').trim()); console.log(n*2);",
        ["3\n", "8\n"],
        ["6\n", "16\n"],
    )
    assert_success(
        "C",
        "#include <stdio.h>\nint main(void){long n;if(scanf(\"%ld\",&n)!=1)return 2;printf(\"%ld\\n\",n*2);return 0;}",
        ["4\n", "9\n"],
        ["8\n", "18\n"],
    )
    assert_success(
        "CPP",
        "#include <iostream>\nint main(){long n;if(!(std::cin>>n))return 2;std::cout<<n*2<<'\\n';}",
        ["5\n", "11\n"],
        ["10\n", "22\n"],
    )


def test_compile_errors() -> None:
    invalid = {
        "PYTHON": "def broken(:\n  pass",
        "JAVASCRIPT": "const = ;",
        "C": "int main( {",
        "CPP": "#include <iostream>\nint main( {",
    }
    for language, source in invalid.items():
        item = execute(language, source, [""])[0]
        assert item["status"] == "ERROR", (language, item)
        assert item["failureType"] == "COMPILE_ERROR", (language, item)


def test_runtime_timeout_and_limits() -> None:
    runtime = execute("PYTHON", "raise RuntimeError('expected')", [""])[0]
    assert runtime["status"] == "ERROR" and runtime["failureType"] == "RUNTIME_ERROR", runtime

    timed_out = execute("PYTHON", "while True:\n    pass", [""], timeout_ms=500)[0]
    assert timed_out["status"] == "TIMEOUT", timed_out

    output = execute("PYTHON", "print('x' * 200000)", [""])[0]
    assert output["status"] == "ERROR" and output["failureType"] == "OUTPUT_LIMIT_EXCEEDED", {
        "status": output["status"],
        "failureType": output.get("failureType"),
        "stdoutBytes": len(output["stdout"].encode("utf-8")),
        "stderr": output["stderr"],
    }
    assert len(output["stdout"].encode("utf-8")) <= 131072, len(output["stdout"])

    memory = execute("PYTHON", "x = bytearray(200 * 1024 * 1024)\nprint(len(x))", [""], memory_kb=65536)[0]
    assert memory["status"] == "ERROR" and memory["failureType"] == "RUNTIME_ERROR", memory


def test_isolation() -> None:
    identity = execute("PYTHON", "import os\nprint(os.getuid())", [""])[0]
    assert identity["status"] == "SUCCESS" and identity["stdout"] == "10001\n", identity

    filesystem = execute(
        "PYTHON",
        "try:\n    open('/grader-write-probe', 'w').write('x')\n    print('writable')\nexcept OSError:\n    print('blocked')",
        [""],
    )[0]
    assert filesystem["status"] == "SUCCESS" and filesystem["stdout"] == "blocked\n", filesystem

    network = execute(
        "PYTHON",
        "import socket\ns=socket.socket(); s.settimeout(1); s.connect(('1.1.1.1',80)); print('connected')",
        [""],
        timeout_ms=2000,
    )[0]
    assert network["status"] == "ERROR" and network["failureType"] == "RUNTIME_ERROR", network
    assert "connected" not in network["stdout"], network

    processes = execute(
        "PYTHON",
        "import os,time\nchildren=[]\ntry:\n for _ in range(100):\n  pid=os.fork()\n  if pid==0:\n   time.sleep(2); os._exit(0)\n  children.append(pid)\n print('unbounded')\nexcept OSError:\n print('blocked')\nfinally:\n for pid in children:\n  try: os.kill(pid,9)\n  except ProcessLookupError: pass",
        [""],
        timeout_ms=4000,
    )[0]
    assert processes["status"] == "SUCCESS" and processes["stdout"] == "blocked\n", processes


def test_queue_bound() -> None:
    payload = {
        "language": "PYTHON",
        "sourceCode": "while True:\n    pass",
        "inputs": [""],
        "timeoutMs": 500,
        "memoryKb": 65536,
    }
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = [pool.submit(request, "/v1/execute", payload) for _ in range(12)]
        statuses = [future.result()[0] for future in as_completed(futures)]
    assert 429 in statuses, statuses
    assert all(status in {200, 429} for status in statuses), statuses


def main() -> int:
    if len(TOKEN) < 32:
        print("GRADER_API_TOKEN must be set", file=sys.stderr)
        return 2
    tests = [
        test_health_and_auth,
        test_all_languages,
        test_compile_errors,
        test_runtime_timeout_and_limits,
        test_isolation,
        test_queue_bound,
    ]
    started = time.monotonic()
    for test in tests:
        test()
        print(f"PASS {test.__name__}")
    print(f"PASS docker_e2e total={time.monotonic() - started:.2f}s")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
