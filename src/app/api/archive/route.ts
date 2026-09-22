import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type ArchiveRequest = {
  kind: "cast" | "questGiver";
  id: string;
  archived: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ArchiveRequest>;

    if (
      (body.kind !== "cast" && body.kind !== "questGiver") ||
      typeof body.id !== "string" ||
      !body.id ||
      typeof body.archived !== "boolean"
    ) {
      return NextResponse.json({ error: "Invalid archive request." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Sign in to manage your archive." }, { status: 401 });
    }

    const table = body.kind === "cast" ? "casts" : "saved_npcs";
    const { error } = await supabase
      .from(table)
      .update({ archived_at: body.archived ? new Date().toISOString() : null })
      .eq("id", body.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Archive update failed:", error);
      return NextResponse.json({ error: "The Guild Archive could not be updated." }, { status: 500 });
    }

    return NextResponse.json({ archived: body.archived });
  } catch (error) {
    console.error("Archive route failed:", error);
    return NextResponse.json({ error: "The Guild Archive could not be updated." }, { status: 500 });
  }
}
