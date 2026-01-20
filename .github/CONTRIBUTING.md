# Contributing to Better Fullstack

Thank you for your interest in contributing to Better Fullstack! This document provides guidelines and setup instructions for contributors.

> **Important**: Before starting work on any new features or major changes, please open an issue first to discuss your proposal and get approval.

## Project Structure

This repository is organized as a monorepo containing:

- **CLI**: [`apps/cli`](../apps/cli) - The scaffolding CLI tool (`create-better-fullstack`)
- **Website**: [`apps/web`](../apps/web) - Official website

## Development Setup

### Prerequisites

- Node.js (LTS)
- Bun (recommended)
- Git

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Marve10s/Better-Fullstack.git
   cd Better-Fullstack
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

### CLI Development

1. **Start development server**

   ```bash
   bun dev:cli
   ```

   This runs tsdown build in watch mode, automatically rebuilding on changes.

2. **Link the CLI globally** (optional, for testing anywhere in your system)

   ```bash
   cd apps/cli
   bun link
   ```

   Now you can use `create-better-fullstack` from anywhere in your system.

3. **Test the CLI**
   ```bash
   create-better-fullstack
   ```

### Web Development

1. **Start the website**
   ```bash
   bun dev:web
   ```

## Contribution Guidelines

### Standard Contribution Steps

1. **Create an issue** (if one doesn't exist)
   - Describe the bug or feature request
   - Include steps to reproduce (for bugs)
   - Discuss the proposed solution

2. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally

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
   # Lint and format files
   bun run check
   ```

6. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   # or
   git commit -m "fix: fix your bug description"
   ```

7. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Link to the related issue
   - Describe your changes

## Commit Conventions

Use conventional commit messages:

- `feat: add new feature`
- `fix: fix bug`
- `docs: update documentation`
- `chore: update dependencies`

## License

By contributing to Better Fullstack, you agree that your contributions will be licensed under the MIT License.
