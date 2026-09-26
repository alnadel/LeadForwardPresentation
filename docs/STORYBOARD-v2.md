# Behind a Better Life — v2 storyboard (condensed, cinematic)

**Goal:** the same argument as v1 in about 15 minutes, with **11 scenes and 32 stops** (v1 has 17 and 62). Every stop is one clear idea, the scene changes are cinematic camera moves, and the frame is visibly alive while parked. v1 stays as the full-detail version for Q&A.

The v1 scene files (`scenes/NN-*.js/.css`) are the source material. Reuse their layouts, copy, SVGs and notes freely. Where v2 merges scenes, compress them: a merged scene is not two scenes glued together.

## What changed from v1

| v1 | v2 |
| --- | --- |
| 02 Question + 03 One night | **02 One night** (3 stops): question → Nouf rebuilds the handover → "Two people know." The four verbs are dropped. |
| 04 Gap (5 stops) | **03 Gap** (3) |
| 05 Survey (6) | **04 Survey** (4): 158 · 56% · 8% · 80% (+49%) with the punchline |
| 06 Benchmark (4) | **05 Benchmark** (2): all four dumbbells build in one choreographed stop, then the reading |
| 07 Link + 08 Alignment | **06 Why it matters** (3): prism flow → link statement → strategic value over the aerial photo |
| 09 Cycle | **07 Cycle** (3), unchanged in substance |
| 10 Journey (5) | **08 Journey** (4): capture · curate+feature · reinforce · the chain |
| 11 Format + 12 Rhythm + 13 Recognition | **09 How it runs** (3): one stop each, with tabs sliding between them |
| 14 Measure + 15 Risks + 16 Ask | **10 The pilot** (3): approve → the quarter plan → how we'll judge it + scale/adjust/stop. The risks table moves to the notes, and v1 scene 15 is there for Q&A. |
| 17 Close (3) | **11 Close** (2): the chain → brand + ask kept on screen for Q&A |

