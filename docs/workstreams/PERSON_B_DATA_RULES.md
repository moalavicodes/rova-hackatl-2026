# Person B — Data, rules, and integration (owner)

**Mission:** The memory and the "brain" between the student and the adults: what Rova knows about Maya, when a struggle becomes an alert, where it started, and whether the fix worked (README section 6, steps 2, 3, 4, and 6). Also keeps `main` working and deployed.

**Branch:** `feat/data-rules`
**Owns:** `lib/data/`, `lib/rules/`, `fixtures/`, `app/api/events/`, `app/api/alerts/`. As integration owner also: `lib/types.ts`, `lib/llm.ts`, `app/layout.tsx`, `app/page.tsx`, `components/ui/`, package and config files, `STATUS.md`
**Produces:** `get_learner_profile`, `log_event`, `trace_prerequisites`, `create_alert`, `apply_teacher_action`, `schedule_recheck`, `run_recheck`, `callLLM`

## Tasks

- [x] B0 — Contract freeze. Initialize Next.js + Tailwind without deleting the docs. Add `lib/types.ts` from `docs/INTEGRATION_CONTRACTS.md`, `lib/llm.ts` in template mode (D-004: `callLLM(templateId, vars)` fills a pre-written template variant, no AI model), and a view switcher (Student / Teacher / Parent) on `app/page.tsx`. Push to `main` quickly so A and C can branch
- [ ] B1 — Seed data: skill map (README section 17) ✅ `lib/data/skillMap.ts`, Maya's profile with her earlier-grade history (Simulated) ✅ `lib/data/seed.ts` (buddy name and interests are placeholders until the team picks them), Ms. Rivera's class of 25 with 5 sharing the `4.NF.A.1` gap (Simulated) — not done
- [ ] B2 — Store (D-005): load JSON seeds, keep students, skill states, events, alerts, and parent messages in browser storage, with a reset to seed
- [ ] B3 — `trace_prerequisites`: walks `needs` back, nearest first. Test: `6.RP.A.3` → includes `4.NF.A.1`
- [ ] B4 — Detection rules as pure functions with scripted-event tests (start with stuck, answer-seeking, repeated misconception, and class gap)
- [ ] B5 — `log_event` → rules → `create_alert`, with root cause and `others_with_gap` filled in. Alert text comes from C's templates through `callLLM`, filled with the real evidence; the rules decide when
- [ ] B6 — Alert lifecycle: `apply_teacher_action`, `schedule_recheck`, `run_recheck(nowOverride)` for the simulated 7-day jump. Verified → triggers a parent win message (through C's `draft_parent_message`)
- [ ] B7 — Profile update after a session (mastery, misconceptions, last_seen)
- [ ] B8 — "Reset demo" control that restores the seeded state, so the README section 8 demo path can be rerun any time
- [ ] B9 — Deploy to one URL. Keep `STATUS.md` current after each merge
