export default function ScienceUpdatesPage() {
  return (
    <main className="space-y-6">
      <header className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Science updates</h1>
        <p className="text-sm text-slate">
          Scaffold only. Add vetted science updates for future kid-friendly
          summaries.
        </p>
      </header>

      <form className="space-y-4 rounded-3xl bg-canvas p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate">
            Title
            <input
              type="text"
              className="mt-2 w-full rounded-2xl border border-slate/20 bg-sand px-4 py-3"
              placeholder="New satellite images reveal..."
            />
          </label>
          <label className="text-sm text-slate">
            Source URL
            <input
              type="url"
              className="mt-2 w-full rounded-2xl border border-slate/20 bg-sand px-4 py-3"
              placeholder="https://"
            />
          </label>
        </div>
        <label className="text-sm text-slate">
          Summary
          <textarea
            className="mt-2 w-full rounded-2xl border border-slate/20 bg-sand px-4 py-3"
            rows={4}
            placeholder="Short summary for internal use"
          />
        </label>
        <button className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-canvas">
          Save update (draft)
        </button>
        <p className="text-xs text-slate">
          TODO: automate ingestion from whitelisted institutions once vetted.
        </p>
      </form>
    </main>
  );
}
