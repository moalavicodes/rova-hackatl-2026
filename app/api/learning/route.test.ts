import { beforeEach, describe, expect, it, vi } from "vitest";
import { sampleWorkspace, type Profile, type Workspace } from "@/lib/product/model";
const state = vi.hoisted(() => ({ db: {} as { workspace: Workspace }, account: null as Profile | null }));
vi.mock("@/lib/product/server", () => ({
  sameOrigin: (request: Request) => request.headers.get("origin") === new URL(request.url).origin,
  database: (callback: (db: typeof state.db) => unknown) => callback(state.db),
  currentAccount: () => state.account,
  visibleWorkspace: (workspace: Workspace) => workspace,
}));
import { POST } from "./route";
const request = (body: unknown, origin = "http://localhost:3000") => POST(new Request("http://localhost:3000/api/learning", { method: "POST", headers: { origin, "Content-Type": "application/json" }, body: JSON.stringify(body) }));
beforeEach(() => { state.db = { workspace: sampleWorkspace() }; state.account = { id: "maya", name: "Maya", role: "student", school: "Maplewood", goal: 10, avatar: "sage" }; });
describe("learning API coaching authorization", () => {
  it("requires a session and same origin", async () => {
    expect((await request({ action: "coach-start", topic: "fractions" }, "https://other.test")).status).toBe(403);
    state.account = null;
    expect((await request({ action: "coach-start", topic: "fractions" })).status).toBe(401);
  });
  it("ignores client correctness and hint claims", async () => {
    const start = await (await request({ action: "coach-start", topic: "fractions" })).json();
    const response = await request({ action: "coach-turn", sessionId: start.session.id, id: "attempt-01", text: "3", correct: true, hints: 0 });
    expect(response.status).toBe(200);
    expect(state.db.workspace.attempts.at(-1)?.correct).toBe(false);
    expect(state.db.workspace.sessions?.[0].messages.at(-1)?.kind).toBe("retry");
  });
  it("blocks access to another learner’s conversation", async () => {
    const start = await (await request({ action: "coach-start", topic: "fractions" })).json();
    state.account!.id = "learner-1";
    expect((await request({ action: "coach-turn", sessionId: start.session.id, id: "attempt-01", text: "2" })).status).toBe(400);
  });
  it("does not let a teacher manually mark an unfinished group complete", async () => {
    state.account!.role = "teacher";
    await request({ action: "plan", topic: "fractions", studentIds: ["maya"] });
    const plan = state.db.workspace.plans[0];
    expect((await request({ action: "complete-plan", id: plan.id })).status).toBe(400);
    expect(plan.completed).not.toBe(true);
  });
  it("records completion automatically after an assigned student solves the lesson", async () => {
    state.account!.role = "teacher";
    await request({ action: "plan", topic: "fractions", studentIds: ["maya"] });
    const plan = state.db.workspace.plans[0];
    state.account!.role = "student";
    const start = await (await request({ action: "coach-start", topic: "fractions", planId: plan.id })).json();
    for (const [index, text] of ["2", "4", "9"].entries()) {
      await request({ action: "coach-turn", sessionId: start.session.id, id: `answer-${index}`, text });
      if (index < 2) await request({ action: "coach-next", sessionId: start.session.id });
    }
    expect(plan.completed).toBe(true);
    expect(state.db.workspace.attempts.filter(a => a.planId === plan.id)).toHaveLength(3);
  });
  it("opens a refresher only from the learner’s own traced ratios session", async () => {
    const ratios = (await (await request({ action: "coach-start", topic: "ratios" })).json()).session;
    for (const [index, text] of ["7", "8"].entries()) await request({ action: "coach-turn", sessionId: ratios.id, id: `miss-000${index}`, text });
    expect(state.db.workspace.sessions?.[0].trace?.prerequisite).toBe("fractions");
    expect((await request({ action: "coach-start", topic: "geometry", refresherFor: ratios.id })).status).toBe(400);
    const refresher = await request({ action: "coach-start", topic: "fractions", refresherFor: ratios.id });
    expect(refresher.status).toBe(200);
    expect((await refresher.json()).session.refresherFor).toBe(ratios.id);
    state.account!.id = "learner-1";
    expect((await request({ action: "coach-start", topic: "fractions", refresherFor: ratios.id })).status).toBe(400);
  });
  it("lets only teachers acknowledge a learning alert", async () => {
    const ratios = (await (await request({ action: "coach-start", topic: "ratios" })).json()).session;
    for (const [index, text] of ["7", "8"].entries()) await request({ action: "coach-turn", sessionId: ratios.id, id: `miss-000${index}`, text });
    expect((await request({ action: "trace-ack", sessionId: ratios.id })).status).toBe(403);
    state.account!.role = "teacher";
    expect((await request({ action: "trace-ack", sessionId: ratios.id })).status).toBe(200);
    expect(state.db.workspace.sessions?.[0].trace?.acknowledgedAt).toBeDefined();
  });
  it("falls back to the scripted summary when no local model is configured", async () => {
    const saved = process.env.ROVA_LLM_URL;
    delete process.env.ROVA_LLM_URL;
    try {
      const session = (await (await request({ action: "coach-start", topic: "fractions" })).json()).session;
      expect((await request({ action: "ai-summary", sessionId: session.id })).status).toBe(403);
      state.account!.role = "teacher";
      const response = await request({ action: "ai-summary", sessionId: session.id });
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.aiSummary).toBeNull();
      expect(body.notice).toContain("scripted summary");
    } finally {
      if (saved !== undefined) process.env.ROVA_LLM_URL = saved;
    }
  });
});
