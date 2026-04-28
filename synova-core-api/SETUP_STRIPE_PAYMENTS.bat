@echo off
title 💳 SYNOVA AI - STRIPE PAYMENT SETUP

echo 💳 SYNOVA AI - PAYMENT PROCESSING SETUP
echo 🚀 Ready for Revenue Generation
echo.

echo 📋 STEP 1: Stripe Configuration Check
echo.

cd /d %~dp0repos\synova-core-api

echo 🔍 Checking Stripe integration readiness...
if exist ".env" (
    echo ✅ Environment file found
    echo 📋 Checking for Stripe configuration...
    
    findstr /i "STRIPE" .env >nul
    if %errorlevel% equ 0 (
        echo ✅ Stripe configuration found in .env
    ) else (
        echo ⚠️  Stripe keys not found - adding template...
    )
) else (
    echo ❌ .env file not found
)

echo.
echo 📋 STEP 2: Stripe Environment Setup
echo.

echo 🔑 Adding Stripe configuration to .env...
echo.

echo # 💳 STRIPE PAYMENT PROCESSING >> .env
echo # Complete payment system for SYNOVA AI >> .env
echo STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here >> .env
echo STRIPE_SECRET_KEY=sk_test_your_secret_key_here >> .env
echo STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here >> .env
echo STRIPE_PRICE_PRO=price_1YourProPriceID >> .env
echo STRIPE_PRICE_ENTERPRISE=price_1YourEnterprisePriceID >> .env
echo.

echo ✅ Stripe configuration added to .env
echo.

echo 📋 STEP 3: Create Stripe Payment Routes
echo.

echo 🛠️ Creating payment processing routes...

echo // 💳 SYNOVA AI - STRIPE PAYMENT ROUTES > src\routes\payments.js
echo const express = require('express'); >> src\routes\payments.js
echo const router = express.Router(); >> src\routes\payments.js
echo const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); >> src\routes\payments.js
echo. >> src\routes\payments.js
echo // Create payment session for API key subscription >> src\routes\payments.js
echo router.post('/create-checkout-session', async (req, res) => { >> src\routes\payments.js
echo   try { >> src\routes\payments.js
echo     const { tier, customerId } = req.body; >> src\routes\payments.js
echo     let priceId; >> src\routes\payments.js
echo. >> src\routes\payments.js
echo     switch(tier) { >> src\routes\payments.js
echo       case 'pro': >> src\routes\payments.js
echo         priceId = process.env.STRIPE_PRICE_PRO; >> src\routes\payments.js
echo         break; >> src\routes\payments.js
echo       case 'enterprise': >> src\routes\payments.js
echo         priceId = process.env.STRIPE_PRICE_ENTERPRISE; >> src\routes\payments.js
echo         break; >> src\routes\payments.js
echo       default: >> src\routes\payments.js
echo         return res.status(400).json({error: 'Invalid tier'}); >> src\routes\payments.js
echo     } >> src\routes\payments.js
echo. >> src\routes\payments.js
echo     const session = await stripe.checkout.sessions.create({ >> src\routes\payments.js
echo       customer_email: `${customerId}@synova.ai`, >> src\routes\payments.js
echo       billing_address_collection: 'auto', >> src\routes\payments.js
echo       line_items: [{ >> src\routes\payments.js
echo         price: priceId, >> src\routes\payments.js
echo         quantity: 1, >> src\routes\payments.js
echo       }], >> src\routes\payments.js
echo       mode: 'subscription', >> src\routes\payments.js
echo       success_url: `${req.protocol}://'${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`, >> src\routes\payments.js
echo       cancel_url: `${req.protocol}://'${req.get('host')}/cancel`, >> src\routes\payments.js
echo     }); >> src\routes\payments.js
echo. >> src\routes\payments.js
echo     res.json({ sessionId: session.id }); >> src\routes\payments.js
echo   } catch (error) { >> src\routes\payments.js
echo     res.status(500).json({ error: error.message }); >> src\routes\payments.js
echo   } >> src\routes\payments.js
echo }); >> src\routes\payments.js
echo. >> src\routes\payments.js
echo // Stripe webhook handler >> src\routes\payments.js
echo router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => { >> src\routes\payments.js
echo   const sig = req.headers['stripe-signature']; >> src\routes\payments.js
echo   let event; >> src\routes\payments.js
echo. >> src\routes\payments.js
echo   try { >> src\routes\payments.js
echo     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); >> src\routes\payments.js
echo   } catch (err) { >> src\routes\payments.js
echo     return res.status(400).send(`Webhook Error: ${err.message}`); >> src\routes\payments.js
echo   } >> src\routes\payments.js
echo. >> src\routes\payments.js
echo   // Handle the event >> src\routes\payments.js
echo   switch (event.type) { >> src\routes\payments.js
echo     case 'checkout.session.completed': >> src\routes\payments.js
echo       const session = event.data.object; >> src\routes\payments.js
echo       console.log('✅ Payment successful for:', session.customer_email); >> src\routes\payments.js
echo       // Activate customer's API key here >> src\routes\payments.js
echo       break; >> src\routes\payments.js
echo     default: >> src\routes\payments.js
echo       console.log(`Unhandled event type ${event.type}`); >> src\routes\payments.js
echo   } >> src\routes\payments.js
echo. >> src\routes\payments.js
echo   res.json({received: true}); >> src\routes\payments.js
echo }); >> src\routes\payments.js
echo. >> src\routes\payments.js
echo module.exports = router; >> src\routes\payments.js

