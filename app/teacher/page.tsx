import { TeacherLiveView } from "@/components/teacher/TeacherLiveView";
import { ViewShell } from "@/components/ui/ViewShell";

export default function TeacherPage() {
  return (
    <ViewShell title="Good morning, Ms. Rivera" owner="Person C · teacher and parent views">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent-strong">Rova teacher</p>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Start with the students who need a small action today.
          </p>
        </div>
        <span className="text-xs text-ink-muted">Simulated class data</span>
      </div>

      <TeacherLiveView />
    </ViewShell>
  );
}
