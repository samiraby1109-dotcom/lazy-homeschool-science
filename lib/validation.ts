import { z } from 'zod';

export const trustedSourceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.enum(['YOUTUBE_CHANNEL', 'WEBSITE']),
  trustTier: z.enum(['HIGH', 'REVIEW_REQUIRED']).default('HIGH'),
  isActive: z.boolean().default(true),
  channelId: z.string().optional().nullable(),
  baseUrl: z.string().url().optional().nullable(),
  contentTypesAllowed: z.array(z.string()).default([]),
  ageMin: z.number().int().min(1).default(5),
  ageMax: z.number().int().min(1).default(7),
  maxVideoMinutes: z.number().int().min(1).default(12),
  requireKeywords: z.array(z.string()).default([]),
  blockKeywords: z.array(z.string()).default([]),
  notes: z.string().optional().nullable()
});

export const suggestionActionSchema = z.object({
  suggestionId: z.string().min(1),
  action: z.enum(['approve', 'reject', 'save'])
});

export const autofillSchema = z.object({
  topicId: z.string().min(1),
  subtopicIds: z.array(z.string()).optional().default([])
});
