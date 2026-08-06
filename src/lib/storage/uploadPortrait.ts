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

   
  const { data, error } = await supabase.storage
  .from("npc-portraits")
  .upload(fileName, buffer, {
    contentType: "image/webp",
    upsert: false,
  });

if (error) {
  console.error(error);
  throw error;
}

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("npc-portraits")
    .getPublicUrl(fileName);

  return publicUrl;
}