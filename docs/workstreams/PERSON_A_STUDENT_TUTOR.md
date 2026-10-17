# Person A — Student tutor and agent

**Mission:** Maya's side of the demo (README section 8, steps 1–4). She sees her buddy, gets coached through a ratio problem with hints instead of answers, takes a root-cause refresher, solves the problem, and explains it back.

**Branch:** `feat/student-tutor`
**Owns:** `app/student/`, `components/student/`, `lib/tutor/`, `lib/math/`, `app/api/tutor/`, `content/`, `eval/`
**Consumes:** `get_learner_profile`, `log_event`, `trace_prerequisites` (Person B), `callLLM` (integration owner)
**Produces:** `Event`s, `check_answer`, `find_source`, `make_practice`

## Tasks

- [ ] A0 — `lib/math/checkAnswer.ts`: exact ratio and fraction checking (equivalent forms accepted, e.g. `6/8` = `3/4`, `3:4`). Classify common errors into `error_type`, including `adds-across-ratio-table`. Unit tests (target 100% on 20 cases)
- [ ] A1 — `content/`: lesson sections and standard text for the 5 demo skills; `find_source(skillId, question)`
- [ ] A2 — Student home: buddy greeting that uses memory ("Fractions were tricky last time…"), Today's Mission card, skill map with progress rings
- [ ] A3 — Problem screen: problem text, interactive ratio table or double number line, "I'm stuck", 3-step locked hint ladder, source tag
- [ ] A4 — `lib/tutor/responder.ts` (D-004, no AI): `respond(input, ctx)` classifies typed input with rules into an `Intent`, checks answers with `check_answer`, picks the next move (hint level, refresher, explain-back), and gets text from `content/templates/` through `callLLM`. Free text box plus quick-reply buttons; Maya can type anything and change problems at any time
- [ ] A5 — Guardrails as rules: "just tell me the answer" → kind refusal plus a guiding question; unsafe keywords → flag the teacher; anything unrecognized → "Great question for your teacher!" plus Send-to-teacher. Several template variants per reply so it doesn't feel repetitive. Small label: "rule-based (AI planned)"
- [ ] A6 — Refresher screen: 3 prerequisite questions from the traced root cause, scored by `check_answer`
- [ ] A7 — Explain-it-back box (rule check for key ideas, e.g. "multiply both", "same ratio", "equivalent"; a gentle follow-up question if missing), then the Win screen
- [ ] A8 — `eval/`: responder test set (typed input → expected intent and reply type), including misspellings, "just tell me", off-topic, and unsafe lines, plus the 20 math checks from A0. A runner prints pass rates for `STATUS.md`

## Connecting to the store (after PR #4 merges)

- After each tutor reply, call `logEvents(reply.events)` from `@/lib/data/store`. It runs the detection rules and creates the teacher alert.
- Read Maya's profile with `get_learner_profile(useRovaState(), "maya")` (`@/lib/rules/engine`, `@/lib/data/store`) instead of keeping a separate copy, so misconceptions and mastery match what the teacher sees.
- The student "Reset demo" should also call `resetDemo()` (the header button already does).

## Rules

- Correctness is always decided by `check_answer`.
- Never call `create_alert` yourself. Log events; B's rules decide.
- Get all reply text through `callLLM`, so a real model can be swapped in later.
- No dead ends: every input gets a reply, and every screen has a way back.
