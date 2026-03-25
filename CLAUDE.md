# CLAUDE.md

Working conventions for this project.

## Mission

Build a high-quality, minimal **Model Benchmark dashboard** for AI model testing workflows.

## Non-Negotiables

- Next.js App Router + TypeScript
- shadcn/ui + Tailwind
- Default black/white style only
- Mobile-first UX
- Postgres for persistence (Neon in prod, Docker locally)
- No branding or custom visual identity

## Design Direction

- Clean dashboard feel
- Strong hierarchy and spacing
- Compact, scannable cards
- Practical controls over visual noise

## Component Boundaries

- `app/page.tsx` orchestrates state and layout
- `app/api/instances/` contains REST route handlers
- `components/instances/*` contains feature components
- `lib/db.ts` is the DB connection (lazy, SSL-aware)
- `lib/api.ts` contains typed fetch helpers for the client
- `lib/mock-instances.ts` is source of demo/seed data
- Keep components focused and reusable

## Coding Rules

- Keep files readable and modular
- Favor explicit TypeScript types
- Avoid over-abstraction too early
- Preserve accessibility basics (labels, tap target sizes, semantic structure)

## Iteration Protocol

For each UI pass:
1. Define goal of the pass
2. Implement smallest useful change
3. Run lint + build
4. Update docs (README, progress-report, features, known-issues)
5. Commit and push (gitflow rule)

## Change Log

- v0: Initial Instances page scaffold with cards, filters, create dialog, and mock data.
- v1: Header/control UX polish for better mobile scanning.
- v2: Production-ready pass — Postgres persistence, API routes, Edit dialog, Results detail, lastRunAt type fix, Bulk/Sync removed, Docker local dev, metadata updated.

## Upcoming Work (living list)

- [ ] Sticky filters on scroll
- [ ] Advanced filters collapse/expand on mobile
- [ ] Inline status transitions with loading states
- [ ] Better empty and no-result affordances
- [ ] URL-synced filter state

---

We'll keep this doc updated as our source of implementation intent and constraints.
