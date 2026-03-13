from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
from schemas.code_schema import FileCreate, FileUpdate, FileResponse, FileListResponse
from models.file import File
from models.user import User
from database.db import get_db
from utils.auth_utils import decode_access_token

router = APIRouter(prefix="/api/files", tags=["File Management"])


async def get_current_user(authorization: str, db: Session = Depends(get_db)):
    """Extract and validate user from authorization header"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = decode_access_token(token)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        user_id = payload.get("user_id")
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return user
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


@router.post("", response_model=FileResponse, status_code=status.HTTP_201_CREATED)
async def create_file(
    file_data: FileCreate,
    authorization: str = None,
    db: Session = Depends(get_db)
):
    """
    Create a new file
    
    Supported languages: python, javascript, java, cpp, c
    """
    
    user = await get_current_user(authorization, db)
    
    # Validate language
    supported_languages = ["python", "javascript", "java", "cpp", "c"]
    if file_data.language not in supported_languages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported language. Supported: {', '.join(supported_languages)}"
        )
    
    # Validate file name
    if len(file_data.name) > 255:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File name too long (max 255 characters)"
        )
    
    # Check for duplicate file name
    existing_file = db.query(File).filter(
        File.owner_id == user.id,
        File.name == file_data.name
    ).first()
    
    if existing_file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File with this name already exists"
        )
    
    try:
        new_file = File(
            name=file_data.name,
            content=file_data.content,
            language=file_data.language,
            owner_id=user.id
        )
        
        db.add(new_file)
        db.commit()
        db.refresh(new_file)
        
        return FileResponse(
            id=new_file.id,
            name=new_file.name,
            content=new_file.content,
            language=new_file.language,
            created_at=new_file.created_at,
            updated_at=new_file.updated_at
        )
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating file: {str(e)}"
        )


@router.get("", response_model=FileListResponse)
async def list_files(
    authorization: str = None,
    db: Session = Depends(get_db)
):
    """Get all files for current user"""
    
    user = await get_current_user(authorization, db)
    
    try:
        files = db.query(File).filter(File.owner_id == user.id).all()
        
        return FileListResponse(
            files=[
                FileResponse(
                    id=f.id,
                    name=f.name,
                    content=f.content,
                    language=f.language,
                    created_at=f.created_at,
                    updated_at=f.updated_at
                )
                for f in files
            ]
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving files: {str(e)}"
        )


@router.get("/{file_id}", response_model=FileResponse)
async def get_file(
    file_id: int,
    authorization: str = None,
    db: Session = Depends(get_db)
):
    """Get a specific file"""
    
    user = await get_current_user(authorization, db)
    
    file = db.query(File).filter(
        File.id == file_id,
        File.owner_id == user.id
    ).first()
    
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    return FileResponse(
        id=file.id,
        name=file.name,
        content=file.content,
        language=file.language,
        created_at=file.created_at,
        updated_at=file.updated_at
    )


@router.put("/{file_id}", response_model=FileResponse)
async def update_file(
    file_id: int,
    file_data: FileUpdate,
    authorization: str = None,
    db: Session = Depends(get_db)
):
    """Update a file (name and/or content)"""
    
    user = await get_current_user(authorization, db)
    
    file = db.query(File).filter(
        File.id == file_id,
        File.owner_id == user.id
    ).first()
    
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    try:
        # Update name if provided
        if file_data.name:
            # Check for duplicate
            existing = db.query(File).filter(
                File.owner_id == user.id,
                File.name == file_data.name,
                File.id != file_id
            ).first()
            
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="File with this name already exists"
                )
            
            file.name = file_data.name
        
        # Update content if provided
        if file_data.content is not None:
            file.content = file_data.content
        
        db.commit()
        db.refresh(file)
        
        return FileResponse(
            id=file.id,
            name=file.name,
            content=file.content,
            language=file.language,
            created_at=file.created_at,
            updated_at=file.updated_at
        )
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating file: {str(e)}"
        )


@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(
    file_id: int,
    authorization: str = None,
    db: Session = Depends(get_db)
):
    """Delete a file"""
    
    user = await get_current_user(authorization, db)
    
    file = db.query(File).filter(
        File.id == file_id,
        File.owner_id == user.id
    ).first()
    
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    try:
        db.delete(file)
        db.commit()
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting file: {str(e)}"
        )
