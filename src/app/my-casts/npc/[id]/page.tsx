import Link from "next/link";
import DownloadQuestPdf from "./DownloadQuestPdf";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { extractAdventureTitle, stripAdventureTitle } from "@/lib/questAdventure";

type QuestGiverNpc = {
  name: string;
  gender: string;
  species: string;
  occupation: string;
  appearance: string[];
  personality: string;
  roleplayingCue: string;
  portraitPrompt?: string;
  portraitUrl?: string;
};

type SavedQuestGiver = {
  id: string;
  npc: QuestGiverNpc;
  quest_hook: string | null;
  full_quest: string | null;
  created_at: string;
};

type QuestGiverPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SavedQuestGiverPage({
  params,
}: QuestGiverPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("saved_npcs")
    .select("id, npc, quest_hook, full_quest, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const saved = data as SavedQuestGiver;
  const { npc } = saved;

  return (
    <main className="min-h-screen bg-[#d7c8aa] p-3 text-[#211d17]">
      <section className="mx-auto max-w-[1500px] overflow-hidden rounded-[18px] border border-[#8f713b] bg-[#f3e5c8] shadow-[5px_6px_0_rgba(72,55,28,0.18)]">
        <header className="border-b border-[#9e834e] bg-[linear-gradient(180deg,#fbefd7_0%,#f2dfbb_100%)] px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a7041]">
                Quest Giver · Guild Archive
              </p>
              <h1 className="mt-2 font-serif text-3xl font-bold">
                {npc.name}
              </h1>
              <p className="mt-1 font-serif text-sm italic text-[#625744]">
                {npc.gender} · {npc.species} · {npc.occupation}
              </p>
            </div>

            <DownloadQuestPdf npc={npc} questHook={saved.quest_hook || ""} fullQuest={saved.full_quest || ""} />
            <Link
              href="/my-casts"
              className="border border-[#8f713b] bg-[#fff9ec] px-4 py-3 text-xs font-bold uppercase tracking-wide transition hover:bg-[#efe1c4]"
            >
              Return to Archive
            </Link>
          </div>
        </header>

        <div className="grid gap-3 p-3 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)]">
          <aside className="overflow-hidden rounded-[14px] border border-[#9e834e] bg-[#f5e7ca]">
            <div className="border-b border-[#9e834e] px-5 py-4">
              <h2 className="font-serif text-xl font-bold uppercase tracking-wide">
                Character Record
              </h2>
            </div>

            <div className="space-y-5 p-5">
              <div className="overflow-hidden border border-[#8f713b] bg-[#e9ddc5] p-1.5">
                {npc.portraitUrl ? (
                  <img
                    src={npc.portraitUrl}
                    alt={`Portrait of ${npc.name}`}
                    className="max-h-[420px] w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex min-h-[260px] items-center justify-center font-serif text-5xl text-[#9b896b]">
                    ✦
                  </div>
                )}
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-serif font-bold">Appearance</h3>
                  <p className="mt-1">{npc.appearance?.join(", ") || "Not recorded"}</p>
                </div>
                <div>
                  <h3 className="font-serif font-bold">Personality</h3>
                  <p className="mt-1">{npc.personality}</p>
                </div>
                <div>
                  <h3 className="font-serif font-bold">At the Table</h3>
                  <p className="mt-1 font-serif italic">{npc.roleplayingCue}</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="overflow-hidden rounded-[14px] border border-[#9e834e] bg-[#f5e7ca]">
            <div className="border-b border-[#9e834e] px-5 py-4">
              <h2 className="font-serif text-xl font-bold uppercase tracking-wide">
                Adventure Journal
              </h2>
              <p className="mt-1 font-serif text-xs italic text-[#625744]">
                Saved {new Intl.DateTimeFormat("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(saved.created_at))}
              </p>
            </div>

            <div className="space-y-6 p-5">
              <div className="border border-[#c7a86c] bg-[#fff9ec] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a7041]">
                  Quest Hook
                </p>
                <p className="mt-2 font-serif leading-7">
                  {saved.quest_hook || "No quest hook recorded."}
                </p>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold">{extractAdventureTitle(saved.full_quest || "")}</h3>
                {saved.full_quest ? (
                  <pre className="mt-4 whitespace-pre-wrap font-serif text-sm leading-7 text-[#332c22]">
                    {stripAdventureTitle(saved.full_quest)}
                  </pre>
                ) : (
                  <p className="mt-4 font-serif italic text-[#625744]">
                    The full adventure has not been developed yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
