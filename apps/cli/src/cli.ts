import { createBtsCli } from "./index";
import { startMcpServer } from "./mcp/server";

if (process.argv[2] === "mcp") {
  startMcpServer().catch((error) => {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  });
} else {
  createBtsCli().run();
}
