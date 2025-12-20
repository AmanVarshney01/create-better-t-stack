# Contributing to Better-T-Stack

Thank you for your interest in contributing to Better-T-Stack! This document provides guidelines and setup instructions for contributors.

> **⚠️ Important**: Before starting work on any new features or major changes, please open an issue first to discuss your proposal and get approval. We don't want you to waste time on work that might not align with the project's direction or get merged.

## Project Structure

This repository is organized as a monorepo containing:

- **CLI**: [`apps/cli`](apps/cli) - The scaffolding CLI tool (`create-better-t-stack`)
- **Documentation**: [`apps/web`](apps/web) - Official website and documentation

## Development Setup

### Prerequisites

- Node.js (lts)
- Bun (recommended)
- Git

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/AmanVarshney01/create-better-t-stack.git
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
   bun dev
   ```

   This runs tsdown build in watch mode, automatically rebuilding on changes.

4. **Test the CLI**
   Now go to anywhere else in your system (maybe like a test folder) and run:
   ```bash
   create-better-t-stack
   ```
   This will run the locally installed CLI.

### Web Development

1. **Install dependencies**

   ```bash
   # from repo root
   bun i
   ```

2. **Setup backend**

   ```bash
   cd packages/backend
   bun dev:setup  # you can choose local development too in prompts
   ```

3. **Configure environment**
   Copy the Convex URL from `packages/backend/.env.local` to `apps/web/.env`:

   ```
   NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210/
   ```

4. **Set GitHub tokens**
   Now run `bun dev` in the root. It will complain about GitHub token, so run this in `packages/backend`:

   ```bash
   npx convex env set GITHUB_ACCESS_TOKEN=xxxxx
   npx convex env set GITHUB_WEBHOOK_SECRET=xxxxx
   ```

5. **Start the documentation website**
   ```bash
   bun dev
   ```
   This starts the Next.js development server for the documentation site.

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

5. **Test and format your changes** (see Testing section below)

6. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat(web): add your feature description"
   # or
   git commit -m "fix(cli): fix your bug description"
   ```

7. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Link to the related issue
   - Describe your changes

### Testing

**Before committing, make sure to test your changes:**

```bash
# For CLI changes
cd apps/cli
bun dev
bun run test

# Format files
bun run format
```

- **Manual testing**: Test your changes manually to ensure everything works as expected
- For CLI changes: Test with different configurations and options
- For web changes: Ensure the site builds and displays correctly

## Commit Conventions

Use conventional commit messages with the appropriate scope:

- `feat(cli): add new CLI feature`
- `fix(cli): fix CLI bug`
- `feat(web): add new web feature`
- `fix(web): fix web bug`
- `chore(web): update dependencies`
- `docs: update documentation`

## Getting Help

- Open an issue for bugs or feature requests
- Join discussions for questions or ideas
- Check existing issues and PRs for similar work
- Join our [Discord](https://discord.gg/ZYsbjpDaM5) if you have any problems

## License

By contributing to Better-T-Stack, you agree that your contributions will be licensed under the MIT License.
