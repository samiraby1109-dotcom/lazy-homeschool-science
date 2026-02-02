export default function AdminResourcesPage() {
  return (
    <main className="space-y-6">
      <header className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Vetted resources</h1>
        <p className="text-sm text-slate">
          Add videos, worksheets, and experiments with full metadata and
          transcripts/excerpts.
        </p>
      </header>

      <form className="space-y-4 rounded-3xl bg-canvas p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate">
            Resource URL
            <input
              type="url"
              className="mt-2 w-full rounded-2xl border border-slate/20 bg-sand px-4 py-3"
              placeholder="https://"
            />
          </label>
          <label className="text-sm text-slate">
            Title
            <input
              type="text"
              className="mt-2 w-full rounded-2xl border border-slate/20 bg-sand px-4 py-3"
              placeholder="Magnetism for kids"
            />
          </label>
        </div>
        <label className="text-sm text-slate">
          Transcript/excerpt
          <textarea
            className="mt-2 w-full rounded-2xl border border-slate/20 bg-sand px-4 py-3"
            rows={5}
            placeholder="Paste vetted transcript text here"
          />
        </label>
        <button className="rounded-2xl bg-ink px-4 py-2 text-sm font-semibold text-canvas">
          Save to pending queue
        </button>
      </form>
    </main>
  );
}
