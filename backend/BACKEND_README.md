# ExplainMyCode Backend API

A production-ready FastAPI backend for an AI-powered coding IDE with code execution, analysis, and intelligent mentoring.

## Features

- **User Authentication**: JWT-based signup/login with secure password hashing
- **Code Execution**: Execute code in 5+ languages (Python, JavaScript, Java, C++, C) via Judge0 API
- **AI Code Explanation**: Gemini-powered code analysis and explanation
- **AI Mentoring**: Interactive mentoring with context-aware advice
- **Code Analysis**: Metrics, complexity calculation, and quality scoring
- **File Management**: Save, organize, and manage code files
- **Multi-language Support**: Python, JavaScript, Java, C++, C

## Tech Stack

- **Framework**: FastAPI (Python, async-first)
- **Database**: PostgreSQL + SQLAlchemy ORM
- **Authentication**: JWT + bcrypt password hashing
- **AI**: Google Gemini 1.5 Flash API
- **Code Execution**: Judge0 API
- **Async HTTP**: httpx
- **Environment**: python-dotenv

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── config.py               # Configuration and settings
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variables template
│
├── database/
│   └── db.py              # SQLAlchemy setup, engine, session
│
├── models/
│   ├── user.py            # User database model
│   └── file.py            # File database model
│
├── schemas/
│   ├── auth_schema.py      # Pydantic schemas for authentication
│   ├── code_schema.py      # Pydantic schemas for code execution
│   └── ai_schema.py        # Pydantic schemas for AI services
│
├── routers/
│   ├── auth.py            # Authentication endpoints (/api/auth)
│   ├── execute.py         # Code execution endpoints (/api/execute)
│   ├── ai.py              # AI endpoints (/api/ai)
│   ├── analysis.py        # Code analysis endpoints (/api/analysis)
│   └── files.py           # File management endpoints (/api/files)
│
├── services/
│   ├── gemini_service.py       # Gemini API integration
│   ├── judge0_service.py       # Judge0 API integration
│   ├── analysis_service.py     # Code analysis logic
│   └── mentor_service.py       # AI mentoring service
│
└── utils/
    ├── auth_utils.py           # JWT and password utilities
    └── language_detector.py    # Language detection
```

## Installation

### Prerequisites

- Python 3.9+
- PostgreSQL 12+
- Judge0 API key (from RapidAPI)
- Gemini API key (from Google AI Studio)

### Setup

1. **Clone the repository** and navigate to backend directory:
```bash
cd backend
```

2. **Create a Python virtual environment**:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**:
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your configuration
# Required:
# - DATABASE_URL: PostgreSQL connection string
# - JWT_SECRET_KEY: Secret key for JWT tokens (generate: openssl rand -hex 32)
# - GEMINI_API_KEY: Your Gemini API key
# - JUDGE0_API_KEY: Your Judge0 RapidAPI key
```

5. **Set up the database**:
```bash
# The tables will be created automatically when you run the server
# But you can verify the connection:
python -c "from database.db import engine; from models.user import Base; Base.metadata.create_all(bind=engine)"
```

## Configuration

Edit `.env` file to configure:

```env
# FastAPI
DEBUG=True                           # Debug mode

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/explain_my_code

# JWT
JWT_SECRET_KEY=your-secret-key      # Generate with: openssl rand -hex 32
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Gemini API
GEMINI_API_KEY=your-gemini-key

# Judge0 API
JUDGE0_API_KEY=your-judge0-key
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8000

# Supported Languages
SUPPORTED_LANGUAGES=python,javascript,java,cpp,c
```

## Running the Server

### Development Mode

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Production Mode

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Gunicorn + Uvicorn (Production)

```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## API Endpoints

### Authentication (`/api/auth`)

- **POST /api/auth/signup** - Create new account
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secure_password"
  }
  ```
  Returns: `TokenResponse` with access_token

- **POST /api/auth/login** - Login with credentials
  ```json
  {
    "email": "john@example.com",
    "password": "secure_password"
  }
  ```
  Returns: `TokenResponse` with access_token

- **POST /api/auth/forgot-password** - Request password reset
  ```json
  {
    "email": "john@example.com"
  }
  ```

- **GET /api/auth/me** - Get current user info
  - Requires: `Authorization: Bearer <token>`
  - Returns: `UserResponse`

### Code Execution (`/api/execute`)

- **POST /api/execute** - Execute code
  ```json
  {
    "code": "print('Hello, World!')",
    "language": "python",
    "stdin": ""
  }
  ```
  Returns: `CodeExecuteResponse` with output, stderr, status, execution_time

- **GET /api/execute/health** - Health check

### AI Services (`/api/ai`)

- **POST /api/ai/explain** - Get code explanation
  ```json
  {
    "code": "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)"
  }
  ```
  Returns: `AIExplainResponse` with summary, explanation, concepts, bugs, optimizations
  - Requires: `Authorization: Bearer <token>`

