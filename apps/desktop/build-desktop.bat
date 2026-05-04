@echo off
set PATH=%USERPROFILE%\.cargo\bin;%PATH%
set CARGO_BUILD_JOBS=1
cd /d "%~dp0"
npm run tauri:build
