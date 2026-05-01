"""
SYNOVA BRAIN - Super Reasoning Engine
Multi-step reasoning loop: observe, hypothesize, challenge, compare, compress, reformulate
"""

import asyncio
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
import logging

# Configure logging first
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import AgentBase for self-interrogation
try:
    from .agent_base import AgentBase, ReflectionReport
except ImportError:
    logger.warning("AgentBase not found - self-interrogation will be limited")
    AgentBase = None
    ReflectionReport = None

# Import autopilot engine for integration
try:
    from ..windsurf.skills.autopilot_engine import AutopilotEngine
except ImportError:
    logger.warning("Autopilot engine not found - advanced features will be limited")
    AutopilotEngine = None

class ReasoningStep(Enum):
    OBSERVE = "observe"
    HYPOTHESIZE = "hypothesize"
    CHALLENGE = "challenge"
    COMPARE = "compare"
    COMPRESS = "compress"
    REFORMULATE = "reformulate"

@dataclass
class ReasoningState:
    """State object that gets mutated through reasoning steps"""
    query: str
    context: Dict[str, Any] = field(default_factory=dict)
    observations: List[Dict[str, Any]] = field(default_factory=list)
    hypotheses: List[Dict[str, Any]] = field(default_factory=list)
    challenges: List[Dict[str, Any]] = field(default_factory=list)
    comparisons: List[Dict[str, Any]] = field(default_factory=list)
    compressed_insights: List[Dict[str, Any]] = field(default_factory=list)
    reformulations: List[Dict[str, Any]] = field(default_factory=list)
    
    # Metadata
    step_history: List[ReasoningStep] = field(default_factory=list)
    confidence_scores: List[float] = field(default_factory=list)
    processing_times: List[float] = field(default_factory=list)
    tools_used: List[str] = field(default_factory=list)
    
    # Self-interrogation results
    reflection_report: Optional[Any] = None
    
    # Final results
    final_conclusion: Optional[Dict[str, Any]] = None
    confidence: float = 0.5
    reasoning_complete: bool = False

