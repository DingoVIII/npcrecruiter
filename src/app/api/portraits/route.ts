import OpenAI from "openai";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
  buildPortraitPrompt,
  type PortraitNpc,
} from "@/lib/portraits/portraitPrompt";
import { uploadPortrait } from "@/lib/storage/uploadPortrait";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

type PortraitRequest = {
  npcs: PortraitNpc[];
  style: string;
  reroll?: boolean;
};

type GeneratedPortrait = {
  name: string;
  imageUrl: string;
};

export async function POST(request: Request) {
  let chargedUserId: string | null = null;
  let tokenCost = 0;
  let isReroll = false;
  const batchStartedAt = Date.now();

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

    const body = (await request.json()) as PortraitRequest;

isReroll = body.reroll === true;

const validNpcCount = isReroll
  ? body.npcs.length >= 1 && body.npcs.length <= 4
  : body.npcs.length === 4;

if (
  !Array.isArray(body.npcs) ||
  !validNpcCount ||
  !body.style?.trim()
) {
  return NextResponse.json(
    {
      error: isReroll
  ? "Between one and four portraits may be recommissioned."
  : "Four hired NPCs and one portrait style are required.",
    },
    { status: 400 },
  );
}

    for (const npc of body.npcs) {
      if (
        !npc.name?.trim() ||
        !npc.gender?.trim() ||
        !npc.species?.trim() ||
        !npc.occupation?.trim() ||
        !npc.personality?.trim() ||
        !npc.portraitPrompt?.trim()
      ) {
        return NextResponse.json(
          {
            error: `Missing portrait information for ${
              npc.name || "an NPC"
            }.`,
          },
          { status: 400 },
        );
      }
    }

    tokenCost = isReroll
  ? body.npcs.length
  : 5;

const transactionDescription = isReroll
  ? `Recommissioned ${tokenCost} portrait${
      tokenCost === 1 ? "" : "s"
    }`
  : "Commissioned a four-portrait NPC cast";

const { data: newBalance, error: spendError } =
  await supabaseAdmin.rpc("spend_guild_tokens", {
    target_user_id: user.id,
    token_amount: tokenCost,
    transaction_kind: isReroll
      ? "portrait_reroll"
      : "portrait_generation",
    transaction_description:
      transactionDescription,
  });

    if (spendError) {
      const insufficientTokens =
        spendError.message
          .toLowerCase()
          .includes("not enough guild tokens");

      return NextResponse.json(
        {
          error: insufficientTokens
            ? "You need 5 Guild Tokens to commission these portraits."
            : spendError.message,
        },
        {
          status: insufficientTokens ? 402 : 500,
        },
      );
    }

    chargedUserId = user.id;

const {
  data: activeCast,
  error: activeCastError,
} = await supabaseAdmin
  .from("casts")
  .select("id, npcs")
  .eq("user_id", user.id)
  .eq("is_active", true)
  .maybeSingle();

if (activeCastError) {
  throw new Error(
    "The active cast could not be loaded before portrait generation.",
  );
}

if (
  !activeCast ||
  !Array.isArray(activeCast.npcs)
) {
  throw new Error(
    "No active cast was found for this portrait commission.",
  );
}

const portraits = await Promise.all(
      body.npcs.map(
        async (
          npc,
        ): Promise<GeneratedPortrait> => {
          const portraitStartedAt = Date.now();

console.log(
  `[Portrait] Starting OpenAI generation for ${npc.name}`,
);

const result =
  await openai.images.generate({
              model: "gpt-image-2",
              prompt: buildPortraitPrompt(
                npc,
                body.style,
              ),
              size: "1024x1536",
              quality: "medium",
              output_format: "webp",
              output_compression: 80,
            });

            console.log(
  `[Portrait] OpenAI finished for ${npc.name} in ${
    Date.now() - portraitStartedAt
  }ms`,
);

          const imageBase64 =
            result.data?.[0]?.b64_json;

          if (!imageBase64) {
            throw new Error(
              `No portrait was returned for ${npc.name}.`,
            );
          }

          const uploadStartedAt = Date.now();

console.log(
  `[Portrait] Starting Supabase upload for ${npc.name}`,
);

const imageUrl = await uploadPortrait(
  imageBase64,
  npc.name,
);

console.log(
  `[Portrait] Supabase upload finished for ${npc.name} in ${
    Date.now() - uploadStartedAt
  }ms`,
);

return {
  name: npc.name,
  imageUrl,
};
        },
      ),
    );

    console.log(
  `[Portrait Batch] Completed ${portraits.length} portraits in ${
    Date.now() - batchStartedAt
  }ms`,
);

const portraitMap = new Map(
  portraits.map((portrait) => [
    portrait.name,
    portrait.imageUrl,
  ]),
);

const updatedNpcs = activeCast.npcs.map(
  (npc: {
    name?: string;
    portraitUrl?: string;
    portraitApproved?: boolean;
    [key: string]: unknown;
  }) => {
    const portraitUrl =
      typeof npc.name === "string"
        ? portraitMap.get(npc.name)
        : undefined;

    if (!portraitUrl) {
      return npc;
    }

    return {
      ...npc,
      portraitUrl,
      portraitApproved: false,
    };
  },
);

const portraitsComplete = updatedNpcs.every(
  (npc: { portraitUrl?: string }) =>
    typeof npc.portraitUrl === "string" &&
    npc.portraitUrl.length > 0,
);

const { error: activeCastUpdateError } =
  await supabaseAdmin
    .from("casts")
    .update({
      npcs: updatedNpcs,
      portrait_style: body.style.trim(),
      portraits_complete: portraitsComplete,
    })
    .eq("id", activeCast.id)
    .eq("user_id", user.id);

if (activeCastUpdateError) {
  throw new Error(
    "The portraits were created but could not be secured in the active cast.",
  );
}

return NextResponse.json({
      portraits,
      balance:
        typeof newBalance === "number"
          ? newBalance
          : null,
    });
  } catch (error) {
    console.error(
      "Portrait generation failed:",
      error,
    );

    if (chargedUserId) {
      const { error: refundError } =
        await supabaseAdmin.rpc(
          "refund_guild_tokens",
          {
            target_user_id: chargedUserId,
            token_amount: tokenCost,
            transaction_description:
              `Refund for failed ${
  isReroll
    ? "portrait recommission"
    : "portrait commission"
}`
          },
        );

      if (refundError) {
        console.error(
          "Automatic Guild Token refund failed:",
          refundError,
        );
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The portrait studio could not complete the commission.",
      },
      { status: 500 },
    );
  }
}