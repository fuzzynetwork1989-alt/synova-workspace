"""
Synova AI - Synthetic Data Generator for Deep Resonance Thinking
Generates high-quality training data without external costs
"""

import json
import random
from typing import Dict, List
from pathlib import Path
import structlog

log = structlog.get_logger()

class SynovaDataGenerator:
    """Generate synthetic training data for Deep Resonance Thinking"""
    
    def __init__(self, tokenizer=None):
        self.tokenizer = tokenizer
        
        # Templates for different reasoning types
        self.reasoning_templates = {
            "mathematical": [
                "Solve this problem step by step: {problem}",
                "Calculate the answer to: {problem}",
                "Find the solution to: {problem}"
            ],
            "logical": [
                "Analyze this logical puzzle: {problem}",
                "Determine the correct conclusion: {problem}",
                "Evaluate this argument: {problem}"
            ],
            "creative": [
                "Generate a creative solution for: {problem}",
                "Brainstorm ideas for: {problem}",
                "Design an approach to: {problem}"
            ],
            "causal": [
                "Analyze the causal relationships in: {problem}",
                "What are the consequences of: {problem}",
                "Trace the effects of: {problem}"
            ],
            "analogical": [
                "Draw analogies between: {problem}",
                "Find similarities between: {problem}",
                "Apply principles from one domain to: {problem}"
            ]
        }
        
        # Sample problems for each category
        self.problem_bank = {
            "mathematical": [
                "If x + y = 10 and x - y = 2, what is x?",
                "A train travels at 60 mph for 2 hours, then 80 mph for 3 hours. What's the total distance?",
                "What is the sum of the first 100 positive integers?",
                "Solve for x: 2x^2 - 8x + 6 = 0",
                "If 3 workers can build a wall in 6 days, how many days for 5 workers?"
            ],
            "logical": [
                "All A are B. Some B are C. What can we conclude about A and C?",
                "If it rains, the ground gets wet. The ground is wet. Did it rain?",
                "In a room of 23 people, what's the probability at least two share a birthday?",
                "A says 'I always lie'. Is A telling the truth?",
                "You have two doors, one leads to freedom, one to death. One guard always lies, one always tells truth. What do you ask?"
            ],
            "creative": [
                "Design a sustainable city transportation system",
                "Create a solution for reducing plastic waste",
                "Invent a new educational approach for remote learning",
                "Design a system for fair resource distribution",
                "Create a novel approach to mental health support"
            ],
            "causal": [
                "What are the long-term effects of remote work on urban development?",
                "How does social media usage affect political polarization?",
                "What causes economic inequality and what are its effects?",
                "Trace the causal chain of climate change on agriculture",
                "What are the consequences of AI automation on employment?"
            ],
            "analogical": [
                "How is the human brain like a computer? How is it different?",
                "Compare the immune system to a military defense system",
                "Draw analogies between learning a language and learning music",
                "How is market competition like evolutionary competition?",
                "Compare organizational structure to biological systems"
            ]
        }
    
    def generate_drt_samples(self, num_samples: int) -> List[Dict]:
        """Generate training samples with Deep Resonance Thinking structure"""
        log.info("generating_drt_samples", count=num_samples)
        
        samples = []
        
        for i in range(num_samples):
            # Select reasoning type
            reasoning_type = random.choice(list(self.reasoning_templates.keys()))
            
            # Select problem
            problem = random.choice(self.problem_bank[reasoning_type])
            
            # Select template
            template = random.choice(self.reasoning_templates[reasoning_type])
            prompt = template.format(problem=problem)
            
            # Determine which layers to activate
            layers_used = self._select_layers(reasoning_type)
            
            # Generate synthetic reasoning for each layer
            thinking = self._generate_thinking(process=problem, layers=layers_used)
            
            # Generate synthetic answer
            answer = self._generate_answer(problem, reasoning_type)
            
            sample = {
                "input": prompt,
                "problem": problem,
                "reasoning_type": reasoning_type,
                "thinking": thinking,
                "output": answer,
                "confidence": round(random.uniform(0.7, 0.95), 2),
                "layers_used": layers_used
            }
            
            samples.append(sample)
        
        log.info("samples_generated", count=len(samples))
        return samples
    
    def _select_layers(self, reasoning_type: str) -> List[int]:
        """Select which DRT layers to activate based on reasoning type"""
        layer_strategies = {
            "mathematical": [1, 3, 6],
            "logical": [1, 2, 6],
            "creative": [2, 4, 6],
            "causal": [1, 3, 5, 6],
            "analogical": [2, 4, 6]
        }
        
        return layer_strategies.get(reasoning_type, [1, 6])
    
    def _generate_thinking(self, process: str, layers: List[int]) -> str:
        """Generate synthetic thinking process for each layer"""
        thinking_parts = []
        
        layer_descriptions = {
            1: "Meta-Cognitive Awareness",
            2: "Multi-Perspective Synthesis",
            3: "Temporal Depth Reasoning",
            4: "Conceptual Lattice Navigation",
            5: "Emergent Property Detection",
            6: "Recursive Self-Improvement"
        }
        
        for layer in sorted(layers):
            layer_thinking = self._generate_layer_thinking(layer, process)
            thinking_parts.append(f"Layer {layer} ({layer_descriptions[layer]}): {layer_thinking}")
        
        return "\n".join(thinking_parts)
    
    def _generate_layer_thinking(self, layer: int, process: str) -> str:
        """Generate thinking for a specific layer"""
        layer_templates = {
            1: [
                f"Assessing confidence in approach to: {process}. Initial confidence: 0.8. No obvious biases detected.",
                f"Checking for logical fallacies in reasoning about: {process}. None found. Proceeding with current approach.",
                f"Validating reasoning against constraints for: {process}. All constraints satisfied."
            ],
            2: [
                f"Expert perspective: Analyze {process} systematically. Critic perspective: Challenge assumptions. User perspective: Consider practical implications.",
                f"Thesis: {process} requires methodical approach. Antithesis: Alternative approaches exist. Synthesis: Combine systematic and creative methods.",
                f"Multiple viewpoints considered: technical, practical, ethical perspectives on {process}."
            ],
            3: [
                f"Causal chain analysis for {process}: immediate causes → medium-term effects → long-term consequences.",
                f"Counterfactual simulation: What if {process} were approached differently? Alternative outcomes considered.",
                f"Time horizon analysis: Short-term impact of {process}, medium-term trends, long-term projections."
            ],
            4: [
                f"Conceptual mapping: {process} maps to domain X. Analogous problems in domain Y suggest similar solutions.",
                f"Cross-domain analogy: Principles from biology apply to {process}. Concept blend creates novel approach.",
                f"Abstract principle: {process} relates to optimization theory. Concrete application: specific implementation."
            ],
            5: [
                f"System analysis: Components of {process} interact to create emergent patterns. Feedback loops identified.",
                f"Emergent behavior: {process} exhibits properties not present in individual components.",
                f"Holistic understanding: {process} as a complete system with interdependent parts."
            ],
            6: [
                f"Strategy evaluation: Current approach to {process} effective. Meta-strategy updated for similar problems.",
                f"Pattern recognition: {process} follows known pattern. Applying learned strategy.",
                f"Knowledge consolidation: Insights from {process} added to knowledge base for future use."
            ]
        }
        
        templates = layer_templates.get(layer, ["Analyzing process."])
        return random.choice(templates)
    
    def _generate_answer(self, problem: str, reasoning_type: str) -> str:
        """Generate synthetic answer (placeholder - would be actual model output in production)"""
        answer_templates = {
            "mathematical": [
                f"Based on systematic analysis, the solution to '{problem}' is derived through step-by-step calculation.",
                f"Applying mathematical principles to '{problem}' yields the following result."
            ],
            "logical": [
                f"Through logical analysis of '{problem}', the conclusion is derived by examining premises and implications.",
                f"Evaluating the logical structure of '{problem}' leads to this conclusion."
            ],
            "creative": [
                f"A creative solution for '{problem}' involves combining multiple innovative approaches.",
                f"Brainstorming solutions for '{problem}' reveals several promising directions."
            ],
            "causal": [
                f"The causal analysis of '{problem}' reveals interconnected factors and consequences.",
                f"Tracing the causal chain of '{problem}' shows how initial conditions lead to observed outcomes."
            ],
            "analogical": [
                f"Drawing analogies for '{problem}' reveals structural similarities that inform the solution.",
                f"The comparison in '{problem}' highlights transferable principles between domains."
            ]
        }
        
        templates = answer_templates.get(reasoning_type, ["Analysis complete."])
        return random.choice(templates)
    
    def save_samples(self, samples: List[Dict], output_path: str):
        """Save generated samples to file"""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(samples, f, indent=2)
        
        log.info("samples_saved", path=str(output_file), count=len(samples))
