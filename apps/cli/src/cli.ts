import { createBtsCli } from "./index";
import { startBtsMcpServer } from "./mcp";

const [, , command, ...args] = process.argv;

if (command === "mcp") {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`Usage: create-better-t-stack mcp

Start the Better T Stack MCP server over stdio.

This command is intended to be launched by an MCP client, for example:
  create-better-t-stack mcp`);
    process.exit(0);
  }

  await startBtsMcpServer();
} else {
  await createBtsCli().run();
}
