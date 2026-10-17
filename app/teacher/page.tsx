// Owner: Person C. Placeholder from the integration owner's scaffold; replace freely.

import { ComingSoon, ViewShell } from "@/components/ui/ViewShell";

export default function TeacherPage() {
  return (
    <ViewShell title="Teacher · Ms. Rivera" owner="Person C · teacher and parent views">
      <ComingSoon
        items={[
          "Action inbox: alert cards with Done / Snooze / Different strategy",
          "Class heatmap (Simulated class)",
          "Loop tracker with the 7-day fast-forward",
          "Review queue",
        ]}
      />
    </ViewShell>
  );
}
