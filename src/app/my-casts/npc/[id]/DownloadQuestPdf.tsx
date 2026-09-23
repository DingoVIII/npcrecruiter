"use client";
import { downloadAdventurePdf, downloadNpcPdf, type GuildNpc } from "@/lib/pdf/adventureExport";

export default function DownloadQuestPdf({ npc, questHook, fullQuest }: { npc: GuildNpc; questHook: string; fullQuest: string }) {
  const button = "border border-[#8f713b] bg-[#fff9ec] px-4 py-3 text-xs font-bold uppercase tracking-wide transition hover:bg-[#efe1c4]";
  return <div className="flex flex-wrap gap-2">
    <button className={button} onClick={() => downloadNpcPdf(npc, questHook, fullQuest)}>Download NPC PDF</button>
    {fullQuest && <button className={button} onClick={() => downloadAdventurePdf(npc, questHook, fullQuest)}>Download Adventure PDF</button>}
  </div>;
}
