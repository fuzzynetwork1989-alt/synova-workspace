#!/bin/bash

echo "🧠 SYNOVA AI - Pure Knowledge Python Fix"
echo "=========================================="
echo

echo "Step 1: Checking Python installation..."
python --version
if [ $? -ne 0 ]; then
    echo "❌ Python not found"
    echo "Installing Python 3.11..."
    
    # Download and install Python 3.11
    curl -O https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe
    sudo wine python-3.11.9-amd64.exe /quiet InstallAllUsers=1 PrependPath=1
    rm python-3.11.9-amd64.exe
fi

echo
echo "Step 2: Setting up Python environment..."
cd repos/synova-core-api

echo "Installing required packages..."
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn sqlalchemy psycopg2-binary python-multipart python-jose[cryptography] passlib[bcrypt] python-dotenv

echo
echo "Step 3: Testing Python functionality..."
python -c "import fastapi, uvicorn; print('✅ Pure Knowledge Python working correctly')"

echo
echo "Step 4: Creating VS Code settings..."
mkdir -p ../.vscode
cat > ../.vscode/settings.json << 'EOF'
{
    "python.defaultInterpreterPath": "python",
    "python.terminal.activateEnvironment": true,
    "python.linting.enabled": true,
    "python.linting.pylintEnabled": false,
    "python.linting.flake8Enabled": false,
    "ruff.interpreter": "python",
    "ruff.enable": true,
    "ruff.fixOnSave": true
}
EOF

echo
echo "✅ Pure Knowledge Python environment configured!"
echo "Restart your IDE to apply changes."
echo
