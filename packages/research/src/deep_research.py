"""
Deep Research Service - Multi-step research with query planning and synthesis
Performs comprehensive web research with automated query generation and result synthesis
"""

import asyncio
import json
import re
from typing import AsyncGenerator, List, Dict, Any
import structlog

log = structlog.get_logger()

RESEARCH_PLANNER = """You are a Deep Research Planner for Synova Nexus.
Given a research topic, generate 5 targeted search queries that together cover the topic comprehensively.
Return ONLY a JSON array of strings: ["query1","query2","query3","query4","query5"]"""

SYNTHESIS_SYSTEM = """You are a Deep Research Synthesizer. You have web search results.
Write a comprehensive, well-structured research report with:
- Executive Summary
- Key Findings (with inline citations [1][2][3])
- Detailed Analysis 
- Conclusions
Cite every factual claim."""


class DeepResearchService:
    """
    Deep Research Service - Automated multi-step research
    Plans queries, executes searches, and synthesizes results
    """
    
    def __init__(self, tool_service=None, llm_service=None):
        self.tool_service = tool_service
        self.llm_service = llm_service
        self.research_stats = {
            'researches_completed': 0,
            'queries_executed': 0,
            'average_synthesis_time': 0.0
        }
    
    async def run_deep_research(self, topic: str) -> AsyncGenerator[str, None]:
        """
        Run deep research on a topic
        
        Args:
            topic: Research topic
            
        Yields:
            Research progress and final report
        """
        import time
        start_time = time.time()
        
        yield f"**🔍 Deep Research: {topic}**\n\n"
        yield "**Planning research queries...**\n"
        
        # Generate research queries
        queries = await self._plan_queries(topic)
        yield f"**Queries:** {', '.join(queries)}\n\n"
        
        # Execute searches
        all_results = []
        for i, query in enumerate(queries[:5], 1):
            yield f"**Searching [{i}/5]:** {query}\n"
            result = await self._execute_search(query)
            all_results.append(f"### Query: {query}\n{result}")
            await asyncio.sleep(0.5)
        
        # Synthesize results
        yield "\n**Synthesizing results...**\n\n"
        combined = "\n\n---\n\n".join(all_results)
        
        synthesis = await self._synthesize_results(topic, combined)
        for chunk in synthesis:
            yield chunk
        
        # Update stats
        synthesis_time = time.time() - start_time
        self.research_stats['researches_completed'] += 1
        self.research_stats['queries_executed'] += len(queries)
        self.research_stats['average_synthesis_time'] = (
            (self.research_stats['average_synthesis_time'] * (self.research_stats['researches_completed'] - 1) + synthesis_time) /
            self.research_stats['researches_completed']
        )
    
    async def _plan_queries(self, topic: str) -> List[str]:
        """Generate research queries using LLM"""
        if self.llm_service:
            from packages.ai.src.provider_service import LLMProvider
            from packages.ai.src.provider_service import Message
            
            messages = [
                Message(role="system", content=RESEARCH_PLANNER),
                Message(role="user", content=topic)
            ]
            
            result = ""
            async for chunk in self.llm_service.stream_chat(
                messages,
                provider=LLMProvider.openai,
                temperature=0.2
            ):
                result += chunk
            
            # Extract JSON array
            match = re.search(r'\[.*?\]', result, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group())
                except json.JSONDecodeError:
                    pass
        
        # Fallback queries
        return [
            f"{topic} overview",
            f"{topic} benefits",
            f"{topic} challenges",
            f"{topic} best practices",
            f"{topic} future trends"
        ]
    
    async def _execute_search(self, query: str) -> str:
        """Execute web search"""
        if self.tool_service:
            result = await self.tool_service.run_tool("web_search", {"query": query})
            if result.get("success"):
                return result.get("result", "")
        
        # Fallback
        return f"Search results for: {query}\n[Simulated results - configure search API]"
    
    async def _synthesize_results(self, topic: str, combined_results: str) -> AsyncGenerator[str, None]:
        """Synthesize research results into report"""
        if self.llm_service:
            from packages.ai.src.provider_service import LLMProvider
            from packages.ai.src.provider_service import Message
            
            messages = [
                Message(role="system", content=SYNTHESIS_SYSTEM),
                Message(role="user", content=f"Research topic: {topic}\n\nSearch Results:\n{combined_results}")
            ]
            
            async for chunk in self.llm_service.stream_chat(
                messages,
                provider=LLMProvider.openai,
                temperature=0.3,
                max_tokens=8192
            ):
                yield chunk
        else:
            yield f"# Research Report: {topic}\n\n"
            yield "## Executive Summary\n\n"
            yield combined_results[:500]
            yield "\n\n## Key Findings\n\n"
            yield "Research synthesis requires LLM service integration."
    
    def get_research_stats(self) -> Dict[str, Any]:
        """Get research statistics"""
        return self.research_stats
    
    async def health_check(self) -> Dict[str, Any]:
        """Health check for deep research service"""
        return {
            "status": "healthy",
            "tool_service_connected": self.tool_service is not None,
            "llm_service_connected": self.llm_service is not None,
            "stats": self.get_research_stats()
        }
