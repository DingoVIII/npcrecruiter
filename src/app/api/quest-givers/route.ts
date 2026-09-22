import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildNpcGenerationPrompt } from "@/lib/prompts/npcGeneration";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.location !== "string" || typeof body.inspiration !== "string" ||
      typeof body.genderMix !== "string" || !Array.isArray(body.species) || !body.species.length ||
      body.species.length > 30 || body.species.some((s: unknown) => typeof s !== "string" || s.length > 70) ||
      [body.location, body.inspiration, body.genderMix].some((s: string) => !s.trim() || s.length > 160)) {
      return NextResponse.json({ error: "Choose your quest giver's setting and species." }, { status: 400 });
    }
    const prompt = buildNpcGenerationPrompt({ ...body, count: 1 }) + `\nGenerate ONE distinctive quest giver. Their roleplaying cue should hint at a specific playable problem, without resolving it.`;
    const result = await openai.responses.create({ model: "gpt-5-mini", input: prompt + `\nReturn only JSON: {"npcs":[{"name":"","gender":"","species":"","occupation":"","appearance":["","",""],"personality":"","roleplayingCue":"","portraitPrompt":""}],"questHook":""}. questHook: 1-2 sentences describing a concrete quest this NPC could offer.`, text: { format: { type: "json_object" } } });
    const parsed = JSON.parse(result.output_text);
    if (!Array.isArray(parsed.npcs) || parsed.npcs.length !== 1 || !parsed.npcs[0]?.name || !parsed.questHook) throw new Error("Invalid quest giver response");
    return NextResponse.json({ npc: parsed.npcs[0], questHook: parsed.questHook });
  } catch (error) {
    console.error("Quest giver generation failed", error);
    return NextResponse.json({ error: "The quest giver could not be generated. Please try again." }, { status: 500 });
  }
}
