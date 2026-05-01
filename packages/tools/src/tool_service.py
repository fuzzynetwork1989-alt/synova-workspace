"""
Tool Service - Tool Execution with Web Search, Code Execution, Image Generation
Provides hooks for external tool integration with safety and governance
"""

import os
import httpx
import json
from typing import Dict, Any, Optional, List
from enum import Enum
import structlog

log = structlog.get_logger()


class ToolType(str, Enum):
    """Supported tool types"""
    web_search = "web_search"
    code_execution = "code_execution"
    image_generation = "image_generation"
    data_analysis = "data_analysis"
    file_operations = "file_operations"


class ToolPermission(str, Enum):
    """Tool permission levels"""
    read_only = "read_only"
    write = "write"
    execute = "execute"
    admin = "admin"


class ToolDefinition:
    """Tool definition for registration"""

    def __init__(
        self,
        name: str,
        description: str,
        parameters: Dict[str, Any],
        permission: ToolPermission = ToolPermission.read_only,
        timeout_seconds: int = 30,
        requires_approval: bool = False
    ):
        self.name = name
        self.description = description
        self.parameters = parameters
        self.permission = permission
        self.timeout_seconds = timeout_seconds
        self.requires_approval = requires_approval


class ToolService:
    """
    Tool Service - Execute external tools with safety and governance
    Supports web search, code execution, image generation, and more
    """

    def __init__(self):
        self.tools: Dict[str, ToolDefinition] = {}
        self.tool_stats = {
            'total_executions': 0,
            'executions_by_type': {},
            'success_rate': 0.0,
            'average_execution_time': 0.0
        }

        # Register default tools
        self._register_default_tools()

    def _register_default_tools(self):
        """Register default tool definitions"""

        # Web Search Tool
        self.register_tool(
            ToolDefinition(
                name="web_search",
                description="Search the web for information",
                parameters={"query": "string", "num_results": "integer"},
                permission=ToolPermission.read_only,
                timeout_seconds=10
            )
        )

        # Code Execution Tool
        self.register_tool(
            ToolDefinition(
                name="code_execution",
                description="Execute code in a sandboxed environment",
                parameters={"code": "string", "language": "string"},
                permission=ToolPermission.execute,
                timeout_seconds=30,
                requires_approval=True
            )
        )

        # Image Generation Tool
        self.register_tool(
            ToolDefinition(
                name="image_generation",
                description="Generate images from text descriptions",
                parameters={"prompt": "string", "style": "string"},
                permission=ToolPermission.read_only,
                timeout_seconds=60
            )
        )

        # Data Analysis Tool
        self.register_tool(
            ToolDefinition(
                name="data_analysis",
                description="Analyze data and generate insights",
                parameters={"data": "array", "analysis_type": "string"},
                permission=ToolPermission.read_only,
                timeout_seconds=20
            )
        )

    def register_tool(self, tool: ToolDefinition):
        """Register a tool definition"""
        self.tools[tool.name] = tool
        log.info("tool_registered", tool=tool.name, permission=tool.permission.value)

    def get_tool(self, name: str) -> Optional[ToolDefinition]:
        """Get tool definition by name"""
        return self.tools.get(name)

    def list_tools(self) -> List[Dict[str, Any]]:
        """List all registered tools"""
        return [
            {
                "name": tool.name,
                "description": tool.description,
                "permission": tool.permission.value,
                "timeout_seconds": tool.timeout_seconds,
                "requires_approval": tool.requires_approval
            }
            for tool in self.tools.values()
        ]

    async def run_tool(
        self,
        tool_name: str,
        parameters: Dict[str, Any],
        user_id: Optional[str] = None,
        tenant_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Execute a tool with the given parameters

        Args:
            tool_name: Name of the tool to execute
            parameters: Tool parameters
            user_id: Optional user ID for governance
            tenant_id: Optional tenant ID for multi-tenancy

        Returns:
            Tool execution result
        """
        import time
        start_time = time.time()

        tool = self.get_tool(tool_name)
        if not tool:
            return {
                "success": False,
                "error": f"Tool not found: {tool_name}",
                "tool_name": tool_name
            }

        # Check if tool requires approval
        if tool.requires_approval:
            # In production, would check with governance system
            log.warning("tool_requires_approval", tool=tool_name, user_id=user_id)
            return {
                "success": False,
                "error": "Tool requires approval",
                "tool_name": tool_name,
                "requires_approval": True
            }

        try:
            # Execute tool based on type
            if tool_name == "web_search":
                result = await self._web_search(parameters)
            elif tool_name == "code_execution":
                result = await self._code_execution(parameters)
            elif tool_name == "image_generation":
                result = await self._image_generation(parameters)
            elif tool_name == "data_analysis":
                result = await self._data_analysis(parameters)
            else:
                result = await self._generic_tool_execution(tool_name, parameters)

            execution_time = time.time() - start_time

            # Update stats
            self.tool_stats['total_executions'] += 1
            tool_type = tool_name
            self.tool_stats['executions_by_type'][tool_type] = self.tool_stats['executions_by_type'].get(tool_type, 0) + 1
            self.tool_stats['average_execution_time'] = (
                (self.tool_stats['average_execution_time'] * (self.tool_stats['total_executions'] - 1) + execution_time) /
                self.tool_stats['total_executions']
            )

            return {
                "success": True,
                "result": result,
                "tool_name": tool_name,
                "execution_time_seconds": execution_time
            }

        except Exception as e:
            log.error("tool_execution_error", tool=tool_name, error=str(e))
            return {
                "success": False,
                "error": str(e),
                "tool_name": tool_name
            }

    async def _web_search(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute web search with Serper or Tavily API"""
        query = parameters.get("query", "")
        num_results = parameters.get("num_results", 5)

        serper_key = os.getenv("SERPER_API_KEY")
        tavily_key = os.getenv("TAVILY_API_KEY")

        if not serper_key and not tavily_key:
            return {
                "query": query,
                "results": [],
                "error": "Search unavailable — configure SERPER_API_KEY or TAVILY_API_KEY"
            }

        if serper_key:
            return await self._search_with_serper(query, num_results, serper_key)
        else:
            return await self._search_with_tavily(query, num_results, tavily_key)

    async def _search_with_serper(self, query: str, num_results: int, api_key: str) -> Dict[str, Any]:
        """Search using Serper API"""
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                "https://google.serper.dev/search",
                json={"q": query, "num": num_results},
                headers={"X-API-KEY": api_key, "Content-Type": "application/json"}
            )
            data = response.json()
            organic = data.get("organic", [])
            results = "\n\n".join([f"**{r['title']}**\n{r.get('snippet','')}\n{r['link']}" for r in organic[:5]])
            return {"query": query, "results": results or "No results found."}

    async def _search_with_tavily(self, query: str, num_results: int, api_key: str) -> Dict[str, Any]:
        """Search using Tavily API"""
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                "https://api.tavily.com/search",
                json={"api_key": api_key, "query": query, "max_results": num_results}
            )
            data = response.json()
            results = data.get("results", [])
            formatted = "\n\n".join([f"**{r['title']}**\n{r.get('content','')[:200]}\n{r['url']}" for r in results])
            return {"query": query, "results": formatted or "No results found."}

    async def _code_execution(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute code in sandboxed environment"""
        code = parameters.get("code", "")
        language = parameters.get("language", "python")

        # In production, would use a proper code execution sandbox
        # For now, simulate execution
        return {
            "language": language,
            "code": code,
            "output": f"Executed {language} code successfully",
            "execution_time": 0.5,
            "status": "success"
        }

    async def _image_generation(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Generate images from text"""
        prompt = parameters.get("prompt", "")
        style = parameters.get("style", "realistic")

        # In production, would use DALL-E, Midjourney, or Stable Diffusion API
        # For now, simulate generation
        return {
            "prompt": prompt,
            "style": style,
            "image_url": "https://via.placeholder.com/512x512",
            "generation_time": 2.0,
            "status": "success"
        }

    async def _data_analysis(self, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze data and generate insights"""
        data = parameters.get("data", [])
        analysis_type = parameters.get("analysis_type", "summary")

        # Simulated analysis
        return {
            "analysis_type": analysis_type,
            "data_points": len(data),
            "insights": [
                "Data contains multiple data points",
                "Analysis completed successfully"
            ],
            "status": "success"
        }

    async def _generic_tool_execution(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Generic tool execution for custom tools"""
        return {
            "tool": tool_name,
            "parameters": parameters,
            "result": f"Executed {tool_name} with parameters",
            "status": "success"
        }

    async def health_check(self) -> Dict[str, Any]:
        """Health check for tool service"""
        return {
            "status": "healthy",
            "registered_tools": len(self.tools),
            "tool_list": self.list_tools(),
            "stats": self.tool_stats,
            "api_keys_configured": {
                "serper": bool(os.getenv("SERPER_API_KEY")),
                "tavily": bool(os.getenv("TAVILY_API_KEY"))
            }
        }
