#!/usr/bin/env bash

# ============================================
# Ralphy - Autonomous AI Coding Loop
# Supports Claude Code, OpenCode, Codex, Cursor, Qwen-Code and Factory Droid
# Runs until PRD is complete
# ============================================

set -euo pipefail

# ============================================
# CONFIGURATION & DEFAULTS
# ============================================

VERSION="4.0.0"

# Ralphy config directory
RALPHY_DIR=".ralphy"
PROGRESS_FILE="$RALPHY_DIR/progress.txt"
CONFIG_FILE="$RALPHY_DIR/config.yaml"
SINGLE_TASK=""
INIT_MODE=false
SHOW_CONFIG=false
ADD_RULE=""
AUTO_COMMIT=true

# Runtime options
SKIP_TESTS=false
SKIP_LINT=false
AI_ENGINE="claude"  # claude, opencode, cursor, codex, qwen, or droid
DRY_RUN=false
MAX_ITERATIONS=0  # 0 = unlimited
MAX_RETRIES=3
RETRY_DELAY=5
VERBOSE=false

# Git branch options
BRANCH_PER_TASK=false
CREATE_PR=false
BASE_BRANCH=""
PR_DRAFT=false

# Parallel execution
PARALLEL=false
MAX_PARALLEL=3

# PRD source options
PRD_SOURCE="markdown"  # markdown, yaml, github
PRD_FILE="PRD.md"
GITHUB_REPO=""
GITHUB_LABEL=""

# Colors (detect if terminal supports colors)
if [[ -t 1 ]] && command -v tput &>/dev/null && [[ $(tput colors 2>/dev/null || echo 0) -ge 8 ]]; then
  RED=$(tput setaf 1)
  GREEN=$(tput setaf 2)
  YELLOW=$(tput setaf 3)
  BLUE=$(tput setaf 4)
  MAGENTA=$(tput setaf 5)
  CYAN=$(tput setaf 6)
  BOLD=$(tput bold)
  DIM=$(tput dim)
  RESET=$(tput sgr0)
else
  RED="" GREEN="" YELLOW="" BLUE="" MAGENTA="" CYAN="" BOLD="" DIM="" RESET=""
fi

# Global state
ai_pid=""
monitor_pid=""
tmpfile=""
CODEX_LAST_MESSAGE_FILE=""
current_step="Thinking"
total_input_tokens=0
total_output_tokens=0
total_actual_cost="0"  # OpenCode provides actual cost
total_duration_ms=0    # Cursor provides duration
iteration=0
retry_count=0
declare -a parallel_pids=()
declare -a task_branches=()
declare -a integration_branches=()  # Track integration branches for cleanup on interrupt
WORKTREE_BASE=""  # Base directory for parallel agent worktrees
ORIGINAL_DIR=""   # Original working directory (for worktree operations)
ORIGINAL_BASE_BRANCH=""  # Original base branch before integration branches

# ============================================
# UTILITY FUNCTIONS
# ============================================

log_info() {
  echo "${BLUE}[INFO]${RESET} $*"
}

log_success() {
  echo "${GREEN}[OK]${RESET} $*"
}

log_warn() {
  echo "${YELLOW}[WARN]${RESET} $*"
}

log_error() {
  echo "${RED}[ERROR]${RESET} $*" >&2
}

log_debug() {
  if [[ "$VERBOSE" == true ]]; then
    echo "${DIM}[DEBUG] $*${RESET}"
  fi
}

# Slugify text for branch names
slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-|-$//g' | cut -c1-50
}

# ============================================
# BROWNFIELD MODE (.ralphy/ configuration)
# ============================================

# Initialize .ralphy/ directory with config files
init_ralphy_config() {
  if [[ -d "$RALPHY_DIR" ]]; then
    log_warn "$RALPHY_DIR already exists"
    REPLY='N'  # Default if read times out or fails
    read -p "Overwrite config? [y/N] " -n 1 -r -t 30 2>/dev/null || true
    echo
    [[ ! $REPLY =~ ^[Yy]$ ]] && exit 0
  fi

  mkdir -p "$RALPHY_DIR"

  # Smart detection
  local project_name=""
  local lang=""
  local framework=""
  local test_cmd=""
  local lint_cmd=""
  local build_cmd=""

  # Get project name from directory or package.json
  project_name=$(basename "$PWD")

  if [[ -f "package.json" ]]; then
    # Get name from package.json if available
    local pkg_name
    pkg_name=$(jq -r '.name // ""' package.json 2>/dev/null)
    [[ -n "$pkg_name" ]] && project_name="$pkg_name"

    # Detect language
    if [[ -f "tsconfig.json" ]]; then
      lang="TypeScript"
    else
      lang="JavaScript"
    fi

    # Detect frameworks from dependencies (collect all matches)
    local deps frameworks=()
    deps=$(jq -r '(.dependencies // {}) + (.devDependencies // {}) | keys[]' package.json 2>/dev/null || true)

    # Use grep for reliable exact matching
    echo "$deps" | grep -qx "next" && frameworks+=("Next.js")
    echo "$deps" | grep -qx "nuxt" && frameworks+=("Nuxt")
    echo "$deps" | grep -qx "@remix-run/react" && frameworks+=("Remix")
    echo "$deps" | grep -qx "svelte" && frameworks+=("Svelte")
    echo "$deps" | grep -qE "@nestjs/" && frameworks+=("NestJS")
    echo "$deps" | grep -qx "hono" && frameworks+=("Hono")
    echo "$deps" | grep -qx "fastify" && frameworks+=("Fastify")
    echo "$deps" | grep -qx "express" && frameworks+=("Express")
    # Only add React/Vue if no meta-framework detected
    if [[ ${#frameworks[@]} -eq 0 ]]; then
      echo "$deps" | grep -qx "react" && frameworks+=("React")
      echo "$deps" | grep -qx "vue" && frameworks+=("Vue")
    fi

    # Join frameworks with comma
    framework=$(IFS=', '; echo "${frameworks[*]}")

    # Detect commands from package.json scripts
    local scripts
    scripts=$(jq -r '.scripts // {}' package.json 2>/dev/null)

    # Test command (prefer bun if lockfile exists)
    if echo "$scripts" | jq -e '.test' >/dev/null 2>&1; then
      test_cmd="npm test"
      [[ -f "bun.lockb" ]] && test_cmd="bun test"
    fi

    # Lint command
    if echo "$scripts" | jq -e '.lint' >/dev/null 2>&1; then
      lint_cmd="npm run lint"
    fi

    # Build command
    if echo "$scripts" | jq -e '.build' >/dev/null 2>&1; then
      build_cmd="npm run build"
    fi

  elif [[ -f "pyproject.toml" ]] || [[ -f "requirements.txt" ]] || [[ -f "setup.py" ]]; then
    lang="Python"
    local py_frameworks=()
    local py_deps=""
    [[ -f "pyproject.toml" ]] && py_deps=$(cat pyproject.toml 2>/dev/null)
    [[ -f "requirements.txt" ]] && py_deps+=$(cat requirements.txt 2>/dev/null)
    echo "$py_deps" | grep -qi "fastapi" && py_frameworks+=("FastAPI")
    echo "$py_deps" | grep -qi "django" && py_frameworks+=("Django")
    echo "$py_deps" | grep -qi "flask" && py_frameworks+=("Flask")
    framework=$(IFS=', '; echo "${py_frameworks[*]}")
    test_cmd="pytest"
    lint_cmd="ruff check ."

  elif [[ -f "go.mod" ]]; then
    lang="Go"
    test_cmd="go test ./..."
    lint_cmd="golangci-lint run"

  elif [[ -f "Cargo.toml" ]]; then
    lang="Rust"
    test_cmd="cargo test"
    lint_cmd="cargo clippy"
    build_cmd="cargo build"
  fi

  # Show what we detected
  echo ""
  echo "${BOLD}Detected:${RESET}"
  echo "  Project:   ${CYAN}$project_name${RESET}"
  [[ -n "$lang" ]] && echo "  Language:  ${CYAN}$lang${RESET}"
  [[ -n "$framework" ]] && echo "  Framework: ${CYAN}$framework${RESET}"
  [[ -n "$test_cmd" ]] && echo "  Test:      ${CYAN}$test_cmd${RESET}"
  [[ -n "$lint_cmd" ]] && echo "  Lint:      ${CYAN}$lint_cmd${RESET}"
  [[ -n "$build_cmd" ]] && echo "  Build:     ${CYAN}$build_cmd${RESET}"
  echo ""

  # Escape values for safe YAML (double quotes inside strings)
  yaml_escape() { printf '%s' "$1" | sed 's/"/\\"/g'; }

  # Create config.yaml with detected values
  cat > "$CONFIG_FILE" << EOF
# Ralphy Configuration
# https://github.com/michaelshimeles/ralphy

# Project info (auto-detected, edit if needed)
project:
  name: "$(yaml_escape "$project_name")"
  language: "$(yaml_escape "${lang:-Unknown}")"
  framework: "$(yaml_escape "${framework:-}")"
  description: ""  # Add a brief description

# Commands (auto-detected from package.json/pyproject.toml)
commands:
  test: "$(yaml_escape "${test_cmd:-}")"
  lint: "$(yaml_escape "${lint_cmd:-}")"
  build: "$(yaml_escape "${build_cmd:-}")"

# Rules - instructions the AI MUST follow
# These are injected into every prompt
rules: []
  # Examples:
  # - "Always use TypeScript strict mode"
  # - "Follow the error handling pattern in src/utils/errors.ts"
  # - "All API endpoints must have input validation with Zod"
  # - "Use server actions instead of API routes in Next.js"

# Boundaries - files/folders the AI should not modify
boundaries:
  never_touch: []
    # Examples:
    # - "src/legacy/**"
    # - "migrations/**"
    # - "*.lock"
EOF

  # Create progress.txt
  echo "# Ralphy Progress Log" > "$PROGRESS_FILE"
  echo "" >> "$PROGRESS_FILE"

  log_success "Created $RALPHY_DIR/"
  echo ""
  echo "  ${CYAN}$CONFIG_FILE${RESET}   - Your rules and preferences"
  echo "  ${CYAN}$PROGRESS_FILE${RESET} - Progress log (auto-updated)"
  echo ""
  echo "${BOLD}Next steps:${RESET}"
  echo "  1. Add rules:  ${CYAN}ralphy --add-rule \"your rule here\"${RESET}"
  echo "  2. Or edit:    ${CYAN}$CONFIG_FILE${RESET}"
  echo "  3. Run:        ${CYAN}ralphy \"your task\"${RESET} or ${CYAN}ralphy${RESET} (with PRD.md)"
}

# Load rules from config.yaml
load_ralphy_rules() {
  [[ ! -f "$CONFIG_FILE" ]] && return

  if command -v yq &>/dev/null; then
    yq -r '.rules // [] | .[]' "$CONFIG_FILE" 2>/dev/null || true
  fi
}

# Load boundaries from config.yaml
load_ralphy_boundaries() {
  local boundary_type="$1"  # never_touch or always_test
  [[ ! -f "$CONFIG_FILE" ]] && return

  if command -v yq &>/dev/null; then
    yq -r ".boundaries.$boundary_type // [] | .[]" "$CONFIG_FILE" 2>/dev/null || true
  fi
}

# Show current config
show_ralphy_config() {
  if [[ ! -f "$CONFIG_FILE" ]]; then
    log_warn "No config found. Run 'ralphy --init' first."
    exit 1
  fi

  echo ""
  echo "${BOLD}Ralphy Configuration${RESET} ($CONFIG_FILE)"
  echo ""

  if command -v yq &>/dev/null; then
    # Project info
    local name lang framework desc
    name=$(yq -r '.project.name // "Unknown"' "$CONFIG_FILE" 2>/dev/null)
    lang=$(yq -r '.project.language // "Unknown"' "$CONFIG_FILE" 2>/dev/null)
    framework=$(yq -r '.project.framework // ""' "$CONFIG_FILE" 2>/dev/null)
    desc=$(yq -r '.project.description // ""' "$CONFIG_FILE" 2>/dev/null)

    echo "${BOLD}Project:${RESET}"
    echo "  Name:      $name"
    echo "  Language:  $lang"
    [[ -n "$framework" ]] && echo "  Framework: $framework"
    [[ -n "$desc" ]] && echo "  About:     $desc"
    echo ""

    # Commands
    local test_cmd lint_cmd build_cmd
    test_cmd=$(yq -r '.commands.test // ""' "$CONFIG_FILE" 2>/dev/null)
    lint_cmd=$(yq -r '.commands.lint // ""' "$CONFIG_FILE" 2>/dev/null)
    build_cmd=$(yq -r '.commands.build // ""' "$CONFIG_FILE" 2>/dev/null)

    echo "${BOLD}Commands:${RESET}"
    [[ -n "$test_cmd" ]] && echo "  Test:  $test_cmd" || echo "  Test:  ${DIM}(not set)${RESET}"
    [[ -n "$lint_cmd" ]] && echo "  Lint:  $lint_cmd" || echo "  Lint:  ${DIM}(not set)${RESET}"
    [[ -n "$build_cmd" ]] && echo "  Build: $build_cmd" || echo "  Build: ${DIM}(not set)${RESET}"
    echo ""

    # Rules
    echo "${BOLD}Rules:${RESET}"
    local rules
    rules=$(yq -r '.rules // [] | .[]' "$CONFIG_FILE" 2>/dev/null)
    if [[ -n "$rules" ]]; then
      echo "$rules" | while read -r rule; do
        echo "  • $rule"
      done
    else
      echo "  ${DIM}(none - add with: ralphy --add-rule \"...\")${RESET}"
    fi
    echo ""

    # Boundaries
    local never_touch
    never_touch=$(yq -r '.boundaries.never_touch // [] | .[]' "$CONFIG_FILE" 2>/dev/null)
    if [[ -n "$never_touch" ]]; then
      echo "${BOLD}Never Touch:${RESET}"
      echo "$never_touch" | while read -r path; do
        echo "  • $path"
      done
      echo ""
    fi
  else
    # Fallback: just show the file
    cat "$CONFIG_FILE"
  fi
}

# Add a rule to config.yaml
add_ralphy_rule() {
  local rule="$1"

  if [[ ! -f "$CONFIG_FILE" ]]; then
    log_error "No config found. Run 'ralphy --init' first."
    exit 1
  fi

  if ! command -v yq &>/dev/null; then
    log_error "yq is required to add rules. Install from https://github.com/mikefarah/yq"
    log_info "Or manually edit $CONFIG_FILE"
    exit 1
  fi

  # Add rule to the rules array (use env var to avoid YAML injection)
  RULE="$rule" yq -i '.rules += [env(RULE)]' "$CONFIG_FILE"
  log_success "Added rule: $rule"
}

# Load test command from config
load_test_command() {
  [[ ! -f "$CONFIG_FILE" ]] && echo "" && return

  if command -v yq &>/dev/null; then
    yq -r '.commands.test // ""' "$CONFIG_FILE" 2>/dev/null || echo ""
  else
    echo ""
  fi
}

# Load project context from config.yaml
load_project_context() {
  [[ ! -f "$CONFIG_FILE" ]] && return

  if command -v yq &>/dev/null; then
    local name lang framework desc
    name=$(yq -r '.project.name // ""' "$CONFIG_FILE" 2>/dev/null)
    lang=$(yq -r '.project.language // ""' "$CONFIG_FILE" 2>/dev/null)
    framework=$(yq -r '.project.framework // ""' "$CONFIG_FILE" 2>/dev/null)
    desc=$(yq -r '.project.description // ""' "$CONFIG_FILE" 2>/dev/null)

    local context=""
    [[ -n "$name" ]] && context+="Project: $name\n"
    [[ -n "$lang" ]] && context+="Language: $lang\n"
    [[ -n "$framework" ]] && context+="Framework: $framework\n"
    [[ -n "$desc" ]] && context+="Description: $desc\n"
    echo -e "$context"
  fi
}

# Log task to progress file
log_task_history() {
  local task="$1"
  local status="$2"  # completed, failed

  [[ ! -f "$PROGRESS_FILE" ]] && return

  local timestamp
  timestamp=$(date '+%Y-%m-%d %H:%M')
  local icon="✓"
  [[ "$status" == "failed" ]] && icon="✗"

  echo "- [$icon] $timestamp - $task" >> "$PROGRESS_FILE"
}

# Build prompt with brownfield context
build_brownfield_prompt() {
  local task="$1"
  local prompt=""

  # Add project context if available
  local context
  context=$(load_project_context)
  if [[ -n "$context" ]]; then
    prompt+="## Project Context
$context

"
  fi

  # Add rules if available
  local rules
  rules=$(load_ralphy_rules)
  if [[ -n "$rules" ]]; then
    prompt+="## Rules (you MUST follow these)
$rules

"
  fi

  # Add boundaries
  local never_touch
  never_touch=$(load_ralphy_boundaries "never_touch")
  if [[ -n "$never_touch" ]]; then
    prompt+="## Boundaries
Do NOT modify these files/directories:
$never_touch

"
  fi

  # Add the task
  prompt+="## Task
$task

## Instructions
1. Implement the task described above
2. Write tests if appropriate
3. Ensure the code works correctly"

  # Add commit instruction only if auto-commit is enabled
  if [[ "$AUTO_COMMIT" == "true" ]]; then
    prompt+="
4. Commit your changes with a descriptive message"
  fi

  prompt+="

Keep changes focused and minimal. Do not refactor unrelated code."

  echo "$prompt"
}

# Run a single brownfield task
run_brownfield_task() {
  local task="$1"

  echo ""
  echo "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo "${BOLD}Task:${RESET} $task"
  echo "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
  echo ""

  local prompt
  prompt=$(build_brownfield_prompt "$task")

  # Create temp file for output
  local output_file
  output_file=$(mktemp)

  log_info "Running with $AI_ENGINE..."

  # Run the AI engine (tee to show output while saving for parsing)
  case "$AI_ENGINE" in
    claude)
      claude --dangerously-skip-permissions \
        -p "$prompt" 2>&1 | tee "$output_file"
      ;;
    opencode)
      opencode --output-format stream-json \
        --approval-mode full-auto \
        "$prompt" 2>&1 | tee "$output_file"
      ;;
    cursor)
      agent --dangerously-skip-permissions \
        -p "$prompt" 2>&1 | tee "$output_file"
      ;;
    qwen)
      qwen --output-format stream-json \
        --approval-mode yolo \
        -p "$prompt" 2>&1 | tee "$output_file"
      ;;
    droid)
      droid exec --output-format stream-json \
        --auto medium \
        "$prompt" 2>&1 | tee "$output_file"
      ;;
    codex)
      codex exec --full-auto \
        --json \
        "$prompt" 2>&1 | tee "$output_file"
      ;;
  esac

  local exit_code=$?

  # Log to history
  if [[ $exit_code -eq 0 ]]; then
    log_task_history "$task" "completed"
    log_success "Task completed"
  else
    log_task_history "$task" "failed"
    log_error "Task failed"
  fi

  rm -f "$output_file"
  return $exit_code
}

