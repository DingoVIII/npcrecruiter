import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import GuildTreasuryTrigger from "./GuildTreasuryTrigger";

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const isAdmin = Boolean(user?.email && adminEmail && user.email.toLowerCase() === adminEmail);

  return (
    <header className="border-b border-[#6e5428] bg-[#171008] px-4 py-3 text-[#f4e4bf] sm:px-6">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 text-xs font-bold uppercase tracking-[0.08em]">
        <Link href="/" className="mr-auto font-serif text-lg normal-case tracking-normal text-[#f1d99d]">NPC Recruiter</Link>
        <Link href="/recruit" className="uppercase transition hover:text-[#d0a64c]">Recruit NPCs</Link>
        <Link href="/quest-giver" className="uppercase transition hover:text-[#d0a64c]">Quest Giver</Link>
        {user && <Link href="/my-casts" className="uppercase transition hover:text-[#d0a64c]">My Guild</Link>}
        <GuildTreasuryTrigger className="uppercase transition hover:text-[#d0a64c]" />
        {isAdmin && <Link href="/admin/dashboard" className="uppercase text-[#e9c782] transition hover:text-[#fff0c5]">Guildmaster Tools</Link>}
        {user ? <span className="text-[#bba77c]">{user.email}</span> : <Link href="/login" className="uppercase border border-[#b88a32] px-3 py-2 text-[#f1d99d] transition hover:bg-[#b88a32] hover:text-[#171008]">Sign In</Link>}
      </nav>
    </header>
  );
}
