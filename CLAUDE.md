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

- `app/page.tsx` orchestrates instances state, run triggering, and polling loop
- `app/settings/page.tsx` orchestrates provider + custom test CRUD
- `app/api/instances/` — instance CRUD route handlers
- `app/api/runs/` — run lifecycle: trigger, poll, webhook result, evidence
- `app/api/base-states/` — base state versioning
- `app/api/settings/` — providers + custom tests settings API
- `components/instances/*` — instance feature components
- `components/settings/*` — settings feature components
- `lib/db.ts` is the DB connection (lazy, SSL-aware)
- `lib/api.ts` contains all typed fetch helpers for the client
- `lib/run-orchestrator.ts` is the service layer for run creation (no business logic in routes)
- `lib/openclaw-runner.ts` dispatches tests to OpenClaw worker or mock loopback
- `lib/provider-catalog.ts` is the static source of truth for provider/model metadata
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
- v3: OpenClaw benchmark runtime (Phase 3a) + Settings page. Server-side run pipeline (trigger → poll → webhook), run evidence (logs, MD diffs), base state versioning, provider API key management, custom test library, filter toolbar redesign, help dialog.

## Upcoming Work (living list)

- [ ] Connect real OpenClaw worker (`OPENCLAW_WORKER_URL`)
- [ ] Base state admin UI (upload/activate MD files from dashboard)
- [ ] Real scoring evaluator (replace hash-based mock)
- [ ] Sticky filters on scroll
- [ ] Advanced filters collapse/expand on mobile
- [ ] Inline status transitions with loading states
- [ ] URL-synced filter state

---

We'll keep this doc updated as our source of implementation intent and constraints.
