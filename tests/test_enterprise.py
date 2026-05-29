"""
Enterprise controls module tests
"""

import pytest
from backend.enterprise.rbac import RBACManager
from backend.enterprise.sso import SSOManager
from backend.enterprise.audit import AuditLogger


def test_rbac_manager():
    """Test RBAC manager"""
    rbac = RBACManager()
    
    # Create role
    rbac.create_role("admin", ["read", "write", "delete", "manage"])
    rbac.create_role("user", ["read", "write"])
    
    # Assign role
    rbac.assign_role("user_1", "admin")
    rbac.assign_role("user_2", "user")
    
    # Check permissions
    admin_perms = rbac.get_user_permissions("user_1")
    assert "delete" in admin_perms
    assert "manage" in admin_perms
    
    user_perms = rbac.get_user_permissions("user_2")
    assert "read" in user_perms
    assert "delete" not in user_perms
    
    # Check permission
    assert rbac.check_permission("user_1", "delete") is True
    assert rbac.check_permission("user_2", "delete") is False


@pytest.mark.asyncio
async def test_sso_manager():
    """Test SSO manager"""
    sso = SSOManager()
    
    # Configure provider
    sso.configure_provider("google", {
        "client_id": "test_client_id",
        "client_secret": "test_secret",
        "redirect_uri": "http://localhost:8000/auth/callback"
    })
    
    # Initiate login
    login_url = await sso.initiate_sso_login(
        provider="google",
        redirect_uri="http://localhost:8000/auth/callback"
    )
    
    assert login_url is not None
    assert "google.com" in login_url or "oauth" in login_url.lower()


@pytest.mark.asyncio
async def test_audit_logger():
    """Test audit logger"""
    audit = AuditLogger()
    
    # Log action
    await audit.log_action(
        user_id="test_user",
        action="create_resource",
        resource="document",
        details={"document_id": "doc_123"}
    )
    
    # Get audit log
    logs = await audit.get_audit_log(user_id="test_user")
    assert logs is not None
    assert len(logs) > 0
    
    # Verify log content
    latest_log = logs[0]
    assert latest_log["action"] == "create_resource"
    assert latest_log["resource"] == "document"


@pytest.mark.asyncio
async def test_audit_export():
    """Test audit log export"""
    audit = AuditLogger()
    
    # Log some actions
    await audit.log_action(
        user_id="test_user_2",
        action="update_resource",
        resource="document",
        details={"document_id": "doc_456"}
    )
    
    # Export logs
    exported = await audit.export_logs(
        user_id="test_user_2",
        format="json"
    )
    
    assert exported is not None
