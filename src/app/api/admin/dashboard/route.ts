import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
}

const supabaseAdmin = createAdminClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

type AuthUser = {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata?: Record<string, unknown>;
};

type GuildTransaction = {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
};

type PortraitJob = {
  id: string;
  user_id: string;
  cast_id: string;
  status: string;
  token_cost: number | null;
  is_reroll: boolean | null;
  completed_portraits: unknown;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

type CastRow = {
  id: string;
  user_id: string;
  title: string | null;
  portraits_complete: boolean | null;
  is_active: boolean | null;
  created_at: string;
};

type TokenAccount = {
  user_id: string;
  balance: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

function countAfter<T>(
  rows: T[],
  getDate: (row: T) => string | null | undefined,
  since: string,
) {
  const threshold = new Date(since).getTime();

  return rows.filter((row) => {
    const value = getDate(row);

    if (!value) {
      return false;
    }

    return new Date(value).getTime() >= threshold;
  }).length;
}

function revenueForPurchase(transaction: GuildTransaction) {
  if (transaction.amount === 20) {
    return 5.99;
  }

  if (transaction.amount === 75) {
    return 19.99;
  }

  if (transaction.amount === 200) {
    return 39.99;
  }

  return 0;
}

function sum<T>(rows: T[], getter: (row: T) => number) {
  return rows.reduce((total, row) => total + getter(row), 0);
}

function safeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : 0;
}

function formatUserName(user: AuthUser) {
  const guildName = user.user_metadata?.guild_name;

  if (typeof guildName === "string" && guildName.trim()) {
    return guildName.trim();
  }

  return user.email?.split("@")[0] ?? "Guild Member";
}

async function listAllUsers() {
  const users: AuthUser[] = [];
  let page = 1;

  while (true) {
    const { data, error } =
      await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: 1000,
      });

    if (error) {
      throw error;
    }

    users.push(...(data.users as AuthUser[]));

    if (data.users.length < 1000) {
      break;
    }

    page += 1;

    if (page > 25) {
      break;
    }
  }

  return users;
}

