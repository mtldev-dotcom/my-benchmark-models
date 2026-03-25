# CLAUDE.md

Working conventions for this project.

## Mission

Build a high-quality, minimal **Instance Page** for AI model testing workflows.

## Non-Negotiables

- Next.js App Router + TypeScript
- shadcn/ui + Tailwind
- Default black/white style only
- Mobile-first UX
- No backend (local mock state only)
- No branding or custom visual identity

## Design Direction

- Clean dashboard feel
- Strong hierarchy and spacing
- Compact, scannable cards
- Practical controls over visual noise

## Component Boundaries

- `app/page.tsx` orchestrates state and layout
- `components/instances/*` contains feature components
- `lib/mock-instances.ts` is source of demo data/types
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
3. Run lint
4. Note what changed in README
5. Queue next iteration checklist

## Change Log (starter)

- v0: Initial Instances page scaffold with cards, filters, create dialog, and mock data.
- v1: Header/control UX polish for better mobile scanning.

## Upcoming Work (living list)

- [ ] Bulk action behavior with selected cards
- [ ] Sticky filters on scroll
- [ ] Advanced filters collapse/expand on mobile
- [ ] Inline status transitions with loading states
- [ ] Better empty and no-result affordances

---

We’ll keep this doc updated as our source of implementation intent and constraints.
