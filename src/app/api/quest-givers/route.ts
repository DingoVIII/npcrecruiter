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
    const prompt = buildNpcGenerationPrompt({ ...body, count: 1 }) + `\nGenerate ONE distinctive quest giver. Their roleplaying cue should hint at a specific playable problem, without resolving it. Include a concrete, playable 1-2 sentence questHook inside the NPC object, as specified in the shared JSON output format.`;
    const result = await openai.responses.create({ model: "gpt-5-mini", input: prompt, text: { format: { type: "json_object" } } });
    const parsed = JSON.parse(result.output_text);
    const npc = parsed?.npcs?.[0];
    const nestedHook = typeof npc?.questHook === "string" ? npc.questHook.trim() : "";
    const topLevelHook = typeof parsed?.questHook === "string" ? parsed.questHook.trim() : "";
    const questHook = nestedHook || topLevelHook;
    if (!Array.isArray(parsed?.npcs) || parsed.npcs.length !== 1 ||
      typeof npc?.name !== "string" || !npc.name.trim() || !questHook) {
      console.error("Invalid quest giver response shape", {
        npcCount: Array.isArray(parsed?.npcs) ? parsed.npcs.length : null,
        hasName: typeof npc?.name === "string" && !!npc.name.trim(),
        hasNestedHook: !!nestedHook,
        hasTopLevelHook: !!topLevelHook,
      });
      throw new Error("Invalid quest giver response");
    }
    return NextResponse.json({ npc, questHook });
  } catch (error) {
    console.error("Quest giver generation failed", error);
    return NextResponse.json({ error: "The quest giver could not be generated. Please try again." }, { status: 500 });
  }
}
