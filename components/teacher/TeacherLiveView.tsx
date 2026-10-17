"use client";

// Teacher view on live data (integration owner wiring, at Person C's request): alerts come from
// the shared browser store, actions go through apply_teacher_action, and the loop tracker's
// fast-forward runs run_recheck at the alert's scheduled time (the simulated 7-day jump).

import Link from "next/link";
import { ClassHeatmap } from "@/components/teacher/ClassHeatmap";
import { LoopTracker } from "@/components/teacher/LoopTracker";
import { TeacherAlertCard } from "@/components/teacher/TeacherAlertCard";
import { recheck, teacherAction, useRovaState } from "@/lib/data/store";

export function TeacherLiveView() {
  const state = useRovaState();
  const studentAlerts = state.alerts.filter((a) => a.signal !== "class_gap");
  const needsAction = studentAlerts.filter((a) => a.status === "open");
  // Newest first; the loop tracker follows the newest alert.
  const inbox = [...state.alerts].reverse();
  const tracked = studentAlerts.at(-1) ?? null;
  const nameOf = (id: string) => state.students.find((s) => s.id === id)?.first_name ?? id;

  return (
    <>
      <section aria-labelledby="action-inbox-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-700">{needsAction.length} needs action</p>
            <h2 id="action-inbox-heading" className="text-2xl font-bold">
              Action inbox
            </h2>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">About 5 minutes</p>
        </div>

        {inbox.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">
            <p className="font-semibold text-slate-900">No alerts yet.</p>
            <p className="mt-1 text-sm">
              Alerts appear here when a student repeats a mistake or gets stuck. Try it in the{" "}
              <Link href="/student" className="font-semibold text-teal-700 hover:underline">
                Student view
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {inbox.map((alert) => (
              <TeacherAlertCard
                key={alert.id}
                alert={alert}
                studentName={nameOf(alert.student_id)}
                skills={state.skillMap}
                badge="Live"
                onAction={(action) => teacherAction(alert.id, action)}
              />
            ))}
          </div>
        )}
      </section>

      {tracked && (
        <LoopTracker
          alert={tracked}
          averageDaysToFix={6.2}
          onFastForward={() =>
            recheck(tracked.id, tracked.recheck_at ? new Date(tracked.recheck_at) : undefined)
          }
        />
      )}

      <ClassHeatmap
        alert={tracked}
        classroom={state.classroom}
        students={state.students}
        skillMap={state.skillMap}
        skillStates={state.skillStates}
      />
    </>
  );
}
