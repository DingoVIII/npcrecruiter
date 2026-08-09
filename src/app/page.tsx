import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
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

<p className="mt-6 text-center text-base leading-relaxed text-[#cdbb94] sm:text-lg">
  Unlimited text recruitment is free -  Professional portraits are optional
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