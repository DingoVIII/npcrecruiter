import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
}

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      visitorId?: string;
      page?: string;
    };

    const visitorId = body.visitorId?.trim();
    const page = body.page?.trim() || "/";

    if (!visitorId || visitorId.length > 100) {
      return NextResponse.json(
        { error: "Invalid visitor." },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("site_visits")
      .insert({
        visitor_id: visitorId,
        page,
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Traffic visit could not be recorded:", error);

    return NextResponse.json(
      { error: "Visit could not be recorded." },
      { status: 500 },
    );
  }
}