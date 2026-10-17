// Owner: Person A. Placeholder from the integration owner's scaffold; replace freely.

import { ComingSoon, ViewShell } from "@/components/ui/ViewShell";

export default function StudentPage() {
  return (
    <ViewShell title="Student · Maya" owner="Person A · student tutor">
      <ComingSoon
        items={[
          "Home: buddy greeting, Today's Mission, skill map",
          "Problem: ratio table, I'm stuck, 3-step hint ladder",
          "Refresher, explain-it-back, win",
        ]}
      />
    </ViewShell>
  );
}
