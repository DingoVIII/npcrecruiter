import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type SavedNpc = {
  name?: string;
  portraitUrl?: string;
};

type SavedCast = {
  id: string;
  title: string;
  location: string;
  inspiration: string;
  portrait_style: string | null;
  portraits_complete: boolean;
  created_at: string;
  npcs: SavedNpc[];
};

export default async function MyCastsPage() {
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
      "id, title, location, inspiration, portrait_style, portraits_complete, created_at, npcs",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const casts = (data ?? []) as SavedCast[];

  return (
    <main className="min-h-screen bg-[#d7c8aa] p-4 text-[#211d17]">
      <section className="mx-auto max-w-7xl overflow-hidden rounded-[18px] border border-[#8f713b] bg-[#f3e5c8] shadow-[5px_6px_0_rgba(72,55,28,0.18)]">
        <header className="relative border-b border-[#9e834e] bg-[linear-gradient(180deg,#fbefd7_0%,#f2dfbb_100%)] px-7 py-6">
          <div className="pointer-events-none absolute inset-x-6 top-2 flex items-center gap-2 opacity-60">
            <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,#ad8c4e)]" />
            <span className="text-[8px] text-[#8f6e32]">◆</span>
            <div className="h-px flex-1 bg-[linear-gradient(90deg,#ad8c4e,transparent)]" />
          </div>

          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#aa8747] bg-[#efe0bf] font-serif text-xl text-[#5b4321] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35)]">
                IX
              </div>

              <div>
                <h1 className="font-serif text-2xl font-bold uppercase tracking-[0.055em]">
                  Guild Archive
                </h1>

                <p className="mt-1 font-serif text-sm italic text-[#625744]">
                  Your collected casts, ready for another session.
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="border border-[#8f713b] bg-[#fff9ec] px-5 py-3 text-xs font-bold uppercase tracking-wide transition hover:bg-[#efe1c4]"
            >
              Return to Recruiter
            </Link>
          </div>
        </header>

        <div className="p-6">
          {error ? (
            <div className="border border-[#9b3c2e] bg-[#f4d7cf] px-4 py-3 text-sm text-[#7d251b]">
              The Guild Archive could not retrieve your saved casts.
            </div>
          ) : casts.length === 0 ? (
            <div className="flex min-h-[460px] items-center justify-center border border-dashed border-[#aa9367] bg-[#fbf3e2] px-8 text-center">
              <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#a88b52] bg-[#f0e2c6] font-serif text-3xl">
                  IX
                </div>

                <h2 className="mt-5 font-serif text-2xl font-bold">
                  The archive is empty.
                </h2>

                <p className="mt-3 font-serif leading-7 text-[#6d6252]">
                  Save a recruitment cast and its folio will appear here.
                </p>

                <Link
                  href="/"
                  className="mt-5 inline-block border border-[#8f2e1d] bg-[#8f2e1d] px-5 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#a83a25]"
                >
                  Recruit a Cast
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {casts.map((cast) => {
                const portraits = Array.isArray(cast.npcs)
                  ? cast.npcs
                      .filter(
                        (npc) =>
                          typeof npc.portraitUrl === "string" &&
                          npc.portraitUrl.length > 0,
                      )
                      .slice(0, 3)
                  : [];

                return (
                  <article
                    key={cast.id}
                    className="relative overflow-hidden border border-[#806434] bg-[#fff9ec] p-5 shadow-[3px_4px_0_rgba(72,55,28,0.14)]"
                  >
                    <span className="pointer-events-none absolute inset-[4px] border border-[#c7a86c]" />
                    <span className="pointer-events-none absolute inset-[8px] border border-[#6f5733]/35" />

                    <div className="relative grid gap-5 sm:grid-cols-[190px_1fr]">
                      <div className="grid min-h-[220px] grid-cols-3 gap-1 border border-[#9e834e] bg-[#e8d9bb] p-1.5">
                        {Array.from({ length: 3 }, (_, index) => {
                          const npc = portraits[index];

                          return (
                            <div
                              key={index}
                              className="relative overflow-hidden border border-[#a9946d] bg-[#f3e8d2]"
                            >
                              {npc?.portraitUrl ? (
                                <img
                                  src={npc.portraitUrl}
                                  alt={npc.name ?? `Cast portrait ${index + 1}`}
                                  className="h-full w-full object-cover object-top"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center font-serif text-xl text-[#9b896b]">
                                  ?
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex min-w-0 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="font-serif text-2xl font-bold leading-tight">
                              {cast.title}
                            </h2>

                            <p className="mt-1 font-serif text-sm italic text-[#6a5d49]">
                              {cast.location}
                            </p>
                          </div>

                          <span
                            className={
                              cast.portraits_complete
                                ? "shrink-0 border border-[#456149] bg-[#e3eee2] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#345039]"
                                : "shrink-0 border border-[#a9946d] bg-[#efe1c5] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#6d5e48]"
                            }
                          >
                            {cast.portraits_complete
                              ? "Portraits Ready"
                              : "Text Only"}
                          </span>
                        </div>

                        <div className="my-4 flex items-center gap-2">
                          <div className="h-px flex-1 bg-[#c7a86c]" />
                          <span className="text-[8px] text-[#8f713b]">◆</span>
                          <div className="h-px flex-1 bg-[#c7a86c]" />
                        </div>

                        <dl className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
                          <div>
                            <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a7041]">
                              Inspiration
                            </dt>
                            <dd className="mt-1 font-serif">
                              {cast.inspiration}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a7041]">
                              Artwork
                            </dt>
                            <dd className="mt-1 font-serif">
                              {cast.portrait_style ?? "Not selected"}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a7041]">
                              Cast Size
                            </dt>
                            <dd className="mt-1 font-serif">
                              {Array.isArray(cast.npcs)
                                ? cast.npcs.length
                                : 0}{" "}
                              NPCs
                            </dd>
                          </div>

                          <div>
                            <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a7041]">
                              Archived
                            </dt>
                            <dd className="mt-1 font-serif">
                              {new Intl.DateTimeFormat("en-CA", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }).format(new Date(cast.created_at))}
                            </dd>
                          </div>
                        </dl>

                        <div className="mt-auto pt-5">
  <Link
    href={`/my-casts/${cast.id}`}
    className="block w-full border border-[#8f2e1d] bg-[#8f2e1d] px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#a83a25]"
  >
    Open Folio
  </Link>
</div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}