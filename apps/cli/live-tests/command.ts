import { writeFile } from "node:fs/promises";
import path from "node:path";

import { execa } from "execa";

export class Blocked extends Error {}

export class Commands {
  private index = 0;
  private secrets = new Set<string>();
  private stops: (() => Promise<void>)[] = [];
  constructor(
    readonly directory: string,
    readonly signal: AbortSignal,
  ) {}
  secret(value: string) {
    if (value.length > 5) this.secrets.add(value);
    return value;
  }
  redact(value: string) {
    for (const secret of this.secrets) value = value.replaceAll(secret, "[REDACTED]");
    return value.replace(
      /(postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s"']+/g,
      "$1://[REDACTED]",
    );
  }
  start(name: string, cwd: string, command: string, args: string[], env: NodeJS.ProcessEnv = {}) {
    const log = path.join(this.directory, `${String(++this.index).padStart(2, "0")}-${name}.log`);
    console.log(`  ${name}: starting`);
    const child = execa(command, args, {
      cwd,
      env: { AGENT: "1", BTS_TELEMETRY: "0", CI: "1", ...env },
      all: true,
      reject: false,
      cancelSignal: this.signal,
      killDescendants: true,
      forceKillAfterDelay: 5_000,
    });
    const finished = child.then(async (result) => {
      await writeFile(log, this.redact(result.all ?? result.message ?? ""), { mode: 0o600 });
      return result;
    });
    this.stops.push(async () => {
      child.kill("SIGTERM");
      await finished;
    });
    return { child, finished, log };
  }
  async stopAll() {
    const results = await Promise.allSettled(this.stops.splice(0).map((stop) => stop()));
    for (const result of results) if (result.status === "rejected") throw result.reason;
  }
  async run(
    name: string,
    cwd: string,
    command: string,
    args: string[],
    env: NodeJS.ProcessEnv = {},
  ) {
    const log = path.join(this.directory, `${String(++this.index).padStart(2, "0")}-${name}.log`);
    const started = Date.now();
    console.log(`  ${name}: started`);
    const result = await execa(command, args, {
      cwd,
      env: { AGENT: "1", BTS_TELEMETRY: "0", CI: "1", ...env },
      reject: false,
      all: true,
      timeout: 900_000,
      cancelSignal: this.signal,
      killDescendants: true,
    });
    await writeFile(log, this.redact(result.all ?? result.message ?? ""), { mode: 0o600 });
    if (result.failed)
      throw new Error(`${name} failed (exit ${result.exitCode ?? "none"}); ${log}`);
    console.log(`  ${name}: passed (${Math.round((Date.now() - started) / 1000)}s)`);
    return result.stdout;
  }
}
