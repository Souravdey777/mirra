import "server-only";

import { PostHog } from "posthog-node";

type ServerAnalyticsEvent = "waitlist_signup_success" | "waitlist_signup_error";

type AnalyticsProperties = Record<string, boolean | number | string | null>;

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

function normalizeDistinctId(distinctId: string | null) {
  const trimmed = distinctId?.trim();

  if (!trimmed || trimmed.length > 200) {
    return `anonymous-waitlist-${crypto.randomUUID()}`;
  }

  return trimmed;
}

export async function captureServerEvent({
  distinctId,
  event,
  properties
}: {
  distinctId: string | null;
  event: ServerAnalyticsEvent;
  properties?: AnalyticsProperties;
}) {
  if (!posthogToken) {
    return;
  }

  const posthog = new PostHog(posthogToken, {
    host: posthogHost,
    flushAt: 1,
    flushInterval: 0
  });

  try {
    await posthog.captureImmediate({
      distinctId: normalizeDistinctId(distinctId),
      event,
      properties,
      disableGeoip: true
    });
  } catch (error) {
    console.error("PostHog event capture failed", error);
  } finally {
    await posthog.shutdown();
  }
}
