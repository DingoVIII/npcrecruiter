export function trackEvent(eventName: string, metadata?: Record<string, unknown>, featuredNpcId?: string) {
  if (typeof window === "undefined") return;
  const visitorKey = "npc-recruiter-visitor-id";
  const sessionKey = "npc-recruiter-session-id";
  let visitorId = localStorage.getItem(visitorKey);
  let sessionId = sessionStorage.getItem(sessionKey);
  if (!visitorId) { visitorId = crypto.randomUUID(); localStorage.setItem(visitorKey, visitorId); }
  if (!sessionId) { sessionId = crypto.randomUUID(); sessionStorage.setItem(sessionKey, sessionId); }
  void fetch("/api/analytics/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visitorId, sessionId, eventName, pagePath: window.location.pathname, featuredNpcId, metadata }) }).catch(() => {});
}
