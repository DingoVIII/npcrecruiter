"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function visitorId() {
  const key = "npc-recruiter-visitor-id";
  let value = localStorage.getItem(key);
  if (!value) { value = crypto.randomUUID(); localStorage.setItem(key, value); }
  return value;
}

export function FeaturedEventLink({ href, event, npcId, children }: { href: string | null; event: string; npcId: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  if (!href) return null;
  function track() {
    if (busy) return;
    setBusy(true);
    void fetch("/api/analytics/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visitorId: visitorId(), sessionId: sessionStorage.getItem("npc-recruiter-session-id"), eventName: event, pagePath: pathname, featuredNpcId: npcId }) }).catch(() => {}).finally(() => setBusy(false));
  }
  if (href.startsWith("/")) return <Link href={href} onClick={track} className="border border-[#8f2e1d] bg-[#8f2e1d] px-3 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#a83a25]">{children}</Link>;
  return <a href={href} onClick={track} download className="border border-[#8f713b] bg-[#fff9ec] px-3 py-2 text-xs font-bold uppercase tracking-wide transition hover:bg-[#efe1c4]">{children}</a>;
}
