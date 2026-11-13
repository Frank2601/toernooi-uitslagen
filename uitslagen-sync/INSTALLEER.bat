@echo off
title Uitslagen-sync installeren
cd /d "%~dp0"
echo.
echo  Uitslagen-sync installeren (eenmalig, duurt een paar minuten)...
echo.
if not exist node\node.exe (
  echo  Node.js downloaden...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; Invoke-WebRequest 'https://nodejs.org/dist/v24.21.0/node-v24.21.0-win-x64.zip' -OutFile node.zip; Expand-Archive node.zip -DestinationPath . -Force; Rename-Item 'node-v24.21.0-win-x64' 'node'; Remove-Item node.zip"
)
if not exist node\node.exe (
  echo  Downloaden van Node.js is mislukt. Controleer de internetverbinding en probeer opnieuw.
  pause >nul
  exit /b 1
)
echo  Onderdelen installeren...
call node\npm.cmd install --no-audit --no-fund --loglevel=error --update-notifier=false
if not exist instellingen.json copy instellingen.voorbeeld.json instellingen.json >nul
echo.
echo  Klaar! Vul instellingen.json in (zie LEESMIJ.txt) en start daarna START.bat.
echo  Druk op een toets om dit venster te sluiten.
pause >nul
