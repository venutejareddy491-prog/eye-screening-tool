@echo off
echo ===================================================
echo   Pushing Smart Dry Eye Screening Tool to GitHub
echo ===================================================
echo.

:: Initialize Git repository if not already initialized
if not exist .git (
    echo [1/5] Initializing Git repository...
    git init
) else (
    echo Git repository already initialized.
)

:: Add files
echo [2/5] Staging files...
git add .

:: Commit
echo [3/5] Committing files...
git commit -m "Initial commit: Complete Smart Dry Eye Screening Tool"

:: Set branch to main
echo [4/5] Setting default branch to main...
git branch -M main

:: Add or update remote origin
echo [5/5] Configuring remote origin...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/venutejareddy491-prog/eye-screening-tool.git

:: Push to main
echo.
echo ===================================================
echo   Attempting to push to GitHub (main branch)
echo   Note: If prompted, please authenticate in your browser
echo ===================================================
echo.
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===================================================
    echo   SUCCESS! Your code has been pushed to GitHub.
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo   PUSH FAILED!
    echo   Please check your connection and GitHub credentials,
    echo   then try running this script again.
    echo ===================================================
)

pause
