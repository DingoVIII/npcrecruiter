"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FeaturedPageView({ npcId }: { npcId: string }) {
  const pathname = usePathname();
  useEffect(() => {
    const visitorKey = "npc-recruiter-visitor-id";
    const sessionKey = "npc-recruiter-session-id";
    let visitorId = localStorage.getItem(visitorKey);
    let sessionId = sessionStorage.getItem(sessionKey);
    if (!visitorId) { visitorId = crypto.randomUUID(); localStorage.setItem(visitorKey, visitorId); }
    if (!sessionId) { sessionId = crypto.randomUUID(); sessionStorage.setItem(sessionKey, sessionId); }
    void fetch("/api/analytics/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visitorId, sessionId, eventName: "featured_page_viewed", pagePath: pathname, featuredNpcId: npcId }) }).catch(() => {});
  }, [npcId, pathname]);
  return null;
}
