# Mirra

Mirra is a chat-first AI companion for solo creators writing on LinkedIn and X. It helps one person shape ideas, draft posts, rewrite in their own tone, understand their persona, and stay consistent without handing publishing control to automation.

## Workspace

```txt
apps/
  mobile/   Expo + React Native + Expo Router app
  web/      Next.js landing page and waitlist
packages/
  design/   Shared colors, spacing, radii, platform metadata, component recipes
  product/  Mock product data, persona memory shape, future service contracts
```

## Getting Started

```bash
npm install
npm run dev:mobile
npm run dev:web
```

Useful checks:

```bash
npm run typecheck
npm run build:web
```

## Product Foundation

- Mobile is the primary product surface and starts on the Mirra chat screen.
- Chat and persona screens use mocked product data from `@mirra/product`.
- Shared visual decisions live in `@mirra/design` so mobile and web stay aligned.
- The landing page is intentionally simple: clear positioning, product previews, waitlist form, who it is for, and v1 boundaries.
- The current v1 does not include team mode, brand mode, or auto-posting.

## Future Architecture

`packages/product/src/contracts.ts` defines the first integration seams for:

- Supabase auth and creator identity
- LinkedIn and X post history import
- Persona memory snapshots
- Drafting and rewrite services
- Streak tracking and reminders

The mocked API layer in `apps/mobile/src/lib/mockApi.ts` mirrors the shape of future async data fetching so TanStack Query can later point at Fastify/Supabase endpoints without changing the screens heavily.

## Design Notes

Mirra uses a warm cream base, soft white surfaces, denim blue, mint, coral, amber, and lavender accents. Cards stay compact with an 8px radius; pills, avatar treatments, and device frames carry the softer roundness. The generated Mirra avatar is stored in:

- `apps/mobile/assets/images/mirra-avatar.png`
- `apps/web/public/images/mirra-avatar.png`
