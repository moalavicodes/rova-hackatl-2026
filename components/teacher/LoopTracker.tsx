"use client";

import type { Alert, AlertStatus } from "@/lib/types";

interface LoopTrackerProps {
  alert: Alert;
  averageDaysToFix: number;
  onFastForward?: () => void;
  isRunningRecheck?: boolean;
}

interface LoopStep {
  id: "open" | "acted" | "verified";
  label: string;
  detail: string;
}

const loopSteps: LoopStep[] = [
  { id: "open", label: "Detected", detail: "Rova found the learning gap" },
  { id: "acted", label: "Teacher acted", detail: "A short reteach is recorded" },
  { id: "verified", label: "Verified", detail: "A recheck confirms mastery" },
];

export function loopStageIndex(status: AlertStatus): number {
  if (status === "verified" || status === "escalated") return 2;
  if (status === "acted") return 1;
  return 0;
}

function recheckLabel(alert: Alert): string {
  if (!alert.recheck_at) return "Scheduled after the teacher records an action";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(new Date(alert.recheck_at));
}

export function LoopTracker({
  alert,
  averageDaysToFix,
  onFastForward,
  isRunningRecheck = false,
}: LoopTrackerProps) {
  const currentStage = loopStageIndex(alert.status);
  const canRunRecheck = alert.status === "acted" && Boolean(onFastForward);
  const isVerified = alert.status === "verified";
  const isEscalated = alert.status === "escalated";

  return (
    <section aria-labelledby="loop-tracker-heading" className="mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="loop-tracker-heading" className="text-2xl font-bold">
              Intervention loop
            </h2>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">
              7-day jump · Simulated
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Track the issue from first signal through a verified fix.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm">
          <p className="text-2xl font-black text-slate-950">{averageDaysToFix.toFixed(1)}</p>
          <p className="text-xs font-semibold text-slate-500">avg. days to fix · Simulated</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <ol className="grid gap-3 sm:grid-cols-3" aria-label="Alert progress">
          {loopSteps.map((step, index) => {
            const isComplete = index < currentStage || (isVerified && index === currentStage);
            const isCurrent = index === currentStage && !isVerified;

            return (
              <li
                key={step.id}
                aria-current={isCurrent ? "step" : undefined}
                className={`relative rounded-2xl border p-4 ${
                  isComplete
                    ? "border-emerald-200 bg-emerald-50"
                    : isCurrent
                      ? "border-teal-300 bg-teal-50"
                      : "border-slate-200 bg-slate-50"
                }`}
              >
                <div
                  className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
                    isComplete
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                        ? "bg-teal-700 text-white"
                        : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isComplete ? "✓" : index + 1}
                </div>
                <p className="font-bold text-slate-950">{step.label}</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">{step.detail}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-300">
              Next recheck
            </p>
            <p className="mt-1 font-bold">{recheckLabel(alert)}</p>
            {isVerified ? (
              <p className="mt-2 text-sm font-semibold text-emerald-300">
                Mastered ✓ · parent notified
              </p>
            ) : null}
            {isEscalated ? (
              <p className="mt-2 text-sm font-semibold text-amber-300">
                Not mastered yet · a different strategy is needed
              </p>
            ) : null}
          </div>

          <button
            type="button"
            disabled={!canRunRecheck || isRunningRecheck}
            onClick={onFastForward}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 enabled:hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
            title={
              onFastForward
                ? "Runs the deterministic recheck with a simulated future date"
                : "Available when Person B's recheck service is connected"
            }
          >
            {isRunningRecheck ? "Running recheck…" : "Fast-forward 7 days"}
          </button>
        </div>

        {!onFastForward ? (
          <p className="mt-3 text-xs text-slate-500">
            Recheck control will unlock when the shared alert service is connected.
          </p>
        ) : null}
      </div>
    </section>
  );
}
