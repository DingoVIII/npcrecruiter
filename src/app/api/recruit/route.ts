import { createClient } from "@/lib/supabase/server";

import OpenAI from "openai";
import { NextResponse } from "next/server";
import { formatInspirationPrompt } from "@/lib/inspirationPrompts";
import {
  buildNpcGenerationPrompt,
  type RecruitNpcInput,
} from "@/lib/prompts/npcGeneration";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type GeneratedNpc = {
  name: string;
  gender: string;
  species: string;
  occupation: string;
  appearance: [string, string, string];
  personality: string;
  roleplayingCue: string;
  portraitPrompt: string;
};

type RecruitResponse = {
  npcs: GeneratedNpc[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecruitNpcInput;

    if (
      !body.location ||
      !body.inspiration ||
      !body.genderMix ||
      !Array.isArray(body.species) ||
      body.species.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing recruitment requirements." },
        { status: 400 },
      );
    }

    const requestedCount = 4;

    const basePrompt = buildNpcGenerationPrompt({
  ...body,
  count: requestedCount,
  existingNames: Array.isArray(body.existingNames)
    ? body.existingNames
    : [],
});

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be signed in to recruit NPCs." },
        { status: 401 },
      );
    }

    

const inspirationGuidance =
  formatInspirationPrompt(body.inspiration);

const prompt = inspirationGuidance
  ? `${basePrompt}

INSPIRATION LIBRARY GUIDANCE

Use the following cultural guidance to make the NPCs feel coherent and distinctive.
Apply it naturally rather than mechanically.

${inspirationGuidance}`
  : basePrompt;

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "npc_recruitment",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              npcs: {
                type: "array",
                minItems: requestedCount,
                maxItems: requestedCount,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
  name: {
    type: "string",
    minLength: 1,
  },
  gender: {
    type: "string",
    minLength: 1,
  },
  species: {
    type: "string",
    minLength: 1,
  },
  occupation: {
  type: "string",
  minLength: 1,
},
appearance: {
  type: "array",
  minItems: 3,
  maxItems: 3,
  items: {
    type: "string",
    minLength: 1,
  },
},
personality: {
    type: "string",
    minLength: 1,
  },
  roleplayingCue: {
    type: "string",
    minLength: 1,
  },
  portraitPrompt: {
    type: "string",
    minLength: 1,
  },
},
                  required: [
  "name",
  "gender",
  "species",
  "occupation",
  "appearance",
  "personality",
  "roleplayingCue",
  "portraitPrompt",
],
                },
              },
            },
            required: ["npcs"],
          },
        },
      },
    });

    const result = JSON.parse(response.output_text) as RecruitResponse;

    function containsMeaningfulText(value: string) {
  return /[\p{L}\p{N}]/u.test(value.trim());
}

const hasInvalidCandidate = result.npcs?.some(
  (npc) =>
    [
      npc.name,
      npc.gender,
      npc.species,
      npc.occupation,
      npc.personality,
      npc.roleplayingCue,
      npc.portraitPrompt,
    ].some((value) => !containsMeaningfulText(value)) ||
    !Array.isArray(npc.appearance) ||
    npc.appearance.length !== 3 ||
    npc.appearance.some(
      (value) => !containsMeaningfulText(value),
    ),
);

if (
  !result.npcs ||
  result.npcs.length !== requestedCount ||
  hasInvalidCandidate
) {
      return NextResponse.json(
        { error: "The recruiter returned an invalid candidate list." },
        { status: 502 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("NPC recruitment failed:", error);

    return NextResponse.json(
      { error: "The recruiter could not complete the interviews." },
      { status: 500 },
    );
  }
}