import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  agentPageSlugByPath,
  MARKDOWN_CONTENT_TYPE,
  MARKDOWN_NOT_FOUND,
} from "@/lib/agent-content";

function acceptsMarkdown(request: NextRequest) {
  return request.headers
    .get("Accept")
    ?.split(",")
    .some((value) => value.trim().split(";", 1)[0] === "text/markdown");
}

function withAcceptVary(response: NextResponse) {
  const values = response.headers
    .get("Vary")
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!values?.some((value) => value.toLowerCase() === "accept")) {
    response.headers.set("Vary", [...(values ?? []), "Accept"].join(", "));
  }

  return response;
}

function rewrite(request: NextRequest, pathname: string) {
  const destination = request.nextUrl.clone();
  destination.pathname = pathname;
  return withAcceptVary(NextResponse.rewrite(destination));
}

export function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  if (!acceptsMarkdown(request)) {
    return withAcceptVary(NextResponse.next());
  }

  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  if (pathname === "/") {
    return rewrite(request, "/llms.txt");
  }

  if (pathname === "/docs") {
    return rewrite(request, "/docs/index.mdx");
  }

  if (pathname.startsWith("/docs/")) {
    return rewrite(request, `${pathname}.mdx`);
  }

  const agentPageSlug = agentPageSlugByPath[pathname as keyof typeof agentPageSlugByPath];
  if (agentPageSlug) {
    return rewrite(request, `/agent-content/${agentPageSlug}`);
  }

  return new NextResponse(MARKDOWN_NOT_FOUND, {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": MARKDOWN_CONTENT_TYPE,
      Vary: "Accept",
      "X-Robots-Tag": "noindex",
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|agent-content|og|.*\\.[^/]+$).*)"],
};
