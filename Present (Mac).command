#!/bin/sh
# Opens the single-file deck in Chrome (or the default browser). In the deck press F for full screen, S for the speaker view.
cd "$(dirname "$0")"
open -a "Google Chrome" "dist/Behind-a-Better-Life.html" 2>/dev/null || open "dist/Behind-a-Better-Life.html"
