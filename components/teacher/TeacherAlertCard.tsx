import type { Alert, AlertStatus, SkillMap, TeacherAction } from "@/lib/types";

interface TeacherAlertCardProps {
  alert: Alert;
  studentName: string;
  skills: SkillMap;
  onAction?: (action: TeacherAction) => void; // wired to apply_teacher_action by the live view
  badge?: string;
}

const statusBadges: Record<AlertStatus, { label: string; className: string }> = {
  open: { label: "Needs action", className: "bg-rose-100 text-rose-800" },
  acted: { label: "Waiting for re-check", className: "bg-sky-100 text-sky-800" },
  verified: { label: "Fixed", className: "bg-emerald-100 text-emerald-800" },
  escalated: { label: "Escalated", className: "bg-amber-100 text-amber-900" },
};

export function TeacherAlertCard({
  alert,
  studentName,
  skills,
  onAction,
  badge = "Simulated fixture",
}: TeacherAlertCardProps) {
  const isReport = alert.signal === "safety_concern" || alert.signal === "student_question";
  const status =
    isReport && alert.status === "verified"
      ? { label: "Closed", className: "bg-slate-100 text-slate-700" }
      : statusBadges[alert.status];
  const reportLabel =
    alert.signal === "safety_concern" ? "Safety concern" : alert.signal === "student_question" ? "Question for you" : null;
  const canAct = Boolean(onAction) && (alert.status === "open" || alert.status === "acted");
  const actionTitle = canAct ? undefined : onAction ? "This alert is closed" : "Connects to apply_teacher_action";
  const sharedGapCount = alert.others_with_gap.length + 1;
  const skillName = skills[alert.skill_id]?.name ?? alert.skill_id;
  const rootCauseName = alert.root_cause
    ? (skills[alert.root_cause]?.name ?? alert.root_cause)
    : "Still checking";

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_-32px_rgba(15,23,42,0.45)]">
      <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-white px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-bold">{studentName}</h3>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${status.className}`}>
                {status.label}
              </span>
              {reportLabel && (
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                    alert.signal === "safety_concern" ? "bg-rose-600 text-white" : "bg-indigo-100 text-indigo-800"
                  }`}
                >
                  {reportLabel}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm font-medium text-slate-600">
              {skillName} · {alert.skill_id}
            </p>
          </div>

          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">
            {badge}
          </span>
        </div>
      </div>

      <div className={`grid gap-6 px-6 py-6 sm:px-8 ${isReport ? "" : "sm:grid-cols-2"}`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {isReport ? "What the student wrote" : "What Rova noticed"}
          </p>
          <p className="mt-2 leading-7 text-slate-700">{alert.evidence}</p>
        </div>

        {!isReport && (
          <div className="rounded-2xl bg-slate-950 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-300">
              Root cause
            </p>
            <p className="mt-2 text-xl font-bold">{rootCauseName}</p>
            <p className="mt-1 text-sm text-slate-300">{alert.root_cause}</p>
          </div>
        )}
      </div>

      <div className="mx-6 mb-6 rounded-2xl border border-teal-200 bg-teal-50 p-5 sm:mx-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-800">
          {isReport ? "Suggested next step" : "Suggested 5-minute reteach"}
        </p>
        <p className="mt-2 leading-7 text-slate-800">{alert.action}</p>
        {alert.others_with_gap.length > 0 && (
          <p className="mt-4 font-bold text-teal-900">
            {sharedGapCount} students share this root cause → try a small group
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-100 px-6 py-5 sm:px-8">
        <button
          type="button"
          disabled={!canAct}
          onClick={() => onAction?.("done")}
          title={actionTitle}
          className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Done
        </button>
        <button
          type="button"
          disabled={!canAct}
          onClick={() => onAction?.("snooze")}
          title={actionTitle}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Snooze
        </button>
        {!isReport && (
          <button
            type="button"
            disabled={!canAct}
            onClick={() => onAction?.("different_strategy")}
            title={actionTitle}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Different strategy
          </button>
        )}
        {!onAction && (
          <p className="w-full text-xs text-slate-500">
            Actions become available when the alert service is connected.
          </p>
        )}
      </div>
    </article>
  );
}
