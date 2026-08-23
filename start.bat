@echo off
title ExplainMyCode IDE
chcp 65001 >nul

echo.
echo  ==========================================
echo    ExplainMyCode IDE -- Starting...
echo  ==========================================
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

REM ── Add local Node.js to PATH if present ─────────────────────
if exist "%LOCALAPPDATA%\Programs\node-v20.18.0-win-x64\node.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\node-v20.18.0-win-x64;%PATH%"
)
if exist "%ProgramFiles%\nodejs\node.exe" (
    set "PATH=%ProgramFiles%\nodejs;%PATH%"
)

REM ── Verify Python ────────────────────────────────────────────
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Python not found in PATH. Please install Python 3.11+.
    pause
    exit /b 1
)
echo  [*] Python found

REM ── Verify Node.js ───────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Node.js not found in PATH. Installing via winget...
    winget install --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements
    set "PATH=%ProgramFiles%\nodejs;%PATH%"
)
echo  [*] Node.js found

REM ── Install backend Python deps if needed ─────────────────────
if not exist "backend\venv" (
    echo  [*] Creating Python virtual environment...
    python -m venv backend\venv
)

echo  [*] Checking backend dependencies...
backend\venv\Scripts\python.exe -m pip install -r backend\requirements.txt -q --disable-pip-version-check

REM ── Install frontend deps if needed ─────────────────────
if not exist "frontend\node_modules" (
    echo  [*] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

REM ── Start Backend in new window ─────────────────────────────
echo  [*] Starting Backend on http://localhost:8000 ...
start "ExplainMyCode Backend" cmd /k "cd backend && venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM ── Wait 2 seconds for backend to boot ──────────────────────
timeout /t 2 /nobreak >nul

REM ── Start Frontend in new window ────────────────────────────
echo  [*] Starting Frontend on http://localhost:5173 ...
start "ExplainMyCode Frontend" cmd /k "set PATH=%PATH% && cd frontend && npm run dev"

echo.
echo  ==========================================
echo    Both servers are starting!
echo  ==========================================
echo.
echo   Frontend  --  http://localhost:5173
echo   Backend   --  http://localhost:8000
echo   API Docs  --  http://localhost:8000/docs
echo.
echo  Close both terminal windows to stop the servers.
echo.
pause
