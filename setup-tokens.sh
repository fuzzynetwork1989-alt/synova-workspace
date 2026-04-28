#!/bin/bash

# Synova AI Token Setup Script
echo "=== Synova AI Token Setup ==="
echo ""

echo "1. Railway Token (railway.app/account/tokens):"
read -p "Enter Railway Token: " railway_token
echo ""

echo "2. Vercel Token (vercel.com/account/tokens):"
read -p "Enter Vercel Token: " vercel_token
echo ""

echo "3. Vercel Org ID:"
read -p "Enter Vercel Org ID: " vercel_org
echo ""

echo "4. Vercel Project ID:"
read -p "Enter Vercel Project ID: " vercel_project
echo ""

echo "5. Expo Token (expo.dev/accounts/[username]/access-tokens):"
read -p "Enter Expo Token: " expo_token
echo ""

echo "6. GitHub Token (github.com/settings/tokens):"
read -p "Enter GitHub Token: " github_token
echo ""

echo "7. OpenAI API Key (platform.openai.com/api-keys):"
read -p "Enter OpenAI API Key: " openai_key
echo ""

echo "8. Anthropic API Key (console.anthropic.com):"
read -p "Enter Anthropic API Key: " anthropic_key
echo ""

echo "9. Sentry DSN:"
read -p "Enter Sentry DSN: " sentry_dsn
echo ""

# Update .env.production file
sed -i.bak "s/railway_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/$railway_token/g" .env.production
sed -i "s/vercel_token_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/$vercel_token/g" .env.production
sed -i "s/org_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/$vercel_org/g" .env.production
sed -i "s/prj_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/$vercel_project/g" .env.production
sed -i "s/exxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/$expo_token/g" .env.production
sed -i "s/ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/$github_token/g" .env.production
sed -i "s/sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/$openai_key/g" .env.production
sed -i "s/sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/$anthropic_key/g" .env.production
sed -i "s|https://xxxxxxxxxxxxxxxxxxxxx.ingest.sentry.io/xxxxxxx|$sentry_dsn|g" .env.production

echo "=== Setup Complete! ==="
echo "Your .env.production file has been updated with your tokens."
echo "Backup saved as .env.production.bak"
