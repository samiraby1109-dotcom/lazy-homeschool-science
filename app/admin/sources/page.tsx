import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { TrustedSourceForm } from '@/components/admin/trusted-source-form';

type SearchParams = {
  active?: string;
  type?: string;
  trustTier?: string;
  edit?: string;
};

export default async function AdminSourcesPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();

  type TrustedSourceItem = {
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

  const filters = {
    isActive:
      searchParams.active === 'all'
        ? undefined
        : searchParams.active === 'inactive'
        ? false
        : true,
    type: searchParams.type || undefined,
    trustTier: searchParams.trustTier || undefined
  };

  const sources = (await prisma.trustedSource.findMany({
    where: {
      ...(filters.isActive === undefined ? {} : { isActive: filters.isActive }),
      ...(filters.type ? { type: filters.type as 'YOUTUBE_CHANNEL' | 'WEBSITE' } : {}),
      ...(filters.trustTier
        ? { trustTier: filters.trustTier as 'HIGH' | 'REVIEW_REQUIRED' }
        : {})
    },
    orderBy: { createdAt: 'desc' }
  })) as TrustedSourceItem[];

  const editSource = searchParams.edit
    ? sources.find((source) => source.id === searchParams.edit)
    : undefined;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Trusted Sources</h1>
        <p className="text-sm text-slate">
          Manage vetted source registries for auto-curation.
        </p>
      </header>

      <div className="rounded-3xl bg-canvas p-6 shadow-sm">
        <form className="flex flex-wrap gap-4 text-sm" method="get">
          <label className="flex flex-col gap-2">
            Active
            <select name="active" defaultValue={searchParams.active ?? 'active'}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="all">All</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            Type
            <select name="type" defaultValue={searchParams.type ?? ''}>
              <option value="">All</option>
              <option value="YOUTUBE_CHANNEL">YouTube</option>
              <option value="WEBSITE">Website/Blog</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            Trust tier
            <select name="trustTier" defaultValue={searchParams.trustTier ?? ''}>
              <option value="">All</option>
              <option value="HIGH">High</option>
              <option value="REVIEW_REQUIRED">Review required</option>
            </select>
          </label>
          <button
            type="submit"
            className="self-end rounded-2xl bg-ink px-4 py-2 text-xs font-semibold text-canvas"
          >
            Apply filters
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {sources.map((source) => (
          <div key={source.id} className="rounded-3xl bg-canvas p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">{source.name}</h2>
                <p className="text-xs text-slate">
                  {source.type} · {source.trustTier} ·{' '}
                  {source.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <a
                href={`/admin/sources?edit=${source.id}`}
                className="rounded-full border border-slate/20 px-3 py-1 text-xs"
              >
                Edit
              </a>
            </div>
            <p className="mt-3 text-xs text-slate">
              {source.type === 'YOUTUBE_CHANNEL'
                ? `Channel ID: ${source.channelId ?? 'Missing (add to activate)'}`
                : `Base URL: ${source.baseUrl ?? 'Missing URL'}`}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">
          {editSource ? 'Edit source' : 'Add a source'}
        </h2>
        <TrustedSourceForm source={editSource} />
      </div>
    </div>
  );
}
