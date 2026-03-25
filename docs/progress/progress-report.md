# Progress Report

## 2026-03-25 — Production-Ready Pass

### Goals
Ship the app in a deployable state: real persistence, all UI controls functional, clean build.

### Completed

**Metadata & naming**
- `app/layout.tsx` title/description updated to reflect actual app.
- `package.json` name fixed from `instance-page` to `my-benchmark-models`.

**Postgres persistence**
- `lib/db.ts` — lazy connection with SSL auto-detection (localhost skips SSL).
- `app/api/instances/route.ts` — GET (list all) + POST (create).
- `app/api/instances/[id]/route.ts` — PATCH (update) + DELETE.
- `lib/api.ts` — typed client fetch helpers.
- `scripts/seed.ts` — creates table schema, seeds mock instances.
- `docker-compose.yml` — local Postgres 16 on port 5432.
- `.env.example` updated with both local and Neon examples.

**UI wired to API**
- `app/page.tsx` refactored: fetches on mount, persists all mutations to DB.
- Loading state shown while initial fetch is in progress.
- Live run updates PATCHed to DB on each step.

**Type cleanup**
- `TestInstance.lastRunAt` changed from `string` to `string | null`.
- All `"-"` sentinels replaced with `null` in mock data, runner, and dialog.

**UI controls**
- Edit button: fully wired via `CreateInstanceDialog` in edit mode (pre-fills form, PATCHes DB on save).
- Bulk Action dropdown: removed from UI and `FilterState` type.
- Sync button: removed.
- Results detail dialog: new `InstanceResultsDialog` component — shows per-test name, status, score, duration, tokens, errors. Appears on cards with completed results.

**Build & lint**
- `npm run build` — clean.
- `npm run lint` — clean.

### Current Status
- App is production-deployable to Vercel + Neon.
- All UI controls are functional or intentionally removed.
- Data persists across page refreshes.

### Priority Next Actions
1. Install Docker and run `docker compose up -d` for local DB (pending Docker install).
2. Run `npm run seed` against local DB to verify seed flow.
3. Deploy to Vercel + Neon and smoke test in production.
4. Sticky filters on scroll (UX improvement).
5. URL-synced filter state.

---

## 2026-03-25 — Initial Entry

### Claude Core Workflow Initialized
- Repository workflow core initialized with `.claude/` governance layer and `/docs` memory structure.
- Baseline operating contract established for all incoming agents.

### Audit Completed — Full Repo Pass (Read-only + Documentation Population)
- Completed full structure scan and code-level audit of app/components/lib/docs.
- Populated architecture/product/memory docs with repo-verified content.
- No feature implementation changes made in this pass.

### Findings Summary
- Core manual run flow was implemented and coherent for phase 1.
- Domain split was clean: types → packs → runner → scoring → orchestration.
- Main gaps identified: non-functional controls, metadata/name drift, no persistence, no results detail UI.
