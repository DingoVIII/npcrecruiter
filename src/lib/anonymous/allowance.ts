import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "node:crypto";

export type FreeMode = "cast" | "quest-giver";
export const FREE_LIMITS: Record<FreeMode, number> = { cast: 12, "quest-giver": 8 };

function redis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return Redis.fromEnv();
}

const developmentCounts = new Map<string, number>();

function identity(request: Request) {
  // Vercel supplies this header at its trusted edge. Do not accept an arbitrary client-supplied visitor ID.
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) return createHash("sha256").update(ip).digest("hex");
  if (process.env.NODE_ENV !== "production") {
    const localFingerprint = [
      request.headers.get("user-agent") || "local-browser",
      request.headers.get("accept-language") || "local-language",
      request.headers.get("host") || "localhost",
    ].join("|");
    return `local-${createHash("sha256").update(localFingerprint).digest("hex")}`;
  }
  return null;
}

export async function freeAllowance(request: Request, mode: FreeMode, consume = false) {
  const client = redis();
  const id = identity(request);
  if (!id) return { ok: false, remaining: 0, error: "Free generation is temporarily unavailable. Please try again later." };
  const limit = FREE_LIMITS[mode];
  const date = new Date().toISOString().slice(0, 10);
  const localKey = `${mode}:${id}:${date}`;
  if (!client) {
    if (process.env.NODE_ENV === "production") return { ok: false, remaining: 0, error: "Free generation is temporarily unavailable. Please try again later." };
    const used = developmentCounts.get(localKey) ?? 0;
    if (!consume) return { ok: true, remaining: Math.max(0, limit - used) };
    if (used >= limit) return { ok: false, remaining: 0, error: "Today's free generations are used up. Come back tomorrow." };
    developmentCounts.set(localKey, used + 1);
    return { ok: true, remaining: limit - used - 1 };
  }
  const ratelimit = new Ratelimit({ redis: client, limiter: Ratelimit.fixedWindow(limit, "1 d"), prefix: `npc-free-${mode}` });
  const key = `${id}:${date}`;
  try {
    if (consume) {
      const result = await ratelimit.limit(key);
      return { ok: result.success, remaining: result.remaining, error: result.success ? undefined : "Today's free generations are used up. Come back tomorrow." };
    }
    const result = await client.get<number>(`npc-free-${mode}:${key}`);
    return { ok: true, remaining: Math.max(0, limit - (result ?? 0)) };
  } catch (error) {
    console.error("Anonymous allowance unavailable", error);
    return { ok: false, remaining: 0, error: "Free generation is temporarily unavailable. Please try again later." };
  }
}
