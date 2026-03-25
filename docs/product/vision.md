# Product Vision (as implemented)

This app is a manual model-testing dashboard to compare and re-run predefined benchmark packs against configured instances.

Current user job:
- Create an instance configuration
- Launch a manual run (Start/Rerun)
- See lifecycle state (`draft`/`running`/`tested`/`failed`)
- Inspect high-level run outcomes (score, speed, tokens, error state)

Deliberate scope in current code:
- local-only operation
- fast feedback loop
- architecture prepared for later provider integration
