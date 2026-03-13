# Backend Architecture

Comprehensive guide to the ExplainMyCode backend architecture, design patterns, and system flow.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/TypeScript)              │
└──────────────────────│──────────────────────────────────────┘
                       │ HTTP/JSON
┌──────────────────────▼──────────────────────────────────────┐
│                  FastAPI Application (main.py)              │
│────────────────────────────────────────────────────────────│
│  ┌─────────────────────────────────────────────────────────┤
│  │  CORS Middleware | Error Handlers | Route Registration │
│  └─────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Routers (API Endpoints)                    │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  • auth.py        - Authentication (signup/login)   │  │
│  │  • execute.py     - Code execution (Judge0)         │  │
│  │  • ai.py          - Explanations & mentoring        │  │
│  │  • analysis.py    - Code metrics & quality          │  │
│  │  • files.py       - File CRUD operations            │  │
│  └──────┬──────────────────────┬──────────────┬────────┘  │
│         │                      │              │            │
│  ┌──────▼─────┐    ┌───────────▼──┐  ┌──────▼──────┐     │
│  │  Services  │    │  Schemas     │  │   Database  │     │
│  ├────────────┤    ├──────────────┤  ├─────────────┤     │
│  │ • gemini   │    │ • auth       │  │ • User      │     │
│  │ • judge0   │    │ • code       │  │ • File      │     │
│  │ • analysis │    │ • ai         │  │ • ORM setup │     │
│  │ • mentor   │    │              │  │             │     │
│  └──────┬─────┘    └──────────────┘  └──────┬──────┘     │
│         │                                   │             │
└─────────┼───────────────────────────────────┼─────────────┘
          │                                   │
┌─────────▼──────────────────────────────────▼─────────────┐
│           External Services & Data Storage                 │
├─────────────────────────────────────────────────────────┤
│  • Google Gemini API (AI explanations)                   │
│  • RapidAPI Judge0 (Code execution)                      │
│  • PostgreSQL Database (User & File persistence)         │
└─────────────────────────────────────────────────────────┘
```

---

## Layer-Based Architecture

### 1. **Presentation Layer (Routers)**

Located in: `routers/`

Responsibilities:
- Handle HTTP requests/responses
- Validate path parameters
- Map requests to service methods
- Return appropriate HTTP status codes
- Handle authentication headers

Pattern:
```python
@router.post("/endpoint")
async def handler(
    request: RequestSchema,  # Pydantic validation
    db: Session = Depends(get_db),  # Dependency injection
    auth_header: str = None  # Auth handling
):
    # Validate domain rules
    # Call service
    # Return response
    return ResponseSchema(...)
```

### 2. **Service Layer**

Located in: `services/`

Responsibilities:
- Implement business logic
- Handle external API calls (Gemini, Judge0)
- Data transformation
- Complex computations (code analysis, complexity scoring)

Services:
- **GeminiService**: AI-powered explanations and analysis
- **Judge0Service**: Secure code execution with polling
- **AnalysisService**: Code metrics and complexity analysis
- **MentorService**: Combined intelligence for mentoring

Pattern:
```python
class Service:
    async def method(self, params):
        # Business logic
        # External API calls
        # Data transformation
        return result
```

### 3. **Data Layer (Models + ORM)**

Located in: `models/` + `database/db.py`

Responsibilities:
- Define data schema
- Handle database operations
- Establish relationships
- Ensure data integrity

Entities:
- **User** - Account with credentials and files
- **File** - Code files owned by users

Pattern:
```python
class Model(Base):
    __tablename__ = "table_name"
    id: Mapped[int] = mapped_column(primary_key=True)
    # ... fields
    relationships = relationship("Other", back_populates="...")
```

### 4. **Validation Layer (Schemas)**

Located in: `schemas/`

Responsibilities:
- Validate request data
- Serialize responses
- Document expected formats
- Type safety

Pattern:
```python
class RequestSchema(BaseModel):
    field: str
    optional_field: Optional[int] = None
    
    model_config = ConfigDict(json_schema_extra={...})
```

### 5. **Utility Layer**

Located in: `utils/`

Responsibilities:
- Reusable functions
- Authentication logic
- Language detection
- Data transformation

---

## Data Flow

### Authentication Flow

```
User Signup
    │
    ├─→ Router: POST /api/auth/signup
    │
    ├─→ Validate credentials (Pydantic)
    │   - Email format
    │   - Password strength
    │
    ├─→ Check duplicate (database query)
    │
    ├─→ Hash password (bcrypt)
    │
    ├─→ Create User record (database insert)
    │
    ├─→ Generate JWT token (auth_utils.create_access_token)
    │   - Include user_id, email, expiration
    │
    └─→ Return TokenResponse with token and user data

