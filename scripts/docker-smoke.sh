#!/bin/bash
# Live smoke test for Docker deployments: scaffolds each combination, builds
# the images, starts the stack, and probes the running services.
# Requires a running Docker daemon. Usage: bash scripts/docker-smoke.sh
set -u
REPO=$(cd "$(dirname "$0")/.." && pwd)
SCRATCH=$REPO/.scratch-docker-smoke
RESULTS=${RESULTS:-/tmp/docker-smoke-results.txt}
mkdir -p "$SCRATCH"
: > "$RESULTS"

sedi() { if sed --version >/dev/null 2>&1; then sed -i "$@"; else sed -i '' "$@"; fi; }

# name|flags|web_port_internal(3001|80|none)|has_server|spa(0|1)
TESTS=(
"next-hono-node-pnpm|--frontend next --backend hono --runtime node --database postgres --orm drizzle --db-setup docker --web-deploy docker --server-deploy docker --api trpc --auth better-auth --payments none --addons turborepo --examples none --package-manager pnpm|3001|1|0"
"nuxt-fastify-node-pnpm|--frontend nuxt --backend fastify --runtime node --database none --orm none --db-setup none --web-deploy docker --server-deploy docker --api orpc --auth none --payments none --addons none --examples none --package-manager pnpm|3001|1|0"
"nuxt-express-node-npm|--frontend nuxt --backend express --runtime node --database postgres --orm drizzle --db-setup docker --web-deploy docker --server-deploy docker --api orpc --auth none --payments none --addons none --examples none --package-manager npm|3001|1|0"
"svelte-self-npm|--frontend svelte --backend self --runtime none --database postgres --orm drizzle --db-setup docker --web-deploy docker --server-deploy none --api orpc --auth better-auth --payments none --addons none --examples none --package-manager npm|3001|0|0"
"astro-elysia-bun-bun|--frontend astro --backend elysia --runtime bun --database none --orm none --db-setup none --web-deploy docker --server-deploy docker --api orpc --auth none --payments none --addons none --examples none --package-manager bun|3001|1|0"
"react-router-npm|--frontend react-router --backend none --runtime none --database none --orm none --db-setup none --web-deploy docker --server-deploy none --api none --auth none --payments none --addons none --examples none --package-manager npm|80|0|1"
"tanstack-router-hono-bun-bun|--frontend tanstack-router --backend hono --runtime bun --database postgres --orm drizzle --db-setup docker --web-deploy docker --server-deploy docker --api trpc --auth better-auth --payments none --addons turborepo --examples none --package-manager bun|80|1|1"
"tanstack-start-express-node-pnpm|--frontend tanstack-start --backend express --runtime node --database none --orm none --db-setup none --web-deploy docker --server-deploy docker --api orpc --auth none --payments none --addons none --examples none --package-manager pnpm|3001|1|0"
"solid-bun|--frontend solid --backend none --runtime none --database none --orm none --db-setup none --web-deploy docker --server-deploy none --api none --auth none --payments none --addons none --examples none --package-manager bun|80|0|1"
"mongo-hono-bun-bun|--frontend tanstack-router --backend hono --runtime bun --database mongodb --orm mongoose --db-setup docker --web-deploy docker --server-deploy docker --api orpc --auth none --payments none --addons none --examples none --package-manager bun|80|1|1"
"mysql-elysia-bun-prisma|--frontend tanstack-start --backend elysia --runtime bun --database mysql --orm prisma --db-setup docker --web-deploy docker --server-deploy docker --api orpc --auth better-auth --payments none --addons turborepo --examples none --package-manager bun|3001|1|0"
"fastify-node-server-only-npm|--frontend none --backend fastify --runtime node --database postgres --orm drizzle --db-setup docker --web-deploy none --server-deploy docker --api orpc --auth none --payments none --addons none --examples none --package-manager npm|none|1|0"
"nuxt-self-bun|--frontend nuxt --backend self --runtime none --database postgres --orm drizzle --db-setup docker --web-deploy docker --server-deploy none --api orpc --auth better-auth --payments none --addons none --examples none --package-manager bun|3001|0|0"
)

