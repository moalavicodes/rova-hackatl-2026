# Integration contracts (DRAFT until the contract freeze)

These are taken from README section 17 (data model, tools, detection rules). At the contract freeze the team edits this file, then Person B copies the types into `lib/types.ts`. After that, only the integration owner changes them.

## Types

```ts
export type SkillId = string; // Common Core code, e.g. "6.RP.A.3"

export interface Skill {
  name: string;
  grade: number;
  needs: SkillId[]; // prerequisites
}
export type SkillMap = Record<SkillId, Skill>;

export interface Student {
  id: string;
  first_name: string;
  grade: number;
  buddy_name: string;
  language_home: string; // e.g. "es"
  interests: string[];
}

export interface Classroom {
  id: string;
  teacher: string;
  name: string;
  student_ids: string[];
}

export interface SkillState {
  student_id: string;
  skill_id: SkillId;
  mastery: number; // 0–1
  misconceptions: string[]; // error-type tags, e.g. "adds-across-ratio-table"
  last_seen: string; // ISO timestamp
}

export type EventType = "attempt" | "hint" | "explain" | "refresher";

export interface Event {
  student_id: string;
  skill_id: SkillId;
  type: EventType;
  correct?: boolean; // attempts and refresher answers only, set by check_answer
  hint_level?: 1 | 2 | 3; // hint events only
  error_type?: string; // when check_answer can classify the mistake
  seconds: number;
  ts: string;
}

export type AlertStatus = "open" | "acted" | "verified" | "escalated";
export type TeacherAction = "done" | "snooze" | "different_strategy";

export interface Alert {
  id: string;
  student_id: string;
  skill_id: SkillId;
  signal: "stuck" | "answer_seeking" | "repeated_misconception" | "drop" | "disengagement" | "class_gap";
  evidence: string;
  root_cause: SkillId | null;
  action: string; // suggested 5-minute reteach
  others_with_gap: string[]; // student ids
  status: AlertStatus;
  recheck_at: string | null;
}

export interface ParentMessage {
  student_id: string;
  language: string;
  kind: "activity" | "win" | "weekly";
  text: string;
  sent_at: string; // Simulated delivery
}

export interface LearnerProfile {
  student: Student;
  skills: SkillState[];
  preferences: string[]; // e.g. "learns best with pictures"
}
```

## Functions (agent tools)

| Function | Owner | Signature |
| --- | --- | --- |
| `get_learner_profile` | B | `(studentId) => LearnerProfile` |
| `log_event` | B | `(event: Event) => Alert[]` (runs the rules and returns any new alerts) |
| `trace_prerequisites` | B | `(skillId) => SkillId[]` (nearest first) |
| `create_alert` | B | `(alert: Omit<Alert, "id" \| "status">) => Alert` |
| `apply_teacher_action` | B | `(alertId, action: TeacherAction) => Alert` |
| `schedule_recheck` | B | `(studentId, skillId, days) => void` |
| `run_recheck` | B | `(alertId, nowOverride?) => Alert` (`nowOverride` drives the simulated 7-day jump) |
| `check_answer` | A | `(problem, answer) => { correct: boolean; error_type?: string }` (code only) |
| `find_source` | A | `(skillId, question) => { ref: string; text: string } \| null` |
| `make_practice` | A | `(skillId, level, interest) => Problem[]` (each answer verified by `check_answer`) |
| `draft_parent_message` | C | `(studentId, activity, language) => ParentMessage` |
| `respond` | A | `(input: string, ctx: TutorContext) => TutorReply` in `lib/tutor/responder.ts` (rules, no AI) |
| `callLLM` | integration owner | `(templateId: string, vars: Record<string, string>) => string` in `lib/llm.ts`. Template mode (D-004) picks a variant and fills the vars; a real model can replace the body later |

## Rule-based responder (D-004)

Maya can type anything. `respond` classifies the input with rules, decides the next move from her state, and gets the text through `callLLM` templates. Person A owns the responder and the student templates in `content/templates/`. Person C owns the parent and alert templates in `lib/messages/`.

```ts
export type Intent =
  | "answer"        // contains a number/ratio/fraction → check_answer decides
  | "ask_answer"    // "just tell me", "what's the answer"
  | "stuck"         // "help", "hint", "idk", "stuck"
  | "explain"       // free text while in explain-it-back
  | "unsafe"        // safety keyword list → flag teacher
  | "off_topic";    // everything else → "Great question for your teacher!"

export interface TutorContext {
  profile: LearnerProfile;
  problem_id: string;
  hint_level: 0 | 1 | 2 | 3;
  mode: "problem" | "refresher" | "explain";
}

export interface TutorReply {
  intent: Intent;
  text: string;
  source?: string; // citation shown on the reply
  hint_level: 0 | 1 | 2 | 3;
  next_mode?: TutorContext["mode"]; // e.g. switch to refresher after a root cause is found
  quick_replies: string[]; // suggested taps; typing stays available
  events: Event[]; // passed to log_event
}
```

## Detection rules (code, Person B)

| Signal | Rule |
| --- | --- |
| Stuck | Same skill wrong ≥3 of the last 4 attempts |
| Answer-seeking | Jumps to the last hint within 20 seconds on ≥3 problems |
| Repeated misconception | Same `error_type` ≥2 times |
| Drop | Accuracy 25+ points below the student's own 2-week average |
| Disengagement | Sessions 50% shorter for a week, or 2+ missed missions |
| Class gap | ≥30% of a class shares the same root cause → group alert |

## Seed data (D-005)

JSON files in `lib/data/seed/` (skill map exactly as in README section 17; students, skill states, and classroom are Simulated). Import them through `lib/data/seed.ts`, not directly.
