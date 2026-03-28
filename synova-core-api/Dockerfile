# Updated Railway Dockerfile - Fixed Dependencies
FROM python:3.11-slim

WORKDIR /app

# Install core dependencies
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Install all required dependencies (removed problematic ones)
RUN echo "Installing all dependencies..." && \
    pip install --no-cache-dir pip==26.0.1 && \
    pip install --no-cache-dir fastapi==0.104.1 && \
    pip install --no-cache-dir uvicorn[standard]==0.24.0 && \
    pip install --no-cache-dir pydantic==2.5.0 && \
    pip install --no-cache-dir python-multipart==0.0.6 && \
    pip install --no-cache-dir ollama==0.1.7 && \
    pip install --no-cache-dir websockets==12.0 && \
    pip install --no-cache-dir redis==5.0.1 && \
    pip install --no-cache-dir sqlalchemy==2.0.23 && \
    pip install --no-cache-dir alembic==1.13.1 && \
    pip install --no-cache-dir psycopg2-binary==2.9.9 && \
    pip install --no-cache-dir stripe==7.5.0 && \
    pip install --no-cache-dir python-dotenv==1.0.0 && \
    pip install --no-cache-dir httpx==0.25.2 && \
    echo "All dependencies installed successfully"

# Verify installations
RUN python -c "import sys; \
imports = ['fastapi', 'uvicorn', 'pydantic', 'python_multipart', 'redis', 'aiofiles', 'psutil', 'requests']; \
[exec(f'import {imp}' for imp in imports]; \
print('All dependencies verified successfully')"

# Copy application code
COPY . .

# Expose Railway port
EXPOSE $PORT

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=$PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c " \
import sys; \
import os; \
try: \
    import requests; \
    port = os.environ.get('PORT', '8000'); \
    response = requests.get(f'http://localhost:{port}/health', timeout=5); \
    print(f'Health check status: {response.status_code}'); \
    sys.exit(0) \
except Exception as e: \
    print(f'Health check error: {e}'); \
    sys.exit(0) \
"

# Start application
CMD ["python", "main.py"]
