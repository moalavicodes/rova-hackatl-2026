import { ViewShell } from "@/components/ui/ViewShell";
import StudentTutor from "@/components/student/StudentTutor";
import { studentTemplates } from "@/content/templates";
import { maya } from "@/lib/data/seed";
import { callLLM } from "@/lib/llm";

export default function StudentPage() {
  const welcomeMessage = callLLM(
    "welcome_back",
    { name: maya.first_name },
    studentTemplates,
  );

  return (
    <ViewShell title="Student · Maya" owner="Person A · student tutor">
      <StudentTutor welcomeMessage={welcomeMessage} />
    </ViewShell>
  );
}
