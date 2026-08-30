#!/usr/bin/env bash
# Idempotent Cloud Agent bootstrap for the Better-T-Stack monorepo.
# Installs the pinned toolchain (Node 24 + Bun 1.4), refreshes workspace
# dependencies, and builds the internal packages the CLI and web app import.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# --- Node 24 (repo requires engines.node "24.x"; tsdown needs native TS config
# support only available on Node >= 24.11.1 when turbo runs it under node). ---
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1090
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 24 >/dev/null
nvm alias default 24 >/dev/null
export PATH="$(dirname "$(nvm which 24)"):$PATH"

# --- Bun 1.4.0 (pinned via packageManager) ---
export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
export PATH="$BUN_INSTALL/bin:$PATH"
if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash -s "bun-v1.4.0"
fi

node --version
bun --version

# --- Dependencies ---
# --ignore-scripts skips the root `prepare` (lefthook install), which fails in
# Cloud Agents because a custom git core.hooksPath is set. The only other
# lifecycle script we need (apps/web postinstall: fumadocs-mdx) is run manually.
LEFTHOOK=0 bun install --frozen-lockfile --ignore-scripts

# Generate Fumadocs source map for the docs site (apps/web postinstall).
(cd apps/web && bun run fumadocs-mdx)

# Build internal packages that both apps import at dev/build time.
(cd packages/types && bun run build)
(cd packages/template-generator && bun run build)
(cd apps/cli && bun run build)

echo "Cloud Agent install complete."
