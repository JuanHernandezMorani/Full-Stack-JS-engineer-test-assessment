@echo off
setlocal
title Country Explorer - Verification

echo ============================================================
echo Country Explorer - Verification
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [FAIL] Node.js was not found in PATH.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [FAIL] npm was not found in PATH.
  pause
  exit /b 1
)

echo [INFO] Node:
node --version
echo [INFO] npm:
call npm --version
echo.

echo [1/3] Install dependencies
call npm install
if errorlevel 1 goto :fail

echo.
echo [2/3] Tests
call npm test
if errorlevel 1 goto :fail

echo.
echo [3/3] Production build
call npm run build
if errorlevel 1 goto :fail

echo.
echo ============================================================
echo [PASS] Verification completed successfully.
echo ============================================================
pause
exit /b 0

:fail
echo.
echo ============================================================
echo [FAIL] Verification failed.
echo ============================================================
pause
exit /b 1
