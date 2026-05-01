@echo off
echo 🗄️ Fixing SYNOVA AI Database...
echo.

cd /d "%~dp0repos\synova-core-api"

echo Checking database file...
if exist synova_ai.db (
    echo ✅ Database file exists
) else (
    echo ❌ Database file missing - will be created automatically
)

echo.
echo Starting API server (will create database if needed)...
node main.js

pause
