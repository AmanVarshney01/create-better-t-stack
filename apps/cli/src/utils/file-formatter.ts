import { Result } from "better-result";
import fs from "fs-extra";
import path from "node:path";
import { format, type FormatOptions } from "oxfmt";

import { ProjectCreationError } from "./errors";

const formatOptions: FormatOptions = {
  experimentalSortPackageJson: true,
  experimentalSortImports: {
    order: "asc",
  },
};

export async function formatCode(filePath: string, content: string): Promise<string | null> {
  const result = await Result.tryPromise({
    try: async () => {
      const formatResult = await format(path.basename(filePath), content, formatOptions);

      if (formatResult.errors && formatResult.errors.length > 0) {
        return null;
      }

      return formatResult.code;
    },
    catch: () => null,
  });

  return result.isOk() ? result.value : null;
}

export async function formatProject(
  projectDir: string,
): Promise<Result<void, ProjectCreationError>> {
  return Result.tryPromise({
    try: async () => {
      async function formatDirectory(dir: string) {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        await Promise.all(
          entries.map(async (entry) => {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
              await formatDirectory(fullPath);
            } else if (entry.isFile()) {
              const fileResult = await Result.tryPromise({
                try: async () => {
                  const content = await fs.readFile(fullPath, "utf-8");
                  const formatted = await formatCode(fullPath, content);
                  if (formatted && formatted !== content) {
                    await fs.writeFile(fullPath, formatted, "utf-8");
                  }
                },
                catch: () => undefined, // Ignore individual file formatting errors
              });
              // Result is intentionally unused - we silently ignore errors
              void fileResult;
            }
          }),
        );
      }

      await formatDirectory(projectDir);
    },
    catch: (e) =>
      new ProjectCreationError({
        phase: "formatting",
        message: `Failed to format project: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}
