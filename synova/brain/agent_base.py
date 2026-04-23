"""
SYNOVA BRAIN - Agent Base Class
Base class for all AI agents with self-interrogation capabilities
"""

import asyncio
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ReflectionReport:
    """Report from self-interrogation process"""
    assumptions: List[str] = field(default_factory=list)
    alternatives: List[str] = field(default_factory=list)
    weak_links: List[str] = field(default_factory=list)
    confidence_score: float = 0.5
    interrogation_timestamp: datetime = field(default_factory=datetime.now)
    question_bank: List[str] = field(default_factory=list)

class AgentBase:
    """Advanced base class for all Synova AI agents with enhanced capabilities"""
    
    def __init__(self, model=None):
        self.agent_id = str(uuid.uuid4())
        self.model = model
        self.created_at = datetime.now()
        self.memory = {}
        self.reflection_history = []
        self.capabilities = []
        self.performance_metrics = {
            "tasks_completed": 0,
            "success_rate": 0.0,
            "avg_confidence": 0.0,
            "self_improvements": 0
        }
        
        logger.info(f"Advanced AgentBase initialized with ID: {self.agent_id}")
    
    async def enhance_capabilities(self, new_capabilities: List[str]):
        """Add new capabilities to the agent"""
        self.capabilities.extend(new_capabilities)
        logger.info(f"Added capabilities: {new_capabilities}")
    
    async def analyze_performance(self) -> Dict[str, Any]:
        """Analyze agent performance metrics"""
        return {
            "agent_id": self.agent_id,
            "capabilities": self.capabilities,
            "performance": self.performance_metrics,
            "reflection_quality": self._analyze_reflection_quality(),
            "memory_efficiency": self._analyze_memory_efficiency(),
            "recommendations": self._generate_performance_recommendations()
        }
    
    def _analyze_reflection_quality(self) -> Dict[str, Any]:
        """Analyze quality of self-reflections"""
        if not self.reflection_history:
            return {"quality": "no_data", "depth": 0}
        
        recent_reflections = self.reflection_history[-5:]  # Last 5 reflections
        avg_confidence = sum(r.confidence_score for r in recent_reflections) / len(recent_reflections)
        
        return {
            "quality": "good" if avg_confidence > 0.7 else "needs_improvement",
            "avg_confidence": avg_confidence,
            "total_reflections": len(self.reflection_history),
            "depth": len(recent_reflections)
        }
    
    def _analyze_memory_efficiency(self) -> Dict[str, Any]:
        """Analyze memory usage efficiency"""
        memory_size = len(str(self.memory))
        total_entries = sum(len(v) if isinstance(v, (list, dict)) else 1 for v in self.memory.values())
        
        return {
            "memory_size_kb": memory_size / 1024,
            "total_entries": total_entries,
            "efficiency": "optimal" if total_entries < 100 else "high_usage",
            "last_access": datetime.now().isoformat()
        }
    
    def _generate_performance_recommendations(self) -> List[str]:
        """Generate performance improvement recommendations"""
        recommendations = []
        
        if self.performance_metrics["success_rate"] < 0.8:
            recommendations.append("Improve task completion rate")
        
        if self.performance_metrics["avg_confidence"] < 0.6:
            recommendations.append("Increase confidence calibration accuracy")
        
        if len(self.capabilities) < 5:
            recommendations.append("Expand agent capabilities")
        
        return recommendations
    
    async def advanced_self_interrogate(self, question_bank: List[str], context: Dict[str, Any] = None) -> ReflectionReport:
        """Enhanced self-interrogation with context awareness"""
        logger.info(f"Starting advanced self-interrogation with {len(question_bank)} questions")
        
        # Enhance question bank based on context
        enhanced_questions = self._enhance_question_bank(question_bank, context)
        
        # Create structured prompt for advanced interrogation
        interrogation_prompt = self._create_advanced_interrogation_prompt(enhanced_questions, context)
        
        try:
            if self.model:
                response = await self._call_model(interrogation_prompt)
            else:
                response = self._mock_advanced_interrogation_response(enhanced_questions)
            
            # Parse response into ReflectionReport
            reflection_report = self._parse_advanced_interrogation_response(response, enhanced_questions)
            
            # Store in reflection history
            self.reflection_history.append(reflection_report)
            
            # Update performance metrics
            self.performance_metrics["self_improvements"] += 1
            
            logger.info(f"Advanced self-interrogation completed with {len(reflection_report.assumptions)} assumptions")
            
            return reflection_report
            
        except Exception as e:
            logger.error(f"Advanced self-interrogation failed: {str(e)}")
            return ReflectionReport(
                assumptions=["Interrogation failed"],
                alternatives=["Retry needed"],
                weak_links=["Error in processing"],
                confidence_score=0.1,
                question_bank=enhanced_questions
            )
    
    def _enhance_question_bank(self, question_bank: List[str], context: Dict[str, Any]) -> List[str]:
        """Enhance question bank based on context"""
        enhanced_questions = question_bank.copy()
        
        # Add context-specific questions
        if context:
            if "previous_errors" in context:
                enhanced_questions.append("What patterns exist in previous errors?")
            if "user_expertise" in context:
                enhanced_questions.append("How does user expertise affect this analysis?")
            if "time_constraints" in context:
                enhanced_questions.append("How should time constraints influence reasoning depth?")
        
        return enhanced_questions
    
    def _create_advanced_interrogation_prompt(self, questions: List[str], context: Dict[str, Any]) -> str:
        """Create advanced structured prompt for self-interrogation"""
        context_section = ""
        if context:
            context_section = f"""
CONTEXT ANALYSIS:
{json.dumps(context, indent=2)}
"""
        
        prompt = f"""You are an advanced AI agent performing rigorous self-interrogation. 
Analyze the following questions with deep critical thinking and meta-cognitive awareness.

QUESTIONS TO ADDRESS:
{chr(10).join(f"{i+1}. {q}" for i, q in enumerate(questions))}
{context_section}

RESPONSE FORMAT (JSON):
{{
    "assumptions": [
        "List all explicit and implicit assumptions",
        "Include hidden biases and presuppositions",
        "Identify cultural or contextual assumptions"
    ],
    "alternatives": [
        "Generate diverse alternative perspectives",
        "Include contrarian viewpoints",
        "Consider interdisciplinary approaches",
        "Propose multiple solution paradigms"
    ],
    "weak_links": [
        "Identify logical fallacies or gaps",
        "Find methodological weaknesses",
        "Spot potential failure modes",
        "Analyze assumption-dependency chains"
    ],
    "meta_analysis": {{
        "reasoning_strategy": "Your reasoning approach",
        "confidence_calibration": "How you calibrated confidence",
        "cognitive_biases": "Potential biases in your analysis",
        "improvement_suggestions": "How to improve reasoning process"
    }},
    "confidence_assessment": "Your overall confidence (0.0-1.0)",
    "reasoning_quality_score": "Quality of reasoning process (0.0-1.0)"
}}

CRITICAL THINKING REQUIREMENTS:
1. Challenge every assumption aggressively
2. Consider multiple contradictory hypotheses simultaneously  
3. Identify your own cognitive biases
4. Evaluate reasoning methodology itself
5. Quantify uncertainty explicitly
6. Propose concrete improvement actions

Provide your response in valid JSON format:
"""
        return prompt
    
    async def _call_model(self, prompt: str) -> str:
        """Call language model with enhanced prompt"""
        # This would integrate with actual model API
        return await self._mock_model_response(prompt)
    
    async def _mock_model_response(self, prompt: str) -> str:
        """Mock advanced model response for testing"""
        return json.dumps({
            "assumptions": [
                "Current approach assumes user wants standard solution",
                "Assuming sufficient information is available",
                "Presuming linear problem-solving approach is optimal"
            ],
            "alternatives": [
                "Consider non-linear, emergent solution approaches",
                "Explore probabilistic reasoning methods",
                "Investigate constraint-based optimization",
                "Examine hybrid classical-ML techniques"
            ],
            "weak_links": [
                "Over-reliance on deterministic reasoning",
                "Insufficient consideration of uncertainty quantification",
                "Limited exploration of solution space",
                "Potential cognitive bias toward familiar patterns"
            ],
            "meta_analysis": {
                "reasoning_strategy": "hybrid_analytical_creative",
                "confidence_calibration": "self_adjusting_with_feedback",
                "cognitive_biases": "confirmation_bias_detected",
                "improvement_suggestions": [
                    "Implement Bayesian reasoning framework",
                    "Add uncertainty quantification layers",
                    "Develop meta-cognitive monitoring"
                ]
            },
            "confidence_assessment": 0.65,
            "reasoning_quality_score": 0.78
        }, indent=2)
    
    def _parse_advanced_interrogation_response(self, response: str, questions: List[str]) -> ReflectionReport:
        """Parse advanced model response into ReflectionReport"""
        try:
            data = json.loads(response)
            
            return ReflectionReport(
                assumptions=data.get("assumptions", []),
                alternatives=data.get("alternatives", []),
                weak_links=data.get("weak_links", []),
                confidence_score=data.get("confidence_assessment", 0.5),
                question_bank=questions
            )
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse advanced interrogation response: {str(e)}")
            return ReflectionReport(
                assumptions=["Response parsing failed"],
                alternatives=["Manual review needed"],
                weak_links=["JSON error in response"],
                confidence_score=0.2,
                question_bank=questions
            )
    
    async def self_interrogate(self, question_bank: List[str]) -> ReflectionReport:
        """
        Perform self-interrogation using structured prompt
        
        Args:
            question_bank: List of questions to force listing assumptions, alternatives, and weak links
            
        Returns:
            ReflectionReport with detailed analysis
        """
        logger.info(f"Starting self-interrogation with {len(question_bank)} questions")
        
        # Create structured prompt for self-interrogation
        interrogation_prompt = self._create_interrogation_prompt(question_bank)
        
        try:
            # Call model with structured prompt
            if self.model:
                response = await self._call_model(interrogation_prompt)
            else:
                # Fallback to mock response for testing
                response = self._mock_interrogation_response(question_bank)
            
            # Parse response into ReflectionReport
            reflection_report = self._parse_interrogation_response(response, question_bank)
            
            # Store in reflection history
            self.reflection_history.append(reflection_report)
            
            logger.info(f"Self-interrogation completed with {len(reflection_report.assumptions)} assumptions")
            
            return reflection_report
            
        except Exception as e:
            logger.error(f"Self-interrogation failed: {str(e)}")
            # Return minimal report on failure
            return ReflectionReport(
                assumptions=["Interrogation failed"],
                alternatives=["Retry needed"],
                weak_links=["Error in processing"],
                confidence_score=0.1,
                question_bank=question_bank
            )
    
    def _create_interrogation_prompt(self, question_bank: List[str]) -> str:
        """Create structured prompt for self-interrogation"""
        prompt = f"""
You are an AI agent performing rigorous self-interrogation. Analyze the following questions and provide detailed responses.

QUESTIONS TO ADDRESS:
{chr(10).join(f"{i+1}. {q}" for i, q in enumerate(question_bank))}

RESPONSE FORMAT (JSON):
{{
    "assumptions": [
        "List all underlying assumptions you're making",
        "Include implicit and explicit assumptions",
        "Be thorough and critical"
    ],
    "alternatives": [
        "Alternative interpretations or approaches",
        "Different ways to frame the problem",
        "Opposite or contrary viewpoints"
    ],
    "weak_links": [
        "Identify weakest logical connections",
        "Points where reasoning might fail",
        "Vulnerable assumptions or dependencies"
    ],
    "confidence_assessment": "Your overall confidence in your current reasoning (0.0-1.0)",
    "reasoning_analysis": "Brief analysis of your reasoning quality and potential improvements"
}}

CRITICAL THINKING REQUIREMENTS:
1. Be brutally honest about limitations
2. Challenge your own assumptions aggressively  
3. Consider multiple perspectives
4. Identify logical fallacies or gaps
5. Rate your confidence realistically

Provide your response in valid JSON format:
"""
        return prompt
    
    async def _call_model(self, prompt: str) -> str:
        """Call the language model with prompt"""
        # This would be implemented based on the specific model interface
        # For now, return a mock response
        return await self._mock_model_response(prompt)
    
    async def _mock_model_response(self, prompt: str) -> str:
        """Mock model response for testing"""
        return json.dumps({
            "assumptions": [
                "Current understanding is complete and accurate",
                "Initial approach is optimal",
                "No hidden biases affecting reasoning"
            ],
            "alternatives": [
                "Consider opposite viewpoint first",
                "Start from first principles",
                "Use different reasoning framework"
            ],
            "weak_links": [
                "Connection between premise A and conclusion B",
                "Assumption that current data is representative",
                "Reliance on single reasoning approach"
            ],
            "confidence_assessment": "0.6",
            "reasoning_analysis": "Reasoning appears sound but could benefit from multiple perspectives and stronger validation of key assumptions."
        })
    
    def _mock_interrogation_response(self, question_bank: List[str]) -> str:
        """Mock interrogation response for testing without model"""
        return json.dumps({
            "assumptions": [
                "Initial analysis captured all relevant factors",
                "Current approach is the most efficient",
                "No critical information is missing"
            ],
            "alternatives": [
                "Reverse the problem and work backwards",
                "Apply different domain knowledge",
                "Use analogical reasoning from similar cases"
            ],
            "weak_links": [
                "Causal relationship between factors",
                "Generalization from limited data",
                "Assumption of linear progression"
            ],
            "confidence_assessment": "0.5",
            "reasoning_analysis": "Standard reasoning approach with moderate confidence. Could benefit from exploring alternative frameworks and validating core assumptions more rigorously."
        })
    
    def _parse_interrogation_response(self, response: str, question_bank: List[str]) -> ReflectionReport:
        """Parse model response into ReflectionReport"""
        try:
            data = json.loads(response)
            
            # Extract confidence score
            confidence_str = data.get("confidence_assessment", "0.5")
            try:
                confidence_score = float(confidence_str)
            except (ValueError, TypeError):
                confidence_score = 0.5
            
            return ReflectionReport(
                assumptions=data.get("assumptions", []),
                alternatives=data.get("alternatives", []),
                weak_links=data.get("weak_links", []),
                confidence_score=confidence_score,
                question_bank=question_bank
            )
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse interrogation response: {str(e)}")
            return ReflectionReport(
                assumptions=["Response parsing failed"],
                alternatives=["Manual review needed"],
                weak_links=["JSON error in response"],
                confidence_score=0.2,
                question_bank=question_bank
            )
    
    def get_reflection_summary(self) -> Dict[str, Any]:
        """Get summary of all reflection history"""
        if not self.reflection_history:
            return {"total_reflections": 0, "average_confidence": 0.0}
        
        total_confidence = sum(r.confidence_score for r in self.reflection_history)
        avg_confidence = total_confidence / len(self.reflection_history)
        
        return {
            "total_reflections": len(self.reflection_history),
            "average_confidence": avg_confidence,
            "latest_reflection": self.reflection_history[-1].__dict__ if self.reflection_history else None,
            "confidence_trend": "improving" if len(self.reflection_history) > 1 and avg_confidence > self.reflection_history[0].confidence_score else "stable"
        }
    
    def store_memory(self, key: str, value: Any):
        """Store information in agent memory"""
        self.memory[key] = value
    
    def retrieve_memory(self, key: str) -> Any:
        """Retrieve information from agent memory"""
        return self.memory.get(key)
    
    def clear_memory(self):
        """Clear agent memory"""
        self.memory.clear()
        logger.info("Agent memory cleared")

# Factory function
def create_agent_base(model=None) -> AgentBase:
    """Create AgentBase instance"""
    return AgentBase(model)

# Test function
async def test_agent_base():
    """Test AgentBase self-interrogation"""
    agent = create_agent_base()
    
    question_bank = [
        "What assumptions am I making about this problem?",
        "What alternative approaches should I consider?", 
        "Where are the weakest links in my reasoning?",
        "How confident am I in my current conclusions?"
    ]
    
    print("Testing AgentBase self-interrogation...")
    report = await agent.self_interrogate(question_bank)
    
    print(f"Assumptions: {report.assumptions}")
    print(f"Alternatives: {report.alternatives}")
    print(f"Weak Links: {report.weak_links}")
    print(f"Confidence: {report.confidence_score}")
    
    # Get reflection summary
    summary = agent.get_reflection_summary()
    print(f"Reflection Summary: {summary}")

if __name__ == "__main__":
    asyncio.run(test_agent_base())
