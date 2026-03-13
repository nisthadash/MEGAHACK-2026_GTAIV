from fastapi import APIRouter, HTTPException, status
from schemas.ai_schema import AIExplainRequest, AIExplainResponse, AIMentorRequest, AIMentorResponse
from services.mentor_service import mentor_service
from services.gemini_service import gemini_service

router = APIRouter(prefix="/api/ai", tags=["AI Analysis"])


@router.post("/explain", response_model=AIExplainResponse)
async def explain_code(request: AIExplainRequest):
    """
    Get AI explanation of code
    
    Provides:
    - Summary: Brief overview
    - Explanation: Detailed explanation
    - Potential Bugs: Issues detected
    - Assumptions: Made inputs
    - Optimization: Improvement suggestions
    """
    
    # Validate code
    if len(request.code) > 50000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code size exceeds maximum limit (50KB)"
        )
    
    try:
        # Get explanation from Gemini + analysis
        result = await mentor_service.generate_code_explanation(request.code)
        
        return AIExplainResponse(
            summary=result.get("summary", ""),
            explanation=result.get("explanation", ""),
            bugs=result.get("bugs", []),
            assumptions=result.get("assumptions", []),
            optimization=result.get("optimization", [])
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI explanation error: {str(e)}"
        )


@router.post("/mentor", response_model=AIMentorResponse)
async def ai_mentor(request: AIMentorRequest):
    """
    Get mentoring response from AI
    
    Can discuss code, ask questions, get learning suggestions.
    Optionally provide code context for more targeted advice.
    """
    
    # Validate message
    if len(request.message) > 5000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message exceeds maximum length (5000 characters)"
        )
    
    try:
        # Get mentor response
        response = await mentor_service.get_mentor_response(
            message=request.message,
            code=request.code
        )
        
        # Handle response (may be string or dict)
        if isinstance(response, dict):
            response_text = response.get("response", str(response))
        else:
            response_text = str(response)
        
        return AIMentorResponse(response=response_text)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI mentor error: {str(e)}"
        )
