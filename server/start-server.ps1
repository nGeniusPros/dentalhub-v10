# DentalHub Twilio Server Startup Script
# This script starts the DentalHub Twilio integration server

# Set the working directory to the script's location
Set-Location -Path $PSScriptRoot

# Load environment variables if needed (optional as the server now handles this)
if (Test-Path -Path ".env") {
    Write-Host "Environment file exists at $PSScriptRoot\.env"
} else {
    Write-Host "WARNING: Environment file not found at $PSScriptRoot\.env"
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
}

# Start the server
Write-Host "Starting DentalHub Twilio Server..."
npm start

# Note: For running as a Windows service, you would typically use:
# node src/index.js
# Instead of npm start to avoid shell-related issues