## Motion language (v2)
- **Scene cuts are camera moves:**
  - `push` (sideways travel)
  - `rise` (crane up)
  - `dolly` (fly through the frame)
  - `mosaic` (the frame breaks into the brand's squares and re-forms; used at act boundaries)
  - `iris` (the next scene opens out of the story light)

  Set `transition:` on the scene. The field warps and streaks with each move, and a light sweeps across.
- **The spark** is one story light that flies to each stop's focus: mark the target with `data-spark="n"`. It lands with a ripple, then parks and breathes. Choose targets that tell the story: the number that matters, the node being discussed, the new line.
- **Builds are richer:**
  - headlines flip in word by word in 3D and then catch a light sweep (`data-split`);
  - entrances rise out of blur;
  - cards unfold (`a-unfold`);
  - icons materialize out of light (`a-materialize`);
  - numbers count and land with a punch.
- **Parked frames stay visibly alive.** Aim for **2–4 distinct continuous motions per stop**, e.g. photo drift + light leak + a flowing connector + a breathing node. Rules:
  - motion stays smooth and slow enough to talk over;
  - nothing inside the paragraph being read moves;
  - numbers never change while parked.
- The global field is livelier by default: constellation lines, brightness waves, shooting lights, sparkles and a wandering camera. Scenes tune it with `links`, `wave`, `streaks`, `sparkle`, `drift`, `travel`, and keep text areas readable with `calm` zones.

## Acts and timing
| Act | Scenes (stops) | ≈ time |
| --- | --- | --- |
| I · The moment | 01 Open (2) · 02 One night (3) | 2:00 |
| II · The gap | 03 Gap (3) · 04 Survey (4) · 05 Benchmark (2) | 4:00 |
| III · Why it matters | 06 Why it matters (3) | 1:45 |
| IV · The cycle | 07 Cycle (3) · 08 Journey (4) · 09 How it runs (3) | 4:30 |
| V · The pilot | 10 The pilot (3) · 11 Close (2) | 2:30 |

Speaker notes: about 20–40 words per stop, 1,400 words in total.

---

### 01 · Open — 2 stops · (first scene)
Keep the v1 open (ops-centre photo, lockup, title, Arabic, tagline, one light igniting), but bring it more alive: a stronger photo push-in, a light leak drifting across the video wall, dust motes and data flickers on the wall. At stop 1 the spark is born at the tagline light.

### 02 · One night — 3 stops · transition `dolly` · tag illustrative from stop 1
- **0** A centred display-size question: **When was the last time a colleague inspired you?** The field is gently alive around it.
- **1** The question falls away, and the film frame builds: huge `03:12` (blinking colon), `TRAFFIC OPERATIONS CENTRE · NIGHT SHIFT`, the `nouf.jpg` band, and **Nouf rebuilt the night handover — unasked, in one afternoon.** Note scraps fly together into the `NIGHT HANDOVER · v2` card with six ticked rows. Beneath, a small before → after line: *Morning shift, first hour: rebuilding the night → on live incidents from minute one.* Spark: on the card.
- **2** The pull-back to two lit squares at `Deck.NIGHT_PAIR` / `Deck.NIGHT_OFFSET` (pins): **Two people know.** *Nouf, and the colleague who sat next to her.* Use the exact 03.3 image from v1 (two lights and a soft halo). Spark: fades out, so the pair is the only light.

### 03 · The gap — 3 stops · transition `mosaic` (act II)
- **0** **Inspiration is happening — but it is not always visible.** Three districts; lights ignite inside them. 01 **Good work happens** (short line).
- **1** 02 **Visibility stays local** + 03 **Learning does not travel**: ripples hit the walls and the bridges fail (the v1 motion, stronger).
- **2** The districts recede. *Meaningful contributions exist — the gap is making them visible, recognised and shared across Tahakom.* **Behind a Better Life closes that gap through real employee stories.** Plus the strip `TODAY'S ASK · Approve a one-quarter pilot`.

### 04 · What colleagues told us — 4 stops · transition `push`
The v1 waffle (16×10, filled column by column), with the big number on the left.
- **0** 158 assemble, counting up.
- **1** **56%** visibility gap (purple).
- **2** **8%** recognition reach: 13 sea-green squares, everything else dims hard.
- **3** **80%** connection (teal sweep) with a secondary **49%** practical learning, and **The work exists. The visibility channel does not.** "What else we heard" goes in the notes.

Ambient: a wave across the respondents, a hero glow, figures that breathe.

### 05 · Reading the numbers — 2 stops · transition `push`
- **0** **Willingness is strong; the mechanism is weak.** The axis draws, then the mechanism rows (purple, left) and the willingness rows (teal, right, +48 as the hero) build in one choreographed sequence of about 2.2 s. The caveat and sources stay visible.
- **1** READING: **Behind on the mechanism, ahead on the willingness — build the channel, then test it.**

### 06 · Why it matters — 3 stops · transition `mosaic` (act III)
- **0** **Recognition creates value at two connected levels.** The v1 prism flow builds in one sequence: the employee node, "shared story", then teal beams to 02A / 02B, with the employee card and org cards in compact form.
- **1** **Employee recognition becomes organisational value when the story is shared.** · *Retention remains a possible long-term effect — not a direct outcome of the pilot.*
- **2** The camera rises (in-scene) to `riyadh-aerial.jpg`. `STRATEGIC VALUE` **The initiative does not create new values — it helps employees recognise and apply the values Tahakom already has.** The six value chips light in turn, and three compact pillar labels (Purpose connected to work · Values become visible · Learning moves across teams) appear as captions.

### 07 · The cycle — 3 stops · transition `iris` (act IV opens out of the light)
The v1 scene: the lanes ("Most recognition stops at the award. This keeps going.") → the ring with Capture / Curate / Feature / Reinforce → THE CYCLE REPEATS + principles. The orbit, node pulses and chevrons flowing are stronger.

### 08 · One story, through the cycle — 4 stops · transition `dolly` (fly into the ring) · tag illustrative
The v1 rail + hero objects, compressed:
- **0** CAPTURE: Faisal's 30-second nomination.
- **1** CURATE → FEATURE: the checks tick, then the post publishes.
- **2** REINFORCE: the certificate, and four teams ADOPTED.
- **3** THE CHAIN: Nouf nominates the next colleague; **Recognition becomes behaviour.**

### 09 · How it runs — 3 stops · transition `push`
Three tabs across the top (`01 Story format · 02 Quarterly rhythm · 03 Recognition`), with an indicator that slides. Each stop's panel slides in from the right as the previous slides out left:
- **0** **Every story turns strategy into repeatable behaviour.** Purpose / Value / Impact / Repeat, each with its question and one-line design decision.
- **1** **The operating cycle keeps stories moving.** Always open (Capture) → Month 1 Curate / Month 2 Feature / Month 3 Reinforce, with a playhead, plus the annual collection.
- **2** **Recognition should make the employee feel seen.** The three tiers as nested squircles, and **Use Featured Story — not Best Story.**

### 10 · The pilot — 3 stops · transition `mosaic` (act V)
- **0** Over `team-ops.jpg`: `THE ASK` **Approve the pilot.** (display)
- **1** *Start with one quarterly cycle and measure what changes.* The quarter ring draws, with three commitments: open nominations · run one full cycle (Capture → Curate → Feature → Reinforce) · report what changed.
- **2** How we'll judge it: a compact measurement lane with four gantries (participation · reach · recognition · repeatable behaviour), the baseline *recognition reach 8% · visibility gap 56% today → the same eight questions at quarter end*, and `WHAT WE NEED` *an executive sponsor · curation time from HR and Internal Communications · our existing channels*. Then **After one quarter we come back with one recommendation: scale, adjust or stop.**

### 11 · Close — 2 stops · transition `iris`
- **0** The callback: **Two people knew.** The branching chain lights the whole field (the v1 scene 17 stop 0).
- **1** The lockup, **Behind a Better Life**, the Arabic line, **Make the contribution visible. Make the learning travel.**, *Light the way.*, THANK YOU, and the ask strip (Approve a one-quarter pilot · open nominations · run one full cycle · report what changed), kept on screen for Q&A.

## Honesty rules (unchanged)
- Nouf and Faisal are illustrative and tagged wherever they appear.
- No invented numbers.
- Survey and benchmark figures are exact, with the caveat legible.
- Retention is never claimed as a pilot outcome.
- The risk owners and the "what we need" list are proposals for the team to confirm.
