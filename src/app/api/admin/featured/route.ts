import { createClient as adminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const admin = adminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { data, error } = await admin.from("featured_npcs").select("*").order("display_order").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Featured NPCs could not be loaded." }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const body = await request.json();
    const payload = { ...body, slug: String(body.slug || body.name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") };
    if (!payload.slug || !payload.name || !payload.quest_title || !payload.quest_hook || !payload.full_adventure) return NextResponse.json({ error: "Name, slug, quest title, hook and adventure are required." }, { status: 400 });
    const { data, error } = await admin.from("featured_npcs").insert(payload).select().single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Featured NPC create failed:", error);
    return NextResponse.json({ error: "Featured NPC could not be created." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "Featured NPC id is required." }, { status: 400 });
  const { id, ...changes } = body;
  const { data, error } = await admin.from("featured_npcs").update(changes).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "Featured NPC could not be updated." }, { status: 500 });
  return NextResponse.json({ item: data });
}
