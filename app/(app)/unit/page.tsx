'use client';

import { useState } from 'react';
import { unitDays, unitOverview } from '@/lib/sample-data';

const tabs = [
  { id: 'videos', label: 'Videos' },
  { id: 'worksheet', label: 'Worksheet' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'notes', label: 'Parent Notes' }
];

export default function UnitPage() {
  const [selectedTab, setSelectedTab] = useState(tabs[0].id);
  const [showNotes, setShowNotes] = useState(false);

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-ink">
          {unitOverview.title}
        </h1>
        <p className="text-sm text-slate">{unitOverview.description}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedTab(tab.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              selectedTab === tab.id
                ? 'bg-ink text-canvas'
                : 'bg-canvas text-slate'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {unitDays.map((day) => (
          <div key={day.day} className="rounded-3xl bg-canvas p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Day {day.day}</h3>
              <button className="rounded-full border border-slate/20 px-3 py-1 text-xs">
                Mark done
              </button>
            </div>
            <p className="mt-2 text-sm text-slate">{day.summary}</p>

            {selectedTab === 'videos' && (
              <ul className="mt-3 space-y-2 text-sm text-slate">
                {day.videos.map((video) => (
                  <li key={video.title} className="rounded-2xl bg-sand px-3 py-2">
                    <p className="font-semibold text-ink">{video.title}</p>
                    <p className="text-xs text-slate">{video.duration}</p>
                  </li>
                ))}
              </ul>
            )}

            {selectedTab === 'worksheet' && (
              <div className="mt-3 space-y-2 text-sm text-slate">
                <p>{day.worksheetPrompt}</p>
                <button className="rounded-2xl bg-lime px-3 py-2 text-xs font-semibold">
                  Download worksheet PDF
                </button>
              </div>
            )}

            {selectedTab === 'experiments' && (
              <ul className="mt-3 space-y-2 text-sm text-slate">
                {day.experiments.map((experiment) => (
                  <li
                    key={experiment.name}
                    className="rounded-2xl border border-slate/10 bg-sand px-3 py-2"
                  >
                    <p className="font-semibold text-ink">{experiment.name}</p>
                    <p className="text-xs text-slate">Supplies: {experiment.supplies}</p>
                  </li>
                ))}
              </ul>
            )}

            {selectedTab === 'notes' && (
              <div className="mt-3 space-y-2 text-sm text-slate">
                <button
                  type="button"
                  onClick={() => setShowNotes((prev) => !prev)}
                  className="rounded-2xl border border-slate/20 px-3 py-2 text-xs"
                >
                  {showNotes ? 'Hide parent notes' : 'Show parent notes'}
                </button>
                {showNotes && (
                  <div className="rounded-2xl bg-sand px-3 py-2">
                    <p>{day.parentNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
