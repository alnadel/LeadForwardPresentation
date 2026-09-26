# Scene guide — v2 addendum

Everything in `docs/SCENE_GUIDE.md` still applies (stops, `data-in` / `data-out` / `data-dim` / `data-split` / `data-count`, the field, type minimums, colour roles, honesty rules). v2 differs as follows.

## Files
- The page is `index-v2.html`. Scenes live in `scenes-v2/NN-id.js` and `.css`, already linked. The engine is `js/engine-v2.js`, the field is `js/field-v2.js`, and the styles are `css/deck-v2.css`.
- Edit only your own scene files. Put anything shared in your report.
- Scope all CSS to `#s-<id>` and prefix every keyframe name with your scene code.
- Source material: the v1 scene with the same content (`scenes/NN-*.js/.css`). Copy and adapt it freely, but keep the v2 ids and stop counts from `docs/STORYBOARD-v2.md`.

## New in the engine
- `transition: 'push' | 'rise' | 'dolly' | 'chapter' | 'iris'` on the scene, as given in the storyboard. `chapter` (the default across act boundaries) is a title card: the old act falls away, a line of light carries the act's number and name, then splits open onto the scene; stop 0 builds as it opens. An `iris` scene can set `irisBurst: <radius>` (default 2200, 0 = none) to limit the field flash.
- **The spark:** put `data-spark="n"` on the element that stop n is about. `data-spark-at="l|r|t|b|c|tl|tr"` sets where the light rests (default: 34px left of the element, vertically centred). `data-spark-xy="x,y"` overrides with stage coordinates, which you need when the element lives inside a transformed or scaled group.
  - Use at most one target per stop; the engine flies the light there, lands it with a ripple and flashes the element (`.sparked`).
  - A stop with no target fades the light out. `spark: 'keep'` keeps it parked instead; `spark: false` disables it for the scene.
  - Choose targets that direct attention, and keep the light clear of text: 34px of air is the default.
- **Entrance classes, added to the v1 set:**
  - `a-unfold` for cards (a clip unfolds downward);
  - `a-materialize` for icons and nodes (forms out of light);
  - `a-flip` (3D rotateX), `a-swing` (3D rotateY) and `a-drop`.
  - Default entrances now rise out of an 8px blur. `data-split` headlines flip word by word in 3D, then catch a light sweep.
- **Ambient classes, added to the v1 set:**
  - motion: `amb-float3d` / `amb-float3d-2` (card tilt and float), `amb-bob`, `amb-pulse` (glow pulse on nodes), `amb-orbit`, `amb-sway`, `amb-ken-strong` (photos);
  - light on text and panels: `amb-glow-text`, `amb-shimmer` (a light passing through highlight words — text-only elements), `amb-sheen` (a periodic diagonal sheen on cards), `amb-scan` (a scan light on panels);
  - overlays for photos: `amb-rays` and `amb-leak` (put one `<div class="amb-rays">` or `amb-leak` in the photo stack);
  - particles: `amb-dust` (a parent with `<i style="left:…;top:…;--t:14s;--dl:-3s;--dx:40px;--dy:-200px">` children).
- **Materials:** `.glass` is the premium card: a lit gradient edge, inner highlight and deep shadow. `.glass.plum` is the purple variant, and `.glass.live` adds a slow light travelling round the edge (use it on one hero card per stop, not everywhere). `.paper` stays the white card for product mock-ups.
- **Field keys**, with scene defaults in brackets: `links` (.6) constellation lines, `wave` (.5) brightness bands, `streaks` (.12/s) shooting lights, `sparkle` (1.2/s) flares, `drift` (1) camera wander, `travel` (.5).
  - Turn these up in visual moments and down behind dense copy. Use `calm` zones for every text block.
  - `Field.warp(kind, dur, amt, [cx, cy])` and `Field.kick(dx, dy, dur)` are available for in-scene camera moves; call them only when `!ctx.instant`.

## The bar for v2
- **Alive when parked.** Every parked stop needs **2–4 distinct continuous motions**: for example, photo push-in + light leak + flowing connector + breathing node.
  - Target: `python3 tools/motion.py` should report **≥ 2%** of the frame moving on every stop, with no stop below 1%.
  - Motion must still be smooth and slow enough to talk over.
  - Nothing moves inside the paragraph being read, and numbers never change while parked.
- **Rich builds.** Each stop's build should feel choreographed: elements arrive in a clear order, the spark leads the eye, and connectors draw with a leading light.
  - All text still lands within about 1.2 s of the click.
  - Motion may continue after the text lands; the build should settle by about 2.5 s.
- **Audience-first hierarchy.** Per stop, the 1–2 things the audience must take away (the headline plus one hero element) are the largest and brightest, and the spark lands there. Everything else is visibly subordinate: supporting sentences about 20–24px at 55–70% white, captions, caveats and sources 16–18px. Key text stays big (headlines 64px+, key lines 32px+). Move pure duplication into the notes; never drop numbers, caveats or honesty tags.
- **One scene, one idea per stop.** Condensed does not mean crowded. If a stop feels dense, cut words (move them into the notes) rather than shrinking the type.

## Verify (mandatory)
```
node tools/shoot.js --file index-v2.html --scenes <ids> --out shots/v2-<name> --motion --wait 3200
python3 tools/motion.py shots/v2-<name>
node tools/backcheck.js --file index-v2.html --scenes <ids> --out shots/v2-<name>-back && python3 tools/backdiff.py shots/v2-<name>-back
```
- Read every PNG. Check that `report.json` has no errors and that back navigation has 0 mismatches.
- Watch a build in real time with `node tools/cast.js --scene <id> --stop <n> --out shots/v2-<name>-cast --at 0,200,400,700,1000,1400,2000,2600 --w 960 --h 540`. It saves screencast frames with their real timestamps; headless Chrome runs slowly here, so expect about 2× stretch.
- Also capture your scene's entrance: `node tools/transitions.js --file index-v2.html --out shots/v2-<name>-tx`, then look at the frames that belong to your scene.
- Keep scratch scripts in `<scratchpad>/<your-name>/`, never in the repo root.