function createDailySeries(
  users: AuthUser[],
  casts: CastRow[],
  jobs: PortraitJob[],
  transactions: GuildTransaction[],
) {
  return Array.from({ length: 14 }, (_, index) => {
    const daysAgo = 13 - index;
    const start = new Date();

    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - daysAgo);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const inDay = (value?: string | null) => {
      if (!value) {
        return false;
      }

      const timestamp = new Date(value).getTime();

      return (
        timestamp >= start.getTime() &&
        timestamp < end.getTime()
      );
    };

    const purchases = transactions.filter(
      (transaction) =>
        transaction.transaction_type === "purchase" &&
        inDay(transaction.created_at),
    );

    return {
      date: start.toISOString().slice(0, 10),
      signups: users.filter((user) => inDay(user.created_at)).length,
      casts: casts.filter((cast) => inDay(cast.created_at)).length,
      portraitSets: jobs.filter(
        (job) =>
          !job.is_reroll &&
          job.status === "completed" &&
          inDay(job.completed_at ?? job.created_at),
      ).length,
      revenue: Number(
        sum(purchases, revenueForPurchase).toFixed(2),
      ),
    };
  });
}

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin.authorized) {
      return NextResponse.json(
        { error: admin.error },
        { status: admin.status },
      );
    }

    const since7 = isoDaysAgo(7);
    const since30 = isoDaysAgo(30);

    const [
      users,
      castsResult,
      jobsResult,
      transactionsResult,
      accountsResult,
    ] = await Promise.all([
      listAllUsers(),
      supabaseAdmin
        .from("casts")
        .select(
          "id, user_id, title, portraits_complete, is_active, created_at",
        )
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("portrait_jobs")
        .select(
          "id, user_id, cast_id, status, token_cost, is_reroll, completed_portraits, error_message, created_at, completed_at",
        )
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("guild_token_transactions")
        .select(
          "id, user_id, amount, transaction_type, description, created_at",
        )
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("guild_token_accounts")
        .select("user_id, balance"),
    ]);

    if (castsResult.error) {
      throw castsResult.error;
    }

    if (jobsResult.error) {
      throw jobsResult.error;
    }

    if (transactionsResult.error) {
      throw transactionsResult.error;
    }

    if (accountsResult.error) {
      throw accountsResult.error;
    }

    const casts = (castsResult.data ?? []) as CastRow[];
    const jobs = (jobsResult.data ?? []) as PortraitJob[];
    const transactions =
      (transactionsResult.data ?? []) as GuildTransaction[];
    const accounts =
      (accountsResult.data ?? []) as TokenAccount[];

    const completedPortraitSets = jobs.filter(
      (job) => job.status === "completed" && !job.is_reroll,
    );

    const failedJobs = jobs.filter(
      (job) => job.status === "failed",
    );

    const activeJobs = jobs.filter((job) =>
      ["queued", "generating"].includes(job.status),
    );

    const rerollJobs = jobs.filter(
      (job) => job.is_reroll === true,
    );

    const purchases = transactions.filter(
      (transaction) =>
        transaction.transaction_type === "purchase" &&
        transaction.amount > 0,
    );

    const purchaseUserIds = new Set(
      purchases.map((transaction) => transaction.user_id),
    );

    const portraitUserIds = new Set(
      completedPortraitSets.map((job) => job.user_id),
    );

    const totalRevenue = sum(purchases, revenueForPurchase);
    const revenue30 = sum(
      purchases.filter(
        (transaction) => transaction.created_at >= since30,
      ),
      revenueForPurchase,
    );

    const estimatedPortraitBatchCost = safeNumber(
      Number(
        process.env
          .ADMIN_ESTIMATED_PORTRAIT_BATCH_COST_USD ?? 0.5,
      ),
    );

    const estimatedOpenAiCost =
      completedPortraitSets.length * estimatedPortraitBatchCost;

    const estimatedOpenAiCost30 =
      completedPortraitSets.filter(
        (job) => (job.completed_at ?? job.created_at) >= since30,
      ).length * estimatedPortraitBatchCost;

    const balances = new Map(
      accounts.map((account) => [
        account.user_id,
        safeNumber(account.balance),
      ]),
    );

    const userById = new Map(
      users.map((user) => [user.id, user]),
    );

    const recentMembers = [...users]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      )
      .slice(0, 8)
      .map((user) => ({
        id: user.id,
        name: formatUserName(user),
        email: user.email ?? "No email",
        joinedAt: user.created_at,
        lastSignInAt: user.last_sign_in_at ?? null,
        balance: balances.get(user.id) ?? 0,
        purchased: purchaseUserIds.has(user.id),
        commissionedPortraits: portraitUserIds.has(user.id),
      }));

    const recentActivity = [
      ...jobs.slice(0, 12).map((job) => {
        const user = userById.get(job.user_id);

        return {
          id: `job-${job.id}`,
          type:
            job.status === "failed"
              ? "error"
              : job.is_reroll
                ? "portrait"
                : "portrait",
          title:
            job.status === "failed"
              ? "Portrait commission failed"
              : job.is_reroll
                ? "Portrait recommission"
                : "Portrait set commissioned",
          detail:
            job.error_message ??
            `${user?.email ?? "Guild member"} · ${job.status}`,
          createdAt: job.completed_at ?? job.created_at,
        };
      }),
      ...transactions.slice(0, 16).map((transaction) => {
        const user = userById.get(transaction.user_id);

        return {
          id: `transaction-${transaction.id}`,
          type:
            transaction.transaction_type === "purchase"
              ? "purchase"
              : transaction.amount < 0
                ? "spend"
                : "token",
          title:
            transaction.transaction_type === "purchase"
              ? "Guild Token purchase"
              : transaction.description ??
                transaction.transaction_type,
          detail: `${user?.email ?? "Guild member"} · ${
            transaction.amount > 0 ? "+" : ""
          }${transaction.amount} tokens`,
          createdAt: transaction.created_at,
        };
      }),
      ...casts.slice(0, 12).map((cast) => {
        const user = userById.get(cast.user_id);

        return {
          id: `cast-${cast.id}`,
          type: "cast",
          title: "Cast saved",
          detail: `${user?.email ?? "Guild member"} · ${
            cast.title?.trim() || "Untitled Cast"
          }`,
          createdAt: cast.created_at,
        };
      }),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
      .slice(0, 16);

    const statusCounts = {
      queued: jobs.filter((job) => job.status === "queued").length,
      generating: jobs.filter(
        (job) => job.status === "generating",
      ).length,
      completed: jobs.filter(
        (job) => job.status === "completed",
      ).length,
      failed: failedJobs.length,
    };

    const response = {
      generatedAt: new Date().toISOString(),
      pricing: {
        currency: "USD",
        packs: [
          { tokens: 20, price: 5.99 },
          { tokens: 75, price: 19.99 },
          { tokens: 200, price: 39.99 },
        ],
        portraitSetTokens: 5,
        estimatedPortraitBatchCost,
      },
      metrics: {
        totalUsers: users.length,
        signups7d: countAfter(
          users,
          (user) => user.created_at,
          since7,
        ),
        signups30d: countAfter(
          users,
          (user) => user.created_at,
          since30,
        ),
        savedCasts: casts.length,
        savedCasts30d: countAfter(
          casts,
          (cast) => cast.created_at,
          since30,
        ),
        portraitSets: completedPortraitSets.length,
        portraitSets30d: countAfter(
          completedPortraitSets,
          (job) => job.completed_at ?? job.created_at,
          since30,
        ),
        rerolls: rerollJobs.length,
        activePortraitJobs: activeJobs.length,
        failedPortraitJobs: failedJobs.length,
        tokenBuyers: purchaseUserIds.size,
        portraitCustomers: portraitUserIds.size,
        conversionPercent:
          users.length > 0
            ? Number(
                (
                  (portraitUserIds.size / users.length) *
                  100
                ).toFixed(1),
              )
            : 0,
        buyerConversionPercent:
          users.length > 0
            ? Number(
                (
                  (purchaseUserIds.size / users.length) *
                  100
                ).toFixed(1),
              )
            : 0,
        totalRevenueUsd: Number(totalRevenue.toFixed(2)),
        revenue30dUsd: Number(revenue30.toFixed(2)),
        estimatedOpenAiCostUsd: Number(
          estimatedOpenAiCost.toFixed(2),
        ),
        estimatedOpenAiCost30dUsd: Number(
          estimatedOpenAiCost30.toFixed(2),
        ),
        estimatedGrossProfitUsd: Number(
          (totalRevenue - estimatedOpenAiCost).toFixed(2),
        ),
        estimatedGrossProfit30dUsd: Number(
          (revenue30 - estimatedOpenAiCost30).toFixed(2),
        ),
        tokensOutstanding: sum(
          accounts,
          (account) => safeNumber(account.balance),
        ),
        averageTokensPerBuyer:
          purchaseUserIds.size > 0
            ? Number(
                (
                  sum(
                    purchases,
                    (transaction) => transaction.amount,
                  ) / purchaseUserIds.size
                ).toFixed(1),
              )
            : 0,
      },
      portraitJobStatus: statusCounts,
      daily: createDailySeries(
        users,
        casts,
        jobs,
        transactions,
      ),
      recentMembers,
      recentActivity,
      notes: [
        "Revenue is reconstructed from current Guild Token pack sizes (20/$5.99, 75/$19.99, 200/$39.99). Manual or legacy purchase amounts are excluded from revenue rather than guessed.",
        "OpenAI portrait cost is an estimate. Set ADMIN_ESTIMATED_PORTRAIT_BATCH_COST_USD to your measured four-portrait average when you have enough production data.",
        "Free text recruit generations are not currently represented by a dedicated analytics table, so this dashboard intentionally does not fabricate that metric.",
      ],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "Guildmaster dashboard could not be loaded:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The Guildmaster Dashboard could not be loaded.",
      },
      { status: 500 },
    );
  }
}
