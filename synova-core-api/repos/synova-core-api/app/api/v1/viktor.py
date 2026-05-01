"""
Synova AI - Viktor Engineering Automation API
Advanced automation and engineering capabilities
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from fastapi.responses import JSONResponse
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime
import asyncio

from app.core.viktor_engine import (
    viktor_engine, 
    AutomationType, 
    TaskPriority, 
    TaskStatus
)
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/viktor", tags=["viktor"])

class TaskRequest(BaseModel):
    type: str = Field(..., description="Task type")
    priority: str = Field(default="medium", description="Task priority")
    description: str = Field(..., description="Task description")
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Task parameters")

class TaskResponse(BaseModel):
    task_id: str
    status: str
    message: str

@router.post("/tasks/create", response_model=TaskResponse)
async def create_task(
    request: TaskRequest,
    current_user: User = Depends(get_current_user)
):
    """Create a new Viktor automation task"""
    try:
        # Validate task type
        try:
            task_type = AutomationType(request.type)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid task type: {request.type}. Valid types: {[t.value for t in AutomationType]}"
            )
        
        # Validate priority
        try:
            priority = TaskPriority(request.priority)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid priority: {request.priority}. Valid priorities: {[p.value for p in TaskPriority]}"
            )
        
        # Create task
        task_id = await viktor_engine.create_task(
            task_type=task_type,
            priority=priority,
            description=request.description,
            parameters=request.parameters
        )
        
        return TaskResponse(
            task_id=task_id,
            status="created",
            message=f"Task {task_id} created successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tasks/{task_id}")
async def get_task_status(
    task_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get task status by ID"""
    task_status = viktor_engine.get_task_status(task_id)
    
    if not task_status:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return task_status

