import { ParentWinMessage } from "@/components/parent/ParentWinMessage";
import { ParentSmsMockup } from "@/components/parent/ParentSmsMockup";
import { WeeklyLearningCard } from "@/components/parent/WeeklyLearningCard";
import {
  mayaActivityMessageFixture,
  mayaWeeklyMessageFixture,
  mayaWinMessageFixture,
  recipeRatioActivity,
} from "@/components/parent/mayaActivityMessageFixture";
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

      <ParentSmsMockup message={mayaActivityMessageFixture} />

      <WeeklyLearningCard
        message={mayaWeeklyMessageFixture}
        learned="Comparar fracciones simples"
        workingOn="Usar fracciones equivalentes en tablas de razones"
        tryAtHome={recipeRatioActivity}
      />

      <ParentWinMessage message={mayaWinMessageFixture} />
    </ViewShell>
  );
}
