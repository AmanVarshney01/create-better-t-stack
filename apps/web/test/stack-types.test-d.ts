import {
  supportsRuntimeBackend,
  supportsOrmDatabase,
  validateAddonCompatibility,
  type AddonCompatibility,
  type Backend,
  type Frontend,
  type Runtime,
} from "@better-t-stack/types";

import { DEFAULT_STACK, TECH_OPTIONS } from "../src/lib/constant";
import { getStackBackend } from "../src/lib/stack-model";
import { StackStateSchema, StackUpdateSchema } from "../src/lib/stack-schema";
import type { StackState, StackOptionId } from "../src/lib/types";

// Compiled by the website typecheck; invalid examples must never run.
export function checkStackTypeContracts(stack: StackState) {
  const parsed = StackStateSchema.parse(stack);
  const runtime: Runtime = parsed.runtime;
  const backend: Backend = getStackBackend(parsed.backend);
  const frontends: Frontend[] = [...parsed.webFrontend, ...parsed.nativeFrontend];
  supportsRuntimeBackend(runtime, backend);
  validateAddonCompatibility("pwa", frontends);
  const option: StackOptionId<"runtime" | "addons"> = "pwa";

  // @ts-expect-error Misspelled runtime IDs cannot enter shared compatibility logic.
  supportsRuntimeBackend("bunn", "hono");
  // @ts-expect-error An API ID is not an ORM.
  supportsOrmDatabase("orpc", "postgres");
  // @ts-expect-error Unknown frontend IDs cannot enter shared compatibility logic.
  validateAddonCompatibility("pwa", ["nexxt"]);
  // @ts-expect-error Parsed state must preserve the runtime union.
  parsed.runtime = "bunn";
  // @ts-expect-error UI backend aliases must name a supported fullstack frontend.
  getStackBackend("self-react-router");
  // @ts-expect-error Option IDs must match their catalog category.
  TECH_OPTIONS.runtime.push({ ...TECH_OPTIONS.runtime[0], id: option });
  // @ts-expect-error Domain state must reject arbitrary frontend strings.
  const invalidStack: StackState = { ...DEFAULT_STACK, webFrontend: ["nexxt"] };
  // @ts-expect-error Incompatible results require an explanation.
  const invalidResult: AddonCompatibility = { isCompatible: false };
  const update = StackUpdateSchema.parse({ runtime });
  // @ts-expect-error Partial updates must preserve domain unions too.
  update.runtime = "bunn";
  return { invalidStack, invalidResult };
}
