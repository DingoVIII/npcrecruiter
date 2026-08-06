import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type ActiveNpc = {
  name: string;
  gender: string;
  species: string;
  occupation: string;
  personality: string;
  roleplayingCue: string;
  portraitPrompt: string;
  hired?: boolean;
  portraitUrl?: string;
  portraitApproved?: boolean;
};

type SaveActiveCastRequest = {
  title?: string;
  location: string;
  inspiration: string;
  genderMix: string;
  species: string[];
  portraitStyle?: string;
  npcs: ActiveNpc[];
};

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { cast: null },
        { status: 200 },
      );
    }

    const { data: cast, error: loadError } = await supabase
      .from("casts")
      .select(
        `
          id,
          title,
          location,
          inspiration,
          gender_mix,
          species,
          portrait_style,
          npcs,
          portraits_complete,
          is_active
        `,
      )
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (loadError) {
      console.error(
        "Active cast load failed:",
        loadError,
      );

      return NextResponse.json(
        {
          error:
            "The recruiter could not restore the active cast.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ cast });
  } catch (error) {
    console.error("Active cast GET failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The recruiter could not restore the active cast.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as SaveActiveCastRequest;

    if (
      !body.location?.trim() ||
      !body.inspiration?.trim() ||
      !body.genderMix?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "The recruitment settings are incomplete.",
        },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(body.species) ||
      body.species.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "The cast must include at least one species.",
        },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(body.npcs) ||
      body.npcs.length !== 4
    ) {
      return NextResponse.json(
        {
          error:
            "The active cast must contain exactly four NPCs.",
        },
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
        {
          error:
            "One or more NPCs are incomplete.",
        },
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
        {
          error:
            "Sign in before creating an active cast.",
        },
        { status: 401 },
      );
    }

    const portraitsComplete = body.npcs.every(
      (npc) =>
        typeof npc.portraitUrl === "string" &&
        npc.portraitUrl.length > 0,
    );

    const castValues = {
      title: body.title?.trim() || "Current Cast",
      location: body.location.trim(),
      inspiration: body.inspiration.trim(),
      gender_mix: body.genderMix.trim(),
      species: body.species,
      portrait_style:
        body.portraitStyle?.trim() || null,
      npcs: body.npcs,
      portraits_complete: portraitsComplete,
      is_active: true,
    };

    const { data: existingCast, error: findError } =
      await supabase
        .from("casts")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

    if (findError) {
      console.error(
        "Active cast lookup failed:",
        findError,
      );

      return NextResponse.json(
        {
          error:
            "The recruiter could not locate the active cast.",
        },
        { status: 500 },
      );
    }

    if (existingCast) {
      const { data: cast, error: updateError } =
        await supabase
          .from("casts")
          .update(castValues)
          .eq("id", existingCast.id)
          .eq("user_id", user.id)
          .select(
            "id, title, portraits_complete, is_active",
          )
          .single();

      if (updateError) {
        console.error(
          "Active cast update failed:",
          updateError,
        );

        return NextResponse.json(
          {
            error:
              "The recruiter could not update the active cast.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        cast,
        message: "Active cast updated.",
      });
    }

    const { data: cast, error: insertError } =
      await supabase
        .from("casts")
        .insert({
          user_id: user.id,
          ...castValues,
        })
        .select(
          "id, title, portraits_complete, is_active",
        )
        .single();

    if (insertError) {
      console.error(
        "Active cast creation failed:",
        insertError,
      );

      return NextResponse.json(
        {
          error:
            "The recruiter could not create the active cast.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      cast,
      message: "Active cast created.",
    });
  } catch (error) {
    console.error("Active cast POST failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The recruiter could not save the active cast.",
      },
      { status: 500 },
    );
  }
}