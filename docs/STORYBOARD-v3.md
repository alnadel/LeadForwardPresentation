# Behind a Better Life: v3 storyboard (brief-complete)

v3 keeps the v2 look, motion and scenes, and adds what the capstone brief and rubric require: strategic options, leadership involvement, a communication plan, an implementation roadmap with owners and budget, a risk plan, and KPIs with targets. See [`REVIEW-v3.md`](REVIEW-v3.md) for the analysis.

- **Timing:** 15 minutes in total. Speaker notes are about **1,650 words** (≈ 40 per stop).
- **Design rules** (docs/SCENE_GUIDE-v2.md):
  - audience-first hierarchy;
  - one hero per stop, where the spark lands;
  - supporting text small and dim;
  - 2–4 ambient motions per stop.
  - New cards use `.glass` / `.glass.plum` / `.glass.live`.
  - Numbers are exact. Proposals are labelled as proposals in the notes (`[Team: confirm …]`).

## Acts (engine `Deck.ACTS`) and pace targets
`['The moment', 'The case', 'The campaign', 'Leading it', 'The plan']`, finishing by `[1.5, 6.25, 10.25, 12, 15]` minutes.

| Act | Scene id (stops) · transition |
| --- | --- |
| 0 · The moment | hook (1) · open (2, iris) · night (2, dolly) |
| 1 · The case | gap (3, chapter) · survey (4, push) · benchmark (2, push) · why (2, push) |
| 2 · The campaign | **options (2, chapter)** · cycle (2, iris) · journey (4, dolly) · runs (3, push) |
| 3 · Leading it | **leaders (2, chapter)** · **comms (2, push)** |
| 4 · The plan | **roadmap (2, chapter)** · **risks (1, push)** · pilot (3, rise) · close (2, iris) |

File order in `scenes-v2/`, with new files marked:
- 00-hook
- 01-open
- 02-night
- 03-gap
- 04-survey
- 05-benchmark
- 06-why
- **06b-options**
- 07-cycle
- 08-journey
- 09-runs
- **09b-leaders**
- **09c-comms**
- **09d-roadmap**
- **09e-risks**
- 10-pilot
- 11-close

---

## Changed scenes

### 02 Open (id `open`)
- The kicker reads **Lead Forward 2026 · Capstone · Inspire Others**. It replaces "Team presentation · Lead Forward 2026".

### 04 Survey, 05 Benchmark, 03 Gap: method made visible (programme learning)
These kickers make the capstone lifecycle visible.

| Scene | Kicker |
| --- | --- |
| Gap | **Gap assessment** |
| Survey | **Current state · primary data** |
| Benchmark | **Benchmark · secondary data**. On stop 1, keep "Reading". |

### 06 Why it matters (id `why`): 3 → 2 stops; `act: 1`; `transition: 'push'`
- **Stop 0:** v2 stop 1 as it stands.
  - Headline: "Employee recognition becomes organisational value **when the story is shared.**"
  - Content: the flow diagram, plus the retention caveat caption.
  - The diagram builds live in this stop.
- **Stop 1:** v2 stop 2 (values over the aerial photo), with one addition. Under the headline, a key line: **"Every story shows how daily work serves Tahakom's purpose: *Urban Intelligence for a Better Life.*"**
  - Keep the six values and the three outcomes.
- Notes:
  - 0: "Why does this matter to Tahakom? Recognition happens to one person. Value happens when the story is shared: people feel seen, the behaviour spreads, and the culture gets stronger. Retention may follow over time, but it is not a promise of the pilot."
  - 1: "And it is aligned by design. We are not inventing new values. Every story shows how daily work serves our purpose, Urban Intelligence for a Better Life, and makes one of our six values visible in action."

### 07 The cycle (id `cycle`): 3 → 2 stops; `act: 2`
- Stop 0: the lanes (unchanged).
- Stop 1: the ring, with the "The cycle repeats" moment, principles and second orbit light merged in. It shows v2 stop 2's final state, built in one choreographed step.
- Notes:
  - 0: "Most recognition stops at the award. Ours keeps going: a story leads to behaviour, which inspires more stories."
  - 1: "Four steps, one quarter. Capture: a peer or leader nominates. Curate: facts checked, consent given, one value linked. Feature: a short story on our channels. Reinforce: the contributor is recognised and the takeaway is shared. Then it repeats."

