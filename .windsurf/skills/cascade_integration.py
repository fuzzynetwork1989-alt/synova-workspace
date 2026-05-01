"""
SYNOVA SUPREME AUTOPILOT MODE - Windsurf/Cascade Integration Skills
Integration layer for synova_nexus_modeus production build engine with Windsurf/Cascade workflows.
"""

import os
import json
import asyncio
import subprocess
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum
from .synova_brain.synova_brain_v5 import SynovaBrainV5NexusEngine
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CascadeAction(Enum):
    """Windsurf/Cascade action types"""
    CREATE_FILE = "create_file"
    EDIT_FILE = "edit_file"
    MULTI_EDIT = "multi_edit"
    READ_FILE = "read_file"
    SEARCH_FILES = "search_files"
    RUN_COMMAND = "run_command"
    BASH_COMMAND = "bash_command"
    BROWSER_ACTION = "browser_action"
    CREATE_DIRECTORY = "create_directory"
    LIST_DIRECTORY = "list_directory"
    GREP_SEARCH = "grep_search"
    TODO_MANAGE = "todo_manage"
    MEMORY_MANAGE = "memory_manage"

@dataclass
class CascadeOperation:
    """Single Cascade operation"""
    action: CascadeAction
    file_path: str
    content: Optional[str] = None
    old_content: Optional[str] = None
    new_content: Optional[str] = None
    command: Optional[str] = None
    cwd: Optional[str] = None
    background: bool = False
    safe_to_auto_run: bool = False

