import { captureServerEvent } from '@/lib/analytics/posthog';

export async function trackEvent(
  event: string,
  distinctId: string,
  properties: Record<string, unknown>
) {
  await captureServerEvent({ distinctId, event, properties });
}
