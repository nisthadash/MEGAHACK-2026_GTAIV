from fastapi import APIRouter, HTTPException, status
from schemas.code_schema import CodeExecuteRequest, CodeExecuteResponse
from services.compiler_service import compiler_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/execute", tags=["code execution"])


@router.post("", response_model=CodeExecuteResponse)
async def execute_code(request: CodeExecuteRequest):
    """
    Execute code locally using system compilers/interpreters
    
    Supported languages: python, javascript, java, cpp, c
    
    Returns: Code output, stderr, status, and exit code
    """
    
    # Validate language
    supported_languages = ["python", "javascript", "java", "cpp", "c", "js"]
    if request.language.lower() not in supported_languages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported language. Supported: {', '.join(supported_languages)}"
        )
    
    # Validate code length (prevent abuse)
    if len(request.code) > 50000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code size exceeds maximum limit (50KB)"
        )
    
    try:
        logger.info(f"Executing {request.language} code")
        
        # Execute code locally
        result = await compiler_service.execute_code(
            code=request.code,
            language=request.language
        )
        
        return CodeExecuteResponse(
            output=result.get("output", ""),
            stderr=result.get("stderr", ""),
            status=result.get("status", "success"),
            exit_code=result.get("exit_code", 0)
        )
    
    except Exception as e:
        logger.error(f"Code execution error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Execution error: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check for execution service"""
    return {
        "status": "healthy",
        "service": "Local Code Execution Service",
        "supported_languages": ["python", "javascript", "java", "cpp", "c"]
    }
