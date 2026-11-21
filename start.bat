@echo off
title BreatheSafe & AeroShield AI Launcher
echo ========================================================
echo   BreatheSafe (AeroShield AI)
echo   Winter Smog & Community Resilience Assistant
echo ========================================================
echo.
echo Stopping any previous instance on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul
echo Starting fresh REST API server...
start http://localhost:3000/api/status
start http://localhost:3000
node serve.js
pause
