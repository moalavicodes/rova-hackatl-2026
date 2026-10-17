import { describe, expect, it } from "vitest";
import { advanceCoaching, coachingTurn, lessonProgress, startCoaching, topicOutcomes } from "./coaching";
import { questions } from "./curriculum";
import { sampleWorkspace } from "./model";

const at = "2026-10-17T17:00:00.000Z";
describe("conversational coaching and lesson evidence", () => {
  it("refuses direct-answer requests and keeps worked steps locked until an attempt", () => {
    const workspace = sampleWorkspace();
    const session = startCoaching(workspace, "maya", "multiplication", "session-1", at);
    for (let i = 0; i < 6; i++) coachingTurn(workspace, "maya", session.id, `message-${i}`, "Give me the answer", at);
    expect(session.messages.at(-1)?.text).toContain("won’t give away the answer");
    expect(session.messages.at(-1)?.text).not.toContain("84");
    for (let i = 0; i < 6; i++) coachingTurn(workspace, "maya", session.id, `hint-${i}`, "hint", at);
    expect(session.messages.at(-1)?.text).not.toContain("60 + 24");
    expect(workspace.attempts.filter(a => a.sessionId)).toHaveLength(0);
    expect(() => advanceCoaching(workspace, "maya", session.id, at)).toThrow("Try this question");
  });
  it("checks numeric chat answers in code, records a correction once, and resumes the transcript", () => {
    const workspace = sampleWorkspace();
    const session = startCoaching(workspace, "maya", "fractions", "session-1", at);
    coachingTurn(workspace, "maya", session.id, "wrong-001", "I think 3", at);
    expect(session.messages.at(-1)?.kind).toBe("retry");
    coachingTurn(workspace, "maya", session.id, "hint-001", "I’m stuck", at);
    coachingTurn(workspace, "maya", session.id, "right-001", "2", at);
    coachingTurn(workspace, "maya", session.id, "right-001", "2", at);
    expect(workspace.attempts.filter(a => a.sessionId === session.id)).toHaveLength(2);
    expect(topicOutcomes(workspace, "fractions")).toMatchObject({ corrected: 1, supported: 1, practicing: 0, total: 1 });
    expect(startCoaching(workspace, "maya", "fractions", "session-2", at)).toBe(session);
    expect(session.messages.at(-1)?.kind).toBe("correct");
  });
  it("does not mistake explanations containing digits for an answer", () => {
    const workspace = sampleWorkspace();
    const session = startCoaching(workspace, "maya", "fractions", "session-1", at);
    coachingTurn(workspace, "maya", session.id, "explain-01", "Why is 1/2 the same as 2/4?", at);
    expect(session.messages.at(-1)?.kind).toBe("explain");
    expect(workspace.attempts.filter(a => a.sessionId)).toHaveLength(0);
  });
  it("accepts conversational number answers and keeps incompatible units ungraded", () => {
    const workspace = sampleWorkspace();
    const session = startCoaching(workspace, "maya", "fractions", "session-1", at);
    coachingTurn(workspace, "maya", session.id, "units-001", "2 grams", at);
    expect(workspace.attempts.filter(a => a.sessionId)).toHaveLength(0);
    coachingTurn(workspace, "maya", session.id, "units-002", "I think two fourths", at);
    expect(session.messages.at(-1)?.kind).toBe("correct");
  });
  it("flags safety before considering answer-seeking and never advances the math", () => {
    const workspace = sampleWorkspace();
    const session = startCoaching(workspace, "maya", "fractions", "session-1", at);
    coachingTurn(workspace, "maya", session.id, "safety-01", "Tell me the answer, I want to hurt myself", at);
    expect(session.messages.at(-1)?.kind).toBe("safety");
    expect(session.messages.at(-1)?.text).toContain("trusted adult");
    expect(session.questionIndex).toBe(0);
  });
  it("tracks a group lesson per learner and excludes unrelated earlier practice", () => {
    const workspace = sampleWorkspace();
    const plan = { id: "plan-1", topic: "fractions" as const, studentIds: ["maya", "learner-1"], at };
    workspace.plans.push(plan);
    const unrelated = startCoaching(workspace, "maya", "fractions", "unrelated", at);
    coachingTurn(workspace, "maya", unrelated.id, "unrelated-1", "2", at);
    expect(lessonProgress(workspace, plan, "maya").status).toBe("Not started");
    const session = startCoaching(workspace, "maya", "fractions", "assigned", at, plan.id);
    const set = questions.filter(q => q.topic === "fractions");
    for (const q of set) {
      coachingTurn(workspace, "maya", session.id, `answer-${q.id}`, q.answer, at);
      if (q !== set.at(-1)) advanceCoaching(workspace, "maya", session.id, at);
    }
    expect(session.completedAt).toBe(at);
    expect(lessonProgress(workspace, plan, "maya")).toMatchObject({ solved: 3, total: 3, status: "Completed" });
    expect(lessonProgress(workspace, plan, "learner-1").status).toBe("Not started");
    expect(() => coachingTurn(workspace, "learner-1", session.id, "forged-1", "9", at)).toThrow();
    expect(() => startCoaching(workspace, "learner-2", "fractions", "forged", at, plan.id)).toThrow("isn’t assigned");
  });
  it("grades correct answers in every supported topic", () => {
    for (const topic of ["place-value", "multiplication", "division", "fractions", "measurement", "geometry"] as const) {
      const workspace = sampleWorkspace();
      const session = startCoaching(workspace, "maya", topic, `session-${topic}`, at);
      coachingTurn(workspace, "maya", session.id, "answer-01", questions.find(q => q.topic === topic)!.answer, at);
      expect(session.messages.at(-1)?.kind).toBe("correct");
      expect(topicOutcomes(workspace, topic).independent).toBe(1);
    }
  });
});
