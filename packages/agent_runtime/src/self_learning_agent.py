"""
Synova AI - Self-Learning Super-Agent
Cost-free continuous improvement system using synthetic data and meta-learning
"""

import json
import asyncio
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from pathlib import Path
from datetime import datetime
import structlog

log = structlog.get_logger()

@dataclass
class LearningEpisode:
    """Single learning episode"""
    timestamp: str
    query: str
    response: str
    thinking_process: str
    confidence: float
    layers_used: List[int]
    user_feedback: Optional[float] = None  # 0-1 rating if provided
    self_evaluation: float = 0.0
    improvement_suggestions: List[str] = field(default_factory=list)

@dataclass
class MetaStrategy:
    """Meta-strategy for reasoning"""
    strategy_id: str
    description: str
    success_count: int
    failure_count: int
    average_confidence: float
    applicable_layers: List[int]
    last_used: str

class SelfLearningAgent:
    """
    Self-learning super-agent that continuously improves without external costs
    
    Capabilities:
    - Synthetic data generation for training
    - Meta-learning on own reasoning patterns
    - Strategy optimization based on success rates
    - Knowledge consolidation
    - Self-evaluation and calibration
    """
    
    def __init__(self, knowledge_base_path: str = "./ml/knowledge_base"):
        self.knowledge_base_path = Path(knowledge_base_path)
        self.knowledge_base_path.mkdir(parents=True, exist_ok=True)
        
        self.episodes: List[LearningEpisode] = []
        self.meta_strategies: Dict[str, MetaStrategy] = {}
        self.knowledge_graph: Dict[str, Any] = {}
        
        self._load_knowledge()
        self._initialize_meta_strategies()
        
        log.info("self_learning_agent_initialized")
    
    def _load_knowledge(self):
        """Load existing knowledge from disk"""
        episodes_file = self.knowledge_base_path / "episodes.json"
        strategies_file = self.knowledge_base_path / "strategies.json"
        graph_file = self.knowledge_base_path / "knowledge_graph.json"
        
        if episodes_file.exists():
            with open(episodes_file, 'r') as f:
                episode_data = json.load(f)
                self.episodes = [LearningEpisode(**e) for e in episode_data]
            log.info("loaded_episodes", count=len(self.episodes))
        
        if strategies_file.exists():
            with open(strategies_file, 'r') as f:
                strategy_data = json.load(f)
                self.meta_strategies = {
                    k: MetaStrategy(**v) for k, v in strategy_data.items()
                }
            log.info("loaded_strategies", count=len(self.meta_strategies))
        
        if graph_file.exists():
            with open(graph_file, 'r') as f:
                self.knowledge_graph = json.load(f)
            log.info("loaded_knowledge_graph")
    
    def _initialize_meta_strategies(self):
        """Initialize default meta-strategies"""
        default_strategies = {
            "systematic_analysis": MetaStrategy(
                strategy_id="systematic_analysis",
                description="Break down complex problems into sub-problems",
                success_count=0,
                failure_count=0,
                average_confidence=0.8,
                applicable_layers=[1, 3, 6],
                last_used=""
            ),
            "multi_perspective": MetaStrategy(
                strategy_id="multi_perspective",
                description="Analyze from multiple viewpoints before synthesizing",
                success_count=0,
                failure_count=0,
                average_confidence=0.75,
                applicable_layers=[2, 6],
                last_used=""
            ),
            "analogical_reasoning": MetaStrategy(
                strategy_id="analogical_reasoning",
                description="Use analogies from known domains to solve novel problems",
                success_count=0,
                failure_count=0,
                average_confidence=0.7,
                applicable_layers=[4, 6],
                last_used=""
            ),
            "causal_chain": MetaStrategy(
                strategy_id="causal_chain",
                description="Trace causal relationships forward and backward",
                success_count=0,
                failure_count=0,
                average_confidence=0.8,
                applicable_layers=[3, 6],
                last_used=""
            ),
            "emergent_analysis": MetaStrategy(
                strategy_id="emergent_analysis",
                description="Analyze system-level patterns and emergent behaviors",
                success_count=0,
                failure_count=0,
                average_confidence=0.75,
                applicable_layers=[5, 6],
                last_used=""
            )
        }
        
        for strategy_id, strategy in default_strategies.items():
            if strategy_id not in self.meta_strategies:
                self.meta_strategies[strategy_id] = strategy
    
    async def process_with_learning(self, query: str, reasoning_type: str = "general") -> Dict[str, Any]:
        """
        Process query with learning enabled
        
        Returns:
            Dict with response, thinking process, and learning metadata
        """
        log.info("processing_with_learning", query=query[:100])
        
        # Select optimal strategy based on query and past performance
        strategy = self._select_strategy(query, reasoning_type)
        
        # Generate response (in production, this would call the actual model)
        response_data = await self._generate_response(query, strategy)
        
        # Create learning episode
        episode = LearningEpisode(
            timestamp=datetime.now().isoformat(),
            query=query,
            response=response_data["response"],
            thinking_process=response_data["thinking"],
            confidence=response_data["confidence"],
            layers_used=response_data["layers_used"],
            self_evaluation=response_data["confidence"]
        )
        
        # Self-evaluate
        episode.self_evaluation = self._self_evaluate(episode)
        
        # Generate improvement suggestions
        episode.improvement_suggestions = self._generate_improvements(episode)
        
        # Update strategy performance
        self._update_strategy(strategy, episode.confidence)
        
        # Add to episodes
        self.episodes.append(episode)
        
        # Consolidate knowledge
        self._consolidate_knowledge(episode)
        
        # Save periodically
        if len(self.episodes) % 10 == 0:
            self._save_knowledge()
        
        return {
            "response": response_data["response"],
            "thinking": response_data["thinking"],
            "confidence": response_data["confidence"],
            "layers_used": response_data["layers_used"],
            "strategy_used": strategy.strategy_id,
            "learning_metadata": {
                "self_evaluation": episode.self_evaluation,
                "improvements": episode.improvement_suggestions,
                "strategy_success_rate": self._get_strategy_success_rate(strategy.strategy_id)
            }
        }
    
    def _select_strategy(self, query: str, reasoning_type: str) -> MetaStrategy:
        """Select optimal strategy based on query and past performance"""
        applicable_strategies = [
            s for s in self.meta_strategies.values()
            if reasoning_type in ["general"] or len(s.applicable_layers) > 0
        ]
        
        # Sort by success rate and average confidence
        applicable_strategies.sort(
            key=lambda s: (self._get_strategy_success_rate(s.strategy_id), s.average_confidence),
            reverse=True
        )
        
        # Select top strategy with some exploration
        if len(applicable_strategies) > 0:
            selected = applicable_strategies[0]
            selected.last_used = datetime.now().isoformat()
            return selected
        
        # Fallback to systematic analysis
        return self.meta_strategies["systematic_analysis"]
    
    async def _generate_response(self, query: str, strategy: MetaStrategy) -> Dict[str, Any]:
        """
        Generate response using selected strategy
        In production, this would call the actual LLM with the strategy prompt
        """
        # Simulate response generation
        # In production: response = await model.generate(query, strategy)
        
        layers = strategy.applicable_layers
        
        thinking = f"Strategy: {strategy.description}\n"
        thinking += f"Layers activated: {', '.join([f'Layer {l}' for l in layers])}\n"
        thinking += f"Analysis: Applying {strategy.strategy_id} to query: {query}\n"
        
        confidence = strategy.average_confidence
        
        response = f"Based on {strategy.strategy_id} analysis, here is the response to: {query}"
        
        return {
            "response": response,
            "thinking": thinking,
            "confidence": confidence,
            "layers_used": layers
        }
    
    def _self_evaluate(self, episode: LearningEpisode) -> float:
        """Self-evaluate the quality of the response"""
        # Factors for self-evaluation
        factors = {
            "confidence": episode.confidence,
            "thinking_depth": len(episode.thinking_process) / 1000,  # Normalized
            "layer_diversity": len(set(episode.layers_used)) / 6,
            "response_length": len(episode.response) / 500  # Normalized
        }
        
        # Weighted average
        weights = {"confidence": 0.4, "thinking_depth": 0.2, "layer_diversity": 0.2, "response_length": 0.2}
        
        evaluation = sum(factors[k] * weights[k] for k in factors)
        return min(evaluation, 1.0)
    
    def _generate_improvements(self, episode: LearningEpisode) -> List[str]:
        """Generate suggestions for improvement"""
        improvements = []
        
        if episode.confidence < 0.8:
            improvements.append("Consider additional reasoning layers to increase confidence")
        
        if len(episode.layers_used) < 4:
            improvements.append("Activate more DRT layers for deeper analysis")
        
        if episode.self_evaluation < 0.7:
            improvements.append("Review thinking process for potential biases or gaps")
        
        if len(episode.thinking_process) < 500:
            improvements.append("Expand thinking process with more detailed analysis")
        
        return improvements
    
    def _update_strategy(self, strategy: MetaStrategy, confidence: float):
        """Update strategy performance metrics"""
        if confidence > 0.7:
            strategy.success_count += 1
        else:
            strategy.failure_count += 1
        
        # Update average confidence (exponential moving average)
        alpha = 0.1
        strategy.average_confidence = (
            alpha * confidence + 
            (1 - alpha) * strategy.average_confidence
        )
    
    def _get_strategy_success_rate(self, strategy_id: str) -> float:
        """Calculate success rate for a strategy"""
        strategy = self.meta_strategies.get(strategy_id)
        if not strategy:
            return 0.0
        
        total = strategy.success_count + strategy.failure_count
        if total == 0:
            return 0.0
        
        return strategy.success_count / total
    
    def _consolidate_knowledge(self, episode: LearningEpisode):
        """Consolidate knowledge from episode into knowledge graph"""
        # Extract key concepts from query
        concepts = self._extract_concepts(episode.query)
        
        for concept in concepts:
            if concept not in self.knowledge_graph:
                self.knowledge_graph[concept] = {
                    "occurrences": 0,
                    "contexts": [],
                    "related_concepts": [],
                    "strategies_used": [],
                    "average_confidence": 0.0
                }
            
            # Update concept data
            self.knowledge_graph[concept]["occurrences"] += 1
            self.knowledge_graph[concept]["contexts"].append(episode.query[:100])
            
            # Track strategies used
            for layer in episode.layers_used:
                strategy_for_layer = self._get_strategy_for_layer(layer)
                if strategy_for_layer and strategy_for_layer not in self.knowledge_graph[concept]["strategies_used"]:
                    self.knowledge_graph[concept]["strategies_used"].append(strategy_for_layer)
            
            # Update average confidence
            alpha = 0.1
            self.knowledge_graph[concept]["average_confidence"] = (
                alpha * episode.confidence +
                (1 - alpha) * self.knowledge_graph[concept]["average_confidence"]
            )
    
    def _extract_concepts(self, text: str) -> List[str]:
        """Extract key concepts from text (simplified)"""
        # In production, use NLP for concept extraction
        words = text.lower().split()
        # Filter out common words and short words
        concepts = [w for w in words if len(w) > 4 and w not in ["this", "that", "with", "from", "what", "when", "will"]]
        return list(set(concepts[:5]))  # Return top 5 unique concepts
    
    def _get_strategy_for_layer(self, layer: int) -> Optional[str]:
        """Get strategy ID for a given layer"""
        for strategy in self.meta_strategies.values():
            if layer in strategy.applicable_layers:
                return strategy.strategy_id
        return None
    
    def _save_knowledge(self):
        """Save knowledge to disk"""
        # Save episodes
        episodes_file = self.knowledge_base_path / "episodes.json"
        with open(episodes_file, 'w') as f:
            json.dump([e.__dict__ for e in self.episodes[-1000:]], f, indent=2)  # Keep last 1000
        
        # Save strategies
        strategies_file = self.knowledge_base_path / "strategies.json"
        with open(strategies_file, 'w') as f:
            json.dump({k: v.__dict__ for k, v in self.meta_strategies.items()}, f, indent=2)
        
        # Save knowledge graph
        graph_file = self.knowledge_base_path / "knowledge_graph.json"
        with open(graph_file, 'w') as f:
            json.dump(self.knowledge_graph, f, indent=2)
        
        log.info("knowledge_saved")
    
    def generate_training_data(self, num_samples: int = 100) -> List[Dict]:
        """
        Generate training data from learned episodes
        
        This enables cost-free continuous improvement by using
        successful episodes as training examples
        """
        log.info("generating_training_data", num_samples=num_samples)
        
        # Select best episodes (high confidence, high self-evaluation)
        scored_episodes = [
            (e, e.confidence * e.self_evaluation)
            for e in self.episodes
        ]
        
        scored_episodes.sort(key=lambda x: x[1], reverse=True)
        
        # Generate training samples from top episodes
        training_data = []
        for episode, score in scored_episodes[:num_samples]:
            if score > 0.6:  # Only use high-quality episodes
                sample = {
                    "input": episode.query,
                    "thinking": episode.thinking_process,
                    "output": episode.response,
                    "confidence": episode.confidence,
                    "layers_used": episode.layers_used,
                    "strategy": self._get_strategy_for_layer(episode.layers_used[0]) if episode.layers_used else None
                }
                training_data.append(sample)
        
        log.info("training_data_generated", count=len(training_data))
        return training_data
    
    def get_learning_stats(self) -> Dict[str, Any]:
        """Get statistics about learning progress"""
        return {
            "total_episodes": len(self.episodes),
            "total_strategies": len(self.meta_strategies),
            "knowledge_graph_size": len(self.knowledge_graph),
            "strategy_performance": {
                strategy_id: {
                    "success_rate": self._get_strategy_success_rate(strategy_id),
                    "average_confidence": strategy.average_confidence,
                    "total_uses": strategy.success_count + strategy.failure_count
                }
                for strategy_id, strategy in self.meta_strategies.items()
            },
            "average_self_evaluation": sum(e.self_evaluation for e in self.episodes) / len(self.episodes) if self.episodes else 0.0
        }
