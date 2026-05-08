#!/bin/bash

# Development Start Script
# Starts server with hot reload and development features

set -e

echo "🔧 Starting API System in Development Mode..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
fi

# Create data directory
mkdir -p data logs

# Set development environment
export NODE_ENV=development

echo "🌟 Starting development server with hot reload..."
echo "📊 Admin dashboard: http://localhost:3000/admin.html"
echo "🔑 API endpoints: http://localhost:3000/api/v1"
echo "📝 Watching for file changes..."
echo ""

npm run dev
