@echo off
rem Opens the single-file deck in Chrome (or Edge). In the deck press F for full screen, S for the speaker view.
set "DECK=%~dp0dist\Behind-a-Better-Life.html"
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --new-window --start-fullscreen "%DECK%"
  exit /b
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --new-window --start-fullscreen "%DECK%"
  exit /b
)
start "" msedge --new-window --start-fullscreen "%DECK%"
