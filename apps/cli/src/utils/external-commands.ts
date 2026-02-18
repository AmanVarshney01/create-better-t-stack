export function shouldSkipExternalCommands(): boolean {
  const value = process.env.BFS_SKIP_EXTERNAL_COMMANDS;
  if (!value) return false;

  const normalized = value.toLowerCase().trim();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}
