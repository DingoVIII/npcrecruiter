import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#6e5428] bg-[#171008] px-4 py-8 text-[#cdbb94] sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs">
        <span className="font-serif text-sm text-[#f1d99d]">NPC Recruiter · Stories begin with someone.</span>
        <nav className="flex flex-wrap gap-4 uppercase tracking-[0.08em]">
          <Link href="/" className="hover:text-[#f1d99d]">Home</Link>
          <Link href="/recruit" className="hover:text-[#f1d99d]">Recruit NPCs</Link>
          <Link href="/quest-giver" className="hover:text-[#f1d99d]">Quest Giver</Link>
          <Link href="/my-casts" className="hover:text-[#f1d99d]">My Guild</Link>
          <Link href="/feedback" className="hover:text-[#f1d99d]">Feedback</Link>
        </nav>
      </div>
    </footer>
  );
}
