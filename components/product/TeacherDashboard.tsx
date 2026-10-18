"use client";
import { useMemo, useState } from "react";
import { topicById, topics, type TopicId } from "@/lib/product/curriculum";
import type { Learner, Profile, Workspace } from "@/lib/product/model";
import {
  classStatuses,
  countByStatus,
  momentumHistory,
  planImpact,
  statusLabel,
  topicStatusCounts,
  type Status,
} from "@/lib/product/progress";
import { needYouToday, topReteach, whyLine } from "@/lib/product/why";
import { Icon } from "./Brand";
import { MomentumChart, Sparkline, StatusBadge, StatusBar, StatusLegend } from "./charts";
import { ClassroomLearningChart, LessonMonitor } from "./LearningEvidence";
import { ProgressReport, type ReportFilters } from "./ProgressReport";
import { RootCauseAlerts } from "./RootCauseAlerts";
import { SafetyConcerns } from "./SafetyConcerns";
import { Avatar, Empty, Modal, type Mutate } from "./Shared";
import { StudentInsight } from "./StudentInsight";

const goTo = (section: string) => {
  window.location.hash = section;
};

export function TeacherDashboard({
  profile,
  workspace,
  section,
  mutate,
}: {
  profile: Profile;
  workspace: Workspace;
  section: string;
  mutate: Mutate;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [topicFilter, setTopicFilter] = useState<TopicId | "all">("all");
  const [selected, setSelected] = useState<Learner | null>(null);
  const [group, setGroup] = useState<TopicId | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [reportFilters, setReportFilters] = useState<ReportFilters>({ status: "all", topic: "all" });

  const statuses = useMemo(() => classStatuses(workspace), [workspace]);
  const counts = countByStatus(statuses);
  const history = useMemo(() => momentumHistory(workspace), [workspace]);
  const byTopic = useMemo(() => topicStatusCounts(workspace), [workspace]);
  const today = needYouToday(workspace, statuses);
  const reteach = topReteach(workspace, statuses);
  const impacts = workspace.plans.map((p) => planImpact(workspace, p));
  const tried = impacts.filter((i) => i.verdict !== "No practice yet");
  const improved = tried.filter((i) => i.verdict === "Improved").length;

  function openGroup(topic: TopicId, preset?: string[]) {
    setGroup(topic);
    setMembers(
      preset ??
        statuses
          .filter((s) => ["behind", "stagnant"].includes(s.topics.find((t) => t.topic === topic)!.status))
          .map((s) => s.student.id),
    );
  }
  async function createPlan() {
    if (!group || busy || !members.length) return;
    setBusy(true);
    const result = await mutate({ action: "plan", topic: group, studentIds: members });
    if (result) {
      setFeedback(`${topicById(group).name} lesson shared with ${members.length} learner${members.length === 1 ? "" : "s"}.`);
      setGroup(null);
    }
    setBusy(false);
  }
  function openReport(filters: Partial<ReportFilters>) {
    setReportFilters({ status: "all", topic: "all", ...filters });
    goTo("report");
  }

  const visible = statuses.filter(
    (s) =>
      s.student.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "all" || s.status === statusFilter) &&
      (topicFilter === "all" || ["behind", "stagnant"].includes(s.topics.find((t) => t.topic === topicFilter)!.status)),
  );

  return (
    <>
      <SafetyConcerns workspace={workspace} />
      {section === "overview" && (
        <div className="page-heading compact-heading">
          <div>
            <h1>Good to see you, {profile.name.split(" ")[0]}.</h1>
          </div>
          <div className="class-select">
            <Icon name="people" size={18} />
            <div>
              <strong>{workspace.name}</strong>
              <span>Grade 4 · {workspace.students.length} learners</span>
            </div>
          </div>
        </div>
      )}
      {feedback && (
        <div className="inline-success" role="status">
          <Icon name="check" size={18} />
          {feedback}
          <button onClick={() => setFeedback("")} aria-label="Dismiss">
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      {section === "overview" && (
        <>
          <section className="kpi-row" aria-label="Today at a glance">
            <article className="kpi">
              <h2>Need you today</h2>
              <strong className="kpi-value">{today.length}</strong>
              <ul className="kpi-people">
                {today.slice(0, 3).map((p) => (
                  <li key={p.student.id}>
                    <button onClick={() => setSelected(p.student)}>
                      <Avatar name={p.student.name} id={p.student.id} color={p.student.avatar} small />
                      <span>
                        {p.student.name.split(" ")[0]}
                        <small>{p.reason}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {today.length > 3 && (
                <button className="text-link" onClick={() => openReport({ status: "stagnant" })}>
                  See all {today.length}
                </button>
              )}
            </article>

            <article className="kpi">
              <h2>Class momentum</h2>
              <p className="kpi-split">
                {(["on_track", "behind", "stagnant"] as Status[]).map((s) => (
                  <button key={s} onClick={() => openReport({ status: s })}>
                    <strong>{counts[s]}</strong> {statusLabel[s].toLowerCase()}
                  </button>
                ))}
              </p>
              <StatusBar counts={counts} label="Learners by status today" onSelect={(s) => openReport({ status: s })} />
              <small className="kpi-note">Target 70% by the unit’s end</small>
            </article>

            <article className="kpi">
              <h2>Reteach next</h2>
              {reteach ? (
                <>
                  <strong className="kpi-topic">{reteach.topic.name}</strong>
                  <p>
                    {reteach.students.length} learners behind or stagnant
                    {!reteach.reason.endsWith("behind or stagnant") && <small>{reteach.reason}</small>}
                  </p>
                  <button className="btn btn-dark btn-small" onClick={() => openGroup(reteach.topic.id)}>
                    Build a small group
                    <Icon name="arrow" size={15} />
                  </button>
                </>
              ) : (
                <p>Every topic is on track.</p>
              )}
            </article>

            <article className="kpi">
              <h2>Is it working?</h2>
              {tried.length ? (
                <>
                  <strong className="kpi-value">
                    {improved}
                    <small> of {tried.length}</small>
                  </strong>
                  <p>group lessons improved confidence</p>
                </>
              ) : (
                <p>{workspace.plans.length ? "Waiting for learners to practice" : "No group lessons yet"}</p>
              )}
              <button className="text-link" onClick={() => goTo("plans")}>
                See lessons
              </button>
            </article>
          </section>

          <RootCauseAlerts workspace={workspace} mutate={mutate} onGroup={openGroup} />

          <section className="surface">
            <div className="section-heading">
              <div>
                <h2>Topics by status</h2>
                <p>Select a segment to see those learners.</p>
              </div>
              <StatusLegend />
            </div>
            <div className="topic-status-chart">
              {byTopic.map((row) => (
                <div key={row.topic.id} className="topic-status-row">
                  <span className="topic-status-name">
                    <span className={`topic-symbol small ${row.topic.color}`}>{row.topic.symbol}</span>
                    {row.topic.name}
                  </span>
                  <StatusBar
                    counts={row.counts}
                    label={row.topic.name}
                    onSelect={(status) => openReport({ status, topic: row.topic.id })}
                  />
                </div>
              ))}
            </div>
            <p className="data-caption">Before today, trends use each learner’s simulated history.</p>
          </section>
        </>
      )}

      {section === "classroom" && (
        <section className="surface class-map" id="class-map">
          <div className="map-tools">
            <label className="search-field">
              <Icon name="search" size={17} />
              <input placeholder="Find a learner" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search learners" />
            </label>
            <div className="chip-filter" role="group" aria-label="Filter by status">
              {(["all", "stagnant", "behind", "on_track"] as const).map((s) => (
                <button key={s} aria-pressed={statusFilter === s} onClick={() => setStatusFilter(s)}>
                  {s === "all" ? `All ${statuses.length}` : `${statusLabel[s]} ${counts[s]}`}
                </button>
              ))}
            </div>
            <select aria-label="Show learners who need support in a topic" value={topicFilter} onChange={(e) => setTopicFilter(e.target.value as TopicId | "all")}>
              <option value="all">Any topic</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  Needs support: {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="learner-card-grid">
            {visible.map((s) => {
              const line = whyLine(workspace, s);
              return (
                <button
                  key={s.student.id}
                  className={`learner-card status-card-${s.status}`}
                  onClick={() => setSelected(s.student)}
                  aria-label={`Open ${s.student.name}: ${statusLabel[s.status]}`}
                >
                  <header>
                    <Avatar name={s.student.name} id={s.student.id} color={s.student.avatar} />
                    <strong>{s.student.name}</strong>
                    <StatusBadge status={s.status} />
                  </header>
                  {s.focus && (
                    <div className="learner-card-trend">
                      <span>
                        {topicById(s.focus.topic).name}
                        <strong>{s.focus.score}%</strong>
                      </span>
                      <Sparkline points={s.focus.points} label={`${topicById(s.focus.topic).name} trend`} />
                    </div>
                  )}
                  <p>{line ?? "On track in every topic"}</p>
                </button>
              );
            })}
          </div>
          {!visible.length && <Empty title="No learners match." text="Try another name, status, or topic." />}
          <div className="map-footer">
            <span>Status compares each learner’s pace with the 70% target by the unit’s end.</span>
            <span>
              Class code <strong>{workspace.code}</strong>
            </span>
          </div>
        </section>
      )}

      {section === "progress" && (
        <>
          <section className="surface">
            <div className="section-heading">
              <div>
                <h2>Class momentum</h2>
                <p>Each learner’s overall status at the unit start and today.</p>
              </div>
            </div>
            <MomentumChart history={history} onSelect={(s) => openReport({ status: s })} />
          </section>
          <ClassroomLearningChart workspace={workspace} />
        </>
      )}

      {section === "plans" && (
        <>
          <RootCauseAlerts workspace={workspace} mutate={mutate} onGroup={openGroup} />
          {impacts.length > 0 && (
            <section className="surface">
              <div className="section-heading">
                <div>
                  <h2>Is it working?</h2>
                  <p>Confidence before each group lesson versus now, for learners who practiced since.</p>
                </div>
              </div>
              <ul className="impact-list">
                {impacts.map((i) => (
                  <li key={i.plan.id}>
                    <strong>{topicById(i.plan.topic).name}</strong>
                    <span>{i.members.length} learners · {new Date(i.plan.at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span>
                      {i.practiced ? `${i.improved} of ${i.practiced} who practiced rose 5+ points` : "Nobody has practiced yet"}
                    </span>
                    <span className={`impact-verdict verdict-${i.verdict.replace(/ /g, "-").toLowerCase()}`}>{i.verdict}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <LessonMonitor workspace={workspace} onCreate={() => openGroup(reteach?.topic.id ?? "fractions")} />
        </>
      )}

      {section === "report" && (
        <ProgressReport
          workspace={workspace}
          profile={profile}
          filters={reportFilters}
          onFilters={setReportFilters}
          onOpenStudent={setSelected}
        />
      )}

      {group && (
        <Modal title={`${topicById(group).name} lesson`} onClose={() => setGroup(null)}>
          <div className="group-dialog">
            <label htmlFor="lesson-topic">Topic</label>
            <select id="lesson-topic" value={group} onChange={(e) => openGroup(e.target.value as TopicId)}>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <h3>{topicById(group).activity}</h3>
            <p>Three coached questions · about 5–10 minutes</p>
            <h4>Group · {members.length} selected</h4>
            <p>Learners behind or stagnant in this topic are preselected.</p>
            <div className="group-member-list">
              {statuses.map((s) => {
                const t = s.topics.find((x) => x.topic === group)!;
                return (
                  <label key={s.student.id}>
                    <input
                      type="checkbox"
                      checked={members.includes(s.student.id)}
                      onChange={(e) =>
                        setMembers((current) =>
                          e.target.checked ? [...current, s.student.id] : current.filter((id) => id !== s.student.id),
                        )
                      }
                    />
                    <Avatar name={s.student.name} id={s.student.id} color={s.student.avatar} small />
                    <span>{s.student.name}</span>
                    <StatusBadge status={t.status} />
                  </label>
                );
              })}
            </div>
            <button className="btn btn-dark" onClick={createPlan} disabled={busy || !members.length}>
              {busy ? "Sharing…" : "Share with this group"}
              <Icon name="arrow" size={17} />
            </button>
          </div>
        </Modal>
      )}

      {selected && (
        <StudentInsight
          workspace={workspace}
          student={selected}
          onClose={() => setSelected(null)}
          onAssign={(topic, ids) => {
            setSelected(null);
            openGroup(topic, ids);
          }}
          mutate={mutate}
          onShared={setFeedback}
        />
      )}
    </>
  );
}
