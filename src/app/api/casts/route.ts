import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type SavedNpc = {
  name: string;
  gender: string;
  species: string;
  occupation: string;
  personality: string;
  roleplayingCue: string;
  portraitPrompt: string;
  portraitUrl?: string;
  hired?: boolean;
};

type SaveCastRequest = {
  title: string;
  location: string;
  inspiration: string;
  genderMix: string;
  species: string[];
  portraitStyle?: string;
  npcs: SavedNpc[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SaveCastRequest;

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "Enter a name for this cast." },
        { status: 400 },
      );
    }

    if (
      !body.location?.trim() ||
      !body.inspiration?.trim() ||
      !body.genderMix?.trim()
    ) {
      return NextResponse.json(
        { error: "The recruitment settings are incomplete." },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(body.species) ||
      body.species.length === 0
    ) {
      return NextResponse.json(
        { error: "The cast must include at least one species." },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(body.npcs) ||
      body.npcs.length !== 9
    ) {
      return NextResponse.json(
        { error: "A saved cast must contain exactly nine NPCs." },
        { status: 400 },
      );
    }

    const invalidNpc = body.npcs.find(
      (npc) =>
        !npc.name?.trim() ||
        !npc.gender?.trim() ||
        !npc.species?.trim() ||
        !npc.occupation?.trim() ||
        !npc.personality?.trim() ||
        !npc.roleplayingCue?.trim(),
    );

    if (invalidNpc) {
      return NextResponse.json(
        { error: "One or more NPCs are incomplete." },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Sign in before saving a cast." },
        { status: 401 },
      );
    }

    const portraitsComplete = body.npcs.every(
      (npc) =>
        typeof npc.portraitUrl === "string" &&
        npc.portraitUrl.length > 0,
    );

    const { data: cast, error: saveError } = await supabase
      .from("casts")
      .insert({
        user_id: user.id,
        title: body.title.trim(),
        location: body.location.trim(),
        inspiration: body.inspiration.trim(),
        gender_mix: body.genderMix.trim(),
        species: body.species,
        portrait_style: body.portraitStyle?.trim() || null,
        npcs: body.npcs,
        portraits_complete: portraitsComplete,
      })
      .select("id, title, portraits_complete")
      .single();

    if (saveError) {
      console.error("Cast save failed:", saveError);

      return NextResponse.json(
        { error: "The Guild Archive could not save this cast." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      cast,
      message: portraitsComplete
        ? "Complete cast saved."
        : "Text cast saved.",
    });
  } catch (error) {
    console.error("Cast save route failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The Guild Archive could not save this cast.",
      },
      { status: 500 },
    );
  }
}