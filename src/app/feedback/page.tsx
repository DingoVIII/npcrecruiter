import { GuildFeedback } from "@/components/feedback/GuildFeedback";

export default function FeedbackPage() {
  return (
    <main className="min-h-[70vh] bg-[#171008] px-4 py-16 text-[#f4e4bf] sm:px-6">
      <section className="mx-auto max-w-2xl border border-[#6e5428] bg-[#20170d] p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d7b775]">Guild Feedback</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Help shape the guild.</h1>
        <p className="mt-4 text-[#cdbb94]">Tell us what worked, what did not, and what would make your next session better.</p>
        <div className="mt-6 flex justify-center"><GuildFeedback /></div>
      </section>
    </main>
  );
}
