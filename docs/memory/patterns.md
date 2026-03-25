# Recurring Patterns (observed)

## State orchestration pattern
- Single page-level source of truth (`instances`, `filters`) with prop drilling to feature components.

## Pure helper + orchestrator split
- Orchestration in `run-instance.ts`.
- Scoring/math isolated in `scoring.ts`.
- Execution adapter isolated in `mock-model-runner.ts`.

## Domain typing consistency
- Shared type definitions in `lib/types.ts` are used across UI and logic modules.

## Derived-data memoization
- `useMemo` used for status/model/agent sets, stats, and filtered/sorted data.

## UX safety guards
- Action buttons disabled while running.
- Status-driven action availability (`draft` vs `tested/failed`).

## Placeholder-first UI pattern
- Some controls are rendered before behavior is implemented (Edit, Bulk Action, Sync).