# ============================================
# HELP & VERSION
# ============================================

show_help() {
  cat << EOF
${BOLD}Ralphy${RESET} - Autonomous AI Coding Loop (v${VERSION})

${BOLD}USAGE:${RESET}
  ./ralphy.sh [options]              # PRD mode (requires PRD.md)
  ./ralphy.sh "task description"     # Single task mode (brownfield)
  ./ralphy.sh --init                 # Initialize .ralphy/ config

${BOLD}CONFIG & SETUP:${RESET}
  --init              Initialize .ralphy/ with smart defaults
  --config            Show current configuration
  --add-rule "..."    Add a rule to config (e.g., "Always use Zod")

${BOLD}SINGLE TASK MODE:${RESET}
  "task description"  Run a single task without PRD (quotes required)
  --no-commit         Don't auto-commit after task completion

${BOLD}AI ENGINE OPTIONS:${RESET}
  --claude            Use Claude Code (default)
  --opencode          Use OpenCode
  --cursor            Use Cursor agent
  --codex             Use Codex CLI
  --qwen              Use Qwen-Code
  --droid             Use Factory Droid

${BOLD}WORKFLOW OPTIONS:${RESET}
  --no-tests          Skip writing and running tests
  --no-lint           Skip linting
  --fast              Skip both tests and linting

${BOLD}EXECUTION OPTIONS:${RESET}
  --max-iterations N  Stop after N iterations (0 = unlimited)
  --max-retries N     Max retries per task on failure (default: 3)
  --retry-delay N     Seconds between retries (default: 5)
  --dry-run           Show what would be done without executing

${BOLD}PARALLEL EXECUTION:${RESET}
  --parallel          Run independent tasks in parallel
  --max-parallel N    Max concurrent tasks (default: 3)

${BOLD}GIT BRANCH OPTIONS:${RESET}
  --branch-per-task   Create a new git branch for each task
  --base-branch NAME  Base branch to create task branches from (default: current)
  --create-pr         Create a pull request after each task (requires gh CLI)
  --draft-pr          Create PRs as drafts

${BOLD}PRD SOURCE OPTIONS:${RESET}
  --prd FILE          PRD file path (default: PRD.md)
  --yaml FILE         Use YAML task file instead of markdown
  --github REPO       Fetch tasks from GitHub issues (e.g., owner/repo)
  --github-label TAG  Filter GitHub issues by label

${BOLD}OTHER OPTIONS:${RESET}
  -v, --verbose       Show debug output
  -h, --help          Show this help
  --version           Show version number

${BOLD}EXAMPLES:${RESET}
  # Brownfield mode (single tasks in existing projects)
  ./ralphy.sh --init                       # Initialize config
  ./ralphy.sh "add dark mode toggle"       # Run single task
  ./ralphy.sh "fix the login bug" --cursor # Single task with Cursor

  # PRD mode (task lists)
  ./ralphy.sh                              # Run with Claude Code
  ./ralphy.sh --codex                      # Run with Codex CLI
  ./ralphy.sh --branch-per-task --create-pr  # Feature branch workflow
  ./ralphy.sh --parallel --max-parallel 4  # Run 4 tasks concurrently
  ./ralphy.sh --yaml tasks.yaml            # Use YAML task file
  ./ralphy.sh --github owner/repo          # Fetch from GitHub issues

${BOLD}PRD FORMATS:${RESET}
  Markdown (PRD.md):
    - [ ] Task description

  YAML (tasks.yaml):
    tasks:
      - title: Task description
        completed: false
        parallel_group: 1  # Optional: tasks with same group run in parallel

  GitHub Issues:
    Uses open issues from the specified repository

EOF
}

show_version() {
  echo "Ralphy v${VERSION}"
}

# ============================================
# ARGUMENT PARSING
# ============================================

parse_args() {
  while [[ $# -gt 0 ]]; do
    case $1 in
      --no-tests|--skip-tests)
        SKIP_TESTS=true
        shift
        ;;
      --no-lint|--skip-lint)
        SKIP_LINT=true
        shift
        ;;
      --fast)
        SKIP_TESTS=true
        SKIP_LINT=true
        shift
        ;;
      --opencode)
        AI_ENGINE="opencode"
        shift
        ;;
      --claude)
        AI_ENGINE="claude"
        shift
        ;;
      --cursor|--agent)
        AI_ENGINE="cursor"
        shift
        ;;
      --codex)
        AI_ENGINE="codex"
        shift
        ;;
      --qwen)
        AI_ENGINE="qwen"
        shift
        ;;
      --droid)
        AI_ENGINE="droid"
        shift
        ;;
      --dry-run)
        DRY_RUN=true
        shift
        ;;
      --max-iterations)
        MAX_ITERATIONS="${2:-0}"
        shift 2
        ;;
      --max-retries)
        MAX_RETRIES="${2:-3}"
        shift 2
        ;;
      --retry-delay)
        RETRY_DELAY="${2:-5}"
        shift 2
        ;;
      --parallel)
        PARALLEL=true
        shift
        ;;
      --max-parallel)
        MAX_PARALLEL="${2:-3}"
        shift 2
        ;;
      --branch-per-task)
        BRANCH_PER_TASK=true
        shift
        ;;
      --base-branch)
        BASE_BRANCH="${2:-}"
        shift 2
        ;;
      --create-pr)
        CREATE_PR=true
        shift
        ;;
      --draft-pr)
        PR_DRAFT=true
        shift
        ;;
      --prd)
        PRD_FILE="${2:-PRD.md}"
        PRD_SOURCE="markdown"
        shift 2
        ;;
      --yaml)
        PRD_FILE="${2:-tasks.yaml}"
        PRD_SOURCE="yaml"
        shift 2
        ;;
      --github)
        GITHUB_REPO="${2:-}"
        PRD_SOURCE="github"
        shift 2
        ;;
      --github-label)
        GITHUB_LABEL="${2:-}"
        shift 2
        ;;
      -v|--verbose)
        VERBOSE=true
        shift
        ;;
      -h|--help)
        show_help
        exit 0
        ;;
      --version)
        show_version
        exit 0
        ;;
      --init)
        INIT_MODE=true
        shift
        ;;
      --config)
        SHOW_CONFIG=true
        shift
        ;;
      --add-rule)
        [[ -z "${2:-}" ]] && { log_error "--add-rule requires an argument"; exit 1; }
        ADD_RULE="$2"
        shift 2
        ;;
      --no-commit)
        AUTO_COMMIT=false
        shift
        ;;
      -*)
        log_error "Unknown option: $1"
        echo "Use --help for usage"
        exit 1
        ;;
      *)
        # Positional argument = single task (brownfield mode)
        if [[ -z "$SINGLE_TASK" ]]; then
          SINGLE_TASK="$1"
        else
          SINGLE_TASK="$SINGLE_TASK $1"
        fi
        shift
        ;;
    esac
  done
}

