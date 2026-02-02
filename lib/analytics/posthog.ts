// lib/analytics/posthog.ts
import posthog from "posthog-node";

/**
 * Server-side PostHog helper that NEVER throws during build/import.
 * If keys are missing, it becomes a no-op.
 *
 * Env vars supported:
 * - POSTHOG_API_KEY (server key)
 * - POSTHOG_HOST (optional, default https://app.posthog.com)
 * - POSTHOG_DISABLED=true (optional kill switch)
 */

let _client: posthog.PostHog | null = null;

function isDisabled() {
  return String(process.env.POSTHOG_DISABLED || "").toLowerCase() === "true";
}

export function getPosthog(): posthog.PostHog | null {
  if (isDisabled()) return null;
  if (_client) return _client;

  const apiKey = process.env.POSTHOG_API_KEY;
  if (!apiKey) return null;

  const host = process.env.POSTHOG_HOST || "https://app.posthog.com";

  // IMPORTANT: Do not throw if anything is weird. Return null.
  try {
    _client = new posthog.PostHog(apiKey, { host });
    return _client;
  } catch {
    _client = null;
    return null;
  }
}

/**
 * Safe server event capture.
 * This is what your API routes are trying to import.
 * If PostHog isn't configured, it does nothing.
 */
export async function captureServerEvent(args: {
  distinctId: string;
  event: string;
  properties?: Record<string, any>;
}) {
  const client = getPosthog();
  if (!client) return;

  try {
    client.capture({
      distinctId: args.distinctId,
      event: args.event,
      properties: args.properties ?? {},
    });

    // Flush quickly so serverless doesn't drop events
    await client.flushAsync();
  } catch {
    // swallow errors so analytics can never break the app
  }
}
