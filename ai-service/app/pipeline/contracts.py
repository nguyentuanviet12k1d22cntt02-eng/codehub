from typing import Any, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field


class TestCase(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    # Function exercises use typed arguments.  stdio and SQL retain input as
    # exact text because whitespace is part of their execution contract.
    input: Optional[str] = None
    arguments: Optional[list[Any]] = None
    call_style: Optional[Literal["spread", "single"]] = None
    expected_output: str
    is_hidden: bool
    category: Literal["normal", "boundary"]
    explanation: str = Field(min_length=5)
    fixture_sql: Optional[str] = None


class Hints(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    scaffold_1_conceptual: str = Field(min_length=5)
    scaffold_2_syntax: str = Field(min_length=5)
    scaffold_3_pseudocode: str = Field(min_length=5)


class ExerciseDraft(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    title: str = Field(min_length=5, max_length=200)
    problem_statement: str = Field(min_length=80, max_length=14000)
    quick_theory: str = Field(min_length=20)
    starter_code: str = Field(min_length=1, max_length=20000)
    reference_solution: str = Field(min_length=1, max_length=20000)
    test_cases: list[TestCase] = Field(min_length=4, max_length=8)
    hints: Hints
    constraints: list[str]
    common_pitfall_warning: str
    fixture_sql: Optional[str] = None


class CriticReview(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    is_approved: bool
    theory_approved: bool
    exercise_approved: bool
    compatibility_approved: bool
    score: float = Field(ge=0, le=1)
    feedback_target: Literal["THEORY", "EXERCISE", "BOTH", "NONE"]
    feedback: str = Field(min_length=10)
    theory_feedback: Optional[str] = None
    exercise_feedback: Optional[str] = None
    evidence: list[str] = Field(min_length=1)
