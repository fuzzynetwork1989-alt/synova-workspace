# WSL Setup Guide for Synova AI Development

**Version**: 1.0  
**Date**: April 24, 2026  
**Purpose**: Configure Windows Subsystem for Linux for optimal Synova AI development

---

## Overview

This guide walks through setting up WSL2 for Synova AI development, including Python, Node.js, Docker, and development tools.

---

## Prerequisites

- Windows 10 (Build 19041 or higher) or Windows 11
- Administrator privileges
- At least 20GB free disk space
- 8GB+ RAM recommended

---

## Step 1: Install WSL2

### Enable WSL Features

Open PowerShell as Administrator and run:

```powershell
# Enable WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Enable Virtual Machine Platform
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart computer
Restart-Computer
```

### Set WSL2 as Default

After restart, run in PowerShell as Administrator:

```powershell
wsl --set-default-version 2
```

### Install Ubuntu

Install Ubuntu 22.04 LTS (recommended):

```powershell
# From Microsoft Store or PowerShell
wsl --install -d Ubuntu-22.04
```

Complete the setup by creating a username and password when prompted.

---

## Step 2: Initial WSL Configuration

### Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### Install Essential Tools

```bash
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    vim \
    htop \
    tree \
    jq
```

### Configure Git

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global core.autocrlf input
git config --global init.defaultBranch main
```

### Generate SSH Keys

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
```

Add the public key to your GitHub/GitLab account.

---

## Step 3: Python Development Setup

### Install Python 3.10+

```bash
# Install pyenv for Python version management
curl https://pyenv.run | bash

# Add pyenv to PATH
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc

# Reload shell
source ~/.bashrc

# Install Python 3.10
pyenv install 3.10.14
pyenv global 3.10.14
```

### Install Poetry for Dependency Management

```bash
curl -sSL https://install.python-poetry.org | python3 -

# Add Poetry to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Configure Poetry

```bash
poetry config virtualenvs.in-project true
poetry config virtualenvs.create true
```

### Install Common Python Packages

```bash
pip install --upgrade pip
pip install \
    black \
    isort \
    flake8 \
    mypy \
    pytest \
    pytest-cov \
    ipython \
    jupyter
```

---

## Step 4: Node.js Development Setup

### Install Node.js via nvm

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 18 LTS
nvm install 18
nvm use 18
nvm alias default 18
```

### Install Global npm Packages

```bash
npm install -g \
    yarn \
    pnpm \
    typescript \
    ts-node \
    @vue/cli \
    create-react-app \
    next \
    prettier \
    eslint
```

### Configure npm

```bash
npm config set init-author-name "Your Name"
npm config set init-author-email "your.email@example.com"
npm config set init-license "MIT"
```

---

## Step 5: Docker Setup

### Install Docker

```bash
# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker
```

### Verify Docker Installation

```bash
# Log out and back in for group changes to take effect
docker --version
docker compose version
docker run hello-world
```

### Configure Docker Daemon

Create `/etc/docker/daemon.json`:

```json
{
  "builder": {
    "gc": {
      "enabled": true,
      "defaultKeepStorage": "20GB"
    }
  },
  "experimental": false,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "registry-mirrors": [],
  "storage-driver": "overlay2"
}
```

Restart Docker:

```bash
sudo systemctl restart docker
```

---

## Step 6: Database Setup

### Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Install Redis

```bash
sudo apt install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### Install MongoDB (Optional)

```bash
# Add MongoDB repository
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## Step 7: Development Tools

### Install VS Code Server

```bash
# Install code command
curl -Lk 'https://code.visualstudio.com/sha/download?build=stable&os=cli-alpine-x64' \
    --output vscode_cli.tar.gz
tar -xf vscode_cli.tar.gz
sudo mv code /usr/local/bin/
rm vscode_cli.tar.gz

# Install VS Code extensions
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat
```

### Configure VS Code Settings

Create `~/.config/Code/User/settings.json`:

```json
{
  "terminal.integrated.defaultProfile.linux": "bash",
  "python.defaultInterpreterPath": "~/.pyenv/versions/3.10.14/bin/python",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "files.eol": "\n",
  "git.enableSmartCommit": true,
  "git.autofetch": true
}
```

### Install Tmux for Terminal Management

```bash
sudo apt install -y tmux
```

Configure `~/.tmux.conf`:

```bash
# Set prefix to Ctrl-a
set -g prefix C-a
unbind C-b
bind C-a send-prefix

# Enable mouse support
set -g mouse on

# Set base index to 1
set -g base-index 1
setw -g pane-base-index 1

# Split panes
bind | split-window -h
bind - split-window -v

# Reload config
bind r source-file ~/.tmux.conf
```

