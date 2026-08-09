"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

type GuildMember = {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  balance: number;
};

type GrantResult = {
  success: true;
  user: { id: string; email: string };
  amount: number;
  reason: string;
  previousBalance: number;
  newBalance: number;
};

const whole = new Intl.NumberFormat("en-US");
const commonReasons = ["Alpha Tester", "Bug Report", "Customer Support", "Goodwill Credit"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function TokenGrantPanel() {
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [selected, setSelected] = useState<GuildMember | null>(null);
  const [amount, setAmount] = useState("20");
  const [reason, setReason] = useState("Alpha Tester");
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<GrantResult | null>(null);

  const loadMembers = useCallback(async (search: string) => {
    setLoadingMembers(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/tokens/users?q=${encodeURIComponent(search)}`, {
        cache: "no-store",
      });
      const result = (await response.json()) as { users?: GuildMember[]; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Member search failed.");
      setMembers(result.users ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Member search failed.");
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadMembers(query), 180);
    return () => window.clearTimeout(timeout);
  }, [query, loadMembers]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!selected) {
      setError("Select a guild member first.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/tokens/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selected.id, amount: Number(amount), reason }),
      });
      const result = (await response.json()) as GrantResult | { error?: string };
      if (!response.ok) {
        throw new Error("error" in result && result.error ? result.error : "Token grant failed.");
      }

      const grant = result as GrantResult;
      setSuccess(grant);
      setSelected((current) => current ? { ...current, balance: grant.newBalance } : current);
      setMembers((current) => current.map((member) =>
        member.id === grant.user.id ? { ...member, balance: grant.newBalance } : member,
      ));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Token grant failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#2a1c0e_0%,#151009_43%,#0e0a07_100%)] px-4 py-6 text-[#f3e3bf] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-2xl border border-[#765522] bg-[linear-gradient(135deg,#25190e_0%,#17100a_58%,#28190c_100%)] p-5 shadow-2xl sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.27em] text-[#c79c49]">NPC Recruiter · Guildmaster</p>
              <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Grant Guild Tokens</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#bbaa86]">
                Issue complimentary Guild Tokens to an existing member. Every grant is recorded in the Guild Ledger as an admin grant and excluded from revenue.
              </p>
            </div>
            <Link href="/admin/dashboard" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[#8f692b] bg-[#1b130c] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#dec38c] transition hover:bg-[#2a1d10]">
              ← Dashboard
            </Link>
          </div>
        </header>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="overflow-hidden rounded-xl border border-[#4a361e] bg-[#17110c]">
            <div className="border-b border-[#40301c] bg-[#21170e] px-5 py-4">
              <h2 className="font-serif text-lg font-bold">1. Choose Member</h2>
              <p className="mt-1 text-xs text-[#95866a]">Search by guild name or email address.</p>
            </div>
            <div className="p-4">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search members..."
                autoFocus
                className="w-full rounded-lg border border-[#5c4423] bg-[#100c08] px-4 py-3 text-sm text-[#f1dfb8] outline-none transition placeholder:text-[#675d4c] focus:border-[#ad8338]"
              />

              <div className="mt-3 max-h-[520px] space-y-2 overflow-y-auto pr-1">
                {loadingMembers && (
                  <div className="rounded-lg border border-[#352819] bg-[#120e0a] p-5 text-center text-xs text-[#8d816a]">Searching the guild ledger...</div>
                )}
                {!loadingMembers && members.length === 0 && (
                  <div className="rounded-lg border border-[#352819] bg-[#120e0a] p-5 text-center text-xs text-[#8d816a]">No matching guild members.</div>
                )}
                {!loadingMembers && members.map((member) => {
                  const isSelected = selected?.id === member.id;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => { setSelected(member); setSuccess(null); setError(""); }}
                      className={isSelected
                        ? "w-full rounded-lg border border-[#b48938] bg-[#2b1e10] p-4 text-left shadow-[inset_0_0_24px_rgba(181,137,56,0.08)]"
                        : "w-full rounded-lg border border-[#3b2c1b] bg-[#120e0a] p-4 text-left transition hover:border-[#735625] hover:bg-[#1b140d]"}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-serif text-base font-bold text-[#ecdbb6]">{member.name}</p>
                          <p className="mt-1 truncate text-xs text-[#8f8065]">{member.email}</p>
                          <p className="mt-2 text-[10px] uppercase tracking-[0.11em] text-[#675d4c]">Joined {formatDate(member.joinedAt)}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-[#75694f]">Balance</p>
                          <p className="mt-1 font-serif text-xl font-bold text-[#e8cb8f]">{whole.format(member.balance)}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="self-start overflow-hidden rounded-xl border border-[#4a361e] bg-[#17110c] lg:sticky lg:top-6">
            <div className="border-b border-[#40301c] bg-[#21170e] px-5 py-4">
              <h2 className="font-serif text-lg font-bold">2. Issue Grant</h2>
              <p className="mt-1 text-xs text-[#95866a]">This action updates both balance and ledger.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div className="rounded-xl border border-[#46341e] bg-[#120e0a] p-4">
                {selected ? (
                  <>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8d7c5f]">Recipient</p>
                    <p className="mt-2 font-serif text-xl font-bold">{selected.name}</p>
                    <p className="mt-1 text-xs text-[#8f8065]">{selected.email}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-[#302417] pt-3">
                      <span className="text-xs text-[#887a60]">Current balance</span>
                      <span className="font-mono text-sm font-bold text-[#e2ca98]">{whole.format(selected.balance)} tokens</span>
                    </div>
                  </>
                ) : (
                  <p className="py-4 text-center text-xs text-[#756b58]">Select a guild member from the ledger.</p>
                )}
              </div>

              <div>
                <label htmlFor="grant-amount" className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9c8a68]">Tokens to Grant</label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[5, 10, 20, 50].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(String(preset))}
                      className={amount === String(preset)
                        ? "rounded-lg border border-[#b98b37] bg-[#a77a2c] px-2 py-2.5 text-xs font-bold text-[#171008]"
                        : "rounded-lg border border-[#49371f] bg-[#15100b] px-2 py-2.5 text-xs font-bold text-[#c9b487] hover:border-[#82622c]"}
                    >+{preset}</button>
                  ))}
                </div>
                <input
                  id="grant-amount"
                  type="number"
                  min={1}
                  max={10000}
                  step={1}
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#4c391f] bg-[#100c08] px-4 py-3 font-mono text-sm text-[#f0dfb7] outline-none focus:border-[#ad8338]"
                />
              </div>

              <div>
                <label htmlFor="grant-reason" className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9c8a68]">Ledger Reason</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {commonReasons.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setReason(preset)}
                      className={reason === preset
                        ? "rounded-full border border-[#9b7430] bg-[#2c1f11] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#e2c58d]"
                        : "rounded-full border border-[#3f301d] bg-[#130f0a] px-3 py-1.5 text-[10px] uppercase tracking-wide text-[#82765f] hover:border-[#6a5028]"}
                    >{preset}</button>
                  ))}
                </div>
                <input
                  id="grant-reason"
                  value={reason}
                  maxLength={160}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Why are these tokens being issued?"
                  className="mt-2 w-full rounded-lg border border-[#4c391f] bg-[#100c08] px-4 py-3 text-sm text-[#f0dfb7] outline-none placeholder:text-[#62594a] focus:border-[#ad8338]"
                />
              </div>

              {selected && Number(amount) > 0 && (
                <div className="rounded-lg border border-[#42321e] bg-[#130f0a] px-4 py-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8f8167]">New balance</span>
                    <span className="font-mono font-bold text-[#d9bf87]">{whole.format(selected.balance + Number(amount || 0))} tokens</span>
                  </div>
                </div>
              )}

              {error && <div className="rounded-lg border border-[#773b2e] bg-[#2b1712] px-4 py-3 text-xs leading-5 text-[#e9ab9e]">{error}</div>}
              {success && (
                <div className="rounded-lg border border-[#4f714a] bg-[#162015] px-4 py-4 text-sm text-[#acd1a6]">
                  <p className="font-bold">Grant recorded.</p>
                  <p className="mt-1 text-xs leading-5 text-[#8fb58a]">+{success.amount} Guild Tokens · {success.previousBalance} → {success.newBalance}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!selected || submitting}
                className="w-full rounded-lg border border-[#c39742] bg-[#b48632] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[#171008] shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition hover:bg-[#c89a40] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Recording Grant..." : selected ? `Grant ${amount || "0"} Tokens` : "Select a Member"}
              </button>

              <p className="text-center text-[10px] leading-4 text-[#706653]">Admin grants are complimentary credits. They do not count as purchases or revenue.</p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
