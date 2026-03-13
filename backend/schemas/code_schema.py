from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class CodeExecuteRequest(BaseModel):
    """Code execution request"""
    code: str = Field(..., min_length=1)
    language: str = Field(..., pattern="^(python|javascript|java|cpp|c|js)$")


class CodeExecuteResponse(BaseModel):
    """Code execution response"""
    output: Optional[str] = None
    stderr: Optional[str] = None
    status: str
    exit_code: int


class FileCreate(BaseModel):
    """File creation request"""
    name: str = Field(..., min_length=1, max_length=255)
    content: str = ""
    language: str = Field(..., pattern="^(python|javascript|java|cpp|c|js)$")


class FileUpdate(BaseModel):
    """File update request"""
    name: Optional[str] = None
    content: Optional[str] = None
    language: Optional[str] = None


class FileResponse(BaseModel):
    """File response"""
    id: int
    name: str
    content: str
    language: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class FileListResponse(BaseModel):
    """List of files response"""
    files: List[FileResponse]
    total: int
