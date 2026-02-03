import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export default async function AdminPage() {
  await requireAdmin();
  const topics = await prisma.topic.findMany({
    include: { category: true, subtopics: true },
    orderBy: { name: 'asc' }
  });

  return (
    <main className="space-y-6">
      <header className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Topics</h1>
        <p className="text-sm text-slate">
          Review topics and subtopics available for auto-curation.
        </p>
      </header>

      <div className="grid gap-4">
        {topics.map((topic) => (
          <div key={topic.id} className="rounded-3xl bg-canvas p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">{topic.name}</h2>
            <p className="text-xs text-slate">{topic.category.name}</p>
            <p className="mt-2 text-sm text-slate">{topic.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {topic.subtopics.map((subtopic) => (
                <span
                  key={subtopic.id}
                  className="rounded-full bg-sand px-3 py-1 text-xs text-slate"
                >
                  {subtopic.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
