@echo off
echo 🐠 Installing Synova AI Dependencies for Python 3.14
echo =====================================================
echo.
echo Installing core packages...
echo.

echo [1/8] Installing FastAPI...
pip install fastapi
echo.

echo [2/8] Installing Uvicorn (ASGI server)...
pip install uvicorn
echo.

echo [3/8] Installing SQLAlchemy (database)...
pip install sqlalchemy
echo.

echo [4/8] Installing PostgreSQL adapter...
pip install psycopg2-binary
echo.

echo [5/8] Installing Redis client...
pip install redis
echo.

echo [6/8] Installing environment variables...
pip install python-dotenv
echo.

echo [7/8] Installing HTTP client...
pip install requests
echo.

echo [8/8] Installing AI provider SDKs...
pip install openai anthropic google-generativeai
echo.

echo ✅ All dependencies installed for Python 3.14!
echo.
echo Now you can run:
echo   cd repos\synova-core-api
echo   python main.py
echo.
pause
