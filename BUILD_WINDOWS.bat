@echo off
setlocal
title Country Explorer - Production Build

echo ============================================================
echo Country Explorer - Production Build
echo ============================================================
echo.

call npm install
if errorlevel 1 goto :fail

call npm run build
if errorlevel 1 goto :fail

echo.
echo [PASS] Production build completed.
pause
exit /b 0

:fail
echo.
echo [FAIL] Build failed.
pause
exit /b 1
