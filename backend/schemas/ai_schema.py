from pydantic import BaseModel, Field
from typing import List, Optional


class AIExplainRequest(BaseModel):
    """AI code explanation request"""
    code: str = Field(..., min_length=1)


class AIExplainResponse(BaseModel):
    """AI code explanation response"""
    summary: str
    explanation: str
    bugs: List[str]
    assumptions: List[str]
    optimization: List[str]


class AIMentorRequest(BaseModel):
    """AI mentor chat request"""
    message: str = Field(..., min_length=1)
    code: Optional[str] = None


class AIMentorResponse(BaseModel):
    """AI mentor chat response"""
    response: str


class CodeAnalysisRequest(BaseModel):
    """Code analysis request"""
    code: str = Field(..., min_length=1)


class CodeAnalysisResponse(BaseModel):
    """Code analysis response"""
    total_lines: int
    functions: int
    loops: int
    conditions: int
    complexity_score: float
    quality_score: float
    language_detected: str


class LineComment(BaseModel):
    """A single line comment from AI"""
    line: int
    comment: str
    type: str  # "info" | "important" | "warning"


class AICommentsRequest(BaseModel):
    """Real-time per-line AI comments request"""
    code: str = Field(..., min_length=1)
    language: Optional[str] = None


class AICommentsResponse(BaseModel):
    """Real-time per-line AI comments response"""
    comments: List[LineComment]