### 09 How it runs (id `runs`): tab 01 becomes the inspiring-story criteria
- Tab label: **01 · What makes it inspiring** (was "Story format").
- Headline: **"A story is featured when it answers four questions."**
- Keep the four rows exactly: Purpose / Value / Impact / Repeat, with their questions and design decisions.
- Add one small line under the table: **"Themes we look for: resilience · innovation · collaboration · service, each linked to a Tahakom value."**
- Notes, stop 0: "What makes a story inspiring? Clear criteria, published to everyone. A story is featured when it answers four questions: what it enabled, which value it showed, what changed, and what others can repeat. Resilience, innovation, collaboration and service are the themes we look for."

### 10 The pilot (id `pilot`): `act: 4`; `transition: 'rise'`
- Stops 0 and 1 are unchanged.
- **Stop 2** becomes the KPI panel. Keep the measurement-lane idea compact, or replace it with the panel.
  - Headline stays "How we'll judge it".
  - Five KPI tiles; the proposed targets are the key numbers:

| KPI | Measure | Baseline → proposed target |
| --- | --- | --- |
| Participation | Nominations from every department | — → **every department** |
| Engagement | Colleagues reading at least one story | measured from month 1 → **most colleagues** |
| Sentiment | "My work is seen": pulse, 3 questions | baseline at launch → **up by quarter end** |
| Recognition reach | Re-survey (same question) | **8%** → **25%** |
| Visibility gap | Re-survey (same question) | **56%** → **below 40%** |

  - A small caption: **"Targets proposed for the sponsor to confirm at launch."**
  - The What-we-need card stays as support: an executive sponsor · curation time from HR and Internal Communications · our existing channels.
  - The hero line stays: **"After one quarter we come back with one recommendation: scale, adjust or stop."**
- Notes, stop 2: "How we'll judge it: participation from every department, colleagues reading the stories, a short sentiment pulse, and the same survey questions re-asked at quarter end. Reach from 8% to 25%, the visibility gap from 56% to below 40%. These targets are for the sponsor to confirm at launch. Then one recommendation: scale, adjust or stop. [Team: confirm the targets.]"

### 11 Close (id `close`)
- Stop 1 adds a small line above or below the ask strip: **"Group 1 · Buthainah Alhejazi · Abdulaziz Almalaq · Hassan Alzahrani · Fadi Alkhayrat"**. Team names are taken from the kick-off pack's Group 1 (Inspiring Others). [Team: confirm spelling and order.]

---

## New scenes

### 06b · Three ways to close the gap (id `options`, act 2, `transition: 'chapter'`, 2 stops)
*Rubric: innovation & problem solving; analysis → strategic options → clear recommendation.*

- **Stop 0.**
  - Kicker **Strategic options**. Headline **"We weighed three ways to close the gap."**
  - Three option columns (glass cards):

| Option | Title | Line | Watch-out |
| --- | --- | --- | --- |
| A | Awards | Employee of the month or year. | Rewards a few; popularity can decide. |
| B | A new platform | Buy a digital recognition tool. | Cost and adoption risk; points don't teach. |
| C | A story campaign | Real stories on the channels we already have. | Needs curation time and leaders' participation, both built into the plan. |

  - Five criteria rows, rated with 3-step marks (● strong · ◐ partial · ○ weak). Use icons, not numbers.

| Criterion | A | B | C |
| --- | --- | --- | --- |
| Reaches everyone | ○ | ◐ | ● |
| The learning travels | ○ | ○ | ● |
| Fair and credible | ◐ | ◐ | ● |
| Low cost | ◐ | ○ | ● |
| Fast to launch | ● | ○ | ● |

  - Build: the columns unfold; the ratings pop in row by row, left to right. The spark lands on C's header.
- **Stop 1.**
  - A and B dim and step back, and C lifts (`.glass.live`).
  - Hero line: **"We recommend C: a story campaign on the channels we already have."**
  - Support line: **"Awards and tools can plug into it later."**
