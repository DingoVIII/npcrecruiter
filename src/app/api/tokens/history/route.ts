import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

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
            "You must be signed in to view the Guild Ledger.",
        },
        { status: 401 },
      );
    }

    const { data, error } = await supabase
      .from("guild_token_transactions")
      .select(
        `
          id,
          amount,
          transaction_type,
          description,
          created_at
        `,
      )
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(20);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      transactions: data ?? [],
    });
  } catch (error) {
    console.error(
      "Guild Ledger could not be loaded:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The Guild Ledger could not be loaded.",
      },
      { status: 500 },
    );
  }
}