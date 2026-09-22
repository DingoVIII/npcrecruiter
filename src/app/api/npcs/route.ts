import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to see your NPCs." }, { status: 401 });
  const { data, error } = await supabase.from("saved_npcs").select("id,npc,quest_hook,full_quest,created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load saved NPCs." }, { status: 500 });
  return NextResponse.json({ npcs: data });
}
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to save this NPC." }, { status: 401 });
  const { npc, questHook, fullQuest } = await request.json();
  if (!npc?.name || !npc?.species || !npc?.occupation || !npc?.personality || JSON.stringify(npc).length > 16000 || (questHook && (typeof questHook !== "string" || questHook.length > 2000)) || (fullQuest && (typeof fullQuest !== "string" || fullQuest.length > 40000))) return NextResponse.json({ error: "Invalid NPC." }, { status: 400 });
  const { data, error } = await supabase.from("saved_npcs").insert({ user_id: user.id, npc, quest_hook: questHook || null, full_quest: fullQuest || null }).select("id").single();
  if (error) return NextResponse.json({ error: "Could not save NPC." }, { status: 500 });
  return NextResponse.json({ id: data.id, message: `${npc.name} has joined your guild!` });
}
