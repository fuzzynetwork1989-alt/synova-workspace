@echo on
echo Starting Synova AI API Server...
cd /d "%~dp0"
set APP_PORT=8001
python -m pip install -r requirements.txt
cd src
python main.py
