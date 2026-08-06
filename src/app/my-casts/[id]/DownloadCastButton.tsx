"use client";

import { generatePrintableCast } from "@/lib/pdf/printableCast";

type SavedNpc = {
  name: string;
  gender: string;
  species: string;
  occupation: string;
  personality: string;
  roleplayingCue: string;
  portraitPrompt?: string;
  portraitUrl?: string;
  hired?: boolean;
};

type DownloadCastButtonProps = {
  npcs: SavedNpc[];
};

export default function DownloadCastButton({
  npcs,
}: DownloadCastButtonProps) {
  const canDownload =
    npcs.length === 9 &&
    npcs.every(
      (npc) =>
        typeof npc.portraitUrl === "string" &&
        npc.portraitUrl.length > 0,
    );

  function downloadCast() {
    try {
      generatePrintableCast(npcs);
    } catch (error) {
      console.error("Printable cast download failed:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "The printable cast could not be created.",
      );
    }
  }

  return (
    <button
      type="button"
      onClick={downloadCast}
      disabled={!canDownload}
      className="border border-[#8f2e1d] bg-[#8f2e1d] px-4 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#a83a25] disabled:cursor-not-allowed disabled:border-[#a9946d] disabled:bg-[#b9aa8f] disabled:text-[#766954]"
    >
      {canDownload
        ? "Download Printable Cast"
        : "Portraits Required for PDF"}
    </button>
  );
}