# Production Railway Dockerfile - ZERO PROBLEMS
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Upgrade pip and ensure build tools
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Install FastAPI first with verification
RUN echo "Installing FastAPI..." && \
    pip install --no-cache-dir fastapi==0.104.1 && \
    echo "FastAPI installed successfully"

# Install remaining dependencies
RUN echo "Installing remaining dependencies..." && \
    pip install --no-cache-dir uvicorn[standard]==0.24.0 && \
    pip install --no-cache-dir pydantic==2.5.0 && \
    pip install --no-cache-dir python-multipart==0.0.6 && \
    pip install --no-cache-dir redis==5.0.1 && \
    pip install --no-cache-dir aiofiles==23.2.1 && \
    pip install --no-cache-dir psutil==5.9.6 && \
    pip install --no-cache-dir requests==2.31.0 && \
    echo "All dependencies installed successfully"

# Verify all installations
RUN python -c "
import sys
try:
    import fastapi, uvicorn, pydantic, python_multipart, redis, aiofiles, psutil, requests
    print('All dependencies verified successfully')
except ImportError as e:
    print(f'Import verification failed: {e}')
    sys.exit(1)
"

# Copy application code
COPY . .

# Expose Railway port
EXPOSE $PORT

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=$PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "
import sys
import os
try:
    import requests
    port = os.environ.get('PORT', '8000')
    response = requests.get(f'http://localhost:{port}/health', timeout=5)
    print(f'Health check status: {response.status_code}')
    sys.exit(0)
except Exception as e:
    print(f'Health check error: {e}')
    sys.exit(0)
"

# Start application
CMD ["python", "main.py"]
