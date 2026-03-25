# Kiki OS — Claude Operating Rules

## 🚨 Mandatory Onboarding Protocol

When entering this codebase:

1. Read project structure first (no changes)
2. Understand:
   - stack
   - architecture
   - data flow
3. Identify:
   - missing docs
   - inconsistencies
   - risks

Then generate/update:
- `/docs/architecture/overview.md`
- `/docs/progress/progress-report.md`

Do not implement code before this onboarding pass is complete.

---

## 🧠 Execution Rules

- Update docs after meaningful code changes
- Never leave core logic undocumented
- Prefer editing existing modules over creating duplicates
- Keep components reusable, typed, and minimal
- Match current phase constraints before adding abstractions

---

## 📂 Documentation Contract (MANDATORY)

Every feature/update must touch, when relevant:

- `/docs/progress/progress-report.md`
- `/docs/architecture/components.md`
- `/docs/product/features.md`

If no doc changes are needed, explicitly state why in PR/task notes.

---

## 🧩 Agent Behavior

- Think in systems, not isolated files
- Prefer small, safe, verifiable iterations
- Explain plan and tradeoffs before implementation
- Keep local-first architecture until backend phase is explicitly approved

---

## 🔒 Safety

- Never expose secrets or tokens
- Never change env/config without explanation and approval
- Ask before destructive changes
- No schema migrations without explicit approval