- Notes:
  - 0: "We did not start from the answer. We weighed three ways to close the gap: awards, a new recognition platform, and a story campaign. Awards reward a few. A platform costs money and teaches little. Doing nothing keeps reach at 8%. [Team: confirm the assessment.]"
  - 1: "So we recommend the story campaign. It reaches everyone, the learning travels, it is fair by design, it costs little and it starts now, on the channels we already have. Awards and tools can plug into it later."

### 09b · Leaders go first (id `leaders`, act 3, `transition: 'chapter'`, 2 stops)
*Rubric: leadership mindset & behaviour (20 points), meaning ownership, role modelling, influence and ethical decision-making. Brief #4.*

- **Stop 0.**
  - Kicker **Leadership involvement**. Headline **"Leaders go first."** Sub (support): *"Inspiration is role-modelled, not announced."*
  - A three-tier cascade, where light flows from the sponsor to the leaders, to the managers, to the teams:

| Role | What they do |
| --- | --- |
| **Executive sponsor** | Opens the campaign with the story of a colleague who inspired them. Chairs the quarterly review and decides: scale, adjust or stop. |
| **Department leaders** | Nominate at least one colleague every quarter. Acknowledge each featured colleague in person, within a week. |
| **Managers** | Hold a five-minute story moment in every monthly team meeting. |

  - The role names are the heroes; the actions are support text. The spark lands on the sponsor.
- **Stop 1.**
  - Headline swaps to **"Leaders spotlight others, never themselves."**
  - Two quiet lists:

| Leaders do | Leaders don't |
| --- | --- |
| Nominate colleagues. | Nominate themselves. |
| Tell other people's stories. | Rank people or pick winners. |
| Protect consent and fairness. | Turn it into a broadcast. |

  - The cascade stays behind, dimmed.
- Notes:
  - 0: "Inspiration is role-modelled, not announced. So leaders go first. Our sponsor opens the campaign with the story of a colleague who inspired them. Every department leader nominates at least one colleague a quarter and thanks featured colleagues in person. Managers give stories five minutes in every monthly meeting. [Team: confirm the commitments.]"
  - 1: "And one rule keeps it honest: leaders spotlight others, never themselves. No self-nomination, no rankings, no broadcast. Consent and fairness come first. That is the leadership behaviour we want the campaign to model."

### 09c · Where the stories travel (id `comms`, act 3, `transition: 'push'`, 2 stops)
*Rubric: stakeholder engagement & communication. Brief #3 (channels and formats) and #6 (cultural fit).*

- **Stop 0.**
  - Kicker **Communication plan**. Headline **"Where the stories travel."**
  - A cadence map with four columns (**Always · Monthly · Quarterly · Annual**) and one channel card each (two for Monthly):

| Cadence | Channel | Line | Note |
| --- | --- | --- | --- |
| Always | **Intranet story wall** | Every story, plus the nomination form. | |
| Monthly | **Story email** | One story, one takeaway. | Chip: *preferred by 123 of 158* |
| Monthly | **Team story moment** | Five minutes in the monthly team meeting. | |
| Quarterly | **Spotlight** | A 60-second video and a town-hall story. | |
| Annual | **Story collection** | The year's featured stories at a company event. | |

  - A strip across the bottom (support): **"Every story in Arabic and English · approved by the colleague before it is shared."**
  - Build: the columns light left to right, like a timeline. A story light travels along the cadence line.
- **Stop 1.**
  - Headline **"Designed with what colleagues asked for."**
  - Four pairs, each a survey finding → a design decision. The numbers are the heroes (exact):

| Finding | Design decision |
| --- | --- |
| **123 / 158** prefer email | The monthly story email leads. |
| **47%** want a monthly rhythm | One story a month. |
| **32%** want to nominate anonymously | An anonymous option on the form. |
| **49%** want to approve their story | Nothing is shared without the colleague's approval. |

- Notes:
  - 0: "Where do the stories travel? On channels we already have. The intranet story wall is always open. A story email goes out every month, and email is what 123 of 158 colleagues prefer. Teams give stories five minutes a month. Each quarter brings a short video and a town-hall spotlight, and once a year a story collection. Every story is in Arabic and English. [Team: confirm channels.]"
  - 1: "We designed it with what colleagues told us. Email first. A monthly rhythm, which 47% asked for. An anonymous nomination option for the 32% who want one. And the 49% who want to approve their story get exactly that: nothing is shared without approval."

