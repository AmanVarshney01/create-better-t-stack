import { log, spinner } from "@clack/prompts";

import { isSilent } from "./context";

type SpinnerLike = {
  start(message: string): void;
  stop(message?: string): void;
  message(message: string): void;
};

const noopSpinner: SpinnerLike = {
  start() {},
  stop() {},
  message() {},
};

export function createSpinner(): SpinnerLike {
  return isSilent() ? noopSpinner : spinner();
}

export const cliLog = {
  info(message: string) {
    if (!isSilent()) log.info(message);
  },
  warn(message: string) {
    if (!isSilent()) log.warn(message);
  },
  success(message: string) {
    if (!isSilent()) log.success(message);
  },
  error(message: string) {
    if (!isSilent()) log.error(message);
  },
  message(message: string) {
    if (!isSilent()) log.message(message);
  },
};
