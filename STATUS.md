# Rova status

The integration owner consolidates this file after merges. During feature work, put progress in your PR or role handoff, not here.

## Role assignment

| Role | Person | GitHub | Branch |
| --- | --- | --- | --- |
| Person A — Student tutor and agent | Suvrat | suvrat23 | `feat/student-tutor` |
| Person B — Data, rules, and integration (owner) | Mohammad | moalavicodes | `feat/data-rules` |
| Person C — Teacher and parent views | Madhur | Madhur20 | `feat/adult-views` |

## Current state

- **Completed:** B0 app skeleton (2026-10-17, branch `feat/data-rules`): Next.js + Tailwind, shared types in `lib/types.ts`, `callLLM` template mode in `lib/llm.ts`, skill map and Maya seed in `lib/data/`, home page with links to placeholder Student / Teacher / Parent pages, empty template files for A (`content/templates/`) and C (`lib/messages/templates.ts`). Roles assigned 2026-10-17 (all three are repo collaborators); repository created with the README and the shared AI context files. No application code yet.
- **In progress:** none.
- **Blocked:** none.
- **Decided:** no AI model for now; free-flowing app with a rule-based responder and templates (D-004, 2026-10-17).

## Open questions (settle at the contract freeze)

1. JSON files or SQLite for data?
2. Deploy host (Vercel assumed) and who owns the deploy account?
3. Who is the demo operator and the Q&A router?
4. Do all three agree on the draft contracts in `docs/INTEGRATION_CONTRACTS.md`?

## Next actions

1. Contract freeze (30 minutes, all three people together); see `docs/TEAM_WORKFLOW.md`.
2. Merge the B0 skeleton to `main`. If the contract freeze changes anything, Person B updates `lib/types.ts`.
3. Suvrat and Madhur branch from `main` (`git pull`, `npm install`) and build against fixtures.
4. Person B: finish B1 (simulated class of 25), then B2–B4.

## Verification

- 2026-10-17 on `feat/data-rules`: `npm run test` 5/5 pass (`lib/llm.test.ts`), `npm run lint` clean, `npm run build` succeeds. `npm run dev`: `/`, `/student`, `/teacher`, `/parent` return 200; unknown path returns 404.
- `npm audit`: 5 high-severity advisories, all in the lint toolchain (`braces` via `eslint-config-next`), not in the app itself. The suggested fix downgrades Next's lint config, so it's left as is.
