import { historyItems } from '@/lib/sample-data';

export default function HistoryPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">History</h1>
      <div className="space-y-4">
        {historyItems.map((item) => (
          <div key={item.id} className="rounded-3xl bg-canvas p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">{item.topic}</h2>
              <span className="rounded-full bg-mint px-3 py-1 text-xs text-ink">
                {item.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate">Last run: {item.lastRun}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-full border border-slate/20 px-3 py-1 text-xs">
                Repeat
              </button>
              <button className="rounded-full border border-slate/20 px-3 py-1 text-xs">
                Go deeper
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
