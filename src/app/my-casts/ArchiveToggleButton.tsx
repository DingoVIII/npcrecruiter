"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ArchiveToggleButtonProps = {
  kind: "cast" | "questGiver";
  id: string;
  archived: boolean;
};

export default function ArchiveToggleButton({
  kind,
  id,
  archived,
}: ArchiveToggleButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function toggleArchive() {
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id, archived: !archived }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Archive update failed.");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Archive update failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-1.5 sm:flex-row">
      <button
        type="button"
        onClick={toggleArchive}
        disabled={busy}
        className="border border-[#8f713b] bg-[#fff9ec] px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition hover:bg-[#efe1c4] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Updating..." : archived ? "Restore" : "Archive"}
      </button>
      {error && <span role="alert" className="text-[10px] text-[#8f2e1d]">{error}</span>}
    </div>
  );
}
