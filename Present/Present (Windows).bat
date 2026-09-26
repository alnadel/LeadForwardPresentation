@echo off
rem Behind a Better Life - double-click to present.
rem Opens the deck full screen in its own clean browser window (Chrome, or Edge), fully offline.
rem Everything (fonts, photos, code) is inside Behind-a-Better-Life.html: keep the two files in the same folder.
rem In the deck: any key or click begins, S = speaker view, B = black screen, Alt+F4 = close.
setlocal
set "DECK=%~dp0Behind-a-Better-Life.html"
if not exist "%DECK%" (
  echo Behind-a-Better-Life.html was not found next to this file.
  echo If you opened this from inside a .zip, extract the whole folder first.
  pause
  exit /b 1
)
set "PROFILE=%TEMP%\behind-a-better-life-deck"
set "BROWSER="
for %%B in ("%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%LocalAppData%\Google\Chrome\Application\chrome.exe" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe") do (
  if not defined BROWSER if exist "%%~B" set "BROWSER=%%~B"
)
if not defined BROWSER (
  start "" "%DECK%"
  exit /b 0
)
start "" "%BROWSER%" --user-data-dir="%PROFILE%" --start-fullscreen --no-first-run --no-default-browser-check --disable-features=Translate --disable-session-crashed-bubble "%DECK%"