# ============================================
# PRE-FLIGHT CHECKS
# ============================================

check_requirements() {
  local missing=()

  # Check for PRD source
  case "$PRD_SOURCE" in
    markdown)
      if [[ ! -f "$PRD_FILE" ]]; then
        log_error "$PRD_FILE not found in current directory"
        log_info "Create a PRD.md file with tasks marked as '- [ ] Task description'"
        log_info "Or use: --yaml tasks.yaml for YAML task files"
        exit 1
      fi
      ;;
    yaml)
      if [[ ! -f "$PRD_FILE" ]]; then
        log_error "$PRD_FILE not found in current directory"
        log_info "Create a tasks.yaml file with tasks in YAML format"
        log_info "Or use: --prd PRD.md for Markdown task files"
        exit 1
      fi
      if ! command -v yq &>/dev/null; then
        log_error "yq is required for YAML parsing. Install from https://github.com/mikefarah/yq"
        exit 1
      fi
      ;;
    github)
      if [[ -z "$GITHUB_REPO" ]]; then
        log_error "GitHub repository not specified. Use --github owner/repo"
        exit 1
      fi
      if ! command -v gh &>/dev/null; then
        log_error "GitHub CLI (gh) is required. Install from https://cli.github.com/"
        exit 1
      fi
      ;;
  esac

  # Check for AI CLI
  case "$AI_ENGINE" in
    opencode)
      if ! command -v opencode &>/dev/null; then
        log_error "OpenCode CLI not found."
        log_info "Install from: https://opencode.ai/docs/"
        exit 1
      fi
      ;;
    codex)
      if ! command -v codex &>/dev/null; then
        log_error "Codex CLI not found."
        log_info "Make sure 'codex' is in your PATH."
        exit 1
      fi
      ;;
    cursor)
      if ! command -v agent &>/dev/null; then
        log_error "Cursor agent CLI not found."
        log_info "Make sure Cursor is installed and 'agent' is in your PATH."
        exit 1
      fi
      ;;
    qwen)
      if ! command -v qwen &>/dev/null; then
        log_error "Qwen-Code CLI not found."
        log_info "Make sure 'qwen' is in your PATH."
        exit 1
      fi
      ;;
    droid)
      if ! command -v droid &>/dev/null; then
        log_error "Factory Droid CLI not found. Install from https://docs.factory.ai/cli/getting-started/quickstart"
        exit 1
      fi
      ;;
    *)
      if ! command -v claude &>/dev/null; then
        log_error "Claude Code CLI not found."
        log_info "Install from: https://github.com/anthropics/claude-code"
        log_info "Or use another engine: --cursor, --opencode, --codex, --qwen"
        exit 1
      fi
      ;;
  esac

  # Check for jq (required for JSON parsing)
  if ! command -v jq &>/dev/null; then
    log_error "jq is required but not installed. On Linux, install with: apt-get install jq (Debian/Ubuntu) or yum install jq (RHEL/CentOS)"
    exit 1
  fi

  # Check for gh if PR creation is requested
  if [[ "$CREATE_PR" == true ]] && ! command -v gh &>/dev/null; then
    log_error "GitHub CLI (gh) is required for --create-pr. Install from https://cli.github.com/"
    exit 1
  fi

  if [[ ${#missing[@]} -gt 0 ]]; then
    log_warn "Missing optional dependencies: ${missing[*]}"
    log_warn "Some features may not work properly"
  fi

  # Check for git
  if ! command -v git &>/dev/null; then
    log_error "git is required but not installed. Install git before running Ralphy."
    exit 1
  fi

  # Check if we're in a git repository
  if ! git rev-parse --git-dir >/dev/null 2>&1; then
    log_error "Not a git repository. Ralphy requires a git repository to track changes."
    exit 1
  fi

  # Ensure .ralphy/ directory exists and create progress.txt if missing
  mkdir -p "$RALPHY_DIR"
  if [[ ! -f "$PROGRESS_FILE" ]]; then
    log_info "Creating $PROGRESS_FILE..."
    echo "# Ralphy Progress Log" > "$PROGRESS_FILE"
    echo "" >> "$PROGRESS_FILE"
  fi

  # Set base branch if not specified
  if [[ "$BRANCH_PER_TASK" == true ]] && [[ -z "$BASE_BRANCH" ]]; then
    BASE_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
    log_debug "Using base branch: $BASE_BRANCH"
  fi
}

# ============================================
# CLEANUP HANDLER
# ============================================

cleanup() {
  local exit_code=$?
  
  # Kill background processes
  [[ -n "$monitor_pid" ]] && kill "$monitor_pid" 2>/dev/null || true
  [[ -n "$ai_pid" ]] && kill "$ai_pid" 2>/dev/null || true
  
  # Kill parallel processes
  for pid in "${parallel_pids[@]+"${parallel_pids[@]}"}"; do
    kill "$pid" 2>/dev/null || true
  done
  
  # Kill any remaining child processes
  pkill -P $$ 2>/dev/null || true
  
  # Remove temp file
  [[ -n "$tmpfile" ]] && rm -f "$tmpfile"
  [[ -n "$CODEX_LAST_MESSAGE_FILE" ]] && rm -f "$CODEX_LAST_MESSAGE_FILE"
  
  # Cleanup parallel worktrees
  if [[ -n "$WORKTREE_BASE" ]] && [[ -d "$WORKTREE_BASE" ]]; then
    # Remove all worktrees we created
    for dir in "$WORKTREE_BASE"/agent-*; do
      if [[ -d "$dir" ]]; then
        if git -C "$dir" status --porcelain 2>/dev/null | grep -q .; then
          log_warn "Preserving dirty worktree: $dir"
          continue
        fi
        git worktree remove "$dir" 2>/dev/null || true
      fi
    done
    if ! find "$WORKTREE_BASE" -maxdepth 1 -type d -name 'agent-*' -print -quit 2>/dev/null | grep -q .; then
      rm -rf "$WORKTREE_BASE" 2>/dev/null || true
    else
      log_warn "Preserving worktree base with dirty agents: $WORKTREE_BASE"
    fi
  fi
  
  # Show message on interrupt
  if [[ $exit_code -eq 130 ]]; then
    printf "\n"
    log_warn "Interrupted! Cleaned up."

    # Show branches created if any
    if [[ -n "${task_branches[*]+"${task_branches[*]}"}" ]]; then
      log_info "Branches created: ${task_branches[*]}"
    fi

    # Show integration branches if any (for parallel group workflows)
    if [[ -n "${integration_branches[*]+"${integration_branches[*]}"}" ]]; then
      log_info "Integration branches: ${integration_branches[*]}"
      if [[ -n "$ORIGINAL_BASE_BRANCH" ]]; then
        log_info "To resume: merge integration branches into $ORIGINAL_BASE_BRANCH"
      fi
    fi
  fi
}

# ============================================
# TASK SOURCES - MARKDOWN
# ============================================

get_tasks_markdown() {
  grep '^\- \[ \]' "$PRD_FILE" 2>/dev/null | sed 's/^- \[ \] //' || true
}

get_next_task_markdown() {
  grep -m1 '^\- \[ \]' "$PRD_FILE" 2>/dev/null | sed 's/^- \[ \] //' | cut -c1-50 || echo ""
}

count_remaining_markdown() {
  grep -c '^\- \[ \]' "$PRD_FILE" 2>/dev/null || echo "0"
}

count_completed_markdown() {
  grep -c '^\- \[x\]' "$PRD_FILE" 2>/dev/null || echo "0"
}

mark_task_complete_markdown() {
  local task=$1
  # For macOS sed (BRE), we need to:
  # - Escape: [ ] \ . * ^ $ /
  # - NOT escape: { } ( ) + ? | (these are literal in BRE)
  local escaped_task
  escaped_task=$(printf '%s\n' "$task" | sed 's/[[\.*^$/]/\\&/g')
  sed -i.bak "s/^- \[ \] ${escaped_task}/- [x] ${escaped_task}/" "$PRD_FILE"
  rm -f "${PRD_FILE}.bak"
}

# ============================================
# TASK SOURCES - YAML
# ============================================

get_tasks_yaml() {
  yq -r '.tasks[] | select(.completed != true) | .title' "$PRD_FILE" 2>/dev/null || true
}

get_next_task_yaml() {
  yq -r '.tasks[] | select(.completed != true) | .title' "$PRD_FILE" 2>/dev/null | head -1 | cut -c1-50 || echo ""
}

count_remaining_yaml() {
  yq -r '[.tasks[] | select(.completed != true)] | length' "$PRD_FILE" 2>/dev/null || echo "0"
}

count_completed_yaml() {
  yq -r '[.tasks[] | select(.completed == true)] | length' "$PRD_FILE" 2>/dev/null || echo "0"
}

mark_task_complete_yaml() {
  local task=$1
  yq -i "(.tasks[] | select(.title == \"$task\")).completed = true" "$PRD_FILE"
}

get_parallel_group_yaml() {
  local task=$1
  yq -r ".tasks[] | select(.title == \"$task\") | .parallel_group // 0" "$PRD_FILE" 2>/dev/null || echo "0"
}

get_tasks_in_group_yaml() {
  local group=$1
  yq -r ".tasks[] | select(.completed != true and (.parallel_group // 0) == $group) | .title" "$PRD_FILE" 2>/dev/null || true
}

# ============================================
# TASK SOURCES - GITHUB ISSUES
# ============================================

get_tasks_github() {
  local args=(--repo "$GITHUB_REPO" --state open --json number,title)
  [[ -n "$GITHUB_LABEL" ]] && args+=(--label "$GITHUB_LABEL")

  gh issue list "${args[@]}" \
    --jq '.[] | "\(.number):\(.title)"' 2>/dev/null || true
}

get_next_task_github() {
  local args=(--repo "$GITHUB_REPO" --state open --limit 1 --json number,title)
  [[ -n "$GITHUB_LABEL" ]] && args+=(--label "$GITHUB_LABEL")

  gh issue list "${args[@]}" \
    --jq '.[0] | "\(.number):\(.title)"' 2>/dev/null | cut -c1-50 || echo ""
}

count_remaining_github() {
  local args=(--repo "$GITHUB_REPO" --state open --json number)
  [[ -n "$GITHUB_LABEL" ]] && args+=(--label "$GITHUB_LABEL")

  gh issue list "${args[@]}" \
    --jq 'length' 2>/dev/null || echo "0"
}

count_completed_github() {
  local args=(--repo "$GITHUB_REPO" --state closed --json number)
  [[ -n "$GITHUB_LABEL" ]] && args+=(--label "$GITHUB_LABEL")

  gh issue list "${args[@]}" \
    --jq 'length' 2>/dev/null || echo "0"
}

mark_task_complete_github() {
  local task=$1
  # Extract issue number from "number:title" format
  local issue_num="${task%%:*}"
  gh issue close "$issue_num" --repo "$GITHUB_REPO" 2>/dev/null || true
}

get_github_issue_body() {
  local task=$1
  local issue_num="${task%%:*}"
  gh issue view "$issue_num" --repo "$GITHUB_REPO" --json body --jq '.body' 2>/dev/null || echo ""
}

# ============================================
# UNIFIED TASK INTERFACE
# ============================================

get_next_task() {
  case "$PRD_SOURCE" in
    markdown) get_next_task_markdown ;;
    yaml) get_next_task_yaml ;;
    github) get_next_task_github ;;
  esac
}

