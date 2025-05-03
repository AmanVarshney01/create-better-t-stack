import { NextResponse } from "next/server";

export function middleware() {
  const res = NextResponse.next()

  res.headers.append('Access-Control-Allow-Credentials', "true")
  res.headers.append('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || "")
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
