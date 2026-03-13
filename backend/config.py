from pydantic_settings import BaseSettings
from pydantic import field_validator, Field
from typing import Optional, List, Dict
import json


class Settings(BaseSettings):
    """Application configuration settings"""
    
    # App Config
    APP_NAME: str = "ExplainMyCode IDE"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # API Keys & External Services
    GEMINI_API_KEY: str
    JUDGE0_API_KEY: Optional[str] = None
    JUDGE0_BASE_URL: str = "https://judge0-ce.p.rapidapi.com"
    COMPILER_IO_API_KEY: Optional[str] = None
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/explainmycode"
    SQLALCHEMY_ECHO: bool = False
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # Redis (for caching)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # CORS - will be parsed from JSON string
    CORS_ORIGINS: List[str] = Field(default_factory=lambda: ["http://localhost:5173", "http://localhost:3000"])
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds
    
    # Code Execution Limits
    EXECUTION_TIMEOUT_SECONDS: int = 10
    MAX_OUTPUT_SIZE_KB: int = 100
    MAX_CODE_SIZE_KB: int = 50
    
    # Supported Languages for Code Execution (not from .env, hardcoded)
    @property
    def SUPPORTED_LANGUAGES(self) -> Dict[str, int]:
        return {
            "python": 71,           # Judge0 language ID
            "javascript": 63,        # Node.js
            "java": 62,
            "cpp": 53,               # C++
            "c": 50
        }
    
    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS_ORIGINS from JSON string or comma-separated string"""
        if isinstance(v, str):
            # Try parsing as JSON first
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # Fallback to comma-separated parsing
                return [origin.strip() for origin in v.split(',') if origin.strip()]
        if isinstance(v, list):
            return v
        return ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()
