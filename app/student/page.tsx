import { ViewShell } from "@/components/ui/ViewShell";
import StudentTutor from "@/components/student/StudentTutor";

export default function StudentPage() {
  return (
    <ViewShell title="Student · Maya" owner="Person A · student tutor">
      <StudentTutor />
    </ViewShell>
  );
}
