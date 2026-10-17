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
  - PR #3: Person C's teacher and parent views on the shared seed.
  - PR #5: B2 to B8. Browser store (`lib/data/store.ts`), root-cause trace, detection rules, the alert loop (`lib/rules/engine.ts`), live Teacher and Parent views, and Reset demo in every header.
  - PR #4: Person A's student tutor. Rule-based responder, exact math checker, hint ladder, fraction refresher, explain-it-back, win screen; 27-case responder test set.
  - PR #7: Person A connected the student view to the store. The full demo works live: Student → alert → Teacher → re-check → Parent (checked in Chrome).
- **In progress (branch `feat/teacher-reports`):**
  - `reportToTeacher` for safety concerns and student questions: new alert signals `safety_concern` and `student_question`; safety concerns go to the top of the inbox; Done closes them with no re-check and no parent message.
  - `onDemoReset` reset signal, so the header Reset also clears the student chat (`RovaState.session`).
  - Rules fix: only mistakes after an alert is resolved count (cut-off = `resolved_after_event`, an event count, since the re-check uses a simulated date), and misconceptions are cleared when an alert is verified. Saved state from before sessions existed gets one, so cross-tab reset still fires. Both from the PR #8 review.
- **Not built (cut):** drop and disengagement rules, review queue (C6).
- **Blocked:** none.
- **Decided:** demo's group of 5 shown as `others_with_gap` on Maya's alert, class-gap rule stays at 30% (D-007); buddy name stays "Rova" for now; data in JSON seed files with live state in the browser (D-005); hosting on Vercel (D-006); no AI model for now; free-flowing app with a rule-based responder and templates (D-004).

## Open questions

1. Who owns the Vercel account?
2. Who is the demo operator and the Q&A router?
3. Maya's interests (shape her practice problems)?

## Next actions

1. Merge `feat/teacher-reports`. Then Person A calls `reportToTeacher` for unsafe messages and "Send to my teacher", listens to `onDemoReset`, and removes the student-page Reset button (steps in `docs/workstreams/PERSON_A_STUDENT_TUTOR.md`, "Next steps").
2. Demo acceptance check (`docs/TEAM_WORKFLOW.md`) on one laptop: Student → Teacher → Parent, 3 runs from Reset demo, then 5 minutes of free use.
3. Person B: deploy to Vercel (B9) once the Vercel owner is decided.

## Verification

- 2026-10-17 PR #8 review fixes: 138/138 tests (new: in-cycle mistake + one post-resolution mistake doesn't re-alert; simulated far-future re-check doesn't hide later mistakes; legacy saved state still triggers a cross-tab reset; same-tab reset and unsubscribe), tsc, lint, and build clean.

- 2026-10-17 `feat/teacher-reports` with `main` (PR #7) merged in: 134/134 tests (4 new: misconceptions cleared on verify, no re-alert on one new mistake, re-alert on two, session seed), tsc, lint, and build clean.

- 2026-10-17 on `feat/teacher-reports`: 130/130 tests (4 new report tests), tsc, lint, and build clean. Chrome: a safety concern, a question, and Maya's learning alert in the inbox; safety listed first without root cause; Done → Closed, count dropped, no parent message, loop tracker still followed the learning alert.

- 2026-10-17 `main` after PR #4 (2cdbf0d): `npm run test` 126/126 pass, `tsc --noEmit`, lint, and build clean. Before merge, the student path was checked in Chrome on PR #4 combined with PR #5: refusal → two `9`s → refresher → `12` → explain-it-back → Win.

- 2026-10-17 on `feat/data-rules`: `npm run test` 46/46 pass (new: trace, detection rules, and engine tests covering the full loop: alert → Done → Spanish parent activity → re-check → verified + win; and escalation when the re-check comes too early). `tsc --noEmit`, `npm run lint`, and `npm run build` are clean.
- 2026-10-17 browser check (production build, Chrome): with Maya's session loaded into browser storage, the Teacher view showed the live alert (root cause Equivalent fractions, 5 students share); Done → "Waiting for re-check"; fast-forward → "Mastered ✓ · parent notified"; the Parent view showed the Spanish activity and win messages; Reset demo cleared alerts, events, and messages. Not yet checked from the real Student view (needs PR #4 plus the student wiring).
- 2026-10-17 `main` after PR #3: 24/24 tests pass, build succeeds.

- 2026-10-17 (B0, now on `main`): `npm run test` 5/5 pass (`lib/llm.test.ts`), `npm run lint` clean, `npm run build` succeeds. `npm run dev`: `/`, `/student`, `/teacher`, `/parent` return 200; unknown path returns 404.
- `npm audit`: 5 high-severity advisories, all in the lint toolchain (`braces` via `eslint-config-next`), not in the app itself. The suggested fix downgrades Next's lint config, so it's left as is.
