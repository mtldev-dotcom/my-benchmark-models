# Architecture Overview

## Snapshot (audit date: 2026-03-25)
This is a single-page Next.js App Router app for manually running model test instances in local state.

No backend, DB, scheduler, or provider SDK is connected.

## Actual Stack in Repo
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4 + `tw-animate-css`
- shadcn-style UI components built on `@base-ui/react`
- Local mock data + deterministic mock runner

## Runtime Architecture
- `app/page.tsx` is the orchestration center (state, filtering, run triggers, stats)
- `components/instances/*` render feature UI and user actions
- `lib/run-instance.ts` executes sequential test runs and emits live updates
- `lib/mock-model-runner.ts` simulates model execution latency/tokens/failures
- `lib/scoring.ts` computes per-test and run-level score/speed/token summaries
- `lib/test-packs.ts` holds locked benchmark sets by `agentType`
- `lib/mock-instances.ts` seeds local instance data

## Boundaries (current)
- Data persistence boundary: in-memory only (page state)
- Execution boundary: mock runner only
- External boundary: none (no API calls found in code)

## Unclear or not yet defined
- No dedicated error taxonomy (only free-form `lastError` strings)
- No explicit domain layer for instance CRUD beyond page component handlers
- No route-level API structure yet (`app/api/*` absent)
