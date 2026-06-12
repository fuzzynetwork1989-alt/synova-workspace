"""
Supanova Council - Multi-agent orchestration
"""

from typing import Dict, Any, List, Optional
import logging
from .agents.planner_agent import PlannerAgent
from .agents.builder_agent import BuilderAgent
from .agents.reviewer_agent import ReviewerAgent
from .agents.safety_agent import SafetyAgent

logger = logging.getLogger(__name__)


class SupanovaCouncil:
    """Multi-agent council for complex task orchestration"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.agents = {}
        self.council_members = config.get("council_members", [
            "planner", "builder", "reviewer", "safety"
        ])
        self._initialize_agents()

    def _initialize_agents(self):
        """Initialize council agents"""
        if "planner" in self.council_members:
            self.agents["planner"] = PlannerAgent(self.config.get("planner", {}))
        if "builder" in self.council_members:
            self.agents["builder"] = BuilderAgent(self.config.get("builder", {}))
        if "reviewer" in self.council_members:
            self.agents["reviewer"] = ReviewerAgent(self.config.get("reviewer", {}))
        if "safety" in self.council_members:
            self.agents["safety"] = SafetyAgent(self.config.get("safety", {}))

    async def deliberate(self, task: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Council deliberation process"""
        context = context or {}
        results = {}
        
        # Phase 1: Planning
        if "planner" in self.agents:
            plan = await self.agents["planner"].plan(task, context)
            results["plan"] = plan
            context["plan"] = plan
        
        # Phase 2: Building
        if "builder" in self.agents and "plan" in results:
            build_result = await self.agents["builder"].build(plan, context)
            results["build"] = build_result
            context["build"] = build_result
        
        # Phase 3: Review
        if "reviewer" in self.agents and "build" in results:
            review = await self.agents["reviewer"].review(build_result, context)
            results["review"] = review
            context["review"] = review
        
        # Phase 4: Safety check
        if "safety" in self.agents:
            safety_check = await self.agents["safety"].check(task, results, context)
            results["safety"] = safety_check
        
        # Final decision
        results["approved"] = self._make_decision(results)
        
        return results

    def _make_decision(self, results: Dict[str, Any]) -> bool:
        """Make final decision based on council votes"""
        if "safety" in results and not results["safety"].get("safe", True):
            return False
        if "review" in results and not results["review"].get("approved", True):
            return False
        return True

    async def execute_task(self, task: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Execute task through council"""
        deliberation = await self.deliberate(task, context)
        
        if deliberation["approved"]:
            return {
                "success": True,
                "result": deliberation.get("build"),
                "deliberation": deliberation,
            }
        else:
            return {
                "success": False,
                "error": "Council rejected task",
                "deliberation": deliberation,
            }
