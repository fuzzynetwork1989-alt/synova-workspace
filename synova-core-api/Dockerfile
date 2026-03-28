# Railway Dockerfile - Python Fix
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Verify Python installation
RUN python3 --version && which python3

# Install system dependencies
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN python3 -m pip install --upgrade pip

# Install Python dependencies
RUN pip3 install --no-cache-dir fastapi==0.104.1 uvicorn[standard]==0.24.0 pydantic==2.5.0 python-multipart==0.0.6

# Copy application files
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["python3", "main.py"]
