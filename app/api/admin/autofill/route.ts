import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminApi } from '@/lib/admin-api';
import { autofillSchema } from '@/lib/validation';
import {
  buildKeywordSet,
  matchesKeywords,
  parseYouTubeFeed,
  shouldBlockTitle,
  youtubeFeedUrl,
  isYoutubeSourceActive
} from '@/lib/autofill';
import { trackEvent } from '@/lib/analytics/events';

export async function POST(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const adminSession = session as any;

  const body = await request.json();
  const parsed = autofillSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { topicId, subtopicIds } = parsed.data;
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { subtopics: true }
  });

  if (!topic) {
    return NextResponse.json({ error: 'Topic not found.' }, { status: 404 });
  }

  const targetSubtopics = subtopicIds.length
    ? topic.subtopics.filter((subtopic) => subtopicIds.includes(subtopic.id))
    : topic.subtopics;

  const trustedSources = await prisma.trustedSource.findMany({
    where: { isActive: true }
  });

  let createdCount = 0;
  const createdSuggestions = [] as Array<{ id: string; url: string }>;

  for (const subtopic of targetSubtopics) {
    const keywordSet = buildKeywordSet(topic.name, subtopic.name);

    for (const source of trustedSources) {
      if (source.type === 'YOUTUBE_CHANNEL' && isYoutubeSourceActive(source)) {
        const feed = await fetch(youtubeFeedUrl(source.channelId!), {
          headers: { 'User-Agent': 'LazyHomeschoolScienceBot/1.0' }
        });
        if (!feed.ok) {
          continue;
        }
        const xml = await feed.text();
        const entries = parseYouTubeFeed(xml);

        for (const entry of entries) {
          if (!entry.link || !entry.title) {
            continue;
          }

          const keywordMatches = matchesKeywords(entry.title, keywordSet);
          if (shouldBlockTitle(entry.title, source, keywordMatches)) {
            continue;
          }

          const existing = await prisma.suggestedResource.findFirst({
            where: {
              url: entry.link,
              topicId: topic.id,
              subtopicId: subtopic.id
            }
          });

          if (existing) {
            continue;
          }

          const suggestion = await prisma.suggestedResource.create({
            data: {
              topicId: topic.id,
              subtopicId: subtopic.id,
              trustedSourceId: source.id,
              type: 'VIDEO',
              url: entry.link,
              title: entry.title,
              provider: source.name,
              thumbnailUrl: entry.thumbnail || null,
              durationMin: null,
              summary: null,
              reason: `Matched keywords: ${Array.from(keywordSet).join(', ')}`,
              createdAt: entry.published ?? undefined
            }
          });

          createdCount += 1;
          createdSuggestions.push({ id: suggestion.id, url: suggestion.url });
        }
      }

      if (source.type === 'WEBSITE' && source.baseUrl) {
        const existing = await prisma.suggestedResource.findFirst({
          where: {
            url: source.baseUrl,
            topicId: topic.id,
            subtopicId: subtopic.id
          }
        });

        if (existing) {
          continue;
        }

        const suggestion = await prisma.suggestedResource.create({
          data: {
            topicId: topic.id,
            subtopicId: subtopic.id,
            trustedSourceId: source.id,
            type: 'ARTICLE',
            url: source.baseUrl,
            title: `${subtopic.name} resources from ${source.name}`,
            provider: source.name,
            thumbnailUrl: null,
            durationMin: null,
            summary: null,
            reason: 'Manual review needed: source is website/blog',
            status: 'PENDING_REVIEW'
          }
        });

        createdCount += 1;
        createdSuggestions.push({ id: suggestion.id, url: suggestion.url });
      }
    }
  }

  await trackEvent('suggested_resources_created', adminSession.user?.email ?? 'admin', {
    topicId,
    count: createdCount
  });

  return NextResponse.json({ count: createdCount, suggestions: createdSuggestions });
}
