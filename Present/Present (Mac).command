#!/bin/sh
# Behind a Better Life - double-click to present.
# Opens the deck full screen in its own clean browser window (Chrome, or Edge), fully offline.
# Everything (fonts, photos, code) is inside Behind-a-Better-Life.html: keep the two files in the same folder.
# In the deck: any key or click begins, S = speaker view, B = black screen, Cmd+Q = close.
# First time only: if macOS says it cannot verify this file, right-click it and choose Open.
cd "$(dirname "$0")" || exit 1
DECK="$(pwd)/Behind-a-Better-Life.html"
if [ ! -f "$DECK" ]; then
  echo "Behind-a-Better-Life.html was not found next to this file."
  exit 1
fi
PROFILE="${TMPDIR:-/tmp}/behind-a-better-life-deck"
for APP in "Google Chrome" "Microsoft Edge" "Chromium" "Brave Browser"; do
  if open -Ra "$APP" >/dev/null 2>&1; then
    open -na "$APP" --args --user-data-dir="$PROFILE" --start-fullscreen --no-first-run --no-default-browser-check --disable-features=Translate --disable-session-crashed-bubble "$DECK"
    exit 0
  fi
done
open "$DECK"
