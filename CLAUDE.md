# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Галерия Савчеви" (Gallery Savchevi) — a Bulgarian-language art gallery website for a gallery in Oryahovo, Bulgaria. All user-facing text is in Bulgarian.

## Commands

- `bun run dev` — Start dev server on port 3001
- `bun run build` — Production build (vite build + tsc)
- `bun run typecheck` — Type-check without emitting (`tsc --noEmit`)
- `bun run preview` — Preview production build

Package manager is **bun** (lockfile: `bun.lock`). No test framework is configured.

## Architecture

**Stack:** React 19, TypeScript, Vite 7, TanStack Router (file-based), Tailwind CSS v4, Radix UI + CVA components.

### Routing (TanStack Router — file-based)

Routes live in `src/routes/`. The TanStack Router Vite plugin auto-generates `src/routeTree.gen.ts` — never edit this file manually. Adding a file to `src/routes/` automatically creates a route. Auto code-splitting is enabled.

- `__root.tsx` — Root layout (dark header with gold accents, full footer, mobile menu, `<Outlet />`)
- `index.tsx` — Home page (`/`) — hero, featured artworks, current exhibition, upcoming events, CTA
- `collection.tsx` — Collection with category filter tabs (`/collection`)
- `artwork.$artworkId.tsx` — Artwork detail with related works (`/artwork/:artworkId`)
- `exhibitions.tsx` — Exhibitions grouped by status: current/upcoming/past (`/exhibitions`)
- `events.tsx` — Events calendar with featured event and archive (`/events`)
- `about.tsx` — About page with story, mission, stats, values (`/about`)
- `contact.tsx` — Contact form + gallery info (`/contact`)

Routes use `loader` functions to fetch data and `Route.useLoaderData()` to consume it.

### Data Layer

Currently uses hardcoded in-memory data (no backend/API). The data layer follows a repository pattern:

- `src/data/hardcoded-data.ts` — All seed data (artists, artworks, exhibitions, events, gallery info)
- `src/data/*-repo.ts` — Repository functions per entity (artwork, exhibition, event, gallery)
- `src/data/index.ts` — Barrel export for all repos

To add a new entity: define the type in `src/types/`, add seed data in `hardcoded-data.ts`, create a `*-repo.ts`, and re-export from the barrel.

### Types

`src/types/` contains domain types with barrel export via `index.ts`. Key enums: `ArtCategory`, `ExhibitionStatus`, `EventStatus`.

### UI Components

- `src/components/ui/` — Reusable primitives (Button, Input) following shadcn/ui conventions (Radix + CVA + `cn()` utility)
- `src/components/` — Domain components (e.g., `ArtworkCard`)

### Design System

The visual identity uses an "editorial luxury" aesthetic — dark warm tones, gold accents, generous whitespace.

**Color palette** (CSS custom properties in `src/styles.css`):
- `--color-gallery-*` — Warm charcoal scale (950–50) for backgrounds and text
- `--color-gold-*` — Aged gold scale (500–100) for accents and highlights
- `--color-ivory` / `--color-cream` — Light page backgrounds

**Typography** (Google Fonts):
- `--font-display` / `--font-serif`: Cormorant Garamond (headings, branding)
- `--font-body` / `--font-sans`: DM Sans (body text, UI)

**CSS utilities** defined in `src/styles.css`:
- `.grain` — Noise texture overlay for dark sections
- `.gold-line` / `.gold-line-center` — Decorative gold gradient lines
- `.img-zoom` — Hover zoom effect on images
- `.animate-fade-up`, `.animate-fade-in`, `.animate-slide-in-right` — Entrance animations with `.delay-*` modifiers
- `.no-scrollbar` — Hide scrollbar for horizontal scroll areas

**Button variants**: `default`, `gold`, `outline`, `outline-light`, `ghost`, `link`

### Path Alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`). Always use `@/` imports.

## Conventions

- TypeScript strict mode is enabled with `noUnusedLocals` and `noUnusedParameters`
- Date formatting uses Bulgarian locale (`bg-BG`) via `formatDate()` in `src/lib/utils.ts`
- The `cn()` utility (clsx + tailwind-merge) is the standard way to compose class names
- Section headers follow the pattern: small gold label (`text-xs tracking-[0.3em] uppercase text-[var(--color-gold-500)]`) above a large serif heading
- Dark sections use `bg-[var(--color-gallery-950)] grain` with `gold-line` or `gold-line-center` separators
