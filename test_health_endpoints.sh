#!/bin/bash

# Test script for Railway health endpoints
# Run this after deployment to verify all services

echo "Testing Railway Deployment Health Endpoints..."
echo "=========================================="

# Test Core API
echo "1. Testing synova-core-api..."
curl -f https://synova-core-api-production.up.railway.app/health || echo "FAILED: Core API health check failed"

# Test Frontend
echo "2. Testing synova-ui-system..."
curl -f https://synova-ui-system-production.up.railway.app || echo "FAILED: UI System health check failed"

# Test Holo Renderer
echo "3. Testing synova-holo-renderer..."
curl -f https://synova-holo-renderer-production.up.railway.app/health || echo "FAILED: Holo Renderer health check failed"

# Test Monitoring
echo "4. Testing synova-monitoring..."
curl -f https://synova-monitoring-production.up.railway.app/health || echo "FAILED: Monitoring health check failed"

# Test Revenue
echo "5. Testing synova-revenue..."
curl -f https://synova-revenue-production.up.railway.app/health || echo "FAILED: Revenue health check failed"

# Test Voice Integration
echo "6. Testing synova-voice-integration..."
curl -f https://synova-voice-integration-production.up.railway.app/health || echo "FAILED: Voice Integration health check failed"

# Test Brain
echo "7. Testing synova-brain..."
curl -f https://synova-brain-production.up.railway.app/health || echo "FAILED: Brain health check failed"

echo "=========================================="
echo "Health check testing complete!"
echo "If any tests failed, check the Railway deployment logs."
