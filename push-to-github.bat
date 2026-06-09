@echo off
echo ===================================================
echo   Pushing Smart Dry Eye Screening Tool to GitHub
echo ===================================================
echo.

:: Determine Git executable
set "GIT=git"
%GIT% --version >nul 2>&1
if errorlevel 1 (
    if exist "C:\Program Files\Git\cmd\git.exe" (
        set "GIT=C:\Program Files\Git\cmd\git.exe"
    ) else if exist "C:\Program Files (x86)\Git\cmd\git.exe" (
        set "GIT=C:\Program Files (x86)\Git\cmd\git.exe"
    ) else if exist "%USERPROFILE%\AppData\Local\Programs\Git\cmd\git.exe" (
        set "GIT=%USERPROFILE%\AppData\Local\Programs\Git\cmd\git.exe"
    )
)
%GIT% --version >nul 2>&1
if errorlevel 1 (
    echo Git is not installed or not in PATH. Install Git for Windows and try again.
    pause
    exit /b 1
)

:: Parameters: [remote-url] [commit-message]
set "REMOTE=%~1"
set "COMMIT_MSG=%~2"
if "%REMOTE%"=="" set "REMOTE=https://github.com/venutejareddy491-prog/eye-screening-tool.git"
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=chore: update files"

set "BRANCH=gitmain"

:: Initialize Git repository if not already initialized
if not exist .git (
    echo [1/5] Initializing Git repository...
    %GIT% init
    %GIT% checkout -b %BRANCH%
) else (
    echo Git repository already initialized.
    :: Ensure we're on the target branch
    %GIT% rev-parse --verify %BRANCH% >nul 2>&1
    if errorlevel 1 (
        %GIT% checkout -b %BRANCH%
    ) else (
        %GIT% checkout %BRANCH%
    )
)

:: Add files
echo [2/5] Staging files...
%GIT% add .

:: Commit (only if there are staged changes)
echo [3/5] Committing files (if any)...
%GIT% diff --staged --quiet >nul 2>&1
if errorlevel 1 (
    %GIT% commit -m "%COMMIT_MSG%"
) else (
    echo No changes to commit.
)

:: Add or update remote origin
echo [4/5] Configuring remote origin...
%GIT% remote remove origin >nul 2>&1
%GIT% remote add origin %REMOTE%

:: Push to branch
echo.
echo ===================================================
echo   Attempting to push to GitHub (%BRANCH% branch)
echo   Note: You may be prompted to authenticate.
echo ===================================================
echo.
%GIT% push -u origin %BRANCH%

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