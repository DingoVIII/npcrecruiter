import { NextResponse } from "next/server";

// Text generation is unrestricted during the current open trial.
export async function GET() {
  return NextResponse.json({ cast: { ok: true, remaining: null }, questGiver: { ok: true, remaining: null } }, { headers: { "Cache-Control": "no-store" } });
}
