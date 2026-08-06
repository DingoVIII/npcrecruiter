import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL.",
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY.",
  );
}

const supabaseAdmin = createAdminClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

type PortraitJobNpc = {
  name: string;
  gender: string;
  species: string;
  occupation: string;
  personality: string;
  portraitPrompt: string;
};

type CreatePortraitJobRequest = {
  npcs: PortraitJobNpc[];
  style: string;
  reroll?: boolean;
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
        {
          error:
            "You must be signed in to view portrait commissions.",
        },
        { status: 401 },
      );
    }

    const {
      data: job,
      error: jobError,
    } = await supabaseAdmin
      .from("portrait_jobs")
      .select(
        `
          id,
          cast_id,
          status,
          portrait_style,
          requested_npcs,
          completed_portraits,
          token_cost,
          is_reroll,
          error_message,
          created_at,
          updated_at,
          completed_at
        `,
      )
      .eq("user_id", user.id)
      .in("status", ["queued", "generating"])
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (jobError) {
      console.error(
        "Portrait job lookup failed:",
        jobError,
      );

      return NextResponse.json(
        {
          error:
            "The portrait commission could not be restored.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error(
      "Portrait job GET failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The portrait commission could not be restored.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let chargedUserId: string | null = null;
  let tokenCost = 0;

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            "You must be signed in to commission portraits.",
        },
        { status: 401 },
      );
    }

    const body =
      (await request.json()) as CreatePortraitJobRequest;

    const isReroll = body.reroll === true;

    const validNpcCount =
      Array.isArray(body.npcs) &&
      (isReroll
        ? body.npcs.length >= 1 &&
          body.npcs.length <= 4
        : body.npcs.length === 4);

    if (!validNpcCount || !body.style?.trim()) {
      return NextResponse.json(
        {
          error: isReroll
            ? "Between one and four portraits may be recommissioned."
            : "Four hired NPCs and one portrait style are required.",
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
        !npc.portraitPrompt?.trim(),
    );

    if (invalidNpc) {
      return NextResponse.json(
        {
          error:
            "One or more NPCs are missing portrait information.",
        },
        { status: 400 },
      );
    }

    const {
      data: activeCast,
      error: activeCastError,
    } = await supabaseAdmin
      .from("casts")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (activeCastError) {
      console.error(
        "Active cast lookup failed:",
        activeCastError,
      );

      return NextResponse.json(
        {
          error:
            "The active cast could not be located.",
        },
        { status: 500 },
      );
    }

    if (!activeCast) {
      return NextResponse.json(
        {
          error:
            "No active cast exists for this portrait commission.",
        },
        { status: 400 },
      );
    }

    const {
      data: existingJob,
      error: existingJobError,
    } = await supabaseAdmin
      .from("portrait_jobs")
      .select(
        `
          id,
          cast_id,
          status,
          portrait_style,
          requested_npcs,
          completed_portraits,
          token_cost,
          is_reroll
        `,
      )
      .eq("cast_id", activeCast.id)
      .in("status", ["queued", "generating"])
      .maybeSingle();

    if (existingJobError) {
      console.error(
        "Existing portrait job lookup failed:",
        existingJobError,
      );

      return NextResponse.json(
        {
          error:
            "The portrait studio could not check the current commission.",
        },
        { status: 500 },
      );
    }

    if (existingJob) {
      return NextResponse.json({
        job: existingJob,
        resumed: true,
        message:
          "The existing portrait commission was restored.",
      });
    }

    tokenCost = isReroll
      ? body.npcs.length
      : 5;

    const transactionDescription = isReroll
      ? `Recommissioned ${tokenCost} portrait${
          tokenCost === 1 ? "" : "s"
        }`
      : "Commissioned a four-portrait NPC cast";

    const {
  data: availableBalance,
  error: reserveError,
} = await supabaseAdmin.rpc(
  "reserve_guild_tokens",
  {
    target_user_id: user.id,
    token_amount: tokenCost,
  },
);

    if (reserveError) {
  const insufficientTokens =
    reserveError.message
      .toLowerCase()
      .includes("not enough guild tokens");

  return NextResponse.json(
    {
      error: insufficientTokens
        ? `You need ${tokenCost} available Guild Tokens for this commission.`
        : reserveError.message,
    },
    {
      status: insufficientTokens ? 402 : 500,
    },
  );
}

    chargedUserId = user.id;

    const {
      data: job,
      error: insertError,
    } = await supabaseAdmin
      .from("portrait_jobs")
      .insert({
        user_id: user.id,
        cast_id: activeCast.id,
        status: "queued",
        portrait_style: body.style.trim(),
        requested_npcs: body.npcs,
        completed_portraits: [],
        token_cost: tokenCost,
        is_reroll: isReroll,
      })
      .select(
        `
          id,
          cast_id,
          status,
          portrait_style,
          requested_npcs,
          completed_portraits,
          token_cost,
          is_reroll,
          created_at
        `,
      )
      .single();

    if (insertError) {
      throw new Error(
        `The portrait job could not be created: ${insertError.message}`,
      );
    }

    return NextResponse.json({
      job,
      balance:
  typeof availableBalance === "number"
    ? availableBalance
    : null,
      resumed: false,
      message:
        "Portrait commission created.",
    });
  } catch (error) {
    console.error(
      "Portrait job POST failed:",
      error,
    );

    if (chargedUserId && tokenCost > 0) {
      const { error: releaseError } =
  await supabaseAdmin.rpc(
    "release_reserved_guild_tokens",
    {
      target_user_id: chargedUserId,
      token_amount: tokenCost,
    },
  );

      if (releaseError) {
  console.error(
    "Portrait job reservation release failed:",
    releaseError,
  );
}
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The portrait commission could not be created.",
      },
      { status: 500 },
    );
  }
}