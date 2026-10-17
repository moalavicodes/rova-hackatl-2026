import { TeacherLiveView } from "@/components/teacher/TeacherLiveView";
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
          Simulated class data
        </span>
      </div>

      <TeacherLiveView />
    </ViewShell>
  );
}
