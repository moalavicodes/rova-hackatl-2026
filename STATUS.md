# Rova status

The integration owner consolidates this file after merges. During feature work, put progress in your PR or role handoff, not here.

## Role assignment

| Role | Person | GitHub | Branch |
| --- | --- | --- | --- |
| Person A — Student tutor and agent | _unclaimed_ | | `feat/student-tutor` |
| Person B — Data, rules, and integration (owner) | _unclaimed_ | | `feat/data-rules` |
| Person C — Teacher and parent views | _unclaimed_ | | `feat/adult-views` |

## Current state

- **Completed:** repository created with the README and the shared AI context files. No application code yet.
- **In progress:** none.
- **Blocked:** none.

## Open questions (settle at the contract freeze)

1. Which LLM provider and model? (README: whichever the team has credits for.)
2. JSON files or SQLite for data?
3. Deploy host (Vercel assumed) and who owns the deploy account?
4. Who is the demo operator and the Q&A router?
5. Do all three agree on the draft contracts in `docs/INTEGRATION_CONTRACTS.md`?

## Next actions

1. Claim roles and fill in the table above.
2. Contract freeze (30 minutes, all three people together); see `docs/TEAM_WORKFLOW.md`.
3. Person B initializes the Next.js app and commits `lib/types.ts` from the frozen contracts.
4. Everyone branches from `main` and builds against fixtures.

## Verification

- Build/test: unavailable (the app has not been initialized).
