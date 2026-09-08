import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";

import type { router } from "@/server/router";

export const orpc: RouterClient<typeof router> = createORPCClient(
  new RPCLink({ url: () => new URL("/api/rpc", window.location.origin) }),
);
