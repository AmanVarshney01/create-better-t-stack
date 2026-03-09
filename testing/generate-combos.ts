#!/usr/bin/env bun

import { Console, Effect } from "effect";

import { loadHistoricalLedger } from "./lib/generate-combos/history";
import { generateBatch } from "./lib/generate-combos/options";
import { DEFAULT_ARGS, type GeneratorArgs } from "./lib/generate-combos/types";

function parseArgs(argv: string[]): GeneratorArgs {
  const args = { ...DEFAULT_ARGS };

  for (let index = 0; index < argv.length; index++) {
    const token = argv[index];
    const next = argv[index + 1];

    if (token === "--count" && next) {
      const parsed = Number(next);
      if (Number.isFinite(parsed) && parsed > 0) {
        args.count = Math.floor(parsed);
      }
      index++;
      continue;
    }

    if (token === "--ecosystems" && next) {
      const selected = next
        .split(",")
        .map((value) => value.trim())
        .filter(
          (value): value is GeneratorArgs["ecosystems"][number] =>
            value === "typescript" || value === "rust" || value === "python" || value === "go",
        );

      if (selected.length > 0) {
        args.ecosystems = Array.from(new Set(selected));
      }

      index++;
      continue;
    }

    if (token === "--install-mode" && next) {
      if (next === "install" || next === "no-install") {
        args.installMode = next;
      }
      index++;
      continue;
    }

    if (token === "--install") {
      args.installMode = "install";
      continue;
    }

    if (token === "--no-install") {
      args.installMode = "no-install";
    }
  }

  return args;
}

const program = Effect.gen(function* () {
  const args = parseArgs(process.argv.slice(2));
  const history = yield* loadHistoricalLedger();
  const combos = generateBatch(args, history);

  yield* Console.log(
    `Generated ${combos.length}/${args.count} unique combos from schema-driven pools ` +
      `(history signatures: ${history.historyCount}, legacy names: ${history.legacyNames.size})\n`,
  );

  for (const combo of combos) {
    yield* Console.log(`# ${combo.name}`);
    yield* Console.log(combo.command);
    yield* Console.log("");
  }

  if (combos.length < args.count) {
    yield* Console.log(
      "Stopped early because the remaining candidate space was exhausted or already covered.",
    );
  }
});

Effect.runPromise(program).catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
