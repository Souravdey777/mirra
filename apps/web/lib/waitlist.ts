import "server-only";

import postgres from "postgres";

let sqlClient: ReturnType<typeof postgres> | undefined;

export type WaitlistPlatform = "both" | "linkedin" | "x";

export function isWaitlistConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function normalizeWaitlistEmail(email: string) {
  const normalized = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return null;
  }

  return normalized;
}

export function normalizeWaitlistProfileUrl(profileUrl: string, network: "linkedin" | "x") {
  const trimmed = profileUrl.trim();

  if (!trimmed) {
    return null;
  }

  const urlWithProtocol = /^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(urlWithProtocol);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    const isLinkedInHost = hostname === "linkedin.com" || hostname.endsWith(".linkedin.com");
    const isXHost =
      hostname === "x.com" ||
      hostname.endsWith(".x.com") ||
      hostname === "twitter.com" ||
      hostname.endsWith(".twitter.com");
    const isAllowedHost = network === "linkedin" ? isLinkedInHost : isXHost;

    if ((url.protocol !== "https:" && url.protocol !== "http:") || !isAllowedHost || url.pathname === "/") {
      return null;
    }

    url.protocol = "https:";
    url.hash = "";

    return url.toString();
  } catch {
    return null;
  }
}

function getSqlClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  sqlClient ??= postgres(databaseUrl, {
    max: 1,
    idle_timeout: 20,
    prepare: false,
    ssl: "require"
  });

  return sqlClient;
}

type CreateWaitlistSignupInput = {
  email: string;
  referrer: string | null;
  userAgent: string | null;
};

export async function createWaitlistSignup(input: CreateWaitlistSignupInput) {
  const email = normalizeWaitlistEmail(input.email);

  if (!email) {
    throw new Error("A valid email address is required");
  }

  const rows = await getSqlClient()<[{ id: number }]>`
    insert into public.waitlist_signups (email, source, user_agent, referrer)
    values (${email}, 'website', ${input.userAgent}, ${input.referrer})
    on conflict (email_normalized) do nothing
    returning id
  `;

  return {
    inserted: rows.length > 0
  };
}

type UpdateWaitlistProfileInput = {
  email: string;
  linkedinProfileUrl: string | null;
  xProfileUrl: string | null;
};

export async function updateWaitlistProfile(input: UpdateWaitlistProfileInput) {
  const email = normalizeWaitlistEmail(input.email);
  const linkedinProfileUrl = input.linkedinProfileUrl
    ? normalizeWaitlistProfileUrl(input.linkedinProfileUrl, "linkedin")
    : null;
  const xProfileUrl = input.xProfileUrl ? normalizeWaitlistProfileUrl(input.xProfileUrl, "x") : null;

  if (!email || (!linkedinProfileUrl && !xProfileUrl)) {
    throw new Error("A valid email and at least one profile URL are required");
  }

  const platform: WaitlistPlatform = linkedinProfileUrl && xProfileUrl ? "both" : linkedinProfileUrl ? "linkedin" : "x";
  const primaryProfileUrl = linkedinProfileUrl ?? xProfileUrl;

  const rows = await getSqlClient()<[{ id: number }]>`
    update public.waitlist_signups
    set
      preferred_platform = ${platform},
      profile_url = ${primaryProfileUrl},
      linkedin_profile_url = ${linkedinProfileUrl},
      x_profile_url = ${xProfileUrl},
      onboarding_status = 'profile_added',
      profile_submitted_at = now()
    where email_normalized = ${email}
    returning id
  `;

  return {
    updated: rows.length > 0
  };
}
