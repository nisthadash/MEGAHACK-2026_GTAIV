# ExplainMyCode Backend API Reference

Comprehensive reference for all API endpoints with request/response examples.

## Base URL

```
http://localhost:8000
```

## Authentication

All protected endpoints require an Authorization header:

```
Authorization: Bearer {access_token}
```

Tokens are obtained through the authentication endpoints and expire after 24 hours.

---

## Authentication Endpoints

### 1. User Signup

Create a new user account.

**Endpoint:**
```
POST /api/auth/signup
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Validation Rules:**
- Username: 3-50 characters, alphanumeric with underscores
- Email: Valid email format, must be unique
- Password: Min 8 characters, recommended 12+

**Success Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400 Bad Request` - User already registered, invalid email, weak password
- `500 Internal Server Error` - Database error

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

---

### 2. User Login

Authenticate and receive JWT token.

**Endpoint:**
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - Account inactive
- `404 Not Found` - User not found

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

---

### 3. Get Current User

Retrieve authenticated user information.

**Endpoint:**
```
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found

---

### 4. Forgot Password

Request password reset (email integration ready).

**Endpoint:**
```
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "message": "If an account with this email exists, you will receive a password reset link"
}
```

**Note:** Response is the same regardless of whether email exists (security best practice).

---

## Code Execution Endpoints

### 5. Execute Code

Execute code in a supported language.

**Endpoint:**
```
POST /api/execute
```

**Request Body:**
```json
{
  "code": "print('Hello, World!')",
  "language": "python",
  "stdin": ""
}
```

**Supported Languages:**
- `python`
- `javascript`
- `java`
- `cpp`
- `c`

**Parameters:**
- `code` (required): Code to execute, max 50KB
- `language` (required): Programming language
- `stdin` (optional): Standard input for the program

**Success Response (200 OK):**
```json
{
  "output": "Hello, World!\n",
  "stderr": "",
  "status": "accepted",
  "exit_code": 0,
  "execution_time": 0.25
}
```

**Status Values:**
- `accepted` - Execution succeeded
- `wrong_answer` - Output mismatch (for judge scenarios)
- `time_limit_exceeded` - Execution took too long
- `compilation_error` - Syntax error
- `runtime_error` - Code crashed during execution

**Error Responses:**
- `400 Bad Request` - Unsupported language, code too large
- `500 Internal Server Error` - Execution timeout or service error

**Example: Python Code**
```bash
curl -X POST http://localhost:8000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "for i in range(5):\n    print(i)",
    "language": "python"
  }'
```

**Example: JavaScript Code**
```bash
curl -X POST http://localhost:8000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "console.log(\"Hello from JS\");",
    "language": "javascript"
  }'
```

**Example: With Input**
```bash
curl -X POST http://localhost:8000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "name = input(\"Enter name: \")\nprint(f\"Hello, {name}!\")",
    "language": "python",
    "stdin": "John"
  }'
```

---

### 6. Execution Health Check

**Endpoint:**
```
GET /api/execute/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "Judge0 Code Execution"
}
```

---

## AI Services Endpoints

### 7. Explain Code

Get AI-powered code explanation and analysis.

**Endpoint:**
```
POST /api/ai/explain
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "code": "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)"
}
```

**Success Response (200 OK):**
```json
{
  "summary": "Recursive Fibonacci sequence generator",
  "explanation": "This function calculates the nth Fibonacci number using recursion...",
  "key_concepts": [
    "Recursion",
    "Base case",
    "Mathematical sequence",
    "Time complexity (exponential)"
  ],
  "potential_bugs": [
    "Exponential time complexity O(2^n) - slow for large n",
    "Stack overflow risk for n > 1000",
    "No memoization for repeated calculations"
  ],
  "optimizations": [
    "Use memoization/dynamic programming",
    "Implement iterative solution",
    "Add input validation for n >= 0"
  ]
}
```

**Error Responses:**
- `400 Bad Request` - Code too large (>50KB)
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - AI service error

---

### 8. AI Mentor Chat

Interactive conversation with AI mentor.

**Endpoint:**
```
POST /api/ai/mentor
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "message": "How can I optimize this recursive function?",
  "code": "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)"
}
```

**Parameters:**
- `message` (required): Question or request, max 5000 characters
- `code` (optional): Code context for the question

**Success Response (200 OK):**
```json
{
  "response": "Great question! Your recursive solution is elegant but inefficient. The main issue is that it recalculates the same fibonacci values multiple times...",
  "suggestions": [
    "Implement memoization using a dictionary",
    "Consider the iterative approach for better performance",
    "Add input validation to handle edge cases"
  ],
  "resources": [
    "Dynamic Programming Guide",
    "Memoization Patterns",
    "Python Performance Optimization"
  ]
}
```

**Error Responses:**
- `400 Bad Request` - Message too long
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - AI service error

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/ai/mentor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "What is this code doing?",
    "code": "print(sum([x**2 for x in range(10)]))"
  }'
```

---

## Code Analysis Endpoints

### 9. Analyze Code

Get code metrics, complexity, and quality scores.

**Endpoint:**
```
POST /api/analysis
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "code": "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr"
}
```

