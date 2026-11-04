"""Version2 contract: authenticated backend owns evidence verification and aggregation."""
from datetime import datetime
from typing import Annotated,Literal
from pydantic import BaseModel,ConfigDict,Field,StrictBool,StrictInt,StrictFloat,field_validator,model_validator
Nonnegative=Annotated[StrictInt,Field(ge=0,le=9007199254740991)]
Probability=Annotated[StrictFloat,Field(ge=0,le=1)]
class Closed(BaseModel):
    model_config=ConfigDict(extra='forbid',allow_inf_nan=False)
class Context(Closed):
    type:Literal['MODULE_PRACTICE']
    course_id:str=Field(min_length=1,max_length=100)
    module_id:str=Field(min_length=1,max_length=100)
    module_code:str=Field(pattern=r'^MOD-0[1-8]$')
    bank_id:str=Field(min_length=1,max_length=100)
    bank_code:str=Field(pattern=r'^LS-0[1-8]\.MP(?:_FOR|_WHILE)?$')
class FeedbackV2(Closed):
    event_id:str=Field(min_length=1,max_length=100)
    item_id:str=Field(min_length=1,max_length=100)
    content_version:str=Field(pattern=r'^python-content-v1:[a-f0-9]{64}$')
    skill_id:str=Field(min_length=1,max_length=60)
    correct:StrictBool
    feedback_ready_at:datetime
    @field_validator('feedback_ready_at')
    @classmethod
    def aware(cls,v):
        if v.tzinfo is None:raise ValueError('Timezone required')
        return v
class CausalSummary(Closed):
    schema_version:Literal['palnet-causal-summary/2.0']
    cutoff:datetime
    catalog_revision:str=Field(pattern=r'^[a-f0-9]{64}$')
    history_revision:str=Field(pattern=r'^[a-f0-9]{64}$')
    skill_ids:list[str]=Field(min_length=36,max_length=36)
    attempt_counts:list[Nonnegative]=Field(min_length=36,max_length=36)
    correct_counts:list[Nonnegative]=Field(min_length=36,max_length=36)
    ema:list[Probability]=Field(min_length=36,max_length=36)
    source_event_count:Nonnegative
    history_count:Nonnegative
    last_feedback_ready_at:datetime|None
    @model_validator(mode='after')
    def consistent(self):
        if self.cutoff.tzinfo is None:raise ValueError('Timezone required')
        if len(set(self.skill_ids))!=36 or sum(self.attempt_counts)!=self.history_count or self.source_event_count<self.history_count:raise ValueError('Invalid counts')
        for n,c,e in zip(self.attempt_counts,self.correct_counts,self.ema):
            if c>n or (n==0 and (c!=0 or e!=.5)):raise ValueError('Invalid skill aggregate')
        if self.history_count==0:
            if self.source_event_count!=0 or self.last_feedback_ready_at is not None:raise ValueError('Invalid empty aggregate')
        elif self.last_feedback_ready_at is None or self.last_feedback_ready_at.tzinfo is None or self.last_feedback_ready_at>=self.cutoff:raise ValueError('Noncausal aggregate')
        return self
class PredictionRequestV2(Closed):
    schema_version:Literal['palnet-advisory-request/2.0']
    request_id:str=Field(min_length=1,max_length=100)
    user_id:str=Field(min_length=1,max_length=100)
    language:Literal['PYTHON']
    context:Context
    model_version:str
    manifest_sha256:str=Field(pattern=r'^[a-f0-9]{64}$')
    checkpoint_sha256:str=Field(pattern=r'^[a-f0-9]{64}$')
    graph_version:Literal['2.2']
    graph_sha256:str=Field(pattern=r'^[a-f0-9]{64}$')
    mapping_version:str
    mapping_sha256:str=Field(pattern=r'^[a-f0-9]{64}$')
    feature_version:Literal['python-module-practice-causal-feedback/2.0']
    policy_version:Literal['palnet-module-practice-advisory/2.0']
    catalog_revision:str=Field(pattern=r'^[a-f0-9]{64}$')
    history_revision:str=Field(pattern=r'^[a-f0-9]{64}$')
    cutoff:datetime
    target_skill_ids:list[str]=Field(min_length=1,max_length=25)
    history:list[FeedbackV2]|None=Field(default=None,max_length=2000)
    summary:CausalSummary|None=None
    @model_validator(mode='after')
    def consistent(self):
        if self.cutoff.tzinfo is None or len(set(self.target_skill_ids))!=len(self.target_skill_ids):raise ValueError('Invalid cutoff/targets')
        if (self.history is None)==(self.summary is None):raise ValueError('Exactly one evidence representation required')
        if self.summary is not None and (self.summary.cutoff!=self.cutoff or self.summary.catalog_revision!=self.catalog_revision or self.summary.history_revision!=self.history_revision):raise ValueError('Aggregate binding mismatch')
        return self
