import { ClassHeatmap } from "@/components/teacher/ClassHeatmap";
import { LoopTracker } from "@/components/teacher/LoopTracker";
import { TeacherAlertCard } from "@/components/teacher/TeacherAlertCard";
import {
  heatmapSkills,
  simulatedClass,
} from "@/components/teacher/simulatedClassFixture";
import { mayaAlertFixture } from "@/components/teacher/mayaAlertFixture";
import { ViewShell } from "@/components/ui/ViewShell";

export default function TeacherPage() {
  return (
    <ViewShell title="Good morning, Ms. Rivera" owner="Person C · teacher and parent views">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Rova teacher
          </p>
          <p className="mt-2 max-w-2xl text-slate-600">
            Start with the students who need a small action today.
          </p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">
          Simulated fixture
        </span>
      </div>

      <section aria-labelledby="action-inbox-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-700">1 needs action</p>
            <h2 id="action-inbox-heading" className="text-2xl font-bold">
              Action inbox
            </h2>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">About 5 minutes</p>
        </div>

        <TeacherAlertCard alert={mayaAlertFixture} studentName="Maya" />
      </section>

      <LoopTracker alert={mayaAlertFixture} averageDaysToFix={6.2} />

      <ClassHeatmap
        students={simulatedClass}
        skills={heatmapSkills}
        rootCauseId="4.NF.A.1"
      />
    </ViewShell>
  );
}