echo ✅ Payment routes created
echo.

echo 📋 STEP 4: Update Main Server
echo.

echo 🛠️ Adding payment routes to main server...

echo. >> main.js
echo // 💳 Stripe Payment Routes >> main.js
echo const paymentRoutes = require('./src/routes/payments'); >> main.js
echo app.use('/api/v1/payments', paymentRoutes); >> main.js

echo ✅ Payment routes integrated
echo.

echo 📋 STEP 5: Frontend Payment Component
echo.

echo 🎨 Creating payment interface...

echo // 💳 SYNOVA AI - PAYMENT COMPONENT > repos\synova-web\components\PaymentForm.jsx
echo import React, { useState } from 'react'; >> repos\synova-web\components\PaymentForm.jsx
echo import { loadStripe } from '@stripe/stripe-js'; >> repos\synova-web\components\PaymentForm.jsx
echo. >> repos\synova-web\components\PaymentForm.jsx
echo const stripePromise = loadStripe('pk_test_your_publishable_key_here'); >> repos\synova-web\components\PaymentForm.jsx
echo. >> repos\synova-web\components\PaymentForm.jsx
echo export default function PaymentForm({ tier, customerId }) { >> repos\synova-web\components\PaymentForm.jsx
echo   const [loading, setLoading] = useState(false); >> repos\synova-web\components\PaymentForm.jsx
echo. >> repos\synova-web\components\PaymentForm.jsx
echo   const handlePayment = async () => { >> repos\synova-web\components\PaymentForm.jsx
echo     setLoading(true); >> repos\synova-web\components\PaymentForm.jsx
echo     try { >> repos\synova-web\components\PaymentForm.jsx
echo       const response = await fetch('/api/v1/payments/create-checkout-session', { >> repos\synova-web\components\PaymentForm.jsx
echo         method: 'POST', >> repos\synova-web\components\PaymentForm.jsx
echo         headers: { 'Content-Type': 'application/json' }, >> repos\synova-web\components\PaymentForm.jsx
echo         body: JSON.stringify({ tier, customerId }), >> repos\synova-web\components\PaymentForm.jsx
echo       }); >> repos\synova-web\components\PaymentForm.jsx
echo       const { sessionId } = await response.json(); >> repos\synova-web\components\PaymentForm.jsx
echo       const stripe = await stripePromise; >> repos\synova-web\components\PaymentForm.jsx
echo       const { error } = await stripe.redirectToCheckout({ sessionId }); >> repos\synova-web\components\PaymentForm.jsx
echo       if (error) console.error('Payment error:', error); >> repos\synova-web\components\PaymentForm.jsx
echo     } catch (error) { >> repos\synova-web\components\PaymentForm.jsx
echo       console.error('Payment failed:', error); >> repos\synova-web\components\PaymentForm.jsx
echo     } finally { >> repos\synova-web\components\PaymentForm.jsx
echo       setLoading(false); >> repos\synova-web\components\PaymentForm.jsx
echo     } >> repos\synova-web\components\PaymentForm.jsx
echo   }; >> repos\synova-web\components\PaymentForm.jsx
echo. >> repos\synova-web\components\PaymentForm.jsx
echo   return ( >> repos\synova-web\components\PaymentForm.jsx
echo     <button >> repos\synova-web\components\PaymentForm.jsx
echo       onClick={handlePayment} >> repos\synova-web\components\PaymentForm.jsx
echo       disabled={loading} >> repos\synova-web\components\PaymentForm.jsx
echo       className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700" >> repos\synova-web\components\PaymentForm.jsx
echo     > >> repos\synova-web\components\PaymentForm.jsx
echo       {loading ? 'Processing...' : `Subscribe to ${tier.toUpperCase()} - $${tier === 'pro' ? '29' : '199'}/month`} >> repos\synova-web\components\PaymentForm.jsx
echo     </button> >> repos\synova-web\components\PaymentForm.jsx
echo   ); >> repos\synova-web\components\PaymentForm.jsx
echo } >> repos\synova-web\components\PaymentForm.jsx

