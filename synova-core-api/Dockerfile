# Railway Dockerfile - Zero Dependencies
FROM python:3.11-slim

WORKDIR /app

# Copy only what's needed
COPY requirements.txt .
COPY main.py .

# Install minimal dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Run application
CMD ["python", "main.py"]
