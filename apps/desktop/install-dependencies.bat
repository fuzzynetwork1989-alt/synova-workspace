@echo off
echo Installing Synova Desktop dependencies...
cd /d "%~dp0"
call npm install
if %errorlevel% neq 0 (
    echo Error: npm install failed
    exit /b %errorlevel%
)
echo Installation complete!
pause
