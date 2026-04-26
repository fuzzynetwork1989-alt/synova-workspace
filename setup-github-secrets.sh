#!/bin/bash
# GitHub Secrets Setup Script for Synova AI v4.1
# Run this after: gh auth login

set -e

echo "🔐 Setting up GitHub Secrets for Synova AI Deployment"
echo "=================================================="

# Repository configuration
MAIN_REPO="fuzzynetwork1989-alt/synova-workspace"
ASTRO_REPO="fuzzynetwork1989-alt/astranova"
NEXXUS_REPO="fuzzynetwork1989-alt/synova-nexxus-ecosystem"

echo "📋 Repositories to configure:"
echo "   Main: $MAIN_REPO"
echo "   Astro: $ASTRO_REPO"
echo "   Nexxus: $NEXXUS_REPO"
echo ""

# Function to set secret with error handling
set_secret() {
    local repo=$1
    local secret_name=$2
    local secret_value=$3

    echo "🔑 Setting $secret_name in $repo..."
    if echo "$secret_value" | gh secret set "$secret_name" --repo "$repo"; then
        echo "✅ $secret_name set successfully"
    else
        echo "❌ Failed to set $secret_name"
        return 1
    fi
}

# Core secrets for main repository
echo "🏗️ Setting up main repository secrets..."
echo ""

# Railway Configuration
set_secret "$MAIN_REPO" "RAILWAY_TOKEN" "your_railway_token_here"
set_secret "$MAIN_REPO" "RAILWAY_PROJECT_ID" "your_railway_project_id"

# Vercel Configuration
set_secret "$MAIN_REPO" "VERCEL_TOKEN" "your_vercel_token_here"
set_secret "$MAIN_REPO" "VERCEL_ORG_ID" "your_vercel_org_id_here"
set_secret "$MAIN_REPO" "VERCEL_PROJECT_ID" "your_vercel_project_id_here"

# Expo/EAS Configuration
set_secret "$MAIN_REPO" "EAS_TOKEN" "your_expo_eas_token_here"
set_secret "$MAIN_REPO" "EAS_PROJECT_ID" "your_expo_project_id_here"

# Database Configuration
set_secret "$MAIN_REPO" "POSTGRES_PASSWORD" "your_secure_postgres_password"
set_secret "$MAIN_REPO" "REDIS_PASSWORD" "your_secure_redis_password"

# API Keys
set_secret "$MAIN_REPO" "OPENAI_API_KEY" "your_openai_key_here"
set_secret "$MAIN_REPO" "ANTHROPIC_API_KEY" "your_anthropic_key_here"

# Security
set_secret "$MAIN_REPO" "JWT_SECRET" "your_jwt_secret_here"
set_secret "$MAIN_REPO" "SESSION_SECRET" "your_session_secret_here"
set_secret "$MAIN_REPO" "ENCRYPTION_KEY" "your_32_char_encryption_key"

# Monitoring
set_secret "$MAIN_REPO" "SENTRY_DSN" "your_sentry_dsn_here"
set_secret "$MAIN_REPO" "GRAFANA_PASSWORD" "your_grafana_password"

# AWS (if using S3)
set_secret "$MAIN_REPO" "AWS_ACCESS_KEY_ID" "your_aws_access_key"
set_secret "$MAIN_REPO" "AWS_SECRET_ACCESS_KEY" "your_aws_secret_key"
set_secret "$MAIN_REPO" "AWS_S3_BUCKET" "your_s3_bucket_name"

# Email Configuration
set_secret "$MAIN_REPO" "SMTP_HOST" "your_smtp_host"
set_secret "$MAIN_REPO" "SMTP_USER" "your_smtp_username"
set_secret "$MAIN_REPO" "SMTP_PASS" "your_smtp_password"

echo ""
echo "🌟 Setting up additional repository secrets..."
echo ""

# Astranova repository
set_secret "$ASTRO_REPO" "NEXT_PUBLIC_SUPABASE_URL" "your_supabase_url_here"

# Nexxus Ecosystem repository
set_secret "$NEXXUS_REPO" "RAILWAY_TOKEN" "your_railway_token_here"
set_secret "$NEXXUS_REPO" "EAS_PROJECT_ID" "your_expo_project_id_here"
set_secret "$NEXXUS_REPO" "STRIPE_SECRET_KEY" "your_stripe_secret_key_here"

echo ""
echo "🎉 GitHub Secrets Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Replace placeholder values with actual tokens"
echo "   2. Update your .env.production file"
echo "   3. Run the deployment script"
echo ""
echo "🔗 Quick Links for Tokens:"
echo "   Railway: https://railway.app/account/tokens"
echo "   Vercel: https://vercel.com/account/tokens"
echo "   Expo: https://expo.dev/accounts/~/settings/access-tokens"
echo "   GitHub: https://github.com/settings/tokens"
echo ""
echo "⚠️  Important: Never commit actual secrets to Git!"
echo "   Use GitHub Secrets for production deployments only"
