# Mirra Docs

This folder is the home for Mirra product, engineering, design, and launch documentation.

## Recommended Docs

### Start Here

- `product-overview.md` - What Mirra is, who it is for, what problem it solves, and what v1 intentionally excludes.
- `feature-spec.md` - Current and planned product features across chat, drafting, post suggestions from latest posts, persona memory, streaks, reminders, and waitlist.
- `local-development.md` - Setup steps, useful commands, environment variables, package layout, and troubleshooting.
- `architecture.md` - Workspace structure, app/package boundaries, data flow, mocked API layer, and future backend seams.

### Product

- `user-personas.md` - Primary creator personas, their goals, pains, and success criteria.
- `writing-workflows.md` - Core flows such as idea shaping, first draft, rewrite, voice check, repurpose, copy/open platform, and scheduling.
- `persona-memory.md` - How voice memory works, what gets analyzed, what signals are stored, and how confidence/voice match should behave.
- `post-suggestions.md` - How Mirra reads latest posts, understands the creator's voice, and suggests new post ideas that match their recent themes and tone.
- `platform-strategy.md` - LinkedIn vs X behavior, format differences, import assumptions, and publishing boundaries.
- `roadmap.md` - Near-term, later, and out-of-scope work with clear product rationale.

### Engineering

- `api-contracts.md` - Expected service contracts for auth, post import, persona snapshots, post suggestions, drafting, rewrite, streaks, and reminders.
- `data-model.md` - Supabase tables, Postgres schema, future entities, and migration notes.
- `testing.md` - Typecheck/build commands, manual QA flows, and eventual automated test coverage.
- `release-process.md` - How to ship web, mobile, migrations, and environment changes.

### Design And Content

- `design-system.md` - Color palette, typography, spacing, radius rules, icon usage, and shared component recipes.
- `brand-voice.md` - Mirra's product tone, naming conventions, empty states, and UX copy principles.
- `visual-assets.md` - Avatar, hero media, image/video locations, export rules, and asset replacement guidance.

### Growth And Operations

- `waitlist.md` - Waitlist flow, database setup, error handling, duplicate behavior, and export/admin needs.
- `analytics.md` - Key events, funnel metrics, activation metrics, retention signals, and privacy boundaries.
- `privacy-and-trust.md` - What creator data Mirra handles, consent expectations, post history import rules, and auto-posting boundaries.

## Suggested First Batch

Create these first because they will unblock product and engineering decisions fastest:

1. `product-overview.md`
2. `feature-spec.md`
3. `architecture.md`
4. `local-development.md`
5. `persona-memory.md`
6. `post-suggestions.md`
7. `waitlist.md`
