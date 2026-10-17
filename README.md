# Rova

> Current app: fourth-grade math with a scripted conversational coach, teacher-assigned group lessons, saved coaching conversations, and per-learner completion tracking. Use Node 24, then `npm install` and `npm run dev`. Sample logins: `teacher@rova.school`, `student@rova.school`, or `parent@rova.school`, all with password `rova2026` (simulated accounts only). The new product currently uses a local JSON store; see [project context](PROJECT_CONTEXT.md#current-product-workspace-2026-10-17) for the deployment limitation and the distinction from the original ratios build spec below.

### *Think it through. Go the distance.*

**The study buddy that coaches with hints, not answers, remembers your learning journey from grade to grade, and keeps your teachers and parents in the loop.**

HackATL 2026 · Theme: *Designing the World After AI* · Challenge door #1: *Solve a problem AI created or intensified*

> **One-liner:** AI made answers instant, not learning. Rova is a study buddy that stays with each student through school. It remembers what they understand, makes them do the thinking instead of handing over answers, finds where a struggle actually started, and makes sure a teacher or parent acts, then checks that it worked.

---

## Contents
1. [The customer](#1-the-customer)
2. [The problem](#2-the-problem)
3. [Teacher pain points and the bottleneck](#3-teacher-pain-points-and-the-bottleneck)
4. [The gap in the market](#4-the-gap-in-the-market)
5. [The solution](#5-the-solution)
6. [How it works: the loop](#6-how-it-works-the-loop)
7. [Why it raises learning (evidence)](#7-why-it-raises-learning-evidence)
8. [Demo](#8-demo)
9. [Business model and unit economics](#9-business-model-and-unit-economics)
10. [Go-to-market and first pilot](#10-go-to-market-and-first-pilot)
11. [Stickiness and retention](#11-stickiness-and-retention)
12. [Market size (bottom-up)](#12-market-size-bottom-up)
13. [Competitors and moat](#13-competitors-and-moat)
14. [Why schools buy: a need, not a want](#14-why-schools-buy-a-need-not-a-want)
15. [Financial viability and the ask](#15-financial-viability-and-the-ask)
16. [Stress test and Q&A prep](#16-stress-test-and-qa-prep)
17. [Build spec](#17-build-spec)
18. [Weekend plan](#18-weekend-plan)
19. [Assumptions, risks and limitations](#19-assumptions-risks-and-limitations)
20. [Sources](#20-sources)

---

## 1. The customer

Built for someone specific, not "users":

| Who | Their moment | What's hard today |
|---|---|---|
| **Maya, 11, 6th grade** (the user) | 7 p.m., stuck on ratio homework. ChatGPT is one tab away. | It's easier to copy an answer than to learn it, and she knows she isn't really learning |
| **Ms. Rivera, 6th-grade math teacher** (adopts it) | 120+ students across 5 periods | She can't see who is stuck until the unit test, and she doesn't know *why* they're stuck |
| **Maya's mom** (in the loop) | Wants to help; English is her second language | She thinks Maya is on track. Report cards say B's |
| **The principal / district** (pays) | Has to answer "what's our AI plan?" and lost the tutoring budget | Human tutoring costs $1,200–$2,500 per student; federal relief money is gone |

---

## 2. The problem

**AI made answers instant, not learning.**

| What's happening | US evidence |
|---|---|
| Students use AI for homework, and it's rising fast | Middle schoolers using AI for homework rose from **30% to 46%** between May and Dec 2025; high schoolers from **49% to 60%** (RAND, via EdWeek) |
| They know it's hurting them | **68%** of middle schoolers worry AI is eroding their critical thinking (RAND); **87%** of principals say AI could keep students from developing it (College Board, 2025) |
| Teens see it as cheating | **59%** of US teens say classmates use AI to cheat at least somewhat often (Pew, Feb 2026, n=1,458) |
| It starts young | Among 9–17-year-olds who use AI, **85%** have used it for schoolwork, and **nearly 1 in 4** would ask a chatbot before a teacher or parent (Common Sense Media, 2026, n=1,204) |
| Unrestricted AI lowers real learning | Unrestricted ChatGPT: **+48%** on practice, **−17%** on the exam taken without AI. A guardrailed tutor: **+127%** on practice, **no exam drop** (Bastani et al., *PNAS* 2025, ~1,000 students; not US, but a randomized trial) |
| Parents can't see it | **88–89%** of parents think their child is at grade level in reading and math, while schools report **about half** of students start the year behind (Gallup + Learning Heroes, ~2,000 parents) |
| Students were already behind | 4th-grade NAEP 2024: reading **−5**, math **−3** points vs. 2019. i-Ready data from ~14M students shows progress has **plateaued**, with the lowest performers falling further behind (Curriculum Associates, 2025) |
| The proven fix is unaffordable | Tutoring raises achievement by **0.37 SD** across 96 randomized trials (J-PAL), but costs **$1,200–$2,500/student/yr** (Annenberg). The **$190.5B** federal pandemic relief (ESSER) has ended; **16 of 35** districts studied cut or paused tutoring (NSSA) |

**Problem statement:**
> Students are using AI more each month to get answers. They worry it's making them think less, and the adults around them can't see it. Parents think their kids are on track when half aren't. Schools have lost the money for human tutors. There is no affordable way to know what each student actually understands, why they're stuck, and to make sure someone acts.

**Theme test ("What changed because of AI, and how does that shape the solution?"):** AI made answer-copying effortless and invisible. Rova's restrictions (hints, not answers; effort tracking; adults in the loop) are the product. Take away AI and both the problem and the solution disappear.

---

## 3. Teacher pain points and the bottleneck

If teachers love Rova, principals listen. We researched what teachers struggle with **even with IXL, i-Ready, DreamBox and their LMS already in place**. Every figure is dated; older ones are marked.

| Pain point | Evidence | Source |
|---|---|---|
| **Overworked; most time isn't teaching** | About **53 hrs/week**, 7 more than similar adults (RAND, 2023); **~57 hrs/week, less than half teaching** (EdWeek, 2024) | RAND via NEA; EdWeek |
| **Stress and leaving** | **55%** frequent job stress vs. **34%** of similar adults; **18%** likely to leave by end of 2025–26 | RAND, Jun 2026 |
| **Huge range in one class** | A classroom could span **up to 7 grade levels**; ~**one-third** of incoming 5th graders at or below 3rd-grade math (pre-pandemic) | NWEA MAP data via The 74 (2020) |
| | *Older:* **93%** of K–8 teachers have students not at grade level; **over a third** have students 3 grades behind | Front Row (2017) |
| **Data and parent work they want removed** | "Collecting and analyzing student data" and "keeping parents informed" are among tasks teachers want off their plates | EdWeek, Mar 2024 |
| **Required progress tracking** | MTSS: Tier 2 checks at least monthly, Tier 3 weekly; written plans; reviews every 4–6 weeks | Georgia DOE MTSS training |
| **AI cheating anxiety** | **68%** use AI detectors; **64%** say students got in trouble over AI; **52%** more distrustful of students' work | CDT, 2023–24 |
| | **85%** of teachers used AI in 2024–25; only **11%** trained on responding when a student's AI use could harm their well-being | CDT, Oct 2025 |
| **Tool overload** | **2,982** ed-tech tools per district (2024–25) | Instructure, Jul 2025 |
| **Top stressor (honest note)** | **Student behavior** (52%). Rova does not solve this | RAND, Jun 2026 |

**The last mile existing tools don't solve:**

```
Data  →  Why?  →  What do I do?  →  Did it work?  →  Tell parents  →  Document it
 ✅IXL     ❌        ❌ (teacher)       ❌ (teacher)     ❌ (teacher)     ❌ (teacher)
```

| Gap | Today | Rova |
|---|---|---|
| Signals scattered | Teacher stitches IXL, Classroom and the gradebook together | One view of who's stuck |
| Reports say *what*, not *why* | "Maya scored 52% on ratios" | "Root cause: 4th-grade equivalent fractions" |
| No plan attached | Teacher designs the intervention from scratch | Suggested 5-minute reteach + group with the same gap |
| No follow-up | Nobody checks whether it worked | Automatic re-check after 7 days |
| Parents left out | Manual messages rarely get sent | Auto-drafted text in the home language |
| Homework is a black box | Perfect worksheet (ChatGPT), failed test | Effort signals: rushing to hints, guessing, repeated mistakes |
| Paperwork | MTSS logs by hand | Generated from the loop |

> **The bottleneck is teacher attention, not data.** One teacher can't turn 120 students' data into 120 diagnoses, plans, follow-ups and parent messages every week. Rova does the work between the data and the action.

**From teacher to school:** 94% of educators turn to teachers for input when choosing ed tech (NewSchools/Gallup, ~2019), but over half of district leaders rarely adopt district-wide on teacher recommendations alone (EdWeek Market Brief). So: free classroom (~$280/yr cost) → teacher champion → principal proof-of-value report → school license → district. MagicSchool proved the path: **6M+ educators, 10,000+ partner schools, $45M Series B** (Feb 2025).

**Ask teachers today:** hours spent finding who's stuck and why · how Tier 2 progress is logged and how long it takes · parent messages sent vs. wished · *"What did IXL / i-Ready tell you last week that you didn't have time to act on?"*

---

## 4. The gap in the market

Ed tech has thousands of tools (the average district used **2,982** in 2024–25, per Instructure), and each one sees **one slice of a student for one year**. In our market scan, every product was either a **tutor** or a **dashboard**, and each resets every session or every school year.

None of the products we reviewed combine all three:
1. **A learning memory that follows the student** across subjects, teachers and grades
2. **Root-cause diagnosis**: finding *why* a student is stuck today, often in an earlier grade's skill
3. **A closed loop with adults**: alert → a specific action → re-check → closed or escalated

**Why root cause matters:** gaps compound. In a US and UK study, **5th-grade knowledge of fractions and division predicted high-school algebra and overall math achievement**, even after controlling for IQ, family income, working memory and other math skills (Siegler et al., *Psychological Science*, 2012). A 6th grader stuck on ratios is often still stuck on 4th-grade fractions, and no tool connects the two.

*(This is what our scan found, not a claim that no product anywhere does any of it.)*

---

## 5. The solution

**Rova is a study buddy that stays with the student through school, makes them think instead of handing over answers, and keeps their teachers and parents in the loop.**

### For students: they do the thinking
- **Hint ladder:** guiding question → picture or model → worked step. It never gives the final answer first
- **"Explain it back":** the student explains their reasoning in their own words; the buddy checks it
- **Hands-on tools:** ratio tables, double number lines, fraction bars (drag, don't just type)
- **Personal examples:** problems built on the student's interests ("explain with basketball")
- **A buddy they name**, whose look matures as they move up grades
- **Today's Mission:** about 10 minutes, picked for them, with a progress ring

### Pattern-finding: spotting pain points
- **Learning memory:** skills mastered, mistakes that keep coming back, which explanations work ("learns best with pictures"), interests
- **Root-cause tracing:** walks back through a map of which skills build on which (ratios → equivalent fractions → multiplication facts) to find where the gap started
- **Effort signals:** catches "getting answers, not learning" patterns: rushing to hints, guessing, repeating the same mistake, quitting early

### For adults: closing the loop
- **Teacher action inbox:** "Maya: stuck on ratios → root cause: equivalent fractions → 5-min refresher. 4 others share this gap → small group."
- **Parent text** in their language, with a 10-minute home activity, then a win message when the problem is fixed
- **Verify:** re-check after 7 days; close the issue if it's mastered, escalate (eventually to a human tutor) if not
- **Day-one handoff:** a new teacher gets a one-page summary of each student, instead of starting cold in September

### The buddy grows with the student

| Grades | The buddy becomes | Who gets alerts |
|---|---|---|
| 3–5 | Friendly guide: pictures, read-aloud, short missions | Teacher + parent |
| **6–8 (launch)** | **Study coach:** multi-subject, homework planning, goals, explain-it-back | Teacher + student; parents for important alerts |
| 9–12 | Learning advisor: exam prep, study habits, disengagement flags | Student + counselor; parents only for serious risk |

**Launch focus:** 6th-grade math (ratios). **Roadmap:** more subjects, then grades 3–5 and 9–12.

---

## 6. How it works: the loop

```
  LEARN ──▶ DETECT ──▶ DIAGNOSE ──▶ ALERT ──▶ ACT ──▶ VERIFY
   ▲                                                   │
   └──────────────── closed, or escalated ◀────────────┘
```

| Step | What happens | Done by |
|---|---|---|
| **1. Learn** | Maya works today's mission. The buddy coaches with the hint ladder and cites the lesson or standard | AI (grounded in class material + standards) |
| **2. Detect** | Rules fire: same skill missed 3×, all hints used, same mistake type repeated, a drop below her own normal, sessions getting shorter | **Code (rules)**, so it's consistent and explainable |
| **3. Diagnose** | Walks back through the skill map and gives 2–3 quick check questions on earlier skills to find where the gap started | AI picks the questions; **code** scores them |
| **4. Alert** | Teacher card: student, skill, evidence, root cause, suggested 5-min reteach, others with the same gap | AI writes it; rules decide when |
| **5. Act** | Teacher taps Done/Snooze/Different strategy; parent gets the home activity; Maya's next mission adapts | AI writes the content; **code** picks practice difficulty |
| **6. Verify** | Re-check after 7 days → mastered (close the loop, send the parent a win message) or escalate | **Code** checks; AI writes the note |

**Guardrails**
- Only covers the current unit and its prerequisites. Anything else gets "Great question for your teacher!" plus a **Send to my teacher** button
- Never gives the final answer before an attempt and the hint ladder
- Every explanation cites a lesson page or standard. If confidence is low, it doesn't answer and the item goes to the teacher's review queue
- **Math is always checked by code**, never by the AI
- Safety screen on every message; anything concerning goes straight to the teacher
- Short, grade-level replies with a length cap; no open-ended chat about itself or personal topics
- Daily turn cap, set by the teacher (controls cost and screen time)
- Teachers can see every conversation
- Memory stores **learning facts only** (no emotional or personality profiling). The district owns the data; parents and students can view it (COPPA/FERPA)

---

## 7. Why it raises learning (evidence)

| Part of Rova | Evidence |
|---|---|
| Guardrails (hints, not answers) | Guardrailed tutor: +127% practice, no exam drop; unrestricted AI: −17% on the exam (Bastani et al., *PNAS* 2025) |
| Tutoring-style support during school | **0.37 SD** pooled effect across 96 randomized trials; during-school tutoring (0.40) beats after-school (0.21) (J-PAL evidence review) |
| Fixing foundations (root cause) | 5th-grade fraction and division knowledge predicts high-school algebra (Siegler et al., 2012) |
| Keeping parents informed | Automated weekly texts to middle- and high-school parents **cut course failures 27%** and **raised class attendance 12%**, at a total texting cost of **$63** for 32,000+ messages (Bergman & Chan, *J. Human Resources*, 2021) |

**Honest limits:** the parent-texting study improved course failures and attendance but **not state test scores**, and the AI study was in Turkish high schools. Each piece has evidence; whether the **combination** raises learning is exactly what our pilot measures.

---

## 8. Demo

**Core action, end to end:** a 6th grader gets stuck on ratios → Rova finds and fixes the root cause in 4th-grade fractions → the teacher and parent are looped in → the issue is verified as fixed.

**Script (~90 seconds of demo inside the 5-minute pitch):**

| # | On screen | Label |
|---|---|---|
| 1 | Maya logs in. Her buddy: *"Welcome back! Fractions were tricky last time, so let's finish ratios together."* | Working (memory) |
| 2 | She types "just tell me the answer." The buddy kindly declines, asks a guiding question and opens a ratio table | Working (guardrail + hint ladder) |
| 3 | She makes the same mistake twice. The buddy: *"I think this is really about equivalent fractions. Quick check?"* | Working (root-cause trace) |
| 4 | 3-question fraction refresher → back to the ratio problem → solved → explain-it-back | Working |
| 5 | Teacher view: alert card + *"5 students share this root cause → small-group refresher"* | Working alert; class data **Simulated** |
| 6 | Parent view: text in Spanish with a 10-minute recipe-ratio activity | **Simulated** (SMS mock-up) |
| 7 | Loop tracker: re-check in 7 days → fast-forward → *"Mastered ✅, parent notified"* | **Simulated** (time jump) |

**Working / Simulated / Planned (labeled on screen)**

| Working | Simulated | Planned |
|---|---|---|
| Hint-ladder tutor with guardrails | 25-student class data | Roster sync (Clever/ClassLink) |
| Code-checked math answers | Parent SMS delivery | More subjects (ELA, science) |
| Root-cause trace across the skill map | 7-day time jump | Grades 3–5 and 9–12 modes |
| Learning memory (stored student profile) | Previous-grade history for Maya | Voice input / read-aloud |
| Teacher alert generation | | Pulling in data from other tools (i-Ready, etc.) |
| Off-topic / unsafe message handling | | Human-tutor escalation |

> **Build note (2026-10-17, D-004 in `DECISIONS.md`):** for now the prototype calls no AI model. It's still a free-flowing app: students type anything, and a rule-based responder in code picks the reply from templates. Tutor replies are labeled "rule-based (AI planned)" and must not be called AI in the pitch. Math checks, detection rules, root-cause trace, alerts, and re-check run in code.

**Backup:** record the full demo video Saturday night. Pre-load data, log in, mute notifications.

---

## 9. Business model and unit economics

**Model:** for-profit, B2B. **The student benefits, the teacher adopts, the school or district pays.**
**Ramp:** free 4-week classroom pilot → school license → district contract. Title I discounts for low-income schools.

| Tier | Includes | Price |
|---|---|---|
| **Core** | Math study buddy + teacher and parent loop | **$25 / student / year** |
| **Full Buddy** | All subjects + learning memory across grades | **$35 / student / year** (Khanmigo's district price is $35) |

**Line for judges:** *Human tutoring costs $1,200–$2,500 per student. Rova costs $25–35, about 2% of that, and routes the students who truly need a person to one.*

### What the AI does, and what it costs
Assumptions: 6th–8th grade, **30 tutor turns/week × 36 school weeks = 1,080 turns/year**. Small model at ~$1 in / $5 out per million tokens; mid-tier at ~$3 / $15. Prompt caching on. Check current provider prices before the pitch.

| AI job | Uses/yr | Tokens in / out per use |
|---|---|---|
| Tutor reply (hint ladder, explain-back) | 1,080 | 3,000 / 200 |
| Fact-check each reply against its source | 1,080 | 1,500 / 50 |
| Safety + off-topic screen | 1,080 | 300 / 10 |
| Root-cause diagnosis | 20 | 3,000 / 300 |
| Weekly learning-memory update | 36 | 4,000 / 300 |
| Teacher alerts, parent messages, loop notes, weekly summaries | ~84 | 800–3,000 / 100–200 |
| **Total per student** | | **~5.5M in / ~0.31M out** |

Math checking, pattern detection and loop tracking run in **plain code: zero AI cost**.

### Cost per student per year

| Scenario | AI | Hosting, SMS, support, compliance, rostering | Total cost | Price | Gross margin |
|---|---|---|---|---|---|
| **Core, small model (base case)** | **$6.13** | $3.30 | **$9.43** | $25 | **62%** |
| Core, mid-tier model for every reply | $12.83 | $3.30 | $16.13 | $25 | 35% ❌ |
| Full Buddy, small model | $9.87 | $3.30 | $13.17 | $35 | 62% |
| **Full Buddy, routed** (small model by default, mid-tier for the hardest ~20%) | ~$12.10 | $3.30 | ~$15.40 | $35 | **~56%** |

**Takeaways**
- **Route between models.** Running the strong model on everything wipes out the margin.
- **Cap daily turns.** The biggest risk is usage, not price.
- **Cheaper AI helps directly:** AI is about two-thirds of cost to serve, so margin widens as prices fall.

### Per customer (assumptions labeled)

| Unit | Value |
|---|---|
| Middle school (~600 students, assumed) × $25 | **$15,000 revenue / yr**, **~$9,300 gross profit** |
| Cost to win a school (free pilot + founder sales time), assumed | ~$5,000 |
| **Payback** | **~6–7 months** (K-12 benchmark: under 18) |
| Lifetime value (85% renewal, 5 years) | ~$34,700 → **LTV:CAC ≈ 7×** (benchmark: 3× minimum, 5× healthy) |
| District (10 schools) | ~$150K / yr |

---

## 10. Go-to-market and first pilot

| | Plan |
|---|---|
| **Who** | 1–3 sixth-grade math teachers at one metro-Atlanta middle school (~75–150 students) |
| **Reach** | Team networks; Georgia Tech and Emory education contacts; principal sign-off |
| **Action** | Use Rova for one ratios unit over 4 weeks |
| **Success** | Unit quiz vs. the prior unit or a comparison class; % of alerts closed; days from alert to mastery; teacher time saved; parent message open rate |
| **Next** | School license → district contract → grades 7–8 → more subjects → grades 3–5 |
| **Partners** | Schools and districts (buyer + rosters); later rostering platforms (Clever, ClassLink); later curriculum publishers (see below) |

**Why schools buy**
1. A **safe, approved AI** to replace kids using ChatGPT unsupervised, so a principal has an answer to "what's our AI plan?"
2. **Tutoring-style support at about 2% of the cost** of human tutoring
3. **Saves teachers time:** an action inbox, not another dashboard
4. **Parent engagement** in the home language
5. **Proof for the budget:** alerts closed, days to fix, skills mastered

**Where the learning content comes from**
1. **Standards-first (default):** a skill map built from public state standards (e.g. Common Core 6.RP.A.3 ratios ← 4.NF.A.1 equivalent fractions ← 3.OA.C.7 multiplication). Practice problems are generated by AI and checked by code. Works on day one, no textbook needed.
2. **Teacher upload:** the teacher adds the unit PDF or worksheets the school already licenses. Rova splits it into sections, tags each to skills, and cites pages.
3. **Publisher partnerships (later):** Rova sits on a **different layer**. Publishers own content; Rova owns what happens after a student gets stuck, and its citations send students back into the publisher's book. Not a day-one dependency.

*Note:* popular open curricula (Illustrative Mathematics, Eureka Math) are licensed **CC BY-NC-SA (non-commercial)**. For the demo we write our own problems; a paid product needs our own content, school-licensed material or a license.

---

## 11. Stickiness and retention

- **Data that compounds:** the learning record grows every year; the **September moment** gives each new teacher a one-page summary of every student on day one
- **Built into required workflows:** one-click MTSS export for data meetings; evidence for special-ed/504 discussions; roster sync and Classroom/Canvas links
- **A daily habit for each user:** students (a named buddy, 10-minute mission, mastery wins) · teachers (an inbox under 5 minutes, one-tap Done) · parents (weekly text, win messages)
- **Proof of value at renewal:** quarterly principal report (alerts closed, days to fix, mastery, hours saved, parent open rate)
- **Land and expand:** grade → school → district → subjects → grades; multi-year contracts with an early-adopter price lock

| PMF signal (pilot target, ASSUMPTION) | Target |
|---|---|
| Teachers "very disappointed" without Rova | ≥40% |
| Teachers opening the inbox ≥4 days/week | ≥70% |
| Weekly active students | ≥70% |
| Alerts acted on within 48 h | ≥60% |
| Parent text open rate | ≥50% |
| Pilot → paid | ≥1 of 3 schools |
| Renewal / net revenue retention | ≥85% / ≥110% |

---

## 12. Market size (bottom-up)

| Ring | Calculation | Value |
|---|---|---|
| **TAM**: US public K-12 | ~49M students × ~$30 | **~$1.5B / yr** |
| **SAM**: grades 3–8 (launch + near expansion) | ~22M students × $25–35 | **~$550–770M / yr** |
| **SOM**: 1–3 years, Georgia / Southeast middle schools | ~60 schools × ~600 students × $25 | **~$900K ARR** (≈ break-even, see §15) |
| **First pilot** | 1 school, 3 classes | 75–150 students, free |

Student counts are from NCES (50.8M peak in 2019, declining). Grade-band counts are our estimates; replace them with NCES by-grade data before the pitch. No "if we get 1%."

---

## 13. Competitors and moat

| Player | What they do | What they lack (vs. Rova) |
|---|---|---|
| **Khanmigo** (Khan Academy) | Hint-based tutor, strongest in grades 6–12; $35/student for districts | Only sees Khan Academy activity; teacher emails are for **safety** flags; no parent loop; sessions don't add up across years |
| **Amira** (+ Istation, 1,800+ districts) | Voice reading tutor up to grade 5 | Reading only; ends at grade 5; no memory across grades; no parent loop. Could become a data source for Rova |
| **SchoolAI** | Spaces + Mission Control: mastery, misconceptions, "struggling" labels, critical safety alerts | **Close competitor.** Insights per session; no follow-up check that a fix worked; no parent loop |
| **Flint** ($15M Series A, Nov 2025) | AI tutors for schools | Session-based; no multi-year memory or root-cause tracing (based on public info) |
| **MagicSchool** ($45M raised) | Teacher productivity tools + student rooms | Built for teachers; flags who needs support but doesn't act |
| **i-Ready, DreamBox, IXL** | Adaptive practice + diagnostics | Locked to their own content; reports, not actions; no conversational coaching |
| **Seesaw** | K–5 portfolios + family messaging | The teacher writes every message; no AI-triggered next steps |
| **StudyFetch** | Turns student uploads into flashcards, quizzes and an AI tutor (Spark.E); teacher product with progress tracking and class analytics (rolling out); enterprise plans for schools; COPPA/FERPA badges; expanding into K-12 | Built around materials the student uploads; no parent loop, cross-grade root cause or fix verification found in public materials |
| **Class Companion** (+ Panorama Solara) | Rubric-based AI feedback on assignments; teacher insights; Panorama recommends scaffolds from district data | Works after the assignment (mostly writing); no parent loop; no published check that supports worked |
| **Mindgrasp / Ask Maeve** | Consumer study tools: notes, summaries, flashcards, AI tutor ($6–11/mo for Mindgrasp) | Bought by students; no teacher or parent features found |
| **ChatGPT / Gemini / Claude** | General AI | Give answers, aren't tied to the class, and the adults can't see anything |

**What if a big player copies us next month?** The tutor alone isn't defensible; we say so. What's left:
1. **The learning record grows over time.** After 3 years a district holds 3 years of each student's history, which is costly to abandon.
2. **Outcome data:** which fix worked, for which kind of student, on which skill. Nobody else collects it, because nobody else closes the loop.
3. **The skill-dependency map** gets better with every root cause found.
4. **District trust:** privacy reviews, data agreements and roster integrations take months to replicate.

---

## 14. Why schools buy: a need, not a want

Schools won't pick Rova because it's another AI tutor. They'll pick it because it does three jobs they're **already required to do**, mostly by hand.

| What schools have | Missing | Rova adds |
|---|---|---|
| **Adaptive practice** (i-Ready, DreamBox, IXL) | Reports, not actions; no coaching in the moment | Coaching while stuck + an action for the teacher |
| **AI tutors** (Khanmigo, SchoolAI, Flint) | Sessions stand alone; no follow-up; no parents | Memory across years, root cause, closed loop |
| **Feedback AI** (Class Companion + Panorama) | After the assignment; no parent loop | Works while stuck; diagnoses why |
| **Parent messaging** (Seesaw-type) | Teachers write every message | Messages triggered by learning data |
| **Study apps** (StudyFetch, Mindgrasp, Ask Maeve) | Can hand over answers; adults mostly outside | School-governed, hints only, adults in the loop |

| Obligation | Requirement (FINDING) | Rova |
|---|---|---|
| **MTSS progress tracking** | Tier 2 monthly, Tier 3 weekly; written plans; reviews every 4–6 weeks (Georgia DOE) | Progress data and intervention logs as a by-product |
| **Title I family engagement** | ESSA §1116; districts with >$500K Title I set aside **≥1%** (California Dept. of Ed.) | Triggered texts in the home language: a funded budget line |
| **Safe, approved AI** | **31+ states** issued AI guidance; US Dept. of Ed (Jul 2025): federal funds may pay for **AI-enhanced high-impact tutoring**, with parents and teachers involved | Guardrailed, teacher-visible, parent-involved |
| **Replace lost tutoring** | Tutoring 0.37 SD; $1,200–2,500/student; ESSER gone | ~2% of the cost; routes kids who need a human to one |

> **Pitch line:** "Schools already have to track every struggling student's progress, engage every family, and have a plan for AI. Rova does all three automatically, every time a student learns."

*Caveat:* this is a need only if Rova plugs into the school's MTSS process; validate in interviews.

---

## 15. Financial viability and the ask

- **Break-even:** with a lean team budget of ~$500K/yr, about **32,000 students** at $25 (gross profit ~$15.57 each), or **~54 middle schools**, which matches the 3-year SOM
- **Profitable per customer from year one:** a school pays back in ~6–7 months
- **Improves over time:** AI costs fall, routing cuts them further, and districts expand to more grades and subjects

**The ask:** an introduction to **one metro-Atlanta middle school principal or 6th-grade math teacher** for a free 4-week pilot, plus mentors with district procurement experience.

**Last slide:** why this team (10 s) · what works today · known limitations · the ask · built at HackATL vs. started with.

**Disclosure:** *Built at HackATL:* product flows, UI, agent logic, skill map, demo content, venture case. *Started with:* [list the AI API provider, UI kit/framework, open-source libraries].

---

## 16. Stress test and Q&A prep

**The six workshop questions**

| # | Question | Our answer |
|---|---|---|
| 1 | Why can't students just use ChatGPT? | ChatGPT gives answers: in a randomized trial it raised practice scores 48% but **cut exam scores 17%**. Rova makes students do the thinking, remembers their history, and keeps adults in the loop. |
| 2 | When AI gets 10× cheaper and better? | **Stronger.** AI is about two-thirds of our cost; our value is the memory, root-cause map and adult loop, not the model. We're model-agnostic. |
| 3 | Who uses it, who pays? | Students use it, teachers adopt it, schools and districts pay $25–35 per student. |
| 4 | Is it profitable? | ~62% gross margin; a school pays back in ~6–7 months; break-even at ~54 middle schools. |
| 5 | First 10 users? | 1–3 sixth-grade teachers at one Atlanta middle school through our networks, as a free 4-week pilot. |
| 6 | Big company copies you? | The tutor is copyable; the multi-year learning record, outcome data and district trust aren't. |

**Likely judge questions (answer formula: direct answer → one number or proof → stop; under 1 minute)**
- *What if the AI is wrong?* Math is checked by code; every explanation cites its source; low-confidence answers aren't shown and go to the teacher. We report our tested accuracy: [fill in from the test set].
- *Student privacy?* No child accounts or emails (class code + first name); learning facts only; district owns the data; no training on student data; COPPA/FERPA review before any real pilot.
- *Why would teachers use it?* It gives them an action list, not another dashboard; teachers using AI save ~6 hours a week (Gallup–Walton).
- *Evidence it works?* Each component has randomized-trial evidence (§7); the combination is what the pilot tests.
- *Why not SchoolAI?* They report what happened in a session. We find the root cause across grades, bring parents in, and check whether the fix worked.
- *Isn't this StudyFetch?* StudyFetch helps students study what they upload, and now gives teachers class analytics. We start where analytics stop: find why a student is stuck, even from two grades ago, get a teacher and parent to act, and check that it worked.
- *We already have IXL / i-Ready. Why buy this?* Keep them. They tell you who's behind; Rova does the last mile: why, what to do, did it work, tell parents, and document it for MTSS.
- *Need or nice-to-have?* Schools already must track Tier 2/3 progress, engage families (Title I) and govern AI. Rova does all three as a by-product.
- *Don't know?* "That's an assumption we haven't tested. Here's how we'd test it."

**Appendix slides to have ready:** unit economics · AI cost breakdown · interview evidence · how it works (agent diagram) · pricing · roadmap · risks.

---

## 17. Build spec

### Stack (suggested)
- **Web app**, responsive, runs on Chromebooks and phones. *Why:* schools use Chromebooks, which run websites, not phone apps; parents open links from texts
- **Frontend:** React (Next.js) + Tailwind; a component library for cards
- **AI:** one hosted LLM API (whichever the team has credits for), behind a single function so the provider is swappable. Small model by default, stronger model for hard moments
- **Data:** JSON files or SQLite (student profiles, skill map, events, alerts)
- **Math checking:** a small expression and fraction evaluator in code
- **Deploy:** Vercel or similar; one URL with three views

### Screens

**Student (Maya)**
- **Home:** buddy greeting (uses memory) · Today's Mission card · skill map with progress rings
- **Problem:** large problem text · interactive ratio table / double number line · "I'm stuck" · hint ladder (3 locked steps) · source tag
- **Refresher:** 3 quick prerequisite questions with the root-cause message
- **Explain it back:** free-text box; the buddy responds to her reasoning
- **Win:** mastery celebration

**Teacher (Ms. Rivera)**
- **Action inbox:** alert cards (student · skill · evidence · root cause · suggested reteach · *Done / Snooze / Different strategy*)
- **Class heatmap:** students × skills; "group of 5 share this root cause"
- **Loop tracker:** open → acted → verified; average days to fix
- **Review queue:** held-back answers + "this seems wrong" flags

**Parent (phone)**
- **Text mock-up:** in Spanish, with the activity link
- **Weekly card:** learned · working on · try at home
- **Win message**

### The agent: steps and tools

On each student message, the agent:
1. Loads the **learner profile** (skills, recurring mistakes, preferences, interests)
2. Runs the **safety + scope screen**, redirecting if off-topic or unsafe
3. Finds the relevant lesson section or standard (for the citation)
4. Decides the next move: guiding question / next hint level / check answer / refresher / explain-back
5. **Checks math answers in code**
6. Writes a short, grade-level reply with a citation, then **fact-checks** it against the source
7. Logs the event; the rules check whether to **detect → diagnose → alert**
8. Updates the profile after the session (weekly summary into memory)

**Tools the agent can call**
| Tool | Does |
|---|---|
| `get_learner_profile(student)` | Returns mastery, misconceptions, preferences |
| `find_source(skill, question)` | Returns a lesson section or standard text for citations |
| `check_answer(problem, answer)` | **Code:** exact check of ratio and fraction answers |
| `trace_prerequisites(skill)` | Walks the skill map back to earlier-grade skills |
| `make_practice(skill, level, interest)` | Generates problems; answers verified by `check_answer` |
| `create_alert(student, skill, evidence, root_cause)` | Posts to the teacher inbox |
| `draft_parent_message(student, activity, language)` | Writes the parent text |
| `schedule_recheck(student, skill, days)` | Sets the verify step |

### Skill map (demo slice)
```json
{
  "6.RP.A.3": { "name": "Solve ratio problems with tables",      "grade": 6, "needs": ["6.RP.A.1", "4.NF.A.1"] },
  "6.RP.A.1": { "name": "Understand ratios",                     "grade": 6, "needs": ["3.OA.C.7"] },
  "4.NF.A.1": { "name": "Equivalent fractions",                  "grade": 4, "needs": ["3.NF.A.3", "3.OA.C.7"] },
  "3.NF.A.3": { "name": "Compare simple fractions",              "grade": 3, "needs": [] },
  "3.OA.C.7": { "name": "Multiplication facts within 100",       "grade": 3, "needs": [] }
}
```

### Detection rules (code)
| Signal | Rule |
|---|---|
| Stuck | Same skill wrong ≥3 of last 4 attempts |
| Answer-seeking | Jumps to the last hint within 20 seconds on ≥3 problems |
| Repeated misconception | Same error type ≥2 times (e.g. adds instead of multiplying across a ratio table) |
| Drop | Accuracy 25+ points below the student's own 2-week average |
| Disengagement | Sessions 50% shorter for a week, or 2+ missed missions |
| Class gap | ≥30% of a class shares the same root cause → group alert |

### Data model (minimum)
- `Student { id, first_name, grade, buddy_name, language_home, interests[] }`
- `SkillState { student_id, skill_id, mastery 0–1, misconceptions[], last_seen }`
- `Event { student_id, skill_id, type: attempt|hint|explain|refresher, correct, seconds, ts }`
- `Alert { id, student_id, skill_id, evidence, root_cause, action, status: open|acted|verified|escalated, recheck_at }`
- `ParentMessage { student_id, language, text, sent_at }`

### Test plan (report real numbers in the pitch)
| Test set | Size | Measure | Target |
|---|---|---|---|
| In-scope ratio questions | 60 | Correct, helpful hint with a valid source | ≥90% |
| Off-topic questions | 20 | Correctly redirected | ≥95% |
| Tricky inputs ("just tell me", misspellings, unsafe) | 20 | Handled as designed | ≥95% |
| Math answer checks | 20 | Code verdict correct | 100% |
| Root-cause traces (scripted error patterns) | 10 | Finds the right prerequisite | ≥80% |

*A 90% result we tested beats a 99% we didn't.* Optional: run the set on one closed model and one small open model (e.g. Gemma or Qwen) and report both accuracy and cost.

---

## 18. Weekend plan

| When | Build | Venture / pitch |
|---|---|---|
| **Sat 9 a.m.–12 p.m.** | Student view + tutor loop with hint ladder and code math checks | Text/call 3+ teachers and 3+ parents (interview questions below) |
| **Sat 11 a.m.–1 p.m.** | | **Mentor round-table:** test pricing and the "why not ChatGPT" answer |
| **Sat 1–5 p.m.** | Root-cause trace, learner memory, teacher alert card | Slides: problem, competitors, market, unit economics |
| **Sat 5–9 p.m.** | Teacher inbox + heatmap (simulated class), parent view, loop tracker | Fill in interview evidence |
| **Sat 9 p.m.–late** | Run the 120-question test set; polish UI; **record backup demo video** | Rehearse with a timer |
| **Sun 9–10 a.m.** | Freeze the build; pre-load data | Two timed run-throughs (5 min + 4 min Q&A); assign a Q&A router |
| **Sun 10 a.m.** | **Preliminary pitches** | |

**Interview questions (5 minutes each)**
- Teachers: *When students get stuck at home, how do you find out? Have you seen AI-copied homework? If an alert told you who was stuck and why, what would you do the next day? Who approves new tools?*
- Parents: *How do you know if your child is behind? Would a text with a 10-minute activity help? What language do you prefer?*
- Label every answer as a **finding** (we heard it) vs. an **assumption** (we believe it).

---

## 19. Assumptions, risks and limitations

| Item | Type | How we'd test it |
|---|---|---|
| Teachers act on alerts | Assumption | % of alerts acted on within 48 h in the pilot |
| Schools pay $25–35/student | Assumption | Price questions in principal interviews; pilot-to-paid conversion |
| Students use it ~30 turns/week | Assumption | Pilot usage logs (drives AI cost) |
| 85% annual renewal | Assumption | Benchmark; track from year 1 |
| Root-cause tracing is accurate | Assumption | Test set + teacher agreement rate |
| The combined loop raises learning | Open question | Unit quiz vs. prior unit / comparison class |
| AI can still be wrong or refuse a valid question | Known limitation | Report test-set error rates; teacher review queue |
| Content licensing for paid use | Risk | Standards-first content; legal review before scaling |
| Privacy (COPPA/FERPA) | Risk | No child accounts, data agreement, provider terms checked for minors and zero retention |
| A big competitor adds follow-up checks | Risk | Move fast on multi-year memory and outcome data |

---

## 20. Sources

- Pew Research Center, *How Teens Use and View AI* (Feb 2026): https://www.pewresearch.org/internet/2026/02/24/how-teens-use-and-view-ai/
- EdWeek on RAND student survey (Mar 2026): https://edweek.org/technology/students-are-worried-that-ai-will-hurt-their-critical-thinking-skills/2026/03
- EdWeek on College Board principal survey (Oct 2025): https://www.edweek.org/technology/teachers-worry-ai-will-impede-students-critical-thinking-skills-many-teens-arent-so-sure/2025/10
- EdWeek on Common Sense Media survey (Jun 2026): https://www.edweek.org/technology/kids-are-turning-to-ai-before-adults-for-homework-help/2026/06
- Bastani et al., *PNAS* 2025, via Wharton: https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education
- Gallup + Learning Heroes, via The 74: https://www.the74million.org/article/when-getting-good-grades-and-working-at-grade-level-are-not-the-same-thing/
- NAEP 2024, via K-12 Dive: https://www.k12dive.com/news/2024-naep-reading-math-scores-drop-pre-pandemic/738535/
- Curriculum Associates, *State of Student Learning 2025*: https://www.curriculumassociates.com/about/press-releases/2025/07/state-of-student-learning-2025
- J-PAL, *The Transformative Potential of Tutoring*: https://www.povertyactionlab.org/sites/default/files/publication/Evidence-Review_The-Transformative-Potential-of-Tutoring.pdf
- EdSurge, high-impact tutoring after ESSER: https://edsurge.com/news/can-high-impact-tutoring-survive-post-pandemic-funding-loss
- Siegler et al. 2012, via APS: https://www.psychologicalscience.org/news/releases/knowledge-of-fractions-and-long-division-predicts-long-term-math-success.html
- Bergman & Chan 2021, *Journal of Human Resources*: https://jhr.uwpress.org/content/56/1/125
- Instructure EdTech Top 40, via ClassLink (Jul 2025): https://www.classlink.com/news/despite-push-to-pare-back-ed-tech-report-finds-districts-inventories-are-still-growing
- CoSN 2026 device survey, via K-12 Dive: https://k12dive.com/news/most-districts-now-have-11-device-programs-pushback-finances-could-chang/819884/
- Gallup–Walton teacher AI survey (Jun 2025): https://www.waltonfamilyfoundation.org/learning/six-weeks-a-year-how-ai-gives-teachers-time-back
- Khanmigo pricing: https://artificial-intelligence-wiki.com/industry-ai/ai-in-education/khanmigo-pricing-plans/
- Khan Academy, teacher visibility of Khanmigo: https://support.khanacademy.org/hc/en-us/articles/29473549307277/
- SchoolAI Mission Control guide: https://help.schoolai.com/en/articles/15243484-your-guide-to-mission-control
- MagicSchool enterprise features: https://magicschool.ai/blog-posts/enterprise-feature-releases
- Amira + Istation merger, via Getting Smart: http://www.gettingsmart.com/2024/06/11/adaptive-leader-istation-joins-ai-powered-reading-tutor-amira-learning/
- Flint Series A, via Axios: https://www.axios.com/pro/all-deals/2025/11/06/flint-15-million-ai-schools-tutors
- Illustrative Mathematics license notice: https://www.assistments.org/copyright-notice/illustrative-mathematics-copyright-notice
- Great Minds (Eureka Math) license notice: https://www.assistments.org/copyright-notice/great-minds-copyright-notice
- SaaS Hero, EdTech benchmarks 2026: https://www.saashero.net/strategy/edtech-marketing-roi-2026/
- NCES enrollment, via NC Newsline: https://ncnewsline.com/2025/07/15/public-school-enrollment-continues-to-fall/

- RAND, teachers' stress and burnout (Jun 2026): https://www.rand.org/news/press/2026/06/teachers-stress-burnout-continue-to-outpace-those-of.html
- NEA via NEARI, RAND teacher hours (2023): https://www.neari.org/advocating-change/new-from-neari/survey-teachers-work-more-hours-week-other-working-adults
- EdWeek, 8 tasks teachers want off their plates (Mar 2024): https://www.edweek.org/the-state-of-teaching/2024/teaching-learning/dear-administrators-teachers-want-you-to-get-these-8-tasks-off-their-plates/
- The 74, achievement spans up to seven grade levels (2020): https://www.the74million.org/article/new-research-predicts-steep-covid-learning-losses-will-widen-already-dramatic-achievement-gaps-within-classrooms/
- K-12 Dive, Front Row teacher survey (2017): https://www.k12dive.com/news/survey-educators-encounter-wide-variety-of-grade-level-performance-in-clas/442071/
- CDT, AI detection, discipline and distrust (2023–24): https://cdt.org/press/new-research-educators-still-struggling-with-generative-ai-detection-discipline-and-distrust-despite-increased-school-guidance/
- K-12 Dive, CDT 2025 survey: https://k12dive.com/news/risks-from-ai-use-are-growing-alongside-its-popularity-in-schools/802387
- EdWeek Market Brief, teachers' word carries weight: https://marketbrief.edweek.org/marketplace-k-12/teachers-word-carries-weight-choosing-products-survey-finds/
- MagicSchool, Series B (Feb 2025): https://www.magicschool.ai/blog-posts/series-b-fundraise-for-teacher-ai
- Georgia DOE, MTSS progress monitoring: https://gadoe.org/wholechild/Documents/MTSS/MTSS_Progress_Monitoring_PPT.pdf
- California Dept. of Education, Title I reservations: https://www.cde.ca.gov/SP/sw/t1/reservations.asp
- US Dept. of Education, AI guidance (Jul 2025): https://www.ed.gov/about/news/press-release/us-department-of-education-issues-guidance-artificial-intelligence-use-schools-proposes-additional-supplemental-priority
- AI for Education, 31 states with AI guidance: https://aiforeducation.io/blog/31-states-adopt-state-ai-guidlines
- StudyFetch: https://www.studyfetch.com/ · Claude case study: https://claude.com/customers/studyfetch
- Panorama Solara with Class Companion (Oct 2025): https://www.businesswire.com/news/home/20251028865492/en/Panorama-Education-Launches-Solara-with-Class-Companion-to-Accelerate-Student-Growth-Through-Real-Time-Feedback-and-Instructional-Insights
- Mindgrasp review (2026): https://fast.io/resources/mindgrasp-ai-review-2026/ · Ask Maeve: https://moge.ai/product/ask-maeve

*Figures labeled "assumed" or "estimate" are ours and must be validated. Model token prices change often; confirm them before presenting.*