get_all_tasks() {
  case "$PRD_SOURCE" in
    markdown) get_tasks_markdown ;;
    yaml) get_tasks_yaml ;;
    github) get_tasks_github ;;
  esac
}

count_remaining_tasks() {
  case "$PRD_SOURCE" in
    markdown) count_remaining_markdown ;;
    yaml) count_remaining_yaml ;;
    github) count_remaining_github ;;
  esac
}

count_completed_tasks() {
  case "$PRD_SOURCE" in
    markdown) count_completed_markdown ;;
    yaml) count_completed_yaml ;;
    github) count_completed_github ;;
  esac
}

mark_task_complete() {
  local task=$1
  case "$PRD_SOURCE" in
    markdown) mark_task_complete_markdown "$task" ;;
    yaml) mark_task_complete_yaml "$task" ;;
    github) mark_task_complete_github "$task" ;;
  esac
}

# ============================================
# GIT BRANCH MANAGEMENT
# ============================================

create_task_branch() {
  local task=$1
  local branch_name="ralphy/$(slugify "$task")"
  
  log_debug "Creating branch: $branch_name from $BASE_BRANCH"
  
  # Stash any changes (only pop if a new stash was created)
  local stash_before stash_after stashed=false
  stash_before=$(git stash list -1 --format='%gd %s' 2>/dev/null || true)
  git stash push -m "ralphy-autostash" >/dev/null 2>&1 || true
  stash_after=$(git stash list -1 --format='%gd %s' 2>/dev/null || true)
  if [[ -n "$stash_after" ]] && [[ "$stash_after" != "$stash_before" ]] && [[ "$stash_after" == *"ralphy-autostash"* ]]; then
    stashed=true
  fi
  
  # Create and checkout new branch
  git checkout "$BASE_BRANCH" 2>/dev/null || true
  git pull origin "$BASE_BRANCH" 2>/dev/null || true
  git checkout -b "$branch_name" 2>/dev/null || {
    # Branch might already exist
    git checkout "$branch_name" 2>/dev/null || true
  }
  
  # Pop stash if we stashed
  if [[ "$stashed" == true ]]; then
    git stash pop >/dev/null 2>&1 || true
  fi
  
  task_branches+=("$branch_name")
  echo "$branch_name"
}

create_pull_request() {
  local branch=$1
  local task=$2
  local body="${3:-Automated PR created by Ralphy}"
  
  local draft_flag=""
  [[ "$PR_DRAFT" == true ]] && draft_flag="--draft"
  
  log_info "Creating pull request for $branch..."
  
  # Push branch first
  git push -u origin "$branch" 2>/dev/null || {
    log_warn "Failed to push branch $branch"
    return 1
  }
  
  # Create PR
  local pr_url
  pr_url=$(gh pr create \
    --base "$BASE_BRANCH" \
    --head "$branch" \
    --title "$task" \
    --body "$body" \
    $draft_flag 2>/dev/null) || {
    log_warn "Failed to create PR for $branch"
    return 1
  }
  
  log_success "PR created: $pr_url"
  echo "$pr_url"
}

return_to_base_branch() {
  if [[ "$BRANCH_PER_TASK" == true ]]; then
    git checkout "$BASE_BRANCH" 2>/dev/null || true
  fi
}

# ============================================
# PROGRESS MONITOR
# ============================================

monitor_progress() {
  local file=$1
  local task=$2
  local start_time
  start_time=$(date +%s)
  local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
  local spin_idx=0

  task="${task:0:40}"

  while true; do
    local elapsed=$(($(date +%s) - start_time))
    local mins=$((elapsed / 60))
    local secs=$((elapsed % 60))

    # Check latest output for step indicators
    if [[ -f "$file" ]] && [[ -s "$file" ]]; then
      local content
      content=$(tail -c 5000 "$file" 2>/dev/null || true)

      if echo "$content" | grep -qE 'git commit|"command":"git commit'; then
        current_step="Committing"
      elif echo "$content" | grep -qE 'git add|"command":"git add'; then
        current_step="Staging"
      elif echo "$content" | grep -qE 'progress\.txt'; then
        current_step="Logging"
      elif echo "$content" | grep -qE 'PRD\.md|tasks\.yaml'; then
        current_step="Updating PRD"
      elif echo "$content" | grep -qE 'lint|eslint|biome|prettier'; then
        current_step="Linting"
      elif echo "$content" | grep -qE 'vitest|jest|bun test|npm test|pytest|go test'; then
        current_step="Testing"
      elif echo "$content" | grep -qE '\.test\.|\.spec\.|__tests__|_test\.go'; then
        current_step="Writing tests"
      elif echo "$content" | grep -qE '"tool":"[Ww]rite"|"tool":"[Ee]dit"|"name":"write"|"name":"edit"'; then
        current_step="Implementing"
      elif echo "$content" | grep -qE '"tool":"[Rr]ead"|"tool":"[Gg]lob"|"tool":"[Gg]rep"|"name":"read"|"name":"glob"|"name":"grep"'; then
        current_step="Reading code"
      fi
    fi

    local spinner_char="${spinstr:$spin_idx:1}"
    local step_color=""
    
    # Color-code steps
    case "$current_step" in
      "Thinking"|"Reading code") step_color="$CYAN" ;;
      "Implementing"|"Writing tests") step_color="$MAGENTA" ;;
      "Testing"|"Linting") step_color="$YELLOW" ;;
      "Staging"|"Committing") step_color="$GREEN" ;;
      *) step_color="$BLUE" ;;
    esac

    # Use tput for cleaner line clearing
    tput cr 2>/dev/null || printf "\r"
    tput el 2>/dev/null || true
    printf "  %s ${step_color}%-16s${RESET} │ %s ${DIM}[%02d:%02d]${RESET}" "$spinner_char" "$current_step" "$task" "$mins" "$secs"

    spin_idx=$(( (spin_idx + 1) % ${#spinstr} ))
    sleep 0.12
  done
}

# ============================================
# NOTIFICATION (Cross-platform)
# ============================================

notify_done() {
  local message="${1:-Ralphy has completed all tasks!}"
  
  # macOS
  if command -v afplay &>/dev/null; then
    afplay /System/Library/Sounds/Glass.aiff 2>/dev/null &
  fi
  
  # macOS notification
  if command -v osascript &>/dev/null; then
    osascript -e "display notification \"$message\" with title \"Ralphy\"" 2>/dev/null || true
  fi
  
  # Linux (notify-send)
  if command -v notify-send &>/dev/null; then
    notify-send "Ralphy" "$message" 2>/dev/null || true
  fi
  
  # Linux (paplay for sound)
  if command -v paplay &>/dev/null; then
    paplay /usr/share/sounds/freedesktop/stereo/complete.oga 2>/dev/null &
  fi
  
  # Windows (powershell)
  if command -v powershell.exe &>/dev/null; then
    powershell.exe -Command "[System.Media.SystemSounds]::Asterisk.Play()" 2>/dev/null || true
  fi
}

notify_error() {
  local message="${1:-Ralphy encountered an error}"
  
  # macOS
  if command -v osascript &>/dev/null; then
    osascript -e "display notification \"$message\" with title \"Ralphy - Error\"" 2>/dev/null || true
  fi
  
  # Linux
  if command -v notify-send &>/dev/null; then
    notify-send -u critical "Ralphy - Error" "$message" 2>/dev/null || true
  fi
}

# ============================================
# PROMPT BUILDER
# ============================================

build_prompt() {
  local task_override="${1:-}"
  local prompt=""

  # Add .ralphy/ config if available (works with PRD mode too)
  if [[ -d "$RALPHY_DIR" ]]; then
    # Add project context
    local context
    context=$(load_project_context)
    if [[ -n "$context" ]]; then
      prompt+="## Project Context
$context

"
    fi

    # Add rules
    local rules
    rules=$(load_ralphy_rules)
    if [[ -n "$rules" ]]; then
      prompt+="## Rules (you MUST follow these)
$rules

"
    fi

    # Add boundaries
    local never_touch
    never_touch=$(load_ralphy_boundaries "never_touch")
    if [[ -n "$never_touch" ]]; then
      prompt+="## Boundaries - Do NOT modify these files:
$never_touch

"
    fi
  fi

  # Add context based on PRD source
  case "$PRD_SOURCE" in
    markdown)
      prompt="@${PRD_FILE} @$PROGRESS_FILE"
      ;;
    yaml)
      prompt="@${PRD_FILE} @$PROGRESS_FILE"
      ;;
    github)
      # For GitHub issues, we include the issue body
      local issue_body=""
      if [[ -n "$task_override" ]]; then
        issue_body=$(get_github_issue_body "$task_override")
      fi
      prompt="Task from GitHub Issue: $task_override

Issue Description:
$issue_body

@$PROGRESS_FILE"
      ;;
  esac
  
  prompt="$prompt
1. Find the highest-priority incomplete task and implement it."

  local step=2
  
  if [[ "$SKIP_TESTS" == false ]]; then
    prompt="$prompt
$step. Write tests for the feature.
$((step+1)). Run tests and ensure they pass before proceeding."
    step=$((step+2))
  fi

  if [[ "$SKIP_LINT" == false ]]; then
    prompt="$prompt
$step. Run linting and ensure it passes before proceeding."
    step=$((step+1))
  fi

  # Adjust completion step based on PRD source
  case "$PRD_SOURCE" in
    markdown)
      prompt="$prompt
$step. Update the PRD to mark the task as complete (change '- [ ]' to '- [x]')."
      ;;
    yaml)
      prompt="$prompt
$step. Update ${PRD_FILE} to mark the task as completed (set completed: true)."
      ;;
    github)
      prompt="$prompt
$step. The task will be marked complete automatically. Just note the completion in $PROGRESS_FILE."
      ;;
  esac

  step=$((step+1))

  prompt="$prompt
$step. Append your progress to $PROGRESS_FILE.
$((step+1)). Commit your changes with a descriptive message.
ONLY WORK ON A SINGLE TASK."

  if [[ "$SKIP_TESTS" == false ]]; then
    prompt="$prompt Do not proceed if tests fail."
  fi
  if [[ "$SKIP_LINT" == false ]]; then
    prompt="$prompt Do not proceed if linting fails."
  fi

  prompt="$prompt
If ALL tasks in the PRD are complete, output <promise>COMPLETE</promise>."

  echo "$prompt"
}

# ============================================
# AI ENGINE ABSTRACTION
# ============================================

run_ai_command() {
  local prompt=$1
  local output_file=$2
  
  case "$AI_ENGINE" in
    opencode)
      # OpenCode: use 'run' command with JSON format and permissive settings
      OPENCODE_PERMISSION='{"*":"allow"}' opencode run \
        --format json \
        "$prompt" > "$output_file" 2>&1 &
      ;;
    cursor)
      # Cursor agent: use --print for non-interactive, --force to allow all commands
      agent --print --force \
        --output-format stream-json \
        "$prompt" > "$output_file" 2>&1 &
      ;;
    qwen)
      # Qwen-Code: use CLI with JSON format and auto-approve tools
      qwen --output-format stream-json \
        --approval-mode yolo \
        -p "$prompt" > "$output_file" 2>&1 &
      ;;
    droid)
      # Droid: use exec with stream-json output and medium autonomy for development
      droid exec --output-format stream-json \
        --auto medium \
        "$prompt" > "$output_file" 2>&1 &
      ;;
    codex)
      CODEX_LAST_MESSAGE_FILE="${output_file}.last"
      rm -f "$CODEX_LAST_MESSAGE_FILE"
      codex exec --full-auto \
        --json \
        --output-last-message "$CODEX_LAST_MESSAGE_FILE" \
        "$prompt" > "$output_file" 2>&1 &
      ;;
    *)
      # Claude Code: use existing approach
      claude --dangerously-skip-permissions \
        --verbose \
        --output-format stream-json \
        -p "$prompt" > "$output_file" 2>&1 &
      ;;
  esac
  
  ai_pid=$!
}

