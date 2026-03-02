const ENABLE_STACK_PREVIEW = "1";

type EnvLike = Record<string, string | boolean | undefined>;

function getPreviewEnvOverride(env: EnvLike | undefined): string | undefined {
  const value = env?.BFS_ENABLE_STACK_PREVIEW;
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? ENABLE_STACK_PREVIEW : "0";
  return undefined;
}

export function isStackPreviewEnabledServer(): boolean {
  const override = getPreviewEnvOverride(process.env as EnvLike);
  if (override === ENABLE_STACK_PREVIEW) return true;

  return process.env.NODE_ENV !== "production";
}

export function isStackPreviewEnabledClient(): boolean {
  if (import.meta.env.DEV) return true;

  const override = getPreviewEnvOverride(import.meta.env as EnvLike);
  return override === ENABLE_STACK_PREVIEW;
}
