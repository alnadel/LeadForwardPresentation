# Fix plan: "Behind a Better Life"

Paths are relative to `/home/user/LeadForwardPresentation/`. Scene files are `scenes/NN-id.js` and `scenes/NN-id.css`. I checked every item against the screenshots and sources. After each fix, reshoot with `node tools/shoot.js --scenes <id> --out shots/<id> --motion --wait 3000` and confirm with `tools/motion.py` that every parked stop shows at least 0.5% motion.

## 1. Per-scene fixes (highest severity first)

### 03 night
1. **HIGH, 03.3: the frame shows three squares under "Two people know."**
   - **Cause:** the brightest square is the 14px DOM `.nt-pair .light` placed between the two pinned field squares, which render at only about 9px.
   - **Markup:** change `.nt-pair` to hold only `.nt-halo`, which is the storyboard's "soft light between". Add two lights after it: `<i class="light nt-p"></i><i class="light nt-p"></i>`.
   - **JS:** in `ctx.placePair`, place each `.nt-p` at `translate(p[i][0]-11px, p[i][1]-11px)`, where `p` is `Field.pinned()` or falls back to `REST`.
   - **CSS:**
     - `#s-night .nt-p{position:absolute;left:0;top:0;opacity:0;animation:ambBreathe 3.4s ease-in-out infinite}`
     - `#s-night .nt-p+.nt-p{animation-delay:-1.7s}`
     - `#s-night.st-3 .nt-p{opacity:1;transition:opacity 1.2s var(--ease-soft) .95s}`
     - Lower the halo's inner stop to `rgba(37,199,188,.14)`.
   - **Result:** two 22px lights about 99px apart, with nothing brighter between them. Scene 17 must reuse this exact markup (see 17).
2. **MED, 03.2: the dimmed handover card turns into a grey slab.** Delete the `.nt-card::after` overlay rules. Use `#s-night.st-2 .nt-card-w{opacity:.25;transform:scale(.92) translateY(16px)}`.
3. **MED, 03.1–2: the 264px white clock competes with the statement.** Add `#s-night.st-1 .nt-clock,#s-night.st-2 .nt-clock{opacity:.35;transition:opacity .9s var(--ease-soft)}`. Set `.nt-head` to `64px`. The dimmed clock also softens the "03:12 vs MORNING SHIFT" clash.
4. **MED, 03.0: the right 40% of the photo band is almost black.**
   - Base `.nt-veil` stops become `.28/.22/.42@60%/.6@100%`.
   - Move the current heavy right-hand stops into a new `.nt-veil-card` layer at `opacity:0`.
   - Add `#s-night.st-1 .nt-veil-card{opacity:1;transition:opacity .8s}`. This applies from stop 1 on.
5. **LOW:**
   - `ntBlink` becomes `0%,45%{1} 55%,90%{.4}`, 3.2s, ease-in-out.
   - `.nt-know-h` uses `--d:.8s`; `.nt-know-s` uses `--d:1s;--dur:.5s`.
   - Card right edge to the margin: `CARD.x=1216` and `.nt-card-w{left:1216px}`.

### 17 close
1. **HIGH, 17.0: the callback does not match 03.3 (one bright light, different layout, unapproved sub-line).**
   - Replace the `.cl-pair` contents with the same halo and two `.light` elements as 03, positioned in the existing loop at `Field.pinned()`. Drop the amb-rings, or put one ring on each light.
   - Compute `KNOW` with the same formula as `03-night.js` line 48. Render `.cl-knew` at `left:KNOW.x; top:KNOW.y; width:760px; text-align:center`, and set `.cl-knew .h1{font-size:80px;letter-spacing:-.028em}`.
   - Delete `.cl-knew-sub` ("With Behind a Better Life, the story keeps going.") and its CSS. It is not approved copy.
   - Set `field[0].calm` to `[[KNOW.x+20,KNOW.y,KNOW.x+740,KNOW.y+120,.8]]`.
2. **HIGH, 17.1–17.2: lit field squares crowd the logo, the title, the Arabic line and the tagline** on the final brand frame (a 30 s hold).
   - `field[1].calm` becomes `[[800,20,1120,205,1],[380,215,1540,470,.9],[380,470,1540,700,.75]]`.
   - `field[2].calm` uses those same three zones plus the existing `[300,760,1620,930,.7]`.
