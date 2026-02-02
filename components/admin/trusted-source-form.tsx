'use client';

import { useState } from 'react';

type TrustedSource = {
  id: string;
  name: string;
  type: 'YOUTUBE_CHANNEL' | 'WEBSITE';
  trustTier: 'HIGH' | 'REVIEW_REQUIRED';
  isActive: boolean;
  channelId: string | null;
  baseUrl: string | null;
  contentTypesAllowed: string[];
  ageMin: number;
  ageMax: number;
  maxVideoMinutes: number;
  requireKeywords: string[];
  blockKeywords: string[];
  notes: string | null;
};

const contentTypeOptions = [
  'VIDEO',
  'EXPERIMENT',
  'WORKSHEET',
  'ARTICLE',
  'LESSON'
];

export function TrustedSourceForm({ source }: { source?: TrustedSource }) {
  const [status, setStatus] = useState<string>('');
  const [formState, setFormState] = useState({
    id: source?.id ?? '',
    name: source?.name ?? '',
    type: source?.type ?? 'YOUTUBE_CHANNEL',
    trustTier: source?.trustTier ?? 'HIGH',
    isActive: source?.isActive ?? true,
    channelId: source?.channelId ?? '',
    baseUrl: source?.baseUrl ?? '',
    contentTypesAllowed: source?.contentTypesAllowed ?? ['VIDEO'],
    ageMin: source?.ageMin ?? 5,
    ageMax: source?.ageMax ?? 7,
    maxVideoMinutes: source?.maxVideoMinutes ?? 12,
    requireKeywords: source?.requireKeywords?.join(', ') ?? '',
    blockKeywords: source?.blockKeywords?.join(', ') ?? '',
    notes: source?.notes ?? ''
  });

  const toggleContentType = (value: string) => {
    setFormState((prev) => {
      const exists = prev.contentTypesAllowed.includes(value);
      return {
        ...prev,
        contentTypesAllowed: exists
          ? prev.contentTypesAllowed.filter((item) => item !== value)
          : [...prev.contentTypesAllowed, value]
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('Saving...');

    const payload = {
      ...formState,
      channelId: formState.channelId || null,
      baseUrl: formState.baseUrl || null,
      requireKeywords: formState.requireKeywords
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      blockKeywords: formState.blockKeywords
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    };

    const response = await fetch('/api/admin/sources', {
      method: formState.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setStatus('Error saving source.');
      return;
    }

    setStatus('Saved! Reloading...');
    window.location.href = '/admin/sources';
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-4 text-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          Name
          <input
            value={formState.name}
            onChange={(event) => setFormState({ ...formState, name: event.target.value })}
            className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          Type
          <select
            value={formState.type}
            onChange={(event) =>
              setFormState({
                ...formState,
                type: event.target.value as 'YOUTUBE_CHANNEL' | 'WEBSITE'
              })
            }
            className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
          >
            <option value="YOUTUBE_CHANNEL">YouTube Channel</option>
            <option value="WEBSITE">Website/Blog</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          Trust tier
          <select
            value={formState.trustTier}
            onChange={(event) =>
              setFormState({
                ...formState,
                trustTier: event.target.value as 'HIGH' | 'REVIEW_REQUIRED'
              })
            }
            className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
          >
            <option value="HIGH">High</option>
            <option value="REVIEW_REQUIRED">Review required</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          Status
          <select
            value={formState.isActive ? 'active' : 'inactive'}
            onChange={(event) =>
              setFormState({ ...formState, isActive: event.target.value === 'active' })
            }
            className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <label className="flex flex-col gap-2">
          Channel ID (YouTube)
          <input
            value={formState.channelId}
            onChange={(event) =>
              setFormState({ ...formState, channelId: event.target.value })
            }
            className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
            placeholder="UC..."
          />
        </label>
        <label className="flex flex-col gap-2">
          Base URL (Website)
          <input
            value={formState.baseUrl}
            onChange={(event) => setFormState({ ...formState, baseUrl: event.target.value })}
            className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
            placeholder="https://"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2">
          Age min
          <input
            type="number"
            value={formState.ageMin}
            onChange={(event) =>
              setFormState({ ...formState, ageMin: Number(event.target.value) })
            }
            className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
          />
        </label>
        <label className="flex flex-col gap-2">
          Age max
          <input
            type="number"
            value={formState.ageMax}
            onChange={(event) =>
              setFormState({ ...formState, ageMax: Number(event.target.value) })
            }
            className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
          />
        </label>
        <label className="flex flex-col gap-2">
          Max video minutes
          <input
            type="number"
            value={formState.maxVideoMinutes}
            onChange={(event) =>
              setFormState({
                ...formState,
                maxVideoMinutes: Number(event.target.value)
              })
            }
            className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
          />
        </label>
      </div>

      <fieldset className="rounded-2xl border border-slate/10 bg-sand p-4">
        <legend className="text-xs font-semibold text-slate">Content types allowed</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {contentTypeOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleContentType(option)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                formState.contentTypesAllowed.includes(option)
                  ? 'bg-ink text-canvas'
                  : 'bg-canvas text-slate'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          Require keywords (comma separated)
          <input
            value={formState.requireKeywords}
            onChange={(event) =>
              setFormState({ ...formState, requireKeywords: event.target.value })
            }
            className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
          />
        </label>
        <label className="flex flex-col gap-2">
          Block keywords (comma separated)
          <input
            value={formState.blockKeywords}
            onChange={(event) =>
              setFormState({ ...formState, blockKeywords: event.target.value })
            }
            className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        Notes
        <textarea
          value={formState.notes}
          onChange={(event) => setFormState({ ...formState, notes: event.target.value })}
          className="rounded-2xl border border-slate/20 bg-sand px-4 py-2"
          rows={3}
        />
      </label>

      <button type="submit" className="rounded-2xl bg-ink px-4 py-2 text-xs font-semibold text-canvas">
        {formState.id ? 'Update source' : 'Create source'}
      </button>
      {status && <p className="text-xs text-slate">{status}</p>}
    </form>
  );
}
