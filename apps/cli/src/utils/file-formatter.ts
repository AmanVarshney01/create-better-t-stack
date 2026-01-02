import fs from "fs-extra";
import path from "node:path";
import { format, type FormatOptions } from "oxfmt";
import { glob } from "tinyglobby";

const formatOptions: FormatOptions = {
  experimentalSortPackageJson: true,
  experimentalSortImports: {
    order: "asc",
  },
};

export async function formatFile(filePath: string, content: string): Promise<string | null> {
  try {
    const result = await format(path.basename(filePath), content, formatOptions);

    if (result.errors && result.errors.length > 0) {
      return null;
    }

    return result.code;
  } catch {
    return null;
  }
}

/**
 * Format all files in a project directory using oxfmt
 */
export async function formatProjectFiles(projectDir: string): Promise<void> {
  const files = await glob(["**/*.{ts,tsx,js,jsx,json,mjs,cjs}"], {
    cwd: projectDir,
    absolute: true,
    ignore: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
  });

  await Promise.all(
    files.map(async (filePath) => {
      try {
        const content = await fs.readFile(filePath, "utf-8");
        const formatted = await formatFile(filePath, content);
        if (formatted && formatted !== content) {
          await fs.writeFile(filePath, formatted, "utf-8");
        }
      } catch {
        // Silently skip files that can't be formatted
      }
    }),
  );
}
