"""
Tools and Agents module tests
"""

import pytest
from backend.tools.tool_registry import ToolRegistry
from backend.tools.agent_system import AgentSystem
from backend.tools.code_tool import CodeTool
from backend.tools.web_search_tool import WebSearchTool


@pytest.mark.asyncio
async def test_tool_registry():
    """Test tool registry"""
    registry = ToolRegistry()
    tools = registry.list_tools()
    assert isinstance(tools, list)


@pytest.mark.asyncio
async def test_code_tool():
    """Test code tool execution"""
    code_tool = CodeTool()
    result = await code_tool.execute({
        "code": "print('Hello, world!')",
        "language": "python"
    })
    assert result is not None


@pytest.mark.asyncio
async def test_web_search_tool():
    """Test web search tool"""
    web_search = WebSearchTool()
    result = await web_search.execute({
        "query": "Python programming"
    })
    assert result is not None


@pytest.mark.asyncio
async def test_agent_system_create():
    """Test creating an agent"""
    agent_system = AgentSystem()
    agent = agent_system.create_agent(
        agent_id="test_agent",
        name="Test Agent",
        role="assistant",
        tools=["code_tool", "web_search"]
    )
    assert agent is not None
    assert agent.name == "Test Agent"


@pytest.mark.asyncio
async def test_agent_system_execute():
    """Test executing an agent task"""
    agent_system = AgentSystem()
    agent_system.create_agent(
        agent_id="test_agent_2",
        name="Test Agent 2",
        role="assistant",
        tools=["code_tool"]
    )
    
    result = await agent_system.execute_task(
        agent_id="test_agent_2",
        task="Write a hello world function",
        context={}
    )
    assert result is not None
