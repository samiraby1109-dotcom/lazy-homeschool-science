'use client';

import { useMemo, useState } from 'react';

type Topic = {
  id: string;
  name: string;
  subtopics: { id: string; name: string }[];
};

export function AutoFillForm({ topics }: { topics: Topic[] }) {
  const [topicId, setTopicId] = useState(topics[0]?.id ?? '');
  const [subtopicIds, setSubtopicIds] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === topicId),
    [topics, topicId]
  );

  const toggleSubtopic = (id: string) => {
    setSubtopicIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setStatus('Generating suggestions...');
    const response = await fetch('/api/admin/autofill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId,
        subtopicIds
      })
    });

    if (!response.ok) {
      setStatus('Error generating suggestions.');
      return;
    }

    const data = await response.json();
    setStatus(`Created ${data.count} suggestions.`);
    window.location.reload();
  };

  return (
    <div className="rounded-3xl bg-canvas p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">Auto-fill suggestions</h2>
      <p className="text-xs text-slate">
        Pull suggestions from trusted sources. Website/blog sources create
        placeholders for manual review.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          Topic
          <select
            value={topicId}
            onChange={(event) => {
              setTopicId(event.target.value);
              setSubtopicIds([]);
            }}
            className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
          >
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-2 text-sm">
          Subtopics (optional)
          <div className="flex flex-wrap gap-2">
            {selectedTopic?.subtopics.map((subtopic) => (
              <button
                key={subtopic.id}
                type="button"
                onClick={() => toggleSubtopic(subtopic.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  subtopicIds.includes(subtopic.id)
                    ? 'bg-ink text-canvas'
                    : 'bg-sand text-slate'
                }`}
              >
                {subtopic.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-4 rounded-2xl bg-coral px-4 py-2 text-sm font-semibold text-ink"
      >
        Auto-fill suggestions
      </button>
      {status && <p className="mt-2 text-xs text-slate">{status}</p>}
    </div>
  );
}
