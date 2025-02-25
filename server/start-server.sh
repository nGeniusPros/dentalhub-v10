#!/bin/bash
# DentalHub Twilio Server Startup Script
# This script starts the DentalHub Twilio integration server

# Set the working directory to the script's location
cd "$(dirname "$0")"

# Check if .env exists
if [ -f .env ]; then
  echo "Environment file exists at $(pwd)/.env"
else
  echo "WARNING: Environment file not found at $(pwd)/.env"
fi

# Start the server using Node directly
echo "Starting DentalHub Twilio Server..."
node src/index.js

# The server will continue running until manually stopped