// The loop's state transitions (README section 6): DETECT → DIAGNOSE → ALERT → ACT → VERIFY.
// Pure functions: each takes the current state and returns the next one, so they are easy to
// test and the browser store (lib/data/store.ts) only has to save the result.

import { callLLM } from "@/lib/llm";
import { draftParentMessage } from "@/lib/messages/draftParentMessage";
import { classroom, skillMap, skillStates, students } from "@/lib/data/seed";
import { alertTemplates, homeActivities, skillNamesEs } from "@/lib/rules/alertTemplates";
import { detect, is_class_gap, type Detection } from "@/lib/rules/detect";
import { find_root_cause, students_with_gap } from "@/lib/rules/trace";
import type {
  Alert,
  Classroom,
  Event,
  LearnerProfile,
  ParentMessage,
  SkillId,
  SkillMap,
  SkillState,
  Student,
  TeacherAction,
} from "@/lib/types";

export interface RovaState {
  version: 1;
  skillMap: SkillMap;
  classroom: Classroom;
  students: Student[];
  skillStates: SkillState[];
  events: Event[];
  alerts: Alert[];
  parentMessages: ParentMessage[];
}

export const MASTERY_STEP = 0.15; // gain per correct answer
export const RECHECK_DAYS = 7;
export const SNOOZE_DAYS = 1;
// Re-check passes when the student got this many root-cause refresher questions right after the alert.
export const RECHECK_REFRESHERS_NEEDED = 2;

export function seedState(): RovaState {
  return {
    version: 1,
    skillMap,
    classroom,
    students,
    skillStates: skillStates.map((s) => ({ ...s, misconceptions: [...s.misconceptions] })),
    events: [],
    alerts: [],
    parentMessages: [],
  };
}

export function get_learner_profile(state: RovaState, studentId: string): LearnerProfile {
  const student = state.students.find((s) => s.id === studentId);
  if (!student) throw new Error(`Unknown student: ${studentId}`);
  return {
    student,
    skills: state.skillStates.filter((s) => s.student_id === studentId),
    preferences: [],
  };
}

function daysLater(now: Date, days: number): string {
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}

export function schedule_recheck(now: Date, days: number = RECHECK_DAYS): string {
  return daysLater(now, days);
}

// Mastery and misconceptions move with each answer (B7).
function applyEventToSkills(skillStatesNow: SkillState[], event: Event): SkillState[] {
  return skillStatesNow.map((s) => {
    if (s.student_id !== event.student_id || s.skill_id !== event.skill_id) return s;
    const next: SkillState = { ...s, last_seen: event.ts };
    if (event.correct === true) {
      next.mastery = Math.min(1, Math.round((s.mastery + MASTERY_STEP) * 100) / 100);
    }
    if (event.correct === false && event.error_type && !s.misconceptions.includes(event.error_type)) {
      next.misconceptions = [...s.misconceptions, event.error_type];
    }
    return next;
  });
}

function hasUnresolvedAlert(state: RovaState, studentId: string, skillId: SkillId): boolean {
  return state.alerts.some(
    (a) =>
      a.student_id === studentId &&
      a.skill_id === skillId &&
      (a.status === "open" || a.status === "acted"),
  );
}

function studentName(state: RovaState, studentId: string): string {
  return state.students.find((s) => s.id === studentId)?.first_name ?? studentId;
}

export function create_alert(
  state: RovaState,
  studentId: string,
  skillId: SkillId,
  detection: Detection,
  now: Date,
): Alert[] {
  const name = studentName(state, studentId);
  const rootCause = find_root_cause(studentId, skillId, state.skillMap, state.skillStates);
  const classmates = state.classroom.student_ids.filter((id) => id !== studentId);
  const others = rootCause ? students_with_gap(rootCause, classmates, state.skillStates) : [];
  const created: Alert[] = [];
  const nextId = () => `alert-${state.alerts.length + created.length + 1}`;

  created.push({
    id: nextId(),
    student_id: studentId,
    skill_id: skillId,
    signal: detection.signal,
    evidence: `${name} ${detection.evidence}`,
    root_cause: rootCause,
    action: callLLM(`alert.action.${rootCause ?? "none"}`, { student: name }, alertTemplates),
    others_with_gap: others,
    status: "open",
    recheck_at: null,
    created_at: now.toISOString(),
  });

  // A separate group alert only when ≥30% of the class shares the root cause (D-007).
  const groupSize = others.length + 1;
  if (rootCause && is_class_gap(groupSize, state.classroom.student_ids.length)) {
    created.push({
      ...created[0],
      id: nextId(),
      signal: "class_gap",
      evidence: `${groupSize} of ${state.classroom.student_ids.length} students share this root cause.`,
    });
  }
  return created;
}

