from __future__ import annotations

import json
import os
import re
import tempfile
import time
import uuid
from pathlib import Path
from typing import Any

from .config import Settings
from .models import ExecuteRequest, ExecuteResponse


class GraderInfrastructureError(RuntimeError):
    pass


class DockerExecutor:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._docker: Any = None
        self._docker_module: Any = None

    def _client(self) -> Any:
        if self._docker is None:
            try:
                import docker
            except ImportError as exc:
                raise GraderInfrastructureError("Docker SDK is not installed") from exc
            self._docker_module = docker
            try:
                self._docker = docker.from_env(timeout=10)
                self._docker.ping()
            except Exception as exc:
                self._docker = None
                raise GraderInfrastructureError("Docker daemon is unavailable") from exc
        return self._docker

    def _images(self) -> dict[str, str]:
        return {
            "PYTHON": self.settings.python_image,
            "JAVASCRIPT": self.settings.javascript_image,
            "C": self.settings.c_image,
            "CPP": self.settings.cpp_image,
        }

    def readiness(self) -> tuple[bool, list[str]]:
        try:
            client = self._client()
            missing: list[str] = []
            for image in sorted(set(self._images().values())):
                try:
                    client.images.get(image)
                except Exception:
                    missing.append(image)
            return not missing, missing
        except GraderInfrastructureError:
            return False, sorted(set(self._images().values()))

    def execute(self, request: ExecuteRequest, request_id: str) -> ExecuteResponse:
        client = self._client()
        image = self._images()[request.language.value]
        try:
            client.images.get(image)
        except Exception as exc:
            raise GraderInfrastructureError(f"Runner image is unavailable: {image}") from exc

        payload = {
            "language": request.language.value,
            "source_code": request.source_code,
            "inputs": request.inputs,
            "timeout_ms": request.timeout_ms,
            "memory_kb": request.memory_kb,
            "output_limit_bytes": self.settings.output_limit_bytes,
        }
        container = None
        started = time.monotonic()
        safe_id = re.sub(r"[^A-Za-z0-9_.-]", "-", request_id)[:40]
        jobs_dir = Path(self.settings.jobs_dir)
        jobs_dir.mkdir(parents=True, exist_ok=True)
        os.chmod(jobs_dir, 0o700)
        # This directory is bind-mounted at the same absolute path into the API
        # container. The host Docker daemon can therefore mount each request
        # directory read-only into a sibling runner container.
        with tempfile.TemporaryDirectory(prefix="grader-", dir=jobs_dir) as directory:
            request_path = Path(directory) / "request.json"
            request_path.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
            os.chmod(directory, 0o755)
            os.chmod(request_path, 0o444)

            language_floor_mb = 256 if request.language.value in {"C", "CPP"} else 192
            container_memory = max(language_floor_mb * 1024 * 1024, request.memory_kb * 1024)
            hard_timeout = min(90, 12 + len(request.inputs) * (request.timeout_ms / 1000 + 1))
            try:
                docker = self._docker_module
                container = client.containers.run(
                    image=image,
                    command=["/submission/request.json"],
                    name=f"grader-{safe_id[:24]}-{uuid.uuid4().hex[:8]}",
                    detach=True,
                    network_disabled=True,
                    read_only=True,
                    cap_drop=["ALL"],
                    security_opt=["no-new-privileges:true"],
                    pids_limit=64,
                    mem_limit=container_memory,
                    memswap_limit=container_memory,
                    nano_cpus=1_000_000_000,
                    user="10001:10001",
                    volumes={directory: {"bind": "/submission", "mode": "ro"}},
                    tmpfs={
                        "/work": "rw,exec,nosuid,nodev,size=64m,mode=1777",
                        "/tmp": "rw,exec,nosuid,nodev,size=16m,mode=1777",
                    },
                    ulimits=[
                        docker.types.Ulimit(name="nofile", soft=64, hard=64),
                        docker.types.Ulimit(name="nproc", soft=64, hard=64),
                        docker.types.Ulimit(
                            name="fsize",
                            soft=self.settings.output_limit_bytes * 2,
                            hard=self.settings.output_limit_bytes * 2,
                        ),
                    ],
                    labels={"app": "learnpython-grader", "request_id": safe_id},
                )
                wait_result = container.wait(timeout=hard_timeout)
                raw_logs = container.logs(stdout=True, stderr=True)
                if len(raw_logs) > self.settings.output_limit_bytes * 4:
                    raise GraderInfrastructureError("Runner response exceeds the service limit")
                exit_code = int(wait_result.get("StatusCode", 1))
                if exit_code != 0:
                    raise GraderInfrastructureError(f"Runner exited with status {exit_code}")
                decoded = json.loads(raw_logs.decode("utf-8"))
                response = ExecuteResponse.model_validate({
                    "requestId": request_id,
                    "provider": "aws-docker",
                    "language": request.language.value,
                    "results": decoded.get("results"),
                })
                if len(response.results) != len(request.inputs):
                    raise GraderInfrastructureError("Runner returned an invalid result count")
                return response
            except GraderInfrastructureError:
                raise
            except Exception as exc:
                if container is not None and time.monotonic() - started >= hard_timeout - 1:
                    try:
                        container.kill()
                    except Exception:
                        pass
                    timeout_results = [{
                        "stdout": "",
                        "stderr": "Container execution exceeded the hard deadline",
                        "status": "TIMEOUT",
                        "runtimeMs": int(hard_timeout * 1000),
                    } for _ in request.inputs]
                    return ExecuteResponse.model_validate({
                        "requestId": request_id,
                        "provider": "aws-docker",
                        "language": request.language.value,
                        "results": timeout_results,
                    })
                raise GraderInfrastructureError("Docker execution failed") from exc
            finally:
                if container is not None:
                    try:
                        container.remove(force=True)
                    except Exception:
                        pass

