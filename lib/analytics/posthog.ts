import posthog from 'posthog-js';
import { PostHog } from 'posthog-node';

const isBrowser = typeof window !== 'undefined';

export const posthogClient = isBrowser
  ? posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST
    })
  : null;

let posthogServer: PostHog | null = null;

export function getPosthog() {
  const key = process.env.POSTHOG_SERVER_KEY;
  if (!key) {
    return null;
  }
  if (!posthogServer) {
    posthogServer = new PostHog(key, {
      host: process.env.POSTHOG_SERVER_HOST
    });
  }
  return posthogServer;
}

export async function captureServerEvent({
  distinctId,
  event,
  properties
}: {
  distinctId: string;
  event: string;
  properties: Record<string, unknown>;
}) {
  const client = getPosthog();
  if (!client) {
    return;
  }
  client.capture({ distinctId, event, properties });
  await client.flushAsync();
}
