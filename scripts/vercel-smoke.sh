#!/bin/bash
# Live smoke test for Vercel deployments: scaffolds each combination, validates
# the generated vercel.json and env-sync script, builds the web service with the
# exact generated buildCommand, and boots the server entrypoint locally.
# Runs fully offline (no Vercel account needed). Usage: bash scripts/vercel-smoke.sh
set -u
REPO=$(cd "$(dirname "$0")/.." && pwd)
SCRATCH=$REPO/.scratch-vercel-smoke
RESULTS=${RESULTS:-/tmp/vercel-smoke-results.txt}
SRV_PORT=3000
mkdir -p "$SCRATCH"
: > "$RESULTS"

# name|flags|web_kind(vite|next|astro|none)|server_runtime(bun|node|none)|vercel_guard(0|1)
# vercel_guard=1 when the server entrypoint skips listen() under VERCEL=1
# (hono node, elysia bun/node); hono bun auto-serves and express/fastify rely on
# Vercel's zero-config listen interception, so they always bind locally.
TESTS=(
"tsr-hono-bun-combined|--frontend tanstack-router --backend hono --runtime bun --database sqlite --orm drizzle --db-setup none --web-deploy vercel --server-deploy vercel --api trpc --auth better-auth --payments none --addons none --examples none --package-manager bun|vite|bun|0"
"next-hono-node-combined|--frontend next --backend hono --runtime node --database none --orm none --db-setup none --web-deploy vercel --server-deploy vercel --api trpc --auth none --payments none --addons none --examples none --package-manager bun|next|node|1"
"next-self-web-only|--frontend next --backend self --runtime none --database none --orm none --db-setup none --web-deploy vercel --server-deploy none --api orpc --auth none --payments none --addons none --examples none --package-manager bun|next|none|0"
"astro-elysia-bun-combined|--frontend astro --backend elysia --runtime bun --database none --orm none --db-setup none --web-deploy vercel --server-deploy vercel --api orpc --auth none --payments none --addons none --examples none --package-manager bun|astro|bun|1"
"elysia-node-server-only|--frontend none --backend elysia --runtime node --database none --orm none --db-setup none --web-deploy none --server-deploy vercel --api trpc --auth none --payments none --addons none --examples none --package-manager bun|none|node|1"
"express-node-server-only|--frontend none --backend express --runtime node --database none --orm none --db-setup none --web-deploy none --server-deploy vercel --api orpc --auth none --payments none --addons none --examples none --package-manager bun|none|node|0"
)

wait_for_server() {
  for _ in $(seq 1 30); do
    if curl -sf -m 2 "http://localhost:$SRV_PORT/" -o /tmp/vercel-smoke-resp.txt 2>/dev/null; then return 0; fi
    sleep 0.5
  done
  return 1
}

stop_server() {
  if [ -n "${SERVER_PID:-}" ]; then
    kill "$SERVER_PID" 2>/dev/null
    wait "$SERVER_PID" 2>/dev/null
  fi
  sleep 1
  lsof -ti tcp:$SRV_PORT 2>/dev/null | xargs kill 2>/dev/null
  SERVER_PID=""
}

