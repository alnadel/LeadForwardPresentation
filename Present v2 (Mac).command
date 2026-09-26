#!/bin/sh
# Opens the condensed v2 deck (11 scenes, about 15 minutes) in Chrome (or the default browser). In the deck press F for full screen, S for the speaker view.
cd "$(dirname "$0")"
open -a "Google Chrome" "dist/Behind-a-Better-Life-v2.html" 2>/dev/null || open "dist/Behind-a-Better-Life-v2.html"
