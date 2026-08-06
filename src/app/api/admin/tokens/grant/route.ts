import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";

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

type GrantTokensRequest = {
  email: string;
  amount: number;
  reason: string;
};

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin.authorized) {
      return NextResponse.json(
        { error: admin.error },
        { status: admin.status },
      );
    }

    const body =
      (await request.json()) as GrantTokensRequest;

    const email = body.email?.trim().toLowerCase();
    const amount = Number(body.amount);
    const reason = body.reason?.trim();

    if (!email) {
      return NextResponse.json(
        { error: "Enter the guild member's email address." },
        { status: 400 },
      );
    }

    if (
      !Number.isInteger(amount) ||
      amount <= 0 ||
      amount > 10000
    ) {
      return NextResponse.json(
        {
          error:
            "Token grant must be a whole number between 1 and 10,000.",
        },
        { status: 400 },
      );
    }

    if (!reason) {
      return NextResponse.json(
        { error: "Enter a reason for this token grant." },
        { status: 400 },
      );
    }

    const {
      data: usersResult,
      error: usersError,
    } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (usersError) {
      console.error(
        "Guild member lookup failed:",
        usersError,
      );

      return NextResponse.json(
        { error: "The guild member could not be located." },
        { status: 500 },
      );
    }

    const targetUser = usersResult.users.find(
      (user) =>
        user.email?.trim().toLowerCase() === email,
    );

    if (!targetUser) {
      return NextResponse.json(
        {
          error:
            "No NPC Recruiter account uses that email address.",
        },
        { status: 404 },
      );
    }

    const description =
      `Guildmaster grant: ${reason}`;

    const {
      data: newBalance,
      error: grantError,
    } = await supabaseAdmin.rpc(
      "grant_guild_tokens",
      {
        target_user_id: targetUser.id,
        token_amount: amount,
        transaction_description: description,
      },
    );

    if (grantError) {
      console.error(
        "Guild Token grant failed:",
        grantError,
      );

      return NextResponse.json(
        {
          error:
            "The Guild Tokens could not be granted.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      user: {
        id: targetUser.id,
        email: targetUser.email,
      },
      amount,
      balance: newBalance,
      message: `${amount} Guild Tokens granted to ${targetUser.email}.`,
    });
  } catch (error) {
    console.error(
      "Guildmaster token grant route failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The Guild Tokens could not be granted.",
      },
      { status: 500 },
    );
  }
}