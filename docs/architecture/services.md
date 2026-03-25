# Services

## External Services (currently used)
None in runtime logic.

- No HTTP clients found in app code.
- No provider SDK integration found.
- No database adapter found.

## Internal Service-Like Modules
- `lib/run-instance.ts`
  - Orchestration service for run lifecycle.
- `lib/mock-model-runner.ts`
  - Execution adapter stub (future swap point for real providers).
- `lib/scoring.ts`
  - Evaluation/aggregation service.
- `lib/test-packs.ts`
  - Static benchmark definition service.

## Tooling Services
- ESLint (via `npm run lint`)
- Next build/runtime (`npm run build`, `npm run dev`)

## Missing service layer (expected in future phases)
- Backend persistence service (runs, history, instance CRUD)
- Real provider execution adapters (OpenAI/Anthropic/etc.)
- Scheduling/automation service
