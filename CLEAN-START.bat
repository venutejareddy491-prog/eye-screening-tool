@echo off
title Smart Dry Eye Screening - Fresh Launch
cd /d "%~dp0"

echo ====================================================
echo  Smart Dry Eye Screening — Automated Clean Start
echo ====================================================
echo.
echo 1. Terminating any old active node servers (freed ports)...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo 2. Launching new dry eye API server (port 5000)...
start "Dry Eye - API Server" cmd /k "cd /d "%~dp0server" && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo 3. Launching new dry eye client web app (port 5173)...
start "Dry Eye - Web App" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo ====================================================
echo  Done! In 5 seconds, navigate your browser to:
echo        http://localhost:5173/register
echo ====================================================
echo.
pause
