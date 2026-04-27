import "server-only";

import postgres from "postgres";

let sqlClient: ReturnType<typeof postgres> | undefined;

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
