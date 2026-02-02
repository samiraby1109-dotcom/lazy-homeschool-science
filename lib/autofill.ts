import { TrustedSource, TrustedSourceType } from '@prisma/client';

export const bodyTopicKeywords: Record<string, string[]> = {
  heart: ['heart', 'heartbeat', 'circulation'],
  'blood & circulation': ['blood', 'circulation', 'blood vessels'],
  'brain & feelings': ['brain', 'feelings', 'emotions', 'nervous system'],
  'healthy habits': ['healthy', 'exercise', 'sleep', 'nutrition']
};

export function buildKeywordSet(topic: string, subtopic?: string) {
  const keywords = new Set<string>();
  [topic, subtopic].filter(Boolean).forEach((value) => {
    value
      ?.split(/\s+/)
      .map((word) => word.toLowerCase())
      .forEach((word) => keywords.add(word));
  });

  if (subtopic) {
    const extra = bodyTopicKeywords[subtopic.toLowerCase()];
    extra?.forEach((word) => keywords.add(word.toLowerCase()));
  }

  return keywords;
}

export function matchesKeywords(text: string, keywords: Set<string>) {
  const lower = text.toLowerCase();
  let matches = 0;
  keywords.forEach((keyword) => {
    if (lower.includes(keyword.toLowerCase())) {
      matches += 1;
    }
  });
  return matches;
}

export function shouldBlockTitle(
  title: string,
  source: TrustedSource,
  keywordMatches: number
) {
  const lower = title.toLowerCase();
  if (source.requireKeywords.length > 0) {
    const hasRequired = source.requireKeywords.some((keyword) =>
      lower.includes(keyword.toLowerCase())
    );
    if (!hasRequired) {
      return true;
    }
  }

  if (source.blockKeywords.some((keyword) => lower.includes(keyword.toLowerCase()))) {
    return true;
  }

  return keywordMatches === 0;
}

export function youtubeFeedUrl(channelId: string) {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
}

export function parseYouTubeFeed(xml: string) {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  return entries.map((entry) => {
    const title = decodeXml(matchTag(entry, 'title'));
    const link = matchAttribute(entry, 'link', 'href');
    const published = matchTag(entry, 'published');
    const thumbnail = matchAttribute(entry, 'media:thumbnail', 'url');
    return {
      title,
      link,
      published: published ? new Date(published) : null,
      thumbnail
    };
  });
}

function matchTag(source: string, tag: string) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
  const match = source.match(regex);
  return match ? match[1].trim() : '';
}

function matchAttribute(source: string, tag: string, attribute: string) {
  const regex = new RegExp(`<${tag}[^>]*${attribute}="([^"]+)"`);
  const match = source.match(regex);
  return match ? match[1] : '';
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function isYoutubeSourceActive(source: TrustedSource) {
  return source.type === TrustedSourceType.YOUTUBE_CHANNEL && Boolean(source.channelId);
}
