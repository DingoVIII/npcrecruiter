"use client";

import { useEffect, useState } from "react";

export default function GuildTreasuryModal() {
  const [open, setOpen] = useState(false);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function openTreasury() {
      setError("");
      setOpen(true);
    }
    window.addEventListener("open-guild-treasury", openTreasury);
    return () => window.removeEventListener("open-guild-treasury", openTreasury);
  }, []);

  async function startTokenCheckout(pack: "starter" | "adventurer" | "guildmaster") {
    if (isStartingCheckout) return;
    setIsStartingCheckout(true);
    setError("");
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack }),
      });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || "The Guild Treasury could not open checkout.");
      window.location.href = result.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "The Guild Treasury could not open checkout.");
      setIsStartingCheckout(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-[18px] border-2 border-[#8d6b2c] bg-[#f3e5c8] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#9e834e] bg-[linear-gradient(180deg,#2b2117_0%,#17110c_100%)] px-6 py-4 text-[#ead7a9]">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b99a59]">Guild Treasury</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#f3dfaa]">Purchase Guild Tokens</h2></div>
          <button type="button" onClick={() => setOpen(false)} disabled={isStartingCheckout} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8d6b2c] text-lg text-[#ead7a9] transition hover:bg-[#3a2b1c] disabled:cursor-not-allowed disabled:opacity-50" aria-label="Close Guild Treasury">×</button>
        </div>
        {error && <p role="alert" className="border-b border-[#9b3c2e] bg-[#f4d7cf] px-6 py-3 text-sm text-[#7d251b]">{error}</p>}
        <div className="grid gap-4 p-6 md:grid-cols-3">
          <TokenPackCard title="🥉 Bronze Chest" tokens={20} price="$5.99 USD" description="Perfect for a single adventure." disabled={isStartingCheckout} onPurchase={() => startTokenCheckout("starter")} />
          <TokenPackCard title="🥈 Iron Strongbox" tokens={75} price="$19.99 USD" description="Ideal for ongoing campaigns." featured disabled={isStartingCheckout} onPurchase={() => startTokenCheckout("adventurer")} />
          <TokenPackCard title="🥇 Golden Guild Vault" tokens={200} price="$39.99 USD" description="Best value for worldbuilders and professional GMs." disabled={isStartingCheckout} onPurchase={() => startTokenCheckout("guildmaster")} />
        </div>
        <div className="border-t border-[#b89d67] bg-[#eadbbd] px-6 py-3 text-center font-serif text-xs italic text-[#625744]">Portrait commissions cost 5 Guild Tokens. Individual portrait rerolls cost 1 Guild Token.</div>
      </div>
    </div>
  );
}

type TokenPackCardProps = { title: string; tokens: number; price: string; description: string; disabled: boolean; featured?: boolean; onPurchase: () => void };

function TokenPackCard({ title, tokens, price, description, disabled, featured = false, onPurchase }: TokenPackCardProps) {
  return <article className={featured ? "relative flex flex-col border-2 border-[#8f2e1d] bg-[#fff9ec] p-5 shadow-[3px_4px_0_rgba(72,55,28,0.16)]" : "relative flex flex-col border border-[#a9946d] bg-[#fff9ec] p-5 shadow-[3px_4px_0_rgba(72,55,28,0.12)]"}>
    {featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8f2e1d] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">Best Value</span>}
    <h3 className="text-center font-serif text-lg font-bold text-[#292720]">{title}</h3>
    <p className="mt-4 text-center font-serif text-4xl font-bold text-[#8f2e1d]">{tokens}</p>
    <p className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[#6d6252]">Guild Tokens</p>
    <p className="mt-4 text-center font-serif text-xl font-bold">{price}</p>
    <p className="mt-3 min-h-10 text-center text-xs leading-5 text-[#625744]">{description}</p>
    <button type="button" onClick={onPurchase} disabled={disabled} className="mt-5 border border-[#7e2518] bg-[#8f2e1d] px-3 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#a83a25] disabled:cursor-wait disabled:bg-[#9f8e76]">{disabled ? "Opening Checkout..." : "Purchase"}</button>
  </article>;
}
