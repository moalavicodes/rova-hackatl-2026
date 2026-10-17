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
- [ ] A4 — Tutor turn (`app/api/tutor/`), following README section 17 "The agent": load profile → safety and scope screen → find source → choose next move → check math in code → short cited reply → log event
- [ ] A5 — Guardrails: "just tell me the answer" → kind refusal plus a guiding question; off-topic → "Great question for your teacher!" plus Send-to-teacher; unsafe → teacher; length cap
- [ ] A6 — Refresher screen: 3 prerequisite questions from the traced root cause, scored by `check_answer`
- [ ] A7 — Explain-it-back box, then the Win screen
- [ ] A8 — `eval/`: 60 in-scope, 20 off-topic, and 20 tricky prompts (plus the 20 math checks from A0). A runner script prints pass rates for `STATUS.md`

## Rules

- The LLM never decides whether an answer is correct.
- Never call `create_alert` yourself. Log events; B's rules decide.
- Use `callLLM` only, never a provider SDK directly.
