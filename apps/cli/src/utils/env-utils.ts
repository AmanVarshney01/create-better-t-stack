import fs from "fs-extra";

export interface EnvVariable {
  key: string;
  value: string;
  condition?: boolean;
}

export async function addEnvVariablesToFile(
  envPath: string,
  variables: EnvVariable[],
): Promise<void> {
  let content = "";

  if (fs.existsSync(envPath)) {
    content = await fs.readFile(envPath, "utf-8");
  } else {
    // If file doesn't exist, create it
    await fs.ensureFile(envPath);
  }

  const existingLines = content.split("\n");
  const newLines: string[] = [];
  const keysToAdd = new Map<string, string>();

  for (const variable of variables) {
    if (variable.condition === false || !variable.key) {
      continue;
    }
    keysToAdd.set(variable.key, variable.value);
  }

  let foundKeys = new Set<string>();

  for (const line of existingLines) {
    const trimmedLine = line.trim();
    let lineProcessed = false;

    for (const [key, value] of keysToAdd) {
      if (trimmedLine.startsWith(`${key}=`)) {
        newLines.push(`${key}=${value}`);
        foundKeys.add(key);
        lineProcessed = true;
        break;
      }
    }

    if (!lineProcessed) {
      newLines.push(line);
    }
  }

  for (const [key, value] of keysToAdd) {
    if (!foundKeys.has(key)) {
      newLines.push(`${key}=${value}`);
    }
  }

  // Remove empty line at the end if it exists
  if (newLines.length > 0 && newLines[newLines.length - 1] === "") {
    newLines.pop();
  }

  const hasChanges = foundKeys.size > 0 || keysToAdd.size > foundKeys.size;

  if (hasChanges) {
    await fs.writeFile(envPath, newLines.join("\n") + "\n");
  }
}
