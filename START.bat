@echo off
title Smart Dry Eye Screening
cd /d "%~dp0"

echo ============================================
echo  Smart Dry Eye Screening Tool
echo ============================================
echo.
echo Starting API (port 5000) and Web App (port 5173)...
echo Keep both windows open while using the app.
echo.

start "Dry Eye - API Server" cmd /k "cd /d "%~dp0server" && npm run dev"
timeout /t 2 /nobreak >nul
start "Dry Eye - Web App" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo Wait ~5 seconds, then open in your browser:
echo   http://localhost:5173
echo.
echo Admin panel:
echo   1. Login at http://localhost:5173/login
echo   2. Email: admin@dryeye.com  Password: admin123
echo   3. Go to http://localhost:5173/admin
echo.
echo If you see Error -102, the web app window may have closed.
echo Run this file again or check the "Dry Eye - Web App" window for errors.
echo.
pause
