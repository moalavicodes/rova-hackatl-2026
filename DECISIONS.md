# Rova decisions

Accepted tradeoffs only. Format is in `docs/AI_WORKFLOW.md`. Entries marked `proposed` come from the README and become `accepted` at the contract freeze.

## D-001 — Web app, not a phone app

- Date: 2026-10-17
- Status: proposed
- Decision: A responsive web app with Student, Teacher, and Parent views at one URL.
- Reason: Schools use Chromebooks, which run websites, and parents open links from texts (README section 17).
- Consequence: No app store build. The Parent view must look right at phone width.

## D-002 — Code decides correctness and timing; the LLM only writes

- Date: 2026-10-17
- Status: proposed
- Decision: Math checks, detection rules, prerequisite tracing, and verification are deterministic code. The LLM writes hints, alert text, and parent messages.
- Reason: Consistent, explainable, and testable (README sections 6 and 17).
- Consequence: `check_answer` and the rules engine need real unit tests. Prompts are never trusted to grade math.

## D-003 — Three workstreams with one integration owner

- Date: 2026-10-17
- Status: proposed
- Decision: Person A = student tutor and agent, Person B = data, rules, and integration owner, Person C = teacher and parent views. Only the integration owner edits shared contracts and `STATUS.md`.
- Reason: Three people, each paired with an AI agent, can work in parallel without editing the same files.
- Consequence: Contract changes go through Person B. Everyone builds against fixtures until upstream work lands.

## D-004 — Scripted demo: hard-coded inputs and responses, no live AI model

- Date: 2026-10-17
- Status: accepted (Person B, integration owner)
- Decision: For the prototype, the demo follows a fixed script. Maya's inputs are preset (tap-to-send choices or exact typed lines), and every buddy reply, alert text, and parent message is pre-written. No AI model is called. `lib/llm.ts` keeps the `callLLM` function but returns the scripted reply for the current step, so a real model can be swapped in later without changing callers.
- Reason: The demo runs the same way every time, with no API key, cost, or network risk, and the team can focus on the loop and the screens.
- Consequence: Tutor replies, off-topic/unsafe handling, alert text, and parent messages are Simulated and must be labeled that way on screen and in the pitch. Code still checks math answers, runs the detection rules, traces the root cause, and runs the re-check for real. The 120-question test set in README section 17 can't produce real AI accuracy numbers, so it is out of scope unless a real model is added. A judge typing their own question gets a fallback reply ("Great question for your teacher!").