**Success Response (200 OK):**
```json
{
  "total_lines": 8,
  "functions": 1,
  "loops": 2,
  "conditions": 1,
  "complexity_score": 65,
  "quality_score": 72,
  "language_detected": "python",
  "metrics": {
    "functions_per_100_lines": 12.5,
    "conditions_per_100_lines": 12.5,
    "average_function_size": 8,
    "readability_score": 78,
    "maintainability_score": 70
  }
}
```

**Metrics Explanation:**
- `complexity_score`: Cyclomatic complexity (0-100), lower is better
- `quality_score`: Combined score based on structure (0-100)
- `functions_per_100_lines`: Function density (optimal: 5-10)
- `conditions_per_100_lines`: Decision density (optimal: 2-5)

**Error Responses:**
- `400 Bad Request` - Code too large
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Analysis error

---

### 10. Analysis Health Check

**Endpoint:**
```
GET /api/analysis/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "Code Analysis"
}
```

---

## File Management Endpoints

### 11. Create File

Create and save a new code file.

**Endpoint:**
```
POST /api/files
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "solution.py",
  "content": "def hello():\n    print('Hello, World!')",
  "language": "python"
}
```

**Supported Languages:**
- `python`
- `javascript`
- `java`
- `cpp`
- `c`

**Success Response (201 Created):**
```json
{
  "id": 42,
  "name": "solution.py",
  "content": "def hello():\n    print('Hello, World!')",
  "language": "python",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Duplicate name, unsupported language, name too long
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Database error

---

### 12. List User Files

Get all files for the authenticated user.

**Endpoint:**
```
GET /api/files
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200 OK):**
```json
{
  "files": [
    {
      "id": 1,
      "name": "hello.py",
      "content": "print('Hello')",
      "language": "python",
      "created_at": "2024-01-15T09:00:00Z",
      "updated_at": "2024-01-15T09:00:00Z"
    },
    {
      "id": 2,
      "name": "solution.py",
      "content": "def solve():\n    pass",
      "language": "python",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `500 Internal Server Error` - Database error

---

### 13. Get Specific File

Retrieve a single file by ID.

**Endpoint:**
```
GET /api/files/{file_id}
```

**Path Parameters:**
- `file_id` (integer): File ID

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "hello.py",
  "content": "print('Hello, World!')",
  "language": "python",
  "created_at": "2024-01-15T09:00:00Z",
  "updated_at": "2024-01-15T09:00:00Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - File not found or not owned by user

---

### 14. Update File

Update file name and/or content.

**Endpoint:**
```
PUT /api/files/{file_id}
```

**Path Parameters:**
- `file_id` (integer): File ID

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "updated_solution.py",
  "content": "def solve():\n    return 42"
}
```

**Note:** Both `name` and `content` are optional. Omitted fields are unchanged.

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "updated_solution.py",
  "content": "def solve():\n    return 42",
  "language": "python",
  "created_at": "2024-01-15T09:00:00Z",
  "updated_at": "2024-01-15T10:45:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Duplicate name, name too long
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - File not found
- `500 Internal Server Error` - Database error

---

### 15. Delete File

Delete a file permanently.

**Endpoint:**
```
DELETE /api/files/{file_id}
```

**Path Parameters:**
- `file_id` (integer): File ID

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (204 No Content)**
```
(Empty response body)
```

**Error Responses:**
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - File not found
- `500 Internal Server Error` - Database error

---

## General Endpoints

### Health Check

**Endpoint:**
```
GET /health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "ExplainMyCode API",
  "version": "1.0.0"
}
```

### Root Endpoint

**Endpoint:**
```
GET /
```

**Response (200 OK):**
```json
{
  "message": "Welcome to ExplainMyCode API",
  "docs": "/docs",
  "redoc": "/redoc",
  "openapi": "/openapi.json"
}
```

---

## Status Codes Reference

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, POST (for data), PUT |
| 201 | Created | Successfully created resource |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input, validation failure |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

---

## Rate Limiting

Current implementation supports:
- Per-endpoint rate limiting
- Per-user rate limiting
- IP-based rate limiting (optional)

Contact API administrator for specific limits.

---

## Pagination

File listing may be paginated in future versions. Current implementation returns all files.

---

## Versioning

Current API version: **1.0.0**

Change tracking:
- v1.0.0 - Initial release with auth, execution, AI, analysis, files endpoints

---

## Testing with cURL

### Chain: Signup → Get User → Create File → List Files → Execute → Explain

```bash
# 1. Signup
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "TestPass123!"
  }' | jq -r '.access_token')

# 2. Get current user
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 3. Create file
curl -X POST http://localhost:8000/api/files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "test.py",
    "content": "print(42)",
    "language": "python"
  }'

# 4. List files
curl -X GET http://localhost:8000/api/files \
  -H "Authorization: Bearer $TOKEN"

# 5. Execute code
curl -X POST http://localhost:8000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(42)",
    "language": "python"
  }'

# 6. Explain code
curl -X POST http://localhost:8000/api/ai/explain \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "code": "print(42)"
  }'
```

---

## API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI Schema:** http://localhost:8000/openapi.json
