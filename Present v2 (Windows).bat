@echo off
rem Opens the condensed v2 deck (12 scenes, about 15 minutes) in Chrome (or Edge). In the deck press F for full screen, S for the speaker view.
set "DECK=%~dp0dist\Behind-a-Better-Life-v2.html"
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --new-window --start-fullscreen "%DECK%"
  exit /b
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --new-window --start-fullscreen "%DECK%"
  exit /b
)
start "" msedge --new-window --start-fullscreen "%DECK%"