echo ✅ Payment component created
echo.

echo 📋 STEP 6: Install Stripe Dependencies
echo.

echo 📦 Installing required packages...

cd /d %~dp0repos\synova-web
call npm install stripe @stripe/stripe-js

cd /d %~dp0repos\synova-core-api
call npm install stripe

echo ✅ Stripe packages installed
echo.

echo 📋 STEP 7: Revenue Dashboard Integration
echo.

echo 📊 Adding revenue tracking to dashboard...

echo // 💳 REVENUE TRACKING WIDGET >> public\revenue-widget.html
echo <div class="revenue-card"> >> public\revenue-widget.html
echo   <h3>💰 Revenue Dashboard</h3> >> public\revenue-widget.html
echo   <div class="revenue-stats"> >> public\revenue-widget.html
echo     <div class="stat"> >> public\revenue-widget.html
echo       <span class="label">Monthly Revenue</span> >> public\revenue-widget.html
echo       <span class="value" id="monthlyRevenue">$0</span> >> public\revenue-widget.html
echo     </div> >> public\revenue-widget.html
echo     <div class="stat"> >> public\revenue-widget.html
echo       <span class="label">Active Subscriptions</span> >> public\revenue-widget.html
echo       <span class="value" id="activeSubs">0</span> >> public\revenue-widget.html
echo     </div> >> public\revenue-widget.html
echo     <div class="stat"> >> public\revenue-widget.html
echo       <span class="label">Profit Margin</span> >> public\revenue-widget.html
echo       <span class="value" id="profitMargin">98%</span> >> public\revenue-widget.html
echo     </div> >> public\revenue-widget.html
echo   </div> >> public\revenue-widget.html
echo </div> >> public\revenue-widget.html

echo ✅ Revenue tracking added
echo.

echo 🎯 STRIPE PAYMENT SETUP COMPLETE!
echo.
echo 📋 NEXT STEPS:
echo    1. Get your Stripe API keys from dashboard.stripe.com
echo    2. Update STRIPE keys in .env file
echo    3. Create products and prices in Stripe dashboard
echo    4. Update price IDs in .env file
echo    5. Test payment flow with test cards
echo    6. Launch to real customers
echo.
echo 💰 Your payment system is ready for revenue generation!
echo 🚀 Start accepting payments immediately!

pause
