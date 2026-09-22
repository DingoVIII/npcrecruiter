import { NextResponse } from "next/server";
import { createClient as adminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { generatePortraitBatch } from "@/lib/portraits/generatePortraitBatch";
export async function POST(request: Request) {
  let userId: string | undefined;
  let charged = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sign in to commission artwork." }, { status: 401 });
    const { npc, style } = await request.json();
    if (!npc?.name || !npc?.gender || !npc?.species || !npc?.occupation || !npc?.personality || !npc?.portraitPrompt || JSON.stringify(npc).length > 12000 || !["Fantasy", "Historical", "Photorealistic"].includes(style)) return NextResponse.json({ error: "Invalid portrait request." }, { status: 400 });
    const admin = adminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { error } = await admin.rpc("spend_guild_tokens", { target_user_id: user.id, token_amount: 2, transaction_kind: "portrait_generation", transaction_description: `Quest giver portrait: ${String(npc.name).slice(0, 90)}` });
    if (error) return NextResponse.json({ error: error.message }, { status: error.message.toLowerCase().includes("not enough") ? 402 : 500 });
    userId = user.id; charged = true;
    const portraits = await generatePortraitBatch([npc], style);
    if (!portraits[0]?.imageUrl) throw new Error("Empty portrait");
    return NextResponse.json({ portraitUrl: portraits[0].imageUrl });
  } catch (error) {
    console.error("Quest giver portrait failed", error);
    if (charged && userId) {
      const admin = adminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      const { error: refundError } = await admin.rpc("refund_guild_tokens", { target_user_id: userId, token_amount: 2, transaction_description: "Refund for failed quest giver portrait" });
      if (refundError) console.error("Quest giver portrait refund failed", refundError);
    }
    return NextResponse.json({ error: "Portrait generation failed; any charged tokens have been submitted for refund." }, { status: 500 });
  }
}
