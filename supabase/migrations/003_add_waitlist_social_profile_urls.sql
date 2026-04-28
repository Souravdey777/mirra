alter table public.waitlist_signups
add column if not exists linkedin_profile_url text,
add column if not exists x_profile_url text;
