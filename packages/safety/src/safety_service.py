"""
Safety Service - Input Filtering and Output Criticism
Provides safety guardrails with content moderation and policy enforcement
"""

import os
from typing import Dict, Any, List, Optional
from enum import Enum
import structlog

log = structlog.get_logger()


class SafetyAction(str, Enum):
    """Safety action to take"""
    allow = "allow"
    warn = "warn"
    block = "block"
    flag = "flag"


class SafetyCategory(str, Enum):
    """Safety violation categories"""
    hate_speech = "hate_speech"
    violence = "violence"
    sexual_content = "sexual_content"
    self_harm = "self_harm"
    illegal_content = "illegal_content"
    harassment = "harassment"
    misinformation = "misinformation"
    prompt_injection = "prompt_injection"


class SafetyResult:
    """Result of safety check"""
    
    def __init__(
        self,
        flagged: bool,
        action: SafetyAction,
        categories: List[str] = None,
        score: float = 0.0,
        details: str = ""
    ):
        self.flagged = flagged
        self.action = action
        self.categories = categories or []
        self.score = score
        self.details = details
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "flagged": self.flagged,
            "action": self.action.value,
            "categories": self.categories,
            "score": self.score,
            "details": self.details
        }


class SafetyService:
    """
    Safety Service - Content moderation and policy enforcement
    Provides input filtering, output criticism, and safety guardrails
    """
    
    def __init__(self):
        self.enabled = os.getenv("SAFETY_ENABLED", "true").lower() == "true"
        self.use_openai_moderation = os.getenv("OPENAI_MODERATION", "true").lower() == "true"
        
        self.safety_stats = {
            'total_checks': 0,
            'flagged_count': 0,
            'blocked_count': 0,
            'warnings_count': 0,
            'category_distribution': {}
        }
        
        # Safety thresholds
        self.thresholds = {
            'block_threshold': 0.8,
            'warn_threshold': 0.5,
            'flag_threshold': 0.3
        }
    
    async def check_input(self, text: str, user_id: Optional[str] = None) -> SafetyResult:
        """
        Check input text for safety violations
        
        Args:
            text: Input text to check
            user_id: Optional user ID for tracking
            
        Returns:
            SafetyResult with action to take
        """
        self.safety_stats['total_checks'] += 1
        
        if not self.enabled:
            return SafetyResult(flagged=False, action=SafetyAction.allow)
        
        # Check for prompt injection
        injection_result = self._check_prompt_injection(text)
        if injection_result.flagged:
            self.safety_stats['flagged_count'] += 1
            return injection_result
        
        # Use OpenAI moderation if enabled
        if self.use_openai_moderation:
            moderation_result = await self._openai_moderation(text)
            if moderation_result.flagged:
                self._update_stats(moderation_result)
                return moderation_result
        
        # Local safety checks
        local_result = self._local_safety_check(text)
        if local_result.flagged:
            self._update_stats(local_result)
            return local_result
        
        return SafetyResult(flagged=False, action=SafetyAction.allow)
    
    async def check_output(self, text: str, user_id: Optional[str] = None) -> SafetyResult:
        """
        Check output text for safety violations
        
        Args:
            text: Output text to check
            user_id: Optional user ID for tracking
            
        Returns:
            SafetyResult with action to take
        """
        self.safety_stats['total_checks'] += 1
        
        if not self.enabled:
            return SafetyResult(flagged=False, action=SafetyAction.allow)
        
        # Output-specific checks
        output_result = self._output_safety_check(text)
        if output_result.flagged:
            self._update_stats(output_result)
            return output_result
        
        return SafetyResult(flagged=False, action=SafetyAction.allow)
    
    def _check_prompt_injection(self, text: str) -> SafetyResult:
        """Check for prompt injection attempts"""
        injection_patterns = [
            "ignore previous instructions",
            "disregard all above",
            "forget everything",
            "new instructions:",
            "system: override",
            "developer mode",
            "jailbreak"
        ]
        
        text_lower = text.lower()
        for pattern in injection_patterns:
            if pattern in text_lower:
                return SafetyResult(
                    flagged=True,
                    action=SafetyAction.block,
                    categories=[SafetyCategory.prompt_injection.value],
                    score=0.9,
                    details=f"Potential prompt injection detected: {pattern}"
                )
        
        return SafetyResult(flagged=False, action=SafetyAction.allow)
    
    async def _openai_moderation(self, text: str) -> SafetyResult:
        """Use OpenAI moderation API"""
        try:
            from openai import AsyncOpenAI
            
            client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = await client.moderations.create(input=text)
            
            result = response.results[0]
            
            if result.flagged:
                categories = []
                for category, flagged in result.categories.model_dump().items():
                    if flagged:
                        categories.append(category)
                
                # Determine action based on score
                score = result.category_scores.model_dump()
                max_score = max(score.values()) if score else 0.0
                
                if max_score >= self.thresholds['block_threshold']:
                    action = SafetyAction.block
                elif max_score >= self.thresholds['warn_threshold']:
                    action = SafetyAction.warn
                else:
                    action = SafetyAction.flag
                
                return SafetyResult(
                    flagged=True,
                    action=action,
                    categories=categories,
                    score=max_score,
                    details="Flagged by OpenAI moderation"
                )
            
            return SafetyResult(flagged=False, action=SafetyAction.allow)
            
        except ImportError:
            log.warning("openai_not_installed_for_moderation")
            return SafetyResult(flagged=False, action=SafetyAction.allow)
        except Exception as e:
            log.error("openai_moderation_error", error=str(e))
            return SafetyResult(flagged=False, action=SafetyAction.allow)
    
    def _local_safety_check(self, text: str) -> SafetyResult:
        """Local safety checks without external API"""
        text_lower = text.lower()
        
        # Check for prohibited content patterns
        prohibited_patterns = {
            SafetyCategory.hate_speech: ["hate", "discriminate", "supremacist"],
            SafetyCategory.violence: ["kill", "murder", "torture", "violence"],
            SafetyCategory.sexual_content: ["explicit", "pornographic", "nsfw"],
            SafetyCategory.self_harm: ["suicide", "self-harm", "kill myself"],
            SafetyCategory.illegal_content: ["illegal", "drug dealing", "weapons"],
            SafetyCategory.harassment: ["harass", "stalk", "threaten"]
        }
        
        flagged_categories = []
        max_score = 0.0
        
        for category, patterns in prohibited_patterns.items():
            for pattern in patterns:
                if pattern in text_lower:
                    flagged_categories.append(category.value)
                    max_score = max(max_score, 0.7)
        
        if flagged_categories:
            if max_score >= self.thresholds['block_threshold']:
                action = SafetyAction.block
            elif max_score >= self.thresholds['warn_threshold']:
                action = SafetyAction.warn
            else:
                action = SafetyAction.flag
            
            return SafetyResult(
                flagged=True,
                action=action,
                categories=flagged_categories,
                score=max_score,
                details="Flagged by local safety checks"
            )
        
        return SafetyResult(flagged=False, action=SafetyAction.allow)
    
    def _output_safety_check(self, text: str) -> SafetyResult:
        """Output-specific safety checks"""
        # Check for PII leakage
        pii_patterns = [
            r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
            r'\b\d{16}\b',  # Credit card
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'  # Email
        ]
        
        import re
        for pattern in pii_patterns:
            if re.search(pattern, text):
                return SafetyResult(
                    flagged=True,
                    action=SafetyAction.warn,
                    categories=["pii_leakage"],
                    score=0.6,
                    details="Potential PII detected in output"
                )
        
        # Check for code injection
        if "<script>" in text.lower() or "javascript:" in text.lower():
            return SafetyResult(
                flagged=True,
                action=SafetyAction.block,
                categories=["code_injection"],
                score=0.9,
                details="Potential code injection detected"
            )
        
        return SafetyResult(flagged=False, action=SafetyAction.allow)
    
    def _update_stats(self, result: SafetyResult):
        """Update safety statistics"""
        if result.flagged:
            self.safety_stats['flagged_count'] += 1
            
            if result.action == SafetyAction.block:
                self.safety_stats['blocked_count'] += 1
            elif result.action == SafetyAction.warn:
                self.safety_stats['warnings_count'] += 1
            
            for category in result.categories:
                self.safety_stats['category_distribution'][category] = \
                    self.safety_stats['category_distribution'].get(category, 0) + 1
    
    def get_safety_stats(self) -> Dict[str, Any]:
        """Get safety statistics"""
        return {
            "total_checks": self.safety_stats['total_checks'],
            "flagged_count": self.safety_stats['flagged_count'],
            "blocked_count": self.safety_stats['blocked_count'],
            "warnings_count": self.safety_stats['warnings_count'],
            "flag_rate": (
                self.safety_stats['flagged_count'] / self.safety_stats['total_checks']
                if self.safety_stats['total_checks'] > 0 else 0
            ),
            "category_distribution": self.safety_stats['category_distribution']
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """Health check for safety service"""
        return {
            "status": "healthy",
            "enabled": self.enabled,
            "use_openai_moderation": self.use_openai_moderation,
            "thresholds": self.thresholds,
            "stats": self.get_safety_stats()
        }
