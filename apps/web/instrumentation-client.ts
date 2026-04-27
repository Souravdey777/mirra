import posthog from "posthog-js";

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

if (posthogToken) {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    defaults: "2026-01-30",
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    person_profiles: "identified_only"
  });
}
