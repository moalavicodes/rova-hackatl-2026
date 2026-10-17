# Rova status

The integration owner consolidates this file after merges. During feature work, put progress in your PR or role handoff, not here.

## Role assignment

| Role | Person | GitHub | Branch |
| --- | --- | --- | --- |
| Person A — Student tutor and agent | Suvrat | suvrat23 | `feat/student-tutor` |
| Person B — Data, rules, and integration (owner) | Mohammad | moalavicodes | `feat/data-rules` |
| Person C — Teacher and parent views | Madhur | Madhur20 | `feat/adult-views` |

## Current state

- **Completed (on `main`):**
  - PR #1: B0 app skeleton (Next.js + Tailwind, `lib/types.ts`, `callLLM` template mode, home view switcher).
  - PR #2: B1 seed data, class of 25 in `lib/data/seed/*.json` (5 share the `4.NF.A.1` gap), plus D-005 to D-007.
  - PR #3: Person C's teacher and parent views on the shared seed (alert card, five-skill heatmap, loop tracker, Spanish parent messages).
- **Completed (branch `feat/data-rules`, not merged yet):** B2 to B8 and the adult-view wiring Person C asked for.
  - `lib/rules/`: root-cause trace, detection rules (stuck, answer-seeking, repeated misconception, class gap), and `engine.ts` with `log_event`, `create_alert`, `apply_teacher_action`, `schedule_recheck`, and `run_recheck`.
  - `lib/data/store.ts`: browser store with tab sync and `resetDemo`.
  - The Teacher and Parent views read live data. Done / Snooze / Different strategy work, and the 7-day fast-forward runs the re-check. "Reset demo" is on every page.
- **In progress:** PR #4 (Person A, student tutor). Needs the review fixes before merge (see Next actions).
- **Not built (cut):** drop and disengagement rules, review queue (C6).
- **Blocked:** none.
- **Decided:** demo's group of 5 shown as `others_with_gap` on Maya's alert, class-gap rule stays at 30% (D-007); buddy name stays "Rova" for now; data in JSON seed files with live state in the browser (D-005); hosting on Vercel (D-006); no AI model for now; free-flowing app with a rule-based responder and templates (D-004).

## Open questions

1. Who owns the Vercel account?
2. Who is the demo operator and the Q&A router?
3. Maya's interests (shape her practice problems)?

## Next actions

1. Merge `feat/data-rules` (B2 to B8 plus wiring).
2. Person A fixes PR #4: `git pull origin main`; import `skillMap` from `@/lib/data/seed` (the old `@/lib/data/skillMap` is gone and breaks the build); make the explain-it-back quick reply a complete explanation; fill in the PR description; limit the ratio-error classifier to `6.RP` problems.
3. Person A connects the student view to the store: call `logEvents(reply.events)` from `@/lib/data/store` after each tutor reply, read Maya's profile from `get_learner_profile(useRovaState(), "maya")` instead of local state, and make the student "Reset demo" also call `resetDemo()`. Then Maya's real mistakes create the teacher alert.
4. Demo acceptance check (`docs/TEAM_WORKFLOW.md`) on one laptop: Student → Teacher → Parent.
5. Person B: deploy to Vercel (B9) once the Vercel owner is decided.

## Verification

- 2026-10-17 on `feat/data-rules`: `npm run test` 46/46 pass (new: trace, detection rules, and engine tests covering the full loop: alert → Done → Spanish parent activity → re-check → verified + win; and escalation when the re-check comes too early). `tsc --noEmit`, `npm run lint`, and `npm run build` are clean.
- 2026-10-17 browser check (production build, Chrome): with Maya's session loaded into browser storage, the Teacher view showed the live alert (root cause Equivalent fractions, 5 students share); Done → "Waiting for re-check"; fast-forward → "Mastered ✓ · parent notified"; the Parent view showed the Spanish activity and win messages; Reset demo cleared alerts, events, and messages. Not yet checked from the real Student view (needs PR #4 plus the student wiring).
- 2026-10-17 `main` after PR #3: 24/24 tests pass, build succeeds.

- 2026-10-17 (B0, now on `main`): `npm run test` 5/5 pass (`lib/llm.test.ts`), `npm run lint` clean, `npm run build` succeeds. `npm run dev`: `/`, `/student`, `/teacher`, `/parent` return 200; unknown path returns 404.
- `npm audit`: 5 high-severity advisories, all in the lint toolchain (`braces` via `eslint-config-next`), not in the app itself. The suggested fix downgrades Next's lint config, so it's left as is.
