@echo off
:: DentalHub Twilio Server Startup Script
:: This batch file starts the DentalHub Twilio integration server

:: Set the working directory to the script's location
cd /d %~dp0

:: Check if .env exists
if exist .env (
  echo Environment file exists at %~dp0.env
) else (
  echo WARNING: Environment file not found at %~dp0.env
)

:: Start the server using Node directly (better for services)
echo Starting DentalHub Twilio Server...
node src/index.js

:: The server will continue running until manually stopped