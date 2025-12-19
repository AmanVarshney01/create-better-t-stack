import path from "node:path";
import { format, type FormatOptions } from "oxfmt";

const formatOptions: FormatOptions = {
  useTabs: true,
  tabWidth: 2,
  printWidth: 80,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  experimentalSortPackageJson: true,
  experimentalSortImports: {
    order: "asc",
    ignoreCase: true,
    newlinesBetween: true,
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
