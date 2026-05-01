"""
Token Generation Script for Synova AI API
Generate JWT tokens for development and testing
"""

import jwt
import secrets
from datetime import datetime, timedelta
import argparse
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))


def generate_jwt_token(
    user_id: str,
    tenant_id: str = "dev_tenant",
    email: str = "dev@example.com",
    role: str = "admin",
    secret: str = "dev-secret-change-in-production",
    expiration_hours: int = 24
) -> str:
    """Generate a JWT token for development"""
    payload = {
        "user_id": user_id,
        "tenant_id": tenant_id,
        "email": email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=expiration_hours),
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token


def generate_api_key(tenant_id: str = "dev_tenant") -> str:
    """Generate an API key for a tenant"""
    random_part = secrets.token_urlsafe(32)
    api_key = f"synova_sk_{tenant_id}_{random_part}"
    return api_key


def main():
    parser = argparse.ArgumentParser(description="Generate tokens for Synova AI API")
    parser.add_argument("--user-id", default="dev_user", help="User ID for the token")
    parser.add_argument("--tenant-id", default="dev_tenant", help="Tenant ID for the token")
    parser.add_argument("--email", default="dev@example.com", help="Email for the token")
    parser.add_argument("--role", default="admin", help="Role for the token (user, admin)")
    parser.add_argument("--secret", default="dev-secret-change-in-production", help="JWT secret")
    parser.add_argument("--expiration", type=int, default=24, help="Token expiration in hours")
    parser.add_argument("--api-key", action="store_true", help="Generate API key instead of JWT")
    parser.add_argument("--bearer", action="store_true", help="Output as Bearer token")

    args = parser.parse_args()

    if args.api_key:
        # Generate API key
        api_key = generate_api_key(args.tenant_id)
        if args.bearer:
            print(f"X-API-Key: {api_key}")
        else:
            print(api_key)
    else:
        # Generate JWT token
        token = generate_jwt_token(
            user_id=args.user_id,
            tenant_id=args.tenant_id,
            email=args.email,
            role=args.role,
            secret=args.secret,
            expiration_hours=args.expiration
        )
        if args.bearer:
            print(f"Bearer {token}")
        else:
            print(token)


if __name__ == "__main__":
    main()
