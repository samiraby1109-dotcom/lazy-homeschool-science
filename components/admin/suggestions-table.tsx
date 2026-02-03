'use client';

import { useState } from 'react';

type Topic = {
  id: string;
  name: string;
  subtopics: { id: string; name: string }[];
};

type TrustedSource = {
  id: string;
  name: string;
};

type Suggestion = {
  id: string;
  title: string;
  url: string;
  status: string;
  type: string;
  reason: string;
  createdAt: string;
  topic: { id: string; name: string };
  subtopic: { id: string; name: string } | null;
  trustedSource: { id: string; name: string };
};

type SearchParams = {
  status?: string;
  topicId?: string;
  subtopicId?: string;
  sourceId?: string;
  type?: string;
};

export function SuggestionsTable({
  suggestions,
  topics,
  trustedSources,
  searchParams
}: {
  suggestions: Suggestion[];
  topics: Topic[];
  trustedSources: TrustedSource[];
  searchParams: SearchParams;
}) {
  const [statusMessage, setStatusMessage] = useState('');

  const handleAction = async (suggestionId: string, action: 'approve' | 'reject' | 'save') => {
    setStatusMessage('Updating...');
    const response = await fetch('/api/admin/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suggestionId, action })
    });

    if (!response.ok) {
      setStatusMessage('Error updating suggestion.');
      return;
    }

    setStatusMessage('Updated! Refreshing...');
    window.location.reload();
  };

  return (
    <div className="rounded-3xl bg-canvas p-6 shadow-sm">
      <form method="get" className="flex flex-wrap gap-4 text-sm">
        <label className="flex flex-col gap-2">
          Status
          <select name="status" defaultValue={searchParams.status ?? ''}>
            <option value="">All</option>
            <option value="PENDING_REVIEW">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SAVED_FOR_LATER">Saved</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          Topic
          <select name="topicId" defaultValue={searchParams.topicId ?? ''}>
            <option value="">All</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          Subtopic
          <select name="subtopicId" defaultValue={searchParams.subtopicId ?? ''}>
            <option value="">All</option>
            {topics.flatMap((topic) =>
              topic.subtopics.map((subtopic) => (
                <option key={subtopic.id} value={subtopic.id}>
                  {topic.name} · {subtopic.name}
                </option>
              ))
            )}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          Trusted source
          <select name="sourceId" defaultValue={searchParams.sourceId ?? ''}>
            <option value="">All</option>
            {trustedSources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          Type
          <select name="type" defaultValue={searchParams.type ?? ''}>
            <option value="">All</option>
            <option value="VIDEO">Video</option>
            <option value="ARTICLE">Article</option>
            <option value="LESSON">Lesson</option>
            <option value="WORKSHEET">Worksheet</option>
            <option value="EXPERIMENT">Experiment</option>
          </select>
        </label>
        <button
          type="submit"
          className="self-end rounded-2xl bg-ink px-4 py-2 text-xs font-semibold text-canvas"
        >
          Apply filters
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="rounded-2xl border border-slate/10 bg-sand p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">{suggestion.title}</p>
                <p className="text-xs text-slate">
                  {suggestion.topic.name}
                  {suggestion.subtopic ? ` · ${suggestion.subtopic.name}` : ''}
                </p>
                <a
                  href={suggestion.url}
                  className="text-xs text-coral"
                  target="_blank"
                  rel="noreferrer"
                >
                  {suggestion.url}
                </a>
              </div>
              <span className="rounded-full bg-mint px-3 py-1 text-xs text-ink">
                {suggestion.status}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate">Source: {suggestion.trustedSource.name}</p>
            <p className="mt-2 text-xs text-slate">Reason: {suggestion.reason}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAction(suggestion.id, 'approve')}
                className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-canvas"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => handleAction(suggestion.id, 'reject')}
                className="rounded-full border border-slate/20 px-3 py-1 text-xs"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleAction(suggestion.id, 'save')}
                className="rounded-full border border-slate/20 px-3 py-1 text-xs"
              >
                Save for later
              </button>
            </div>
          </div>
        ))}
        {suggestions.length === 0 && (
          <p className="text-sm text-slate">No suggestions yet.</p>
        )}
      </div>
      {statusMessage && <p className="mt-4 text-xs text-slate">{statusMessage}</p>}
    </div>
  );
}
