import { posthogServer } from '@/lib/analytics/posthog';

export async function trackEvent(
  event: string,
  distinctId: string,
  properties: Record<string, unknown>
) {
  if (!process.env.POSTHOG_SERVER_KEY) {
    return;
  }

  posthogServer.capture({
    distinctId,
    event,
    properties
  });

  await posthogServer.flushAsync();
}
