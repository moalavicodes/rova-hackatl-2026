# Rova project context

Stable facts and boundaries. Change this file only when a durable fact changes. Full detail lives in `README.md`.

## Product in one line

AI made answers instant, not learning. Rova coaches a 6th grader with a hint ladder, remembers what they understand, finds where a struggle started in earlier-grade skills, alerts the teacher and parent, and re-checks that the fix worked.

## Demo scope (weekend MVP)

- **Launch slice:** 6th-grade math, ratios (`6.RP.A.3`) and its prerequisites, for one student persona (Maya) and one teacher (Ms. Rivera). The parent's view is in Spanish.
- **One web app, three views:** Student, Teacher, Parent (phone-sized). It has to run on a Chromebook browser.
- **Working vs. simulated** (README section 8, changed by D-004): code math checks, the detection rules, root-cause trace, learner memory, alert *triggering*, and the re-check must actually work. Simulated and labeled on screen: all buddy replies, off-topic/unsafe handling, alert and parent message text (scripted, no AI model, D-004), the 25-student class, parent SMS delivery, the 7-day time jump, and Maya's earlier-grade history.

## Architecture (planned, not yet built)

- Next.js (App Router) + Tailwind. Deployed to Vercel or similar as one URL.
- **AI text:** scripted, no model is called (D-004). Every text-writing call goes through `callLLM` in `lib/llm.ts`, which returns the pre-written reply for the current demo step. A real model can be plugged in there later.
- **Data:** JSON seed files or SQLite. No external database.
- **Math checking:** a small expression and fraction evaluator in code (`check_answer`).
- **Detection rules run in code** (README section 17, "Detection rules"), so they are consistent and explainable.

## The loop

LEARN → DETECT → DIAGNOSE → ALERT → ACT → VERIFY. Text comes from the script (later an AI model). Code decides when things happen and whether an answer is correct.

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
