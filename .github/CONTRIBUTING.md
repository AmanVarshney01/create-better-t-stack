# Contributing to Better-T-Stack

Thank you for your interest in contributing to Better-T-Stack! This document provides guidelines and setup instructions for contributors.

## Project Structure

This repository is organized as a monorepo containing:

- **CLI**: [`apps/cli`](apps/cli) - The scaffolding CLI tool (`create-better-t-stack`)
- **Documentation**: [`apps/web`](apps/web) - Official website and documentation

## Development Setup

### Prerequisites

- Node.js 20+ 
- Bun (recommended)
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/better-t-stack/create-better-t-stack.git
   cd create-better-t-stack
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

### CLI Development

1. **Navigate to CLI directory**
   ```bash
   cd apps/cli
   ```

2. **Link the CLI globally** (optional, for testing anywhere in your system)
   ```bash
   bun link
   ```
   Now you can use `create-better-t-stack` from anywhere in your system.

3. **Start development server**
   ```bash
   bun dev:cli
   ```
   This runs the CLI in watch mode, automatically rebuilding on changes.

### Web Development

1. **Start the documentation website**
   ```bash
   bun dev:web
   ```
   This starts the Next.js development server for the documentation site.

## Contribution Guidelines

### Before You Start

**Please ask before working on any new features!** We don't want to waste your time on features that might not align with the project's direction. Open an issue or discussion first to discuss your proposed changes.

### Standard Contribution Steps

1. **Create an issue** (if one doesn't exist)
   - Describe the bug or feature request
   - Include steps to reproduce (for bugs)
   - Discuss the proposed solution

2. **Fork the repository**

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make your changes**
   - Follow the existing code style
   - Update documentation as needed

5. **Test and format your changes**
   ```bash
   # For CLI changes
   cd apps/cli
   bun dev:cli
   
   # For web changes
   bun dev:web
   
   # Format files
   bun run format
   
   # Run type checks
   bun check
   ```

6. **Add changeset** (for CLI-related changes)
   ```bash
   bunx changeset select create-better-t-stack
   # Choose 'patch' for small fixes, 'minor' for features
   # Never choose 'major'
   ```

7. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(web): add your feature description"
   # or
   git commit -m "fix(cli): fix your bug description"
   ```

8. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Create a Pull Request**
   - Link to the related issue
   - Describe your changes

### Testing

- **Manual testing**: Test your changes manually to ensure everything works as expected
- For CLI changes: Test with different configurations and options
- For web changes: Ensure the site builds and displays correctly

## Getting Help

- Open an issue for bugs or feature requests
- Join discussions for questions or ideas
- Check existing issues and PRs for similar work
- Join our [Discord](https://discord.gg/ZYsbjpDaM5) if you have any problems

## License

By contributing to Better-T-Stack, you agree that your contributions will be licensed under the MIT License. 