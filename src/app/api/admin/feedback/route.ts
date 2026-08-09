import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";

export const dynamic = "force-dynamic";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
}

if (!serviceKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
}

const supabaseAdmin = createAdminClient(
  supabaseUrl,
  serviceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

type FeedbackRow = {
  id: string;
  user_id: string | null;
  rating: number;
  comment: string;
  allow_contact: boolean;
  page_path: string | null;
  app_version: string | null;
  user_agent: string | null;
  created_at: string;
};

type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

function displayName(user?: AuthUser) {
  if (!user) {
    return "Former Guild Member";
  }

  const metadata = user.user_metadata ?? {};

  for (const candidate of [
    metadata.guild_name,
    metadata.display_name,
    metadata.full_name,
    metadata.name,
  ]) {
    if (
      typeof candidate === "string" &&
      candidate.trim()
    ) {
      return candidate.trim();
    }
  }

  return user.email?.split("@")[0] ?? "Guild Member";
}

async function listAllUsers() {
  const users: AuthUser[] = [];
  let page = 1;

  while (true) {
    const { data, error } =
      await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: 1000,
      });

    if (error) {
      throw error;
    }

    users.push(...(data.users as AuthUser[]));

    if (data.users.length < 1000) {
      break;
    }

    page += 1;

    if (page > 25) {
      break;
    }
  }

  return users;
}

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin.authorized) {
      return NextResponse.json(
        { error: admin.error },
        { status: admin.status },
      );
    }

    const [{ data, error }, users] =
      await Promise.all([
        supabaseAdmin
          .from("guild_feedback")
          .select(
            "id, user_id, rating, comment, allow_contact, page_path, app_version, user_agent, created_at",
          )
          .order("created_at", {
            ascending: false,
          })
          .limit(200),
        listAllUsers(),
      ]);

    if (error) {
      throw error;
    }

    const feedback = (data ?? []) as FeedbackRow[];
    const userById = new Map(
      users.map((user) => [user.id, user]),
    );

    const totalResponses = feedback.length;
    const averageRating =
      totalResponses > 0
        ? Number(
            (
              feedback.reduce(
                (total, item) =>
                  total + Number(item.rating),
                0,
              ) / totalResponses
            ).toFixed(2),
          )
        : 0;

    const ratingCounts = [1, 2, 3, 4, 5].reduce(
      (accumulator, rating) => {
        accumulator[rating] = feedback.filter(
          (item) => item.rating === rating,
        ).length;

        return accumulator;
      },
      {} as Record<number, number>,
    );

    return NextResponse.json({
      summary: {
        totalResponses,
        averageRating,
        contactOkay: feedback.filter(
          (item) => item.allow_contact,
        ).length,
        ratingCounts,
      },
      feedback: feedback.map((item) => {
        const user = item.user_id
          ? userById.get(item.user_id)
          : undefined;

        return {
          id: item.id,
          rating: item.rating,
          comment: item.comment,
          allowContact: item.allow_contact,
          pagePath: item.page_path,
          appVersion: item.app_version,
          createdAt: item.created_at,
          user: {
            id: item.user_id,
            name: displayName(user),
            email:
              user?.email ??
              (item.user_id
                ? "Email unavailable"
                : "Account deleted"),
          },
        };
      }),
    });
  } catch (error) {
    console.error(
      "Guildmaster feedback load failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Guild Feedback could not be loaded.",
      },
      { status: 500 },
    );
  }
}
