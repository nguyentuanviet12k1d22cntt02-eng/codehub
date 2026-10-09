"""Draft questions stay separate from the product bank until review."""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "ai-service/scripts"))

from validate_pretest_python_basics_draft import validate_draft


def test_python_basics_draft_is_technically_consistent_but_not_approved():
    result = validate_draft()
    assert result["status"] == "DRAFT_TECHNICAL_CHECK_PASSED"
    assert result["questionCount"] == 12
    assert result["technicalCasesPassed"] == 15
    assert result["knownWrongSolutionsCaught"] == 3
    assert result["gatewaySkillsCovered"] == 5
    assert result["goalSkillsCovered"] == 9
    assert not result["contentApproved"]
    assert not result["servingEligible"]


def test_product_bank_remains_empty_and_cannot_issue_draft_questions():
    production = json.loads((ROOT / "backend/src/infrastructure/data/pretestBank.v1.json").read_text(encoding="utf-8"))
    assert production["items"] == []
