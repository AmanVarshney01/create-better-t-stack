import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const originHeader = request.headers.get("origin");
  const res = NextResponse.next()

  const allowedOrigins = process.env.CORS_ORIGINS?.split(",") ?? [];
  if (originHeader && allowedOrigins.includes(originHeader)) {
    res.headers.append("Access-Control-Allow-Origin", originHeader);
  }
  res.headers.append('Access-Control-Allow-Credentials', "true")
  res.headers.append('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.headers.append(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )

  return res
}

export const config = {
  matcher: '/:path*',
}
