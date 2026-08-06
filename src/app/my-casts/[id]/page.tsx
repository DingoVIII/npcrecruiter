import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import DownloadCastButton from "./DownloadCastButton";

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

type SavedCast = {
  id: string;
  title: string;
  location: string;
  inspiration: string;
  gender_mix: string;
  species: string[];
  portrait_style: string | null;
  portraits_complete: boolean;
  created_at: string;
  npcs: SavedNpc[];
};

type SavedCastPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SavedCastPage({
  params,
}: SavedCastPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("casts")
    .select(
      `
        id,
        title,
        location,
        inspiration,
        gender_mix,
        species,
        portrait_style,
        portraits_complete,
        created_at,
        npcs
      `,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const cast = data as SavedCast;
  const npcs = Array.isArray(cast.npcs) ? cast.npcs : [];

  return (
    <main className="min-h-screen bg-[#d7c8aa] p-3 text-[#211d17]">
      <section className="mx-auto max-w-[1700px] overflow-hidden rounded-[18px] border border-[#8f713b] bg-[#f3e5c8] shadow-[5px_6px_0_rgba(72,55,28,0.18)]">
        <header className="relative border-b border-[#9e834e] bg-[linear-gradient(180deg,#fbefd7_0%,#f2dfbb_100%)] px-6 py-5">
          <div className="pointer-events-none absolute inset-x-6 top-2 flex items-center gap-2 opacity-60">
            <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,#ad8c4e)]" />
            <span className="text-[8px] text-[#8f6e32]">◆</span>
            <div className="h-px flex-1 bg-[linear-gradient(90deg,#ad8c4e,transparent)]" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#aa8747] bg-[#efe0bf] font-serif text-xl font-bold text-[#5b4321]">
                IX
              </div>

              <div>
                <h1 className="font-serif text-2xl font-bold uppercase tracking-[0.055em]">
                  {cast.title}
                </h1>

                <p className="mt-1 font-serif text-sm italic text-[#625744]">
                  {cast.location} · {cast.inspiration}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
  <DownloadCastButton npcs={npcs} />

  <Link
    href="/my-casts"
    className="border border-[#8f713b] bg-[#fff9ec] px-4 py-3 text-xs font-bold uppercase tracking-wide transition hover:bg-[#efe1c4]"
  >
    Return to Archive
  </Link>

  <Link
    href="/"
    className="border border-[#8f2e1d] bg-[#8f2e1d] px-4 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#a83a25]"
  >
    Return to Recruiter
  </Link>
</div>
          </div>
        </header>

        <div className="grid gap-3 p-3 xl:grid-cols-2">
          <section className="overflow-hidden rounded-[14px] border border-[#9e834e] bg-[#f5e7ca]">
            <div className="border-b border-[#9e834e] px-5 py-4">
              <h2 className="font-serif text-xl font-bold uppercase tracking-wide">
                Personnel Records
              </h2>

              <p className="mt-1 font-serif text-xs italic text-[#625744]">
                Four archived NPC text cards.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
              {npcs.map((npc, index) => (
                <article
                  key={`${npc.name}-${index}`}
                  className="relative flex aspect-[20/23] flex-col overflow-hidden border border-[#8f713b] bg-[#fff9ec] p-4 shadow-[2px_3px_0_rgba(72,55,28,0.12)]"
                >
                  <span className="pointer-events-none absolute inset-[4px] border border-[#c7a86c]" />
                  <span className="pointer-events-none absolute inset-[7px] border border-[#6f5733]/45" />

                  <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#292720] font-serif text-sm font-bold text-white">
                    {index + 1}
                  </span>

                  <div className="relative mt-7 text-center">
                    <h3 className="font-serif text-base font-bold leading-tight">
                      {npc.name}
                    </h3>

                    <p className="mt-1 text-[11px] text-[#625744]">
                      {npc.gender} · {npc.species}
                    </p>
                  </div>

                  <div className="relative mt-3 space-y-2 text-center text-[11px] leading-4">
                    <div>
                      <p className="font-serif font-bold">
                        Occupation
                      </p>
                      <p>{npc.occupation}</p>
                    </div>

                    <div>
                      <p className="font-serif font-bold">
                        Personality
                      </p>
                      <p>{npc.personality}</p>
                    </div>

                    <div>
                      <p className="font-serif font-bold">
                        Roleplaying Cue
                      </p>
                      <p className="font-serif italic">
                        “{npc.roleplayingCue}”
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[14px] border border-[#9e834e] bg-[#f5e7ca]">
            <div className="flex items-start justify-between gap-4 border-b border-[#9e834e] px-5 py-4">
              <div>
                <h2 className="font-serif text-xl font-bold uppercase tracking-wide">
                  Portrait Collection
                </h2>

                <p className="mt-1 font-serif text-xs italic text-[#625744]">
                  {cast.portrait_style ?? "No portrait style recorded"}
                </p>
              </div>

              <span
                className={
                  cast.portraits_complete
                    ? "border border-[#456149] bg-[#e3eee2] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-[#345039]"
                    : "border border-[#a9946d] bg-[#efe1c5] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide text-[#6d5e48]"
                }
              >
                {cast.portraits_complete
                  ? "Portraits Ready"
                  : "Text Only"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
  {Array.from({ length: 4 }, (_, index) => {
    const npc = npcs[index];

    return (
      <div
        key={index}
        className="relative aspect-[20/23] overflow-hidden border border-[#8f713b] bg-[#e9ddc5] p-[7px] shadow-[2px_3px_0_rgba(72,55,28,0.12)]"
      >
        <span className="pointer-events-none absolute inset-[3px] z-20 border border-[#c7a86c]" />
        <span className="pointer-events-none absolute inset-[6px] z-20 border border-[#6f5733]/55" />

        <span className="absolute left-2 top-2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-[#292720] font-serif text-sm font-bold text-white">
          {index + 1}
        </span>

        {npc?.portraitUrl ? (
          <img
            src={npc.portraitUrl}
            alt={`Portrait of ${npc.name}`}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full items-center justify-center border border-dashed border-[#b7a98d] bg-[#f8f0df] text-[10px] font-bold uppercase tracking-wide text-[#776a55]">
            No Portrait
          </div>
        )}
      </div>
    );
  })}
</div>
          </section>
        </div>

        <footer className="border-t border-[#9e834e] bg-[#ead8b5] px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="font-serif text-[#625744]">
              Saved{" "}
              {new Intl.DateTimeFormat("en-CA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(cast.created_at))}
            </div>

            <div className="font-serif text-[#625744]">
              {cast.gender_mix} · {cast.species.join(", ")}
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}