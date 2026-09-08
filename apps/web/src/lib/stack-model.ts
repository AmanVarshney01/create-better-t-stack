import { FULLSTACK_FRONTENDS } from "@better-t-stack/types";

import type { StackState } from "./constant";

export function getSelfBackendFrontend(backend: string) {
  return FULLSTACK_FRONTENDS.find((frontend) => backend === `self-${frontend}`);
}

export function isSelfHostedFullstackBackend(backend: string) {
  return getSelfBackendFrontend(backend) !== undefined;
}

export function getStackBackend(backend: string) {
  return isSelfHostedFullstackBackend(backend) ? "self" : backend;
}

export function getStackFrontends(stack: Pick<StackState, "webFrontend" | "nativeFrontend">) {
  const frontends = [...stack.webFrontend, ...stack.nativeFrontend].filter((id) => id !== "none");
  return frontends.length ? frontends : ["none"];
}
