export function shouldSkipExternalCommands(): boolean {
  return process.env.BTS_SKIP_EXTERNAL_COMMANDS === "1" || process.env.BTS_TEST_MODE === "1";
}