i=0
for entry in "${TESTS[@]}"; do
  i=$((i+1))
  IFS='|' read -r name flags webint has_server spa <<< "$entry"
  WEB_PORT=$((4100+i)); SRV_PORT=$((4200+i)); DB_PORT=$((4300+i))
  dir="$SCRATCH/$name"
  echo "=== [$i/${#TESTS[@]}] $name ===" | tee -a "$RESULTS"
  rm -rf "$dir"
  cd "$SCRATCH"
  bun "$REPO/apps/cli/src/cli.ts" "$name" $flags --no-install --no-git > "/tmp/smoke-$name-scaffold.log" 2>&1
  if [ ! -f "$dir/docker-compose.yml" ]; then
    echo "RESULT $name: FAIL (scaffold - no compose)" | tee -a "$RESULTS"; continue
  fi
  cd "$dir"
  sedi "s/\"3001:3001\"/\"$WEB_PORT:3001\"/; s/\"3001:80\"/\"$WEB_PORT:80\"/; s/\"3000:3000\"/\"$SRV_PORT:3000\"/; s/\"5432:5432\"/\"$DB_PORT:5432\"/; s/\"3306:3306\"/\"$DB_PORT:3306\"/; s/\"27017:27017\"/\"$DB_PORT:27017\"/" docker-compose.yml

  docker compose config --quiet || { echo "RESULT $name: FAIL (compose config)" | tee -a "$RESULTS"; continue; }

  docker compose build > "/tmp/smoke-$name-build.log" 2>&1
  build_exit=$?
  if [ $build_exit -ne 0 ]; then
    echo "RESULT $name: FAIL (build exit $build_exit, log: /tmp/smoke-$name-build.log)" | tee -a "$RESULTS"
    continue
  fi

  docker compose up -d --wait > "/tmp/smoke-$name-up.log" 2>&1
  up_exit=$?
  sleep 4

  fail=""
  if [ "$webint" != "none" ]; then
    code=$(curl -s -o /tmp/smoke-body.html -w "%{http_code}" "http://localhost:$WEB_PORT" || echo 000)
    [ "$code" = "200" ] || fail="$fail web:$code"
    grep -qi "<html" /tmp/smoke-body.html || fail="$fail web:not-html"
    if [ "$spa" = "1" ]; then
      dcode=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$WEB_PORT/some/deep/route" || echo 000)
      [ "$dcode" = "200" ] || fail="$fail deeplink:$dcode"
    fi
  fi
  if [ "$has_server" = "1" ]; then
    scode=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$SRV_PORT" || echo 000)
    [ "$scode" = "200" ] || fail="$fail server:$scode"
  fi
  errcount=$(docker compose logs web server 2>/dev/null | grep -ci "cannot find module\|unhandled\|ECONNREFUSED\|EADDRINUSE\|MODULE_NOT_FOUND")
  [ "$errcount" = "0" ] || fail="$fail logs:$errcount-errors"
  [ $up_exit -eq 0 ] || fail="$fail up-exit:$up_exit"

  if [ -z "$fail" ]; then
    echo "RESULT $name: PASS" | tee -a "$RESULTS"
  else
    echo "RESULT $name: FAIL ($fail)" | tee -a "$RESULTS"
    docker compose logs web server 2>/dev/null | tail -15 >> "$RESULTS"
  fi
  docker compose down -v --rmi local > /dev/null 2>&1
done

echo "=== DONE ===" | tee -a "$RESULTS"
pass=$(grep -c "RESULT.*: PASS" "$RESULTS")
total=${#TESTS[@]}
echo "$pass/$total passed" | tee -a "$RESULTS"
grep "RESULT.*FAIL" "$RESULTS"
[ "$pass" = "$total" ]
