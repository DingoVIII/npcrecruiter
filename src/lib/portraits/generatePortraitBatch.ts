import OpenAI from "openai";

import {
  buildPortraitPrompt,
  type PortraitNpc,
} from "@/lib/portraits/portraitPrompt";
import { uploadPortrait } from "@/lib/storage/uploadPortrait";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type GeneratedPortrait = {
  name: string;
  imageUrl: string;
};

export async function generatePortraitBatch(
  npcs: PortraitNpc[],
  style: string,
): Promise<GeneratedPortrait[]> {
  const batchStartedAt = Date.now();

  const portraits = await Promise.all(
    npcs.map(async (npc): Promise<GeneratedPortrait> => {
      const portraitStartedAt = Date.now();

      console.log(
        `[Portrait] Starting OpenAI generation for ${npc.name}`,
      );

      const result = await openai.images.generate({
        model: "gpt-image-2",
        prompt: buildPortraitPrompt(npc, style),
        size: "1024x1536",
        quality: "medium",
        output_format: "webp",
        output_compression: 80,
      });

      console.log(
        `[Portrait] OpenAI finished for ${npc.name} in ${
          Date.now() - portraitStartedAt
        }ms`,
      );

      const imageBase64 = result.data?.[0]?.b64_json;

      if (!imageBase64) {
        throw new Error(
          `No portrait was returned for ${npc.name}.`,
        );
      }

      const uploadStartedAt = Date.now();

      console.log(
        `[Portrait] Starting Supabase upload for ${npc.name}`,
      );

      const imageUrl = await uploadPortrait(
        imageBase64,
        npc.name,
      );

      console.log(
        `[Portrait] Supabase upload finished for ${npc.name} in ${
          Date.now() - uploadStartedAt
        }ms`,
      );

      return {
        name: npc.name,
        imageUrl,
      };
    }),
  );

  console.log(
    `[Portrait Batch] Completed ${portraits.length} portraits in ${
      Date.now() - batchStartedAt
    }ms`,
  );

  return portraits;
}