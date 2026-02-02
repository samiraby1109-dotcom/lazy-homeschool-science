import posthog from 'posthog-js';
import { PostHog } from 'posthog-node';

const isBrowser = typeof window !== 'undefined';

export const posthogClient = isBrowser
  ? posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST
    })
  : null;

export const posthogServer = new PostHog(
  process.env.POSTHOG_SERVER_KEY ?? '',
  {
    host: process.env.POSTHOG_SERVER_HOST
  }
);
