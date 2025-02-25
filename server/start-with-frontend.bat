@echo off
:: DentalHub Complete Startup Script
:: This script starts both the Twilio server and the frontend, and opens a browser

:: Set the working directory to the script's location
cd /d %~dp0

:: Start the server in a new command window
echo Starting DentalHub Twilio Server...
start "DentalHub Twilio Server" cmd /k "npm run dev"

:: Wait for the server to start
echo Waiting for server to start...
timeout /t 5 /nobreak > nul

:: Get the parent directory (project root)
for %%i in ("%~dp0..") do set "projectRoot=%%~fi"

:: Navigate to the project root for the frontend
cd /d %projectRoot%

:: Start the frontend in a new command window
echo Starting DentalHub Frontend...
start "DentalHub Frontend" cmd /k "npm run dev"

:: Wait a moment and open browser
timeout /t 10 /nobreak > nul
echo Opening browser...
start "" "http://localhost:5173"

echo DentalHub started successfully!
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:3001
echo - Twilio Test: http://localhost:3001/api/twilio/test

:: Return to the original directory
cd /d %~dp0