3. **LOW, 17.2: the lockup looks washed out.** Replace the `.55` rule with `#s-close.st-2 .cl-make,.cl-way,.cl-thanks{opacity:.85}` and add `#s-close.st-2 .cl-sky .photo{opacity:.5;transition:opacity 1s}`.
4. **LOW, 17.2 ask strip:** `.cl-ask{left:144px;width:1632px;margin-left:0;border-radius:14px}` and `.cl-step b{font-size:22px}`.
5. **LOW, 17.0 chain timing:** `CHAIN_DUR` 5.2 becomes 3.6 (storyboard says about 4 s). Keep `CHAIN_DELAY` at 1.3. Reshoot with `--wait 5500`. If the fully lit field muddies the words, raise the stop-0 calm to .85.

### 07 link
1. **HIGH, 07.2–07.3: the organisation-level benefits are coloured purple, which means "gap" everywhere else.**
   - **JS:** `lk-num purple` becomes `lk-num teal`. Beam fill stops: `#25C7BC .6 → .5 #25C7BC .24 → 1 #8FC2DC .14`. `lkBeamLine` runs `#25C7BC → #8FC2DC`. `lkGlint` end stop is `#25C7BC .3`.
   - **CSS:**
     - `.lk-org{border-color:rgba(37,199,188,.28);background:linear-gradient(160deg,rgba(37,199,188,.10),rgba(255,255,255,.03))}`
     - `.lk-org .lk-list li::before{background:var(--teal)}`
     - `.lk-port{border:2px solid rgba(37,199,188,.75);color:var(--white);box-shadow:0 0 30px rgba(37,199,188,.3)}`
2. **MED, 07.0–07.1: the ripple squircles cut into the SHARED STORY box and the 01 card.** In `lkRip`, the end state becomes `scale(.45)`. Set the ring border to `2px rgba(37,199,188,.6)` and the glow to `0 0 20px`.
3. **LOW:**
   - Node crammed 24px from the card: `NODE.x=700`, `PRISM.x=890`, card width `NODE.x-NODE.r-48-144`.
   - 02B icon: use `Deck.icon('handshake')` and `.lk-port-ic{font-size:44px}`.

### 05 survey
1. **HIGH, 05.5: the "What else we heard" chips are 17px, below the 20px floor.**
   - `#s-survey .sv-chips .chip{font-size:22px;letter-spacing:.1em;height:52px;padding:0 22px}`
   - `.sv-chips{display:grid;grid-template-columns:repeat(2,max-content);gap:14px 16px}`
2. **MED, 05.5 composition:** a dead grey waffle sits on top, and the conclusion is pushed down to about y 945.
   - `#s-survey.st-5 .sv-waffle{opacity:0;transition:opacity .6s var(--ease-soft)}`
   - `.sv-else{top:230px}`
   - `.sv-punch{top:520px;font-size:64px;width:832px}`
   - For ambient motion, set `field[5]={dim:.32,travel:.25}`.
