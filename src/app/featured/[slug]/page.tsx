import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { FeaturedEventLink } from "@/components/analytics/FeaturedEventLink";
import FeaturedPageView from "@/components/analytics/FeaturedPageView";

export const dynamic = "force-dynamic";

type FeaturedNpc = {
  id: string;
  slug: string;
  name: string;
  gender: string;
  species: string;
  occupation: string;
  appearance: string[];
  personality: string;
  roleplaying_cue: string;
  quest_title: string;
  quest_hook: string;
  full_adventure: string;
  portrait_url: string | null;
  character_card_url: string | null;
  clean_video_url: string | null;
  youtube_video_id: string | null;
};

export default async function FeaturedNpcPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.from("featured_npcs").select("*").eq("slug", slug).eq("published", true).single();
  if (error || !data) notFound();
  const npc = data as FeaturedNpc;

  return (
    <main className="min-h-screen bg-[#d7c8aa] p-4 text-[#211d17]">
      <FeaturedPageView npcId={npc.id} />
      <section className="mx-auto max-w-6xl overflow-hidden border border-[#8f713b] bg-[#f3e5c8] shadow-[5px_6px_0_rgba(72,55,28,0.18)]">
        <header className="border-b border-[#9e834e] bg-[linear-gradient(180deg,#fbefd7_0%,#f2dfbb_100%)] px-6 py-8">
          <Link href="/" className="text-xs font-bold uppercase tracking-wide text-[#8f2e1d]">Return to NPC Recruiter</Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#8a7041]">Featured Guild Quest Giver</p>
          <h1 className="mt-2 font-serif text-4xl font-bold">{npc.name}</h1>
          <p className="mt-1 font-serif italic text-[#625744]">{npc.gender} · {npc.species} · {npc.occupation}</p>
        </header>
        <div className="grid gap-4 p-4 lg:grid-cols-[0.7fr_1.3fr]">
          <section className="border border-[#9e834e] bg-[#f5e7ca] p-5">
            {npc.portrait_url && <img src={npc.portrait_url} alt={`Portrait of ${npc.name}`} className="w-full object-cover" />}
            <h2 className="mt-5 font-serif text-xl font-bold">Character Information</h2>
            <dl className="mt-4 space-y-3 text-sm"><div><dt className="font-bold">Appearance</dt><dd>{npc.appearance.join(", ")}</dd></div><div><dt className="font-bold">Personality</dt><dd>{npc.personality}</dd></div><div><dt className="font-bold">At the table</dt><dd className="font-serif italic">{npc.roleplaying_cue}</dd></div></dl>
          </section>
          <section className="border border-[#9e834e] bg-[#f5e7ca] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a7041]">Adventure</p>
            <h2 className="mt-2 font-serif text-3xl font-bold">{npc.quest_title}</h2>
            <p className="mt-4 border border-[#c7a86c] bg-[#fff9ec] p-4 font-serif leading-7">{npc.quest_hook}</p>
            <pre className="mt-6 whitespace-pre-wrap font-serif text-sm leading-7">{npc.full_adventure}</pre>
            {npc.youtube_video_id && <div className="mt-8 aspect-video overflow-hidden border border-[#9e834e]"><iframe className="h-full w-full" src={`https://www.youtube.com/embed/${npc.youtube_video_id}`} title={`${npc.name} quest video`} allowFullScreen /></div>}
            <div className="mt-8 flex flex-wrap gap-2"><FeaturedEventLink href={npc.character_card_url} event="featured_character_card_downloaded" npcId={npc.id}>Download Character Card</FeaturedEventLink><FeaturedEventLink href={npc.portrait_url} event="featured_portrait_downloaded" npcId={npc.id}>Download Portrait</FeaturedEventLink><FeaturedEventLink href={npc.clean_video_url} event="featured_clean_video_downloaded" npcId={npc.id}>Download Clean Video</FeaturedEventLink><FeaturedEventLink href="/quest-giver" event="featured_create_quest_clicked" npcId={npc.id}>Create Your Own NPC</FeaturedEventLink></div>
          </section>
        </div>
      </section>
    </main>
  );
}
