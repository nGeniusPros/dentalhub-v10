# DentalHub Complete Startup Script
# This script starts both the Twilio server and the frontend, and opens a browser

# Set the working directory to the server directory
Set-Location -Path $PSScriptRoot

# Start the server in a new PowerShell window
Write-Host "Starting DentalHub Twilio Server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Set-Location '$PSScriptRoot'; npm run dev}"

# Wait for the server to start
Write-Host "Waiting for server to start..."
Start-Sleep -Seconds 5

# Get the parent directory (project root)
$projectRoot = Split-Path -Parent $PSScriptRoot

# Set location to the project root
Set-Location -Path $projectRoot

# Start the frontend in a new PowerShell window and open browser
Write-Host "Starting DentalHub Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Set-Location '$projectRoot'; npm run dev}"

# Wait a moment and open browser
Start-Sleep -Seconds 10
Write-Host "Opening browser..."
Start-Process "http://localhost:5173"

Write-Host "DentalHub started successfully!"
Write-Host "- Frontend: http://localhost:5173"
Write-Host "- Backend: http://localhost:3001"
Write-Host "- Twilio Test: http://localhost:3001/api/twilio/test"