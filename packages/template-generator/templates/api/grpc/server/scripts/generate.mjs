import { spawnSync } from "node:child_process";

const command = process.platform === "win32" ? "buf.cmd" : "buf";
const result = spawnSync(command, ["generate", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: {
    ...process.env,
    // @typescript/vfs probes localStorage during protoc plugin startup. Node 25
    // warns when its storage file option is empty, although codegen is valid.
    NODE_NO_WARNINGS: "1",
  },
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
