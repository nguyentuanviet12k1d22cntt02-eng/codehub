import pytest

from app.llm.pipeline.health import reset_provider_health


@pytest.fixture(autouse=True)
def _isolated_provider_health():
    """Cross-run provider health is process-wide; keep each test independent."""
    reset_provider_health()
    yield
    reset_provider_health()
