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
