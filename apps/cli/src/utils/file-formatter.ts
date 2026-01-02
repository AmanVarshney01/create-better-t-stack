import fs from "fs-extra";
import path from "node:path";
import { format, type FormatOptions } from "oxfmt";

const formatOptions: FormatOptions = {
  experimentalSortPackageJson: true,
  experimentalSortImports: {
    order: "asc",
  },
};

export async function formatCode(filePath: string, content: string): Promise<string | null> {
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

export async function formatProject(projectDir: string) {
  async function formatDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await formatDirectory(fullPath);
        } else if (entry.isFile()) {
          try {
            const content = await fs.readFile(fullPath, "utf-8");
            const formatted = await formatCode(fullPath, content);
            if (formatted && formatted !== content) {
              await fs.writeFile(fullPath, formatted, "utf-8");
            }
          } catch {}
        }
      }),
    );
  }

  await formatDirectory(projectDir);
}
