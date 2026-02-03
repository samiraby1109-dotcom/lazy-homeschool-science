import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-api';
import { trustedSourceSchema } from '@/lib/validation';
import { captureServerEvent } from '@/lib/analytics/posthog';

export async function POST(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const adminSession = session as any;

  const body = await request.json();
  const parsed = trustedSourceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  if (data.type === 'YOUTUBE_CHANNEL' && !data.channelId) {
    return NextResponse.json(
      { error: 'channelId is required for YouTube sources.' },
      { status: 400 }
    );
  }

  if (data.type === 'WEBSITE' && !data.baseUrl) {
    return NextResponse.json(
      { error: 'baseUrl is required for website sources.' },
      { status: 400 }
    );
  }

  const created = await prisma.trustedSource.create({
    data: {
      name: data.name,
      type: data.type,
      trustTier: data.trustTier,
      isActive: data.isActive,
      channelId: data.channelId ?? null,
      baseUrl: data.baseUrl ?? null,
      contentTypesAllowed: data.contentTypesAllowed,
      ageMin: data.ageMin,
      ageMax: data.ageMax,
      maxVideoMinutes: data.maxVideoMinutes,
      requireKeywords: data.requireKeywords,
      blockKeywords: data.blockKeywords,
      notes: data.notes ?? null
    }
  });

  await captureServerEvent({
    distinctId: adminSession.user?.email ?? 'admin',
    event: 'trusted_source_created',
    properties: {
      sourceId: created.id,
      type: created.type,
      trustTier: created.trustTier
    }
  });

  return NextResponse.json({ source: created });
}

export async function PATCH(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const adminSession = session as any;

  const body = await request.json();
  const parsed = trustedSourceSchema.safeParse(body);
  if (!parsed.success || !parsed.data.id) {
    return NextResponse.json({ error: parsed.error?.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  if (data.type === 'YOUTUBE_CHANNEL' && !data.channelId) {
    return NextResponse.json(
      { error: 'channelId is required for YouTube sources.' },
      { status: 400 }
    );
  }

  if (data.type === 'WEBSITE' && !data.baseUrl) {
    return NextResponse.json(
      { error: 'baseUrl is required for website sources.' },
      { status: 400 }
    );
  }

  const updated = await prisma.trustedSource.update({
    where: { id: data.id },
    data: {
      name: data.name,
      type: data.type,
      trustTier: data.trustTier,
      isActive: data.isActive,
      channelId: data.channelId ?? null,
      baseUrl: data.baseUrl ?? null,
      contentTypesAllowed: data.contentTypesAllowed,
      ageMin: data.ageMin,
      ageMax: data.ageMax,
      maxVideoMinutes: data.maxVideoMinutes,
      requireKeywords: data.requireKeywords,
      blockKeywords: data.blockKeywords,
      notes: data.notes ?? null
    }
  });

  await captureServerEvent({
    distinctId: adminSession.user?.email ?? 'admin',
    event: 'trusted_source_updated',
    properties: {
      sourceId: updated.id,
      type: updated.type,
      trustTier: updated.trustTier
    }
  });

  return NextResponse.json({ source: updated });
}
