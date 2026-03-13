from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base


class File(Base):
    """File model for storing code files"""
    __tablename__ = "files"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    content = Column(Text, default="")
    language = Column(String(50), nullable=False)  # python, javascript, java, cpp, c
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="files")
    
    def __repr__(self):
        return f"<File(id={self.id}, name={self.name}, language={self.language})>"
