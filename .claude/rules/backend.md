# Backend Rules (Future-safe for phase 2+)

- Use service-layer architecture (no business logic in routes)
- Validate all inputs at boundaries
- Centralize error handling and logging
- Keep provider adapters isolated for swapability
- No database writes/migrations without explicit approval in this phase
