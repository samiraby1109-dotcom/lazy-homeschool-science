// lib/analytics/posthog.ts
import { PostHog } from "posthog-node";

let _client: PostHog | null = null;

function getClient(): PostHog | null {
  // Never crash builds or runtime if key is missing
  const apiKey = process.env.POSTHOG_API_KEY;

  if (!apiKey) return null;

  if (_client) return _client;

  _client = new PostHog(apiKey, {
    host: process.env.POSTHOG_HOST || "https://app.posthog.com",
  });

  return _client;
}

type CaptureProps = Record<string, unknown>;

export function captureServerEvent(params: {
  distinctId: string;
  event: string;
  properties?: CaptureProps;
}): void {
  const client = getClient();
  if (!client) return;

  try {
    client.capture({
      distinctId: params.distinctId,
      event: params.event,
      properties: params.properties ?? {},
    });
  } catch {
    // swallow — analytics should never break the app
  }
}

/**
 * Optional: call this on graceful shutdown (not required on Vercel).
 */
export async function flushPosthog(): Promise<void> {
  const client = getClient();
  if (!client) return;

  try {
    await client.shutdownAsync();
  } catch {
    // swallow
  }
}
