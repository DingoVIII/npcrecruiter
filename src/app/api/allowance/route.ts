import { NextResponse } from "next/server";
import { freeAllowance } from "@/lib/anonymous/allowance";
export async function GET(request: Request) {
  const [cast, questGiver] = await Promise.all([
    freeAllowance(request, "cast"), freeAllowance(request, "quest-giver"),
  ]);
  return NextResponse.json({ cast, questGiver }, { headers: { "Cache-Control": "no-store" } });
}
