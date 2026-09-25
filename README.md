# Behind a Better Life — Lead Forward 2026

A presenter-driven animated deck. Each click plays the next build and then **stops**. While it is stopped, the scene keeps breathing (the colleague field twinkles, lights travel, photographs drift slowly) so you can talk as long as you need. Click again to move on.

It merges the two earlier cuts:

- the **Story Cycle** film (Nouf and Faisal)
- the **Executive Cut** (the final PowerPoint content)

The result is one 17-scene, 62-stop talk of about 15 minutes. It runs fully offline in Chrome or Edge.

## Present it
1. Open **`dist/Behind-a-Better-Life.html`** in Chrome or Edge. It is a single self-contained file (fonts and photos are embedded), so it can go on a USB stick. You can also double-click `Present (Windows).bat` or `Present (Mac).command`.
2. Press **F** for full screen, then **S** to open the speaker view on your laptop screen.
3. Advance with a clicker, **→**, **Space** or **PageDown**. A mouse click also advances.

| Key | Action |
| --- | --- |
| → · Space · PageDown · Enter · click | next stop |
| ← · PageUp | back one stop (lands on its settled frame) |
| ] / [ or Shift+→ / Shift+← | next / previous scene |
| number + Enter (e.g. `5` Enter) | jump to that scene, fully built (for Q&A) |
| Home / End | first frame / final Q&A hold |
| **S** | speaker view: notes per stop, next cue, timer, act pace targets |
| **B** or **.** | black screen (any key brings it back without moving) |
| **F** | full screen (a clicker's F5 key also only enters full screen) |
| **C** | projector contrast mode (brighter text and photos, stronger field) |
| **L** | lite mode for weak laptops |
| **H** | hide the progress bar |
| **G** / **O** | scene overview |
| **A** | autoplay (unattended loop) |

The deck remembers where you are in the address bar (`#survey.2`), so a reload comes back to the same stop.

## The talk

| Act | Scenes (stops) | Aim to finish by |
| --- | --- | --- |
| I · The moment | 01 Open (2) · 02 The question (4) · 03 One night (4) | 2:30 |
| II · The gap | 04 The gap (5) · 05 What colleagues told us (6) · 06 Reading the numbers (4) | 6:30 |
| III · Why it matters | 07 The link (4) · 08 Strategic alignment (3) | 8:30 |
| IV · The cycle | 09 The cycle (3) · 10 One story, through the cycle (5) · 11 The story format (3) · 12 Operating rhythm (3) · 13 Recognition (5) | 12:30 |
| V · The pilot | 14 Measure (3) · 15 What could break this (2) · 16 The ask (3) · 17 Close (3) | 15:00 |

The thread through the whole deck is a single light, standing for one colleague's story:

1. It ignites in the opening.
2. On the night shift it stays between **two people**.
3. It gets walled in by team boundaries.
4. It travels the cycle.
5. In the close, it passes colleague to colleague until the whole field is lit, starting from the same two squares.

The last frame holds the ask on screen for Q&A.

Full storyboard, copy and rationale: [`docs/STORYBOARD.md`](docs/STORYBOARD.md). Speaker notes for every stop are in the speaker view (**S**).

## Confirm before presenting
These changed from, or were added to, the approved deck. Check each one with the team:

- **One name for the cycle.** Capture → Curate → Feature → Reinforce is used everywhere. The operating rhythm (scene 12) and the ask (scene 16) previously said "Collect → Validate → Feature → Learn".
- **Nouf's story is the night-handover version and is illustrative.** It is tagged on screen, and there are no invented numbers. The Executive Cut's junction story (−38%) was a drafted placeholder and has been removed.
- **Scene 15, risk owners** (Curation panel, Internal Communications, HR/Legal, HR/People Analytics). These are proposals taken from the team's concept deck.
- **Scene 16, "What we need"** (an executive sponsor, curation time from HR and Internal Communications, existing channels) and the "scale, adjust or stop" report-back.
- **Scene 14, baseline.** It says the same eight survey questions will be re-asked at the end of the quarter.

## Tech check at the venue (5 minutes)
- Use Chrome or Edge, full screen (**F**). Set the display to 1920×1080 if possible.
- Do a clicker test: next, back and blank.
- Open the speaker view (**S**) and drag it to the laptop screen, then check that the deck window is on the projector.
- Look at scene 05 at stop 3 (the 8% sea-green squares) on the real projector. If it looks washed out, press **C**.
- If animation stutters, press **L**.
- Turn off notifications and sleep, and close Teams and Outlook.
- Backup: `dist/Behind-a-Better-Life-stops.pdf` has every stop as a static page with its notes. It opens on any computer.

## Editing
- The source deck is `index.html`. Each scene is `scenes/NN-id.js` + `.css`. The engine is in `js/`, and the design system is `css/deck.css`.
- Scene authoring rules are in [`docs/SCENE_GUIDE.md`](docs/SCENE_GUIDE.md).
- Rebuild the single file with `python3 tools/build.py`.
- Screenshot every stop with `node tools/shoot.js --motion` (Playwright). Then check that ambient motion is running with `python3 tools/motion.py shots`, and that back navigation matches forward navigation with `node tools/backcheck.js` followed by `python3 tools/backdiff.py`.
- Regenerate the PDF backup with `python3 tools/export_pdf.py shots/all dist/Behind-a-Better-Life-stops.pdf`, after running `node tools/shoot.js --file dist/Behind-a-Better-Life.html --out shots/all`.

The people in the photographs are AI-generated illustrations, not Tahakom employees.
