import { topics, type Role, type TopicId } from "./curriculum";

export interface Profile { id: string; name: string; role: Role; email?: string; school: string; goal: number; avatar: string; sample?: boolean; familyCode?: string }
export interface Learner { id: string; name: string; scores: Partial<Record<TopicId, number>>; avatar: string }
export interface Attempt { id: string; studentId: string; questionId: string; topic: TopicId; correct: boolean; hints: number; at: string; sessionId?: string; planId?: string }
export interface CoachMessage { id: string; role: "student" | "coach"; text: string; questionId: string; at: string; kind?: "hint" | "correct" | "retry" | "guardrail" | "safety" | "explain"; source?: string }
export interface CoachSession { id: string; studentId: string; topic: TopicId; planId?: string; questionIndex: number; messages: CoachMessage[]; startedAt: string; completedAt?: string }
export interface Plan { id: string; topic: TopicId; studentIds: string[]; at: string; completed?: boolean }
export interface Note { id: string; studentId: string; text: string; author: string; at: string }
export interface Workspace { name: string; code: string; students: Learner[]; attempts: Attempt[]; plans: Plan[]; notes: Note[]; checks: string[]; sessions?: CoachSession[] }
export const emptyWorkspace: Workspace = { name: "My classroom", code: "", students: [], attempts: [], plans: [], notes: [], checks: [] };
export const sampleProfiles: Record<Role, Profile> = {
  student: { id: "maya", name: "Maya Chen", role: "student", school: "Maplewood Elementary", goal: 10, avatar: "sage", sample: true },
  teacher: { id: "rivera", name: "Elena Rivera", role: "teacher", school: "Maplewood Elementary", goal: 10, avatar: "peach", sample: true },
  parent: { id: "alex", name: "Alex Chen", role: "parent", school: "Maplewood Elementary", goal: 10, avatar: "lavender", sample: true },
};
export function sampleWorkspace(): Workspace {
  const names = ["Maya Chen", "Oliver Brooks", "Amelia Patel", "Noah Williams", "Sophia Garcia", "Liam Johnson", "Isabella Kim", "Ethan Davis", "Ava Robinson", "Lucas Martinez", "Mia Thompson", "Aiden Wilson", "Charlotte Lee", "Henry Clark", "Harper Lewis", "Leo Anderson", "Ella Thomas", "James Walker"];
  const students = names.map((name, i) => ({ id: i === 0 ? "maya" : `learner-${i}`, name, avatar: ["sage", "peach", "lavender", "blue"][i % 4], scores: Object.fromEntries(topics.map((t, j) => [t.id, i === 17 ? [38, 46, 41, 32, 48, 44][j] : i === 0 ? [92, 78, 65, 42, 86, 74][j] : j === 3 && i < 7 ? 35 + i * 3 : 58 + ((i * 17 + j * 11) % 40)])) }));
  const now = Date.now();
  const attempts: Attempt[] = [];
  for (let day = 6; day >= 0; day--) {
    for (let n = 0; n < 4 + ((6 - day) % 3); n++) {
      const topic = topics[(day + n) % topics.length].id;
      attempts.push({ id: `sample-${day}-${n}`, studentId: "maya", questionId: `sample-${topic}`, topic, correct: n !== 1 && !(day > 3 && n === 2), hints: n === 1 ? 2 : 0, at: new Date(now - day * 86400000 - n * 120000).toISOString() });
    }
  }
  return { name: "Room 4 · Math explorers", code: "MAPLE4", students, attempts, plans: [], checks: [], notes: [{ id: "welcome", studentId: "maya", text: "Maya is making thoughtful connections in multiplication. This week, we’re working on seeing why different fractions can represent the same amount. Try folding a piece of paper together at home.", author: "Ms. Rivera", at: new Date(now - 86400000).toISOString() }] };
}
export function scoreFor(student: Learner, topic: TopicId, attempts: Attempt[]): number | null {
  const recent = attempts.filter((a) => a.studentId === student.id && a.topic === topic && !a.id.startsWith("sample-")).slice(-10);
  const base = student.scores[topic];
  if (!recent.length) return base ?? null;
  const right = recent.reduce((sum, a) => sum + (a.correct ? (a.hints ? 0.7 : 1) : 0), 0);
  return Math.round(((base === undefined ? 0 : base / 100 * 3) + right) / (recent.length + (base === undefined ? 0 : 3)) * 100);
}
// Upgrade only the untouched simulated profile from the previous seed. Never
// overwrite a renamed profile, edited scores, or a learner's live practice.
export function upgradeSampleWorkspace(workspace: Workspace): Workspace {
  const student = workspace.students.find(s => s.id === "learner-17" && s.name === "James Walker");
  if (student && topics.every((t, j) => student.scores[t.id] === 58 + ((17 * 17 + j * 11) % 40)) && !workspace.attempts.some(a => a.studentId === student.id && !a.id.startsWith("sample-"))) {
    topics.forEach((t, j) => { student.scores[t.id] = [38, 46, 41, 32, 48, 44][j]; });
  }
  return workspace;
}
export function average(values: (number | null)[]): number | null {
  const known = values.filter((v): v is number => v !== null);
  return known.length ? Math.round(known.reduce((a, b) => a + b, 0) / known.length) : null;
}
export function band(score: number | null): string { return score === null ? "unstarted" : score >= 80 ? "strong" : score >= 60 ? "growing" : "support"; }
export function labelFor(score: number | null): string { return score === null ? "Ready to explore" : score >= 80 ? "Feeling confident" : score >= 60 ? "Getting there" : "Let’s work on this"; }
export function weeklyActivity(attempts: Attempt[], studentId?: string) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(); date.setDate(date.getDate() - 6 + i);
    const key = date.toDateString();
    const items = attempts.filter((a) => (!studentId || a.studentId === studentId) && new Date(a.at).toDateString() === key);
    return { label: date.toLocaleDateString("en-US", { weekday: "short" }), attempts: items.length, correct: items.filter((a) => a.correct).length };
  });
}
