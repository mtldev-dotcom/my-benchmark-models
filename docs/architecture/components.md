# Components & Modules

## App Shell
- `app/layout.tsx`
  - Global HTML/body shell, Geist fonts, metadata.
  - Metadata is still default scaffold text.
- `app/globals.css`
  - Tailwind + design tokens (light/dark variables), global base styles.

## Page Orchestrator
- `app/page.tsx`
  - Owns `instances` and `filters` state.
  - Computes derived stats (total/running/tested/failed).
  - Filters/sorts data in-memory.
  - Triggers run lifecycle via `runInstance()`.

## Feature Components (`components/instances`)
- `create-instance-dialog.tsx`
  - Creates new instance objects in local state.
  - Maps agent type to locked test-pack label.
- `instance-filters.tsx`
  - Search + filter + sort controls.
  - Includes non-functional placeholders: `bulkAction`, `Sync` button.
- `instance-card.tsx`
  - Displays instance summary.
  - Exposes Start/Rerun/Delete actions.
  - Shows error banner when status is `failed` and `lastError` exists.

## UI Primitives (`components/ui`)
- `button`, `card`, `badge`, `input`, `textarea`, `select`, `dialog`
- These are reusable presentational primitives; no business logic.

## Domain / Logic Modules (`lib`)
- `types.ts`
  - Core domain types (`TestInstance`, `TestResult`, `TestPack`, statuses).
- `mock-instances.ts`
  - Seed dataset for initial page state.
- `test-packs.ts`
  - Locked tests for `operator`, `engineer`, `content`.
- `mock-model-runner.ts`
  - Async deterministic mock execution with controlled failure probability.
- `scoring.ts`
  - Per-test score generation and run aggregation.
- `run-instance.ts`
  - Sequential executor + lifecycle transitions + incremental `onUpdate`.
- `utils.ts`
  - `cn()` class merge helper.
