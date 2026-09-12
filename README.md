# Better-T-Stack

A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations

<br />

<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>

## Sponsors

<p align="center">
<img src="https://sponsors.better-t-stack.dev/sponsors.png" alt="Sponsors">
</p>

https://github.com/user-attachments/assets/87b541ea-9d4d-4734-b383-00784b0b43ff

## Philosophy

- Roll your own stack: you pick only the parts you need, nothing extra.
- Minimal templates: bare-bones scaffolds with zero bloat.
- Latest dependencies: always use current, stable versions by default.
- Free and open source: forever.

## Quick Start

```bash
# Using bun (recommended)
bun create better-t-stack@latest

# Using pnpm
pnpm create better-t-stack@latest

# Using npm
npx create-better-t-stack@latest
```

## Claude Code plugin

Want your AI assistant to scaffold and extend projects with Better-T-Stack? Install the plugin and it will plan a valid stack and generate it through the bundled MCP server instead of hand-rolling boilerplate.

```bash
/plugin marketplace add AmanVarshney01/create-better-t-stack
/plugin install better-t-stack@better-t-stack
```

Then ask: _"create a fullstack app with Next, Hono, Postgres and Better Auth"_, or run `/better-t-stack:new <description>`. See [`plugin/`](plugin) and the [Agent Workflows docs](https://better-t-stack.dev/docs/cli/agent-workflows#claude-code-plugin).

## Features

- Frontend: React (TanStack Router, React Router, TanStack Start), Next.js, Nuxt, Svelte, Solid, Astro, React Native (Bare, NativeWind, Unistyles), or none
- Backend: Hono, Express, Fastify, Elysia, Self (fullstack web app), Convex, or none
- API: tRPC or oRPC (or none)
- Runtime: Bun, Node.js, or Cloudflare Workers
- Databases: SQLite, PostgreSQL, MySQL, MongoDB (or none)
- ORMs: Drizzle, Prisma, Mongoose (or none)
- Auth: Better Auth or Clerk (optional)
- Addons: Turborepo, Nx, PWA, Tauri, Electrobun, Biome, Lefthook, Husky, Starlight, Fumadocs, Ultracite, Oxlint, MCP, OpenTUI, WXT, Skills
- Examples: Todo, AI
- DB Setup: Turso, Neon, Supabase, Prisma PostgreSQL, MongoDB Atlas, Cloudflare D1, Docker
- Web Deploy: Cloudflare Workers

Type safety end-to-end, clean monorepo layout, and zero lock-in: you choose only what you need.

## Repository Structure

This repository is organized as a monorepo containing:

- **CLI**: [`apps/cli`](apps/cli) - The scaffolding CLI tool
- **Documentation**: [`apps/web`](apps/web) - Official website and documentation
- **Plugin**: [`plugin`](plugin) - Claude Code plugin (MCP server + skills + commands + agent)

## Documentation

Visit [better-t-stack.dev](https://better-t-stack.dev) for full documentation, guides, and examples. You can also use the visual Stack Builder at `https://better-t-stack.dev/new` to generate a command for your stack.

## Development

```bash
# Clone the repository
git clone https://github.com/AmanVarshney01/create-better-t-stack.git

# Install dependencies
bun install

# Start CLI development
bun dev:cli

# Start website development
bun dev:web
```

## Want to contribute?

Please read the Contribution Guide first and open an issue before starting new features to ensure alignment with project goals.

- Docs: [`./apps/web/content/docs/contributing.mdx`](./apps/web/content/docs/contributing.mdx)
- Repo guide: [`./.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md)

## Star History

<a href="https://www.star-history.com/#AmanVarshney01/create-better-t-stack&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=AmanVarshney01/create-better-t-stack&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=AmanVarshney01/create-better-t-stack&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=AmanVarshney01/create-better-t-stack&type=Date" />
 </picture>
</a>


## 🌐 Web Resources & Interactive Index
- [BUBBLE SHOOTER WITCH TOWER 2](https://mindclass-es.pages.dev/bubble-shooter-witch-tower-2.html)
- [ANGRY SNAKE IO](https://eduquestspt.pages.dev/angry-snake-io.html)
- [WORD SEARCH](https://brainquestspt.pages.dev/word-search.html)
- [DIGITAL CIRCUS FIND THE DIFFERENCES](https://brainquest-hi.pages.dev/digital-circus-find-the-differences.html)
- [DOORS AWAKENING](https://learnquest-ru.pages.dev/doors-awakening.html)
- [FRUIT BLOCK TETRA PUZZLE](https://playandlearn-fr.pages.dev/fruit-block-tetra-puzzle.html)
- [HEXA BLAST GAME PUZZLE](https://playandlearn-fr.pages.dev/hexa-blast-game-puzzle.html)
- [CATEGORY CONTROLLER](https://eduquest-ko.pages.dev/category-controller.html)
- [BUILD A QUEEN 2025](https://brainquestspt.pages.dev/build-a-queen-2025.html)
- [CATEGORY NATIVE](https://studyquest-ja.pages.dev/category-native.html)
- [LIGHT ACADEMIA FASHION](https://mindconvert.onrender.com/light-academia-fashion.html)
- [PLANT GIRL DEFENSE ZOMBIE](https://brainquestsfr.pages.dev/plant-girl-defense-zombie.html)
- [CATEGORY SIDE SCROLLING184](https://learnaction.netlify.app/category-side-scrolling184.html)
- [CATEGORY FPS174](https://learnquest-ru.pages.dev/category-fps174.html)
- [SWEET HAUNT 2](https://eduquestsjp.pages.dev/sweet-haunt-2.html)
- [MAHJONG SORT PUZZLE](https://eduquest-ko.pages.dev/mahjong-sort-puzzle.html)
- [CUBE STACK 2048](https://playandlearn-fr.pages.dev/cube-stack-2048.html)
- [CROSS THE ROAD](https://eduquest-ko.pages.dev/cross-the-road.html)
- [CATEGORY MANAGEMENT209](https://jangkhangkr.pages.dev/category-management209.html)
- [CATEGORY FPS](https://eduquest-ko.pages.dev/category-fps.html)
- [DADDY CACTUS](https://brainquestsfr.pages.dev/daddy-cactus.html)
- [CATEGORY BATTLE ROYALE GAMES](https://mindquest-zh.pages.dev/category-battle-royale-games.html)
- [PRIVACY](https://mindconvert.pages.dev/privacy.html)
- [BUS JAM](https://playandlearn-fr.pages.dev/bus-jam.html)
- [TRIANGLE WAY](https://themindconvert.web.app/triangle-way.html)
- [CATEGORY CONTROLLER](https://studyquest-ja.pages.dev/category-controller.html)
- [AIRWAYS MAZE](https://brainquest-hi.pages.dev/airways-maze.html)
- [INDEX23](https://mindquest-zh.pages.dev/index23.html)
- [SCREW COLOR SORTING MASTER](https://playandlearn-fr.pages.dev/screw-color-sorting-master.html)
- [CATEGORY MATCH 3117](https://brainquestsfr.pages.dev/category-match-3117.html)
- [SLIDE RABBIT](https://mindconvertpt.pages.dev/slide-rabbit.html)
- [CATEGORY BRAIN260](https://learnquest-ru.pages.dev/category-brain260.html)
- [OFFICE PYRAMID SOLITAIRE](https://themindconvert.web.app/office-pyramid-solitaire.html)
- [IDLE MARKET TYCOON](https://smartquest-es.pages.dev/idle-market-tycoon.html)
- [CATEGORY MATCH 3117](https://brainquests.pages.dev/category-match-3117.html)
- [COLOR SAND PUZZLE](https://eduquestsjp.pages.dev/color-sand-puzzle.html)
- [CATEGORY CAN T STOP PLAYING212](https://skillquest-en.pages.dev/category-can-t-stop-playing212.html)
- [CATEGORY AVOID295](https://brainquestsfr.pages.dev/category-avoid295.html)
- [KICK LOSER](https://learnquest-ru.pages.dev/kick-loser.html)
- [WORD HUNT](https://eduquestsjp.pages.dev/word-hunt.html)
- [CATEGORY PUZZLE 7](https://skillquest-en.pages.dev/category-puzzle-7.html)
- [CATEGORY MAKEUP CATEGORY](https://skillquest-en.pages.dev/category-makeup-category.html)
- [BULLET HEROES](https://learnquest-ru.pages.dev/bullet-heroes.html)
- [COIN COLOR SORT](https://quizzesarena.onrender.com/coin-color-sort.html)
- [RED STICKMAN VS MONSTER SCHOOL](https://themindconvert.web.app/red-stickman-vs-monster-school.html)
- [HUMAN EVOLUTION RUN](https://eduquest-ko.pages.dev/human-evolution-run.html)
- [AVATAR LIFE MY TOWN](https://mindconvert.pages.dev/avatar-life-my-town.html)
- [SAVE MY PET](https://brainquests.pages.dev/save-my-pet.html)
- [CATEGORY MMO25](https://knowledgequest-vi.pages.dev/category-mmo25.html)
- [BOUNCY BARN](https://ieduquests.web.app/bouncy-barn.html)
- [CHESS ONLINE](https://mindconvert.pages.dev/chess-online.html)
- [SKYDOM REFORGED](https://brainquest-hi.pages.dev/skydom-reforged.html)
- [RPG IDLE CLICKER](https://quizzesarena.onrender.com/rpg-idle-clicker.html)
- [CATEGORY 2D1 060](https://learnquest-ru.pages.dev/category-2d1-060.html)
- [TRUCK SIMULATOR RUSSIA](https://skillquest-en.pages.dev/truck-simulator-russia.html)
- [CATEGORY ARENA255](https://eduquest-ko.pages.dev/category-arena255.html)
- [CATEGORY FLASH 2](https://brainquests.pages.dev/category-flash-2.html)
- [CATEGORY FREE DRESS UP GAMES](https://quizzesarena.web.app/category-free-dress-up-games.html)
- [YOUTUBER MCRAFT 2PLAYER](https://skillquest-en.pages.dev/youtuber-mcraft-2player.html)
- [CATEGORY THINKY](https://mindconvert.onrender.com/category-thinky.html)
- [DINO GAME](https://brainquest-hi.pages.dev/dino-game.html)
- [HIDDEN OBJECT GREAT JOURNEY](https://learnquest-ru.pages.dev/hidden-object-great-journey.html)
- [OBBY CARDS THE LEGEND HUNT](https://mindquest-zh.pages.dev/obby-cards-the-legend-hunt.html)
- [FAST LAP](https://quizzesarena.onrender.com/fast-lap.html)
- [SHINE SEEK](https://studyquest-ja.pages.dev/shine-seek.html)
- [CATEGORY MANAGEMENT210](https://mindquest-zh.pages.dev/category-management210.html)
- [FARM BLAST](https://mindquest-zh.pages.dev/farm-blast.html)
- [CATEGORY COLLECT565](https://knowledgequest-vi.pages.dev/category-collect565.html)
- [KINGDOM PUZZLES](https://skillquest-en.pages.dev/kingdom-puzzles.html)
- [CATEGORY FPS GAMES](https://brainquests.pages.dev/category-fps-games.html)
- [OBBY CLIMB RACING](https://ieduquests.web.app/obby-climb-racing.html)
- [CATEGORY INCREMENTAL386](https://skillquest-en.pages.dev/category-incremental386.html)
- [WINTER COSMOFEST](https://eduquestsjp.pages.dev/winter-cosmofest.html)
- [CATEGORY IDLE445](https://quizzesarena.web.app/category-idle445.html)
- [ROLLER COASTER 3D](https://mindquest-zh.pages.dev/roller-coaster-3d.html)
- [CATEGORY CASUAL 7](https://knowledgequest-vi.pages.dev/category-casual-7.html)
- [CATEGORY RPG80](https://studyquest-ja.pages.dev/category-rpg80.html)
- [STICKMAN JAILBREAK STORY](https://knowledgequest-vi.pages.dev/stickman-jailbreak-story.html)
- [VALENTINES LOVE LINK](https://eduquestsjp.pages.dev/valentines-love-link.html)
- [TWO STUNT RACERS](https://learnquest-ru.pages.dev/two-stunt-racers.html)
- [LINE ON HOLE](https://skillquest-en.pages.dev/line-on-hole.html)
- [CATEGORY CUTE](https://brainquest-hi.pages.dev/category-cute.html)
- [HEXA GO](https://eduquestsjp.pages.dev/hexa-go.html)
- [CATEGORY BIKE](https://knowledgequest-vi.pages.dev/category-bike.html)
- [MAGECLASH IO](https://ieduquests.web.app/mageclash-io.html)
- [CRAZY GOOSE SIMULATOR](https://brainquestskr.pages.dev/crazy-goose-simulator.html)
- [STICKMAN DISMOUNT SIMULATOR](https://mindconvert.pages.dev/stickman-dismount-simulator.html)
- [CATEGORY CASUAL 8](https://brainquests.pages.dev/category-casual-8.html)
- [2048 NUMBER MATCH](https://mindconvert.onrender.com/2048-number-match.html)
- [STELLAR GUARDIAN](https://brainquestsjp.pages.dev/stellar-guardian.html)
- [CATEGORY SCHOOL GAMES](https://quizzesarena.onrender.com/category-school-games.html)
- [SURVIVAL RACING EXTREME ROAD](https://learnquest-ru.pages.dev/survival-racing-extreme-road.html)
- [COFFEE CRAZE SORTING GAME](https://mindconvert.pages.dev/coffee-craze-sorting-game.html)
- [ZOMBIE CHASE](https://brainquestsjp.pages.dev/zombie-chase.html)
- [COSMO PET STARRY CARE](https://mindconvert.onrender.com/cosmo-pet-starry-care.html)
- [INDEX17](https://quizzesarena.onrender.com/index17.html)
- [MEOW BLOCK COLOR COLLECT](https://ieduquests.web.app/meow-block-color-collect.html)
- [RACE IT CAR RACING](https://themindconvert.web.app/race-it-car-racing.html)
- [SITEMAP](https://cryptotify.netlify.app/sitemap.html)
- [MONSTER ESCAPE](https://knowledgequest-vi.pages.dev/monster-escape.html)
- [CATEGORY FREE SOLITAIRE GAMES](https://ieduquests.web.app/category-free-solitaire-games.html)
- [NINJA CROSSWORD CHALLENGE](https://brainquestsfr.pages.dev/ninja-crossword-challenge.html)
- [FROST LAND SNOW SURVIVAL](https://studyquest-ja.pages.dev/frost-land-snow-survival.html)
- [CRAZY TRAFFIC CONTROL](https://quizzesarena.onrender.com/crazy-traffic-control.html)
- [GIANT RUN 3D](https://quizzesarena.onrender.com/giant-run-3d.html)
- [SUPERMARKET SORT GROCERY GAME](https://themindconvert.web.app/supermarket-sort-grocery-game.html)
- [GOBATTLEIO](https://eduquestsjp.pages.dev/gobattleio.html)
- [CATEGORY FIGHTING124](https://eduquest-ko.pages.dev/category-fighting124.html)
- [CATEGORY WEBGAME](https://skillquest-en.pages.dev/category-webgame.html)
- [CATEGORY LOGIC538](https://skillquest-en.pages.dev/category-logic538.html)
- [NOOB DRAW PUNCH](https://learnquest-ru.pages.dev/noob-draw-punch.html)
- [BIKING EXTREME 3D](https://learnquest-ru.pages.dev/biking-extreme-3d.html)
- [GOD OF LIGHT](https://brainquest-hi.pages.dev/god-of-light.html)
- [TIKTOK STREET STYLE](https://learnquest-ru.pages.dev/tiktok-street-style.html)
- [HOLE AND FILL COLLECT MASTER](https://eduquest-ko.pages.dev/hole-and-fill-collect-master.html)
- [LIMOUSINE CAR GAME SIMULATOR](https://mindconvert.pages.dev/limousine-car-game-simulator.html)
- [ZOMBIE IDLE DEFENSE](https://learnquest-ru.pages.dev/zombie-idle-defense.html)
- [CATEGORY IDLE445](https://mindquest-zh.pages.dev/category-idle445.html)
- [CATEGORY DEEP IMMERSIVE24](https://skillquest-en.pages.dev/category-deep-immersive24.html)
- [MINE 2D SURVIVAL HEROBRINE](https://mindquest-zh.pages.dev/mine-2d-survival-herobrine.html)
- [MY GARDEN JOURNEY](https://jangkhangplay.pages.dev/my-garden-journey.html)
- [BUILD A QUEEN 2025](https://quizzesarena.onrender.com/build-a-queen-2025.html)
- [INDEX22](https://knowledgequest-vi.pages.dev/index22.html)
- [SUDOKU MASTER](https://brainquestsfr.pages.dev/sudoku-master.html)
- [PING PONG AIR](https://brainquestskr.pages.dev/ping-pong-air.html)
- [FIDGET TOYS POP IT](https://eduquest-ko.pages.dev/fidget-toys-pop-it.html)
- [BROTHERFOLLOW ME MERGE MEN](https://jangkhangplay.pages.dev/brotherfollow-me-merge-men.html)
- [CATEGORY CAR](https://knowledgequest-vi.pages.dev/category-car.html)
- [SOCCER TOURNAMENT](https://skillquest-en.pages.dev/soccer-tournament.html)
- [CATEGORY MAKEUP](https://brainquests.pages.dev/category-makeup.html)
