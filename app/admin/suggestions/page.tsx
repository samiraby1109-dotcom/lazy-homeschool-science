import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { SuggestionsTable } from '@/components/admin/suggestions-table';
import { AutoFillForm } from '@/components/admin/suggestions-autofill';
import { buildKeywordSet, matchesKeywords } from '@/lib/autofill';

const RECENCY_WEIGHT = 0.4;
const KEYWORD_WEIGHT = 0.6;

function scoreSuggestion({
  title,
  createdAt,
  topicName,
  subtopicName,
  neutralRecency
}: {
  title: string;
  createdAt: Date;
  topicName: string;
  subtopicName?: string | null;
  neutralRecency: boolean;
}) {
  const keywordSet = buildKeywordSet(topicName, subtopicName ?? undefined);
  const matches = matchesKeywords(title, keywordSet);
  const keywordScore = Math.min(1, matches / Math.max(keywordSet.size, 1));
  const daysAgo = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const recencyScore = neutralRecency ? 0.5 : Math.max(0, 1 - daysAgo / 365);
  return KEYWORD_WEIGHT * keywordScore + RECENCY_WEIGHT * recencyScore;
}

type SearchParams = {
  status?: string;
  topicId?: string;
  subtopicId?: string;
  sourceId?: string;
  type?: string;
};

export default async function AdminSuggestionsPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();

  type SuggestionItem = {
    id: string;
    title: string;
    url: string;
    status: string;
    type: string;
    reason: string;
    createdAt: Date;
    topic: { id: string; name: string };
    subtopic: { id: string; name: string } | null;
    trustedSource: { id: string; name: string; type: 'WEBSITE' | 'YOUTUBE_CHANNEL' };
  };

  const topics = await prisma.topic.findMany({
    include: { subtopics: true },
    orderBy: { name: 'asc' }
  });

  const trustedSources = await prisma.trustedSource.findMany({
    orderBy: { name: 'asc' }
  });

  const suggestions = (await prisma.suggestedResource.findMany({
    where: {
      ...(searchParams.status ? { status: searchParams.status as 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SAVED_FOR_LATER' } : {}),
      ...(searchParams.topicId ? { topicId: searchParams.topicId } : {}),
      ...(searchParams.subtopicId ? { subtopicId: searchParams.subtopicId } : {}),
      ...(searchParams.sourceId ? { trustedSourceId: searchParams.sourceId } : {}),
      ...(searchParams.type ? { type: searchParams.type as 'VIDEO' | 'ARTICLE' | 'LESSON' | 'WORKSHEET' | 'EXPERIMENT' } : {})
    },
    include: {
      topic: true,
      subtopic: true,
      trustedSource: true
    }
  })) as SuggestionItem[];

  const scored = suggestions
    .map((suggestion) => ({
      suggestion: {
        ...suggestion,
        createdAt: suggestion.createdAt.toISOString()
      },
      score: scoreSuggestion({
        title: suggestion.title,
        createdAt: suggestion.createdAt,
        topicName: suggestion.topic.name,
        subtopicName: suggestion.subtopic?.name,
        neutralRecency: suggestion.trustedSource.type === 'WEBSITE'
      })
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ suggestion }) => suggestion);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-canvas p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Suggested Resources</h1>
        <p className="text-sm text-slate">
          Review and approve auto-filled suggestions from trusted sources.
        </p>
      </header>

      <AutoFillForm topics={topics} />

      <SuggestionsTable
        suggestions={scored}
        topics={topics}
        trustedSources={trustedSources}
        searchParams={searchParams}
      />
    </div>
  );
}
