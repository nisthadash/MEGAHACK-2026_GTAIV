@echo off
title ExplainMyCode IDE

echo.
echo  ██████████████████████████████████████
echo  ██  ExplainMyCode IDE — Starting...  ██
echo  ██████████████████████████████████████
echo.

REM ── Check .env exists ──────────────────────────────────────
if not exist "backend\.env" (
    echo  [!] backend\.env not found!
    echo      Copy backend\.env.example to backend\.env
    echo      and fill in your GEMINI_API_KEY and JWT_SECRET_KEY.
    echo.
    pause
    exit /b 1
)

REM ── Check Python ────────────────────────────────────────────
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Python not found in PATH. Please install Python 3.11+.
    pause
    exit /b 1
)

REM ── Check Node ──────────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Node.js not found in PATH. Please install Node.js 18+.
    pause
    exit /b 1
)

REM ── Install frontend deps if needed ─────────────────────────
if not exist "frontend\node_modules" (
    echo  [*] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

REM ── Start Backend in new window ─────────────────────────────
echo  [*] Starting Backend on http://localhost:8000 ...
start "ExplainMyCode Backend" cmd /k "cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM ── Wait 2 seconds for backend to boot ──────────────────────
timeout /t 2 /nobreak >nul

REM ── Start Frontend in new window ────────────────────────────
echo  [*] Starting Frontend on http://localhost:5173 ...
start "ExplainMyCode Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo  ✅ Both servers are starting!
echo.
echo  Frontend  →  http://localhost:5173
echo  Backend   →  http://localhost:8000
echo  API Docs  →  http://localhost:8000/docs
echo.
echo  Close both terminal windows to stop the servers.
echo.
pause
