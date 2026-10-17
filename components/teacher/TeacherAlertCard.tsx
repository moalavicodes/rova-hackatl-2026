import type { Alert, SkillMap } from "@/lib/types";

interface TeacherAlertCardProps {
  alert: Alert;
  studentName: string;
  skills: SkillMap;
}

export function TeacherAlertCard({ alert, studentName, skills }: TeacherAlertCardProps) {
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
              <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-rose-800">
                Needs action
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-600">
              {skillName} · {alert.skill_id}
            </p>
          </div>

          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">
            Simulated fixture
          </span>
        </div>
      </div>

      <div className="grid gap-6 px-6 py-6 sm:grid-cols-2 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            What Rova noticed
          </p>
          <p className="mt-2 leading-7 text-slate-700">{alert.evidence}</p>
        </div>

        <div className="rounded-2xl bg-slate-950 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-300">
            Root cause
          </p>
          <p className="mt-2 text-xl font-bold">{rootCauseName}</p>
          <p className="mt-1 text-sm text-slate-300">{alert.root_cause}</p>
        </div>
      </div>

      <div className="mx-6 mb-6 rounded-2xl border border-teal-200 bg-teal-50 p-5 sm:mx-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-800">
          Suggested 5-minute reteach
        </p>
        <p className="mt-2 leading-7 text-slate-800">{alert.action}</p>
        <p className="mt-4 font-bold text-teal-900">
          {sharedGapCount} students share this root cause → try a small group
        </p>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-100 px-6 py-5 sm:px-8">
        <button
          type="button"
          disabled
          title="Connects to apply_teacher_action after Person B's data layer lands"
          className="cursor-not-allowed rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white opacity-60"
        >
          Done
        </button>
        <button
          type="button"
          disabled
          title="Connects to apply_teacher_action after Person B's data layer lands"
          className="cursor-not-allowed rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 opacity-60"
        >
          Snooze
        </button>
        <button
          type="button"
          disabled
          title="Connects to apply_teacher_action after Person B's data layer lands"
          className="cursor-not-allowed rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 opacity-60"
        >
          Different strategy
        </button>
        <p className="w-full text-xs text-slate-500">
          Actions become available when the alert service is connected.
        </p>
      </div>
    </article>
  );
}
