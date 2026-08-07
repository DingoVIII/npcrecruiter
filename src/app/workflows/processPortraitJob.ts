import { createClient as createAdminClient } from "@supabase/supabase-js";

import {
  generatePortraitBatch,
  type GeneratedPortrait,
} from "@/lib/portraits/generatePortraitBatch";
import type { PortraitNpc } from "@/lib/portraits/portraitPrompt";

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

type PortraitJob = {
  id: string;
  user_id: string;
  cast_id: string;
  status: "generating";
  portrait_style: string;
  requested_npcs: PortraitNpc[];
  token_cost: number;
  is_reroll: boolean;
};

type StoredNpc = {
  name?: string;
  portraitUrl?: string;
  portraitApproved?: boolean;
  [key: string]: unknown;
};

function createAdminSupabase() {
  return createAdminClient(
    supabaseUrl!,
    supabaseServiceRoleKey!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export async function processPortraitJob(
  jobId: string,
) {
  "use workflow";

  const job = await claimPortraitJob(jobId);

if (!job) {
  return {
    jobId,
    processed: false,
  };
}

  try {
    const portraits = await generateJobPortraits(job);

    await completePortraitJob(
      job,
      portraits,
    );

    return {
      jobId,
      processed: true,
      status: "completed",
    };
  } catch (error) {
    await failPortraitJob(
      job,
      error instanceof Error
        ? error.message
        : "Portrait generation failed.",
    );

    throw error;
  }
}

async function claimPortraitJob(
  jobId: string,
): Promise<PortraitJob | null> {
  "use step";

  const supabaseAdmin =
    createAdminSupabase();

  const {
    data: claimedJob,
    error: claimError,
  } = await supabaseAdmin
    .from("portrait_jobs")
    .update({
      status: "generating",
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .eq("status", "queued")
    .select(
      `
        id,
        user_id,
        cast_id,
        status,
        portrait_style,
        requested_npcs,
        token_cost,
        is_reroll
      `,
    )
    .maybeSingle();

  if (claimError) {
    throw new Error(
      `Portrait job could not be claimed: ${claimError.message}`,
    );
  }

  return claimedJob as PortraitJob | null;
}

async function generateJobPortraits(
  job: PortraitJob,
): Promise<GeneratedPortrait[]> {
  "use step";
const supabaseAdmin = createAdminSupabase();

const { data: latestJob } = await supabaseAdmin
  .from("portrait_jobs")
  .select("completed_portraits")
  .eq("id", job.id)
  .single();

if (
  latestJob?.completed_portraits &&
  Array.isArray(latestJob.completed_portraits) &&
  latestJob.completed_portraits.length > 0
) {
  return latestJob.completed_portraits as GeneratedPortrait[];
}

  return generatePortraitBatch(
    job.requested_npcs,
    job.portrait_style,
  );
}

async function completePortraitJob(
  job: PortraitJob,
  portraits: GeneratedPortrait[],
) {
  "use step";

  const supabaseAdmin =
    createAdminSupabase();

  const {
    data: cast,
    error: castError,
  } = await supabaseAdmin
    .from("casts")
    .select("npcs")
    .eq("id", job.cast_id)
    .eq("user_id", job.user_id)
    .single();

  if (
    castError ||
    !cast ||
    !Array.isArray(cast.npcs)
  ) {
    throw new Error(
      "The active cast could not be loaded.",
    );
  }

  const portraitMap = new Map(
    portraits.map((portrait) => [
      portrait.name,
      portrait.imageUrl,
    ]),
  );

  const updatedNpcs = (
    cast.npcs as StoredNpc[]
  ).map((npc) => {
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
  });

  const portraitsComplete =
    updatedNpcs.every(
      (npc) =>
        typeof npc.portraitUrl === "string" &&
        npc.portraitUrl.length > 0,
    );

  const { error: castUpdateError } =
    await supabaseAdmin
      .from("casts")
      .update({
        npcs: updatedNpcs,
        portrait_style:
          job.portrait_style,
        portraits_complete:
          portraitsComplete,
      })
      .eq("id", job.cast_id)
      .eq("user_id", job.user_id);

  if (castUpdateError) {
    throw new Error(
      `The portraits could not be saved: ${castUpdateError.message}`,
    );
  }

  const transactionDescription =
    job.is_reroll
      ? `Recommissioned ${job.token_cost} portrait${
          job.token_cost === 1 ? "" : "s"
        }`
      : "Commissioned a four-portrait NPC cast";

  const {
    error: captureError,
  } = await supabaseAdmin.rpc(
    "capture_reserved_guild_tokens",
    {
      target_user_id: job.user_id,
      token_amount: job.token_cost,
      transaction_kind: job.is_reroll
        ? "portrait_reroll"
        : "portrait_generation",
      transaction_description:
        transactionDescription,
    },
  );

  if (captureError) {
    throw new Error(
      `Reserved Guild Tokens could not be captured: ${captureError.message}`,
    );
  }

  const { error: jobUpdateError } =
    await supabaseAdmin
      .from("portrait_jobs")
      .update({
        status: "completed",
        completed_portraits: portraits,
        completed_at:
          new Date().toISOString(),
        updated_at:
          new Date().toISOString(),
        error_message: null,
      })
      .eq("id", job.id)
      .eq("status", "generating");

  if (jobUpdateError) {
    throw new Error(
      `Portrait job could not be completed: ${jobUpdateError.message}`,
    );
  }
}

async function failPortraitJob(
  job: PortraitJob,
  errorMessage: string,
) {
  "use step";

  const supabaseAdmin =
    createAdminSupabase();

  const {
    error: releaseError,
  } = await supabaseAdmin.rpc(
    "release_reserved_guild_tokens",
    {
      target_user_id: job.user_id,
      token_amount: job.token_cost,
    },
  );

  if (releaseError) {
    console.error(
      "Portrait reservation release failed:",
      releaseError,
    );
  }

  const { error: jobUpdateError } =
    await supabaseAdmin
      .from("portrait_jobs")
      .update({
        status: "failed",
        error_message: errorMessage,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", job.id)
      .eq("status", "generating");

  if (jobUpdateError) {
    console.error(
      "Portrait job failure status could not be saved:",
      jobUpdateError,
    );
  }
}