parse_ai_result() {
  local result=$1
  local response=""
  local input_tokens=0
  local output_tokens=0
  local actual_cost="0"
  
  case "$AI_ENGINE" in
    opencode)
      # OpenCode JSON format: uses step_finish for tokens and text events for response
      local step_finish
      step_finish=$(echo "$result" | grep '"type":"step_finish"' | tail -1 || echo "")
      
      if [[ -n "$step_finish" ]]; then
        input_tokens=$(echo "$step_finish" | jq -r '.part.tokens.input // 0' 2>/dev/null || echo "0")
        output_tokens=$(echo "$step_finish" | jq -r '.part.tokens.output // 0' 2>/dev/null || echo "0")
        # OpenCode provides actual cost directly
        actual_cost=$(echo "$step_finish" | jq -r '.part.cost // 0' 2>/dev/null || echo "0")
      fi
      
      # Get text response from text events
      response=$(echo "$result" | grep '"type":"text"' | jq -rs 'map(.part.text // "") | join("")' 2>/dev/null || echo "")
      
      # If no text found, indicate task completed
      if [[ -z "$response" ]]; then
        response="Task completed"
      fi
      ;;
    cursor)
      # Cursor agent: parse stream-json output
      # Cursor doesn't provide token counts, but does provide duration_ms
      
      local result_line
      result_line=$(echo "$result" | grep '"type":"result"' | tail -1)
      
      if [[ -n "$result_line" ]]; then
        response=$(echo "$result_line" | jq -r '.result // "Task completed"' 2>/dev/null || echo "Task completed")
        # Cursor provides duration instead of tokens
        local duration_ms
        duration_ms=$(echo "$result_line" | jq -r '.duration_ms // 0' 2>/dev/null || echo "0")
        # Store duration in output_tokens field for now (we'll handle it specially)
        # Use negative value as marker that this is duration, not tokens
        if [[ "$duration_ms" =~ ^[0-9]+$ ]] && [[ "$duration_ms" -gt 0 ]]; then
          # Encode duration: store as-is, we track separately
          actual_cost="duration:$duration_ms"
        fi
      fi
      
      # Get response from assistant message if result is empty
      if [[ -z "$response" ]] || [[ "$response" == "Task completed" ]]; then
        local assistant_msg
        assistant_msg=$(echo "$result" | grep '"type":"assistant"' | tail -1)
        if [[ -n "$assistant_msg" ]]; then
          response=$(echo "$assistant_msg" | jq -r '.message.content[0].text // .message.content // "Task completed"' 2>/dev/null || echo "Task completed")
        fi
      fi
      
      # Tokens remain 0 for Cursor (not available)
      input_tokens=0
      output_tokens=0
      ;;
    qwen)
      # Qwen-Code stream-json parsing (similar to Claude Code)
      local result_line
      result_line=$(echo "$result" | grep '"type":"result"' | tail -1)

      if [[ -n "$result_line" ]]; then
        response=$(echo "$result_line" | jq -r '.result // "No result text"' 2>/dev/null || echo "Could not parse result")
        input_tokens=$(echo "$result_line" | jq -r '.usage.input_tokens // 0' 2>/dev/null || echo "0")
        output_tokens=$(echo "$result_line" | jq -r '.usage.output_tokens // 0' 2>/dev/null || echo "0")
      fi

      # Fallback when no response text was parsed, similar to OpenCode behavior
      if [[ -z "$response" ]]; then
        response="Task completed"
      fi
      ;;
    droid)
      # Droid stream-json parsing
      # Look for completion event which has the final result
      local completion_line
      completion_line=$(echo "$result" | grep '"type":"completion"' | tail -1)

      if [[ -n "$completion_line" ]]; then
        response=$(echo "$completion_line" | jq -r '.finalText // "Task completed"' 2>/dev/null || echo "Task completed")
        # Droid provides duration_ms in completion event
        local dur_ms
        dur_ms=$(echo "$completion_line" | jq -r '.durationMs // 0' 2>/dev/null || echo "0")
        if [[ "$dur_ms" =~ ^[0-9]+$ ]] && [[ "$dur_ms" -gt 0 ]]; then
          # Store duration for tracking
          actual_cost="duration:$dur_ms"
        fi
      fi

      # Tokens remain 0 for Droid (not exposed in exec mode)
      input_tokens=0
      output_tokens=0
      ;;
    codex)
      if [[ -n "$CODEX_LAST_MESSAGE_FILE" ]] && [[ -f "$CODEX_LAST_MESSAGE_FILE" ]]; then
        response=$(cat "$CODEX_LAST_MESSAGE_FILE" 2>/dev/null || echo "")
        # Codex sometimes prefixes a generic completion line; drop it for readability.
        response=$(printf '%s' "$response" | sed '1{/^Task completed successfully\.[[:space:]]*$/d;}')
      fi
      input_tokens=0
      output_tokens=0
      ;;
    *)
      # Claude Code stream-json parsing
      local result_line
      result_line=$(echo "$result" | grep '"type":"result"' | tail -1)
      
      if [[ -n "$result_line" ]]; then
        response=$(echo "$result_line" | jq -r '.result // "No result text"' 2>/dev/null || echo "Could not parse result")
        input_tokens=$(echo "$result_line" | jq -r '.usage.input_tokens // 0' 2>/dev/null || echo "0")
        output_tokens=$(echo "$result_line" | jq -r '.usage.output_tokens // 0' 2>/dev/null || echo "0")
      fi
      ;;
  esac
  
  # Sanitize token counts
  [[ "$input_tokens" =~ ^[0-9]+$ ]] || input_tokens=0
  [[ "$output_tokens" =~ ^[0-9]+$ ]] || output_tokens=0
  
  echo "$response"
  echo "---TOKENS---"
  echo "$input_tokens"
  echo "$output_tokens"
  echo "$actual_cost"
}

check_for_errors() {
  local result=$1
  
  if echo "$result" | grep -q '"type":"error"'; then
    local error_msg
    error_msg=$(echo "$result" | grep '"type":"error"' | head -1 | jq -r '.error.message // .message // .' 2>/dev/null || echo "Unknown error")
    echo "$error_msg"
    return 1
  fi
  
  return 0
}

# ============================================
# COST CALCULATION
# ============================================

calculate_cost() {
  local input=$1
  local output=$2
  
  if command -v bc &>/dev/null; then
    echo "scale=4; ($input * 0.000003) + ($output * 0.000015)" | bc
  else
    echo "N/A"
  fi
}

# ============================================
# SINGLE TASK EXECUTION
# ============================================

run_single_task() {
  local task_name="${1:-}"
  local task_num="${2:-$iteration}"
  
  retry_count=0
  
  echo ""
  echo "${BOLD}>>> Task $task_num${RESET}"
  
  local remaining completed
  remaining=$(count_remaining_tasks | tr -d '[:space:]')
  completed=$(count_completed_tasks | tr -d '[:space:]')
  remaining=${remaining:-0}
  completed=${completed:-0}
  echo "${DIM}    Completed: $completed | Remaining: $remaining${RESET}"
  echo "--------------------------------------------"

  # Get current task for display
  local current_task
  if [[ -n "$task_name" ]]; then
    current_task="$task_name"
  else
    current_task=$(get_next_task)
  fi
  
  if [[ -z "$current_task" ]]; then
    log_info "No more tasks found"
    return 2
  fi
  
  current_step="Thinking"

  # Create branch if needed
  local branch_name=""
  if [[ "$BRANCH_PER_TASK" == true ]]; then
    branch_name=$(create_task_branch "$current_task")
    log_info "Working on branch: $branch_name"
  fi

  # Temp file for AI output
  tmpfile=$(mktemp)

  # Build the prompt
  local prompt
  prompt=$(build_prompt "$current_task")

  if [[ "$DRY_RUN" == true ]]; then
    log_info "DRY RUN - Would execute:"
    echo "${DIM}$prompt${RESET}"
    rm -f "$tmpfile"
    tmpfile=""
    return_to_base_branch
    return 0
  fi

  # Run with retry logic
  while [[ $retry_count -lt $MAX_RETRIES ]]; do
    # Start AI command
    run_ai_command "$prompt" "$tmpfile"

    # Start progress monitor in background
    monitor_progress "$tmpfile" "${current_task:0:40}" &
    monitor_pid=$!

    # Wait for AI to finish
    wait "$ai_pid" 2>/dev/null || true

    # Stop the monitor
    kill "$monitor_pid" 2>/dev/null || true
    wait "$monitor_pid" 2>/dev/null || true
    monitor_pid=""

    # Show completion
    tput cr 2>/dev/null || printf "\r"
    tput el 2>/dev/null || true

    # Read result
    local result
    result=$(cat "$tmpfile" 2>/dev/null || echo "")

    # Check for empty response
    if [[ -z "$result" ]]; then
      ((retry_count++)) || true
      log_error "Empty response (attempt $retry_count/$MAX_RETRIES)"
      if [[ $retry_count -lt $MAX_RETRIES ]]; then
        log_info "Retrying in ${RETRY_DELAY}s..."
        sleep "$RETRY_DELAY"
        continue
      fi
      rm -f "$tmpfile"
      tmpfile=""
      return_to_base_branch
      return 1
    fi

    # Check for API errors
    local error_msg
    if ! error_msg=$(check_for_errors "$result"); then
      ((retry_count++)) || true
      log_error "API error: $error_msg (attempt $retry_count/$MAX_RETRIES)"
      if [[ $retry_count -lt $MAX_RETRIES ]]; then
        log_info "Retrying in ${RETRY_DELAY}s..."
        sleep "$RETRY_DELAY"
        continue
      fi
      rm -f "$tmpfile"
      tmpfile=""
      return_to_base_branch
      return 1
    fi

    # Parse the result
    local parsed
    parsed=$(parse_ai_result "$result")
    local response
    response=$(echo "$parsed" | sed '/^---TOKENS---$/,$d')
    local token_data
    token_data=$(echo "$parsed" | sed -n '/^---TOKENS---$/,$p' | tail -3)
    local input_tokens
    input_tokens=$(echo "$token_data" | sed -n '1p')
    local output_tokens
    output_tokens=$(echo "$token_data" | sed -n '2p')
    local actual_cost
    actual_cost=$(echo "$token_data" | sed -n '3p')

    printf "  ${GREEN}✓${RESET} %-16s │ %s\n" "Done" "${current_task:0:40}"
    
    if [[ -n "$response" ]]; then
      echo ""
      echo "$response"
    fi

    # Sanitize values
    [[ "$input_tokens" =~ ^[0-9]+$ ]] || input_tokens=0
    [[ "$output_tokens" =~ ^[0-9]+$ ]] || output_tokens=0

    # Update totals
    total_input_tokens=$((total_input_tokens + input_tokens))
    total_output_tokens=$((total_output_tokens + output_tokens))
    
    # Track actual cost for OpenCode, or duration for Cursor
    if [[ -n "$actual_cost" ]]; then
      if [[ "$actual_cost" == duration:* ]]; then
        # Cursor duration tracking
        local dur_ms="${actual_cost#duration:}"
        [[ "$dur_ms" =~ ^[0-9]+$ ]] && total_duration_ms=$((total_duration_ms + dur_ms))
      elif [[ "$actual_cost" != "0" ]] && command -v bc &>/dev/null; then
        # OpenCode cost tracking
        total_actual_cost=$(echo "scale=6; $total_actual_cost + $actual_cost" | bc 2>/dev/null || echo "$total_actual_cost")
      fi
    fi

    rm -f "$tmpfile"
    tmpfile=""
    if [[ "$AI_ENGINE" == "codex" ]] && [[ -n "$CODEX_LAST_MESSAGE_FILE" ]]; then
      rm -f "$CODEX_LAST_MESSAGE_FILE"
      CODEX_LAST_MESSAGE_FILE=""
    fi

    # Mark task complete for GitHub issues (since AI can't do it)
    if [[ "$PRD_SOURCE" == "github" ]]; then
      mark_task_complete "$current_task"
    fi

    # Create PR if requested
    if [[ "$CREATE_PR" == true ]] && [[ -n "$branch_name" ]]; then
      create_pull_request "$branch_name" "$current_task" "Automated implementation by Ralphy"
    fi

    # Return to base branch
    return_to_base_branch

    # Check for completion - verify by actually counting remaining tasks
    local remaining_count
    remaining_count=$(count_remaining_tasks | tr -d '[:space:]' | head -1)
    remaining_count=${remaining_count:-0}
    [[ "$remaining_count" =~ ^[0-9]+$ ]] || remaining_count=0
    
    if [[ "$remaining_count" -eq 0 ]]; then
      return 2  # All tasks actually complete
    fi
    
    # AI might claim completion but tasks remain - continue anyway
    if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
      log_debug "AI claimed completion but $remaining_count tasks remain, continuing..."
    fi

    return 0
  done

  return_to_base_branch
  return 1
}