class SuperReasoningEngine:
    """Advanced multi-step reasoning engine with AI patterns and autopilot integration"""
    
    def __init__(self, agent_base=None, tools=None):
        self.agent_base = agent_base
        self.tools = tools or {}
        self.max_iterations = 3
        self.confidence_threshold = 0.8
        
        # Initialize AgentBase if not provided
        if self.agent_base is None and AgentBase:
            self.agent_base = AgentBase()
        
        # Initialize autopilot engine if available
        self.autopilot_engine = None
        if AutopilotEngine:
            try:
                self.autopilot_engine = AutopilotEngine("./synova-workspace")
                logger.info("Autopilot engine integrated with SuperReasoningEngine")
            except Exception as e:
                logger.warning(f"Failed to initialize autopilot engine: {str(e)}")
        
        logger.info("Advanced SuperReasoningEngine initialized with AI patterns and autopilot integration")
    
    async def execute_reasoning_loop(self, query: str, context: Dict[str, Any] = None) -> ReasoningState:
        """Execute complete reasoning loop"""
        logger.info(f"Starting super reasoning loop for: {query[:50]}...")
        
        # Initialize state
        state = ReasoningState(
            query=query,
            context=context or {},
            confidence=0.1
        )
        
        # Execute reasoning steps
        steps = [
            self.observe,
            self.hypothesize,
            self.challenge,
            self.compare,
            self.compress,
            self.reformulate
        ]
        
        for step_func in steps:
            start_time = datetime.now()
            
            try:
                await step_func(state)
                state.step_history.append(step_func.__name__)
                state.processing_times.append((datetime.now() - start_time).total_seconds())
                
                logger.info(f"Completed step: {step_func.__name__}")
                
            except Exception as e:
                logger.error(f"Error in step {step_func.__name__}: {str(e)}")
                # Continue with next step even if current fails
        
        # Mark as complete
        state.reasoning_complete = True
        logger.info(f"Super reasoning loop completed with confidence: {state.confidence:.2f}")
        
        return state
    
    async def observe(self, state: ReasoningState):
        """Step 1: Observe and gather information"""
        logger.info("Step 1: OBSERVE - Gathering information")
        
        observations = []
        
        # Extract key terms from query
        key_terms = self._extract_key_terms(state.query)
        observations.append({
            "type": "query_analysis",
            "content": {"key_terms": key_terms, "query_length": len(state.query)},
            "confidence": 0.9
        })
        
        # Analyze query patterns
        query_patterns = self._analyze_query_patterns(state.query)
        observations.append({
            "type": "pattern_analysis",
            "content": {"patterns": query_patterns, "complexity": self._assess_complexity(state.query)},
            "confidence": 0.8
        })
        
        # Context analysis if available
        if state.context:
            context_analysis = self._analyze_context(state.context)
            observations.append({
                "type": "context_analysis",
                "content": context_analysis,
                "confidence": 0.7
            })
        
        # Tool-based observations
        if self.tools:
            tool_observations = await self._gather_tool_observations(state)
            observations.extend(tool_observations)
        
        state.observations = observations
        state.confidence = min(0.3, sum(obs["confidence"] for obs in observations) / len(observations))
        
        logger.info(f"Observations gathered: {len(observations)}")
    
    async def hypothesize(self, state: ReasoningState):
        """Step 2: Generate hypotheses based on observations"""
        logger.info("Step 2: HYPOTHESIZE - Generating hypotheses")
        
        hypotheses = []
        
        # Generate primary hypothesis
        primary_hypothesis = self._generate_primary_hypothesis(state.observations, state.query)
        hypotheses.append(primary_hypothesis)
        
        # Generate alternative hypotheses
        alternatives = self._generate_alternative_hypotheses(state.observations, state.query)
        hypotheses.extend(alternatives)
        
        # Generate counter-hypotheses
        counter_hypotheses = self._generate_counter_hypotheses(state.observations, state.query)
        hypotheses.extend(counter_hypotheses)
        
        state.hypotheses = hypotheses
        state.confidence = min(0.5, sum(hyp["confidence"] for hyp in hypotheses) / len(hypotheses))
        
        logger.info(f"Hypotheses generated: {len(hypotheses)}")
        
        # Step 2.5: Self-Interrogation (added after hypothesize)
        await self.self_interrogate_step(state)
    
    async def self_interrogate_step(self, state: ReasoningState):
        """Self-interrogation step between hypothesize and challenge"""
        logger.info("Step 2.5: SELF-INTERROGATE - Analyzing hypotheses")
        
        if self.agent_base and ReflectionReport:
            # Create question bank for self-interrogation
            question_bank = [
                "What assumptions underlie each hypothesis?",
                "What alternative explanations should I consider?",
                "Where are the weakest logical connections in my reasoning?",
                "How confident am I in each hypothesis and why?",
                "What evidence would strengthen or weaken each hypothesis?"
            ]
            
            try:
                # Perform self-interrogation
                reflection_report = await self.agent_base.self_interrogate(question_bank)
                
                # Add reflection results to state
                state.reflection_report = reflection_report
                
                # Adjust confidence based on reflection
                if reflection_report.confidence_score < 0.5:
                    state.confidence *= 0.8  # Reduce confidence if reflection is critical
                    logger.info("Confidence reduced based on critical self-interrogation")
                
                # Add reflection insights as challenges
                for weak_link in reflection_report.weak_links:
                    state.challenges.append({
                        "type": "self_interrogation_weakness",
                        "content": weak_link,
                        "confidence": 0.7,
                        "source": "self_interrogation"
                    })
                
                logger.info(f"Self-interrogation completed: {len(reflection_report.assumptions)} assumptions identified")
                
            except Exception as e:
                logger.error(f"Self-interrogation failed: {str(e)}")
                # Continue without self-interrogation
                state.reflection_report = None
        else:
            logger.warning("AgentBase not available - skipping self-interrogation")
            state.reflection_report = None
    
    async def challenge(self, state: ReasoningState):
        """Step 3: Challenge hypotheses with critical analysis"""
        logger.info("Step 3: CHALLENGE - Critical analysis of hypotheses")
        
        challenges = []
        
        for hypothesis in state.hypotheses:
            # Generate challenges for each hypothesis
            hypothesis_challenges = self._generate_hypothesis_challenges(hypothesis)
            challenges.extend(hypothesis_challenges)
        
        # Cross-challenge hypotheses against each other
        cross_challenges = self._generate_cross_challenges(state.hypotheses)
        challenges.extend(cross_challenges)
        
        # Self-challenge based on observations
        observation_challenges = self._challenge_with_observations(state.hypotheses, state.observations)
        challenges.extend(observation_challenges)
        
        state.challenges = challenges
        state.confidence = max(0.2, state.confidence - 0.1)  # Challenges reduce confidence
        
        logger.info(f"Challenges generated: {len(challenges)}")
    
    async def compare(self, state: ReasoningState):
        """Step 4: Compare hypotheses against challenges and observations"""
        logger.info("Step 4: COMPARE - Comparative analysis")
        
        comparisons = []
        
        # Compare hypotheses against challenges
        hypothesis_scores = {}
        for hypothesis in state.hypotheses:
            score = self._calculate_hypothesis_score(hypothesis, state.challenges, state.observations)
            hypothesis_scores[hypothesis["id"]] = score
            
            comparisons.append({
                "type": "hypothesis_evaluation",
                "content": {
                    "hypothesis_id": hypothesis["id"],
                    "score": score,
                    "strengths": hypothesis.get("strengths", []),
                    "weaknesses": self._identify_weaknesses(hypothesis, state.challenges)
                },
                "confidence": score
            })
        
        # Rank hypotheses
        ranked_hypotheses = sorted(hypothesis_scores.items(), key=lambda x: x[1], reverse=True)
        
        comparisons.append({
            "type": "hypothesis_ranking",
            "content": {
                "ranked_hypotheses": ranked_hypotheses,
                "best_hypothesis": ranked_hypotheses[0] if ranked_hypotheses else None
            },
            "confidence": ranked_hypotheses[0][1] if ranked_hypotheses else 0.1
        })
        
        state.comparisons = comparisons
        state.confidence = max(0.4, ranked_hypotheses[0][1] if ranked_hypotheses else 0.1)
        
        logger.info(f"Comparisons completed: {len(comparisons)}")
    
    async def compress(self, state: ReasoningState):
        """Step 5: Compress insights into key takeaways"""
        logger.info("Step 5: COMPRESS - Insight compression")
        
        compressed_insights = []
        
        # Extract key insights from comparisons
        key_insights = self._extract_key_insights(state.comparisons)
        compressed_insights.append({
            "type": "key_insights",
            "content": {"insights": key_insights},
            "confidence": 0.8
        })
        
        # Identify patterns across reasoning steps
        patterns = self._identify_reasoning_patterns(state)
        compressed_insights.append({
            "type": "reasoning_patterns",
            "content": {"patterns": patterns},
            "confidence": 0.7
        })
        
        # Synthesize core conclusion
        core_conclusion = self._synthesize_core_conclusion(state)
        compressed_insights.append({
            "type": "core_conclusion",
            "content": core_conclusion,
            "confidence": state.confidence
        })
        
        state.compressed_insights = compressed_insights
        state.confidence = min(0.7, sum(insight["confidence"] for insight in compressed_insights) / len(compressed_insights))
        
        logger.info(f"Insights compressed: {len(compressed_insights)}")
    
    async def reformulate(self, state: ReasoningState):
        """Step 6: Reformulate into final response"""
        logger.info("Step 6: REFORMULATE - Final response formulation")
        
        reformulations = []
        
        # Create primary reformulation
        primary_reformulation = self._create_primary_reformulation(state)
        reformulations.append(primary_reformulation)
        
        # Create alternative formulations
        if state.confidence < self.confidence_threshold:
            alternative_reformulations = self._create_alternative_reformulations(state)
            reformulations.extend(alternative_reformulations)
        
        # Create action-oriented response
        action_response = self._create_action_response(state)
        reformulations.append(action_response)
        
        state.reformulations = reformulations
        
        # Set final conclusion and confidence
        best_reformulation = max(reformulations, key=lambda x: x["confidence"])
        state.final_conclusion = best_reformulation
        state.confidence = best_reformulation["confidence"]
        
        logger.info(f"Reformulations created: {len(reformulations)}")
    
    # Helper methods
    def _extract_key_terms(self, query: str) -> List[str]:
        """Extract key terms from query"""
        words = query.lower().split()
        # Simple keyword extraction - can be enhanced
        stop_words = {"the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "can", "what", "how", "why", "when", "where", "who"}
        return [word for word in words if word not in stop_words and len(word) > 2]
    
    def _analyze_query_patterns(self, query: str) -> List[str]:
        """Analyze patterns in the query"""
        patterns = []
        query_lower = query.lower()
        
        if any(word in query_lower for word in ["why", "because", "reason"]):
            patterns.append("causal_inquiry")
        if any(word in query_lower for word in ["how", "process", "steps"]):
            patterns.append("procedural_inquiry")
        if any(word in query_lower for word in ["what", "define", "explain"]):
            patterns.append("definitional_inquiry")
        if any(word in query_lower for word in ["compare", "difference", "versus"]):
            patterns.append("comparative_inquiry")
        if "?" in query:
            patterns.append("direct_question")
        
        return patterns
    
    def _assess_complexity(self, query: str) -> str:
        """Assess query complexity"""
        word_count = len(query.split())
        sentence_count = query.count(".") + query.count("!") + query.count("?")
        
        if word_count < 10 and sentence_count <= 1:
            return "simple"
        elif word_count < 25 and sentence_count <= 2:
            return "moderate"
        else:
            return "complex"
    
    def _analyze_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze provided context"""
        analysis = {
            "context_keys": list(context.keys()),
            "context_size": len(str(context)),
            "has_previous_queries": "previous_queries" in context,
            "has_user_info": "user_info" in context
        }
        return analysis
    
    async def _gather_tool_observations(self, state: ReasoningState) -> List[Dict[str, Any]]:
        """Gather observations using available tools"""
        observations = []
        
        for tool_name, tool in self.tools.items():
            try:
                # Generic tool observation - can be enhanced based on specific tools
                observation = {
                    "type": "tool_observation",
                    "content": {
                        "tool": tool_name,
                        "applicable": self._is_tool_applicable(tool_name, state.query),
                        "confidence": 0.6
                    },
                    "confidence": 0.6
                }
                observations.append(observation)
                state.tools_used.append(tool_name)
            except Exception as e:
                logger.warning(f"Tool {tool_name} observation failed: {str(e)}")
        
        return observations
    
    def _is_tool_applicable(self, tool_name: str, query: str) -> bool:
        """Check if a tool is applicable to the query"""
        query_lower = query.lower()
        tool_lower = tool_name.lower()
        
        # Simple relevance check
        return any(word in query_lower for word in tool_lower.split("_"))
    
    def _generate_primary_hypothesis(self, observations: List[Dict[str, Any]], query: str) -> Dict[str, Any]:
        """Generate primary hypothesis"""
        return {
            "id": str(uuid.uuid4()),
            "type": "primary",
            "content": f"Primary interpretation of {query[:30]}...",
            "confidence": 0.7,
            "strengths": ["based_on_observations", "direct_interpretation"],
            "evidence": [obs["type"] for obs in observations]
        }
    
    def _generate_alternative_hypotheses(self, observations: List[Dict[str, Any]], query: str) -> List[Dict[str, Any]]:
        """Generate alternative hypotheses"""
        alternatives = []
        
        # Alternative 1: Different interpretation
        alternatives.append({
            "id": str(uuid.uuid4()),
            "type": "alternative",
            "content": f"Alternative interpretation of {query[:30]}...",
            "confidence": 0.5,
            "strengths": ["considers_alternatives"],
            "evidence": [obs["type"] for obs in observations[:2]]
        })
        
        return alternatives
    
    def _generate_counter_hypotheses(self, observations: List[Dict[str, Any]], query: str) -> List[Dict[str, Any]]:
        """Generate counter-hypotheses"""
        counters = []
        
        # Counter hypothesis
        counters.append({
            "id": str(uuid.uuid4()),
            "type": "counter",
            "content": f"Counter perspective on {query[:30]}...",
            "confidence": 0.4,
            "strengths": ["critical_perspective"],
            "evidence": []
        })
        
        return counters
    
    def _generate_hypothesis_challenges(self, hypothesis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate challenges for a specific hypothesis"""
        challenges = []
        
        challenges.append({
            "type": "evidence_challenge",
            "content": f"Challenge evidence for {hypothesis['type']} hypothesis",
            "target_hypothesis": hypothesis["id"],
            "confidence": 0.6
        })
        
        challenges.append({
            "type": "logic_challenge",
            "content": f"Challenge logical consistency of {hypothesis['type']} hypothesis",
            "target_hypothesis": hypothesis["id"],
            "confidence": 0.5
        })
        
        return challenges
    
    def _generate_cross_challenges(self, hypotheses: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate cross-challenges between hypotheses"""
        challenges = []
        
        for i, hyp1 in enumerate(hypotheses):
            for hyp2 in hypotheses[i+1:]:
                challenges.append({
                    "type": "cross_challenge",
                    "content": f"Challenge {hyp1['type']} against {hyp2['type']}",
                    "target_hypothesis": hyp1["id"],
                    "reference_hypothesis": hyp2["id"],
                    "confidence": 0.5
                })
        
        return challenges
    
    def _challenge_with_observations(self, hypotheses: List[Dict[str, Any]], observations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Challenge hypotheses with observations"""
        challenges = []
        
        for hypothesis in hypotheses:
            for observation in observations:
                if observation["confidence"] < 0.7:
                    challenges.append({
                        "type": "observation_challenge",
                        "content": f"Challenge {hypothesis['type']} with weak observation",
                        "target_hypothesis": hypothesis["id"],
                        "reference_observation": observation["type"],
                        "confidence": 0.4
                    })
        
        return challenges
    
    def _calculate_hypothesis_score(self, hypothesis: Dict[str, Any], challenges: List[Dict[str, Any]], observations: List[Dict[str, Any]]) -> float:
        """Calculate score for a hypothesis based on challenges and observations"""
        base_score = hypothesis["confidence"]
        
        # Reduce score based on challenges
        hypothesis_challenges = [c for c in challenges if c.get("target_hypothesis") == hypothesis["id"]]
        if hypothesis_challenges:
            challenge_impact = sum(c["confidence"] for c in hypothesis_challenges) / len(hypothesis_challenges)
            base_score -= challenge_impact * 0.3
        
        # Increase score based on supporting observations
        supporting_obs = [o for o in observations if o["confidence"] > 0.7]
        if supporting_obs:
            support_boost = sum(o["confidence"] for o in supporting_obs) / len(supporting_obs) * 0.2
            base_score += support_boost
        
        return max(0.1, min(1.0, base_score))
    
    def _identify_weaknesses(self, hypothesis: Dict[str, Any], challenges: List[Dict[str, Any]]) -> List[str]:
        """Identify weaknesses in a hypothesis"""
        weaknesses = []
        
        hypothesis_challenges = [c for c in challenges if c.get("target_hypothesis") == hypothesis["id"]]
        
        if hypothesis_challenges:
            weaknesses.append("faces_challenges")
        
        if hypothesis["confidence"] < 0.6:
            weaknesses.append("low_initial_confidence")
        
        if not hypothesis.get("evidence"):
            weaknesses.append("lacks_evidence")
        
        return weaknesses
    
    def _extract_key_insights(self, comparisons: List[Dict[str, Any]]) -> List[str]:
        """Extract key insights from comparisons"""
        insights = []
        
        for comparison in comparisons:
            if comparison["type"] == "hypothesis_ranking":
                best = comparison["content"].get("best_hypothesis")
                if best:
                    insights.append(f"Best hypothesis score: {best[1]:.2f}")
            
            elif comparison["type"] == "hypothesis_evaluation":
                content = comparison["content"]
                if content.get("strengths"):
                    insights.append(f"Identified strengths: {', '.join(content['strengths'])}")
        
        return insights
    
    def _identify_reasoning_patterns(self, state: ReasoningState) -> List[str]:
        """Identify patterns in the reasoning process"""
        patterns = []
        
        # Check confidence evolution
        if state.confidence > 0.7:
            patterns.append("high_confidence_reasoning")
        elif state.confidence < 0.4:
            patterns.append("low_confidence_reasoning")
        
        # Check tool usage
        if state.tools_used:
            patterns.append("tool_assisted_reasoning")
        
        # Check complexity
        if len(state.observations) > 5:
            patterns.append("complex_analysis")
        
        return patterns
    
    def _synthesize_core_conclusion(self, state: ReasoningState) -> Dict[str, Any]:
        """Synthesize core conclusion from all steps"""
        return {
            "summary": f"Reasoning completed with confidence {state.confidence:.2f}",
            "key_steps": [step.__name__ for step in state.step_history],
            "primary_insight": state.compressed_insights[0]["content"] if state.compressed_insights else {},
            "recommendation": "Proceed with formulated response" if state.confidence > 0.6 else "Consider additional analysis"
        }
    
    def _create_primary_reformulation(self, state: ReasoningState) -> Dict[str, Any]:
        """Create primary reformulation"""
        return {
            "type": "primary_response",
            "content": f"Based on comprehensive reasoning, here's the response to: {state.query}",
            "confidence": state.confidence,
            "reasoning_summary": {
                "steps_completed": len(state.step_history),
                "final_confidence": state.confidence,
                "key_insights": len(state.compressed_insights)
            }
        }
    
    def _create_alternative_reformulations(self, state: ReasoningState) -> List[Dict[str, Any]]:
        """Create alternative reformulations"""
        alternatives = []
        
        alternatives.append({
            "type": "conservative_response",
            "content": f"Conservative interpretation of: {state.query}",
            "confidence": state.confidence * 0.8,
            "reasoning_summary": "Lower confidence, more cautious approach"
        })
        
        return alternatives
    
    def _create_action_response(self, state: ReasoningState) -> Dict[str, Any]:
        """Create action-oriented response"""
        return {
            "type": "action_response",
            "content": f"Recommended actions based on: {state.query}",
            "confidence": state.confidence * 0.9,
            "reasoning_summary": "Action-oriented formulation"
        }

# Factory function
def create_super_reasoning_engine(agent_base=None, tools=None) -> SuperReasoningEngine:
    """Create SuperReasoningEngine instance"""
    return SuperReasoningEngine(agent_base, tools)

# Test function
async def test_super_reasoning_engine():
    """Test the super reasoning engine"""
    engine = create_super_reasoning_engine()
    
    test_queries = [
        "How can I improve my coding productivity?",
        "What are the best practices for API design?",
        "How should I approach debugging complex issues?"
    ]
    
    for query in test_queries:
        print(f"\nProcessing: {query}")
        result = await engine.execute_reasoning_loop(query)
        print(f"Final confidence: {result.confidence:.2f}")
        print(f"Steps completed: {len(result.step_history)}")
        print(f"Final conclusion type: {result.final_conclusion.get('type', 'N/A')}")
        
        # Show reasoning summary
        if result.final_conclusion:
            summary = result.final_conclusion.get("reasoning_summary", {})
            print(f"Reasoning summary: {summary}")

if __name__ == "__main__":
    asyncio.run(test_super_reasoning_engine())
