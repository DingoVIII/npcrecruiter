import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");

const supabaseAdmin = createAdminClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type GrantBody = { userId?: unknown; amount?: unknown; reason?: unknown };

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin.authorized) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const body = (await request.json()) as GrantBody;
    const userId = typeof body.userId === "string" ? body.userId.trim() : "";
    const amount = Number(body.amount);
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 160) : "";

    if (!userId) return NextResponse.json({ error: "Select a guild member." }, { status: 400 });
    if (!Number.isInteger(amount) || amount < 1 || amount > 10000) {
      return NextResponse.json({ error: "Grant must be a whole number from 1 to 10,000." }, { status: 400 });
    }
    if (reason.length < 3) {
      return NextResponse.json({ error: "Add a short ledger reason." }, { status: 400 });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (authError || !authData.user) {
      return NextResponse.json({ error: "That guild member no longer exists." }, { status: 404 });
    }

    const { data: account, error: accountError } =
  await supabaseAdmin
    .from("guild_token_accounts")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();

if (accountError) throw accountError;

const previousBalance = Number(account?.balance ?? 0);

const { data: rpcResult, error: grantError } =
  await supabaseAdmin.rpc("grant_guild_tokens", {
    target_user_id: userId,
    token_amount: amount,
    transaction_description: `Guildmaster grant: ${reason}`,
  });

if (grantError) {
  throw grantError;
}

const newBalance =
  typeof rpcResult === "number"
    ? rpcResult
    : previousBalance + amount;

return NextResponse.json({
  success: true,
  user: {
    id: authData.user.id,
    email: authData.user.email ?? "No email",
  },
  amount,
  reason,
  previousBalance,
  newBalance,
});
} catch (error) {
  console.error("Grant error:", error);

  return NextResponse.json(
    {
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error),
    },
    { status: 500 }
  );
}
}