- **POST /api/ai/mentor** - Chat with AI mentor
  ```json
  {
    "message": "How can I optimize this recursive function?",
    "code": "optional code context"
  }
  ```
  Returns: `AIMentorResponse` with response, suggestions, resources
  - Requires: `Authorization: Bearer <token>`

### Code Analysis (`/api/analysis`)

- **POST /api/analysis** - Analyze code metrics
  ```json
  {
    "code": "your code here"
  }
  ```
  Returns: `CodeAnalysisResponse` with metrics, complexity, quality score
  - Requires: `Authorization: Bearer <token>`

- **GET /api/analysis/health** - Health check

### File Management (`/api/files`)

- **POST /api/files** - Create new file
  ```json
  {
    "name": "solution.py",
    "content": "print('Hello')",
    "language": "python"
  }
  ```
  Returns: `FileResponse`
  - Requires: `Authorization: Bearer <token>`

- **GET /api/files** - List all user's files
  - Requires: `Authorization: Bearer <token>`
  - Returns: `FileListResponse`

- **GET /api/files/{file_id}** - Get specific file
  - Requires: `Authorization: Bearer <token>`
  - Returns: `FileResponse`

- **PUT /api/files/{file_id}** - Update file
  ```json
  {
    "name": "new_name.py",
    "content": "updated content"
  }
  ```
  - Requires: `Authorization: Bearer <token>`

- **DELETE /api/files/{file_id}** - Delete file
  - Requires: `Authorization: Bearer <token>`

## Database Models

### User
```python
- id: Integer (Primary Key)
- username: String (Unique, 50 chars)
- email: String (Unique, 255 chars)
- hashed_password: String
- is_active: Boolean (default: True)
- created_at: DateTime
- updated_at: DateTime
- files: Relationship to File (One-to-Many)
```

### File
```python
- id: Integer (Primary Key)
- name: String (255 chars)
- content: Text
- language: String (50 chars)
- owner_id: Integer (Foreign Key → User)
- created_at: DateTime
- updated_at: DateTime
- owner: Relationship to User
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "detail": "Error message",
  "status_code": 400
}
```

Common status codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Deletion successful
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Authentication

All protected endpoints require JWT token in Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token format:
- Valid for 24 hours (configurable)
- Contains: user_id, email, exp (expiration), iat (issued at)
- Generated during signup/login

## Supported Languages

Code execution supported for:
- **Python** (default)
- **JavaScript** (Node.js)
- **Java**
- **C++**
- **C**

## Performance & Limits

- Maximum code size: 50 KB
- Code execution timeout: 30 seconds
- Message length limit: 5000 characters
- Maximum file name: 255 characters
- Rate limiting: Configurable per CORS origin

## Testing

### Manual API Testing

Use curl or Postman:

```bash
# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123"}'

# Get token from response, then use in subsequent requests
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Execute code
curl -X POST http://localhost:8000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"code":"print(42)","language":"python"}'
```

### API Documentation

- Interactive Swagger UI: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`
- OpenAPI schema: `http://localhost:8000/openapi.json`

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
psql -U postgres -h localhost

# Verify DATABASE_URL format
# postgresql://user:password@host:port/database
```

### API Key Issues

- **Gemini API**: Get from https://makersuite.google.com/app/apikey
- **Judge0 API**: Get from https://rapidapi.com/judge0-official/api/judge0-ce

### CORS Issues

Update `CORS_ORIGINS` in `.env` to include your frontend URL:
```
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Port Already in Use

```bash
# Change port
python -m uvicorn main:app --host 0.0.0.0 --port 8001
# Or kill process using port 8000
# Windows: netstat -ano | findstr :8000 then taskkill /PID <PID> /F
# Mac/Linux: lsof -i :8000 then kill -9 <PID>
```

## Development Notes

- All services have async methods ready for concurrent execution
- Database models use SQLAlchemy 2.0+ with type hints
- Pydantic schemas provide automatic request/response validation
- Language detection uses regex patterns (fallback to Python)
- Complexity scoring uses cyclomatic complexity algorithm
- Quality scoring combines complexity, readability, and structure

## Contributing

When adding new features:
1. Add database models in `models/`
2. Add Pydantic schemas in `schemas/`
3. Add business logic in `services/`
4. Create router in `routers/`
5. Include error handling
6. Update this README

## Security Considerations

- Never commit `.env` file (only `.env.example`)
- Rotate JWT_SECRET_KEY in production
- Use strong PostgreSQL passwords
- Enable HTTPS in production
- Rate limit sensitive endpoints
- Validate all user input
- Use environment-specific configurations

## License

MIT

## Support

For issues or questions, please check:
- API documentation: `/docs`
- Frontend README: `../FRONTEND_README.md`
- Guidelines: `../guidelines/Guidelines.md`
