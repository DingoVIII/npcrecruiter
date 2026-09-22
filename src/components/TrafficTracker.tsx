"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getVisitorId() {
  const storageKey = "npc-recruiter-visitor-id";

  let visitorId = localStorage.getItem(storageKey);

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(storageKey, visitorId);
  }

  return visitorId;
}

function getSessionId() {
  const storageKey = "npc-recruiter-session-id";
  let sessionId = sessionStorage.getItem(storageKey);
  if (!sessionId) { sessionId = crypto.randomUUID(); sessionStorage.setItem(storageKey, sessionId); }
  return sessionId;
}

export default function TrafficTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const visitorId = getVisitorId();

    fetch("/api/traffic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visitorId,
        sessionId: getSessionId(),
        page: pathname,
      }),
    }).catch(() => {
      // Traffic tracking must never interfere with the website.
    });
  }, [pathname]);

  return null;
}