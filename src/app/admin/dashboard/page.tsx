"use client";

import { useState } from "react";

type TrendDirection = "up" | "down" | "neutral";

type Metric = {
  label: string;
  value: string;
  previousValue: string;
  change: string;
  direction: TrendDirection;
  note?: string;
};

type FunnelStep = {
  label: string;
  value: number;
  rate?: string;
};

type RankingItem = {
  label: string;
  value: number;
};

const executiveMetrics: Metric[] = [
  {
    label: "Total Accounts Created",
    value: "0",
    previousValue: "0",
    change: "0.0%",
    direction: "neutral",
    note: "All-time registered accounts",
  },
  {
    label: "New Accounts This Month",
    value: "0",
    previousValue: "0",
    change: "0.0%",
    direction: "neutral",
    note: "Guilds founded during the current month",
  },
  {
    label: "Monthly Active Users",
    value: "0",
    previousValue: "0",
    change: "0.0%",
    direction: "neutral",
    note: "Accounts active within the last 30 days",
  },
  {
    label: "Returning Users",
    value: "0%",
    previousValue: "0%",
    change: "0.0 pts",
    direction: "neutral",
    note: "Users returning after their first session",
  },
];

const economyMetrics: Metric[] = [
  {
    label: "Revenue This Month",
    value: "$0.00",
    previousValue: "$0.00",
    change: "0.0%",
    direction: "neutral",
  },
  {
    label: "Guild Tokens Sold",
    value: "0",
    previousValue: "0",
    change: "0.0%",
    direction: "neutral",
  },
  {
    label: "OpenAI Costs",
    value: "$0.00",
    previousValue: "$0.00",
    change: "0.0%",
    direction: "neutral",
  },
  {
    label: "Gross Profit",
    value: "$0.00",
    previousValue: "$0.00",
    change: "0.0%",
    direction: "neutral",
  },
  {
    label: "Gross Margin",
    value: "0.0%",
    previousValue: "0.0%",
    change: "0.0 pts",
    direction: "neutral",
  },
];

const recruitmentMetrics: Metric[] = [
  {
    label: "NPC Recruitments",
    value: "0",
    previousValue: "0",
    change: "0.0%",
    direction: "neutral",
  },
  {
    label: "Recruitments Today",
    value: "0",
    previousValue: "0",
    change: "0.0%",
    direction: "neutral",
  },
  {
    label: "Average Recruitments / User",
    value: "0.0",
    previousValue: "0.0",
    change: "0.0",
    direction: "neutral",
  },
  {
    label: "Average NPCs Hired",
    value: "0.0 / 9",
    previousValue: "0.0 / 9",
    change: "0.0",
    direction: "neutral",
  },
];

const portraitMetrics: Metric[] = [
  {
    label: "Cast Commissions",
    value: "0",
    previousValue: "0",
    change: "0.0%",
    direction: "neutral",
  },
  {
    label: "Portraits Generated",
    value: "0",
    previousValue: "0",
    change: "0.0%",
    direction: "neutral",
  },
  {
    label: "Portrait Rerolls",
    value: "0",
    previousValue: "0",
    change: "0.0%",
    direction: "neutral",
  },
  {
    label: "Portrait Conversion",
    value: "0.0%",
    previousValue: "0.0%",
    change: "0.0 pts",
    direction: "neutral",
  },
  {
    label: "Average Tokens / Paying User",
    value: "0.0",
    previousValue: "0.0",
    change: "0.0",
    direction: "neutral",
  },
];

const funnelSteps: FunnelStep[] = [
  {
    label: "Website Visitors",
    value: 0,
  },
  {
    label: "Accounts Created",
    value: 0,
    rate: "0.0%",
  },
  {
    label: "Generated NPCs",
    value: 0,
    rate: "0.0%",
  },
  {
    label: "Commissioned Portraits",
    value: 0,
    rate: "0.0%",
  },
  {
    label: "Purchased Again",
    value: 0,
    rate: "0.0%",
  },
];

const popularInspirations: RankingItem[] = [
  { label: "No data yet", value: 0 },
];

