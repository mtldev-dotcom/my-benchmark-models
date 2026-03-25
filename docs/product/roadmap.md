# Suggested Roadmap (based on current gaps)

## P0 — Stabilize current phase
1. Align naming/branding:
   - `package.json` still says `instance-page`
   - layout metadata still default scaffold text
2. Implement or remove placeholder controls:
   - `Edit` action
   - `Bulk Action` selector behavior
   - `Sync` button behavior
3. Add result inspection UI:
   - per-test run details view (drawer/modal)

## P1 — Persistence + reproducibility
1. Add local persistence (e.g., localStorage) to avoid losing state on refresh.
2. Add run history model (current implementation keeps only latest in-memory snapshot).
3. Add deterministic run seed visibility for debugging/demo repeatability.

## P2 — Service expansion
1. Introduce provider adapter interface and real SDK implementations.
2. Add backend API and storage for instances/results.
3. Add execution queue/scheduler for automated runs.

## P3 — Product maturity
1. Comparative analytics across runs/models.
2. Team/multi-user support and audit trail.
3. Export/reporting surface.
