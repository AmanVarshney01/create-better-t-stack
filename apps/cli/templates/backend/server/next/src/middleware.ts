import { NextRequest, NextResponse } from "next/server";

const corsOptions = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? ''
  const allowedOrigins = process.env.CORS_ORIGINS?.split(",") ?? [];
  const isAllowedOrigin = allowedOrigins.includes(origin)
  
  const isPreflight = request.method === 'OPTIONS'
  
  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }
  
  const response = NextResponse.next()
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  return response
}

export const config = {
  matcher: '/:path*',
}
