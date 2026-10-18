import { describe, expect, it } from "vitest";
import { coachingTurn, startCoaching } from "./coaching";
import { sampleWorkspace } from "./model";
import { summaryPrompt } from "./aiSummary";

describe("AI lesson summary prompt", () => {
  it("passes code-checked facts and the transcript without the learner's name", () => {
    const workspace = sampleWorkspace();
    const session = startCoaching(workspace, "maya", "ratios", "ratios-1", "2026-10-18");
    coachingTurn(workspace, "maya", session.id, "miss-0001", "7", "2026-10-18");
    coachingTurn(workspace, "maya", session.id, "miss-0002", "8", "2026-10-18");
    const prompt = summaryPrompt(workspace, session);
    expect(prompt).toContain("0 of 3 solved");
    expect(prompt).toContain("traced to Fractions (4.NF.A.1)");
    expect(prompt).toContain("Learner: 7");
    expect(prompt).not.toMatch(/Maya|Chen/);
  });
});
