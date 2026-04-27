create table if not exists public.waitlist_signups (
  id bigint generated always as identity primary key,
  email text not null,
  email_normalized text generated always as (lower(trim(email))) stored,
  source text not null default 'website',
  user_agent text,
  referrer text,
  created_at timestamptz not null default now(),
  constraint waitlist_signups_email_valid check (
    email_normalized ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$'
  ),
  constraint waitlist_signups_email_unique unique (email_normalized)
);

alter table public.waitlist_signups enable row level security;
