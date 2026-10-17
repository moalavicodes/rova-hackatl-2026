// Seeded demo state. Maya's earlier-grade history is Simulated (README section 8).
// Persona facts come from README section 1 (Maya, 11, 6th grade; mom's first language is Spanish).
// TODO(team): buddy_name and interests are not in the README yet; agree on them and update here.

import type { LearnerProfile, Student } from "@/lib/types";

const SEED_TIME = "2026-10-17T19:00:00.000Z";

export const maya: Student = {
  id: "maya",
  first_name: "Maya",
  grade: 6,
  buddy_name: "Rova", // placeholder until the team picks the buddy's name
  language_home: "es",
  interests: [], // placeholder until the team picks them
};

// "Fractions were tricky last time" (README section 8, step 1): equivalent fractions start weak.
export const mayaProfile: LearnerProfile = {
  student: maya,
  skills: [
    { student_id: "maya", skill_id: "6.RP.A.3", mastery: 0, misconceptions: [], last_seen: SEED_TIME },
    { student_id: "maya", skill_id: "6.RP.A.1", mastery: 0.6, misconceptions: [], last_seen: SEED_TIME },
    { student_id: "maya", skill_id: "4.NF.A.1", mastery: 0.3, misconceptions: [], last_seen: SEED_TIME },
    { student_id: "maya", skill_id: "3.NF.A.3", mastery: 0.8, misconceptions: [], last_seen: SEED_TIME },
    { student_id: "maya", skill_id: "3.OA.C.7", mastery: 0.9, misconceptions: [], last_seen: SEED_TIME },
  ],
  preferences: [],
};