@router.get("/tasks")
async def get_tasks_list(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Get list of all tasks with optional status filter"""
    try:
        status_filter = None
        if status:
            try:
                status_filter = TaskStatus(status)
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid status: {status}. Valid statuses: {[s.value for s in TaskStatus]}"
                )
        
        tasks = viktor_engine.get_tasks_list(status_filter)
        return {"tasks": tasks}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tasks/{task_id}/cancel")
async def cancel_task(
    task_id: str,
    current_user: User = Depends(get_current_user)
):
    """Cancel a running or pending task"""
    success = viktor_engine.cancel_task(task_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Task not found or cannot be cancelled")
    
    return {"message": f"Task {task_id} cancelled successfully"}

@router.get("/engine/status")
async def get_engine_status(current_user: User = Depends(get_current_user)):
    """Get Viktor engine status and capabilities"""
    return viktor_engine.get_engine_status()

@router.get("/capabilities")
async def get_automation_capabilities(current_user: User = Depends(get_current_user)):
    """Get available automation capabilities"""
    return {
        "automation_types": [
            {
                "type": t.value,
                "description": t.value.replace("_", " ").title(),
                "enabled": viktor_engine.automation_capabilities.get(t.value, False)
            }
            for t in AutomationType
        ],
        "priorities": [p.value for p in TaskPriority],
        "statuses": [s.value for s in TaskStatus]
    }

@router.post("/automation/code-generation")
async def create_code_generation_task(
    request: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create a code generation task"""
    task_request = TaskRequest(
        type="code_generation",
        priority=request.get("priority", "medium"),
        description=request.get("description", "Generate code"),
        parameters={
            "language": request.get("language", "javascript"),
            "framework": request.get("framework"),
            "requirements": request.get("requirements", []),
            "style": request.get("style", "modern")
        }
    )
    
    return await create_task(task_request, current_user)

@router.post("/automation/workflow-automation")
async def create_workflow_automation_task(
    request: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create a workflow automation task"""
    task_request = TaskRequest(
        type="workflow_automation",
        priority=request.get("priority", "medium"),
        description=request.get("description", "Automate workflow"),
        parameters={
            "workflow_name": request.get("workflow_name"),
            "steps": request.get("steps", []),
            "triggers": request.get("triggers", []),
            "conditions": request.get("conditions", [])
        }
    )
    
    return await create_task(task_request, current_user)

@router.post("/automation/system-deployment")
async def create_system_deployment_task(
    request: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create a system deployment task"""
    task_request = TaskRequest(
        type="system_deployment",
        priority=request.get("priority", "high"),
        description=request.get("description", "Deploy system"),
        parameters={
            "environment": request.get("environment", "production"),
            "services": request.get("services", []),
            "configuration": request.get("configuration", {}),
            "rollback_plan": request.get("rollback_plan", True)
        }
    )
    
    return await create_task(task_request, current_user)

@router.post("/automation/testing-automation")
async def create_testing_automation_task(
    request: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create a testing automation task"""
    task_request = TaskRequest(
        type="testing_automation",
        priority=request.get("priority", "medium"),
        description=request.get("description", "Automate testing"),
        parameters={
            "test_types": request.get("test_types", ["unit", "integration"]),
            "coverage_target": request.get("coverage_target", 0.8),
            "test_framework": request.get("test_framework"),
            "mock_services": request.get("mock_services", [])
        }
    )
    
    return await create_task(task_request, current_user)

@router.post("/automation/monitoring-setup")
async def create_monitoring_setup_task(
    request: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create a monitoring setup task"""
    task_request = TaskRequest(
        type="monitoring_setup",
        priority=request.get("priority", "medium"),
        description=request.get("description", "Set up monitoring"),
        parameters={
            "metrics": request.get("metrics", []),
            "alerts": request.get("alerts", []),
            "dashboard_config": request.get("dashboard_config", {}),
            "notification_channels": request.get("notification_channels", [])
        }
    )
    
    return await create_task(task_request, current_user)

@router.post("/automation/security-scanning")
async def create_security_scanning_task(
    request: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create a security scanning task"""
    task_request = TaskRequest(
        type="security_scanning",
        priority=request.get("priority", "high"),
        description=request.get("description", "Security scan"),
        parameters={
            "scan_types": request.get("scan_types", ["vulnerability", "dependency"]),
            "target": request.get("target"),
            "severity_threshold": request.get("severity_threshold", "medium"),
            "remediation": request.get("remediation", True)
        }
    )
    
    return await create_task(task_request, current_user)

@router.post("/automation/performance-optimization")
async def create_performance_optimization_task(
    request: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create a performance optimization task"""
    task_request = TaskRequest(
        type="performance_optimization",
        priority=request.get("priority", "medium"),
        description=request.get("description", "Optimize performance"),
        parameters={
            "optimization_areas": request.get("optimization_areas", []),
            "target_improvement": request.get("target_improvement", 0.2),
            "benchmark": request.get("benchmark", True),
            "analysis_depth": request.get("analysis_depth", "deep")
        }
    )
    
    return await create_task(task_request, current_user)

@router.post("/automation/documentation-generation")
async def create_documentation_generation_task(
    request: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Create a documentation generation task"""
    task_request = TaskRequest(
        type="documentation_generation",
        priority=request.get("priority", "low"),
        description=request.get("description", "Generate documentation"),
        parameters={
            "documentation_type": request.get("documentation_type", "api"),
            "target_audience": request.get("target_audience", "developers"),
            "include_examples": request.get("include_examples", True),
            "format": request.get("format", "markdown")
        }
    )
    
    return await create_task(task_request, current_user)

@router.get("/analytics")
async def get_automation_analytics(current_user: User = Depends(get_current_user)):
    """Get automation analytics and insights"""
    engine_status = viktor_engine.get_engine_status()
    
    # Calculate analytics
    total_tasks = engine_status["tasks"]["total"]
    completed_tasks = engine_status["tasks"]["completed"]
    failed_tasks = engine_status["tasks"]["failed"]
    
    success_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    failure_rate = (failed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    return {
        "analytics": {
            "total_tasks": total_tasks,
            "success_rate": round(success_rate, 2),
            "failure_rate": round(failure_rate, 2),
            "current_load": engine_status["engine"]["current_load"],
            "engine_uptime": engine_status["engine"]["uptime"],
            "tasks_completed": engine_status["engine"]["tasks_completed"],
            "tasks_failed": engine_status["engine"]["tasks_failed"]
        },
        "insights": {
            "performance": "Excellent" if success_rate > 90 else "Good" if success_rate > 75 else "Needs Improvement",
            "load_status": "Optimal" if engine_status["engine"]["current_load"] < 5 else "High" if engine_status["engine"]["current_load"] < 8 else "Critical",
            "recommendations": [
                "Consider increasing concurrent task limit" if engine_status["engine"]["current_load"] >= 8 else None,
                "Monitor failed tasks for patterns" if failure_rate > 10 else None,
                "Engine performance is optimal" if success_rate > 90 and engine_status["engine"]["current_load"] < 5 else None
            ]
        }
    }