const popularSpecies: RankingItem[] = [
  { label: "No data yet", value: 0 },
];

const infrastructureMetrics = [
  {
    label: "GPT Tokens Used",
    value: "0",
  },
  {
    label: "Images Generated",
    value: "0",
  },
  {
    label: "Average Recruitment Cost",
    value: "$0.000",
  },
  {
    label: "Average Portrait Cost",
    value: "$0.000",
  },
  {
    label: "Average API Response",
    value: "0.0s",
  },
  {
    label: "Portrait Failure Rate",
    value: "0.0%",
  },
];

const goals = [
  {
    label: "100 Total Accounts",
    current: 0,
    target: 100,
    display: "0 / 100",
  },
  {
    label: "1,000 Total Accounts",
    current: 0,
    target: 1000,
    display: "0 / 1,000",
  },
  {
    label: "$500 Monthly Revenue",
    current: 0,
    target: 500,
    display: "$0 / $500",
  },
  {
    label: "12.5% Portrait Conversion",
    current: 0,
    target: 12.5,
    display: "0.0% / 12.5%",
  },
  {
    label: "$5,000 Monthly Revenue",
    current: 0,
    target: 5000,
    display: "$0 / $5,000",
  },
];

export default function GuildmasterDashboardPage() {
  const [memberEmail, setMemberEmail] = useState("");
  const [grantAmount, setGrantAmount] = useState(20);
  const [grantReason, setGrantReason] =
    useState("Alpha Tester");
  const [grantMessage, setGrantMessage] = useState("");
  const [grantError, setGrantError] = useState("");
  const [isGrantingTokens, setIsGrantingTokens] =
    useState(false);

  async function grantTokens() {
    if (isGrantingTokens) {
      return;
    }

    setIsGrantingTokens(true);
    setGrantMessage("");
    setGrantError("");

    try {
      const response = await fetch(
        "/api/admin/tokens/grant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: memberEmail,
            amount: grantAmount,
            reason: grantReason,
          }),
        },
      );

      const result = (await response.json()) as {
        message?: string;
        error?: string;
        balance?: number;
      };

      if (!response.ok) {
        throw new Error(
          result.error ??
            "The Guild Tokens could not be granted.",
        );
      }

      setGrantMessage(
        `${result.message} New balance: ${
          result.balance ?? "unknown"
        }.`,
      );
    } catch (error) {
      setGrantError(
        error instanceof Error
          ? error.message
          : "The Guild Tokens could not be granted.",
      );
    } finally {
      setIsGrantingTokens(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#ded3bd] text-[#2b2925]">
      <header className="border-b border-[#9e834e] bg-[#f8f2e5]">
        <div className="mx-auto flex max-w-[1700px] flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center border border-[#9a7937] bg-[#fffdf7] font-serif text-xl font-bold">
              GM
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8f7135]">
                NPC Recruiter Administration
              </p>

              <h1 className="mt-1 font-serif text-3xl font-bold">
                Guildmaster Dashboard
              </h1>

              <p className="mt-1 font-serif text-sm italic text-[#6d6252]">
                Growth, engagement, portrait conversion and business health.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PeriodButton label="Today" />
            <PeriodButton label="7 Days" />
            <PeriodButton label="30 Days" active />
            <PeriodButton label="This Year" />

            <div className="ml-0 border border-[#ae976c] bg-[#fffdf7] px-4 py-3 text-right lg:ml-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#806d49]">
                Last updated
              </p>

              <p className="mt-1 text-xs font-semibold">
                Awaiting live analytics
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1700px] space-y-5 px-4 py-5 sm:px-6">
        <section>
  <DashboardPanel
    eyebrow="Guild administration"
    title="Grant Guild Tokens"
  >
    <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1.2fr_auto] xl:items-end">
      <label className="block">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#806d49]">
          Guild Member Email
        </span>

        <input
          type="email"
          value={memberEmail}
          onChange={(event) =>
            setMemberEmail(event.target.value)
          }
          placeholder="member@example.com"
          className="w-full border border-[#ae976c] bg-[#fffdf7] px-3 py-3 text-sm outline-none focus:border-[#7e2518]"
        />
      </label>

      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#806d49]">
          Token Amount
        </p>

        <div className="grid grid-cols-4 gap-2">
          {[20, 50, 100, 500].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setGrantAmount(amount)}
              className={
                grantAmount === amount
                  ? "border border-[#2f2c25] bg-[#2f2c25] px-2 py-3 text-xs font-bold text-white"
                  : "border border-[#ae976c] bg-[#fffdf7] px-2 py-3 text-xs font-bold hover:bg-[#efe4cf]"
              }
            >
              +{amount}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#806d49]">
          Reason
        </span>

        <select
          value={grantReason}
          onChange={(event) =>
            setGrantReason(event.target.value)
          }
          className="w-full border border-[#ae976c] bg-[#fffdf7] px-3 py-3 text-sm outline-none focus:border-[#7e2518]"
        >
          <option>Alpha Tester</option>
          <option>Compensation</option>
          <option>Promotion</option>
          <option>Manual Adjustment</option>
        </select>
      </label>

      <button
        type="button"
        onClick={grantTokens}
        disabled={
          !memberEmail.trim() || isGrantingTokens
        }
        className="border border-[#7e2518] bg-[#8f2e1d] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#a83a25] disabled:cursor-not-allowed disabled:border-[#aaa08b] disabled:bg-[#c7baa3] disabled:text-[#7b6e5a]"
      >
        {isGrantingTokens
          ? "Granting..."
          : "Grant Tokens"}
      </button>
    </div>

    {grantMessage && (
      <div className="mt-4 border border-[#6d8a70] bg-[#edf4ec] px-4 py-3 text-sm text-[#315138]">
        {grantMessage}
      </div>
    )}

    {grantError && (
      <div className="mt-4 border border-[#9c5c51] bg-[#f8ece9] px-4 py-3 text-sm text-[#7a342d]">
        {grantError}
      </div>
    )}
  </DashboardPanel>
