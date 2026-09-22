import { createClient as adminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const admin = adminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const buckets = new Set(["featured-media"]);

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const form = await request.formData();
  const file = form.get("file");
  const bucket = String(form.get("bucket") || "");
  if (!(file instanceof File) || !buckets.has(bucket)) return NextResponse.json({ error: "A valid featured media file is required." }, { status: 400 });
  if (file.size > 100 * 1024 * 1024) return NextResponse.json({ error: "Featured media must be 100MB or smaller." }, { status: 400 });
  const path = `${randomUUID()}-${file.name.replace(/[^a-z0-9._-]/gi, "-")}`;
  const { error } = await admin.storage.from(bucket).upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type || "application/octet-stream", upsert: false });
  if (error) return NextResponse.json({ error: "Featured media upload failed." }, { status: 500 });
  const { data } = admin.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
