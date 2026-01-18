# Ralph - Autonomous Agent Loop for Claude Code

Ralph is an autonomous AI agent loop that runs Claude Code repeatedly until all PRD items are complete. Each iteration is a fresh Claude instance with clean context. Memory persists via git history, `progress.txt`, and `prd.json`.

Based on [Geoffrey Huntley's Ralph pattern](https://ghuntley.com/ralph/) and [snarktank/ralph](https://github.com/snarktank/ralph).

## Prerequisites

- [Claude Code CLI](https://github.com/anthropics/claude-code) installed and authenticated
- `jq` installed (`brew install jq` on macOS, `apt install jq` on Linux)
- A git repository for your project

## Quick Start

### 1. Create a PRD

Copy `prd.json.example` to `prd.json` and fill in your user stories:

```bash
cp scripts/ralph/prd.json.example scripts/ralph/prd.json
```

Edit `prd.json` with your actual feature requirements. Each story should be small enough to complete in one iteration.

### 2. Run Ralph

```bash
./scripts/ralph/ralph.sh [max_iterations] [timeout_seconds]
```

- `max_iterations`: Number of iterations (default: 10)
- `timeout_seconds`: Timeout per iteration in seconds (default: 600 = 10 minutes)

Examples:

```bash
./scripts/ralph/ralph.sh              # 10 iterations, 10min timeout each
./scripts/ralph/ralph.sh 5            # 5 iterations, 10min timeout each
./scripts/ralph/ralph.sh 20 900       # 20 iterations, 15min timeout each
```

## How It Works

Ralph will:

1. Create/checkout the feature branch (from PRD `branchName`)
2. Pick the highest priority story where `passes: false`
3. Implement that single story
4. Run quality checks (`bun run check`, `bun run build`)
5. Commit if checks pass
6. Update `prd.json` to mark story as `passes: true`
7. Append learnings to `progress.txt`
8. Repeat until all stories pass or max iterations reached

## Key Files

| File               | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| `ralph.sh`         | The bash loop that spawns fresh Claude instances  |
| `prompt.md`        | Instructions given to each Claude instance        |
| `prd.json`         | User stories with `passes` status (the task list) |
| `prd.json.example` | Example PRD format for reference                  |
| `progress.txt`     | Append-only learnings for future iterations       |

## Writing Good User Stories

### Story Size

Each story must be completable in ONE iteration (one context window). If a story is too big, it won't complete properly.

**Right-sized stories:**

- Add a database column and migration
- Add a UI component to an existing page
- Update a server action with new logic
- Add a filter dropdown to a list

**Too big (split these):**

- "Build the entire dashboard"
- "Add authentication"
- "Refactor the API"

### Story Ordering

Stories execute in priority order. Earlier stories must not depend on later ones.

**Correct order:**

1. Schema/database changes (migrations)
2. Server actions / backend logic
3. UI components that use the backend
4. Dashboard/summary views that aggregate data

### Acceptance Criteria

Each criterion must be verifiable:

**Good:**

- "Add `status` column to tasks table with default 'pending'"
- "Filter dropdown has options: All, Active, Completed"
- "bun run check passes"
- "bun run build passes"

**Bad:**

- "Works correctly"
- "Good UX"
- "Handles edge cases"

## Debugging

```bash
# See which stories are done
cat scripts/ralph/prd.json | jq '.userStories[] | {id, title, passes}'

# See learnings from previous iterations
cat scripts/ralph/progress.txt

# Check git history
git log --oneline -10
```

## Archiving

Ralph automatically archives previous runs when you start a new feature (different `branchName`). Archives are saved to `scripts/ralph/archive/YYYY-MM-DD-feature-name/`.