i=0
for entry in "${TESTS[@]}"; do
  i=$((i+1))
  IFS='|' read -r name flags web_kind server_runtime vercel_guard <<< "$entry"
  dir="$SCRATCH/$name"
  echo "=== [$i/${#TESTS[@]}] $name ===" | tee -a "$RESULTS"
  rm -rf "$dir"
  cd "$SCRATCH" || { echo "RESULT $name: FAIL (cd scratch)" | tee -a "$RESULTS"; continue; }
  bun "$REPO/apps/cli/src/cli.ts" "$name" $flags --install --no-git > "/tmp/vercel-smoke-$name-scaffold.log" 2>&1
  cd "$dir" 2>/dev/null || { echo "RESULT $name: FAIL (scaffold, log: /tmp/vercel-smoke-$name-scaffold.log)" | tee -a "$RESULTS"; continue; }

  fail=""

  # vercel.json must exist, parse, and contain the expected services
  node -e "
    const j = require('./vercel.json');
    const wantWeb = '$web_kind' !== 'none';
    const wantServer = '$server_runtime' !== 'none';
    if (wantWeb !== Boolean(j.services?.web)) throw new Error('web service mismatch');
    if (wantServer !== Boolean(j.services?.server)) throw new Error('server service mismatch');
    if (!Array.isArray(j.rewrites) || j.rewrites.length === 0) throw new Error('missing rewrites');
  " 2>>"/tmp/vercel-smoke-$name-config.log" || fail="$fail vercel.json"

  # env sync script must exist and parse
  if [ ! -f scripts/sync-vercel-env.ts ]; then
    fail="$fail sync-script-missing"
  else
    bun build scripts/sync-vercel-env.ts --target=node > /dev/null 2>>"/tmp/vercel-smoke-$name-config.log" || fail="$fail sync-script-parse"
  fi

  # build the web service with the exact generated buildCommand
  if [ "$web_kind" != "none" ] && [ -z "$fail" ]; then
    build_cmd=$(node -e "console.log(require('./vercel.json').services.web.buildCommand ?? 'bun run build')")
    (cd apps/web && bash -c "$build_cmd") > "/tmp/vercel-smoke-$name-webbuild.log" 2>&1 || fail="$fail web-build"
    case "$web_kind" in
      vite)  [ -f apps/web/dist/index.html ] || fail="$fail web-output" ;;
      next)  [ -d apps/web/.next ] || fail="$fail web-output" ;;
      astro) [ -f apps/web/.vercel/output/config.json ] || fail="$fail web-output(.vercel/output)" ;;
    esac
  fi

  # boot the server entrypoint locally and probe it
  if [ "$server_runtime" != "none" ] && [ -z "$fail" ]; then
    cd apps/server || fail="$fail cd-server"
    if [ "$server_runtime" = "bun" ]; then
      bun run src/index.ts > "/tmp/vercel-smoke-$name-server.log" 2>&1 &
    else
      "$dir/node_modules/.bin/tsx" src/index.ts > "/tmp/vercel-smoke-$name-server.log" 2>&1 &
    fi
    SERVER_PID=$!
    if wait_for_server; then
      grep -q "OK" /tmp/vercel-smoke-resp.txt || fail="$fail server-body"
    else
      fail="$fail server-no-listen"
    fi
    stop_server

    # with VERCEL=1 the guarded entrypoints must export without binding
    if [ "$vercel_guard" = "1" ]; then
      if [ "$server_runtime" = "bun" ]; then
        VERCEL=1 bun run src/index.ts > /dev/null 2>&1 &
      else
        VERCEL=1 "$dir/node_modules/.bin/tsx" src/index.ts > /dev/null 2>&1 &
      fi
      SERVER_PID=$!
      sleep 3
      curl -sf -m 2 "http://localhost:$SRV_PORT/" > /dev/null 2>&1 && fail="$fail vercel-guard-bound"
      stop_server
    fi
    cd "$dir" || true
  fi

  if [ -z "$fail" ]; then
    echo "RESULT $name: PASS" | tee -a "$RESULTS"
  else
    echo "RESULT $name: FAIL ($fail)" | tee -a "$RESULTS"
    tail -15 "/tmp/vercel-smoke-$name-webbuild.log" "/tmp/vercel-smoke-$name-server.log" 2>/dev/null >> "$RESULTS"
  fi
done

echo "=== DONE ===" | tee -a "$RESULTS"
pass=$(grep -c "RESULT.*: PASS" "$RESULTS")
total=${#TESTS[@]}
echo "$pass/$total passed" | tee -a "$RESULTS"
grep "RESULT.*FAIL" "$RESULTS"
[ "$pass" = "$total" ]
