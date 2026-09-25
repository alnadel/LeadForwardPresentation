# Scene authoring guide

How to build a scene for this deck so all 17 feel like one film. Read `docs/STORYBOARD.md` for what each scene says, and study the two reference scenes, `scenes/01-open.*` and `scenes/05-survey.*`.

## Files and registration
- Each scene is two files: `scenes/NN-id.js` and `scenes/NN-id.css`, already linked from `index.html`. Edit only your own scene's two files.
- Scope **every** CSS selector with `#s-<id>`. Prefix every keyframe name with a short scene prefix (for example `svScan`) so names never collide.
- The JS calls `Deck.scene({...})` once. Wrap helpers in an IIFE so nothing leaks to `window`.
- Plain ES2019 in the browser. No modules, no frameworks, no network, no external fonts or images. Assets live in `assets/` and are referenced relative to `index.html` (for example `url('assets/photos/nouf.jpg')`).

```js
Deck.scene({
  id: 'gap', title: 'The gap', act: 1,            // act index: 0 moment · 1 gap · 2 cycle · 3 case · 4 ask
  bg: 'night',                                   // stage mood: plum | night | navy | deep | teal
  tag: 'illustrative',                           // only for Nouf/Faisal story scenes
  cues: ['Headline', 'Good work happens', …],     // ONE PER STOP — the stop count comes from this
  notes: ['what to say at stop 0', …],            // one per stop, plain sentences for the speaker view
  field: [{ dim: .3, … }, {…}, …],                // per stop, merged cumulatively (see "The field")
  html: `…`,
  init(ctx) {}, enter(ctx) {}, step(n, prev, ctx) {}, leave(ctx) {},
});
```

## The stage
- 1920×1080 px, scaled to fit. Author in absolute px.
- Side margin `--m` is 144px, so content runs from x=144 to x=1776. The first line of content (the kicker) sits at y≈150 (`.pad` does this).
- Keep y > 960 empty. The progress chrome lives there, and the mark sits top right (x>1700, y<120).
- Keep the Illustrative tag area (top right, x 1300–1776, y 40–100) clear on story scenes.
- Dark cinematic world. Backgrounds are set by `bg` plus the global colleague field. Do not paint an opaque full-screen background, except photo scenes, which do it with `.photo`.

## Type (room legibility — these are minimums)
| class | use | size |
| --- | --- | --- |
| `.kicker` | section label, caps, teal, with rule | 20px |
| `.display` | title-scale words | 150px |
| `.h1` | the one big statement | 92px |
| `.h2` | scene headline | 70–76px |
| `.h3` / `.h4` | item titles | 44 / 34px |
| `.lead` | sub-headline | 36px |
| `.body` | descriptions | 29px |
| `.small` | secondary | 24px |
| `.label` | caps labels | 22px |
| `.caption` | footnotes and sources only | 22px |

- **Nothing smaller than 20px.** Body copy is 26–30px. Big numbers go large (120–200px).
- One headline per scene. Keep the approved copy from the storyboard exactly, including its punctuation (’ — ·).
- Colours: headlines white; body `var(--ink-2)`; accents `var(--teal)`; gaps and negatives `var(--purple-lt)`/`var(--purple)`; `var(--sea)` only for glows and highlights, never paragraphs.

## Stops and builds (declarative — prefer this over JS)
- `data-in="n"`: hidden until stop n, then animates in. Variants by class: default (rise), `a-fade`, `a-left`, `a-right`, `a-down`, `a-scale`, `a-zoom`, `a-blur`, `a-pop`, `a-wipe` (left→right clip), `a-wipe-down`, `a-none`.
- Timing: `style="--d:.4s"` delays; `style="--dur:1.4s"` sets duration. On a parent, `data-stagger style="--stagger:.12s"` numbers the children so they cascade.
- `data-out="n"`: leaves at stop n (for swapping panels in place).
- `data-dim="n"`: recedes from stop n on (focus moves to the new point).
- `data-at="n"`: gets `.at` only while on stop n, and `.past` after.
- `data-split` on a heading: the words rise out of a mask (the house style for headlines).
- `data-count="56"` (plus `data-from`, `data-dur`, `data-decimals`, `data-delay`, `data-sep`): counts up when it becomes visible.
- `data-type` (plus `data-cps`, `data-delay`): types its text out. Add the class `.typing` for a caret.
- The section carries `.st-0 … .st-n` for every stop reached, and `data-step="n"` for the current one. Use `#s-id.st-2 .x { … }` for "from stop 2 on" states. This is the cleanest way to drive SVG and diagram state.
- `step(n, prev, ctx)` runs after each change. **n may be -1** (reset before the entrance), and `ctx.instant` is true when jumping. JS state must be **idempotent**: derive everything from `n`, never from the history of clicks. Going back one stop must produce exactly that stop's frame.
- Scene timers: `ctx.after(ms, fn)` (cleared on every step change), `ctx.every(ms, fn)` and `ctx.loop((t, dt) => …)` (cleared on leave; loops restart in `enter`). Start per-scene loops in `enter(ctx)`, never in `init`.
- A build should settle within about 2.5 s of the click. The presenter is talking by then. Stagger the reveal of lists with `data-stagger` rather than one click per item, unless the storyboard gives each item its own stop.

