import { topicById } from "./curriculum";
import { summarizeLesson } from "./insights";
import type { AiSummary, CoachSession, Workspace } from "./model";

// Optional AI-written lesson summary for teachers, from a small open model the school runs
// itself (Ollama by default; any OpenAI-compatible server such as LM Studio or llama.cpp works).
// No paid API and no key. Code still decides every fact: the counts below come from checked
// attempts, and the model is told not to contradict them. With no server configured the app
// keeps the scripted summary from insights.ts.
export function localModelConfig() {
  const url = process.env.ROVA_LLM_URL?.replace(/\/+$/, "");
  return url ? { url, model: process.env.ROVA_LLM_MODEL || "qwen2.5:3b" } : null;
}
export function aiSummaryAvailable(): boolean {
  return localModelConfig() !== null;
}

const SYSTEM = `You write short lesson summaries for a grade 4 math teacher about one coached practice conversation.
Use only the facts and transcript provided. The checked results were computed by code and are authoritative: never say an answer was right or wrong unless the facts say so, and never claim mastery.
Refer to the student as "the learner". Do not diagnose emotions or learning disabilities.
Write exactly three short lines that start with "What happened:", "Where they needed help:", and "Suggested next step:". Under 110 words in total. Plain text, no markdown.`;

// Names are left out of the prompt; the transcript uses role labels only.
export function summaryPrompt(workspace: Workspace, session: CoachSession): string {
  const facts = summarizeLesson(workspace, session);
  const topic = topicById(session.topic);
  const trace = session.trace ? `Root cause found by code: repeated misses traced to ${topicById(session.trace.prerequisite).name} (${session.trace.standard}). Refresher completed: ${session.trace.refresherCompletedAt ? "yes" : "no"}. Original question solved afterwards: ${session.trace.fixedAt ? "yes" : "no"}.` : "No root-cause trace.";
  const transcript = session.messages.map(m => `${m.role === "coach" ? "Rova" : "Learner"}${m.kind ? ` [${m.kind}]` : ""}: ${m.text}`).join("\n");
  return `Topic: ${topic.name} (${topic.standard})
Checked results (by code): ${facts.solved} of ${facts.total} solved; ${facts.independent} on the first try without support; ${facts.corrected} corrected after a retry. Hints and retry nudges: ${facts.nudges}. Concept explanations: ${facts.explanations}. Redirects: ${facts.redirects}. Safety concern flagged: ${facts.safety ? "yes" : "no"}.
${trace}

Transcript:
${transcript}`;
}

export async function writeAiSummary(workspace: Workspace, session: CoachSession, at: string): Promise<AiSummary | null> {
  const config = localModelConfig();
  if (!config) return null;
  // Small models on a laptop CPU can be slow; give up rather than leave the teacher waiting.
  const response = await fetch(`${config.url}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      max_tokens: 300,
      stream: false,
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content: summaryPrompt(workspace, session) }],
    }),
  });
  if (!response.ok) throw new Error(`Local model returned ${response.status}`);
  const data = await response.json() as { choices?: { message?: { content?: unknown } }[] };
  const content = data.choices?.[0]?.message?.content;
  // Keep only plain text, trimmed to a teacher-sized summary.
  const text = typeof content === "string" ? content.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/[*#`]/g, "").trim().slice(0, 1200) : "";
  return text ? { text, model: config.model, at, messageCount: session.messages.length } : null;
}
