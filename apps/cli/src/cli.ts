import { createCjsCli } from "./index";
import { startCjsMcpServer } from "./mcp";

const [, , command, ...args] = process.argv;

if (command === "mcp") {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`Usage: create-js-stack mcp

Start the Create JS Stack MCP server over stdio.

This command is intended to be launched by an MCP client, for example:
  create-js-stack mcp`);
    process.exit(0);
  }

  await startCjsMcpServer();
} else {
  await createCjsCli().run();
}
