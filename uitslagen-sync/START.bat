@echo off
title Uitslagen-sync
cd /d "%~dp0"
if not exist node\node.exe (
  echo.
  echo  De sync is nog niet geinstalleerd. Dubbelklik eerst op INSTALLEER.bat.
  pause >nul
  exit /b 1
)
if not exist instellingen.json copy instellingen.voorbeeld.json instellingen.json >nul
node\node.exe sync.mjs
echo.
echo Het programma is gestopt. Druk op een toets om dit venster te sluiten.
pause >nul
