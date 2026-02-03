'use client';

import { useState } from 'react';
import { Card } from '@/components/card';
import { categories, pacingOptions, sampleChildren } from '@/lib/sample-data';

export default function TopicPage() {
  const [selectedPacing, setSelectedPacing] = useState(pacingOptions[1].id);
  const [selectedChild, setSelectedChild] = useState(sampleChildren[0].id);

  return (
    <main className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-ink">Choose a topic</h1>
        <p className="text-sm text-slate">
          Kid-led topics with curated, secular sources only.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {categories.flatMap((category) =>
            category.topics.map((topic) => (
              <Card
                key={topic.id}
                title={topic.name}
                description={topic.summary}
                badge={category.name}
              />
            ))
          )}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">Pick a pacing</h2>
          <div className="grid gap-3">
            {pacingOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedPacing(option.id)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selectedPacing === option.id
                    ? 'border-ink bg-ink text-canvas'
                    : 'border-slate/20 bg-canvas text-slate'
                }`}
              >
                <p className="font-semibold">{option.label}</p>
                <p className="text-xs opacity-80">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">Choose a child</h2>
          <div className="space-y-2">
            {sampleChildren.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => setSelectedChild(child.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm ${
                  selectedChild === child.id
                    ? 'border-ink bg-mint'
                    : 'border-slate/20 bg-canvas'
                }`}
              >
                <p className="font-semibold text-ink">{child.name}</p>
                <p className="text-xs text-slate">Age {child.age}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="w-full rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-ink"
          >
            Generate unit plan
          </button>
        </div>
      </section>
    </main>
  );
}
