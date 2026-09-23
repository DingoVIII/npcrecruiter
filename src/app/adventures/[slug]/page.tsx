import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { freeAdventures } from "@/lib/adventureLibrary";

export function generateStaticParams() {
  return freeAdventures.map(({ slug }) => ({ slug }));
}

export default async function AdventurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const adventure = freeAdventures.find((item) => item.slug === slug);
  if (!adventure) notFound();
  return (
    <main className="min-h-screen bg-[#171008] px-4 py-10 text-[#f4e4bf] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/#free-adventures" className="text-sm text-[#d7b775] underline underline-offset-4">← Back to free adventures</Link>
        <div className="mt-7 grid gap-8 border border-[#6e5428] bg-[#20170d] p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <Image src={adventure.portrait} alt={`${adventure.name}, ${adventure.species} ${adventure.occupation}`} width={640} height={880} className="h-auto w-full border border-[#8d6b2c] object-cover" priority />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7b775]">Free complete adventure</p>
            <h1 className="mt-3 font-serif text-4xl font-bold">{adventure.name}</h1>
            <p className="mt-2 text-sm text-[#cdbb94]">{adventure.species} · {adventure.occupation}</p>
            <h2 className="mt-7 font-serif text-2xl text-[#e9c782]">{adventure.title}</h2>
            <p className="mt-3 leading-7 text-[#cdbb94]">{adventure.description}</p>
            <video controls playsInline preload="metadata" poster={adventure.portrait} className="mt-7 aspect-[9/16] max-h-[440px] w-full border border-[#8d6b2c] bg-black object-contain" src={adventure.video} aria-label={`${adventure.name} introduces the quest`} />
            <a href={adventure.package} download className="mt-6 block border border-[#b88a32] bg-[#b88a32] px-5 py-4 text-center text-sm font-bold uppercase tracking-wide text-[#171008] hover:bg-[#d0a64c]">Download Complete Quest Free</a>
            <p className="mt-2 text-center text-xs text-[#cdbb94]">Includes the adventure PDF, portrait and video. No account required.</p>
            <a href={adventure.pdf} download className="mt-5 block text-center text-sm text-[#e9c782] underline underline-offset-4">Download just the PDF</a>
            <Link href="/recruit" className="mt-8 block border border-[#b88a32] px-5 py-4 text-center text-sm font-bold uppercase tracking-wide text-[#e9c782] hover:bg-[#302213]">Create Your Own NPC Free</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
