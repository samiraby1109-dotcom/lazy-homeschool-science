import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="space-y-6">
      <header className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Admin dashboard</h1>
        <p className="text-sm text-slate">
          Curate vetted resources and approve science updates.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/resources"
          className="rounded-3xl bg-mint/60 p-6 text-sm font-semibold text-ink"
        >
          Manage resources
        </Link>
        <Link
          href="/admin/updates"
          className="rounded-3xl bg-lime/60 p-6 text-sm font-semibold text-ink"
        >
          Science updates (scaffold)
        </Link>
      </div>
    </main>
  );
}
