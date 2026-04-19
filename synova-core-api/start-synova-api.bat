@echo off
echo 🧠 Starting SYNOVA AI API Server...
echo 🔑 Your Own API Key System
echo.

cd /d "%~dp0repos\synova-core-api"

echo Starting server on port 8000...
node main.js

pause
