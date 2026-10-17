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

## D-004 — No AI model for now: a free-flowing app driven by rules in code

- Date: 2026-10-17
- Status: accepted (Person B, integration owner)
- Decision: The prototype calls no AI model. It is still a free-flowing app, not a fixed script: Maya can type anything or tap quick-reply buttons, solve problems in any order, and move freely between screens. A rule-based responder (`lib/tutor/responder.ts`) decides each reply from what she typed and her current state: numeric answers go through `check_answer` and get a reply for that exact mistake type; "just tell me" gets a refusal plus a guiding question; "stuck", "help", "idk" open the next hint; an explain-back is checked for key ideas; unsafe words flag the teacher; anything else gets "Great question for your teacher!". Replies come from a bank of pre-written templates (several variants each), filled with her name, buddy name, and interests. Alerts, the teacher views, and parent messages are built from the real events she produced, not canned screens. All text still goes through `callLLM` in `lib/llm.ts` (templates for now), so a real model can be swapped in later without changing callers.
- Reason: The app runs the same way every time, with no API key, cost, or network risk, but judges can still use it freely and it never hits a dead end.
- Consequence: Tutor replies are real but rule-based, so on screen and in the pitch they are labeled "rule-based (AI planned)", never called AI. Off-script inputs work only as well as the rules: anything unrecognized falls back to the teacher redirect. The 120-question AI test set in README section 17 is replaced by a responder test set (typed inputs → expected reply type) and the math-check tests. A "Reset demo" control restores the seeded state so the README section 8 demo path can be rerun any time.
