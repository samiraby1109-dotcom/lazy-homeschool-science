import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-api';
import { suggestionActionSchema } from '@/lib/validation';
import { captureServerEvent } from '@/lib/analytics/posthog';

export async function POST(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const adminSession = session as any;

  const body = await request.json();
  const parsed = suggestionActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { suggestionId, action } = parsed.data;
  const suggestion = await prisma.suggestedResource.findUnique({
    where: { id: suggestionId },
    include: { trustedSource: true }
  });

  if (!suggestion) {
    return NextResponse.json({ error: 'Suggestion not found.' }, { status: 404 });
  }

  if (action === 'approve') {
    const resource = await prisma.resource.create({
      data: {
        url: suggestion.url,
        title: suggestion.title,
        provider: suggestion.provider,
        type: suggestion.type,
        ageMin: suggestion.trustedSource.ageMin,
        ageMax: suggestion.trustedSource.ageMax,
        watchTimeMin: suggestion.durationMin ?? undefined,
        summary: suggestion.summary ?? 'Approved resource',
        notes: suggestion.reason,
        vettedAt: new Date(),
        vettedBy: adminSession.user?.email ?? 'admin',
        status: 'APPROVED',
        topicId: suggestion.topicId,
        subtopicId: suggestion.subtopicId ?? undefined
      }
    });

    await prisma.suggestedResource.update({
      where: { id: suggestionId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: adminSession.user?.email ?? 'admin'
      }
    });

    await captureServerEvent({
      distinctId: adminSession.user?.email ?? 'admin',
      event: 'suggested_resource_approved',
      properties: {
        suggestionId,
        resourceId: resource.id,
        topicId: suggestion.topicId
      }
    });

    return NextResponse.json({ resourceId: resource.id });
  }

  if (action === 'reject') {
    await prisma.suggestedResource.update({
      where: { id: suggestionId },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: adminSession.user?.email ?? 'admin'
      }
    });

    await captureServerEvent({
      distinctId: adminSession.user?.email ?? 'admin',
      event: 'suggested_resource_rejected',
      properties: {
        suggestionId,
        topicId: suggestion.topicId
      }
    });

    return NextResponse.json({ status: 'rejected' });
  }

  await prisma.suggestedResource.update({
    where: { id: suggestionId },
    data: {
      status: 'SAVED_FOR_LATER',
      reviewedAt: new Date(),
      reviewedBy: adminSession.user?.email ?? 'admin'
    }
  });

  return NextResponse.json({ status: 'saved' });
}
