import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type FeaturedNpc = { id: string; slug: string; name: string; species: string; occupation: string; personality: string; quest_title: string; quest_hook: string; portrait_url: string | null };

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.from("featured_npcs").select("id, slug, name, species, occupation, personality, quest_title, quest_hook, portrait_url").eq("published", true).order("display_order", { ascending: true }).order("created_at", { ascending: false });
  const featured = (data ?? []) as FeaturedNpc[];
  return (
    <main className="min-h-screen bg-[#171008] text-[#f4e4bf]">
      <div className="mx-auto flex max-w-[1900px] flex-col items-center px-4 py-8 sm:px-6 lg:px-10">

        {/* Brand */}
        <Image
          src="/logo.png"
          alt="NPC Recruiter"
          width={420}
          height={420}
          priority
          className="h-auto w-[260px] sm:w-[310px] lg:w-[350px]"
        />

        {/* Main promise */}
        <h1 className="mt-4 whitespace-nowrap text-center font-serif text-3xl font-bold tracking-tight text-[#f6e8c7] sm:text-4xl lg:text-5xl">
  Recruit memorable NPCs in under two minutes.
</h1>

                {/* Product screenshot */}
        <Link
          href="/recruit"
         className="mt-8 block w-full max-w-[1800px] shadow-2xl shadow-black/60"
        >
          <Image
            src="/images/landing-hero.webp"
            alt="NPC Recruiter showing a Greek-inspired cast of four NPCs and their commissioned portraits"
            width={1728}
            height={864}
            priority
            className="h-auto w-full transition duration-300 hover:scale-[1.003]"
          />
        </Link>

        <section className="mt-8 grid w-full max-w-5xl gap-4 sm:grid-cols-2">
          <Link href="/recruit" className="border border-[#b88a32] bg-[#20170d] p-6 text-center"><h2 className="font-serif text-2xl">NPC Recruiter</h2><p className="mt-2">Create individual NPCs or a complete cast, free without an account.</p></Link>
          <Link href="/quest-giver" className="border border-[#b88a32] bg-[#20170d] p-6 text-center"><h2 className="font-serif text-2xl">Quest Giver</h2><p className="mt-2">Create a memorable NPC and quest hook, free without an account.</p></Link>
        </section>
        {/* How it works */}
        <section className="mt-10 grid w-full max-w-[1800px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Step
            number="1"
            title="Choose Your World"
            description="Select a location, cultural inspiration, species and gender mix."
          />

          <Step
            number="2"
            title="Recruit Four NPCs"
            description="Generate believable NPCs for free. Keep the ones you like and recruit again when needed."
          />

          <Step
            number="3"
            title="Commission Portraits"
            description="Optional portraits matched to each NPC's appearance, species and culture."
          />

          <Step
            number="4"
            title="Print & Play"
            description="Download printable NPC cards ready for your next session."
          />
        </section>

        <section className="mt-14 w-full max-w-5xl border border-[#6e5428] bg-[#20170d] p-6 text-center sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7b775]">How to Use NPC Recruiter</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-[#f1dfb9]">Your Guildmaster&apos;s Guide</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#c4b292]">New to NPC Recruiter? Watch how to create characters, develop adventures and bring your NPCs to life.</p>
          <div className="mt-7 flex aspect-video items-center justify-center border border-[#8d6b2c] bg-[radial-gradient(ellipse_at_center,#4b3420,#171008)] p-6">
            <div><span className="text-5xl text-[#d9aa4b]">✦</span><p className="mt-4 font-serif text-xl text-[#f1dfb9]">Your Guildmaster&apos;s Guide is Coming Soon</p></div>
          </div>
        </section>

        <section className="mt-14 w-full max-w-6xl">
          <div className="text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7b775]">YouTube NPC Library</p><h2 className="mt-3 font-serif text-3xl font-bold">Meet the Guild&apos;s Quest Givers</h2><p className="mx-auto mt-3 max-w-2xl text-[#cdbb94]">Every character has a story. Meet the NPCs featured in our adventures and bring their quests to your own table.</p></div>
          {featured.length === 0 ? <div className="mt-7 border border-dashed border-[#6e5428] bg-[#20170d] p-12 text-center text-[#cdbb94]">New featured quest givers will appear here soon.</div> : <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featured.map((npc) => <article key={npc.id} className="border border-[#6e5428] bg-[#20170d] p-4"><div className="aspect-[4/3] overflow-hidden border border-[#8d6b2c] bg-[#171008]">{npc.portrait_url ? <img src={npc.portrait_url} alt={`Portrait of ${npc.name}`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-4xl text-[#d9aa4b]">✦</div>}</div><h3 className="mt-4 font-serif text-2xl font-bold">{npc.name}</h3><p className="text-sm text-[#cdbb94]">{npc.species} · {npc.occupation}</p><p className="mt-3 line-clamp-3 text-sm text-[#c4b292]">{npc.personality}</p><p className="mt-3 font-serif font-bold text-[#e9c782]">{npc.quest_title}</p><p className="mt-1 line-clamp-2 text-sm italic text-[#cdbb94]">{npc.quest_hook}</p><Link href={`/featured/${npc.slug}`} className="mt-5 block border border-[#b88a32] bg-[#b88a32] px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-[#171008] transition hover:bg-[#d0a64c]">Explore Quest Giver</Link></article>)}</div>}
        </section>

<p className="mt-6 text-center text-base leading-relaxed text-[#cdbb94] sm:text-lg">
  Try NPC Recruiter without an account. Save favourites free; full quests and portraits use Guild Tokens.
</p>

<Link
  href="/recruit"
  className="mt-6 border border-[#b88a32] bg-[#b88a32] px-12 py-4 text-center text-base font-bold uppercase tracking-[0.09em] text-[#171008] transition hover:bg-[#d0a64c] sm:text-lg"
>
  Recruit Your First Cast
</Link>

        <p className="mt-6 pb-4 text-center font-serif text-sm italic text-[#b9944d] sm:text-base">
          Every NPC and portrait shown above was created using NPC Recruiter.
        </p>
      </div>
    </main>
  );
}

type StepProps = {
  number: string;
  title: string;
  description: string;
};

function Step({ number, title, description }: StepProps) {
  return (
    <div className="border border-[#6e5428] bg-[#20170d] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c89a3d] font-serif text-xl font-bold text-[#d9aa4b]">
        {number}
      </div>

      <h2 className="mt-4 font-serif text-lg font-bold text-[#f1dfb9]">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#c4b292]">
        {description}
      </p>
    </div>
  );
}