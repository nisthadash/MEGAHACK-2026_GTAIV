from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from config import settings
from database.db import engine, Base
from routers import auth, execute, ai, analysis, files

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
    yield
    # Shutdown: Clean up if needed
    logger.info("Application shutting down...")


# Initialize FastAPI app
app = FastAPI(
    title="ExplainMyCode API",
    description="AI-powered coding IDE backend with code execution, analysis, and mentoring",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
cors_origins = settings.CORS_ORIGINS.split(",") if isinstance(settings.CORS_ORIGINS, str) else settings.CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(execute.router)
app.include_router(ai.router)
app.include_router(analysis.router)
app.include_router(files.router)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check for API"""
    return {
        "status": "healthy",
        "service": "ExplainMyCode API",
        "version": "1.0.0"
    }


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API documentation links"""
    return {
        "message": "Welcome to ExplainMyCode API",
        "docs": "/docs",
        "redoc": "/redoc",
        "openapi": "/openapi.json"
    }


# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Enhanced HTTP exception handling"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """General exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "status_code": 500
        },
    )


# Startup event
@app.on_event("startup")
async def startup():
    """Run on API startup"""
    logger.info("ExplainMyCode API starting...")
    logger.info(f"CORS origins: {cors_origins}")


# Shutdown event
@app.on_event("shutdown")
async def shutdown():
    """Run on API shutdown"""
    logger.info("ExplainMyCode API shutting down...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
