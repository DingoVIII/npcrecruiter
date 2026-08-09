import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type FeedbackBody = {
  rating?: unknown;
  comment?: unknown;
  allowContact?: unknown;
  pagePath?: unknown;
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

export async function POST(request: Request) {
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
            "You must be signed in to leave Guild Feedback.",
        },
        { status: 401 },
      );
    }

    const body = (await request.json()) as FeedbackBody;

    const rating = Number(body.rating);
    const comment = cleanText(body.comment, 4000);
    const pagePath = cleanText(body.pagePath, 500);
    const allowContact = body.allowContact === true;

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        {
          error:
            "Choose a star rating from 1 to 5.",
        },
        { status: 400 },
      );
    }

    if (!comment) {
      return NextResponse.json(
        {
          error:
            "Tell us what you think before sending.",
        },
        { status: 400 },
      );
    }

    const userAgent =
      request.headers.get("user-agent")?.slice(0, 1000) ??
      null;

    const appVersion =
      process.env.NEXT_PUBLIC_APP_VERSION?.trim() ||
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ||
      null;

    const { data: feedback, error: insertError } =
      await supabase
        .from("guild_feedback")
        .insert({
          user_id: user.id,
          rating,
          comment,
          allow_contact: allowContact,
          page_path: pagePath || null,
          app_version: appVersion,
          user_agent: userAgent,
        })
        .select("id, rating, created_at")
        .single();

    if (insertError) {
      console.error(
        "Guild Feedback insert failed:",
        insertError,
      );

      return NextResponse.json(
        {
          error:
            "Your feedback could not be recorded. Please try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      feedback,
      message:
        "Thank you. Your feedback has been sent to the Guildmaster.",
    });
  } catch (error) {
    console.error("Guild Feedback route failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Your feedback could not be recorded.",
      },
      { status: 500 },
    );
  }
}
