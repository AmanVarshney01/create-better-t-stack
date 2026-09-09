import { FULLSTACK_FRONTENDS, type Backend, type Frontend } from "@better-t-stack/types";

import type { StackState } from "./constant";

export function getSelfBackendFrontend(backend: StackState["backend"]) {
  return FULLSTACK_FRONTENDS.find((frontend) => backend === `self-${frontend}`);
}

export function isSelfHostedFullstackBackend(
  backend: StackState["backend"],
): backend is Extract<StackState["backend"], `self-${string}`> {
  return getSelfBackendFrontend(backend) !== undefined;
}

export function getStackBackend(backend: StackState["backend"]): Backend {
  return isSelfHostedFullstackBackend(backend) ? "self" : backend;
}

export function getStackFrontends(
  stack: Pick<StackState, "webFrontend" | "nativeFrontend">,
): Frontend[] {
  const frontends = [...stack.webFrontend, ...stack.nativeFrontend].filter((id) => id !== "none");
  return frontends.length ? frontends : ["none"];
}