### 09d · From one quarter to a habit (id `roadmap`, act 4, `transition: 'chapter'`, 2 stops)
*Rubric: feasibility & implementation (timeline, ownership, resources); success factor "implementation plan including budget"; lifecycle step "transformation strategy / roadmap". The plan is complete by the end of 2027: fifteen months from the pilot.*

- **Stop 0.**
  - Kicker **Roadmap**. Headline **"From one quarter to a habit, by the end of 2027."** (the date in teal)
  - A horizontal roadmap with four milestones on a glowing timeline:

| When | Stage | What happens |
| --- | --- | --- |
| **Q4 2026** | **Pilot** | One quarterly cycle, open to everyone. Decide: scale, adjust or stop. |
| **H1 2027** | **Scale** | Every department, a story champion in each, video and town-hall spotlights. |
| **Q3 2027** | **Embed** | Part of onboarding and leadership development. |
| **Q4 2027** | **Habit** | Self-running by year end, closed by the first annual story collection. |

  - The pilot is the hero (lit, `.glass.live`); the others are quieter. The spark lands on Pilot.
- **Stop 1.**
  - Headline **"Who runs it, and what it costs."** Two glass panels.
  - **Owners** (left): Executive sponsor, meaning direction and the quarterly decision · Curation panel, meaning HR, Internal Communications and one rotating employee, choosing monthly · Internal Communications, meaning channels and calendar · HR / People Analytics, meaning the dashboard · Story champions, from H1 2027.
  - **Budget** (right): hero line **"Low cost by design: people time, not new software."** Three support lines:
    - No new platform: email, intranet and town halls already exist.
    - People time: the curation panel, about two hours a week.
    - A small recognition budget: certificates and the annual event.
- Notes:
  - 0: "This is a roadmap, not a one-off, and it is done by the end of 2027: fifteen months. A one-quarter pilot this year. In the first half of 2027 we scale to every department, with a story champion in each. In the third quarter it becomes part of onboarding and leadership development. By the end of 2027 it runs itself, and the first annual story collection closes the year: stories are simply how Tahakom shares what works."
  - 1: "Who runs it: the sponsor decides, a curation panel from HR, Internal Communications and one rotating employee selects each month, Communications runs the channels, and HR runs the dashboard. The cost is mostly people time, about two hours a week for the panel, plus a small recognition budget. No new software. [Team: confirm the estimate and the budget.]"

### 09e · What could break it (id `risks`, act 4, `transition: 'push'`, 1 stop)
*Success factor: leadership & change management; topic areas: risk-mitigation plan.*

- Kicker **Risks & change**. Headline **"What could break it, and the guard built in."**
- Four rows: the risk is the hero, the guard and owner are support.

| Risk | Guard | Owner |
| --- | --- | --- |
| **It becomes a popularity contest or a broadcast** | Peers nominate; the criteria are published. | Curation panel |
| **Nominations dry up after launch** | Always open; each featured colleague nominates the next. | Internal Communications |
| **A sensitive story is published** | Facts checked and consent given before anything is shared. | HR, with Legal on request |
| **Stories cluster in a few departments** | Representation tracked from month one. | HR / People Analytics |

- A small caption: **"Change stays small: it runs on meetings and channels people already use."**
- Build: rows slide in one by one. Each guard "locks" onto its risk (a light closes a bracket). The spark lands on row one.
- Notes, 0: "What could break it? Four risks, each with a guard already in the design and an owner. And the change stays small, because it runs on meetings and channels people already use. [Team: confirm owners.]"

---

## Word budget (speaker notes)
| Act | Words |
| --- | --- |
| I | ≈ 200 |
| II | ≈ 480 |
| III | ≈ 450 |
| IV | ≈ 230 |
| V | ≈ 330 |
| **Total** | **≈ 1,690** |

Trim any existing note above 45 words (benchmark stop 0, survey stop 3, pilot stop 2).
