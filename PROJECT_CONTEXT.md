# Rova project context

Stable facts and boundaries. Change this file only when a durable fact changes. Full detail lives in `README.md`.

## Product in one line

AI made answers instant, not learning. Rova coaches a 6th grader with a hint ladder, remembers what they understand, finds where a struggle started in earlier-grade skills, alerts the teacher and parent, and re-checks that the fix worked.

## Demo scope (weekend MVP)

- **Launch slice:** 6th-grade math, ratios (`6.RP.A.3`) and its prerequisites, for one student persona (Maya) and one teacher (Ms. Rivera). The parent's view is in Spanish.
- **One web app, three views:** Student, Teacher, Parent (phone-sized). It has to run on a Chromebook browser.
- **Free-flowing, no AI model (D-004):** Maya types anything or taps quick replies, in any order. A rule-based responder answers from her input and state. Alerts, teacher views, and parent messages are built from the events she actually produced.
- **Working vs. simulated** (README section 8, changed by D-004): working in code: buddy replies (rule-based, labeled "rule-based (AI planned)"), off-topic/unsafe handling, math checks, detection rules, root-cause trace, learner memory, alerts, and the re-check. Simulated and labeled on screen: the 25-student class, parent SMS delivery, the 7-day time jump, and Maya's earlier-grade history.
- **Demo reliability:** the README section 8 demo path must work every time from a "Reset demo" state, and free exploration must never hit a dead end, a blank screen, or an error.

## Architecture (planned, not yet built)

- Next.js (App Router) + Tailwind. Deployed to Vercel or similar as one URL.
- **Replies without AI (D-004):** `lib/tutor/responder.ts` classifies each input with rules (answer, ask-for-answer, stuck, explain-back, off-topic, unsafe), then gets the text through `callLLM` in `lib/llm.ts`, which fills a template for now. A real model can be plugged in there later.
- **Data (D-005):** JSON seed files in the repo; live state in the browser, reset by "Reset demo". No database. Nothing writes files at runtime (Vercel, D-006).
- **Math checking:** a small expression and fraction evaluator in code (`check_answer`).
- **Detection rules run in code** (README section 17, "Detection rules"), so they are consistent and explainable.

## Commands

```bash
npm install      # once
npm run dev      # http://localhost:3000
npm run test     # vitest
npm run lint
npm run build
```

Stack as built: Next.js 16.3.8 (App Router, Turbopack), React 19.2, Tailwind 4, Vitest 4.1. Next.js 16 differs from older versions; its docs ship in `node_modules/next/dist/docs/`.

## The loop

LEARN → DETECT → DIAGNOSE → ALERT → ACT → VERIFY. Text comes from templates chosen by rules (later an AI model). Code decides when things happen and whether an answer is correct.

## Invariants (guardrails)

1. Never give the final answer before an attempt and the hint ladder (guiding question → picture/model → worked step).
2. Math correctness is decided by code only.
3. Every explanation cites a lesson section or standard. If confidence is low, don't answer; send the item to the teacher review queue.
4. Out-of-scope questions get "Great question for your teacher!" plus a Send-to-teacher action.
5. Every message passes a safety screen. Anything concerning goes to the teacher.
6. Replies are short, grade-level, and length-capped.
7. Memory stores learning facts only, with no emotional or personality profiling.
8. No real student data, no secrets in the repo. API keys go in `.env.local` only.

## Roles

See `CONTRIBUTING.md`. A = student tutor and agent, B = data, rules, and integration (owner), C = teacher and parent views.
