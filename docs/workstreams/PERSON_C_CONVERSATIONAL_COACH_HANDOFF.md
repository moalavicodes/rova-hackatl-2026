# Conversational coaching and shared lessons

Date: 2026-10-17

## Role and scope

Person C. The user explicitly requested restoring student coaching, connecting group assignments and teacher evidence, increasing readability, replacing the heatmap, and fixing the sidebar. This spans the new `components/product/`, `lib/product/`, and account/learning API architecture introduced by `3439f5a`. The legacy `lib/types.ts`, tutor, browser store, rules engine, and integration contract file are unchanged. Person B should consolidate `STATUS.md` after merge.

## Outcome

- Student practice now includes a saved, conversational scripted coach across all six fourth-grade topics. Students can type questions, answers, and reasoning, or use suggested replies. The fractions script includes equivalent-fraction concepts and responses to adding instead of scaling.
- Direct-answer and prompt-override requests are redirected. Hints progress from a guiding question toward a worked step; the final worked hint requires an actual attempt. Numeric answers, including simple conversational forms such as “I think two fourths,” use the existing deterministic math checker. Concept questions containing numbers are not graded as attempts.
- Safety concerns are flagged in the saved conversation and surfaced to the teacher. Other unrecognized questions redirect to teacher support. Every coach message references the topic standard. The visible disclosure is “Scripted coach · AI model planned”; no LLM or key is used.
- Teachers select a topic and group members. Assigned learners receive the lesson prominently on their dashboards. In-progress sessions resume; completed assignments remain available for conversation review.
- Completion is derived from checked answers to all three assigned questions for each learner. Earlier unassigned practice cannot complete an assignment. The group completes only when every member finishes. The teacher’s old manual “Mark complete” shortcut no longer overrides learning evidence.
- Teachers see each learner’s status, attempts, coaching nudges, redirects, and full transcript. Learner cards and stacked topic summaries replace the numeric heatmap.
- A classroom outcomes graph shows questions solved independently, solved after support/retry, and still being practiced. It counts each learner/question/session once and retains corrections after earlier mistakes. Seeded historical attempts are excluded. This is observed progress, not a causal claim about AI effectiveness or proof of durable mastery.
- Desktop navigation collapses to icons; mobile navigation opens/closes and closes on Escape. Font sizes, input sizes, and text contrast are increased. Homepage copy now surfaces conversational coaching.

## Product API/model additions

- `Workspace.sessions?`: optional for existing JSON files. Each session records student, topic, optional plan, question index, transcript, start time, and completion time.
- `Attempt.sessionId?` and `Attempt.planId?` tie checked practice to the actual lesson.
- `/api/learning`: student-only `coach-start`, `coach-turn`, and `coach-next` actions. Start validates assignment membership; turn/next validate session ownership. Turn IDs make repeated submissions idempotent. The server chooses the question, grades answers, counts support, and derives completion; client correctness and hint claims are ignored by coaching actions.
- Existing response gains `session?`. Teacher responses contain class evidence; student responses contain only their own sessions/attempts and assigned plans; parent responses contain their child’s progress but no coaching transcripts.
- No new dependencies.

## Verification

- Node 24: Vitest, 20 files and 164 tests passed, including new coaching, API authorization/completion, and transcript visibility tests.
- TypeScript, ESLint, and `git diff --check` passed.
- Production webpack build passed.
- Chrome, production server with isolated data at `/tmp/rova-coaching-check-data`: teacher shared a fractions lesson with seven learners; Maya saw the assignment; a direct-answer request was redirected; `3` received misconception feedback; a concept question received an explanation; `2`, `4`, and `9` completed the lesson. Student status became Completed (3/3). Teacher graph showed two independent successes and one corrected after support. Learning plans showed Maya completed, the other six not started, and the saved transcript available.

## Suggested presentation sequence

1. Teacher: Build a small-group lesson → Fractions → Share. Keep Maya in the group.
2. Student: Start my lesson → Start our conversation.
3. Type “Just tell me the answer,” then “3,” then “Why does this work?” Notice the refusal, specific feedback, and concept explanation.
4. Type “2,” continue, then “4,” continue, then “9.” Optionally explain the reasoning in your own words before continuing.
5. Teacher: Overview/Learning insights → classroom graph. Learning plans → Maya Completed → Read conversation.
6. Send a family update from Maya’s learning story; the parent account sees the note and updated practice progress.

## Integration notes and limits

### PR #15 review fixes (2026-10-17)