3. **MED, 05.5: summary labels are 19px.** Use `.sv-sum-i span{font-size:22px;letter-spacing:.14em}` and `.sv-sum{grid-template-columns:repeat(2,350px)}`.
4. **MED, colour roles for 8% (resolves a conflict: the 13 squares stay sea green as the storyboard's hero, and the numeral takes the gap colour so 05, 06 and 14 agree).**
   - `.sv-big.hero,.sv-lab.hero,.sv-sum-i b.hero{color:var(--purple-lt);text-shadow:0 0 60px rgba(201,166,211,.3)}`
   - `.sv-punch em.hl{color:var(--purple-lt)}`, because "The visibility channel does not." is the gap clause.
5. **MED, 05.1–05.4: the shimmer turns the fills cyan or magenta** and erases the sea-green hero.
   - `@keyframes svShimmer{0%,100%{opacity:.82}50%{opacity:1}}`, with no brightness filter.
6. **MED, 05.0, 05.2 and 05.5 are frozen (0.1–0.2% motion).**
   - `svWave`: 6s duration, keyframes `0%,100%{0} 20%{1} 45%{0}`, overlay `rgba(255,255,255,.22)`, delay `calc(var(--c)*.33s + var(--r)*.05s - 6s)`.
   - At stop 2 only: `.sv-waffle.tone-hero i.lit{animation:svHeroGlow 3.2s ease-in-out infinite}`, pulsing box-shadow between 14px and 30px `rgba(3,255,203,.8)`.
7. **LOW:**
   - 05.2 legend key: `#s-survey[data-step="2"] .sv-key i:not(.k-lit){background:transparent;border:1px solid rgba(201,166,211,.5)}`.
   - Headline orphan "Employee": use `Employee feedback<br>validates the opportunity.` with `.sv-h{font-size:72px}` and `.sv-left{width:790px}`.
   - Optional: regrid to 16×10 (`COLS=16,ROWS=10`, waffle `top:214px;height:520px`, legend `top:770px`) to fill the empty lower right at stops 0–4.

### 04 gap
1. **MED, 04.4: the headline outranks the payoff, and two grey lines repeat each other.**
   - Add `data-dim="4"` to `.gp-h`, plus `#s-gap .gp-h.is-dim{opacity:.4 !important;filter:none}`.
   - `.gp-lead` changes from `data-dim="4"` to `data-out="4"`.
   - `.gp-close{top:330px}`.
2. **MED, 04.3: the parked frame shows intact bridges**, the opposite of "learning does not travel".
   - `#gpBridgeInk` stops: `.46` teal .9 → `.5` purple .5 → `.62` purple 0 → `1` purple 0.
   - `#s-gap.st-3 .gp-x{opacity:.7}`, keeping the gpFail pulse on top.
   - Hide `.gp-gate.far` at stop 3 and after.
3. **LOW:**
   - `.gp-map.is-dim{transform:scale(.97);transform-origin:50% 88%}`, with no translateY, so it clears the chrome and the margin.
   - District tops aligned: `y:656,h:282` for all three.

### 02 question
1. **MED, 02.1–02.3: Nouf's face appears with no tag.** Add `tag:'illustrative', tagFrom:1`. Move the "this is an illustrative story" sentence in the notes from 03.0 to 02.1.
2. **MED, 02.1–02.2: the white mark sits on a bright window.** Prepend `radial-gradient(300px 220px at 93% 7%, rgba(20,8,18,.62), transparent 72%),` to `.qs-veil`.
3. **MED, 02.1: a 500px dead gap separates the question from the lead.** Use `#s-question .qs-lead{top:350px;bottom:auto}`.
4. **MED, 02.3: the photo competes with the teal line** that should be the only bright element. Set `.qs-dim` background to `rgba(20,8,18,.62)` and add `#s-question.st-3 .qs-photo{filter:saturate(.6) brightness(.8);transition:filter 1.2s}`.
5. **LOW:**
   - `.qs-l1`: break the copy as `Every day, these moments happen.<br>Most stay visible…` and drop `text-wrap:balance`.
   - `#s-question.st-3 .qs-row.keep .qs-word{opacity:.8}`.

### 08 alignment
1. **MED, 08.1–08.2: the sliding highlight gets parked mid-slide between INNOVATION and IMPACT.**
   - Hide `.al-hi`. Toggle `.on` on the chip itself: `.al-chip.on{background:rgba(37,199,188,.24);border-color:var(--teal);box-shadow:0 0 26px rgba(37,199,188,.45);color:var(--white)}`, with 1.2s transitions.
   - `CYCLE=4000`.
   - `#s-alignment.st-2 .al-p > .al-chips{opacity:.3}`.
2. **MED, 08.1: the tagline splits as "Urban / Intelligence".** Add `#s-alignment .al-p-s em.hl{white-space:nowrap}`.
3. **LOW:**
   - Chips: `.al-chip{font-size:22px;color:rgba(255,255,255,.82)}`.
   - Pillar 2 body: `text-wrap:balance`.
   - `#s-alignment.st-1 .al-h{opacity:.62;transition:opacity .8s}`.
   - Pillar numerals match the deck: `.al-n{font:700 22px/1 var(--font);letter-spacing:.18em;color:var(--teal)}`, rendered as 01/02/03.
   - 08.2: `.al-p-s{opacity:0}`, and `.al-p-head,.al-p-t` at `.3`.

### 09 cycle
1. **MED, 09.2: the field burst lights squares behind every text block and in the chrome.** Delete the `Field.burst` call at line 155, or use radius 250 and dur 1.4. Set `field[2].lit` to `.04`.
2. **LOW:**
   - 09.1 text lands at about 2.2 s: `SWEEP=[.15,.3,.45,.6]`, `.cy-rdraw` stroke-dashoffset `.7s linear .1s`, and `--dur:.6s` on `.cy-blk`.
   - 09.0 return loop: `.cy-ret{stroke:rgba(37,199,188,.8);stroke-width:3;stroke-dasharray:8 10}`, and `.cy-chev-r` at full teal.

### 10 journey
1. **MED, 10.3: the tile breaks as "Traffic Ops ·" / "Shift B".** Line 42: `t.replace(' · ', '<br>')`.
2. **LOW:**
   - **Hero edges drift by up to 190px between stops.** Right-align every hero to 1776: `.jn-cur{left:820px}`, `.jn-post{left:736px}`, `.jn-cert{left:876px}` with `CERT_OUT=[1326,426]`, `TILE.x=584`, `.jn-tl{left:584px}`, `PILL.x=584`, `.jn-big{left:584px}`.
   - **10.4 "cur" resets to 01 Capture.** Use `cur=-1` at k===4 and mark all four items and nodes done.
   - **Too many ambient motions.** Remove `jnBob` from `.jn-form,.jn-cur,.jn-post,.jn-cert,.jn-faisal`. At stop 3, drop `amb-flow-slow` from the `.jn-links` paths.
   - **Future list items are too faint.** `.jn-li{color:rgba(255,255,255,.58)}` and `.jn-li.cur b{color:var(--teal)}`.
   - **Connectors disappear on a projector.** `.jn-links path{stroke:rgba(37,199,188,.7);stroke-width:3}`.
   - **10.4 lit cloud swallows the new light.** `field[4].lit=.03`, burst radius 300 and dur 1.6, calm `[540,460,1760,740,.9]`.

### 11 format
1. **MED, 11.0: Nouf's story card shows with no tag.** Delete `tagFrom: 1` (line 42).
2. **MED, 11.2: the design-decision captions are 24px, below the 30px sentence minimum.** Use `.fm-cap{margin:6px 0 0 232px;font:400 28px/1.3 var(--font);color:var(--ink-1)}` and `.fm-cap::before{content:'→ ';color:var(--teal)}`.
3. **LOW:**
   - **11.1 is frozen at 0.2%, with the walking light parked by an empty band.** End `fmWalk` at `translateY(617px)` and `fmBand` at `592px`, and cut the dead time to under 1 s.
   - **Card title leaves "in" at the end of line 1.** `.fm-bk-t{text-wrap:balance}`.
   - **11.2 IMPACT row has no caption.** Dim it so the gap reads as intended: `#s-format.st-2 .fm-row:nth-child(3){opacity:.55}`.
   - **Card labels are 20px.** Set `.fm-bk-lab,.fm-bk-div,.fm-chip` to 22px.

### 12 rhythm
1. **MED, 12.1–12.2: nodes read "02 / MONTH 1".** Remove the numerals from the month nodes and render them as plain 32px markers. Also remove "01" from the lane node, or replace it with the person-message icon. The stage names carry the link back to 09.
2. **LOW:** drops at stop 0 become full-size, `.rh-drop .light{width:22px;height:22px;left:-11px;top:-11px}`, on a 3px track.

### 13 recognition
1. **MED, 13.1–13.4: the light collides with the pen in the certificate icon.** Use `#s-recognition.st-1 .rc-lt{left:37%;top:36%}` so the light becomes the seal.
2. **MED, 13.2–13.4: the cells are about 1.5:1 contrast and vanish on a projector.**
   - `.rc-cell{border:1.5px solid rgba(255,255,255,.26);background:rgba(255,255,255,.06)}`
   - `#s-recognition.st-3 .c2{opacity:1}`
   - Optional: a 6px light at .35 in every cell at stops 2–3.
3. **LOW:**
   - Add `<div class="kicker" data-in="0" data-out="4">Recognition</div>` to the stop-0 `.rc-hd` and give `.rc-h` `margin-top:30px`, so the headline no longer jumps at stop 4.
   - `.rc-h` 68px becomes 72px, inside the guide's range.
   - `.rc-ts{max-width:750px}`.
   - `#s-recognition.st-4 .rc-t.past{opacity:.36}`.

### 14 measure
1. **MED, 14.2: the baseline numbers are smaller than the generic process line.**
   - `.ms-strip-t b{font-size:52px;line-height:1;vertical-align:-5px}` and `.ms-strip-t{top:56px}`.
   - `.ms-strip-b{font:400 28px/1.2 var(--font);color:var(--ink-3);top:124px;letter-spacing:0}` and `.ms-strip-b span{color:var(--ink-4)}`.
2. **LOW, copy drift:** "Visibility gap" becomes "visibility gap", and "the same eight questions" becomes "same eight questions".

### 15 risks
1. **MED, 15.0–15.1: the scan bar looks like a row cursor, and 15.1 is frozen (0.1%).**
   - `.rk-scan i::before{display:none}`.
   - Uniform full-width sheen `linear-gradient(180deg,transparent,rgba(37,199,188,.07),transparent)`, slowed to 16s.
   - `#s-risks.st-1 .rk-tick{animation:ambBreathe 4.8s ease-in-out infinite;animation-delay:calc(var(--i,0)*-1.2s)}`.
2. **LOW:**
   - Owners are not a strength, so make them neutral: `.rk-own span{color:var(--ink-1);border-color:var(--line-2);background:rgba(255,255,255,.05)}` and `.rk-cols .rk-c-own{color:var(--ink-3)}`.
   - `.rk-row{min-height:92px;padding:10px 0}` and `.rk-foot{top:832px}`.

### 16 ask
1. **MED, 16.1: the commitments read in the order Open, Report, Run, and the lane looks like a divider.**
   - Add `<b class="aq-n">01/02/03</b>` above each `.aq-ct`, styled `display:block;font:700 22px/1 var(--font);letter-spacing:.1em;color:var(--teal);margin-bottom:10px`.
   - `.aq-lane{left:762px;width:60px}`.
   - Add 22px ink-3 caps labels "START" and "QUARTER END" beside the 9 o'clock pin.
2. **MED, 16.2: about ten full-strength blocks compete, and the decision line is squeezed at the bottom.**
   - `#s-ask.st-2 :is(.aq-sub,.aq-c,.aq-ring,.aq-orb,.aq-pin,.aq-lane,.aq-lead){opacity:.4;transition:opacity .8s var(--ease-soft)}`.
   - `.aq-need{top:772px;padding-top:18px;border-top:1px solid var(--line-2)}`.
   - `.aq-final{font-size:50px}`.
3. **LOW:**
   - 16.0 descenders touch the video-wall bezel: `.aq-title{top:172px;font-size:144px}`, keeping the kicker at 150. Target at least 20px of clear dark above y 328.
   - Copy: "Curation time" and "Our existing" should be lower-case.
   - 16.1 is at 0.3% motion: keep the orb lap continuous rather than every 9 s.

### 06 benchmark
1. **LOW:**
   - Caveat `.bm-cav{font-size:28px}` and sources `.bm-src{font-size:24px;top:892px}` to meet the storyboard's size spec.
   - 06.2 dimmed rows turn dark plum on navy: `opacity:.6; filter:saturate(.35)` on `.bm-row.mech,.bm-grp.mech`.
   - The glint reads as a data point: `.bm-glint{width:10px;height:4px;margin:-2px 0 0 -5px;border-radius:2px;background:currentColor;opacity:.7}` in the row tone, stopping 16px short of the end dots.
   - The chart crowds the headline: `.bm-grid{top:334px;height:296px}`, GROUPS y 314/474, ROWS y 368/428/528/590.
   - 06.3 dangling dash: move the `<br>` before the dash and hang the dash with `.bm-turn{display:inline-block;text-indent:-.72em}`.

### 01 open
1. **LOW:**
   - `.op-line` timing `--d:.9s;--dur:.6s`.
   - `.op-line-t{font:400 34px/1.3;color:var(--ink-1)}`.
   - `.op-logo{left:144px}`.
   - Second amb-ring delay `-0.8s`, so a parked frame never shows a crisp square outline.

## 2. Global, engine and CSS changes
1. **MED, progress chrome.** Act labels collide ("03 WHY IT MATTERS04 THE CYCLE"), are 14px when the engine's own tech check requires 20px, and the bar jumps between scenes.
   - **`js/engine.js` `buildChrome`:** `s.innerHTML='<em>'+num+'</em><span class="nm"> '+name+'</span>'`.
   - **`updateChrome`:** `const tw = 6*9 + 5*8 + 28;` (a constant 122px, used whenever progress shows).
   - **`css/deck.css`:**
     - `#chrome .pips{width:94px;justify-content:flex-end}`
     - `#chrome .acts>span{font:700 20px/1 var(--font);letter-spacing:.14em;color:rgba(255,255,255,.4)}`
     - `#chrome .acts>span .nm{display:none}` and `#chrome .acts>span.on .nm{display:inline}`
     - `#chrome .acts>span, #chrome .track>b{min-width:270px}` (must be set on both so the tracks and labels stay aligned).
2. **MED, running time.** The notes total 2,509 words, about 17.9 min at 140 wpm, against a 15-minute budget. Trim them to about 2,050 words without changing the scene structure. Largest cuts: 10 (251 → about 150), 06 (183 → 120), 04 (181 → 120), 03 (178 → 130), 09 (172 → 110), 14 (172 → 110), 07 (166 → 110). Keep the storyboard's skippables (02.2, 11.1, 13.2, 15.1) flagged in the cues.
3. **LOW, team to confirm (notes only).** Three different 49% figures appear (05 practical learning, 05 story approval, 06 choice in recognition). Add one sentence to the 06.1 note saying which survey item "Choice in recognition" comes from, and do not change any on-screen figures.
4. Two more items are rolled into the scene fixes above: the text-landing timing rule (01.1, 03.3, 09.1) and the frozen-stop motion fixes (05.0, 05.2, 05.5, 11.1, 15.1, 16.1).

## 3. Rejected findings
- **Folding 12 into 16, cutting 11 to one stop, skipping 13.2 by default, merging 05.3 with 05.4, dropping the 06 Connection row:** these change the approved storyboard structure and data. Timing is handled by trimming the notes and using the existing skippables.
- **Adding a "Today's ask" strip at 09.2 and 14.0:** it clutters frames that are already dense. The ask is already at 04.4, 16 and 17.2, as the storyboard intends.
- **Decision-rule thresholds, curation hours and a start quarter at 16.2:** these would be invented content. Raise them with the team, but they are not a design fix.
- **06 row captions such as "Q5 · want a say…":** these invent a mapping to survey items. It is handled with a notes-only line confirmed by the team (global item 3).
- **Rolling the 03.2 clock to 07:00:** this invents a time. Dimming the clock at stops 1–2 already removes the clash.
- **Rotating the 09 and 10 ring so 01 sits top-left:** the sweep lands the stages 01→04 in order, and clockwise-from-12 is the normal clock reading. The change would ripple into the 10 rail, orbit and SPLIT paths for little gain.
- **Removing the 10.2 post body line:** it matches 03's story ("one clean page", "day shift"), has no numbers, and makes the post read as a real post.
- **Adding a named leader to the 10.3 card:** that would be an invented attribution. The storyboard asks only for "a leader's acknowledgement and a certificate".
- **07.0–07.1 ghost beams ending in mid-air:** these are deliberate faint previews of the stop-2 beams.
- **08.0 empty lower left:** it is a deliberate single-statement frame, and the photo carries the right half.
- **08.1 pillar 3 over the city lights:** it is legible in the capture and the veil already covers it.
- **Deck-wide 72px headline normalisation:** 70–76px is inside the guide's range. Only 13's 68px is fixed.
- **Standardising sub-headlines at 30/32/36px:** all are within the allowed tokens.
- **Card-radius drift, section-label colour unification, and moving the kicker by 7px in 03 and 16:** none of these is visible from the room. Moving 16's kicker would also conflict with the fix for its descender clearance.
- **Visual monotony across 09–15, and adding photos to 14 and 15:** this is subjective. Each scene already has its own layout shape, as the storyboard requires.
- **13 "empty app launcher":** already covered by the cell-contrast fix and the optional per-cell lights.