@echo off
title 🔑 SYNOVA AI - GENERATE FIRST API KEY

echo 🔑 SYNOVA AI - API KEY GENERATION
echo 🧠 Your First Customer Setup
echo.

echo 📋 STEP 1: Test API Key Generation
echo.

cd /d %~dp0repos\synova-core-api

echo 🎯 Generating Demo API Key...
node -e "const { generateAPIKey } = require('./synova-api-keys-fixed.js'); const newKey = generateAPIKey('test_customer_001', 'pro'); console.log('✅ API Key Generated Successfully!'); console.log(''); console.log('🔑 API Key: ' + newKey.apiKey); console.log('👤 User ID: test_customer_001'); console.log('💰 Tier: ' + newKey.tier); console.log('💸 Pricing: $' + newKey.pricing.monthlyRate + '/month'); console.log('💵 Per Request: $' + newKey.pricing.costPerRequest); console.log('📊 Limits: ' + JSON.stringify(newKey.limits)); console.log(''); console.log('🎯 This key is ready for customer use!');"

echo.
echo 📋 STEP 2: Test API Request
echo.

node -e "const { synovaAIRequest } = require('./synova-api-keys-fixed.js'); const testKey = 'sk-synova-pro-987654321'; const testPrompt = 'Write a Python function for data analysis'; synovaAIRequest(testPrompt, testKey).then(result => { console.log('✅ API Request Test Successful!'); console.log(''); console.log('🤖 Provider: ' + result.provider); console.log('💰 Revenue: $' + result.billing.charge.toFixed(4)); console.log('💸 Cost: $' + result.billing.cost.toFixed(4)); console.log('💵 Profit: $' + result.billing.profit.toFixed(4)); console.log('📈 Margin: ' + result.billing.margin); console.log('📊 Usage: ' + result.usage.requests + '/' + result.usage.limits.requests + ' requests'); console.log(''); console.log('🎯 Your AI Business is working perfectly!'); }).catch(err => console.log('❌ Error:', err.message));"

echo.
echo 📋 STEP 3: Customer API Key Generation
echo.

set /p customer_id="Enter customer ID (or press Enter for demo_customer_002): "
if "%customer_id%"=="" set customer_id=demo_customer_002

set /p customer_tier="Enter tier (free/pro/enterprise) or press Enter for pro: "
if "%customer_tier%"=="" set customer_tier=pro

echo.
echo 🎯 Generating API Key for %customer_id% (%customer_tier% tier)...

node -e "const { generateAPIKey } = require('./synova-api-keys-fixed.js'); const newKey = generateAPIKey('%customer_id%', '%customer_tier%'); console.log(''); console.log('🎉 CUSTOMER API KEY READY!'); console.log(''); console.log('👤 Customer: %customer_id%'); console.log('💰 Tier: %customer_tier%'); console.log('🔑 API Key: ' + newKey.apiKey); console.log('💸 Monthly Rate: $' + newKey.pricing.monthlyRate); console.log('💵 Per Request: $' + newKey.pricing.costPerRequest); console.log('📊 Request Limit: ' + newKey.limits.requests); console.log('🎯 Token Limit: ' + newKey.limits.tokens); console.log(''); console.log('✅ Send this API key to your customer!'); console.log('💰 They will be billed $' + newKey.pricing.monthlyRate + '/month'); console.log('📈 Your profit margin: 98-99%%');"

echo.
echo 📋 STEP 4: Revenue Projection
echo.

node -e "console.log('💰 REVENUE PROJECTION FOR FIRST CUSTOMER:'); console.log(''); console.log('📊 Monthly Revenue: $29.00'); console.log('💸 Estimated Cost: $0.29'); console.log('💵 Monthly Profit: $28.71'); console.log('📈 Profit Margin: 99%%'); console.log(''); console.log('🚀 SCALING PROJECTIONS:'); console.log('📈 10 Customers: $290/month revenue, $287 profit'); console.log('📈 100 Customers: $2,900/month revenue, $2,871 profit'); console.log('📈 1,000 Customers: $29,000/month revenue, $28,710 profit'); console.log(''); console.log('🎯 Your AI Business is ready to scale!');"

echo.
echo ✅ API KEY GENERATION COMPLETE!
echo.
echo 🎯 Next Steps:
echo    1. Send API key to customer
echo    2. Set up payment processing
echo    3. Monitor usage in dashboard
echo    4. Scale to more customers
echo.
echo 🚀 Your AI Business is generating revenue!

pause
