"use client";
import { interventionLogCsv, progressReport } from "@/lib/product/report";
import type { Profile, Workspace } from "@/lib/product/model";
import { Icon } from "./Brand";
import { Empty } from "./Shared";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function ProgressReport({ workspace, profile }: { workspace: Workspace; profile: Profile }) {
  const report = progressReport(workspace);
  const m = report.metrics;
  function download() {
    const url = URL.createObjectURL(new Blob([interventionLogCsv(report.rows)], { type: "text/csv" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: `rova-intervention-log-${report.generatedAt.slice(0, 10)}.csv` });
    link.click();
    URL.revokeObjectURL(url);
  }
  const tiles: [string, number | string, string][] = [
    ["Coached lessons", m.coachedLessons, `${m.lessonsCompleted} completed · ${plural(m.refreshers, "root-cause refresher")}`],
    ["Questions checked by code", m.questionsChecked, `${m.solvedIndependently} solved independently · ${m.solvedWithSupport} after support`],
    ["Root causes found", m.rootCausesFound, `${plural(m.refreshersCompleted, "refresher")} completed · ${m.solvedAfterTrace} solved afterwards`],
    ["Teacher actions", m.teacherActions, "Shared lessons and planned reteaches"],
    ["Family updates", m.familyUpdates, `${m.automaticFamilyUpdates} automatic · saved in Rova, not texted`],
    ["Safety concerns", m.safetyConcerns, "Flagged for personal check-in"],
  ];
  return <section className="surface progress-report">
    <div className="section-heading"><div><span className="eyebrow">For your principal and MTSS team</span><h2>{report.className} · progress report</h2><p>{profile.name} · Grade 4 mathematics · Generated {new Date(report.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p></div>
      <div className="report-actions"><button className="btn btn-outline" onClick={download} disabled={!report.rows.length}><Icon name="book" size={16}/>Export intervention log (CSV)</button><button className="btn btn-dark" onClick={() => window.print()}>Print report<Icon name="arrow" size={16}/></button></div></div>
    <div className="report-tiles">{tiles.map(([label, value, detail]) => <div key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>)}</div>
    <div className="report-columns">
      <div><h3>Support tiers</h3><p>Priority, below 60% in all six topics: <strong>{report.tiers.priority.join(", ") || "none"}</strong></p><p>Targeted support in at least one topic: <strong>{plural(report.tiers.targeted, "learner")}</strong></p><p>On track in every topic: <strong>{plural(report.tiers.onTrack, "learner")}</strong></p></div>
      <div><h3>Shared gaps</h3>{report.sharedGaps.length ? report.sharedGaps.map((g, i) => <p key={i}>{g.learner}: root cause in <strong>{g.skill.toLowerCase()}</strong>; {plural(g.classmates, "classmate")} show the same low signal.</p>) : <p>No root-cause traces yet.</p>}{report.topicConfidence.filter(t => t.below60).map(t => <p key={t.topic} className="quiet">{t.topic}: {plural(t.below60, "learner")} below 60%</p>)}</div>
    </div>
    <h3>Intervention log</h3>
    {report.rows.length ? <div className="report-table-wrap"><table className="report-table"><thead><tr><th>Learner</th><th>Focus skill</th><th>What was tried</th><th>Date</th><th>Result</th><th>Next step</th></tr></thead><tbody>{report.rows.map((r, i) => <tr key={i}><td>{r.learner}</td><td>{r.focus}</td><td>{r.tried}</td><td>{r.date}</td><td>{r.result}</td><td>{r.next}</td></tr>)}</tbody></table></div>
      : <Empty title="The log fills in as learners practice." text="Each coached lesson, refresher, and teacher action becomes a dated entry you can bring to a data meeting."/>}
    <p className="data-caption">Counts come from saved, code-checked evidence. Support tiers use current confidence, which includes simulated starting profiles. Completion is not a long-term mastery assessment.</p>
  </section>;
}
