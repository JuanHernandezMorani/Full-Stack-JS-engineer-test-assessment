@echo off
setlocal
title Country Explorer - Development

echo ============================================================
echo Country Explorer - Development
echo ============================================================
echo.

if not exist node_modules (
  echo [INFO] Installing dependencies...
  call npm install
  if errorlevel 1 goto :fail
)

call npm run dev
exit /b %errorlevel%

:fail
echo.
echo [FAIL] Dependency installation failed.
pause
exit /b 1
