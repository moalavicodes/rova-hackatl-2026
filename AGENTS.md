# Rova agent guidance

Rova is a three-person HackATL 2026 weekend project: a study buddy for 6th-grade math (ratios) that coaches with hints instead of answers, traces a struggle back to its root-cause skill, and loops in the teacher and parent. Protect the demo path: student gets stuck → hint ladder (math checked by code) → root-cause refresher → teacher alert → parent message → verified fix.

Use the `maintaining-rova-context` skill for material planning, implementation, debugging, review, or handoff work. Read only the documentation relevant to the task:

- `PROJECT_CONTEXT.md` for stable project facts and boundaries
- `STATUS.md` for current progress, blockers, and next actions
- `DECISIONS.md` for accepted tradeoffs
- `README.md` for the full product, pitch, and build spec (section 17 is the build spec)
- `CONTRIBUTING.md` to choose Person A, B, or C and follow ownership rules
- `docs/INTEGRATION_CONTRACTS.md` for the shared types and function signatures between roles
- `docs/TEAM_WORKFLOW.md` for checkpoint integration
- the selected file under `docs/workstreams/` for role-specific work
- `docs/AI_WORKFLOW.md` when updating shared context

Do not claim planned features are implemented. Math answers are always checked by code, never by the LLM. Label anything simulated as Simulated. Never commit API keys or real student data.

When a contributor identifies as Person A, B, or C, remain within that workstream's owned areas unless a coordinated shared-contract change is required. The integration owner (Person B by default) consolidates `STATUS.md` after merges.
