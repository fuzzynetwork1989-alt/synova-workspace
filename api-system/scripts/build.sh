#!/bin/bash

# Build Script
# Prepares the application for production

set -e

echo "🏗 Building Free API Key Management System..."

# Clean previous builds
rm -rf dist build

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run tests
echo "🧪 Running tests..."
npm test

# Create production build directory
mkdir -p dist

# Copy essential files
echo "📁 Copying files..."
cp -r src/ dist/
cp package.json dist/
cp package-lock.json dist/
cp .env.example dist/

# Create production startup script
cat > dist/start-prod.js << 'EOF'
import dotenv from 'dotenv';
import path from 'path';

// Load production environment
dotenv.config({ path: path.join(__dirname, '.env') });

// Import and start server
import('./server.js');
EOF

echo "✅ Build completed!"
echo "📦 Production files in ./dist/"
echo "🚀 To start: cd dist && node start-prod.js"
