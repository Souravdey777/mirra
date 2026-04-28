alter table public.waitlist_signups
add column if not exists profile_url text,
add column if not exists preferred_platform text,
add column if not exists onboarding_status text not null default 'email_only',
add column if not exists profile_submitted_at timestamptz;

alter table public.waitlist_signups
drop constraint if exists waitlist_signups_preferred_platform_valid,
add constraint waitlist_signups_preferred_platform_valid check (
  preferred_platform is null or preferred_platform in ('both', 'linkedin', 'x')
);

alter table public.waitlist_signups
drop constraint if exists waitlist_signups_onboarding_status_valid,
add constraint waitlist_signups_onboarding_status_valid check (
  onboarding_status in ('email_only', 'profile_added')
);
