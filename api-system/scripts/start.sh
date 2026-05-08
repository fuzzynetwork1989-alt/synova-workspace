#!/bin/bash

# API System Start Script
# Handles environment setup and server startup

set -e

echo "🚀 Starting Free API Key Management System..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create data directory if it doesn't exist
mkdir -p data logs

# Start the server
echo "🌟 Starting server on http://localhost:3000"
echo "📊 Admin dashboard: http://localhost:3000/admin.html"
echo "🔑 API endpoints: http://localhost:3000/api/v1"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
