import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient as adminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sign in to develop a full quest." }, { status: 401 });
    const { npc, questHook } = await request.json();
    if (!npc?.name || !npc?.personality || !questHook || JSON.stringify({ npc, questHook }).length > 14000) return NextResponse.json({ error: "Missing quest giver." }, { status: 400 });
    const response = await openai.responses.create({ model: "gpt-5-mini", input: `Create a complete system-neutral tabletop RPG quest for this NPC and hook. Include a short, evocative adventure title, then a Summary heading immediately beneath it, followed by the situation, objective, three actionable scenes, obstacles, meaningful player choices, NPC motivations, possible endings, and rewards. Make it playable without additional writing. The first line must be exactly "Title: <short evocative title>". The next section heading must be exactly "Summary". NPC: ${JSON.stringify(npc)}\nHook: ${String(questHook).slice(0, 1200)}` });
    if (!response.output_text.trim()) throw new Error("Empty quest");

    const admin = adminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { error } = await admin.rpc("spend_guild_tokens", { target_user_id: user.id, token_amount: 1, transaction_kind: "quest_generation", transaction_description: `Full quest: ${String(npc.name).slice(0, 90)}` });
    if (error) return NextResponse.json({ error: error.message }, { status: error.message.toLowerCase().includes("not enough") ? 402 : 500 });

    return NextResponse.json({ quest: response.output_text });
  } catch (error) {
    console.error("Full quest failed", error);
    return NextResponse.json({ error: "Full quest generation failed." }, { status: 500 });
  }
}
