"""
Auth Middleware - User authentication and authorization
JWT-based authentication with tenant and user context
"""

import os
from typing import Dict, Any, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime, timedelta
import structlog

log = structlog.get_logger()

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Get current user from JWT token
    Returns user context with user_id, tenant_id, and permissions
    """
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            os.getenv("JWT_SECRET", "dev-secret"),
            algorithms=[os.getenv("JWT_ALGORITHM", "HS256")]
        )

        user_id = payload.get("user_id")
        tenant_id = payload.get("tenant_id")
        email = payload.get("email")
        role = payload.get("role", "user")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user_id"
            )

        return {
            "id": user_id,
            "tenant_id": tenant_id or "default",
            "email": email,
            "role": role
        }

    except JWTError as e:
        log.error("jwt_decode_error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


async def get_current_tenant(user: Dict[str, Any] = Depends(get_current_user)) -> str:
    """Get current tenant ID from user context"""
    return user.get("tenant_id", "default")


async def require_role(required_role: str):
    """Dependency to require specific role"""
    async def role_checker(user: Dict[str, Any] = Depends(get_current_user)):
        if user.get("role") != required_role and user.get("role") != "admin":
            raise HTTPException(status_code=403, detail=f"Requires {required_role} role")
        return user
    return role_checker


async def require_tenant_admin(user: Dict[str, Any] = Depends(get_current_user)):
    """Require tenant admin role"""
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Requires admin role")
    return user
