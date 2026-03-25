# Architecture Overview

## Snapshot (updated: 2026-03-25)

A Next.js App Router app for running AI model benchmark instances against locked test packs, with full Postgres persistence via REST API routes.

## Actual Stack in Repo

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4 + `tw-animate-css`
- shadcn-style UI components built on `@base-ui/react`
- Postgres (Neon in prod, Docker locally) via `postgres` npm package
- Local deterministic mock runner (no live model API calls yet)

## Runtime Architecture

- `app/page.tsx` — orchestration center: fetches from API on mount, manages state, triggers runs
- `app/api/instances/route.ts` — GET (list) + POST (create)
- `app/api/instances/[id]/route.ts` — PATCH (update) + DELETE
- `lib/db.ts` — lazy Postgres connection, SSL-aware (skips SSL for localhost)
- `lib/api.ts` — typed fetch helpers used by the client
- `components/instances/*` — feature UI (card, filters, create dialog, results dialog)
- `lib/run-instance.ts` — sequential test execution, emits live `onUpdate` callbacks
- `lib/mock-model-runner.ts` — simulates latency/tokens/failures deterministically
- `lib/scoring.ts` — per-test and run-level score/speed/token aggregation
- `lib/test-packs.ts` — locked benchmark sets by `agentType`
- `lib/mock-instances.ts` — seed data for local development
- `scripts/seed.ts` — creates DB table and seeds mock instances

## Boundaries (current)

- Data persistence: Postgres (JSONB column stores full `TestInstance` JSON)
- Execution boundary: mock runner only (no live provider API)
- External boundary: Postgres only (Neon or Docker)

## Unclear or not yet defined

- No dedicated error taxonomy (only free-form `lastError` strings on instance)
- No run history — each run overwrites the instance record
- No auth layer (single-user tool)
