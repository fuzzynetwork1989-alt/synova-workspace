"""
Session manager for Synova Brain
"""

from typing import Dict, Any, Optional
import logging
import uuid

logger = logging.getLogger(__name__)


class Session:
    """User session"""

    def __init__(self, session_id: str, user_id: str):
        self.session_id = session_id
        self.user_id = user_id
        self.created_at = self._get_timestamp()
        self.last_activity = self._get_timestamp()
        self.state = {}
        self.context = {}

    def update_activity(self):
        """Update last activity timestamp"""
        self.last_activity = self._get_timestamp()

    def set_state(self, key: str, value: Any):
        """Set state value"""
        self.state[key] = value

    def get_state(self, key: str, default: Any = None) -> Any:
        """Get state value"""
        return self.state.get(key, default)

    def _get_timestamp(self) -> float:
        """Get current timestamp"""
        import time
        return time.time()


class SessionManager:
    """Manager for user sessions"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.session_ttl = config.get("session_ttl", 3600)
        self.sessions: Dict[str, Session] = {}

    async def get_or_create(self, session_id: Optional[str], user_id: str) -> Session:
        """Get existing session or create new one"""
        if session_id and session_id in self.sessions:
            session = self.sessions[session_id]
            session.update_activity()
            return session
        else:
            return await self.create_session(user_id)

    async def create_session(self, user_id: str) -> Session:
        """Create new session"""
        session_id = str(uuid.uuid4())
        session = Session(session_id, user_id)
        self.sessions[session_id] = session
        return session

    async def get_session(self, session_id: str) -> Optional[Session]:
        """Get session by ID"""
        if session_id in self.sessions:
            session = self.sessions[session_id]
            if not self._is_expired(session):
                session.update_activity()
                return session
            else:
                del self.sessions[session_id]
        return None

    async def delete_session(self, session_id: str) -> bool:
        """Delete session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False

    async def cleanup_expired(self) -> int:
        """Clean up expired sessions"""
        expired_keys = [
            key for key, session in self.sessions.items()
            if self._is_expired(session)
        ]
        for key in expired_keys:
            del self.sessions[key]
        return len(expired_keys)

    def _is_expired(self, session: Session) -> bool:
        """Check if session is expired"""
        import time
        return time.time() - session.last_activity > self.session_ttl
