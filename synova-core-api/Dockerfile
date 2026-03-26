# Railway Dockerfile with proper port configuration
FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements-railway.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements-railway.txt

# Copy application code
COPY . .

# Expose Railway port
EXPOSE $PORT

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=$PORT

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Start the application
CMD ["python", "start_railway.py"]
