# Rova project context

Stable facts and boundaries. Change this file only when a durable fact changes. Full detail lives in `README.md` (§8 demo, §17 build spec).

## Product in one line

AI made answers instant, not learning. Rova helps a 4th grader practice math with hints instead of answers, shows the teacher where the class needs support so they can act in small groups, and keeps the family in the loop.

## The app today (D-009)

- **Grade 4 math, six foundations:** place value, multiplication, division, fractions, measurement, shapes & angles; 18 practice questions with 3 hints each (`lib/product/curriculum.ts`).
- **Three workspaces behind logins:** Student (`/student`), Teacher (`/teacher`), Parent (`/parent`), plus home (`/`), `/login`, and `/signup`. Sample accounts are in `lib/product/mock-accounts.json`; sign-up needs class code `MAPLE4` (student) or family code `MAYA4` (parent).
- **Teacher:** class understanding by topic, the class's shared gap, a student × topic table, small-group learning plans, notes to families.
- **Parent:** progress, at-home activity checklists, teacher notes.
- **No AI model is called (D-004).** Answers are checked by code (`lib/math/checkAnswer.ts`).
- **Simulated:** the 18-student sample class and starting scores, Maya's last 7 days of practice. Names are fictional.

## Architecture (as built)

- Next.js 16 (App Router) + React 19, Tailwind 4 and a hand-written stylesheet (`app/product.css`).
- **Screens:** `components/product/` (`WorkspaceApp` routes each role to its dashboard).
- **Accounts:** scrypt-hashed passwords, HMAC-signed session cookie (7 days), same-origin checks on writes, per-role data visibility (`lib/product/server.ts`).
- **Data:** one JSON file at `.rova/workspace.json` (or `ROVA_DATA_DIR`), created on first run from the sample accounts and class. Writes go through a queue and an atomic rename. Delete `.rova/` to start over.
- **APIs:** `app/api/account` (login, sign-up, profile, logout), `app/api/learning` (practice attempts, plans, notes, parent checklist).

## Built but not connected to the current screens

`lib/rules/` (root-cause trace, detection rules, alerts, 7-day re-check, safety reports), `lib/data/store.ts` (browser store, reset signal), `lib/tutor/` (free-text rule-based tutor), and the earlier views in `components/{student,teacher,parent,ui}/`. Tested (most of the 151 tests), but nothing on screen uses them. Don't claim these features in the demo unless they are reconnected.

## Known conflicts to resolve

- **Storage vs. hosting:** the app writes a file on every request, including login. That works locally but not on Vercel (D-005, D-006).
- **Accounts vs. privacy plan:** students have password accounts; the README's privacy plan says no child accounts.
- **Grade:** the app is grade 4; the business sections of the README still assume middle school.

## Commands

```bash
npm install      # once
npm run dev      # http://localhost:3000
npm run test     # vitest
npm run lint
npm run build
```

Next.js 16 differs from older versions; its docs ship in `node_modules/next/dist/docs/`.

## Invariants

1. Math correctness is decided by code only.
2. Hints guide; the final answer is never shown before the student solves it.
3. Students and parents see only their own data.
4. No real student data and no real secrets in the repo. The demo password in `mock-accounts.json` is for sample accounts only.
5. Label simulated data as Simulated; don't present planned features as working.

## Roles

See `CONTRIBUTING.md`. Ownership of `components/product/` and `lib/product/` is not assigned yet (see `STATUS.md`).
