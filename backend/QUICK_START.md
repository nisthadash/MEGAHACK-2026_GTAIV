# Backend Quick Start Guide

Get the ExplainMyCode backend running in 5 minutes.

## Minimum Requirements

- Python 3.9+
- PostgreSQL (running locally or remote)
- API keys: Gemini + Judge0 (from RapidAPI)

## Quick Setup

### Step 1: Clone & Navigate (30 seconds)

```bash
cd backend
```

### Step 2: Virtual Environment (1 minute)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies (2 minutes)

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment (1 minute)

```bash
# Copy template
cp .env.example .env

# Edit with your values (minimum required):
# DATABASE_URL=postgresql://user:password@localhost:5432/explain_my_code
# JWT_SECRET_KEY=your-random-secret-key
# GEMINI_API_KEY=your-key
# JUDGE0_API_KEY=your-key
```

**Generate JWT Secret:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### Step 5: Run Server (10 seconds)

```bash
python -m uvicorn main:app --reload
```

✅ **Server running at:** http://localhost:8000

---

## Get API Keys

### Gemini API

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key to `GEMINI_API_KEY` in `.env`

### Judge0 API

1. Go to https://rapidapi.com/judge0-official/api/judge0-ce
2. Subscribe (free tier available)
3. Copy API key to `JUDGE0_API_KEY` in `.env`
4. Set `JUDGE0_API_HOST=judge0-ce.p.rapidapi.com`

---

## Quick Test

Open another terminal:

```bash
# Test signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Test code execution (no auth needed)
curl -X POST http://localhost:8000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello from backend!\")",
    "language": "python"
  }'
```

---

## API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Detailed API Reference:** See `API_REFERENCE.md`

---

## Database Setup

**First run:** Tables create automatically

**Manual setup:**
```bash
python -c "
from database.db import engine
from models.user import Base
Base.metadata.create_all(bind=engine)
print('Tables created successfully')
"
```

---

## Common Issues

### `ModuleNotFoundError: No module named 'fastapi'`
→ Run `pip install -r requirements.txt`

### `ERROR: Can't connect to database`
→ Check `DATABASE_URL` in `.env`
→ Ensure PostgreSQL is running

### `401 Unauthorized` on protected endpoints
→ Add `Authorization: Bearer YOUR_TOKEN` header
→ Get token from signup/login

### `CORS error from frontend`
→ Update `CORS_ORIGINS` in `.env` to include your frontend URL

### Port 8000 already in use
→ Run on different port: `python -m uvicorn main:app --port 8001`

---

## Next Steps

1. **Test all endpoints:** See `API_REFERENCE.md`
2. **Connect frontend:** Update frontend API URL to `http://localhost:8000`
3. **Deploy:** See Docker setup in `BACKEND_README.md`
4. **Production:** Enable HTTPS, use strong JWT secret, configure rate limiting

---

## File Structure

```
backend/
├── main.py           ← Start here (FastAPI app)
├── requirements.txt  ← Dependencies
├── .env.example      ← Configuration template
├── config.py         ← Settings
├── database/db.py    ← Database connection
├── models/           ← ORM models (User, File)
├── schemas/          ← Request/response validation
├── services/         ← Business logic (Gemini, Judge0, etc.)
└── routers/          ← API endpoints
```

---

## Useful Commands

```bash
# Run with specific port
python -m uvicorn main:app --port 8001

# Run without auto-reload (production-like)
python -m uvicorn main:app --reload=False

# Access database
psql -U your_user -d explain_my_code

# Run tests (when available)
pytest

# Format code
black .

# Lint
flake8 .

# Type check
mypy .
```

---

## Environment Variables

**Essential:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
JWT_SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-key
JUDGE0_API_KEY=your-judge0-key
```

**Optional:**
```
DEBUG=True                    # Enable debug mode
JWT_EXPIRATION_HOURS=24      # Token expiration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
SUPPORTED_LANGUAGES=python,javascript,java,cpp,c
```

---

## Integration with Frontend

In your frontend React app:

```typescript
// src/api/client.ts
const API_BASE_URL = 'http://localhost:8000';

export const apiClient = {
  async executeCode(code: string, language: string) {
    const res = await fetch(`${API_BASE_URL}/api/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language })
    });
    return res.json();
  },
  
  async explainCode(code: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/api/ai/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ code })
    });
    return res.json();
  }
  // ... more methods
};
```

---

## Performance Tips

- **Code Execution:** Typical latency 0.5-5 seconds (depends on code complexity)
- **AI Explanations:** 2-10 seconds (Gemini API latency)
- **File Operations:** <100ms (local database)

---

## Security Checklist

- [ ] Change JWT_SECRET_KEY in production
- [ ] Use strong PostgreSQL password
- [ ] Enable HTTPS in production
- [ ] Use environment-specific `.env` files
- [ ] Never commit `.env` (only `.env.example`)
- [ ] Update CORS_ORIGINS for production URL
- [ ] Rate limit sensitive endpoints
- [ ] Validate all user inputs

---

## Troubleshooting

**Check server health:**
```bash
curl http://localhost:8000/health
```

**Check API documentation:**
```
http://localhost:8000/docs
```

**View server logs:**
Watch the terminal where you ran `python -m uvicorn main:app --reload`

**Reset database:**
```bash
# Delete and recreate database
dropdb explain_my_code
createdb explain_my_code
# Server will recreate tables on next run
```

---

## Support

- Full docs: `BACKEND_README.md`
- API reference: `API_REFERENCE.md`
- Architecture: Check individual files for docstrings
- Frontend integration: `../FRONTEND_README.md`

---

**Ready to code! 🚀**