- Safety matching now covers the reported “I want to die” and “nobody likes me and I want to disappear” inputs, additional first-person distress/abuse phrases, and curly apostrophes. It runs before academic intent. Ordinary math language and frustration have negative regression cases. This remains a limited deterministic safeguard, not a comprehensive safety classifier.
- The existing teacher concern banner is now explicitly labeled **Safety concern**, placed before the greeting on every teacher section, and opens the flagged lesson directly on its conversation tab. Exact flagged student messages are repeated at the top of the review so long transcripts cannot bury them. Existing role-scoped transcript access is unchanged.
- The child is told the concern is saved in Rova and the teacher may not see it right away; they are directed to a trusted adult now. No email, text, emergency response, acknowledgment, or resolution workflow is claimed. Opening a review does not remove the flag.
- Greetings use an encouragement-only response without math hints. Generic and answer-request redirects do not count as mathematical help and no longer include a hidden hint; actual hints, retries, and explanations still count. Historical saved attempts are not rewritten.
- Answer requests now include missing-apostrophe “whats the answer” and “answer pls/plz.” Math grading and completion still use code only.

### Pitch follow-up — proposed, not implemented

The review correctly identifies a gap between the original venture story and the current D-009 app. This patch does not reverse the accepted grade-4 product decision or pretend lesson completion verifies a lasting fix. The next coordinated increment should connect one visible loop: ratio struggle → prerequisite fractions refresher → teacher shared-gap alert → Spanish family activity → delayed checked re-assessment. Any seeded trigger, time jump, or delivery must be labeled Simulated. Person B must agree the event/state adapter before new screens depend on it; reuse the existing tested rules instead of maintaining a second alert engine.

Before a public presentation, the team must also choose deployment-compatible storage, add a safe rehearsal reset, reconcile child accounts/privacy claims, and align the venture script with capabilities actually on screen. A hosted model or principal report is separate scope. Funding amounts, traction, interview findings, and accuracy results require human evidence; do not fabricate them.

### Modal review and messaging layout follow-up

- Teacher lesson rows now show a compact **Review lesson** action. It opens a native modal with separate **Lesson summary** and **Conversation** tabs; full summaries and chat histories no longer expand inside the classroom list. Reviews opened from an individual learner dialog also get their own modal. Dialog headings use unique IDs for nested accessibility.
- Student practice now uses a single tall messaging interface: compact pinned question, optional visual guide, left/right message bubbles, inline timestamps/references, and a fixed bottom composer. All saved messages remain in one continuous scrollable thread; the previous ten-message cutoff and two-column/focus modes are removed.
- Enter sends, Shift+Enter adds a line break, and sending follows the latest message. Reading earlier messages does not trigger a jump back down during ordinary rendering. Question separators preserve the context across the lesson.
- Verification: 173 existing tests pass, TypeScript/lint and webpack build pass. Chrome verified the standalone review dialog, both tabs, returning to the lesson list, and a saved 15-message student conversation with all messages retained.

### Follow-up UI refinements (2026-10-17)

- Search and filter have equal widths and 48px heights; mobile layouts stack them at equal full widths.
- Student strengths are paired with “Your next breakthroughs,” ranked from actual topic confidence with direct practice actions.
- Chat shows a recent five-exchange window, optional earlier history, more vertical space, compact bubbles, and a full-width focus mode. All six topics have question-specific code-drawn models, and a “Show me a picture” reply embeds a model in chat. These are HTML/SVG visuals rather than generated images.
- Sidebar links now use explicit per-role URL fragments with active state, distinct page headings, browser history/reload support, and focus/scroll reset. Daily assignment panels no longer cover the progress destination.
- Completed parent activities rotate to the next unfinished activity. Completed work is retained in a collapsible history; finishing all six topics gives an all-caught-up state.
- Student transcript text explicitly uses high-contrast white on dark green, including inside teacher lesson cards.
- An evidence-derived scripted “AI summary preview” appears above each conversation, covering outcomes, the learning challenge, support, learner quotes, and a teacher next step. No live model is called and no outcomes are invented.
- James Walker is the simulated learner with support needs in all six topics. The teacher sees a priority banner and highlighted first card. An upgrade only changes the previous untouched seed profile; renamed, edited, or practiced profiles are preserved.
- The presentation script is in `docs/DEMO_SCRIPT.md`.
- Verification: 173 tests passed; TypeScript, lint, and the production webpack build passed. Chrome verified teacher/student/parent destinations, matching controls, James’s priority signal, teacher summary/transcript contrast, visual chat/focus mode, and the parent checklist advancing to the next activity with completed history.

- The new UI’s pre-existing local JSON store remains. It still needs a deployment-compatible persistence decision before Vercel use. No presentation reset was added; use a separate `ROVA_DATA_DIR` for isolated practice runs.
- Scripted coaching supports the built-in question bank, not arbitrary open-domain math or a live LLM. Explain-back prompts are conversational, not scored comprehension tests.
- The original root-cause alert engine, delayed re-check, and Spanish SMS flow are still not connected to the new product. Completing a lesson is not the original “verified fix.”
- Safety flags are visible for teacher review; there is no external notification delivery or acknowledgment workflow.
- Automated role and visibility tests cover the new contract. Browser verification used simulated accounts and isolated local data only.
- Remaining work outside this request: production data/auth, presentation reset, the legacy detection/re-check integration, and broader scripted curriculum coverage.