Token Storage (Frontend)
    │
    └─→ Store in localStorage
        Use in Authorization header: "Bearer {token}"

Authenticated Request
    │
    ├─→ Extract token from Authorization header
    │
    ├─→ Decode JWT (auth_utils.decode_access_token)
    │   - Verify signature (JWT_SECRET_KEY)
    │   - Check expiration
    │
    ├─→ Get user from database (user_id from token)
    │
    └─→ Proceed with request if valid
```

### Code Execution Flow

```
User Input (Frontend)
   │
   ├─→ Code: "print('hello')"
   └─→ Language: "python"
   
POST /api/execute (Router)
    │
    ├─→ Validate language (supported list)
    │
    ├─→ Validate code size (<50KB)
    │
    └─→ Call judge0_service.execute_code()
    
Judge0Service
    │
    ├─→ Detect language → Get Judge0 language ID
    │
    ├─→ Submit to Judge0 API
    │   POST https://judge0-ce.p.rapidapi.com/submissions
    │   Payload: { source_code, language_id, stdin }
    │   Response: { token }
    │
    ├─→ Poll for results (max 60 attempts, 0.5s intervals)
    │   GET https://judge0-ce.p.rapidapi.com/submissions/{token}
    │
    ├─→ Parse response
    │   - stdout → output
    │   - stderr → error output
    │   - status_id → human readable status
    │
    └─→ Return CodeExecuteResponse
        { output, stderr, status, exit_code, execution_time }

Response to Frontend
    │
    └─→ Display output in Terminal component
```

### AI Explanation Flow

```
User Request (Frontend)
   │
   └─→ Code + Auth Token
   
POST /api/ai/explain (Router)
    │
    ├─→ Validate Authorization header
    │
    ├─→ Decode JWT → Get user_id
    │
    └─→ Call mentor_service.generate_code_explanation()

MentorService
    │
    ├─→ Call gemini_service.explain_code(code)
    │
    │   GeminiService
    │   │
    │   ├─→ Format prompt with code
    │   │
    │   ├─→ Call Google Gemini API
    │   │   POST https://generativelanguage.googleapis.com/v1/models/...
    │   │   Header: x-goog-api-key: GEMINI_API_KEY
    │   │   Payload: { contents with code }
    │   │
    │   ├─→ Parse JSON response
    │   │   Extract from ```json ... ``` blocks
    │   │
    │   └─→ Validate and return structured response
    │
    ├─→ Call analysis_service.analyze_code(code)
    │
    │   AnalysisService
    │   │
    │   ├─→ Detect language
    │   │
    │   ├─→ If Python: Parse AST
    │   │   - Count functions, classes, loops
    │   │   - Calculate cyclomatic complexity
    │   │
    │   ├─→ If other: Use regex patterns
    │   │
    │   └─→ Calculate scores
    │       - complexity_score (0-100)
    │       - quality_score (0-100)
    │
    └─→ Combine results → Return AIExplainResponse
        { summary, explanation, key_concepts, bugs, optimizations }

Response to Frontend
    │
    └─→ Display in AIMentorPanel component
```

### File Management Flow

```
Create File
    │
    ├─→ POST /api/files (requires auth)
    │
    ├─→ Validate language
    │
    ├─→ Check duplicate name (same user, same name)
    │
    ├─→ Create File record with owner_id (from token)
    │
    └─→ Return FileResponse (id, name, content, language, timestamps)

List Files
    │
    ├─→ GET /api/files (requires auth)
    │
    ├─→ Query all File records where owner_id = current_user
    │
    └─→ Return FileListResponse (array of FileResponse)

Update File
    │
    ├─→ PUT /api/files/{file_id} (requires auth)
    │
    ├─→ Verify ownership (file.owner_id == user_id)
    │
    ├─→ Update name/content
    │
    └─→ Return updated FileResponse

