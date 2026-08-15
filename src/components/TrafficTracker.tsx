"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TRACKED_PAGES = ["/", "/recruit"];

function getVisitorId() {
  const storageKey = "npc-recruiter-visitor-id";

  let visitorId = localStorage.getItem(storageKey);

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(storageKey, visitorId);
  }

  return visitorId;
}

export default function TrafficTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!TRACKED_PAGES.includes(pathname)) {
      return;
    }

    const visitorId = getVisitorId();

    fetch("/api/traffic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visitorId,
        page: pathname,
      }),
    }).catch(() => {
      // Traffic tracking must never interfere with the website.
    });
  }, [pathname]);

  return null;
}