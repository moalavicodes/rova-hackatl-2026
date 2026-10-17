// Owner: Person C. Placeholder from the integration owner's scaffold; replace freely.

import { ComingSoon, ViewShell } from "@/components/ui/ViewShell";

export default function ParentPage() {
  return (
    <ViewShell title="Parent · Maya's mom" owner="Person C · teacher and parent views" narrow>
      <ComingSoon
        items={[
          "Text message mock-up in Spanish (Simulated delivery)",
          "Weekly card: learned · working on · try at home",
          "Win message",
        ]}
      />
    </ViewShell>
  );
}
