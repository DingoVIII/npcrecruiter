import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } });

export async function POST(request: Request) {
  try {
    const body = await request.json() as { visitorId?: string; sessionId?: string; eventName?: string; pagePath?: string; featuredNpcId?: string; success?: boolean; metadata?: Record<string, unknown> };
    const visitorId = body.visitorId?.trim();
    const eventName = body.eventName?.trim();
    const pagePath = body.pagePath?.trim() || "/";
    if (!visitorId || visitorId.length > 100 || !eventName || eventName.length > 100 || pagePath.length > 300) return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
    const { error } = await supabase.from("analytics_events").insert({ visitor_id: visitorId, session_id: body.sessionId?.slice(0, 100) || null, event_name: eventName, page_path: pagePath, featured_npc_id: body.featuredNpcId || null, success: body.success !== false, metadata: body.metadata ?? {} });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics event could not be recorded:", error);
    return NextResponse.json({ error: "Event could not be recorded." }, { status: 500 });
  }
}