// Records one event; returns the next state and any alerts it created.
export function log_event(
  state: RovaState,
  event: Event,
  now: Date = new Date(),
): { state: RovaState; newAlerts: Alert[] } {
  const next: RovaState = {
    ...state,
    events: [...state.events, event],
    skillStates: applyEventToSkills(state.skillStates, event),
  };
  if (event.type !== "attempt" && event.type !== "hint") return { state: next, newAlerts: [] };
  if (hasUnresolvedAlert(next, event.student_id, event.skill_id)) return { state: next, newAlerts: [] };

  const detection = detect(next.events, event.student_id, event.skill_id);
  if (!detection) return { state: next, newAlerts: [] };

  const newAlerts = create_alert(next, event.student_id, event.skill_id, detection, now);
  return { state: { ...next, alerts: [...next.alerts, ...newAlerts] }, newAlerts };
}

function parentMessage(
  state: RovaState,
  alert: Alert,
  kind: ParentMessage["kind"],
  now: Date,
): ParentMessage | null {
  const student = state.students.find((s) => s.id === alert.student_id);
  if (!student) return null;
  const language = student.language_home;
  const root = alert.root_cause ?? alert.skill_id;
  const activity = homeActivities[root]?.[language] ?? "";
  const nameFor = (id: SkillId) =>
    (language === "es" ? skillNamesEs[id] : undefined) ?? state.skillMap[id]?.name ?? id;
  const message = draftParentMessage(student.id, activity, language, {
    kind,
    studentName: student.first_name,
    skill: nameFor(kind === "win" ? root : alert.skill_id),
    rootCause: nameFor(root),
    sentAt: now.toISOString(),
  });
  // No template for this language yet: send nothing rather than a placeholder.
  return message.text.startsWith("[missing template") ? null : message;
}

function updateAlert(state: RovaState, alertId: string, change: (a: Alert) => Alert): RovaState {
  return { ...state, alerts: state.alerts.map((a) => (a.id === alertId ? change(a) : a)) };
}

export function apply_teacher_action(
  state: RovaState,
  alertId: string,
  action: TeacherAction,
  now: Date = new Date(),
): RovaState {
  const alert = state.alerts.find((a) => a.id === alertId);
  if (!alert || (alert.status !== "open" && alert.status !== "acted")) return state;

  if (action === "snooze") {
    return updateAlert(state, alertId, (a) => ({ ...a, recheck_at: daysLater(now, SNOOZE_DAYS) }));
  }

  const acted = updateAlert(state, alertId, (a) => ({
    ...a,
    status: "acted",
    recheck_at: schedule_recheck(now),
    action:
      action === "different_strategy"
        ? callLLM("alert.different_strategy", {}, alertTemplates)
        : a.action,
  }));
  // The parent gets the home activity when the teacher acts (README section 6, step 5).
  const message = parentMessage(acted, alert, "activity", now);
  return message ? { ...acted, parentMessages: [...acted.parentMessages, message] } : acted;
}

// Code decides mastery (README section 6, step 6): after the alert, the student must have
// answered RECHECK_REFRESHERS_NEEDED root-cause questions correctly and their latest attempt
// on the original skill must be correct. Otherwise the alert escalates.
export function is_mastered(state: RovaState, alert: Alert): boolean {
  const since = alert.created_at ?? "";
  const later = state.events.filter((e) => e.student_id === alert.student_id && e.ts >= since);
  const refreshersRight = alert.root_cause
    ? later.filter(
        (e) => e.type === "refresher" && e.skill_id === alert.root_cause && e.correct === true,
      ).length
    : RECHECK_REFRESHERS_NEEDED;
  const lastAttempt = later.filter((e) => e.type === "attempt" && e.skill_id === alert.skill_id).at(-1);
  return refreshersRight >= RECHECK_REFRESHERS_NEEDED && lastAttempt?.correct === true;
}

export function run_recheck(state: RovaState, alertId: string, nowOverride?: Date): RovaState {
  const alert = state.alerts.find((a) => a.id === alertId);
  if (!alert || alert.status !== "acted") return state;
  const now = nowOverride ?? new Date();
  if (!is_mastered(state, alert)) {
    return updateAlert(state, alertId, (a) => ({ ...a, status: "escalated" }));
  }
  const verified = updateAlert(state, alertId, (a) => ({ ...a, status: "verified" }));
  const message = parentMessage(verified, alert, "win", now);
  return message ? { ...verified, parentMessages: [...verified.parentMessages, message] } : verified;
}
