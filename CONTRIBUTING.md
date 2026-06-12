# Contributing to Synova Workspace

Thank you for your interest in contributing to the Synova Workspace! This document provides guidelines and instructions for contributing to our project.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Docker** and **Docker Compose**
- **Git**
- **pnpm** (recommended) or npm

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/synova-workspace.git
   cd synova-workspace
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/fuzzynetwork1989-alt/synova-workspace.git
   ```
4. **Install dependencies**:
   ```bash
   ./scripts/install-all.sh
   ```
5. **Start the development environment**:
   ```bash
   docker-compose up -d
   ```

## Development Workflow

### Creating a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/your-bug-fix
```

### Code Style & Standards

We maintain consistent code quality through automated tooling:

- **JavaScript/TypeScript**: ESLint and Prettier are configured. Run `npm run lint` and `npm run format`
- **Python**: Follow PEP 8 standards. Use `black` for formatting and `pylint` for linting
- **Commits**: Use conventional commits format: `type(scope): description`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
  - Example: `feat(core-api): add health check endpoint`

### Testing

Before submitting a pull request, ensure all tests pass:

```bash
# Run tests for a specific package
cd packages/your-package
npm test

# Or run all tests
npm run test:all
```

## Submitting Changes

### Pull Request Process

1. **Update your branch** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. **Create a Pull Request** on GitHub with:
   - Clear title describing the changes
   - Detailed description of what was changed and why
   - Reference to any related issues (e.g., "Closes #123")
   - Screenshots or demos if applicable

### PR Requirements

- All tests must pass
- Code must follow project style guidelines
- Documentation must be updated if needed
- At least one maintainer approval is required

## Reporting Issues

### Bug Reports

When reporting a bug, please include:

- Clear, descriptive title
- Detailed description of the issue
- Steps to reproduce the problem
- Expected behavior
- Actual behavior
- Environment information (OS, Node version, Python version, etc.)
- Screenshots or error logs if applicable

### Feature Requests

When suggesting a feature, please include:

- Clear, descriptive title
- Detailed description of the proposed feature
- Use cases and benefits
- Possible implementation approach (optional)
- Examples or mockups if applicable

## Documentation

We value clear documentation. If you're adding a new feature:

1. Update relevant README files
2. Add JSDoc/docstring comments to code
3. Update the documentation in `/docs` if needed
4. Add examples if applicable

## Project Structure

Understanding the project structure helps with contributions:

- **`/apps`**: Application packages (web, mobile, desktop, api)
- **`/packages`**: Shared packages and utilities
- **`/synova-*`**: Core services (brain, core-api, ui-system, etc.)
- **`/docs`**: Documentation
- **`/scripts`**: Utility scripts
- **`/tests`**: Test files
- **`/infra`**: Infrastructure configuration
- **`/monitoring`**: Monitoring and observability setup

## Commit Guidelines

We follow conventional commits for clear, semantic commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

```
feat(core-api): add websocket support for real-time updates
fix(ui-system): resolve theme toggle button alignment issue
docs(readme): update installation instructions
refactor(packages): improve error handling in logger utility
```

## Review Process

1. **Automated Checks**: CI/CD pipeline runs linting, testing, and builds
2. **Code Review**: Maintainers review for code quality, architecture, and adherence to standards
3. **Feedback**: Constructive feedback will be provided if changes are needed
4. **Approval**: Once approved, your PR will be merged

## Community & Support

- **Discussions**: Use GitHub Discussions for questions and ideas
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discord**: Join our community server for real-time chat
- **Documentation**: Check `/docs` for comprehensive guides

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:

- Project README
- Release notes
- Contributors list

Thank you for making Synova Workspace better! 🚀
