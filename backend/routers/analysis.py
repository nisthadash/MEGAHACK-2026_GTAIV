from fastapi import APIRouter, HTTPException, status
from schemas.ai_schema import CodeAnalysisRequest, CodeAnalysisResponse
from services.analysis_service import analysis_service

router = APIRouter(prefix="/api/analysis", tags=["Code Analysis"])


@router.post("", response_model=CodeAnalysisResponse)
async def analyze_code(request: CodeAnalysisRequest):
    """
    Analyze code for metrics and quality
    
    Returns:
    - Total lines and complexity metrics
    - Function/loop/condition counts
    - Cyclomatic complexity score (0-100)
    - Quality score (0-100)
    - Detected language
    """
    
    # Validate code
    if len(request.code) > 50000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code size exceeds maximum limit (50KB)"
        )
    
    try:
        # Analyze code
        analysis = analysis_service.analyze_code(request.code)
        
        return CodeAnalysisResponse(
            total_lines=analysis.get("total_lines", 0),
            functions=analysis.get("functions", 0),
            loops=analysis.get("loops", 0),
            conditions=analysis.get("conditions", 0),
            complexity_score=analysis.get("complexity_score", 0),
            quality_score=analysis.get("quality_score", 0),
            language_detected=analysis.get("language_detected", "unknown")
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Code analysis error: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check for analysis service"""
    return {
        "status": "healthy",
        "service": "Code Analysis"
    }
