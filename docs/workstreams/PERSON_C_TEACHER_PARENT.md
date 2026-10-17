# Person C — Teacher and parent views

**Mission:** The adult side of the demo (README section 8, steps 5–7). Ms. Rivera sees who is stuck and why, and acts on it. Maya's parent gets a Spanish text with a 10-minute activity. The loop tracker shows the issue verified as fixed.

**Branch:** `feat/adult-views`
**Owns:** `app/teacher/`, `app/parent/`, `components/teacher/`, `components/parent/`, `lib/messages/`
**Consumes:** `Alert`, `SkillState`, `ParentMessage`, `apply_teacher_action`, `run_recheck` (Person B), `callLLM` (integration owner)
**Produces:** `draft_parent_message`, all teacher and parent screens

## Tasks

- [ ] C0 — Fixtures-first: render a hard-coded Maya `Alert` and a Spanish `ParentMessage` so the views work before B's rules land
- [ ] C1 — Action inbox: alert cards (student · skill · evidence · root cause · suggested reteach · "4 others share this gap") with Done / Snooze / Different strategy, which call `apply_teacher_action`
- [ ] C2 — Class heatmap: students × skills, with the "group of 5 share this root cause" callout. Labeled Simulated
- [ ] C3 — Loop tracker: open → acted → verified, average days to fix, a "fast-forward 7 days" button that calls `run_recheck(nowOverride)`, then "Mastered ✅, parent notified"
- [ ] C4 — `lib/messages/draftParentMessage.ts`: activity, win, and weekly kinds, in the home language (Spanish for the demo). Include the recipe-ratio activity
- [ ] C5 — Parent view at phone width: SMS mock-up (labeled Simulated), weekly card (learned · working on · try at home), win message
- [ ] C6 — Review queue: held-back answers and "this seems wrong" flags (cut first if short on time)

## Rules

- Never change alert status directly. Always go through B's functions.
- Everything simulated gets a visible Simulated label.
