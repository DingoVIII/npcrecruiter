import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");

const supabaseAdmin = createAdminClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type AuthUser = {
  id: string;
  email?: string;
  created_at: string;
  user_metadata?: Record<string, unknown>;
};

function displayName(user: AuthUser) {
  const meta = user.user_metadata ?? {};
  for (const candidate of [meta.guild_name, meta.display_name, meta.full_name, meta.name]) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return user.email?.split("@")[0] ?? "Guild Member";
}

async function listAllUsers() {
  const users: AuthUser[] = [];
  let page = 1;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...(data.users as AuthUser[]));
    if (data.users.length < 1000 || page >= 25) break;
    page += 1;
  }

  return users;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin.authorized) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";
    const users = await listAllUsers();

    const filtered = users
      .filter((user) => {
        if (!query) return true;
        return displayName(user).toLowerCase().includes(query) ||
          (user.email?.toLowerCase() ?? "").includes(query);
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 25);

    const ids = filtered.map((user) => user.id);
    const balances = new Map<string, number>();

    if (ids.length) {
      const { data, error } = await supabaseAdmin
        .from("guild_token_accounts")
        .select("user_id, balance")
        .in("user_id", ids);
      if (error) throw error;
      for (const row of data ?? []) balances.set(row.user_id, Number(row.balance ?? 0));
    }

    return NextResponse.json({
      users: filtered.map((user) => ({
        id: user.id,
        name: displayName(user),
        email: user.email ?? "No email",
        joinedAt: user.created_at,
        balance: balances.get(user.id) ?? 0,
      })),
    });
  } catch (error) {
    console.error("Admin token user search failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Member search failed." },
      { status: 500 },
    );
  }
}
