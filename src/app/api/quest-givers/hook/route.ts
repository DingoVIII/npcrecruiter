import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const { npc, previousHook } = await request.json();

    if (
      !npc?.name ||
      !npc?.personality ||
      !npc?.roleplayingCue ||
      JSON.stringify(npc).length > 16000
    ) {
      return NextResponse.json(
        { error: "Missing character information." },
        { status: 400 },
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: `Create one concise, specific tabletop RPG quest hook for this existing character. Do not create or replace the character. The hook should give the character a concrete problem or request that players can act on, and should be 1-2 sentences. Make this a genuinely different adventure premise from the previous hook, changing the central problem, stakes, and likely situation rather than merely rewording it. Previous hook: ${String(previousHook || "None").slice(0, 2000)} Character: ${JSON.stringify(npc)}`,
    });

    const questHook = response.output_text.trim();
    if (!questHook) throw new Error("Empty quest hook");

    return NextResponse.json({ questHook });
  } catch (error) {
    console.error("Quest hook generation failed", error);
    return NextResponse.json(
      { error: "The quest hook could not be generated. Please try again." },
      { status: 500 },
    );
  }
}
