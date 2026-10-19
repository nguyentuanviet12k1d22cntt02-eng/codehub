from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Language(str, Enum):
    PYTHON = "PYTHON"
    JAVASCRIPT = "JAVASCRIPT"
    C = "C"
    CPP = "CPP"


class ResultStatus(str, Enum):
    SUCCESS = "SUCCESS"
    TIMEOUT = "TIMEOUT"
    ERROR = "ERROR"


class FailureType(str, Enum):
    COMPILE_ERROR = "COMPILE_ERROR"
    RUNTIME_ERROR = "RUNTIME_ERROR"
    OUTPUT_LIMIT_EXCEEDED = "OUTPUT_LIMIT_EXCEEDED"
    INTERNAL_ERROR = "INTERNAL_ERROR"


class ExecuteRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    language: Language
    source_code: str = Field(alias="sourceCode", min_length=1)
    inputs: list[str] = Field(min_length=1, max_length=50)
    timeout_ms: int = Field(default=3_000, alias="timeoutMs", ge=500, le=10_000)
    memory_kb: int = Field(default=131_072, alias="memoryKb", ge=65_536, le=262_144)

    @field_validator("source_code")
    @classmethod
    def source_size_is_bounded(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 50_000:
            raise ValueError("sourceCode exceeds 50000 bytes")
        return value

    @field_validator("inputs")
    @classmethod
    def input_sizes_are_bounded(cls, values: list[str]) -> list[str]:
        if any(len(value.encode("utf-8")) > 65_536 for value in values):
            raise ValueError("an input exceeds 65536 bytes")
        return values


class ExecuteResultItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    stdout: str = ""
    stderr: str = ""
    status: ResultStatus
    runtime_ms: int = Field(alias="runtimeMs", ge=0)
    failure_type: FailureType | None = Field(default=None, alias="failureType")


class ExecuteResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    request_id: str = Field(alias="requestId")
    provider: str = "aws-docker"
    language: Language
    results: list[ExecuteResultItem]


class HealthResponse(BaseModel):
    status: str
    docker: str | None = None
    missing_images: list[str] = Field(default_factory=list, alias="missingImages")

