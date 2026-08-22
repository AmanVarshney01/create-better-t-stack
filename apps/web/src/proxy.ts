import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  agentPageSlugByPath,
  MARKDOWN_CONTENT_TYPE,
  MARKDOWN_NOT_FOUND,
} from "@/lib/agent-content";

function acceptsMarkdown(request: NextRequest) {
  const ranges = request.headers
    .get("Accept")
    ?.split(",")
    .map((value) => {
      const [rawMediaType, ...parameters] = value.split(";");
      const mediaType = rawMediaType?.trim().toLowerCase();
      const qualityParameter = parameters.find(
        (parameter) => parameter.split("=", 1)[0]?.trim().toLowerCase() === "q",
      );
      const qualityValue = qualityParameter?.split("=", 2)[1]?.trim();
      const quality = qualityParameter === undefined ? 1 : Number(qualityValue);
      const mediaTypeParts = mediaType?.split("/");

      if (
        mediaTypeParts?.length !== 2 ||
        mediaTypeParts.some((part) => !part) ||
        !Number.isFinite(quality) ||
        quality < 0 ||
        quality > 1
      ) {
        return null;
      }

      return { mediaType, quality };
    })
    .filter((range): range is { mediaType: string; quality: number } => range !== null);

  if (!ranges?.some((range) => range.mediaType === "text/markdown")) {
    return false;
  }

  const qualityFor = (mediaType: string) => {
    const [type, subtype] = mediaType.split("/");
    let bestQuality = 0;
    let bestSpecificity = -1;

    for (const range of ranges) {
      const [rangeType, rangeSubtype] = range.mediaType.split("/");
      if (
        (rangeType !== "*" && rangeType !== type) ||
        (rangeSubtype !== "*" && rangeSubtype !== subtype)
      ) {
        continue;
      }

      const specificity = rangeType === "*" ? 0 : rangeSubtype === "*" ? 1 : 2;
      if (specificity > bestSpecificity) {
        bestSpecificity = specificity;
        bestQuality = range.quality;
      } else if (specificity === bestSpecificity) {
        bestQuality = Math.max(bestQuality, range.quality);
      }
    }

    return bestQuality;
  };

  const markdownQuality = qualityFor("text/markdown");
  return markdownQuality > 0 && markdownQuality >= qualityFor("text/html");
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
