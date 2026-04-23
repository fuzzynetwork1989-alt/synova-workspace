# Stripe Setup Guide for Synova AI

This guide walks through configuring Stripe for Synova AI's billing and subscription management.

## Prerequisites

- A Stripe account (test mode for development)
- Stripe API keys

## Step 1: Create a Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up for an account
3. Complete the onboarding
4. Ensure you're in **Test Mode** (toggle in dashboard)

## Step 2: Get Your API Keys

1. Go to Developers → API keys
2. Copy these values to your `.env` file:
   - `STRIPE_SECRET_KEY` (starts with `sk_test_`)
   - `STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_`)

## Step 3: Create Products and Prices

### Create Products

1. Go to Products → Add product
2. Create three products:

**Starter Tier**
- Name: "Synova AI Starter"
- Description: "Basic AI assistant with 100K tokens/month"
- Pricing: $9/month

**Pro Tier**
- Name: "Synova AI Pro"
- Description: "Advanced AI with Supanova and RAG, 1M tokens/month"
- Pricing: $29/month

**Enterprise Tier**
- Name: "Synova AI Enterprise"
- Description: "Full platform with custom limits, 10M tokens/month"
- Pricing: $99/month

### Create Prices

For each product, create a recurring price:

1. Click on the product
2. Add price → Recurring
3. Set:
   - Interval: Month
   - Currency: USD
   - Price amount (9, 29, or 99)
4. Save and copy the Price ID (starts with `price_`)

Update your `.env` with the price IDs:
```
STRIPE_PRICE_STARTER=price_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_PRO=price_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_ENTERPRISE=price_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 4: Set Up Webhook

### Create Webhook Endpoint

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Set endpoint URL: `https://your-domain.com/api/billing/webhook`
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"

### Get Webhook Secret

1. Click on the webhook endpoint you created
2. Reveal the signing secret
3. Copy it to your `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## Step 5: Test the Integration

### Create a Test Customer

```python
import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Create a test customer
customer = stripe.Customer.create(
    email="test@example.com",
    name="Test User"
)
print(f"Customer ID: {customer.id}")
```

### Create a Test Checkout Session

```python
import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Create checkout session
session = stripe.checkout.Session.create(
    customer="cus_xxxxxxxxxxxxxxxx",  # Use customer ID from above
    payment_method_types=["card"],
    line_items=[{
        "price": os.getenv("STRIPE_PRICE_PRO"),
        "quantity": 1,
    }],
    mode="subscription",
    success_url="https://your-domain.com/success",
    cancel_url="https://your-domain.com/cancel",
)
print(f"Checkout URL: {session.url}")
```

### Test Webhook Events

1. Go to your webhook endpoint in Stripe Dashboard
2. Click "Send test webhook"
3. Select an event type (e.g., `customer.subscription.created`)
4. Verify your API receives and processes the event

## Step 6: Configure Tier Limits

Update the billing service to match your pricing:

```python
# In packages/billing/src/billing_service.py

TIER_LIMITS = {
    "starter": {
        "monthly_tokens": 100000,
        "max_file_size_mb": 10,
        "rag_documents": 10,
        "autopilot_projects": 1,
        "api_calls_per_day": 100
    },
    "pro": {
        "monthly_tokens": 1000000,
        "max_file_size_mb": 100,
        "rag_documents": 100,
        "autopilot_projects": 10,
        "api_calls_per_day": 1000
    },
    "enterprise": {
        "monthly_tokens": 10000000,
        "max_file_size_mb": 1000,
        "rag_documents": 1000,
        "autopilot_projects": 100,
        "api_calls_per_day": 10000
    }
}
```

## Step 7: Update Billing Service

Ensure your billing service uses the correct price IDs:

```python
# In packages/billing/src/billing_service.py

TIER_PRICES = {
    "starter": os.getenv("STRIPE_PRICE_STARTER"),
    "pro": os.getenv("STRIPE_PRICE_PRO"),
    "enterprise": os.getenv("STRIPE_PRICE_ENTERPRISE")
}
```

## Troubleshooting

### Webhook not receiving events
- Verify your endpoint URL is publicly accessible
- Check Stripe webhook logs for errors
- Ensure webhook secret matches in your code

### Price ID not found
- Verify price IDs are copied correctly from Stripe Dashboard
- Ensure you're using test mode price IDs for development

### Subscription not activating
- Check webhook event processing in your logs
- Verify database update for tenant tier
- Ensure customer exists in your system

## Next Steps

- Set up Supabase database
- Configure Redis for caching
- Test the full billing flow
- Move to production Stripe keys when ready

## Production Checklist

Before going live:

- [ ] Switch to live Stripe API keys
- [ ] Update all price IDs to live mode
- [ ] Update webhook endpoint to production URL
- [ ] Test full payment flow with real card
- [ ] Set up Stripe Radar for fraud detection
- [ ] Configure billing email notifications
- [ ] Set up Stripe Tax if needed
- [ ] Configure payout schedule
