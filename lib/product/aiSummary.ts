import Anthropic from "@anthropic-ai/sdk";
import { topicById } from "./curriculum";
import { summarizeLesson } from "./insights";
import type { AiSummary, CoachSession, Workspace } from "./model";

// Optional AI-written lesson summary for teachers. Code still decides every fact: the
// counts below come from checked attempts, and the model is told not to contradict them.
// Without credentials the app keeps the scripted summary from insights.ts.
export const SUMMARY_MODEL = process.env.ROVA_SUMMARY_MODEL || "claude-opus-5-5";
export function aiSummaryAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

const SYSTEM = `You write short lesson summaries for a grade 4 math teacher about one coached practice conversation.
Use only the facts and transcript provided. The checked results were computed by code and are authoritative: never say an answer was right or wrong unless the facts say so, and never claim mastery.
Refer to the student as "the learner". Do not diagnose emotions or learning disabilities.
Write three short labeled lines: "What happened:", "Where they needed help:", "Suggested next step:". Under 110 words in total. Plain text, no markdown.`;

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
  if (!aiSummaryAvailable()) return null;
  const client = new Anthropic();
  const response = await client.beta.messages.create({
    model: SUMMARY_MODEL,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    system: SYSTEM,
    messages: [{ role: "user", content: summaryPrompt(workspace, session) }],
  });
  if (response.stop_reason === "refusal") return null;
  const text = response.content.flatMap(block => block.type === "text" ? [block.text] : []).join("\n").trim();
  return text ? { text, model: response.model, at, messageCount: session.messages.length } : null;
}
