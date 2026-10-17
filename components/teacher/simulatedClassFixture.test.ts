import { describe, expect, it } from "vitest";

import {
  equivalentFractionGapStudentIds,
  heatmapSkills,
  simulatedClass,
} from "@/components/teacher/simulatedClassFixture";

describe("simulated class fixture", () => {
  it("contains the 25-student class promised by the demo", () => {
    expect(simulatedClass).toHaveLength(25);
    expect(new Set(simulatedClass.map((student) => student.id)).size).toBe(25);
  });

  it("gives every student one state for every displayed skill", () => {
    for (const student of simulatedClass) {
      expect(student.skills).toHaveLength(heatmapSkills.length);
      expect(student.skills.every((state) => state.student_id === student.id)).toBe(true);
    }
  });

  it("models exactly Maya and four classmates with the equivalent-fractions gap", () => {
    const studentsWithGap = simulatedClass.filter((student) => {
      const state = student.skills.find((skill) => skill.skill_id === "4.NF.A.1");
      return state ? state.mastery < 0.5 : false;
    });

    expect(studentsWithGap.map((student) => student.id)).toEqual(
      Array.from(equivalentFractionGapStudentIds),
    );
    expect(studentsWithGap).toHaveLength(5);
  });
});
