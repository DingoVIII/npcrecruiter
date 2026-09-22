"use client";

export default function GuildTreasuryTrigger({ className }: { className?: string }) {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("open-guild-treasury"))} className={className}>Guild Tokens</button>;
}
