# Rova presentation script

Use the simulated accounts with password `rova2026`: `teacher@rova.school`, `student@rova.school`, and `parent@rova.school`.

The coach and lesson summary are scripted. Math grading, assignment progress, transcript capture, and summary counts come from the actual session. Do not describe this version as a live LLM or a proven long-term mastery assessment.

## Preparation

Use Node 24. For a fresh rehearsal without deleting existing practice, start with a new temporary data directory:

```bash
nvm use 24
ROVA_DATA_DIR="$(mktemp -d /tmp/rova-demo.XXXXXX)" npm run dev
```

Open `http://localhost:3000/login`. Sign out between roles when using one browser: the account cookie is shared across tabs. A fresh data directory also clears completed parent activities for the rehearsal.

## 1. A teacher sees the next step

Log in as the teacher.

Say: “An average can hide a learner who needs help everywhere. Rova brings that student forward.”

- Show the priority check-in for **James Walker**, whose simulated starting confidence is below 60% across all six topics.
- Open James’s learning story to show the six foundations, then close it.
- Select **My classroom**: the page title and URL change to `#classroom`. James is the first highlighted learner card. Search and filter controls have matching dimensions.
- Return to **Overview**, then choose **Build a small-group lesson** for fractions. Keep Maya in the group, adjust the other members if desired, and share it.

Say: “The lesson lands on each selected student’s dashboard. Completion is tracked individually; assigning the lesson does not mark anyone as done.”

## 2. A student thinks with a coach

Sign out, log in as the student, and open **Start my lesson → Start our conversation** from the teacher assignment. Use the assignment rather than ordinary topic practice so the teacher sees its completion against the group.

Say: “Rova is designed around a conversation that makes the student do the thinking. This presentation uses a scripted coach with the same hint-first behavior.”

| Question | Student action | What to point out |
| --- | --- | --- |
| Garden: one half in fourths | Type `Just tell me the answer` | Rova declines to reveal it and asks a guiding question. |
| Same question | Type `3` | Code checks the answer. Rova calls attention to original pieces versus smaller pieces. |
| Same question | Click **Show me a picture** | Equivalent fraction bars appear in the conversation. The shaded amount stays fixed while pieces change. |
| Same question | Type `2` | The checked answer and explanation are saved; the lesson is still in progress. |
| Second question: `2/3 = ?/6` | Click **Next question**, then type `4` | An independent first-try success is recorded. |
| Third question: `3/4 = ?/12` | Click **Next question**, then type `Do I multiply both parts by 3?` | Rova responds to the scaling idea, without grading a concept question as a numeric answer. |
| Same question | Type `9`, then **Finish lesson** | All three answers are checked; this learner’s assignment becomes complete. |

Optional visual moment: open **Visual guide**, then click **Split into smaller pieces**. Practice uses one tall message thread with the current question pinned above it and the composer fixed below. All saved messages remain in the thread; scroll up to revisit earlier questions without loading or expanding history.

Show **My progress**: “Your growing strengths” sits beside “Your next breakthroughs.” The latter opens targeted practice for the topics that need work.

## 3. A teacher sees what happened, quickly

Sign out and log in as the teacher.

- Select **Learning insights**. On a fresh run using the script above, the fractions graph shows **one independent success, two successes after support/retry, and one corrected question**. Seeded starting history is excluded.
- Select **Learning plans**. Maya is completed (3/3), while classmates who have not started remain not started.
- Click **Review lesson** beside Maya. A dedicated modal opens above the classroom.
- Read the **Lesson summary** tab: the learning challenge, how Rova responded, learner quotes, and a suggested teacher next step are all shown.
- Switch to the **Conversation** tab to show the actual exchange. Student messages have white text on dark green and use the student’s name. Close the modal to return to the same classroom position.

Say: “The teacher can scan the summary, then inspect the evidence. Completing this lesson is a useful signal; a fresh independent problem checks whether the learning transfers.”

Optional: **My classroom → Maya’s learning story → Share family update**. Suggested text:

> Maya worked through equivalent fractions today. The picture helped her revisit how halves can be split into fourths. Ask her to show you the same amount using two pieces of paper.

## 4. A family has a clear, finite next action

Sign out and log in as the parent.

- Show **Learning journey** and **Classroom updates** to connect school practice and the family note.
- Select **Learn together**. Complete all three paper-folding checkpoints.
- Show the completion celebration, the new activity, and the collapsed completed-activities history. If all six activities are completed, the page says “You’re all caught up” instead of recycling work.

Say: “Families get something specific they can do—and see that their effort counted.”

## Recovery during a rehearsal

- Closing a lesson preserves its conversation. Reopen the assignment to continue or review it.
- The current question stays pinned above the chat. Open **Visual guide** when you want to explore a model; it does not replace the conversation.
- Sidebar destinations survive refresh and work with browser back/forward through their URL fragments.
- A new data directory starts a fresh presentation; it does not remove previous work.