</section>

        <section>
          <SectionHeading
            eyebrow="North-star metrics"
            title="Executive Summary"
            description="The five-minute view of NPC Recruiter's health."
          />

          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {executiveMetrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
          <DashboardPanel
            eyebrow="Month over month"
            title="Business Performance"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#a9946d] bg-[#f0e2c5]">
                    <TableHeading>Metric</TableHeading>
                    <TableHeading>This Month</TableHeading>
                    <TableHeading>Last Month</TableHeading>
                    <TableHeading>Change</TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {[
                    ...executiveMetrics.slice(1, 3),
                    economyMetrics[0],
                    economyMetrics[2],
                    economyMetrics[3],
                    portraitMetrics[3],
                  ].map((metric) => (
                    <tr
                      key={metric.label}
                      className="border-b border-[#ddd0b6] last:border-0"
                    >
                      <td className="px-4 py-3 font-semibold">
                        {metric.label}
                      </td>

                      <td className="px-4 py-3">{metric.value}</td>

                      <td className="px-4 py-3 text-[#726754]">
                        {metric.previousValue}
                      </td>

                      <td className="px-4 py-3">
                        <TrendBadge
                          direction={metric.direction}
                          change={metric.change}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardPanel>

          <DashboardPanel
            eyebrow="Your five key measures"
            title="North-Star Watch"
          >
            <div className="space-y-3">
              <NorthStarRow
                number="I"
                label="Total Accounts Created"
                value="0"
              />

              <NorthStarRow
                number="II"
                label="Monthly Active Users"
                value="0"
              />

              <NorthStarRow
                number="III"
                label="Portrait Conversion"
                value="0.0%"
              />

              <NorthStarRow
                number="IV"
                label="Revenue This Month"
                value="$0.00"
              />

              <NorthStarRow
                number="V"
                label="Gross Profit This Month"
                value="$0.00"
              />
            </div>
          </DashboardPanel>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <DashboardPanel
            eyebrow="Guild-token economy"
            title="Revenue and Costs"
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {economyMetrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  metric={metric}
                  compact
                />
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel
            eyebrow="Customer journey"
            title="Monthly Funnel"
          >
            <div className="space-y-2">
              {funnelSteps.map((step, index) => (
                <div key={step.label}>
                  <div className="flex items-center justify-between border border-[#cfbd98] bg-[#fffdf7] px-4 py-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#786746]">
                        {step.label}
                      </p>

                      {step.rate && (
                        <p className="mt-1 text-xs text-[#746a58]">
                          {step.rate} of previous stage
                        </p>
                      )}
                    </div>

                    <p className="font-serif text-2xl font-bold">
                      {step.value.toLocaleString()}
                    </p>
                  </div>

                  {index < funnelSteps.length - 1 && (
                    <div className="py-1 text-center text-[#9a7937]">
                      ↓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DashboardPanel>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <DashboardPanel
            eyebrow="Free product usage"
            title="Recruitment Activity"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {recruitmentMetrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  metric={metric}
                  compact
                />
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel
            eyebrow="Paid-product activity"
            title="Portrait Studio"
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {portraitMetrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  metric={metric}
                  compact
                />
              ))}
            </div>
          </DashboardPanel>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1fr_1.2fr]">
          <DashboardPanel
            eyebrow="Culture trends"
            title="Popular Inspirations"
          >
            <RankingList items={popularInspirations} />
          </DashboardPanel>

          <DashboardPanel
            eyebrow="Roster trends"
            title="Popular Species"
          >
            <RankingList items={popularSpecies} />
          </DashboardPanel>

          <DashboardPanel
            eyebrow="Monthly growth"
            title="Twelve-Month Trend"
          >
            <EmptyChart />
          </DashboardPanel>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
          <DashboardPanel
            eyebrow="Technical performance"
            title="Infrastructure"
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {infrastructureMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="border border-[#cfbd98] bg-[#fffdf7] px-4 py-4"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#806d49]">
                    {metric.label}
                  </p>

                  <p className="mt-2 font-serif text-2xl font-bold">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel
            eyebrow="Issues requiring attention"
            title="Watch List"
          >
            <div className="border border-[#6d8a70] bg-[#edf4ec] px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#456149] text-sm font-bold text-white">
                  ✓
                </span>

                <div>
                  <p className="font-serif text-lg font-bold text-[#315138]">
                    All systems healthy
                  </p>

                  <p className="mt-1 text-sm text-[#526857]">
                    No analytics warnings are currently active.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <WatchRule label="Portrait failure rate above 2%" />
              <WatchRule label="Portrait conversion below 10%" />
              <WatchRule label="OpenAI costs exceed target" />
              <WatchRule label="Payment webhook failure" />
              <WatchRule label="Monthly active users decline" />
            </div>
          </DashboardPanel>
        </section>

        <section>
          <DashboardPanel
            eyebrow="The next monsters"
            title="Guildmaster Goals"
          >
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
              {goals.map((goal) => {
                const percentage =
                  goal.target === 0
                    ? 0
                    : Math.min(
                        100,
                        (goal.current / goal.target) * 100,
                      );

                return (
                  <div
                    key={goal.label}
                    className="border border-[#cfbd98] bg-[#fffdf7] p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#675a43]">
                      {goal.label}
                    </p>

                    <p className="mt-3 font-serif text-xl font-bold">
                      {goal.display}
                    </p>

                    <div className="mt-4 h-2 overflow-hidden bg-[#e5dac4]">
                      <div
                        className="h-full bg-[#9b7730]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-[#746a58]">
                      {percentage.toFixed(0)}% complete
                    </p>
                  </div>
                );
              })}
            </div>
          </DashboardPanel>
        </section>
      </div>
    </main>
  );
}

type MetricCardProps = {
  metric: Metric;
  compact?: boolean;
};

function MetricCard({
  metric,
  compact = false,
}: MetricCardProps) {
  return (
    <article className="border border-[#bda77a] bg-[#fffdf7] shadow-[3px_4px_0_rgba(72,55,28,0.10)]">
      <div className={compact ? "p-4" : "p-5"}>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#806d49]">
          {metric.label}
        </p>

        <div className="mt-3 flex items-end justify-between gap-3">
          <p
            className={
              compact
                ? "font-serif text-2xl font-bold"
                : "font-serif text-3xl font-bold"
            }
          >
            {metric.value}
          </p>

          <TrendBadge
            direction={metric.direction}
            change={metric.change}
          />
        </div>

        <p className="mt-2 text-xs text-[#756b59]">
          Last month: {metric.previousValue}
        </p>

        {metric.note && (
          <p className="mt-2 font-serif text-xs italic text-[#746956]">
            {metric.note}
          </p>
        )}
      </div>
    </article>
  );
}

type DashboardPanelProps = {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
};

function DashboardPanel({
  eyebrow,
  title,
  children,
}: DashboardPanelProps) {
  return (
    <section className="border border-[#9e834e] bg-[#f7f0e2] shadow-[4px_5px_0_rgba(72,55,28,0.12)]">
      <div className="border-b border-[#9e834e] bg-[#efe2c7] px-5 py-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#826b3d]">
          {eyebrow}
        </p>

        <h2 className="mt-1 font-serif text-xl font-bold">
          {title}
        </h2>
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#ab925f] pb-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#826b3d]">
          {eyebrow}
        </p>

        <h2 className="mt-1 font-serif text-2xl font-bold">
          {title}
        </h2>
      </div>

      <p className="font-serif text-sm italic text-[#6d6252]">
        {description}
      </p>
    </div>
  );
}

function TrendBadge({
  direction,
  change,
}: {
  direction: TrendDirection;
  change: string;
}) {
  const classes =
    direction === "up"
      ? "border-[#608064] bg-[#edf4ec] text-[#315138]"
      : direction === "down"
        ? "border-[#9c5c51] bg-[#f8ece9] text-[#7a342d]"
        : "border-[#b7a98d] bg-[#f4eee2] text-[#716755]";

  const symbol =
    direction === "up"
      ? "▲"
      : direction === "down"
        ? "▼"
        : "—";

  return (
    <span
      className={`inline-flex border px-2 py-1 text-[10px] font-bold ${classes}`}
    >
      {symbol} {change}
    </span>
  );
}

function PeriodButton({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={
        active
          ? "border border-[#2f2c25] bg-[#2f2c25] px-3 py-2 text-xs font-bold text-white"
          : "border border-[#ae976c] bg-[#fffdf7] px-3 py-2 text-xs font-bold text-[#4e473c] transition hover:bg-[#efe4cf]"
      }
    >
      {label}
    </button>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#675a43]">
      {children}
    </th>
  );
}

function NorthStarRow({
  number,
  label,
  value,
}: {
  number: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#d2c3a5] pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <span className="font-serif font-bold text-[#9b7730]">
          {number}.
        </span>

        <p className="text-sm font-semibold">{label}</p>
      </div>

      <p className="font-serif text-xl font-bold">{value}</p>
    </div>
  );
}

function RankingList({
  items,
}: {
  items: RankingItem[];
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold">
              {index + 1}. {item.label}
            </p>

            <p className="font-serif font-bold">{item.value}</p>
          </div>

          <div className="mt-2 h-2 bg-[#e4d8c0]">
            <div
              className="h-full bg-[#9b7730]"
              style={{
                width: `${Math.min(100, item.value)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex min-h-[250px] items-center justify-center border border-dashed border-[#b6a27c] bg-[#fbf7ee] px-6 text-center">
      <div>
        <p className="font-serif text-xl font-bold">
          Twelve months of history will appear here.
        </p>

        <p className="mt-2 max-w-md text-sm leading-6 text-[#716755]">
          Revenue, accounts, active users, portrait conversion,
          Guild Tokens and OpenAI costs will be charted once events
          are being recorded.
        </p>
      </div>
    </div>
  );
}

function WatchRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 border border-[#d1c2a5] bg-[#fffdf7] px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-[#a99773]" />
      <span>{label}</span>
    </div>
  );
}