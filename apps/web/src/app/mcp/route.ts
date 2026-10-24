import { createMcpHandler } from "@modelcontextprotocol/server";

import { createHostedMcpServer } from "@/server/mcp";

export const maxDuration = 30;

// Stateless: every request builds a fresh server, so any serverless instance can answer it.
const handler = createMcpHandler(createHostedMcpServer);

// No cookies or credentials are involved, so browser-based MCP clients may call it from anywhere.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, Mcp-Protocol-Version",
};

async function handle(request: Request) {
  const response = await handler.fetch(request);
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) headers.set(key, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export { handle as DELETE, handle as GET, handle as POST };

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
