import { randomUUID } from "node:crypto";
import { currentAccount, database, sameOrigin, visibleWorkspace } from "@/lib/product/server";
import { allTopics, gradeAnswer, questions, topics } from "@/lib/product/curriculum";
import { advanceCoaching, coachingTurn, lessonProgress, startCoaching } from "@/lib/product/coaching";
import type { CoachSession, Workspace } from "@/lib/product/model";
import { aiSummaryAvailable, writeAiSummary } from "@/lib/product/aiSummary";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const body = await request.json();
    if (body.action === "ai-summary") return await aiSummary(String(body.sessionId));
    return await database(async (db) => {
      const account = await currentAccount(db);
      if (!account) return Response.json({ error: "Please sign in." }, { status: 401 });
      const now = new Date().toISOString();
      let correct: boolean | undefined;
      let session: CoachSession | undefined;
      if (["coach-start", "coach-turn", "coach-next"].includes(body.action) && account.role === "student") {
        try {
          if (body.action === "coach-start") {
            const topic = allTopics.find(t => t.id === body.topic);
            if (!topic || (body.planId !== undefined && typeof body.planId !== "string") || (body.refresherFor !== undefined && typeof body.refresherFor !== "string")) return Response.json({ error: "Choose a valid lesson." }, { status: 400 });
            session = startCoaching(db.workspace, account.id, topic.id, randomUUID(), now, body.planId, body.refresherFor);
          } else if (body.action === "coach-turn") {
            if (typeof body.text !== "string" || typeof body.id !== "string" || !/^[a-zA-Z0-9-]{8,100}$/.test(body.id)) return Response.json({ error: "Write a valid message." }, { status: 400 });
            session = coachingTurn(db.workspace, account.id, String(body.sessionId), body.id, body.text, now);
          } else session = advanceCoaching(db.workspace, account.id, String(body.sessionId), now);
          for (const plan of db.workspace.plans) {
            plan.completed = plan.studentIds.every(id => lessonProgress(db.workspace, plan, id).status === "Completed");
          }
        } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Please try again." }, { status: 400 }); }
      } else if (body.action === "attempt" && account.role === "student") {
        const question = questions.find((q) => q.id === body.questionId);
        if (!question || typeof body.answer !== "string" || body.answer.length > 100) return Response.json({ error: "Choose a valid practice question." }, { status: 400 });
        const id = String(body.id ?? "");
        if (!/^[a-zA-Z0-9-]{8,100}$/.test(id)) return Response.json({ error: "Invalid attempt." }, { status: 400 });
        const previous = db.workspace.attempts.find((a) => a.id === id && a.studentId === account.id);
        correct = previous?.correct ?? gradeAnswer(question.id, body.answer);
        if (!previous) db.workspace.attempts.push({ id, studentId: account.id, questionId: question.id, topic: question.topic, correct, hints: Math.max(0, Math.min(3, Number(body.hints) || 0)), at: now });
      } else if (body.action === "plan" && account.role === "teacher") {
        const topic = topics.find((t) => t.id === body.topic);
        const studentIds = db.workspace.students.filter((s) => Array.isArray(body.studentIds) && body.studentIds.includes(s.id)).map((s) => s.id);
        if (!topic || !studentIds.length) return Response.json({ error: "Select a topic and at least one student." }, { status: 400 });
        if (!db.workspace.plans.some((p) => p.topic === topic.id && !p.completed && p.studentIds.length === studentIds.length && p.studentIds.every((id) => studentIds.includes(id)))) db.workspace.plans.push({ id: randomUUID(), topic: topic.id, studentIds, at: now });
      } else if (body.action === "complete-plan" && account.role === "teacher") {
        const plan = db.workspace.plans.find((p) => p.id === body.id);
        if (!plan || !plan.studentIds.every(id => lessonProgress(db.workspace, plan, id).status === "Completed")) return Response.json({ error: "Completion is recorded when each learner solves the assigned lesson." }, { status: 400 });
        plan.completed = true;
      } else if (body.action === "trace-ack" && account.role === "teacher") {
        const traced = db.workspace.sessions?.find(s => s.id === body.sessionId && s.trace);
        if (!traced?.trace) return Response.json({ error: "Choose a learning alert." }, { status: 400 });
        traced.trace.acknowledgedAt ??= now;
      } else if (body.action === "note" && account.role === "teacher") {
        const text = String(body.text ?? "").trim().slice(0, 1000);
        if (!text || !db.workspace.students.some((s) => s.id === body.studentId)) return Response.json({ error: "Choose a student and write a message." }, { status: 400 });
        db.workspace.notes.push({ id: randomUUID(), studentId: body.studentId, text, author: account.name, at: now });
      } else if (body.action === "check" && account.role === "parent") {
        const key = `${account.id}:${String(body.key).slice(0, 80)}`;
        db.workspace.checks = db.workspace.checks.includes(key) ? db.workspace.checks.filter((k) => k !== key) : [...db.workspace.checks, key];
      } else return Response.json({ error: "This action isn’t available for your account." }, { status: 403 });
      return Response.json({ workspace: visibleWorkspace(db.workspace, account), correct, session });
    });
  } catch { return Response.json({ error: "Your update couldn’t be saved. Please try again." }, { status: 500 }); }
}

// The model call runs outside the write queue so a slow reply never blocks other saves.
async function aiSummary(sessionId: string) {
  const prepared = await database<{ error: Response } | { workspace: Workspace; session: CoachSession }>(async (db) => {
    const account = await currentAccount(db);
    if (account?.role !== "teacher") return { error: Response.json({ error: "This action isn’t available for your account." }, { status: 403 }) };
    const session = db.workspace.sessions?.find(s => s.id === sessionId);
    if (!session) return { error: Response.json({ error: "Choose a lesson to summarize." }, { status: 400 }) };
    if (session.aiSummary?.messageCount === session.messages.length) return { error: Response.json({ workspace: db.workspace, aiSummary: session.aiSummary }) };
    return { workspace: structuredClone(db.workspace) as Workspace, session: structuredClone(session) as CoachSession };
  });
  if ("error" in prepared) return prepared.error;
  if (!aiSummaryAvailable()) return Response.json({ workspace: prepared.workspace, aiSummary: null, notice: "No local AI model is configured on this server, so the scripted summary is shown." });
  let summary;
  try { summary = await writeAiSummary(prepared.workspace, prepared.session, new Date().toISOString()); }
  catch { return Response.json({ workspace: prepared.workspace, aiSummary: null, notice: "The local AI model didn’t respond. Check that it’s running; the scripted summary is shown." }); }
  if (!summary) return Response.json({ workspace: prepared.workspace, aiSummary: null, notice: "The local AI model returned no summary. The scripted summary is shown." });
  return await database((db) => {
    const session = db.workspace.sessions?.find(s => s.id === sessionId);
    if (session) session.aiSummary = summary;
    return Response.json({ workspace: db.workspace, aiSummary: summary });
  });
}
