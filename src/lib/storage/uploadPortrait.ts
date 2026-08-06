import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function uploadPortrait(
  imageBase64: string,
  npcName: string,
) {
  const buffer = Buffer.from(imageBase64, "base64");

  const fileName = `${randomUUID()}-${npcName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}.webp`;

    console.log(
  "SUPABASE URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);

const buckets = await supabase.storage.listBuckets();

console.log(
  "Buckets:",
  buckets.data?.map((bucket) => bucket.name),
);

console.log(
  "Bucket error:",
  buckets.error,
);

  const { error } = await supabase.storage
  .from("npc-portraits")
  .upload(fileName, buffer, {
    contentType: "image/webp",
    upsert: false,
  });

  if (error) {
    throw new Error(
      `Failed to upload portrait: ${error.message}`,
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("npc-portraits")
    .getPublicUrl(fileName);

  return publicUrl;
}