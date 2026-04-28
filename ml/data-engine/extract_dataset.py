"""
Synova Training Dataset Extractor
Extracts code patterns and creates instruction-response pairs for fine-tuning
"""

import os
import json
from pathlib import Path
from typing import List, Dict, Any
import ast
import re

class DatasetExtractor:
    def __init__(self, workspace_root: str):
        self.workspace_root = Path(workspace_root)
        self.dataset = []
        
    def extract_from_file(self, file_path: Path) -> List[Dict[str, Any]]:
        """Extract training examples from a single file"""
        examples = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Determine file type and extract accordingly
            if file_path.suffix == '.py':
                examples.extend(self._extract_python_patterns(file_path, content))
            elif file_path.suffix == '.md':
                examples.extend(self._extract_documentation(file_path, content))
            elif file_path.suffix in ['.js', '.jsx', '.ts', '.tsx']:
                examples.extend(self._extract_javascript_patterns(file_path, content))
                
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            
        return examples
    
    def _extract_python_patterns(self, file_path: Path, content: str) -> List[Dict[str, Any]]:
        """Extract patterns from Python files"""
        examples = []
        
        try:
            tree = ast.parse(content)
            
            # Extract function patterns
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    examples.append(self._create_function_example(file_path, node, content))
                elif isinstance(node, ast.ClassDef):
                    examples.append(self._create_class_example(file_path, node, content))
                    
        except:
            # If AST parsing fails, use regex-based extraction
            examples.extend(self._extract_regex_patterns(file_path, content))
            
        return examples
    
    def _create_function_example(self, file_path: Path, node: ast.FunctionDef, content: str) -> Dict[str, Any]:
        """Create training example from function definition"""
        func_name = node.name
        docstring = ast.get_docstring(node)
        
        # Get function signature
        args = [arg.arg for arg in node.args.args]
        signature = f"{func_name}({', '.join(args)})"
        
        return {
            "instruction": f"Explain the purpose and implementation of the function '{func_name}' in the Synova codebase.",
            "input": f"File: {file_path.relative_to(self.workspace_root)}\nFunction signature: {signature}",
            "output": f"This function {docstring if docstring else 'performs a specific operation in the Synova system'}. It follows Synova's coding conventions and integrates with the broader architecture.",
            "category": "backend",
            "difficulty": "medium",
            "source_file": str(file_path.relative_to(self.workspace_root))
        }
    
    def _create_class_example(self, file_path: Path, node: ast.ClassDef, content: str) -> Dict[str, Any]:
        """Create training example from class definition"""
        class_name = node.name
        docstring = ast.get_docstring(node)
        methods = [n.name for n in node.body if isinstance(n, ast.FunctionDef)]
        
        return {
            "instruction": f"Describe the class '{class_name}' and its role in the Synova architecture.",
            "input": f"File: {file_path.relative_to(self.workspace_root)}\nMethods: {', '.join(methods)}",
            "output": f"The {class_name} class {docstring if docstring else 'is a core component of the Synova system'}. It encapsulates specific functionality and follows Synova's object-oriented design patterns.",
            "category": "architecture",
            "difficulty": "medium",
            "source_file": str(file_path.relative_to(self.workspace_root))
        }
    
    def _extract_documentation(self, file_path: Path, content: str) -> List[Dict[str, Any]]:
        """Extract examples from markdown documentation"""
        examples = []
        
        # Extract code blocks
        code_blocks = re.findall(r'```(\w+)?\n(.*?)```', content, re.DOTALL)
        
        for lang, code in code_blocks:
            examples.append({
                "instruction": f"Explain this {lang if lang else 'code'} snippet from Synova documentation.",
                "input": f"File: {file_path.relative_to(self.workspace_root)}\n```{lang}\n{code}\n```",
                "output": "This code demonstrates a Synova pattern or configuration. It follows best practices for the Synova ecosystem.",
                "category": "best_practices",
                "difficulty": "easy",
                "source_file": str(file_path.relative_to(self.workspace_root))
            })
            
        return examples
    
    def _extract_javascript_patterns(self, file_path: Path, content: str) -> List[Dict[str, Any]]:
        """Extract patterns from JavaScript/TypeScript files"""
        examples = []
        
        # Extract function definitions
        func_patterns = re.findall(r'(?:const|function|export)\s+(\w+)\s*(?:=\s*(?:async\s*)?\([^)]*\)|\([^)]*\))', content)
        
        for func_name in func_patterns:
            examples.append({
                "instruction": f"Describe the purpose of the function '{func_name}' in this Synova frontend component.",
                "input": f"File: {file_path.relative_to(self.workspace_root)}",
                "output": f"The {func_name} function is part of Synova's frontend architecture, handling specific UI or logic operations following React/Next.js best practices.",
                "category": "frontend",
                "difficulty": "medium",
                "source_file": str(file_path.relative_to(self.workspace_root))
            })
            
        return examples
    
    def _extract_regex_patterns(self, file_path: Path, content: str) -> List[Dict[str, Any]]:
        """Fallback regex-based pattern extraction"""
        examples = []
        
        # Extract imports
        imports = re.findall(r'^import\s+(.+)$', content, re.MULTILINE)
        for imp in imports:
            examples.append({
                "instruction": "What does this import statement indicate about the Synova architecture?",
                "input": f"File: {file_path.relative_to(self.workspace_root)}\nImport: {imp}",
                "output": "This import shows a dependency relationship in the Synova codebase, following modular design principles.",
                "category": "architecture",
                "difficulty": "easy",
                "source_file": str(file_path.relative_to(self.workspace_root))
            })
            
        return examples
    
    def extract_from_directory(self, directory: str, extensions: List[str] = None) -> None:
        """Extract examples from all files in a directory"""
        if extensions is None:
            extensions = ['.py', '.md', '.js', '.jsx', '.ts', '.tsx']
            
        dir_path = self.workspace_root / directory
        
        for file_path in dir_path.rglob('*'):
            if file_path.is_file() and file_path.suffix in extensions:
                examples = self.extract_from_file(file_path)
                self.dataset.extend(examples)
                print(f"Extracted {len(examples)} examples from {file_path}")
    
    def save_dataset(self, output_path: str) -> None:
        """Save dataset to JSONL file"""
        with open(output_path, 'w', encoding='utf-8') as f:
            for example in self.dataset:
                f.write(json.dumps(example) + '\n')
        print(f"Saved {len(self.dataset)} examples to {output_path}")
    
    def generate_synthetic_examples(self) -> None:
        """Generate synthetic training examples based on Synova patterns"""
        synthetic_examples = [
            {
                "instruction": "How should I implement JWT authentication in a Synova API endpoint?",
                "input": "",
                "output": "In Synova, JWT authentication is implemented using the middleware/auth.py module. Use the get_current_user dependency in your endpoint, and include the Authorization: Bearer <token> header in requests. The token is generated using the generate_token.py script.",
                "category": "authentication",
                "difficulty": "medium",
                "source_file": "synthetic"
            },
            {
                "instruction": "What is the recommended way to structure a new API router in Synova?",
                "input": "",
                "output": "Create a new file in apps/api/src/routers/ with an APIRouter instance. Define your endpoints with proper typing, error handling, and logging. Register the router in main.py with app.include_router(). Follow the patterns in existing routers like chat.py or agents.py.",
                "category": "api_design",
                "difficulty": "medium",
                "source_file": "synthetic"
            },
            {
                "instruction": "How do I add a new environment variable to the Synova API?",
                "input": "",
                "output": "Add the variable to .env.example with a descriptive name and placeholder value. Use os.getenv() in your code to retrieve it, with a default value if needed. For production, set the actual value in Railway/Vercel environment variables or GitHub Secrets.",
                "category": "infrastructure",
                "difficulty": "easy",
                "source_file": "synthetic"
            },
            {
                "instruction": "What is the Synova package structure and how should I use it?",
                "input": "",
                "output": "Synova uses a monorepo structure with packages/ containing shared modules (ai, memory, agent-runtime, etc.). Import from packages using absolute imports. Each package has src/ with __init__.py files for proper Python module structure. This enables code reuse across apps.",
                "category": "architecture",
                "difficulty": "medium",
                "source_file": "synthetic"
            },
            {
                "instruction": "How do I deploy the Synova API to Railway?",
                "input": "",
                "output": "Ensure you have a Dockerfile in apps/api/. Configure Railway to build from the Dockerfile. Set environment variables in Railway dashboard. The API will be accessible at a Railway-generated URL. Use the setup-github-secrets.ps1 script to configure GitHub Secrets for CI/CD integration.",
                "category": "deployment",
                "difficulty": "medium",
                "source_file": "synthetic"
            },
            {
                "instruction": "What are the core components of the Synova Brain system?",
                "input": "",
                "output": "The Synova Brain consists of: PeakBrain (orchestration), HierarchicalMemorySystem (memory management), AdvancedModelRouter (model selection), MultiAgentRuntime (agent execution), ProviderService (LLM abstraction), and various integrations (RAG, safety, billing). These work together to provide intelligent, safe AI capabilities.",
                "category": "architecture",
                "difficulty": "hard",
                "source_file": "synthetic"
            }
        ]
        
        self.dataset.extend(synthetic_examples)
        print(f"Added {len(synthetic_examples)} synthetic examples")

if __name__ == "__main__":
    workspace_root = r"c:\Users\McBuz\CascadeProjects\Synova AI Rebuild\synova-workspace"
    
    extractor = DatasetExtractor(workspace_root)
    
    # Extract from API source
    print("Extracting from API source...")
    extractor.extract_from_directory("apps/api/src")
    
    # Extract from packages
    print("Extracting from packages...")
    extractor.extract_from_directory("packages")
    
    # Generate synthetic examples
    print("Generating synthetic examples...")
    extractor.generate_synthetic_examples()
    
    # Save dataset
    output_path = os.path.join(workspace_root, "ml", "data-engine", "synova_dataset.jsonl")
    extractor.save_dataset(output_path)
    
    print(f"\nDataset creation complete!")
    print(f"Total examples: {len(extractor.dataset)}")
