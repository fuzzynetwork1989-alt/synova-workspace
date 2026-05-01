@echo off
echo 🚀 Starting SYNOVA AI Web App...
echo 🌐 Your AI Business Interface
echo.

cd /d "%~dp0repos\synova-web"

echo Starting Next.js on port 3000...
npm run dev

pause