class CascadeIntegration:
    """Windsurf/Cascade integration for SYNOVA NEXUS"""

    def __init__(self, workspace_root: str):
        self.workspace_root = workspace_root
        self.operation_queue: List[CascadeOperation] = []
        self.completed_operations: List[CascadeOperation] = []
        self.failed_operations: List[CascadeOperation] = []
        
        logger.info("SYNOVA NEXUS integration initialized")
    
    async def execute_build_plan(self, build_plan) -> List[CascadeOperation]:
        """Convert build plan to Cascade operations"""
        operations = []
        
        # Phase 1: Create directory structure
        folder_structure = build_plan.folder_structure.get("structure", {})
        operations.extend(self._create_directory_operations(folder_structure))
        
        # Phase 2: Generate source files
        for file_path, content in build_plan.source_code.items():
            operations.append(CascadeOperation(
                action=CascadeAction.CREATE_FILE,
                file_path=file_path,
                content=content
            ))
        
        # Phase 3: Create configuration files
        operations.extend(self._create_config_operations(build_plan))
        
        # Phase 4: Create test files
        operations.extend(self._create_test_operations(build_plan))
        
        # Phase 5: Create deployment files
        operations.extend(self._create_deployment_operations(build_plan))
        
        # Phase 6: Create documentation
        operations.extend(self._create_documentation_operations(build_plan))
        
        return operations
    
    async def execute_operations(self, operations: List[CascadeOperation]) -> bool:
        """Execute Cascade operations"""
        logger.info(f"Executing {len(operations)} Cascade operations...")
        
        for operation in operations:
            try:
                success = await self._execute_single_operation(operation)
                if success:
                    self.completed_operations.append(operation)
                else:
                    self.failed_operations.append(operation)
                    
            except Exception as e:
                logger.error(f"Operation failed: {operation.action} on {operation.file_path} - {str(e)}")
                self.failed_operations.append(operation)
        
        success_rate = len(self.completed_operations) / len(operations) if operations else 0
        logger.info(f"Cascade operations completed: {success_rate:.2%} success rate")
        
        return success_rate >= 0.9  # Consider successful if 90%+ operations succeed
    
    async def _execute_single_operation(self, operation: CascadeOperation) -> bool:
        """Execute a single Cascade operation"""
        if operation.action == CascadeAction.CREATE_FILE:
            return await self._create_file(operation)
        elif operation.action == CascadeAction.EDIT_FILE:
            return await self._edit_file(operation)
        elif operation.action == CascadeAction.MULTI_EDIT:
            return await self._multi_edit(operation)
        elif operation.action == CascadeAction.RUN_COMMAND:
            return await self._run_command(operation)
        elif operation.action == CascadeAction.CREATE_DIRECTORY:
            return await self._create_directory(operation)
        else:
            logger.warning(f"Unsupported operation: {operation.action}")
            return False
    
    async def _create_file(self, operation: CascadeOperation) -> bool:
        """Create file using Cascade"""
        try:
            # Ensure directory exists
            dir_path = os.path.dirname(operation.file_path)
            if dir_path and not os.path.exists(dir_path):
                await self._create_directory(CascadeOperation(
                    action=CascadeAction.CREATE_DIRECTORY,
                    file_path=dir_path
                ))
            
            # Create file with content
            with open(operation.file_path, 'w', encoding='utf-8') as f:
                f.write(operation.content or "")
            
            logger.info(f"Created file: {operation.file_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to create file {operation.file_path}: {str(e)}")
            return False
    
    async def _edit_file(self, operation: CascadeOperation) -> bool:
        """Edit file using Cascade"""
        try:
            # Read existing content
            with open(operation.file_path, 'r', encoding='utf-8') as f:
                existing_content = f.read()
            
            # Simple edit - replace old_content with new_content
            if operation.old_content and operation.old_content in existing_content:
                new_content = existing_content.replace(operation.old_content, operation.new_content or "")
            else:
                new_content = operation.new_content or existing_content
            
            # Write updated content
            with open(operation.file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            logger.info(f"Edited file: {operation.file_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to edit file {operation.file_path}: {str(e)}")
            return False
    
    async def _multi_edit(self, operation: CascadeOperation) -> bool:
        """Multi-edit file using Cascade"""
        try:
            # This would use the multi_edit tool with multiple edits
            # For now, implement as simple edit
            return await self._edit_file(operation)
            
        except Exception as e:
            logger.error(f"Failed to multi-edit file {operation.file_path}: {str(e)}")
            return False
    
    async def _run_command(self, operation: CascadeOperation) -> bool:
        """Run command using Cascade"""
        try:
            # Execute command
            result = subprocess.run(
                operation.command,
                shell=True,
                cwd=operation.cwd or self.workspace_root,
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                logger.info(f"Command succeeded: {operation.command}")
                return True
            else:
                logger.error(f"Command failed: {operation.command} - {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to run command {operation.command}: {str(e)}")
            return False
    
    async def _create_directory(self, operation: CascadeOperation) -> bool:
        """Create directory using Cascade"""
        try:
            os.makedirs(operation.file_path, exist_ok=True)
            logger.info(f"Created directory: {operation.file_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to create directory {operation.file_path}: {str(e)}")
            return False
    
    def _create_directory_operations(self, folder_structure: Dict[str, Any]) -> List[CascadeOperation]:
        """Create directory structure operations"""
        operations = []
        
        def add_dir(path):
            if path and not os.path.exists(path):
                operations.append(CascadeOperation(
                    action=CascadeAction.CREATE_DIRECTORY,
                    file_path=path
                ))
        
        # Add main directories
        if isinstance(folder_structure, dict):
            for dir_name, content in folder_structure.items():
                if isinstance(content, dict):
                    # Nested structure
                    add_dir(dir_name)
                    for sub_path in content.keys():
                        add_dir(os.path.join(dir_name, sub_path))
                else:
                    # Simple directory
                    add_dir(dir_name)
        
        return operations
    
    def _create_config_operations(self, build_plan) -> List[CascadeOperation]:
        """Create configuration file operations"""
        operations = []
        
        # Package.json
        operations.append(CascadeOperation(
            action=CascadeAction.CREATE_FILE,
            file_path="package.json",
            content=json.dumps({
                "name": "synova-app",
                "version": "1.0.0",
                "description": "SYNOVA SUPREME AUTOPILOT Generated Application",
                "scripts": {
                    "dev": "next dev",
                    "build": "next build",
                    "start": "next start",
                    "test": "jest",
                    "lint": "eslint . --fix",
                    "type-check": "tsc --noEmit"
                }
            }, indent=2)
        ))
        
        # Environment files
        env_vars = build_plan.environment_variables
        if env_vars:
            env_content = "# Environment Variables\n"
            for key, value in env_vars.items():
                env_content += f"{key}={value}\n"
            
            operations.append(CascadeOperation(
                action=CascadeAction.CREATE_FILE,
                file_path=".env.example",
                content=env_content
            ))
        
        return operations
    
    def _create_test_operations(self, build_plan) -> List[CascadeOperation]:
        """Create test file operations"""
        operations = []
        
        # Test configuration
        operations.append(CascadeOperation(
            action=CascadeAction.CREATE_FILE,
            file_path="jest.config.js",
            content="""module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};"""
        ))
        
        # Basic test file
        operations.append(CascadeOperation(
            action=CascadeAction.CREATE_FILE,
            file_path="tests/basic.test.ts",
            content="""import { render, screen } from '@testing-library/react';

describe('Basic Component', () => {
  it('renders without crashing', () => {
    render(<div>Hello World</div>);
  });
});"""
        ))
        
        return operations
    
    def _create_deployment_operations(self, build_plan) -> List[CascadeOperation]:
        """Create deployment file operations"""
        operations = []
        
        # Dockerfile
        docker_config = build_plan.docker_deployment
        if docker_config and "dockerfile" in docker_config:
            operations.append(CascadeOperation(
                action=CascadeAction.CREATE_FILE,
                file_path="Dockerfile",
                content=docker_config["dockerfile"]
            ))
        
        # Docker Compose
        if docker_config and "docker_compose" in docker_config:
            operations.append(CascadeOperation(
                action=CascadeAction.CREATE_FILE,
                file_path="docker-compose.yml",
                content=docker_config["docker_compose"]
            ))
        
        # Railway configuration
        operations.append(CascadeOperation(
            action=CascadeAction.CREATE_FILE,
            file_path="railway.json",
            content=json.dumps({
                "build": {
                    "builder": "NIXPACKAGES"
                },
                "deploy": {
                    "startCommand": "npm start",
                    "healthcheckPath": "/api/health"
                }
            }, indent=2)
        ))
        
        return operations
    
    def _create_documentation_operations(self, build_plan) -> List[CascadeOperation]:
        """Create documentation operations"""
        operations = []
        
        # README.md
        operations.append(CascadeOperation(
            action=CascadeAction.CREATE_FILE,
            file_path="README.md",
            content=f"""# {build_plan.product_definition.problem}

Generated by SYNOVA SUPREME AUTOPILOT MODE

## Description
{build_plan.product_definition.value_proposition}

## Features
- {build_plan.product_definition.jobs_to_be_done}
- {build_plan.product_definition.main_user_journeys}

## Technology Stack
{json.dumps(build_plan.architecture.stack_decision_table, indent=2)}

## Installation
```bash
{chr(10).join(build_plan.terminal_commands)}
```

## Development
```bash
npm run dev
```

## Deployment
Deployed with production-ready configuration.

## Support
For issues and questions, please refer to the documentation.
"""
        ))
        
        # API documentation
        operations.append(CascadeOperation(
            action=CascadeAction.CREATE_FILE,
            file_path="docs/api.md",
            content=f"""# API Documentation

## Endpoints

### Health Check
- `GET /api/health` - Service health status

### Main API
- Base URL: `/api`
- Authentication: JWT Bearer token
- Rate limiting: 100 requests per minute

## Schema
{json.dumps(build_plan.api_contracts, indent=2)}
"""
        ))
        
        return operations
    
    def get_operation_summary(self) -> Dict[str, Any]:
        """Get summary of all operations"""
        return {
            "total_operations": len(self.operation_queue),
            "completed_operations": len(self.completed_operations),
            "failed_operations": len(self.failed_operations),
            "success_rate": len(self.completed_operations) / len(self.operation_queue) if self.operation_queue else 0,
            "operation_types": {
                "files_created": len([op for op in self.completed_operations if op.action == CascadeAction.CREATE_FILE]),
                "files_edited": len([op for op in self.completed_operations if op.action == CascadeAction.EDIT_FILE]),
                "commands_run": len([op for op in self.completed_operations if op.action == CascadeAction.RUN_COMMAND]),
                "directories_created": len([op for op in self.completed_operations if op.action == CascadeAction.CREATE_DIRECTORY])
            }
        }
    
    async def validate_operations(self, operations: List[CascadeOperation]) -> Dict[str, Any]:
        """Validate operations before execution"""
        validation_results = {
            "valid_operations": [],
            "invalid_operations": [],
            "warnings": [],
            "file_conflicts": []
        }
        
        file_paths = []
        for op in operations:
            if op.file_path:
                if op.file_path in file_paths:
                    validation_results["file_conflicts"].append({
                        "file": op.file_path,
                        "conflict": "Duplicate file operation"
                    })
                else:
                    file_paths.append(op.file_path)
                    validation_results["valid_operations"].append(op)
        
        # Check for dangerous operations
        for op in operations:
            if op.command and any(danger in op.command.lower() for danger in ["rm -rf", "sudo rm", "format", "fdisk"]):
                validation_results["warnings"].append({
                    "operation": op,
                    "warning": "Potentially dangerous command"
                })
        
        return validation_results

# Factory function
def create_cascade_integration(workspace_root: str) -> CascadeIntegration:
    """Create CascadeIntegration instance"""
    return CascadeIntegration(workspace_root)

# Test function
async def test_cascade_integration():
    """Test Cascade integration"""
    integration = create_cascade_integration("./test-integration")
    
    # Create test operations
    test_operations = [
        CascadeOperation(
            action=CascadeAction.CREATE_FILE,
            file_path="test.txt",
            content="Hello from Cascade Integration!"
        ),
        CascadeOperation(
            action=CascadeAction.CREATE_DIRECTORY,
            file_path="test-dir"
        ),
        CascadeOperation(
            action=CascadeAction.RUN_COMMAND,
            command="echo 'Cascade test command'",
            cwd="./test-integration"
        )
    ]
    
    # Validate operations
    validation = await integration.validate_operations(test_operations)
    print(f"Validation Results: {validation}")
    
    # Execute operations
    success = await integration.execute_operations(test_operations)
    print(f"Execution Success: {success}")
    
    # Show summary
    summary = integration.get_operation_summary()
    print(f"Operation Summary: {summary}")

if __name__ == "__main__":
    asyncio.run(test_cascade_integration())