Delete File
    │
    ├─→ DELETE /api/files/{file_id} (requires auth)
    │
    ├─→ Verify ownership
    │
    ├─→ Delete File record (cascade: no effect since files don't have children)
    │
    └─→ Return 204 No Content
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### Files Table

```sql
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique names per user
    UNIQUE(owner_id, name)
);

-- Index for common queries
CREATE INDEX idx_files_owner_id ON files(owner_id);
CREATE INDEX idx_files_created_at ON files(created_at);
```

### Relationships

```
User (1) ──────has many────── (Many) File
  │                                │
  ├─ One user can have multiple    ├─ Each file belongs to one user
  │  code files                    └─ Deleted user's files cascade delete
  └─ User must exist for files
```

---

## Key Design Patterns

### 1. **Dependency Injection**

```python
# Database session injection
from fastapi import Depends
from database.db import get_db

@router.get("/path")
async def handler(db: Session = Depends(get_db)):
    # db automatically injected
    # db automatically closed after response
    pass
```

### 2. **Service Locator**

```python
# Singleton services initialized once
from services.gemini_service import gemini_service

result = await gemini_service.explain_code(code)
```

### 3. **Repository Pattern (via SQLAlchemy)**

```python
# Database operations isolated in models
file = db.query(File).filter(File.id == file_id).first()
db.add(new_file)
db.commit()
```

### 4. **Async/Await for I/O**

```python
# Non-blocking external API calls
async def execute_code(code, language):
    # Judge0 API call doesn't block other requests
    response = await httpx_client.post(url, json=payload)
    return response.json()
```

### 5. **Pydantic for Runtime Validation**

```python
# Automatic validation and serialization
class CodeExecuteRequest(BaseModel):
    code: str
    language: str
    stdin: Optional[str] = ""
    
# FastAPI validates incoming data
# Returns 422 Unprocessable Entity if invalid
```

---

## Error Handling Strategy

### Validation Errors

```python
# Pydantic handles validation
# Returns 422 Unprocessable Entity
{
    "detail": [
        {
            "type": "value_error",
            "loc": ["body", "code"],
            "msg": "Field required"
        }
    ]
}
```

### Business Logic Errors

```python
# Explicit HTTP exceptions
from fastapi import HTTPException

raise HTTPException(
    status_code=400,
    detail="Duplicate file name"
)
```

### Server Errors

```python
# Global exception handler
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )
```

---

## Async Architecture

### Event Loop

```
FastAPI Application
    │
    ├─→ Uvicorn (ASGI server)
    │   ├─→ Main event loop
    │   └─→ Worker threads for I/O
    │
    ├─→ Request 1: Code execution (async I/O to Judge0)
    │   While waiting for response...
    │
    ├─→ Request 2: AI explanation (async I/O to Gemini)
    │   While waiting for response...
    │
    └─→ Request 3: File list (fast database query)
        All execute concurrently, no blocking
```

### Benefits

- Single-threaded but handles multiple concurrent requests
- I/O operations don't block other requests
- Better resource utilization
- Handles 100+ concurrent requests efficiently

---

## Security Considerations

### 1. Password Security

```python
# Bcrypt hashing with salt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed = pwd_context.hash(password)
# Cannot be reversed
```

### 2. JWT Token Security

```python
# Tokens contain user_id and expiration
# Signed with JWT_SECRET_KEY (keep secret!)
# Server validates signature on every request
# Tokens expire (default 24 hours)

Header: {
    "alg": "HS256",
    "typ": "JWT"
}
Payload: {
    "user_id": 1,
    "email": "user@example.com",
    "exp": 1705327200,  # Expiration
    "iat": 1705240800   # Issued at
}
Signature: HMAC_SHA256(header.payload, JWT_SECRET_KEY)
```

### 3. Database Access Control

```python
# Ownership verification
file = db.query(File).filter(
    File.id == file_id,
    File.owner_id == current_user_id  # ← Current user only
).first()

# Returns 404 if not authorized (Not Found)
# Don't reveal that resource exists
```

### 4. CORS Configuration

```python
# Only allow trusted origins
CORS_ORIGINS = [
    "http://localhost:3000",  # Dev React
    "http://localhost:5173",  # Dev Vite
    "https://explainmycode.com"  # Production
]

# No wildcard (*) in production
```

### 5. Rate Limiting (Future)

```python
# Prevent brute force attacks
# Implemented per IP or user:
# - 10 login attempts per minute
# - 100 code executions per hour
# - 50 AI requests per hour
```

---

## Performance Optimization

### 1. Database Indexing

```python
# Index frequently queried columns
CREATE INDEX idx_files_owner_id ON files(owner_id);
CREATE INDEX idx_users_email ON users(email);
```

### 2. Connection Pooling

```python
# Reuse database connections
from sqlalchemy import create_engine
engine = create_engine(
    DATABASE_URL,
    pool_size=20,  # Connection pool
    max_overflow=40  # Additional connections if needed
)
```

### 3. Async I/O

```python
# Non-blocking external calls
async def execute_code():
    # Doesn't wait one by one
    # All concurrent
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=data)
```

### 4. Response Caching (Future)

```python
# Cache AI explanations
@app.get("/explain", response_model=AIExplainResponse)
@cache(expire=3600)  # Cache for 1 hour
async def explain(code: str):
    return await mentor_service.generate_code_explanation(code)
```

---

## Testing Strategy

### Unit Tests

```python
# Test individual services
def test_language_detection():
    assert detect_language("print('hi')") == "python"
    assert detect_language("console.log()") == "javascript"
```

### Integration Tests

```python
# Test router + service interaction
def test_execute_code_endpoint(client):
    response = client.post("/api/execute", json={
        "code": "print(42)",
        "language": "python"
    })
    assert response.status_code == 200
    assert "42" in response.json()["output"]
```

### End-to-End Tests

```python
# Test full user flow
def test_user_signup_login_create_file(client):
    # Signup
    signup_resp = client.post("/api/auth/signup", json={...})
    token = signup_resp.json()["access_token"]
    
    # Create file
    file_resp = client.post(
        "/api/files",
        json={...},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert file_resp.status_code == 201
```

---

## Deployment Architecture

### Development

```
Developer Machine
    │
    ├─→ Python venv
    ├─→ PostgreSQL (local or Docker)
    ├─→ Hot reload enabled
    └─→ http://localhost:8000
```

### Production

```
Cloud Server (AWS/GCP/DigitalOcean)
    │
    ├─→ Docker container
    │   ├─→ Python 3.11
    │   ├─→ FastAPI app
    │   └─→ Uvicorn (4 workers)
    │
    ├─→ Load Balancer (Nginx)
    │   ├─→ HTTPS termination
    │   └─→ Request routing
    │
    ├─→ PostgreSQL Database
    │   ├─→ Backup strategy
    │   └─→ Connection pooling
    │
    └─→ Monitoring
        ├─→ Error tracking (Sentry)
        ├─→ Performance monitoring (DataDog)
        └─→ Health checks
```

---

## Configuration Management

### Environment-Based

```python
# config.py reads from .env
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    debug: bool = False
    database_url: str  # From DATABASE_URL env var
    jwt_secret_key: str
    
    class Config:
        env_file = ".env"
```

### Secrets Management

```bash
# Never commit secrets
.env                    # ← Git ignored (local secrets)
.env.example           # ← Git tracked (template, no secrets)
```

### Profile-Based Config (Future)

```python
# Different configs per environment
config/
├── development.py     # Debug=True, local DB
├── staging.py         # Debug=False, staging DB
└── production.py      # Debug=False, prod DB
```

---

## Monitoring & Logging

### Structured Logging

```python
import logging

logger = logging.getLogger(__name__)

logger.info("User signup", extra={
    "user_id": user.id,
    "timestamp": datetime.now()
})
```

### Error Tracking (Future)

```python
import sentry_sdk

sentry_sdk.init(
    dsn="https://...",  # Sentry project
    traces_sample_rate=0.1
)
```

### Health Checks

```python
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "database": check_database(),
        "gemini": check_gemini_api(),
        "judge0": check_judge0_api()
    }
```

---

## Future Enhancements

### Short Term

- [ ] Input validation strengthening
- [ ] Rate limiting per user/IP
- [ ] Database query optimization
- [ ] Caching layer (Redis)
- [ ] Basic test suite

### Long Term

- [ ] User subscription tiers
- [ ] Code review features
- [ ] Collaborative coding
- [ ] IDE extensions
- [ ] Mobile app API
- [ ] WebSocket support (real-time collaboration)
- [ ] Payment integration

---

## Summary

The ExplainMyCode backend uses:

1. **Layered Architecture** - Clear separation of concerns
2. **Async FastAPI** - High concurrency, non-blocking I/O
3. **SQLAlchemy ORM** - Type-safe database operations
4. **Pydantic validation** - Runtime data validation
5. **External Service Integration** - Gemini + Judge0 APIs
6. **JWT Authentication** - Stateless, scalable auth
7. **Error Handling** - Consistent error responses
8. **Security First** - Password hashing, token validation, ownership checks

This architecture is:
- ✅ Production-ready
- ✅ Scalable (async, DB pooling)
- ✅ Maintainable (clear layers, separation of concerns)
- ✅ Secure (password hashing, JWT, ownership checks)
- ✅ Testable (dependency injection, mockable services)
