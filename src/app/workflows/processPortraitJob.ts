import { createClient as createAdminClient } from "@supabase/supabase-js";

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

type PortraitJobStatus =
  | "queued"
  | "generating"
  | "completed"
  | "failed";

type PortraitJob = {
  id: string;
  user_id: string;
  cast_id: string;
  status: PortraitJobStatus;
  portrait_style: string;
  requested_npcs: unknown[];
  completed_portraits: unknown[];
  token_cost: number;
  is_reroll: boolean;
};

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

  return {
    jobId: job.id,
    processed: true,
    status: job.status,
  };
}

async function claimPortraitJob(
  jobId: string,
): Promise<PortraitJob | null> {
  "use step";

  const supabaseAdmin = createAdminClient(
    supabaseUrl!,
    supabaseServiceRoleKey!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

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
        completed_portraits,
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