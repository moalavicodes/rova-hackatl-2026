# Three-person parallel workflow

Checkpoints follow the weekend plan in README section 18. `CONTRIBUTING.md` covers roles and ownership.

## First 30 minutes: contract freeze (all three together)

1. Claim A, B, and C and record names in `STATUS.md`.
2. Confirm the integration owner, demo operator, and Q&A router.
3. Agree on the demo script steps (D-004: scripted inputs and replies, no AI model).
4. Edit and agree on `docs/INTEGRATION_CONTRACTS.md`. Mark D-001 to D-003 in `DECISIONS.md` accepted, or change them.
5. Person B initializes Next.js + Tailwind. `create-next-app` refuses to run in a non-empty folder, so create it in a temporary folder and move the files into the repo root without overwriting the docs. Then B commits `lib/types.ts`, `lib/llm.ts` (scripted mode), the skill map seed, and the view switcher.
6. Everyone branches from that commit.

## Parallel dependency strategy

| Missing dependency | Stand-in |
| --- | --- |
| Scripted reply text not written yet | `callLLM` returns a placeholder string for the step |
| Learner profile / data layer | Hard-coded Maya profile matching `LearnerProfile` |
| Rules engine | Hard-coded `Alert` fixtures |
| Tutor events | Scripted `Event` sequences in `fixtures/` |
| Parent message generator | Hard-coded Spanish `ParentMessage` |

Stand-ins must use the real contract types, so that integration means swapping them out, not rewriting.

## Checkpoints

### Sat ~12 p.m. — Student loop on `main`
- Student view with a ratio problem, "I'm stuck", and the 3-step hint ladder
- `check_answer` decides correctness (unit-tested)
- Events are logged through `log_event` (or a fixture stand-in)

### Sat ~5 p.m. — Detect → diagnose → alert
- Rules fire on scripted mistakes. `trace_prerequisites` finds `4.NF.A.1`
- Refresher (3 questions) appears in the student view
- A real `Alert` shows up in the teacher inbox card

### Sat ~9 p.m. — Full loop (feature freeze)
- Teacher heatmap (simulated class), parent view in Spanish, loop tracker with the 7-day jump
- Demo script in README section 8 runs end to end on the deployed URL
- Everything simulated is labeled Simulated

### Sat night — Test and record
- Run the math-check unit tests and the full scripted demo 3 times; record results in `STATUS.md` (the 120-question AI test set is out of scope under D-004)
- Record the backup demo video

### Sun 9–10 a.m. — Freeze
- No code changes. Pre-load data, two timed run-throughs.

## At each checkpoint, answer

- What demonstrably works on `main`?
- Did a shared type or function change?
- What is blocked?
- What must be cut?
- Does the demo path still run end to end?

## Cut order if time runs short (proposed; agree at the contract freeze)

1. Disengagement and drop rules (keep stuck, answer-seeking, repeated misconception)
2. Review queue
3. Weekly parent card (keep the activity text and the win message)
4. Day-one handoff summary
