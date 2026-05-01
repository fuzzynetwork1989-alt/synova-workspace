# Synova Training Dataset Structure

## Purpose
Create a Synova-specific fine-tuning dataset that teaches the model:
- Synova architecture patterns
- Code conventions and best practices
- API structure and endpoints
- Authentication and security patterns
- Deployment and infrastructure patterns

## Dataset Format (Instruction Tuning)

### JSONL Format
```json
{
  "instruction": "User request/question",
  "input": "Optional context or code snippet",
  "output": "Expected response/code",
  "category": "category_name",
  "difficulty": "easy|medium|hard"
}
```

### Categories

1. **architecture** - System design, component relationships
2. **api_design** - Endpoint design, routing, REST patterns
3. **authentication** - JWT, RBAC, security patterns
4. **database** - Schema design, migrations, queries
5. **deployment** - Docker, Railway, Vercel, CI/CD
6. **debugging** - Common issues, error patterns
7. **frontend** - Next.js, React, UI patterns
8. **backend** - FastAPI, Python, async patterns
9. **infrastructure** - Redis, PostgreSQL, monitoring
10. **best_practices** - Code quality, testing, validation

## Data Sources

### Code Files
- `apps/api/src/` - API implementation
- `packages/` - Shared packages
- `apps/web/` - Frontend code (if exists)
- `infra/` - Infrastructure as code

### Documentation
- `docs/` - Architecture docs
- `README.md` files
- Setup guides
- API documentation

### Configuration
- `.env.example` files
- Docker files
- CI/CD configs
- Deployment configs

## Extraction Strategy

### Phase 1: Code Pattern Extraction
- Extract function signatures and patterns
- Identify common architectural patterns
- Document import conventions
- Capture error handling patterns

### Phase 2: Documentation Extraction
- Extract architectural decisions
- Capture best practices
- Document deployment procedures
- Extract troubleshooting guides

### Phase 3: Synthetic Data Generation
- Create question-answer pairs from code
- Generate debugging scenarios
- Create architecture design questions
- Generate code completion examples

## Quality Criteria

1. **Accuracy** - All code must be syntactically correct
2. **Relevance** - Must be Synova-specific
3. **Diversity** - Cover all categories
4. **Clarity** - Instructions must be clear
5. **Completeness** - Answers must be complete

## Target Dataset Size
- Minimum: 1,000 examples
- Target: 5,000 examples
- Ideal: 10,000+ examples

## Next Steps
1. Extract code patterns from `apps/api/src/`
2. Extract patterns from `packages/`
3. Create instruction-response pairs
4. Validate and clean data
5. Export in JSONL format
