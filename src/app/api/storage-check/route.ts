import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseSecretKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return NextResponse.json(
      {
        ok: false,
        hasUrl: Boolean(supabaseUrl),
        hasSecretKey: Boolean(supabaseSecretKey),
      },
      { status: 500 },
    );
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const projectRef =
    new URL(supabaseUrl).hostname.split(".")[0];

  const { data: buckets, error } =
    await supabase.storage.listBuckets();

  return NextResponse.json({
    ok: !error,
    projectRef,
    keyType: supabaseSecretKey.startsWith("sb_secret_")
      ? "sb_secret"
      : supabaseSecretKey.startsWith("eyJ")
        ? "legacy_service_role"
        : "unknown",
    buckets:
      buckets?.map((bucket) => bucket.name) ?? [],
    bucketFound:
      buckets?.some(
        (bucket) => bucket.name === "npc-portraits",
      ) ?? false,
    error: error?.message ?? null,
  });
}