## Ambient motion (the scene must stay alive while parked)
Every stop needs something slow and continuous, so a parked frame never looks frozen. Keep it calm: slow, low amplitude, nothing that competes with the speaker.
- Utility classes: `.amb-breathe`, `.amb-float`, `.amb-float-2`, `.amb-spin`, `.amb-spin-rev`, `.amb-ken` (photos), `.amb-ken-2`, `.amb-twinkle`, `.amb-blink`, `.amb-flow` / `.amb-flow-slow` (SVG dashed connectors), `.amb-glint`, and `.amb-ring` (an expanding ring around a light).
- Scene-specific keyframes are fine: travelling lights along SVG paths (CSS `offset-path: path('…')` with `offset-distance` animation, or SMIL `<animateMotion>`), orbiting dots, scanning lines, ticking clocks.
- Don't: animate layout properties on large elements, blur large areas every frame, or loop more than ~3 distinct motions in one frame.

## The story light (the deck's motif)
`<i class="light"></i>` (also `.lg`, `.sm`) is the teal glowing rounded square that stands for **one colleague's story**. Use it whenever a story moves. Never use it as decoration unrelated to stories. `.node` / `.node.on` is a numbered squircle marker for diagram stages.

## The field (global ambient layer)
`field` per stop merges cumulatively: `[{…stop0}, {…changes at stop1}, …]`.
- `dim` 0–1: how visible the colleague field is (0.2–0.35 behind dense copy, up to 0.8 in visual moments).
- `lit` 0–1: the share of colleagues lit. With `litFrom: [x, y]`, the light spreads outwards from that point as `lit` grows.
- `travel`: stories per second hopping between neighbours (0–4).
- `offset: [x, y]`: camera pan. Give every scene a different offset, within ±240px, so the world drifts between scenes.
- `calm: [[x0, y0, x1, y1, amount]]`: quiets the field behind copy.
- `warm` 0–1: tints the field plum.
- In JS: `Field.burst(x, y, {radius, dur})` sends a ripple of light from a point, and `Field.send(x0, y0, x1, y1, dur)` sends one story across the frame. Call these from `step()` only when `!ctx.instant`.

## Components you can use
`.card` (dark glass), `.card.plum`, `.paper` (white UI mock surface, for example forms and posts — navy text), `.chip` / `.chip.on`, `.tag-illustrative`, `.rule`, `.hair`, `.node`, `.light`, `.photo`, `.veil-left`, `.veil-plum`, `.veil-bottom`, `.num` (tabular figures). `Deck.icon('handshake')` returns an inline SVG in currentColor, size set by `font-size`. Available icons: chart-growth, content-layout, document-certified, employee-female, employee-male, eye-lightbulb, gear-clock, hands-teamwork, handshake, laptop-analytics, person-message, team, user-network, users-connected. `Deck.logo()` returns the white stacked lockup; `Deck.art('mark')` the mark alone.

Photos in `assets/photos/`: `ops-centre-night.jpg` (2560×1440), `nouf.jpg` (2400×800 banner, Nouf at left, night skyline), `nouf-question.jpg` (2400×1600, Nouf centre-left in a daytime conversation), `faisal.jpg` (1200×1440 portrait), `riyadh-aerial.jpg`, `riyadh-dusk.jpg`, `team-ops.jpg` (2560×1440 each).

## Brand rules that matter here
- Somar only. Plum `#602650` is the body, teal `#25C7BC` the accent, sea green `#03FFCB` a highlight only.
- No emoji. No non-brand icon sets. No cross-hue rainbow gradients.
- Caps for labels, sentence case for copy.
- Nouf and Faisal are illustrative: keep `tag: 'illustrative'` on their scenes, and never invent headcounts or reach numbers.

## Verify before you finish (mandatory)
1. `node tools/shoot.js --scenes <id> --out shots/<id> --motion --wait 3000`
2. `python3 tools/motion.py shots/<id>`: every parked stop should show some motion (roughly >0.5% of the frame moving).
3. Read the PNGs in `shots/<id>/` and look at every stop:
   - no overlaps
   - nothing clipped
   - nothing under the chrome
   - text legible
   - the build reads in the intended order
   - the frame looks finished and intentional
4. `shots/<id>/report.json` must have an empty `errors` array.
5. Also test going back: open `index.html#<id>.<last>` with `Deck.prev()` a few times, or reason carefully that `step()` is idempotent.
Iterate until it is right, then delete your `shots/<id>` folder.
