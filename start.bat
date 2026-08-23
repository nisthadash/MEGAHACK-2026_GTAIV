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

REM ── Check Python ────────────────────────────────────────────
set PYTHON_EXE=python
echo  [*] Python found: %PYTHON_EXE%

REM ── Check Node.js ───────────────────────────────────────────
set NODE_EXE=
set NPM_EXE=

where node >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('where node') do set NODE_EXE=%%i
    for /f "tokens=*" %%i in ('where npm') do set NPM_EXE=%%i
    goto :node_found
)

if exist "%LOCALAPPDATA%\Programs\node-v20.18.0-win-x64\node.exe" (
    set NODE_EXE=%LOCALAPPDATA%\Programs\node-v20.18.0-win-x64\node.exe
    set NPM_EXE=%LOCALAPPDATA%\Programs\node-v20.18.0-win-x64\npm.cmd
    goto :node_found
)
if exist "%ProgramFiles%\nodejs\node.exe" (
    set NODE_EXE=%ProgramFiles%\nodejs\node.exe
    set NPM_EXE=%ProgramFiles%\nodejs\npm.cmd
    goto :node_found
)

echo  [!] Node.js not found.
echo      Installing Node.js via winget...
winget install --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements
if %errorlevel% neq 0 (
    echo  [!] Auto-install failed. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
set "PATH=%ProgramFiles%\nodejs;%PATH%"
set NODE_EXE=%ProgramFiles%\nodejs\node.exe
set NPM_EXE=%ProgramFiles%\nodejs\npm.cmd

:node_found
echo  [*] Node.js found: %NODE_EXE%

REM ── Install backend Python deps if needed ─────────────────────
if not exist "backend\venv" (
    echo  [*] Creating Python virtual environment...
    %PYTHON_EXE% -m venv backend\venv
)
set VENV_PY=backend\venv\Scripts\python.exe

echo  [*] Checking backend dependencies...
%VENV_PY% -m pip install -r backend\requirements.txt -q --disable-pip-version-check

REM ── Install frontend deps if needed ─────────────────────
if not exist "frontend\node_modules" (
    echo  [*] Installing frontend dependencies (first run, may take a minute)...
    cd frontend
    call "%NPM_EXE%" install
    cd ..
)

REM ── Start Backend in new window ─────────────────────────────
echo  [*] Starting Backend on http://localhost:8000 ...
start "ExplainMyCode Backend" cmd /k "cd backend && ..\backend\venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM ── Wait 2 seconds for backend to boot ──────────────────────
timeout /t 2 /nobreak >nul

REM ── Start Frontend in new window ────────────────────────────
echo  [*] Starting Frontend on http://localhost:5173 ...
start "ExplainMyCode Frontend" cmd /k "cd frontend && "%NPM_EXE%" run dev"

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
