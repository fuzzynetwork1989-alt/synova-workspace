"""
Billing Service - Stripe Tiered Pricing Integration
Multi-tenant billing with subscription management and usage tracking
"""

import os
from typing import Dict, Any, Optional, List
from enum import Enum
import structlog

log = structlog.get_logger()


class TenantTier(str, Enum):
    """Subscription tiers"""
    starter = "starter"
    pro = "pro"
    enterprise = "enterprise"


TIER_PRICING = {
    TenantTier.starter: {
        "monthly_price": 9,
        "token_limit": 100000,
        "features": ["basic_chat", "memory_1gb", "standard_support"]
    },
    TenantTier.pro: {
        "monthly_price": 29,
        "token_limit": 1000000,
        "features": ["advanced_chat", "supanova_agents", "memory_10gb", "priority_support", "api_access"]
    },
    TenantTier.enterprise: {
        "monthly_price": 99,
        "token_limit": 10000000,
        "features": ["all_features", "custom_models", "unlimited_memory", "dedicated_support", "sla", "white_label"]
    }
}


class BillingService:
    """
    Billing Service - Stripe integration with tiered pricing
    Manages subscriptions, usage tracking, and billing operations
    """
    
    def __init__(self):
        self.stripe_secret_key = os.getenv("STRIPE_SECRET_KEY")
        self.stripe_webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
        
        # Price IDs from Stripe
        self.price_ids = {
            TenantTier.starter: os.getenv("STRIPE_PRICE_STARTER"),
            TenantTier.pro: os.getenv("STRIPE_PRICE_PRO"),
            TenantTier.enterprise: os.getenv("STRIPE_PRICE_ENTERPRISE")
        }
        
        self.billing_stats = {
            'active_subscriptions': 0,
            'revenue_monthly': 0.0,
            'usage_records': 0,
            'tier_distribution': {}
        }
    
    def get_tier_pricing(self, tier: TenantTier) -> Dict[str, Any]:
        """Get pricing information for a tier"""
        return TIER_PRICING.get(tier, TIER_PRICING[TenantTier.starter])
    
    def calculate_usage_cost(self, tokens_used: int, tier: TenantTier) -> float:
        """
        Calculate cost for token usage
        
        Args:
            tokens_used: Number of tokens used
            tier: Current tenant tier
            
        Returns:
            Cost in USD
        """
        tier_info = self.get_tier_pricing(tier)
        token_limit = tier_info["token_limit"]
        
        # Over-usage pricing: $0.002 per 1K tokens over limit
        if tokens_used > token_limit:
            overage = tokens_used - token_limit
            overage_cost = (overage / 1000) * 0.002
            return overage_cost
        
        return 0.0
    
    def get_tier_features(self, tier: TenantTier) -> List[str]:
        """Get features available for a tier"""
        return self.get_tier_pricing(tier)["features"]
    
    def check_feature_access(self, tier: TenantTier, feature: str) -> bool:
        """
        Check if a tier has access to a feature
        
        Args:
            tier: Tenant tier
            feature: Feature to check
            
        Returns:
            True if feature is available
        """
        features = self.get_tier_features(tier)
        return feature in features or "all_features" in features
    
    async def create_checkout_session(
        self,
        tenant_id: str,
        tier: TenantTier,
        success_url: str,
        cancel_url: str
    ) -> Dict[str, Any]:
        """
        Create Stripe checkout session for subscription
        
        Args:
            tenant_id: Tenant ID
            tier: Tier to subscribe to
            success_url: URL to redirect on success
            cancel_url: URL to redirect on cancel
            
        Returns:
            Checkout session URL
        """
        try:
            import stripe
            
            stripe.api_key = self.stripe_secret_key
            
            price_id = self.price_ids.get(tier)
            if not price_id:
                return {
                    "success": False,
                    "error": f"No price ID configured for tier: {tier}"
                }
            
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{
                    "price": price_id,
                    "quantity": 1
                }],
                mode="subscription",
                success_url=success_url,
                cancel_url=cancel_url,
                client_reference_id=tenant_id,
                metadata={"tier": tier.value}
            )
            
            return {
                "success": True,
                "checkout_url": session.url,
                "session_id": session.id
            }
            
        except ImportError:
            log.warning("stripe_not_installed")
            return {
                "success": False,
                "error": "Stripe not installed - install with: pip install stripe"
            }
        except Exception as e:
            log.error("stripe_checkout_error", error=str(e))
            return {
                "success": False,
                "error": str(e)
            }
    
    async def create_customer_portal_session(
        self,
        customer_id: str,
        return_url: str
    ) -> Dict[str, Any]:
        """
        Create Stripe customer portal session
        
        Args:
            customer_id: Stripe customer ID
            return_url: URL to redirect after portal
            
        Returns:
            Portal session URL
        """
        try:
            import stripe
            
            stripe.api_key = self.stripe_secret_key
            
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url
            )
            
            return {
                "success": True,
                "portal_url": session.url
            }
            
        except Exception as e:
            log.error("stripe_portal_error", error=str(e))
            return {
                "success": False,
                "error": str(e)
            }
    
    async def record_usage(
        self,
        tenant_id: str,
        tokens_used: int,
        endpoint: str,
        model: str
    ) -> Dict[str, Any]:
        """
        Record usage for billing
        
        Args:
            tenant_id: Tenant ID
            tokens_used: Number of tokens used
            endpoint: API endpoint used
            model: Model used
            
        Returns:
            Usage record result
        """
        self.billing_stats['usage_records'] += 1
        
        # In production, would store in database and send to Stripe
        # For now, simulate recording
        return {
            "success": True,
            "tenant_id": tenant_id,
            "tokens_used": tokens_used,
            "endpoint": endpoint,
            "model": model,
            "timestamp": "2024-01-01T00:00:00Z"
        }
    
    async def get_tenant_usage(
        self,
        tenant_id: str,
        month: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get usage statistics for a tenant
        
        Args:
            tenant_id: Tenant ID
            month: Optional month (format: YYYY-MM)
            
        Returns:
            Usage statistics
        """
        # In production, would query database
        # For now, return simulated data
        return {
            "tenant_id": tenant_id,
            "month": month or "2024-01",
            "total_tokens": 50000,
            "total_cost": 0.5,
            "endpoint_usage": {
                "chat": 30000,
                "supanova": 15000,
                "rag": 5000
            },
            "model_usage": {
                "gpt-4o": 40000,
                "claude-opus": 10000
            }
        }
    
    async def get_billing_stats(self) -> Dict[str, Any]:
        """Get overall billing statistics"""
        return {
            "active_subscriptions": self.billing_stats['active_subscriptions'],
            "revenue_monthly": self.billing_stats['revenue_monthly'],
            "usage_records": self.billing_stats['usage_records'],
            "tier_distribution": self.billing_stats['tier_distribution'],
            "tier_pricing": {
                tier.value: pricing["monthly_price"]
                for tier, pricing in TIER_PRICING.items()
            }
        }
    
    async def handle_webhook(self, payload: str, signature: str) -> Dict[str, Any]:
        """
        Handle Stripe webhook events
        
        Args:
            payload: Webhook payload
            signature: Webhook signature
            
        Returns:
            Webhook processing result
        """
        try:
            import stripe
            
            event = stripe.Webhook.construct_event(
                payload, signature, self.stripe_webhook_secret
            )
            
            # Handle different event types
            if event.type == "checkout.session.completed":
                # Subscription created
                self.billing_stats['active_subscriptions'] += 1
                return {"success": True, "event": "subscription_created"}
            
            elif event.type == "customer.subscription.deleted":
                # Subscription cancelled
                self.billing_stats['active_subscriptions'] -= 1
                return {"success": True, "event": "subscription_cancelled"}
            
            elif event.type == "invoice.paid":
                # Invoice paid
                return {"success": True, "event": "invoice_paid"}
            
            else:
                return {"success": True, "event": event.type}
                
        except Exception as e:
            log.error("stripe_webhook_error", error=str(e))
            return {"success": False, "error": str(e)}
    
    async def health_check(self) -> Dict[str, Any]:
        """Health check for billing service"""
        return {
            "status": "healthy",
            "stripe_configured": bool(self.stripe_secret_key),
            "webhook_configured": bool(self.stripe_webhook_secret),
            "price_ids_configured": {
                tier: bool(price_id)
                for tier, price_id in self.price_ids.items()
            },
            "stats": await self.get_billing_stats()
        }
