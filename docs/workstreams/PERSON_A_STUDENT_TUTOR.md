# Person A — Student tutor and agent

**Mission:** Maya's side of the demo (README section 8, steps 1–4). She sees her buddy, gets coached through a ratio problem with hints instead of answers, takes a root-cause refresher, solves the problem, and explains it back.

**Branch:** `feat/student-tutor`
**Owns:** `app/student/`, `components/student/`, `lib/tutor/`, `lib/math/`, `app/api/tutor/`, `content/`, `eval/`
**Consumes:** `get_learner_profile`, `log_event`, `trace_prerequisites` (Person B), `callLLM` (integration owner)
**Produces:** `Event`s, `check_answer`, `find_source`, `make_practice`

## Tasks

- [x] A0 — `lib/math/checkAnswer.ts`: exact ratio and fraction checking (equivalent forms accepted, e.g. `6/8` = `3/4`, `3:4`). Classify common errors into `error_type`, including `adds-across-ratio-table`. Unit tests (target 100% on 20 cases)
- [x] A1 — `content/`: lesson sections and standard text for the 5 demo skills; `find_source(skillId, question)`
- [x] A2 — Student home: buddy greeting that uses memory ("Fractions were tricky last time…"), Today's Mission card, skill map with progress rings
- [x] A3 — Problem screen: problem text, interactive ratio table or double number line, "I'm stuck", 3-step locked hint ladder, source tag
- [x] A4 — `lib/tutor/responder.ts` (D-004, no AI): `respond(input, ctx)` classifies typed input with rules into an `Intent`, checks answers with `check_answer`, picks the next move (hint level, refresher, explain-back), and gets text from `content/templates/` through `callLLM`. Free text box plus quick-reply buttons; Maya can type anything and change problems at any time
- [ ] A5 — Guardrails as rules: "just tell me the answer" → kind refusal plus a guiding question; unsafe keywords → flag the teacher; anything unrecognized → "Great question for your teacher!" plus Send-to-teacher. Several template variants per reply so it doesn't feel repetitive. Small label: "rule-based (AI planned)"
- [x] A6 — Refresher screen: 3 prerequisite questions from the traced root cause, scored by `check_answer`
- [x] A7 — Explain-it-back box (rule check for key ideas, e.g. "multiply both", "same ratio", "equivalent"; a gentle follow-up question if missing), then the Win screen
- [x] A8 — `eval/`: responder test set (typed input → expected intent and reply type), including misspellings, "just tell me", off-topic, and unsafe lines, plus the 20 math checks from A0. A runner prints pass rates for `STATUS.md`

## Integration handoff — 2026-10-17

- Student tutor events now go through `logEvents` in `lib/data/store.ts`; Person B's rules create and share alerts with the Teacher view.
- The student view reads Maya's profile from `useRovaState()` and `get_learner_profile`, so mastery and misconceptions match the shared store.
- After a repeated misconception creates or matches an active alert, the refresher uses that alert's traced root cause and asks three code-checked practice questions. Refresher events are also logged for the teacher's re-check flow.
- The student page still has a local reset button that resets both shared demo state and the chat. Remove that duplicate button and respond to Person B's forthcoming shared reset signal so the header reset also clears the local chat.
- Unsafe/off-topic guardrails still show the student a simulated teacher-review flag. Person B is adding `reportToTeacher` for safety and student-question reports; wire those two paths to it after the helper lands.
- The refresher selects only an active `repeated_misconception` learning alert, so a future safety/student-question report cannot be mistaken for its root-cause alert.
- Review fixes: seed imports use the merged seed module, the suggested explain-back reply completes the flow, fraction mistakes stay fraction-specific, hints match each ratio problem, and greetings come from response templates.

## Rules

- Correctness is always decided by `check_answer`.
- Never call `create_alert` yourself. Log events; B's rules decide.
- Get all reply text through `callLLM`, so a real model can be swapped in later.
- No dead ends: every input gets a reply, and every screen has a way back.
