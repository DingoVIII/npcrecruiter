import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      authorized: false as const,
      status: 401,
      error: "You must be signed in.",
    };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = user.email?.trim().toLowerCase();

  if (!adminEmail) {
    console.error("Missing ADMIN_EMAIL environment variable.");

    return {
      authorized: false as const,
      status: 500,
      error: "Guildmaster access is not configured.",
    };
  }

  if (userEmail !== adminEmail) {
    return {
      authorized: false as const,
      status: 403,
      error: "Guildmaster access required.",
    };
  }

  return {
    authorized: true as const,
    user,
  };
}