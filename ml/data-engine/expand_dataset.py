"""
Synova Dataset Expander
Generates additional synthetic training examples to reach target dataset size
"""

import json
import random
from pathlib import Path

class DatasetExpander:
    def __init__(self, dataset_path: str):
        self.dataset_path = Path(dataset_path)
        self.examples = []
        self.load_existing()
        
    def load_existing(self):
        """Load existing dataset"""
        if self.dataset_path.exists():
            with open(self.dataset_path, 'r', encoding='utf-8') as f:
                for line in f:
                    self.examples.append(json.loads(line))
        print(f"Loaded {len(self.examples)} existing examples")
    
    def generate_additional_examples(self, target_count: int = 5000):
        """Generate synthetic examples to reach target count"""
        current_count = len(self.examples)
        needed = target_count - current_count
        
        if needed <= 0:
            print(f"Dataset already has {current_count} examples (target: {target_count})")
            return
        
        print(f"Generating {needed} additional examples...")
        
        templates = self._get_example_templates()
        
        for i in range(needed):
            template = random.choice(templates)
            example = self._generate_from_template(template, i)
            self.examples.append(example)
            
            if (i + 1) % 1000 == 0:
                print(f"Generated {i + 1}/{needed} examples...")
        
        print(f"Generated {needed} examples. Total: {len(self.examples)}")
    
    def _get_example_templates(self) -> list:
        """Get templates for synthetic example generation"""
        return [
            # Architecture patterns
            {
                "instruction": "How should I structure a new Synova package?",
                "category": "architecture",
                "difficulty": "medium",
                "output_template": "Create a new directory in packages/ with src/ subdirectory. Add __init__.py files for proper Python module structure. Follow the pattern of existing packages like ai/ or memory/. Import using absolute imports from packages."
            },
            {
                "instruction": "What is the purpose of the {component} in Synova?",
                "category": "architecture",
                "difficulty": "medium",
                "output_template": "The {component} is a core component of the Synova architecture. It handles specific functionality and integrates with other components through well-defined interfaces. Follow the established patterns when extending or modifying it."
            },
            # API design
            {
                "instruction": "How do I add a new endpoint to the Synova API?",
                "category": "api_design",
                "difficulty": "easy",
                "output_template": "Add the endpoint to the appropriate router in apps/api/src/routers/. Use FastAPI decorators with proper typing. Include error handling, logging, and authentication where needed. Register the router in main.py if it's a new router."
            },
            {
                "instruction": "What are the best practices for API response design in Synova?",
                "category": "api_design",
                "difficulty": "medium",
                "output_template": "Use consistent response structures with status, data, and error fields. Include HTTP status codes appropriately. Add metadata for pagination, filtering, and sorting. Document responses with OpenAPI/Swagger annotations."
            },
            # Authentication
            {
                "instruction": "How do I implement role-based access control (RBAC) in Synova?",
                "category": "authentication",
                "difficulty": "hard",
                "output_template": "Use the get_current_user dependency to extract user info. Check user roles before allowing access to protected endpoints. Define roles in the user model and enforce permissions in middleware or endpoint logic. Log access attempts for audit trails."
            },
            {
                "instruction": "What is the JWT token format used in Synova?",
                "category": "authentication",
                "difficulty": "medium",
                "output_template": "Synova uses JWT tokens with HS256 algorithm. Tokens contain user_id, tenant_id, email, role, and expiration. Generate tokens using the generate_token.py script. Validate tokens using the middleware/auth.py module."
            },
            # Database
            {
                "instruction": "How do I create a database migration in Synova?",
                "category": "database",
                "difficulty": "medium",
                "output_template": "Use Alembic for migrations. Create a new migration file with alembic revision. Define the schema changes in the upgrade() and downgrade() functions. Test migrations locally before deploying. Apply migrations with alembic upgrade head."
            },
            {
                "instruction": "What is the database schema pattern for Synova?",
                "category": "database",
                "difficulty": "medium",
                "output_template": "Synova uses PostgreSQL with a multi-tenant schema. Tables include users, tenants, sessions, usage_logs, and feature-specific tables. Use foreign keys for relationships. Add indexes for frequently queried columns. Include created_at and updated_at timestamps."
            },
            # Deployment
            {
                "instruction": "How do I deploy Synova to Railway?",
                "category": "deployment",
                "difficulty": "medium",
                "output_template": "Ensure Dockerfile exists in the app directory. Connect Railway to the GitHub repository. Configure build settings and environment variables. Deploy on push to main branch. Monitor logs in Railway dashboard. Use GitHub Secrets for sensitive data."
            },
            {
                "instruction": "What is the CI/CD pipeline for Synova?",
                "category": "deployment",
                "difficulty": "medium",
                "output_template": "Synova uses GitHub Actions for CI/CD. Pipelines run tests, lint, and build on push. Deployment to Railway/Vercel happens on main branch. Use the setup-github-secrets scripts to configure secrets. Monitor pipeline status in GitHub Actions tab."
            },
            # Debugging
            {
                "instruction": "How do I debug a Synova API endpoint?",
                "category": "debugging",
                "difficulty": "easy",
                "output_template": "Use structlog for structured logging. Check logs in the terminal or Railway dashboard. Use the /health endpoint for basic diagnostics. Add debug logging with log.debug(). Use breakpoints in your IDE for local debugging."
            },
            {
                "instruction": "What are common errors in Synova and how do I fix them?",
                "category": "debugging",
                "difficulty": "medium",
                "output_template": "Common errors include import errors (check PYTHONPATH), database connection issues (check credentials), and port conflicts (change APP_PORT). Check logs for error details. Use the troubleshooting guides in docs/. Ensure all dependencies are installed."
            },
            # Frontend
            {
                "instruction": "How do I create a new page in the Synova frontend?",
                "category": "frontend",
                "difficulty": "easy",
                "output_template": "Create a new file in the pages/ or app/ directory depending on routing. Use Next.js components with proper TypeScript typing. Follow the UI component patterns. Add navigation links in the appropriate layout. Test responsive design."
            },
            {
                "instruction": "What UI component library does Synova use?",
                "category": "frontend",
                "difficulty": "easy",
                "output_template": "Synova uses modern React/Next.js with utility-first styling. Components follow atomic design principles. Use shadcn/ui or similar component libraries. Ensure accessibility with proper ARIA labels. Test across browsers and devices."
            },
            # Backend
            {
                "instruction": "How do I handle async operations in Synova?",
                "category": "backend",
                "difficulty": "medium",
                "output_template": "Use async/await for all I/O operations. Define async endpoints with async def. Use asyncio for concurrent operations. Handle exceptions properly in async contexts. Use FastAPI's async capabilities for better performance."
            },
            {
                "instruction": "What is the error handling pattern in Synova?",
                "category": "backend",
                "difficulty": "medium",
                "output_template": "Use try/except blocks with specific exception types. Log errors with structlog. Return appropriate HTTP status codes. Include error details in responses for debugging. Use HTTPException for FastAPI errors."
            },
            # Infrastructure
            {
                "instruction": "How do I configure Redis for Synova?",
                "category": "infrastructure",
                "difficulty": "medium",
                "output_template": "Set REDIS_URL in .env or environment variables. Use Redis for caching, sessions, and rate limiting. Initialize Redis client in startup events. Handle connection failures gracefully. Monitor Redis performance metrics."
            },
            {
                "instruction": "What monitoring does Synova use?",
                "category": "infrastructure",
                "difficulty": "medium",
                "output_template": "Synova uses structlog for logging, Sentry for error tracking, and custom metrics for performance. Configure SENTRY_DSN for error reporting. Use the observability package for metrics. Set up alerts for critical failures."
            },
            # Best practices
            {
                "instruction": "What are the code quality standards for Synova?",
                "category": "best_practices",
                "difficulty": "medium",
                "output_template": "Follow PEP 8 for Python code. Use type hints for function signatures. Write docstrings for complex functions. Keep functions focused and small. Use meaningful variable names. Run linters and formatters before committing."
            },
            {
                "instruction": "How do I write tests for Synova?",
                "category": "best_practices",
                "difficulty": "medium",
                "output_template": "Use pytest for testing. Write unit tests for individual functions. Write integration tests for API endpoints. Mock external dependencies. Aim for high test coverage. Run tests in CI/CD pipeline. Use fixtures for common test data."
            }
        ]
    
    def _generate_from_template(self, template: dict, index: int) -> dict:
        """Generate an example from a template"""
        components = ["PeakBrain", "HierarchicalMemorySystem", "ProviderService", "RAGService", 
                      "MultiAgentRuntime", "BrainGovernance", "BillingService", "SafetyService"]
        
        instruction = template["instruction"]
        if "{component}" in instruction:
            instruction = instruction.replace("{component}", random.choice(components))
        
        return {
            "instruction": instruction,
            "input": "",
            "output": template["output_template"],
            "category": template["category"],
            "difficulty": template["difficulty"],
            "source_file": f"synthetic_{index}"
        }
    
    def save_dataset(self, output_path: str = None):
        """Save expanded dataset"""
        if output_path is None:
            output_path = self.dataset_path
        
        with open(output_path, 'w', encoding='utf-8') as f:
            for example in self.examples:
                f.write(json.dumps(example) + '\n')
        print(f"Saved {len(self.examples)} examples to {output_path}")
    
    def print_statistics(self):
        """Print dataset statistics"""
        categories = {}
        difficulties = {}
        
        for example in self.examples:
            cat = example.get("category", "unknown")
            diff = example.get("difficulty", "unknown")
            
            categories[cat] = categories.get(cat, 0) + 1
            difficulties[diff] = difficulties.get(diff, 0) + 1
        
        print("\n=== Dataset Statistics ===")
        print(f"Total examples: {len(self.examples)}")
        print("\nBy Category:")
        for cat, count in sorted(categories.items()):
            print(f"  {cat}: {count}")
        print("\nBy Difficulty:")
        for diff, count in sorted(difficulties.items()):
            print(f"  {diff}: {count}")

if __name__ == "__main__":
    workspace_root = r"c:\Users\McBuz\CascadeProjects\Synova AI Rebuild\synova-workspace"
    dataset_path = f"{workspace_root}/ml/data-engine/synova_dataset.jsonl"
    
    expander = DatasetExpander(dataset_path)
    expander.generate_additional_examples(target_count=5000)
    expander.save_dataset()
    expander.print_statistics()
