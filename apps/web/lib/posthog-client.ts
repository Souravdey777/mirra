"use client";

import posthog from "posthog-js";

type ClientAnalyticsEvent = "waitlist_submit_attempt";

type AnalyticsProperties = Record<string, boolean | number | string | null>;

export function captureClientEvent(event: ClientAnalyticsEvent, properties?: AnalyticsProperties) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_TOKEN) {
    return;
  }

  posthog.capture(event, properties);
}

export function getClientDistinctId() {
  if (!process.env.NEXT_PUBLIC_POSTHOG_TOKEN) {
    return null;
  }

  try {
    return posthog.get_distinct_id();
  } catch {
    return null;
  }
}
