import type { SkillId, SkillState } from "@/lib/types";

export interface HeatmapSkill {
  id: SkillId;
  shortName: string;
}

export interface SimulatedClassStudent {
  id: string;
  name: string;
  skills: SkillState[];
}

export const heatmapSkills: HeatmapSkill[] = [
  { id: "6.RP.A.3", shortName: "Ratio tables" },
  { id: "6.RP.A.1", shortName: "Understand ratios" },
  { id: "4.NF.A.1", shortName: "Equivalent fractions" },
];

const students = [
  ["maya", "Maya"],
  ["student-02", "Alina"],
  ["student-03", "Jordan"],
  ["student-04", "Theo"],
  ["student-05", "Camila"],
  ["student-06", "Noah"],
  ["student-07", "Avery"],
  ["student-08", "Mateo"],
  ["student-09", "Priya"],
  ["student-10", "Liam"],
  ["student-11", "Zoe"],
  ["student-12", "Eli"],
  ["student-13", "Sofia"],
  ["student-14", "Micah"],
  ["student-15", "Layla"],
  ["student-16", "Owen"],
  ["student-17", "Nia"],
  ["student-18", "Lucas"],
  ["student-19", "Emma"],
  ["student-20", "Kai"],
  ["student-21", "Isabel"],
  ["student-22", "Amir"],
  ["student-23", "Grace"],
  ["student-24", "Leo"],
  ["student-25", "Ruby"],
] as const;

export const equivalentFractionGapStudentIds = new Set([
  "maya",
  "student-02",
  "student-03",
  "student-04",
  "student-05",
]);

const lastSeen = "2026-10-17T18:45:00-04:00";

function masteryFor(studentId: string, skillId: SkillId, index: number): number {
  if (skillId === "4.NF.A.1" && equivalentFractionGapStudentIds.has(studentId)) {
    return 0.32 + (index % 3) * 0.05;
  }

  if (skillId === "6.RP.A.3") {
    return 0.52 + (index % 6) * 0.08;
  }

  if (skillId === "6.RP.A.1") {
    return 0.64 + (index % 4) * 0.08;
  }

  return 0.7 + (index % 4) * 0.07;
}

export const simulatedClass: SimulatedClassStudent[] = students.map(
  ([id, name], index) => ({
    id,
    name,
    skills: heatmapSkills.map((skill) => ({
      student_id: id,
      skill_id: skill.id,
      mastery: Math.min(masteryFor(id, skill.id, index), 0.98),
      misconceptions:
        skill.id === "4.NF.A.1" && equivalentFractionGapStudentIds.has(id)
          ? ["adds-across-ratio-table"]
          : [],
      last_seen: lastSeen,
    })),
  }),
);
