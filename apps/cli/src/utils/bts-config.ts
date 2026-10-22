import * as fs from "node:fs/promises";
import path from "node:path";

import { BetterTStackConfigSchema, type BetterTStackConfig } from "@better-t-stack/types";
import { Result } from "better-result";
import { applyEdits, modify, parse, type ParseError } from "jsonc-parser";

import { CLIError } from "./errors";

const BTS_CONFIG_FILE = "bts.jsonc";

function parseBtsConfig(content: string): BetterTStackConfig {
  const errors: ParseError[] = [];
  const value = parse(content, errors, { allowTrailingComma: true });
  if (errors.length > 0) throw new Error("Invalid JSONC in bts.jsonc");
  return BetterTStackConfigSchema.parse(value);
}

export async function readBtsConfig(projectDir: string): Promise<BetterTStackConfig | null> {
  const result = await Result.tryPromise({
    try: async () =>
      parseBtsConfig(await fs.readFile(path.join(projectDir, BTS_CONFIG_FILE), "utf8")),
    catch: () => null,
  });
  return result.isOk() ? result.value : null;
}

export async function updateBtsConfig(
  projectDir: string,
  updates: Partial<
    Pick<
      BetterTStackConfig,
      "addons" | "addonOptions" | "dbSetupOptions" | "webDeploy" | "serverDeploy"
    >
  >,
): Promise<Result<void, CLIError>> {
  return Result.tryPromise({
    try: async () => {
      const configPath = path.join(projectDir, BTS_CONFIG_FILE);
      let content = await fs.readFile(configPath, "utf8");
      BetterTStackConfigSchema.parse({ ...parseBtsConfig(content), ...updates });
      for (const [key, value] of Object.entries(updates)) {
        content = applyEdits(
          content,
          modify(content, [key], value, { formattingOptions: { tabSize: 2 } }),
        );
      }
      await fs.writeFile(configPath, content, "utf8");
    },
    catch: (cause) =>
      new CLIError({
        message: `Failed to update bts.jsonc: ${cause instanceof Error ? cause.message : String(cause)}`,
        cause,
      }),
  });
}
