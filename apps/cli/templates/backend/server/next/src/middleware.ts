import { NextRequest, NextResponse } from "next/server";

interface RateLimitRule {
  windowMs: number;
  maxRequests: number;
  burstRequests?: number;
}

const RATE_LIMIT_RULES: Record<string, RateLimitRule> = {
  default: { windowMs: 60 * 1000, maxRequests: 200 },
};

const requestStore = new Map<
  string,
  { count: number; resetTime: number; lastAccess: number }
>();
const MAX_REQUEST_STORE_SIZE = 10000;

setInterval(() => {
  const now = Date.now();
  for (const [key, data] of Array.from(requestStore.entries())) {
    if (now > data.resetTime || now - data.lastAccess > 10 * 60 * 1000) {
      requestStore.delete(key);
    }
  }
  if (requestStore.size > MAX_REQUEST_STORE_SIZE) {
    const sorted = Array.from(requestStore.entries()).sort(
      (a, b) => a[1].lastAccess - b[1].lastAccess
    );
    for (let i = 0; i < requestStore.size - MAX_REQUEST_STORE_SIZE; i++) {
      requestStore.delete(sorted[i][0]);
    }
  }
}, 30 * 1000).unref();

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  const trueClientIp = request.headers.get("true-client-ip");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) return forwarded.split(",")[0].trim();
  if (cfConnectingIp) return cfConnectingIp;
  if (trueClientIp) return trueClientIp;
  if (realIp) return realIp;

  return "unknown_ip";
}

function getRateLimitRuleForPath(pathname: string): RateLimitRule {
  let matchedRule = RATE_LIMIT_RULES.default;
  let longestMatch = "";

  for (const [route, rule] of Object.entries(RATE_LIMIT_RULES)) {
    if (route !== "default" && pathname.startsWith(route)) {
      if (route.length > longestMatch.length) {
        longestMatch = route;
        matchedRule = rule;
      }
    }
  }
  return matchedRule;
}

function checkRateLimitStatus(
  clientId: string,
  rule: RateLimitRule,
  pathname: string
): {
  limited: boolean;
  remaining: number;
  resetTime: number;
  totalHits: number;
  limit: number;
} {
  const now = Date.now();

  const windowKey = `${clientId}:${pathname}:${Math.floor(now / rule.windowMs)}`;

  let data = requestStore.get(windowKey);

  if (!data || now > data.resetTime) {
    data = { count: 0, resetTime: now + rule.windowMs, lastAccess: now };
  }

  data.count++;
  data.lastAccess = now;
  requestStore.set(windowKey, data);

  const totalLimit = rule.maxRequests + (rule.burstRequests || 0);

  return {
    limited: data.count > totalLimit,
    remaining: Math.max(0, totalLimit - data.count),
    resetTime: data.resetTime,
    totalHits: data.count,
    limit: totalLimit,
  };
}

function createRateLimitedResponse(resetTime: number): NextResponse {
  const retryAfterSeconds = Math.ceil((resetTime - Date.now()) / 1000);
  return new NextResponse(
    JSON.stringify({
      error: "Too Many Requests",
      message: `Rate limit exceeded. Please try again after ${retryAfterSeconds} seconds.`,
      retryAfter: retryAfterSeconds,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": retryAfterSeconds.toString(),
      },
    }
  );
}

function setCorsHeaders(
  res: NextResponse,
  request: NextRequest
): NextResponse | null {
  let allowedOrigin = process.env.CORS_ORIGIN;
  if (!allowedOrigin) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse(
        JSON.stringify({
          error: "CORS Misconfiguration",
          message:
            "CORS_ORIGIN environment variable must be set in production.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      allowedOrigin = "http://localhost:3000";
      console.warn(
        "CORS_ORIGIN not set. Defaulting to http://localhost:3000 for development."
      );
    }
  }
  res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin, CSRF-Token"
  );
  res.headers.set("Vary", "Origin");

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }
  return null;
}

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    const isStaticAsset =
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/static/") ||
      pathname.includes(".") ||
      pathname.startsWith("/favicon") ||
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml";

    if (isStaticAsset) {
      return NextResponse.next();
    }

    const clientId = getClientIdentifier(request);
    const rule = getRateLimitRuleForPath(pathname);

    const { limited, remaining, resetTime, limit } = checkRateLimitStatus(
      clientId,
      rule,
      pathname
    );

    let response: NextResponse;
    if (limited) {
      response = createRateLimitedResponse(resetTime);
      console.warn(
        `[RateLimit] Blocked client ${clientId} on ${pathname} (limit: ${limit}) - Remaining: ${remaining}`
      );
    } else {
      response = NextResponse.next();
    }

    const corsResponse = setCorsHeaders(response, request);
    if (corsResponse) {
      return corsResponse;
    }

    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set(
      "X-RateLimit-Reset",
      Math.floor(resetTime / 1000).toString()
    );
    response.headers.set("X-RateLimit-Window-Ms", rule.windowMs.toString());

    response.headers.set("X-RateLimit-Client-ID", clientId);

    return response;
  } catch (err) {
    console.error(`[RateLimit] Uncaught middleware error:`, err);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred in the request processing.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js|map|json)$).*)",
  ],
};
