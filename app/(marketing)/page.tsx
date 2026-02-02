import Link from 'next/link';
import { AppConfig } from '@/lib/config';
import { PricingCard } from '@/components/pricing-card';
import { Pill } from '@/components/pill';

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-4 py-10">
      <header className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-coral" />
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate/70">
              {AppConfig.name}
            </p>
            <h1 className="text-3xl font-semibold text-ink md:text-5xl">
              Science units fueled by kid curiosity.
            </h1>
          </div>
        </div>
        <p className="max-w-2xl text-lg text-slate">
          Create secular, evidence-based science plans in minutes. Pick a topic,
          choose a pacing option, and get videos, a printable worksheet, and
          hands-on experiments that align with vetted sources.
        </p>
        <div className="flex flex-wrap gap-3">
          <Pill label="Ages 5–7" />
          <Pill label="Secular only" />
          <Pill label="14-day free trial" />
          <Pill label="No streak guilt" />
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/login"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-canvas"
          >
            Start your free trial
          </Link>
          <Link
            href="/home"
            className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink"
          >
            Explore demo
          </Link>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Pick a curiosity spark',
            body: 'Guided categories help kids lead the way while you keep a clear plan.'
          },
          {
            title: 'Follow a gentle pace',
            body: '1-day mini lessons or multi-day units chunked for attention spans.'
          },
          {
            title: 'Grounded in real sources',
            body: 'Every worksheet and prompt cites vetted transcripts and excerpts.'
          }
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-3xl bg-canvas p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-ink">{card.title}</h3>
            <p className="mt-2 text-sm text-slate">{card.body}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl bg-mint/70 p-6">
          <h2 className="text-2xl font-semibold text-ink">Sample: "Why do magnets stick?"</h2>
          <p className="mt-2 text-sm text-slate">
            Day 1 introduces magnetism with a short video and a match-the-word
            worksheet. Day 2 explores real-world examples. Day 3 is a hands-on
            experiment with a safety checklist. Day 4 wraps with a reflection.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill label="2 videos" color="bg-lime" />
            <Pill label="Printable worksheet" color="bg-coral" />
            <Pill label="2 experiment choices" color="bg-purple" textColor="text-canvas" />
          </div>
        </div>
        <PricingCard />
      </section>

      <section className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-ink">How it works</h2>
        <ol className="mt-4 space-y-3 text-sm text-slate">
          <li>1. Choose a category and topic (optional subtopic).</li>
          <li>2. Pick a pacing option: 1 day, 4 days, or 8 days.</li>
          <li>3. Generate a unit grounded in vetted sources.</li>
          <li>4. Download the worksheet PDF or fill it on-screen.</li>
        </ol>
      </section>
    </main>
  );
}
