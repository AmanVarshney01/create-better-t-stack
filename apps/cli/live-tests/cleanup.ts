import type { Commands } from "./command";
import { cleanup } from "./providers";
import type { RunState } from "./state";

export async function cleanResources(
  state: RunState,
  commands: Commands,
  caseId?: string,
  remove: typeof cleanup = cleanup,
) {
  const failures: string[] = [];
  for (const resource of state.resources(caseId).reverse()) {
    try {
      await remove(resource, commands);
      state.deleted(resource);
    } catch (error) {
      failures.push(commands.redact(error instanceof Error ? error.message : String(error)));
    }
  }
  if (failures.length) throw new Error(`Cleanup incomplete: ${failures.join("; ")}`);
}