# ============================================
# PARALLEL TASK EXECUTION
# ============================================

# Create an isolated worktree for a parallel agent
create_agent_worktree() {
  local task_name="$1"
  local agent_num="$2"
  local branch_name="ralphy/agent-${agent_num}-$(slugify "$task_name")"
  local worktree_dir="${WORKTREE_BASE}/agent-${agent_num}"
  
  # Run git commands from original directory
  # All git output goes to stderr so it doesn't interfere with our return value
  (
    cd "$ORIGINAL_DIR" || { echo "Failed to cd to $ORIGINAL_DIR" >&2; exit 1; }
    
    # Prune any stale worktrees first
    git worktree prune >&2
    
    # Delete branch if it exists (force)
    git branch -D "$branch_name" >&2 2>/dev/null || true
    
    # Create branch from base
    git branch "$branch_name" "$BASE_BRANCH" >&2 || { echo "Failed to create branch $branch_name from $BASE_BRANCH" >&2; exit 1; }
    
    # Remove existing worktree dir if any
    rm -rf "$worktree_dir" 2>/dev/null || true
    
    # Create worktree
    git worktree add "$worktree_dir" "$branch_name" >&2 || { echo "Failed to create worktree at $worktree_dir" >&2; exit 1; }
  )
  
  # Only output the result - git commands above send their output to stderr
  echo "$worktree_dir|$branch_name"
}

# Cleanup worktree after agent completes
cleanup_agent_worktree() {
  local worktree_dir="$1"
  local branch_name="$2"
  local log_file="${3:-}"
  local dirty=false

  if [[ -d "$worktree_dir" ]]; then
    if git -C "$worktree_dir" status --porcelain 2>/dev/null | grep -q .; then
      dirty=true
    fi
  fi

  if [[ "$dirty" == true ]]; then
    if [[ -n "$log_file" ]]; then
      echo "Worktree left in place due to uncommitted changes: $worktree_dir" >> "$log_file"
    fi
    return 0
  fi
  
  # Run from original directory
  (
    cd "$ORIGINAL_DIR" || exit 1
    git worktree remove -f "$worktree_dir" 2>/dev/null || true
  )
  # Don't delete branch - it may have commits we want to keep/PR
}

# Run a single agent in its own isolated worktree
run_parallel_agent() {
  local task_name="$1"
  local agent_num="$2"
  local output_file="$3"
  local status_file="$4"
  local log_file="$5"
  
  echo "setting up" > "$status_file"
  
  # Log setup info
  echo "Agent $agent_num starting for task: $task_name" >> "$log_file"
  echo "ORIGINAL_DIR=$ORIGINAL_DIR" >> "$log_file"
  echo "WORKTREE_BASE=$WORKTREE_BASE" >> "$log_file"
  echo "BASE_BRANCH=$BASE_BRANCH" >> "$log_file"
  
  # Create isolated worktree for this agent
  local worktree_info
  worktree_info=$(create_agent_worktree "$task_name" "$agent_num" 2>>"$log_file")
  local worktree_dir="${worktree_info%%|*}"
  local branch_name="${worktree_info##*|}"
  
  echo "Worktree dir: $worktree_dir" >> "$log_file"
  echo "Branch name: $branch_name" >> "$log_file"
  
  if [[ ! -d "$worktree_dir" ]]; then
    echo "failed" > "$status_file"
    echo "ERROR: Worktree directory does not exist: $worktree_dir" >> "$log_file"
    echo "0 0" > "$output_file"
    return 1
  fi
  
  echo "running" > "$status_file"
  
  # Copy PRD file to worktree from original directory
  if [[ "$PRD_SOURCE" == "markdown" ]] || [[ "$PRD_SOURCE" == "yaml" ]]; then
    cp "$ORIGINAL_DIR/$PRD_FILE" "$worktree_dir/" 2>/dev/null || true
  fi
  
  # Ensure .ralphy/ and progress.txt exist in worktree
  mkdir -p "$worktree_dir/$RALPHY_DIR"
  touch "$worktree_dir/$PROGRESS_FILE"

  # Build prompt for this specific task
  local prompt="You are working on a specific task. Focus ONLY on this task:

TASK: $task_name

Instructions:
1. Implement this specific task completely
2. Write tests if appropriate
3. Update $PROGRESS_FILE with what you did
4. Commit your changes with a descriptive message

Do NOT modify PRD.md or mark tasks complete - that will be handled separately.
Focus only on implementing: $task_name"

  # Temp file for AI output
  local tmpfile
  tmpfile=$(mktemp)
  
  # Run AI agent in the worktree directory
  local result=""
  local success=false
  local retry=0
  
  while [[ $retry -lt $MAX_RETRIES ]]; do
    case "$AI_ENGINE" in
      opencode)
        (
          cd "$worktree_dir"
          OPENCODE_PERMISSION='{"*":"allow"}' opencode run \
            --format json \
            "$prompt"
        ) > "$tmpfile" 2>>"$log_file"
        ;;
      cursor)
        (
          cd "$worktree_dir"
          agent --print --force \
            --output-format stream-json \
            "$prompt"
        ) > "$tmpfile" 2>>"$log_file"
        ;;
      qwen)
        (
          cd "$worktree_dir"
          qwen --output-format stream-json \
            --approval-mode yolo \
            -p "$prompt"
        ) > "$tmpfile" 2>>"$log_file"
        ;;
      droid)
        (
          cd "$worktree_dir"
          droid exec --output-format stream-json \
            --auto medium \
            "$prompt"
        ) > "$tmpfile" 2>>"$log_file"
        ;;
      codex)
        (
          cd "$worktree_dir"
          CODEX_LAST_MESSAGE_FILE="$tmpfile.last"
          rm -f "$CODEX_LAST_MESSAGE_FILE"
          codex exec --full-auto \
            --json \
            --output-last-message "$CODEX_LAST_MESSAGE_FILE" \
            "$prompt"
        ) > "$tmpfile" 2>>"$log_file"
        ;;
      *)
        (
          cd "$worktree_dir"
          claude --dangerously-skip-permissions \
            --verbose \
            -p "$prompt" \
            --output-format stream-json
        ) > "$tmpfile" 2>>"$log_file"
        ;;
    esac
    
    result=$(cat "$tmpfile" 2>/dev/null || echo "")
    
    if [[ -n "$result" ]]; then
      local error_msg
      if ! error_msg=$(check_for_errors "$result"); then
        ((retry++)) || true
        echo "API error: $error_msg (attempt $retry/$MAX_RETRIES)" >> "$log_file"
        sleep "$RETRY_DELAY"
        continue
      fi
      success=true
      break
    fi
    
    ((retry++)) || true
    echo "Retry $retry/$MAX_RETRIES after empty response" >> "$log_file"
    sleep "$RETRY_DELAY"
  done
  
  rm -f "$tmpfile"
  
  if [[ "$success" == true ]]; then
    # Parse tokens
    local parsed input_tokens output_tokens
    local CODEX_LAST_MESSAGE_FILE="${tmpfile}.last"
    parsed=$(parse_ai_result "$result")
    local token_data
    token_data=$(echo "$parsed" | sed -n '/^---TOKENS---$/,$p' | tail -3)
    input_tokens=$(echo "$token_data" | sed -n '1p')
    output_tokens=$(echo "$token_data" | sed -n '2p')
    [[ "$input_tokens" =~ ^[0-9]+$ ]] || input_tokens=0
    [[ "$output_tokens" =~ ^[0-9]+$ ]] || output_tokens=0
    rm -f "${tmpfile}.last"

    # Ensure at least one commit exists before marking success
    local commit_count
    commit_count=$(git -C "$worktree_dir" rev-list --count "$BASE_BRANCH"..HEAD 2>/dev/null || echo "0")
    [[ "$commit_count" =~ ^[0-9]+$ ]] || commit_count=0
    if [[ "$commit_count" -eq 0 ]]; then
      echo "ERROR: No new commits created; treating task as failed." >> "$log_file"
      echo "failed" > "$status_file"
      echo "0 0" > "$output_file"
      cleanup_agent_worktree "$worktree_dir" "$branch_name" "$log_file"
      return 1
    fi
    
    # Create PR if requested
    if [[ "$CREATE_PR" == true ]]; then
      (
        cd "$worktree_dir"
        git push -u origin "$branch_name" 2>>"$log_file" || true
        gh pr create \
          --base "$BASE_BRANCH" \
          --head "$branch_name" \
          --title "$task_name" \
          --body "Automated implementation by Ralphy (Agent $agent_num)" \
          ${PR_DRAFT:+--draft} 2>>"$log_file" || true
      )
    fi
    
    # Write success output
    echo "done" > "$status_file"
    echo "$input_tokens $output_tokens $branch_name" > "$output_file"
    
    # Cleanup worktree (but keep branch)
    cleanup_agent_worktree "$worktree_dir" "$branch_name" "$log_file"
    
    return 0
  else
    echo "failed" > "$status_file"
    echo "0 0" > "$output_file"
    cleanup_agent_worktree "$worktree_dir" "$branch_name" "$log_file"
    return 1
  fi
}

