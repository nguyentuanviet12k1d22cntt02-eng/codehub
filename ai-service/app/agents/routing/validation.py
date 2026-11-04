from pydantic import ValidationError
from app.contracts.routing import RoutingDecision
from app.pipeline.llm_client import PipelineError

from .prompts import ROUTING_REQUIRED_FIELDS


class RoutingValidationMixin:

    @staticmethod
    def _validate_llm_result(result):
        if not isinstance(result, dict):
            raise PipelineError("ROUTING_SCHEMA_INVALID", "IntentRouterAgent phải trả JSON object.")
        missing = [field for field in ROUTING_REQUIRED_FIELDS if field not in result]
        if missing:
            raise PipelineError("ROUTING_SCHEMA_INVALID", "IntentRouterAgent thiếu trường bắt buộc.",
                                {"missing_fields": missing})
        try:
            return RoutingDecision.model_validate(result)
        except ValidationError as exc:
            raise PipelineError("ROUTING_SCHEMA_INVALID", "JSON định tuyến không khớp hợp đồng.",
                                {"validation_errors": exc.errors(include_url=False)}) from exc
