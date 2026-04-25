export function shouldSkipExternalCommands(): boolean {
  return process.env.CJS_SKIP_EXTERNAL_COMMANDS === "1" || process.env.CJS_TEST_MODE === "1";
}