run_parallel_tasks() {
  log_info "Running ${BOLD}$MAX_PARALLEL parallel agents${RESET} (each in isolated worktree)..."
  
  local all_tasks=()
  
  # Get all pending tasks
  while IFS= read -r task; do
    [[ -n "$task" ]] && all_tasks+=("$task")
  done < <(get_all_tasks)
  
  if [[ ${#all_tasks[@]} -eq 0 ]]; then
    log_info "No tasks to run"
    return 2
  fi
  
  local total_tasks=${#all_tasks[@]}
  log_info "Found $total_tasks tasks to process"
  
  # Store original directory for git operations from subshells
  ORIGINAL_DIR=$(pwd)
  export ORIGINAL_DIR
  
  # Set up worktree base directory
  WORKTREE_BASE=$(mktemp -d)
  export WORKTREE_BASE
  log_debug "Worktree base: $WORKTREE_BASE"
  
  # Ensure we have a base branch set
  if [[ -z "$BASE_BRANCH" ]]; then
    BASE_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
  fi
  export BASE_BRANCH
  log_info "Base branch: $BASE_BRANCH"

  # Store original base branch for final merge (addresses Greptile review)
  # Using global variables so cleanup() can access them on interrupt
  ORIGINAL_BASE_BRANCH="$BASE_BRANCH"
  integration_branches=()  # Reset for this run

  # Export variables needed by subshell agents
  export AI_ENGINE MAX_RETRIES RETRY_DELAY PRD_SOURCE PRD_FILE CREATE_PR PR_DRAFT

  local batch_num=0
  local completed_branches=()
  local groups=("all")

  if [[ "$PRD_SOURCE" == "yaml" ]]; then
    groups=()
    while IFS= read -r group; do
      [[ -n "$group" ]] && groups+=("$group")
    done < <(yq -r '.tasks[] | select(.completed != true) | (.parallel_group // 0)' "$PRD_FILE" 2>/dev/null | sort -n | uniq)
  fi

  for group in "${groups[@]}"; do
    local tasks=()
    local group_label=""
    local group_completed_branches=()  # Track branches completed in this group

    if [[ "$PRD_SOURCE" == "yaml" ]]; then
      while IFS= read -r task; do
        [[ -n "$task" ]] && tasks+=("$task")
      done < <(get_tasks_in_group_yaml "$group")
      [[ ${#tasks[@]} -eq 0 ]] && continue
      group_label=" (group $group)"
    else
      tasks=("${all_tasks[@]}")
    fi

    local batch_start=0
    local total_group_tasks=${#tasks[@]}

    while [[ $batch_start -lt $total_group_tasks ]]; do
      ((batch_num++)) || true
      local batch_end=$((batch_start + MAX_PARALLEL))
      [[ $batch_end -gt $total_group_tasks ]] && batch_end=$total_group_tasks
      local batch_size=$((batch_end - batch_start))

      echo ""
      echo "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
      echo "${BOLD}Batch $batch_num${group_label}: Spawning $batch_size parallel agents${RESET}"
      echo "${DIM}Each agent runs in its own git worktree with isolated workspace${RESET}"
      echo "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
      echo ""

      # Setup arrays for this batch
      parallel_pids=()
      local batch_tasks=()
      local status_files=()
      local output_files=()
      local log_files=()

      # Start all agents in the batch
      for ((i = batch_start; i < batch_end; i++)); do
        local task="${tasks[$i]}"
        local agent_num=$((iteration + 1))
        ((iteration++)) || true

        local status_file=$(mktemp)
        local output_file=$(mktemp)
        local log_file=$(mktemp)

        batch_tasks+=("$task")
        status_files+=("$status_file")
        output_files+=("$output_file")
        log_files+=("$log_file")

        echo "waiting" > "$status_file"

        # Show initial status
        printf "  ${CYAN}◉${RESET} Agent %d: %s\n" "$agent_num" "${task:0:50}"

        # Run agent in background
        (
          run_parallel_agent "$task" "$agent_num" "$output_file" "$status_file" "$log_file"
        ) &
        parallel_pids+=($!)
      done

      echo ""

      # Monitor progress with a spinner
      local spinner_chars='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
      local spin_idx=0
      local start_time=$SECONDS

      while true; do
        # Check if all processes are done
        local all_done=true
        local setting_up=0
        local running=0
        local done_count=0
        local failed_count=0

        for ((j = 0; j < batch_size; j++)); do
          local pid="${parallel_pids[$j]}"
          local status_file="${status_files[$j]}"
          local status=$(cat "$status_file" 2>/dev/null || echo "waiting")

          case "$status" in
            "setting up")
              all_done=false
              ((setting_up++)) || true
              ;;
            running)
              all_done=false
              ((running++)) || true
              ;;
            done)
              ((done_count++)) || true
              ;;
            failed)
              ((failed_count++)) || true
              ;;
            *)
              # Check if process is still running
              if kill -0 "$pid" 2>/dev/null; then
                all_done=false
              fi
              ;;
          esac
        done

        [[ "$all_done" == true ]] && break

        # Update spinner
        local elapsed=$((SECONDS - start_time))
        local spin_char="${spinner_chars:$spin_idx:1}"
        spin_idx=$(( (spin_idx + 1) % ${#spinner_chars} ))

        printf "\r  ${CYAN}%s${RESET} Agents: ${BLUE}%d setup${RESET} | ${YELLOW}%d running${RESET} | ${GREEN}%d done${RESET} | ${RED}%d failed${RESET} | %02d:%02d " \
          "$spin_char" "$setting_up" "$running" "$done_count" "$failed_count" $((elapsed / 60)) $((elapsed % 60))

        sleep 0.3
      done

      # Clear the spinner line
      printf "\r%100s\r" ""

      # Wait for all processes to fully complete
      for pid in "${parallel_pids[@]}"; do
        wait "$pid" 2>/dev/null || true
      done

      # Show final status for this batch
      echo ""
      echo "${BOLD}Batch $batch_num Results:${RESET}"
      for ((j = 0; j < batch_size; j++)); do
        local task="${batch_tasks[$j]}"
        local status_file="${status_files[$j]}"
        local output_file="${output_files[$j]}"
        local log_file="${log_files[$j]}"
        local status=$(cat "$status_file" 2>/dev/null || echo "unknown")
        local agent_num=$((iteration - batch_size + j + 1))

        local icon color branch_info=""
        case "$status" in
          done)
            icon="✓"
            color="$GREEN"
            # Collect tokens and branch name
            local output_data=$(cat "$output_file" 2>/dev/null || echo "0 0")
            local in_tok=$(echo "$output_data" | awk '{print $1}')
            local out_tok=$(echo "$output_data" | awk '{print $2}')
            local branch=$(echo "$output_data" | awk '{print $3}')
            [[ "$in_tok" =~ ^[0-9]+$ ]] || in_tok=0
            [[ "$out_tok" =~ ^[0-9]+$ ]] || out_tok=0
            total_input_tokens=$((total_input_tokens + in_tok))
            total_output_tokens=$((total_output_tokens + out_tok))
            if [[ -n "$branch" ]]; then
              completed_branches+=("$branch")
              group_completed_branches+=("$branch")  # Also track per-group
              branch_info=" → ${CYAN}$branch${RESET}"
            fi

            # Mark task complete in PRD
            if [[ "$PRD_SOURCE" == "markdown" ]]; then
              mark_task_complete_markdown "$task"
            elif [[ "$PRD_SOURCE" == "yaml" ]]; then
              mark_task_complete_yaml "$task"
            elif [[ "$PRD_SOURCE" == "github" ]]; then
              mark_task_complete_github "$task"
            fi
            ;;
          failed)
            icon="✗"
            color="$RED"
            if [[ -s "$log_file" ]]; then
              branch_info=" ${DIM}(error below)${RESET}"
            fi
            ;;
          *)
            icon="?"
            color="$YELLOW"
            ;;
        esac

        printf "  ${color}%s${RESET} Agent %d: %s%s\n" "$icon" "$agent_num" "${task:0:45}" "$branch_info"

        # Show log for failed agents
        if [[ "$status" == "failed" ]] && [[ -s "$log_file" ]]; then
          echo "${DIM}    ┌─ Agent $agent_num log:${RESET}"
          sed 's/^/    │ /' "$log_file" | head -20
          local log_lines=$(wc -l < "$log_file")
          if [[ $log_lines -gt 20 ]]; then
            echo "${DIM}    │ ... ($((log_lines - 20)) more lines)${RESET}"
          fi
          echo "${DIM}    └─${RESET}"
        fi

        # Cleanup temp files
        rm -f "$status_file" "$output_file" "$log_file"
      done

      batch_start=$batch_end

      # Check if we've hit max iterations
      if [[ $MAX_ITERATIONS -gt 0 ]] && [[ $iteration -ge $MAX_ITERATIONS ]]; then
        log_warn "Reached max iterations ($MAX_ITERATIONS)"
        break
      fi
    done

    # After each parallel_group completes, merge branches into integration branch
    # so the next group sees the completed work (fixes issue #13)
    # NOTE: Uses git branch instead of git checkout to avoid changing HEAD while worktrees are active (Greptile review)
    if [[ "$PRD_SOURCE" == "yaml" ]] && [[ ${#group_completed_branches[@]} -gt 0 ]] && [[ ${#groups[@]} -gt 1 ]]; then
      local integration_branch="ralphy/integration-group-$group"
      log_info "Creating integration branch for group $group: $integration_branch"

      # Create integration branch from current BASE_BRANCH without switching HEAD
      # This avoids state confusion while worktrees are active
      if git branch "$integration_branch" "$BASE_BRANCH" >/dev/null 2>&1; then
        local merge_failed=false
        local current_head
        current_head=$(git symbolic-ref --short HEAD 2>/dev/null || echo "")

        # Temporarily checkout the integration branch to perform merges
        if git checkout "$integration_branch" >/dev/null 2>&1; then
          for branch in "${group_completed_branches[@]}"; do
            log_debug "Merging $branch into $integration_branch"
            if ! git merge --no-edit "$branch" >/dev/null 2>&1; then
              log_warn "Conflict merging $branch into integration branch"
              # Abort the merge to leave branch in clean state (Greptile review)
              git merge --abort >/dev/null 2>&1 || true
              merge_failed=true
              break
            fi
          done

          # Return to original HEAD to avoid state confusion
          if [[ -n "$current_head" ]]; then
            git checkout "$current_head" >/dev/null 2>&1 || git checkout "$ORIGINAL_BASE_BRANCH" >/dev/null 2>&1 || true
          else
            git checkout "$ORIGINAL_BASE_BRANCH" >/dev/null 2>&1 || true
          fi

          if [[ "$merge_failed" == false ]]; then
            # Update BASE_BRANCH for next group
            BASE_BRANCH="$integration_branch"
            export BASE_BRANCH
            integration_branches+=("$integration_branch")  # Track for cleanup
            log_info "Updated BASE_BRANCH to $integration_branch for next group"
          else
            # Delete failed integration branch
            git branch -D "$integration_branch" >/dev/null 2>&1 || true
            log_warn "Integration merge failed; next group will branch from current BASE_BRANCH ($BASE_BRANCH)"
          fi
        else
          # Couldn't checkout, clean up the branch
          git branch -D "$integration_branch" >/dev/null 2>&1 || true
          log_warn "Could not checkout integration branch; next group will branch from current BASE_BRANCH ($BASE_BRANCH)"
        fi
      else
        log_warn "Could not create integration branch; next group will branch from current BASE_BRANCH ($BASE_BRANCH)"
      fi
    fi

    if [[ $MAX_ITERATIONS -gt 0 ]] && [[ $iteration -ge $MAX_ITERATIONS ]]; then
      break
    fi
  done
  
  # Cleanup worktree base
  if ! find "$WORKTREE_BASE" -maxdepth 1 -type d -name 'agent-*' -print -quit 2>/dev/null | grep -q .; then
    rm -rf "$WORKTREE_BASE" 2>/dev/null || true
  else
    log_warn "Preserving worktree base with dirty agents: $WORKTREE_BASE"
  fi
  
  # Handle completed branches
  if [[ ${#completed_branches[@]} -gt 0 ]]; then
    echo ""
    echo "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"

    if [[ "$CREATE_PR" == true ]]; then
      # PRs were created, just show the branches
      echo "${BOLD}Branches created by agents:${RESET}"
      for branch in "${completed_branches[@]}"; do
        echo "  ${CYAN}•${RESET} $branch"
      done
    else
      # Auto-merge branches into ORIGINAL base branch (not integration branches)
      # This addresses Greptile review: final merge should use original base, not integration branch
      local final_target="$ORIGINAL_BASE_BRANCH"

      # If we used integration branches, the final integration branch contains all the work
      # We just need to merge the final integration branch into the original base
      if [[ ${#integration_branches[@]} -gt 0 ]]; then
        local final_integration="${integration_branches[-1]}"  # Last integration branch
        echo "${BOLD}Merging integration branch into ${final_target}...${RESET}"
        echo ""

        if ! git checkout "$final_target" >/dev/null 2>&1; then
          log_warn "Could not checkout $final_target; leaving integration branch unmerged."
          echo "${BOLD}Integration branch: ${CYAN}$final_integration${RESET}"
          return 0
        fi

        printf "  Merging ${CYAN}%s${RESET}..." "$final_integration"
        if git merge --no-edit "$final_integration" >/dev/null 2>&1; then
          printf " ${GREEN}✓${RESET}\n"

          # Cleanup all integration branches after successful merge (Greptile review)
          echo ""
          echo "${DIM}Cleaning up integration branches...${RESET}"
          for int_branch in "${integration_branches[@]}"; do
            git branch -D "$int_branch" >/dev/null 2>&1 && \
              echo "  ${DIM}Deleted ${int_branch}${RESET}" || true
          done

          # Also cleanup the individual agent branches that were merged into integration
          echo "${DIM}Cleaning up agent branches...${RESET}"
          for branch in "${completed_branches[@]}"; do
            git branch -D "$branch" >/dev/null 2>&1 && \
              echo "  ${DIM}Deleted ${branch}${RESET}" || true
          done
        else
          printf " ${YELLOW}conflict${RESET}\n"
          git merge --abort >/dev/null 2>&1 || true
          log_warn "Could not merge integration branch; leaving branches for manual resolution."
          echo "${BOLD}Integration branch: ${CYAN}$final_integration${RESET}"
          echo "${BOLD}Original base: ${CYAN}$final_target${RESET}"
        fi

        return 0
      fi

      # No integration branches - merge individual agent branches directly
      echo "${BOLD}Merging agent branches into ${final_target}...${RESET}"
      echo ""

      if ! git checkout "$final_target" >/dev/null 2>&1; then
        log_warn "Could not checkout $final_target; leaving agent branches unmerged."
        echo "${BOLD}Branches created by agents:${RESET}"
        for branch in "${completed_branches[@]}"; do
          echo "  ${CYAN}•${RESET} $branch"
        done
        return 0
      fi

      local merge_failed=()
      
      for branch in "${completed_branches[@]}"; do
        printf "  Merging ${CYAN}%s${RESET}..." "$branch"
        
        # Attempt to merge
        if git merge --no-edit "$branch" >/dev/null 2>&1; then
          printf " ${GREEN}✓${RESET}\n"
          # Delete the branch after successful merge
          git branch -d "$branch" >/dev/null 2>&1 || true
        else
          printf " ${YELLOW}conflict${RESET}"
          merge_failed+=("$branch")
          # Don't abort yet - try AI resolution
        fi
      done
      
      # Use AI to resolve merge conflicts
      if [[ ${#merge_failed[@]} -gt 0 ]]; then
        echo ""
        echo "${BOLD}Using AI to resolve ${#merge_failed[@]} merge conflict(s)...${RESET}"
        echo ""
        
        local still_failed=()
        
        for branch in "${merge_failed[@]}"; do
          printf "  Resolving ${CYAN}%s${RESET}..." "$branch"
          
          # Get list of conflicted files
          local conflicted_files
          conflicted_files=$(git diff --name-only --diff-filter=U 2>/dev/null)
          
          if [[ -z "$conflicted_files" ]]; then
            # No conflicts found (maybe already resolved or aborted)
            git merge --abort 2>/dev/null || true
            git merge --no-edit "$branch" >/dev/null 2>&1 || {
              printf " ${RED}✗${RESET}\n"
              still_failed+=("$branch")
              git merge --abort 2>/dev/null || true
              continue
            }
            printf " ${GREEN}✓${RESET}\n"
            git branch -d "$branch" >/dev/null 2>&1 || true
            continue
          fi
          
          # Build prompt for AI to resolve conflicts
          local resolve_prompt="You are resolving a git merge conflict. The following files have conflicts:

$conflicted_files

For each conflicted file:
1. Read the file to see the conflict markers (<<<<<<< HEAD, =======, >>>>>>> branch)
2. Understand what both versions are trying to do
3. Edit the file to resolve the conflict by combining both changes intelligently
4. Remove all conflict markers
5. Make sure the resulting code is valid and compiles

After resolving all conflicts:
1. Run 'git add' on each resolved file
2. Run 'git commit --no-edit' to complete the merge

Be careful to preserve functionality from BOTH branches. The goal is to integrate all features."

          # Run AI to resolve conflicts
          local resolve_tmpfile
          resolve_tmpfile=$(mktemp)
          
          case "$AI_ENGINE" in
            opencode)
              OPENCODE_PERMISSION='{"*":"allow"}' opencode run \
                --format json \
                "$resolve_prompt" > "$resolve_tmpfile" 2>&1
              ;;
            cursor)
              agent --print --force \
                --output-format stream-json \
                "$resolve_prompt" > "$resolve_tmpfile" 2>&1
              ;;
            qwen)
              qwen --output-format stream-json \
                --approval-mode yolo \
                -p "$resolve_prompt" > "$resolve_tmpfile" 2>&1
              ;;
            droid)
              droid exec --output-format stream-json \
                --auto medium \
                "$resolve_prompt" > "$resolve_tmpfile" 2>&1
              ;;
            codex)
              codex exec --full-auto \
                --json \
                "$resolve_prompt" > "$resolve_tmpfile" 2>&1
              ;;
            *)
              claude --dangerously-skip-permissions \
                -p "$resolve_prompt" \
                --output-format stream-json > "$resolve_tmpfile" 2>&1
              ;;
          esac
          
          rm -f "$resolve_tmpfile"
          
          # Check if merge was completed
          if ! git diff --name-only --diff-filter=U 2>/dev/null | grep -q .; then
            # No more conflicts - merge succeeded
            printf " ${GREEN}✓ (AI resolved)${RESET}\n"
            git branch -d "$branch" >/dev/null 2>&1 || true
          else
            # Still has conflicts
            printf " ${RED}✗ (AI couldn't resolve)${RESET}\n"
            still_failed+=("$branch")
            git merge --abort 2>/dev/null || true
          fi
        done
        
        if [[ ${#still_failed[@]} -gt 0 ]]; then
          echo ""
          echo "${YELLOW}Some conflicts could not be resolved automatically:${RESET}"
          for branch in "${still_failed[@]}"; do
            echo "  ${YELLOW}•${RESET} $branch"
          done
          echo ""
          echo "${DIM}Resolve conflicts manually: git merge <branch>${RESET}"
        else
          echo ""
          echo "${GREEN}All branches merged successfully!${RESET}"
        fi
      else
        echo ""
        echo "${GREEN}All branches merged successfully!${RESET}"
      fi
    fi
  fi
  
  return 0
}

# ============================================
# SUMMARY
# ============================================

show_summary() {
  echo ""
  echo "${BOLD}============================================${RESET}"
  echo "${GREEN}PRD complete!${RESET} Finished $iteration task(s)."
  echo "${BOLD}============================================${RESET}"
  echo ""
  echo "${BOLD}>>> Cost Summary${RESET}"
  
  # Cursor and Droid don't provide token usage, but do provide duration
  if [[ "$AI_ENGINE" == "cursor" ]] || [[ "$AI_ENGINE" == "droid" ]]; then
    echo "${DIM}Token usage not available (CLI doesn't expose this data)${RESET}"
    if [[ "$total_duration_ms" -gt 0 ]]; then
      local dur_sec=$((total_duration_ms / 1000))
      local dur_min=$((dur_sec / 60))
      local dur_sec_rem=$((dur_sec % 60))
      if [[ "$dur_min" -gt 0 ]]; then
        echo "Total API time: ${dur_min}m ${dur_sec_rem}s"
      else
        echo "Total API time: ${dur_sec}s"
      fi
    fi
  else
    echo "Input tokens:  $total_input_tokens"
    echo "Output tokens: $total_output_tokens"
    echo "Total tokens:  $((total_input_tokens + total_output_tokens))"
    
    # Show actual cost if available (OpenCode provides this), otherwise estimate
    if [[ "$AI_ENGINE" == "opencode" ]] && command -v bc &>/dev/null; then
      local has_actual_cost
      has_actual_cost=$(echo "$total_actual_cost > 0" | bc 2>/dev/null || echo "0")
      if [[ "$has_actual_cost" == "1" ]]; then
        echo "Actual cost:   \$${total_actual_cost}"
      else
        local cost
        cost=$(calculate_cost "$total_input_tokens" "$total_output_tokens")
        echo "Est. cost:     \$$cost"
      fi
    else
      local cost
      cost=$(calculate_cost "$total_input_tokens" "$total_output_tokens")
      echo "Est. cost:     \$$cost"
    fi
  fi
  
  # Show branches if created
  if [[ -n "${task_branches[*]+"${task_branches[*]}"}" ]]; then
    echo ""
    echo "${BOLD}>>> Branches Created${RESET}"
    for branch in "${task_branches[@]}"; do
      echo "  - $branch"
    done
  fi
  
  echo "${BOLD}============================================${RESET}"
}

# ============================================
# MAIN
# ============================================

main() {
  parse_args "$@"

  # Handle --init mode
  if [[ "$INIT_MODE" == true ]]; then
    init_ralphy_config
    exit 0
  fi

  # Handle --config mode
  if [[ "$SHOW_CONFIG" == true ]]; then
    show_ralphy_config
    exit 0
  fi

  # Handle --add-rule
  if [[ -n "$ADD_RULE" ]]; then
    add_ralphy_rule "$ADD_RULE"
    exit 0
  fi

  # Handle single-task (brownfield) mode
  if [[ -n "$SINGLE_TASK" ]]; then
    # Set up cleanup trap
    trap cleanup EXIT
    trap 'exit 130' INT TERM HUP

    # Check basic requirements (AI engine, git)
    case "$AI_ENGINE" in
      claude) command -v claude &>/dev/null || { log_error "Claude Code CLI not found"; exit 1; } ;;
      opencode) command -v opencode &>/dev/null || { log_error "OpenCode CLI not found"; exit 1; } ;;
      cursor) command -v agent &>/dev/null || { log_error "Cursor agent CLI not found"; exit 1; } ;;
      codex) command -v codex &>/dev/null || { log_error "Codex CLI not found"; exit 1; } ;;
      qwen) command -v qwen &>/dev/null || { log_error "Qwen-Code CLI not found"; exit 1; } ;;
      droid) command -v droid &>/dev/null || { log_error "Factory Droid CLI not found"; exit 1; } ;;
    esac

    if ! git rev-parse --git-dir >/dev/null 2>&1; then
      log_error "Not a git repository"
      exit 1
    fi

    # Show brownfield banner
    echo "${BOLD}============================================${RESET}"
    echo "${BOLD}Ralphy${RESET} - Single Task Mode"
    local engine_display
    case "$AI_ENGINE" in
      opencode) engine_display="${CYAN}OpenCode${RESET}" ;;
      cursor) engine_display="${YELLOW}Cursor Agent${RESET}" ;;
      codex) engine_display="${BLUE}Codex${RESET}" ;;
      qwen) engine_display="${GREEN}Qwen-Code${RESET}" ;;
      droid) engine_display="${MAGENTA}Factory Droid${RESET}" ;;
      *) engine_display="${MAGENTA}Claude Code${RESET}" ;;
    esac
    echo "Engine: $engine_display"
    if [[ -d "$RALPHY_DIR" ]]; then
      echo "Config: ${GREEN}$RALPHY_DIR/${RESET}"
    else
      echo "Config: ${DIM}none (run --init to configure)${RESET}"
    fi
    echo "${BOLD}============================================${RESET}"

    run_brownfield_task "$SINGLE_TASK"
    exit $?
  fi

  if [[ "$DRY_RUN" == true ]] && [[ "$MAX_ITERATIONS" -eq 0 ]]; then
    MAX_ITERATIONS=1
  fi

  # Set up cleanup trap
  trap cleanup EXIT
  trap 'exit 130' INT TERM HUP

  # Check requirements
  check_requirements

  # Show banner
  echo "${BOLD}============================================${RESET}"
  echo "${BOLD}Ralphy${RESET} - Running until PRD is complete"
  local engine_display
  case "$AI_ENGINE" in
    opencode) engine_display="${CYAN}OpenCode${RESET}" ;;
    cursor) engine_display="${YELLOW}Cursor Agent${RESET}" ;;
    codex) engine_display="${BLUE}Codex${RESET}" ;;
    qwen) engine_display="${GREEN}Qwen-Code${RESET}" ;;
    droid) engine_display="${MAGENTA}Factory Droid${RESET}" ;;
    *) engine_display="${MAGENTA}Claude Code${RESET}" ;;
  esac
  echo "Engine: $engine_display"
  echo "Source: ${CYAN}$PRD_SOURCE${RESET} (${PRD_FILE:-$GITHUB_REPO})"
  if [[ -d "$RALPHY_DIR" ]]; then
    echo "Config: ${GREEN}$RALPHY_DIR/${RESET} (rules loaded)"
  fi

  local mode_parts=()
  [[ "$SKIP_TESTS" == true ]] && mode_parts+=("no-tests")
  [[ "$SKIP_LINT" == true ]] && mode_parts+=("no-lint")
  [[ "$DRY_RUN" == true ]] && mode_parts+=("dry-run")
  [[ "$PARALLEL" == true ]] && mode_parts+=("parallel:$MAX_PARALLEL")
  [[ "$BRANCH_PER_TASK" == true ]] && mode_parts+=("branch-per-task")
  [[ "$CREATE_PR" == true ]] && mode_parts+=("create-pr")
  [[ $MAX_ITERATIONS -gt 0 ]] && mode_parts+=("max:$MAX_ITERATIONS")
  
  if [[ ${#mode_parts[@]} -gt 0 ]]; then
    echo "Mode: ${YELLOW}${mode_parts[*]}${RESET}"
  fi
  echo "${BOLD}============================================${RESET}"

  # Run in parallel or sequential mode
  if [[ "$PARALLEL" == true ]]; then
    run_parallel_tasks
    show_summary
    notify_done
    exit 0
  fi

  # Sequential main loop
  while true; do
    ((iteration++)) || true
    local result_code=0
    run_single_task "" "$iteration" || result_code=$?
    
    case $result_code in
      0)
        # Success, continue
        ;;
      1)
        # Error, but continue to next task
        log_warn "Task failed after $MAX_RETRIES attempts, continuing..."
        ;;
      2)
        # All tasks complete
        show_summary
        notify_done
        exit 0
        ;;
    esac
    
    # Check max iterations
    if [[ $MAX_ITERATIONS -gt 0 ]] && [[ $iteration -ge $MAX_ITERATIONS ]]; then
      log_warn "Reached max iterations ($MAX_ITERATIONS)"
      show_summary
      notify_done "Ralphy stopped after $MAX_ITERATIONS iterations"
      exit 0
    fi
    
    # Small delay between iterations
    sleep 1
  done
}

# Run main
main "$@"
