import Link from 'next/link';
import { Card } from '@/components/card';
import { categories } from '@/lib/sample-data';

export default function HomePage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">
          What are you curious about today?
        </h1>
        <p className="text-sm text-slate">
          Choose a category to discover kid-friendly science topics.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href="/topic">
            <Card title={category.name} description={category.description} />
          </Link>
        ))}
      </div>
    </main>
  );
}
