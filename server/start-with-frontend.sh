#!/bin/bash
# DentalHub Complete Startup Script
# This script starts both the Twilio server and the frontend, and opens a browser

# Set the working directory to the script's location
cd "$(dirname "$0")"

# Start the server in a new terminal window
echo "Starting DentalHub Twilio Server..."
(gnome-terminal -e "bash -c 'npm run dev; exec bash'" || 
 xterm -e "bash -c 'npm run dev; exec bash'" || 
 terminal -e "bash -c 'npm run dev; exec bash'" || 
 x-terminal-emulator -e "bash -c 'npm run dev; exec bash'" || 
 echo "Could not open terminal window for server, running in background" && 
 npm run dev &) &

# Wait for the server to start
echo "Waiting for server to start..."
sleep 5

# Get the parent directory (project root)
projectRoot="$(cd .. && pwd)"

# Navigate to the project root for the frontend
cd "$projectRoot"

# Start the frontend in a new terminal window
echo "Starting DentalHub Frontend..."
(gnome-terminal -e "bash -c 'npm run dev; exec bash'" || 
 xterm -e "bash -c 'npm run dev; exec bash'" || 
 terminal -e "bash -c 'npm run dev; exec bash'" || 
 x-terminal-emulator -e "bash -c 'npm run dev; exec bash'" || 
 echo "Could not open terminal window for frontend, running in background" && 
 npm run dev &) &

# Wait a moment and open browser
sleep 10
echo "Opening browser..."
(xdg-open http://localhost:5173 || 
 open http://localhost:5173 || 
 sensible-browser http://localhost:5173 || 
 python -m webbrowser -t "http://localhost:5173" ||
 echo "Could not open browser, please navigate to http://localhost:5173 manually")

echo "DentalHub started successfully!"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:3001"
echo "- Twilio Test: http://localhost:3001/api/twilio/test"

# Return to the original directory
cd "$(dirname "$0")"