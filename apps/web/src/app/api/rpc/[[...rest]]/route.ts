import { RPCHandler } from "@orpc/server/fetch";

import { router } from "@/server/router";

const handler = new RPCHandler(router);

export async function POST(request: Request) {
  const { response } = await handler.handle(request, { prefix: "/api/rpc" });
  return response ?? new Response("Not found", { status: 404 });
}
