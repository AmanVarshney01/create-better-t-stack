#!/bin/bash
# Ralph - Autonomous AI agent loop for Claude Code
# Based on https://github.com/snarktank/ralph
# Adapted for Claude Code CLI (using patterns from frankbria/ralph-claude-code)
#
# Usage: ./scripts/ralph/ralph.sh [max_iterations] [timeout_seconds]
#
# Requirements:
#   - Claude Code CLI installed: npm install -g @anthropic-ai/claude-code
#   - jq installed: brew install jq (macOS) or apt install jq (Linux)

set -e

MAX_ITERATIONS=${1:-10}
TIMEOUT_SECONDS=${2:-600}  # 10 minute timeout per iteration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
ARCHIVE_DIR="$SCRIPT_DIR/archive"
LAST_BRANCH_FILE="$SCRIPT_DIR/.last-branch"
PROMPT_FILE="$SCRIPT_DIR/prompt.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  🤖 Ralph - Autonomous Agent Loop for Claude Code    ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
if ! command -v claude &> /dev/null; then
    echo -e "${RED}Error: Claude Code CLI is not installed.${NC}"
    echo ""
    echo "Install it with:"
    echo "  npm install -g @anthropic-ai/claude-code"
    echo ""
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is not installed.${NC}"
    echo ""
    echo "Install it with:"
    echo "  macOS: brew install jq"
    echo "  Linux: apt install jq"
    echo ""
    exit 1
fi

if ! command -v timeout &> /dev/null; then
    echo -e "${RED}Error: timeout command is not available.${NC}"
    echo ""
    echo "On macOS, install coreutils:"
    echo "  brew install coreutils"
    echo "  Then use 'gtimeout' or add coreutils to PATH"
    echo ""
    exit 1
fi

if [ ! -f "$PRD_FILE" ]; then
    echo -e "${RED}Error: prd.json not found at $PRD_FILE${NC}"
    echo ""
    echo "Create a prd.json file first. See prd.json.example for the format."
    echo ""
    exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
    echo -e "${RED}Error: prompt.md not found at $PROMPT_FILE${NC}"
    exit 1
fi

# Archive previous run if branch changed
if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ]; then
    CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
    LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")

    if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
        DATE=$(date +%Y-%m-%d)
        FOLDER_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
        ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"

        echo -e "${YELLOW}📦 Archiving previous run: $LAST_BRANCH${NC}"
        mkdir -p "$ARCHIVE_FOLDER"
        [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$ARCHIVE_FOLDER/"
        [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/"
        echo -e "${GREEN}   Archived to: $ARCHIVE_FOLDER${NC}"
        echo ""

        # Reset progress file for new run
        echo "# Ralph Progress Log" > "$PROGRESS_FILE"
        echo "Started: $(date)" >> "$PROGRESS_FILE"
        echo "---" >> "$PROGRESS_FILE"
    fi
fi

# Track current branch
if [ -f "$PRD_FILE" ]; then
    CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
    if [ -n "$CURRENT_BRANCH" ]; then
        echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
    fi
fi

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
    echo "# Ralph Progress Log" > "$PROGRESS_FILE"
    echo "Started: $(date)" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
fi

# Read project info
PROJECT_NAME=$(jq -r '.project // "Unknown"' "$PRD_FILE")
BRANCH_NAME=$(jq -r '.branchName // "main"' "$PRD_FILE")
DESCRIPTION=$(jq -r '.description // ""' "$PRD_FILE")

echo -e "📋 Project: ${GREEN}$PROJECT_NAME${NC}"
echo -e "🌿 Branch: ${GREEN}$BRANCH_NAME${NC}"
echo -e "📝 Description: $DESCRIPTION"
echo ""

# Show remaining stories
REMAINING=$(jq '[.userStories[] | select(.passes == false)] | length' "$PRD_FILE")
TOTAL=$(jq '.userStories | length' "$PRD_FILE")
echo -e "📊 Stories: ${YELLOW}$REMAINING remaining${NC} of $TOTAL total"
echo -e "🔄 Max iterations: $MAX_ITERATIONS"
echo -e "⏱️  Timeout per iteration: ${TIMEOUT_SECONDS}s"
echo ""

# Change to project root
cd "$PROJECT_ROOT"

for i in $(seq 1 $MAX_ITERATIONS); do
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  🔄 Ralph Iteration $i of $MAX_ITERATIONS${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

    # Check remaining stories before starting
    REMAINING=$(jq '[.userStories[] | select(.passes == false)] | length' "$PRD_FILE")
    if [ "$REMAINING" -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ All stories are complete!${NC}"
        exit 0
    fi

    # Get next story info for display
    NEXT_STORY=$(jq -r '[.userStories[] | select(.passes == false)] | sort_by(.priority) | .[0] | "\(.id): \(.title)"' "$PRD_FILE")
    echo -e "📌 Next story: ${YELLOW}$NEXT_STORY${NC}"
    echo ""
    echo -e "${CYAN}Starting Claude Code...${NC}"
    echo ""

    # Run Claude Code with the ralph prompt
    # -p: Pass prompt content directly
    # --allowedTools: Pre-approve specific tools to avoid permission prompts
    # --dangerously-skip-permissions: Skip all permission prompts (user requested)

    PROMPT_CONTENT=$(cat "$PROMPT_FILE")

    echo -e "${CYAN}Running Claude Code with timeout of ${TIMEOUT_SECONDS}s...${NC}"

    # Run with timeout to prevent hanging forever
    # Using --dangerously-skip-permissions for truly autonomous operation
    OUTPUT=$(timeout "${TIMEOUT_SECONDS}s" claude \
        -p "$PROMPT_CONTENT" \
        --dangerously-skip-permissions \
        2>&1 | tee /dev/stderr) || {
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 124 ]; then
            echo -e "${YELLOW}⚠️  Iteration timed out after ${TIMEOUT_SECONDS}s${NC}"
        else
            echo -e "${YELLOW}⚠️  Claude exited with code $EXIT_CODE${NC}"
        fi
    }

    # Check for completion signal
    if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
        echo ""
        echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}  ✅ Ralph completed all tasks!${NC}"
        echo -e "${GREEN}  🎉 Finished at iteration $i of $MAX_ITERATIONS${NC}"
        echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
        exit 0
    fi

    # Show updated status
    REMAINING=$(jq '[.userStories[] | select(.passes == false)] | length' "$PRD_FILE")
    COMPLETED=$((TOTAL - REMAINING))
    echo ""
    echo -e "📊 Progress: ${GREEN}$COMPLETED/$TOTAL stories complete${NC}"

    echo ""
    echo "⏳ Iteration $i complete. Starting next iteration in 3 seconds..."
    sleep 3
done

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  ⚠️  Ralph reached max iterations ($MAX_ITERATIONS)${NC}"
echo -e "${YELLOW}  📝 Not all tasks completed.${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "Check progress: cat $PROGRESS_FILE"
echo "Run again with: ./scripts/ralph/ralph.sh [more_iterations]"
exit 1
