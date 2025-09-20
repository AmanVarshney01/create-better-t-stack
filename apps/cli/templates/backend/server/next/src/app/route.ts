import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "../lib/health";

export async function GET() {
  const health = await checkDatabaseHealth();
  const status = health.error ? 500 : 200;
  return NextResponse.json(health, { status });
}