---

## Step 8: Synova AI Project Setup

### Clone Repository

```bash
cd ~
git clone https://github.com/your-org/synova-workspace.git
cd synova-workspace
```

### Set Up Python Environment

```bash
cd apps/api
poetry install
```

### Set Up Node.js Environment

```bash
cd apps/web
npm install
```

### Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your configuration
vim .env
```

### Start Services

```bash
# Start PostgreSQL and Redis
sudo systemctl start postgresql
sudo systemctl start redis-server

# Start Docker services (if using Docker Compose)
docker compose up -d
```

---

## Step 9: WSL Performance Optimization

### Increase Memory Limits

Create `%UserProfile%\.wslconfig` on Windows:

```ini
[wsl2]
memory=16GB
processors=8
swap=8GB
swapFile=C:\\temp\\wsl-swap.vhdx
```

Restart WSL:

```powershell
wsl --shutdown
```

### Configure File System Performance

Add to `~/.bashrc`:

```bash
# Improve file system performance
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### Enable Systemd (Ubuntu 22.04+)

```bash
# Enable systemd
echo "[boot]" | sudo tee -a /etc/wsl.conf
echo "systemd=true" | sudo tee -a /etc/wsl.conf

# Restart WSL
wsl --shutdown
```

---

## Step 10: Security Configuration

### Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8000/tcp
sudo ufw enable
```

### Set Up SSH Keys for GitHub

```bash
# Copy existing keys or generate new ones
ssh-keygen -t ed25519 -C "github@synova.ai"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Test connection
ssh -T git@github.com
```

### Configure Git Credentials

```bash
# Use credential helper
git config --global credential.helper store
```

---

## Step 11: Backup and Maintenance

### Set Up Automated Backups

```bash
# Install rsync
sudo apt install -y rsync

# Create backup script
cat > ~/backup.sh << 'EOF'
#!/bin/bash
rsync -avz --progress ~/synova-workspace /mnt/c/Users/$USER/Backups/
EOF

chmod +x ~/backup.sh
```

### Set Up Cron Jobs

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * ~/backup.sh
```

### System Cleanup

```bash
# Clean package cache
sudo apt autoremove -y
sudo apt autoclean -y

# Clean Docker
docker system prune -a --volumes

# Clean Python cache
find . -type d -name __pycache__ -exec rm -rf {} +
find . -type f -name "*.pyc" -delete
```

---

## Troubleshooting

### WSL Connection Timeout (HCS_E_CONNECTION_TIMEOUT)

If you encounter the error `Wsl/Service/RegisterDistro/CreateVm/HCS_E_CONNECTION_TIMEOUT`, see the comprehensive fix guide:

**[WSL Docker Timeout Fix Guide](WSL_DOCKER_TIMEOUT_FIX.md)**

Quick fix steps:
```powershell
# Step 1: Shutdown WSL
wsl --shutdown

# Step 2: Restart Docker Desktop (manually)
# Right-click Docker Desktop icon → Quit → Relaunch

# Step 3: Test WSL2
wsl -d Ubuntu docker --version
```

### WSL Issues

**WSL won't start:**
```powershell
wsl --shutdown
wsl
```

**Network issues:**
```bash
# Restart WSL networking
sudo service networking restart
```

### Docker Issues

**Permission denied:**
```bash
sudo usermod -aG docker $USER
# Log out and back in
```

**Docker daemon not running:**
```bash
sudo systemctl start docker
sudo systemctl status docker
```

### Python Issues

**Module not found:**
```bash
pip install --upgrade pip
poetry install
```

**Path issues:**
```bash
echo $PATH
# Ensure pyenv and poetry are in PATH
```

### Node.js Issues

**Permission denied:**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## Useful Commands

### WSL Commands

```bash
# List WSL distributions
wsl --list --verbose

# Set default distribution
wsl --set-default Ubuntu-22.04

# Shutdown WSL
wsl --shutdown

# Update WSL kernel
wsl --update
```

### System Commands

```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
htop

# Check system logs
journalctl -xe
```

### Development Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Run tests
cd apps/api && poetry run pytest

# Run linting
cd apps/api && poetry run black .
cd apps/web && npm run lint
```

---

## Next Steps

1. Complete the WSL setup
2. Clone the Synova AI repository
3. Set up development environment
4. Run the application locally
5. Configure CI/CD pipeline

---

## Additional Resources

- [WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [Docker Documentation](https://docs.docker.com/)
- [Python Documentation](https://docs.python.org/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Synova AI Documentation](../complete/SYNOVA_COMPLETE_OVERVIEW.md)

---

*For issues or questions, contact the Synova AI development team.*
