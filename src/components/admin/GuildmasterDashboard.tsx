"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type DashboardData = {
  generatedAt: string;
  pricing: {
    currency: string;
    packs: {
      tokens: number;
      price: number;
    }[];
    portraitSetTokens: number;
    estimatedPortraitBatchCost: number;
  };
  metrics: {
  uniqueVisitors: number;
  totalPageViews: number;
  landingVisitors: number;
  recruitVisitors: number;
  landingToRecruitPercent: number;
  totalUsers: number;
    signups7d: number;
    signups30d: number;
    savedCasts: number;
    savedCasts30d: number;
    portraitSets: number;
    portraitSets30d: number;
    rerolls: number;
    activePortraitJobs: number;
    failedPortraitJobs: number;
    tokenBuyers: number;
    portraitCustomers: number;
    conversionPercent: number;
    buyerConversionPercent: number;
    totalRevenueUsd: number;
    revenue30dUsd: number;
    estimatedOpenAiCostUsd: number;
    estimatedOpenAiCost30dUsd: number;
    estimatedGrossProfitUsd: number;
    estimatedGrossProfit30dUsd: number;
    tokensOutstanding: number;
    averageTokensPerBuyer: number;
  };
  portraitJobStatus: {
    queued: number;
    generating: number;
    completed: number;
    failed: number;
  };
  daily: {
    date: string;
    signups: number;
    casts: number;
    portraitSets: number;
    revenue: number;
  }[];
  recentMembers: {
    id: string;
    name: string;
    email: string;
    joinedAt: string;
    lastSignInAt: string | null;
    balance: number;
    purchased: boolean;
    commissionedPortraits: boolean;
  }[];
  recentActivity: {
    id: string;
    type: string;
    title: string;
    detail: string;
    createdAt: string;
  }[];
  notes: string[];
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const whole = new Intl.NumberFormat("en-US");

function shortDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function dateTime(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function GuildmasterDashboard() {
  const [data, setData] =
    useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastLoadedAt, setLastLoadedAt] =
    useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/dashboard",
        {
          cache: "no-store",
        },
      );

      const result = (await response.json()) as
        | DashboardData
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in result && result.error
            ? result.error
            : "Dashboard request failed.",
        );
      }

      setData(result as DashboardData);
      setLastLoadedAt(new Date().toISOString());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "The dashboard could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const maxDailyActivity = useMemo(() => {
    if (!data) {
      return 1;
    }

    return Math.max(
      1,
      ...data.daily.map(
        (day) =>
          day.signups + day.casts + day.portraitSets,
      ),
    );
  }, [data]);

  if (!data && isLoading) {
    return <DashboardLoading />;
  }

  if (!data && error) {
    return (
      <main className="min-h-screen bg-[#100c08] px-4 py-10 text-[#f2dfb8]">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#7e5a25] bg-[#1a130d] p-8 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#bf9749]">
            Guildmaster Dashboard
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold">
            The ledger could not be opened.
          </h1>
          <p className="mt-4 rounded-lg border border-[#783c30] bg-[#2b1712] p-4 text-sm text-[#efb8aa]">
            {error}
          </p>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="mt-6 border border-[#b58a36] bg-[#b58a36] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#160f08] transition hover:bg-[#d2a950]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  const m = data.metrics;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#2a1c0e_0%,#161009_42%,#0e0a07_100%)] text-[#f4e6c6]">
      <div className="mx-auto max-w-[1780px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-2xl border border-[#7f5c27] bg-[linear-gradient(135deg,#25190e_0%,#17100a_55%,#2a1b0d_100%)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.42)] sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border border-[#8a682e]/30" />
          <div className="pointer-events-none absolute -right-5 -top-16 h-48 w-48 rounded-full border border-[#8a682e]/25" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#a47d34] bg-[#171009] text-xl shadow-inner">
                  ♜
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#c9a154]">
                    NPC Recruiter
                  </p>
                  <h1 className="font-serif text-3xl font-bold tracking-tight text-[#f7e9c9] sm:text-4xl">
                    Guildmaster Dashboard
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-[#c9b991]">
                Alpha command centre for members,
                commissions, Guild Tokens, archive
                activity, revenue and operational health.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/tokens/grant"
                className="rounded-lg border border-[#9c7530] bg-[#23170d] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.11em] text-[#e9d19b] transition hover:bg-[#342313]"
              >
                Grant Tokens
              </Link>

              <Link
                href="/recruit"
                className="rounded-lg border border-[#665539] bg-[#16110c] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.11em] text-[#cdbd99] transition hover:border-[#9c7530]"
              >
                Open Recruiter
              </Link>

              <button
                type="button"
                onClick={() => void loadDashboard()}
                disabled={isLoading}
                className="rounded-lg border border-[#c59b47] bg-[#b38835] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.11em] text-[#171008] transition hover:bg-[#cba34e] disabled:cursor-wait disabled:opacity-60"
              >
                {isLoading ? "Refreshing..." : "Refresh Ledger"}
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="mt-4 rounded-xl border border-[#7d3b2d] bg-[#2b1611] px-4 py-3 text-sm text-[#efb8aa]">
            Refresh failed: {error}. Showing the
            previously loaded ledger.
          </div>
        )}
          <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
  <MetricCard
    eyebrow="Unique Visitors"
    value={whole.format(m.uniqueVisitors)}
    detail={`${whole.format(m.totalPageViews)} total page views`}
    accent="gold"
  />

  <MetricCard
    eyebrow="Landing Page"
    value={whole.format(m.landingVisitors)}
    detail="Unique visitors to npcrecruiter.com"
    accent="gold"
  />

  <MetricCard
    eyebrow="Recruit Page"
    value={whole.format(m.recruitVisitors)}
    detail="Unique visitors to /recruit"
    accent="green"
  />

  <MetricCard
    eyebrow="Landing → Recruit"
    value={`${m.landingToRecruitPercent}%`}
    detail="Visitors who progressed to recruiting"
    accent="green"
  />

  <MetricCard
    eyebrow="Guild Members"
    value={whole.format(m.totalUsers)}
    detail={`+${m.signups7d} in 7 days · +${m.signups30d} in 30`}
    accent="gold"
  />
</section>
        <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          
          <MetricCard
            eyebrow="Portrait Customers"
            value={whole.format(m.portraitCustomers)}
            detail={`${m.conversionPercent}% of all accounts`}
            accent="green"
          />
          <MetricCard
            eyebrow="Lifetime Revenue"
            value={money.format(m.totalRevenueUsd)}
            detail={`${money.format(m.revenue30dUsd)} in the last 30 days`}
            accent="gold"
          />
          <MetricCard
            eyebrow="Est. Gross Profit"
            value={money.format(m.estimatedGrossProfitUsd)}
            detail={`${money.format(m.estimatedGrossProfit30dUsd)} in last 30 days`}
            accent="green"
          />
        </section>

        <section className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SmallMetric
            label="Saved Casts"
            value={whole.format(m.savedCasts)}
            sub={`${m.savedCasts30d} / 30d`}
          />
          <SmallMetric
            label="Portrait Sets"
            value={whole.format(m.portraitSets)}
            sub={`${m.portraitSets30d} / 30d`}
          />
          <SmallMetric
            label="Token Buyers"
            value={whole.format(m.tokenBuyers)}
            sub={`${m.buyerConversionPercent}% account conversion`}
          />
          <SmallMetric
            label="Tokens Outstanding"
            value={whole.format(m.tokensOutstanding)}
            sub={`${m.averageTokensPerBuyer} avg purchased / buyer`}
          />
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_0.85fr]">
          <Panel
            title="Fourteen-Day Guild Pulse"
            subtitle="Signups, saved casts and completed portrait sets."
          >
            <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] items-end gap-1.5 pt-4">
              {data.daily.map((day) => {
                const total =
                  day.signups +
                  day.casts +
                  day.portraitSets;
                const height = Math.max(
                  8,
                  Math.round(
                    (total / maxDailyActivity) * 160,
                  ),
                );

                return (
                  <div
                    key={day.date}
                    className="group flex min-w-0 flex-col items-center"
                    title={`${day.date}: ${day.signups} signups, ${day.casts} casts, ${day.portraitSets} portrait sets, ${money.format(day.revenue)}`}
                  >
                    <div className="flex h-44 w-full items-end justify-center">
                      <div
                        className="w-full max-w-8 rounded-t-sm border border-[#9a7532]/60 bg-[linear-gradient(180deg,#c29a47_0%,#70501e_100%)] opacity-80 transition group-hover:opacity-100"
                        style={{ height }}
                      />
                    </div>
                    <span className="mt-2 hidden text-[9px] text-[#8f8167] md:block">
                      {shortDate(day.date)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid gap-2 border-t border-[#47351e] pt-4 sm:grid-cols-3">
              <PulseKey
                label="Signups"
                value={data.daily.reduce(
                  (total, day) => total + day.signups,
                  0,
                )}
              />
              <PulseKey
                label="Casts"
                value={data.daily.reduce(
                  (total, day) => total + day.casts,
                  0,
                )}
              />
              <PulseKey
                label="Portrait Sets"
                value={data.daily.reduce(
                  (total, day) =>
                    total + day.portraitSets,
                  0,
                )}
              />
            </div>
          </Panel>

          <Panel
            title="Portrait Studio"
            subtitle="Queue health and current production state."
          >
            <div className="grid grid-cols-2 gap-3">
              <StatusBlock
                label="Queued"
                value={data.portraitJobStatus.queued}
              />
              <StatusBlock
                label="Generating"
                value={
                  data.portraitJobStatus.generating
                }
              />
              <StatusBlock
                label="Completed"
                value={data.portraitJobStatus.completed}
              />
              <StatusBlock
                label="Failed"
                value={data.portraitJobStatus.failed}
                danger={
                  data.portraitJobStatus.failed > 0
                }
              />
            </div>

            <div className="mt-4 rounded-xl border border-[#4d3d27] bg-[#120e0a] p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.14em] text-[#a99a7a]">
                  Active Jobs
                </span>
                <span
                  className={
                    m.activePortraitJobs === 0
                      ? "text-sm font-bold text-[#91bb91]"
                      : "text-sm font-bold text-[#e4bd64]"
                  }
                >
                  {m.activePortraitJobs === 0
                    ? "Studio Clear"
                    : `${m.activePortraitJobs} Running`}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.14em] text-[#a99a7a]">
                  Historical Rerolls
                </span>
                <span className="text-sm font-bold">
                  {m.rerolls}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.14em] text-[#a99a7a]">
                  Est. Image Cost
                </span>
                <span className="text-sm font-bold">
                  {money.format(
                    m.estimatedOpenAiCostUsd,
                  )}
                </span>
              </div>
            </div>
          </Panel>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Panel
            title="Newest Guild Members"
            subtitle="Account, token and conversion snapshot."
            flush
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-[#4a3821] bg-[#17110c] text-[10px] uppercase tracking-[0.15em] text-[#a89979]">
                    <th className="px-4 py-3 font-semibold">
                      Member
                    </th>
                    <th className="px-3 py-3 font-semibold">
                      Joined
                    </th>
                    <th className="px-3 py-3 text-right font-semibold">
                      Tokens
                    </th>
                    <th className="px-3 py-3 text-center font-semibold">
                      Buyer
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Portraits
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-[#332719] last:border-b-0 hover:bg-[#21170e]"
                    >
                      <td className="px-4 py-3">
                        <p className="font-serif text-sm font-bold text-[#efe0bd]">
                          {member.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#8f8268]">
                          {member.email}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-xs text-[#c7b691]">
                        {shortDate(member.joinedAt)}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-xs text-[#e5cf9d]">
                        {whole.format(member.balance)}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge
                          active={member.purchased}
                          yes="Yes"
                          no="—"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          active={
                            member.commissionedPortraits
                          }
                          yes="Yes"
                          no="—"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel
            title="Recent Guild Activity"
            subtitle="Newest business and production events."
          >
            <div className="space-y-1">
              {data.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition hover:bg-[#21170f]"
                >
                  <ActivityIcon type={activity.type} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="truncate text-sm font-semibold text-[#e8d7b2]">
                        {activity.title}
                      </p>
                      <span className="shrink-0 text-[10px] text-[#81745d]">
                        {dateTime(activity.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[#a59678]">
                      {activity.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel
            title="Treasury Assumptions"
            subtitle="Visible so the numbers cannot lie to you."
          >
            <div className="space-y-3 text-sm">
              <Row
                label="Bronze Chest"
                value="20 tokens · $5.99"
              />
              <Row
                label="Iron Strongbox"
                value="75 tokens · $19.99"
              />
              <Row
                label="Golden Guild Safe"
                value="200 tokens · $39.99"
              />
              <Row
                label="Portrait commission"
                value={`${data.pricing.portraitSetTokens} tokens · 4 portraits`}
              />
              <Row
                label="Cost model"
                value={`${money.format(
                  data.pricing
                    .estimatedPortraitBatchCost,
                )} / completed set`}
              />
            </div>
          </Panel>

          <Panel
            title="Guildmaster Notes"
            subtitle="Known limits in the current Alpha telemetry."
          >
            <div className="space-y-3">
              {data.notes.map((note, index) => (
                <div
                  key={note}
                  className="flex gap-3 rounded-xl border border-[#40301d] bg-[#15100b] p-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#765925] text-[10px] font-bold text-[#c49c4b]">
                    {index + 1}
                  </span>
                  <p className="text-xs leading-5 text-[#b9aa89]">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <footer className="mt-5 flex flex-col gap-1 border-t border-[#3d2e1b] px-1 pt-4 text-[10px] uppercase tracking-[0.12em] text-[#776b56] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Private Guildmaster area · service-role data
          </span>
          <span>
            {lastLoadedAt
              ? `Ledger refreshed ${dateTime(lastLoadedAt)}`
              : `Generated ${dateTime(data.generatedAt)}`}
          </span>
        </footer>
      </div>
    </main>
  );
}

function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#100c08] px-4 py-8 text-[#f2dfb8]">
      <div className="mx-auto max-w-[1780px] animate-pulse">
        <div className="h-44 rounded-2xl border border-[#47351d] bg-[#1b140d]" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-32 rounded-xl border border-[#3a2c1b] bg-[#18120c]"
            />
          ))}
        </div>
        <div className="mt-4 h-96 rounded-xl border border-[#3a2c1b] bg-[#18120c]" />
      </div>
    </main>
  );
}

function MetricCard({
  eyebrow,
  value,
  detail,
  accent,
}: {
  eyebrow: string;
  value: string;
  detail: string;
  accent: "gold" | "green";
}) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-[#59421f] bg-[linear-gradient(145deg,#21170e_0%,#15100b_100%)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
      <div
        className={
          accent === "green"
            ? "absolute inset-x-0 top-0 h-px bg-[#71916c]"
            : "absolute inset-x-0 top-0 h-px bg-[#c09745]"
        }
      />
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9e8c69]">
        {eyebrow}
      </p>
      <p className="mt-2 font-serif text-3xl font-bold text-[#f2dfb8]">
        {value}
      </p>
      <p className="mt-2 text-xs text-[#9f9175]">
        {detail}
      </p>
    </article>
  );
}

function SmallMetric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <article className="rounded-xl border border-[#3f301e] bg-[#17110c]/90 p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#8e8066]">
            {label}
          </p>
          <p className="mt-1 font-serif text-2xl font-bold text-[#e9d8b4]">
            {value}
          </p>
        </div>
        <span className="pb-1 text-right text-[10px] text-[#87775e]">
          {sub}
        </span>
      </div>
    </article>
  );
}

function Panel({
  title,
  subtitle,
  children,
  flush = false,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  flush?: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#4b371f] bg-[linear-gradient(180deg,#1b140d_0%,#130f0a_100%)] shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
      <div className="border-b border-[#44321d] bg-[#21170e] px-5 py-4">
        <h2 className="font-serif text-lg font-bold text-[#eddcb8]">
          {title}
        </h2>
        <p className="mt-0.5 text-[11px] text-[#8f8168]">
          {subtitle}
        </p>
      </div>
      <div className={flush ? "" : "p-4 sm:p-5"}>
        {children}
      </div>
    </section>
  );
}

function PulseKey({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-[#120e0a] px-3 py-2.5">
      <p className="text-[9px] uppercase tracking-[0.15em] text-[#7f735c]">
        {label}
      </p>
      <p className="mt-1 font-serif text-xl font-bold">
        {whole.format(value)}
      </p>
    </div>
  );
}

function StatusBlock({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div
      className={
        danger
          ? "rounded-xl border border-[#72392d] bg-[#261510] p-4"
          : "rounded-xl border border-[#46351f] bg-[#15100b] p-4"
      }
    >
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8d8067]">
        {label}
      </p>
      <p
        className={
          danger
            ? "mt-1 font-serif text-2xl font-bold text-[#e8a89a]"
            : "mt-1 font-serif text-2xl font-bold text-[#ead8b1]"
        }
      >
        {whole.format(value)}
      </p>
    </div>
  );
}

function Badge({
  active,
  yes,
  no,
}: {
  active: boolean;
  yes: string;
  no: string;
}) {
  return (
    <span
      className={
        active
          ? "inline-flex min-w-10 justify-center rounded-full border border-[#587653] bg-[#1d2a1b] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#a8c7a1]"
          : "inline-flex min-w-10 justify-center rounded-full border border-[#443824] bg-[#17120d] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#746b58]"
      }
    >
      {active ? yes : no}
    </span>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const content =
    type === "purchase"
      ? "$"
      : type === "portrait"
        ? "◈"
        : type === "cast"
          ? "▤"
          : type === "error"
            ? "!"
            : type === "spend"
              ? "−"
              : "+";

  const dangerous = type === "error";

  return (
    <span
      className={
        dangerous
          ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#70382d] bg-[#2b1712] text-xs font-bold text-[#e5a093]"
          : "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#59421f] bg-[#21170e] text-xs font-bold text-[#c49a48]"
      }
    >
      {content}
    </span>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-[#352819] pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs text-[#998a70]">
        {label}
      </span>
      <span className="text-right text-xs font-bold text-[#decaa1]">
        {value}
      </span>
    </div>
  );
}
