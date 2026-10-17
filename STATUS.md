# Rova status

The integration owner consolidates this file after merges. During feature work, put progress in your PR or role handoff, not here.

## Role assignment

| Role | Person | GitHub | Branch |
| --- | --- | --- | --- |
| Person A — Student tutor and agent | Suvrat | suvrat23 | `feat/student-tutor` |
| Person B — Data, rules, and integration (owner) | Mohammad | moalavicodes | `feat/data-rules` |
| Person C — Teacher and parent views | Madhur | Madhur20 | `feat/adult-views` |

## Current state

- **Completed:** roles assigned 2026-10-17 (all three are repo collaborators); repository created with the README and the shared AI context files. No application code yet.
- **In progress:** none.
- **Blocked:** none.
- **Decided:** scripted demo with hard-coded inputs and responses, no AI model (D-004, 2026-10-17).

## Open questions (settle at the contract freeze)

1. JSON files or SQLite for data?
2. Deploy host (Vercel assumed) and who owns the deploy account?
3. Who is the demo operator and the Q&A router?
4. Do all three agree on the draft contracts in `docs/INTEGRATION_CONTRACTS.md`?

## Next actions

1. Contract freeze (30 minutes, all three people together); see `docs/TEAM_WORKFLOW.md`.
2. Person B (Mohammad) initializes the Next.js app and commits `lib/types.ts` from the frozen contracts.
3. Everyone branches from `main` and builds against fixtures.

## Verification

- Build/test: unavailable (the app has not been initialized).
