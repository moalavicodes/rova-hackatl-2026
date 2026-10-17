import { ParentLiveView } from "@/components/parent/ParentLiveView";
import { ViewShell } from "@/components/ui/ViewShell";

export default function ParentPage() {
  return (
    <ViewShell title="Aprender en casa" owner="Person C · teacher and parent views" narrow>
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">
          Rova familia
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Una actividad corta para acompañar a Maya esta semana.
        </p>
      </header>

      <ParentLiveView studentId="maya" />
    </ViewShell>
  );
}
