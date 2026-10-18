import { afterEach, describe, expect, it, vi } from "vitest";
import { coachingTurn, startCoaching } from "./coaching";
import { sampleWorkspace } from "./model";
import { summaryPrompt, writeAiSummary } from "./aiSummary";

function tracedRatios() {
  const workspace = sampleWorkspace();
  const session = startCoaching(workspace, "maya", "ratios", "ratios-1", "2026-10-18");
  coachingTurn(workspace, "maya", session.id, "miss-0001", "7", "2026-10-18");
  coachingTurn(workspace, "maya", session.id, "miss-0002", "8", "2026-10-18");
  return { workspace, session };
}
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("local AI lesson summary", () => {
  it("passes code-checked facts and the transcript without the learner's name", () => {
    const { workspace, session } = tracedRatios();
    const prompt = summaryPrompt(workspace, session);
    expect(prompt).toContain("0 of 3 solved");
    expect(prompt).toContain("traced to Fractions (4.NF.A.1)");
    expect(prompt).toContain("Learner: 7");
    expect(prompt).not.toMatch(/Maya|Chen/);
  });
  it("calls nothing without a configured local model", async () => {
    vi.stubEnv("ROVA_LLM_URL", "");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { workspace, session } = tracedRatios();
    expect(await writeAiSummary(workspace, session, "2026-10-18")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("calls the OpenAI-compatible local server and keeps plain text only", async () => {
    vi.stubEnv("ROVA_LLM_URL", "http://localhost:11434/v1/");
    vi.stubEnv("ROVA_LLM_MODEL", "qwen2.5:3b");
    const fetch = vi.fn(async () => Response.json({ choices: [{ message: { content: "<think>hidden</think>**What happened:** the learner tried." } }] }));
    vi.stubGlobal("fetch", fetch);
    const { workspace, session } = tracedRatios();
    const summary = await writeAiSummary(workspace, session, "2026-10-18");
    expect(summary).toMatchObject({ text: "What happened: the learner tried.", model: "qwen2.5:3b", messageCount: session.messages.length });
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("http://localhost:11434/v1/chat/completions");
    expect(JSON.parse(String(init.body))).toMatchObject({ model: "qwen2.5:3b", stream: false });
    expect(init.headers).not.toHaveProperty("Authorization");
  });
  it("reports a server error so the API can show the scripted summary", async () => {
    vi.stubEnv("ROVA_LLM_URL", "http://localhost:11434/v1");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("model not found", { status: 404 })));
    const { workspace, session } = tracedRatios();
    await expect(writeAiSummary(workspace, session, "2026-10-18")).rejects.toThrow("404");
  });
});
