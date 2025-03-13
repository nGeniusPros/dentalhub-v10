#!/bin/bash

echo "==================================="
echo "DentalHub Testing Scripts Setup"
echo "==================================="

echo "Installing dependencies..."
npm install

echo ""
echo "Setting file permissions..."
chmod +x test-button-functionality.js
chmod +x test-db-connection.js
chmod +x test-production-paths.js

echo ""
echo "Setting up environment..."
if [ ! -f ../.env ]; then
  echo "Creating sample .env file..."
  cat > ../.env << EOL
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOL
  echo ""
  echo "Created .env file. Please edit it with your actual Supabase credentials."
else
  echo ".env file already exists"
fi

echo ""
echo "Setup complete!"
echo "To run tests, use:"
echo "  npm run test-buttons  - Test button functionality"
echo "  npm run test-db       - Test database connection"
echo "  npm run test-paths    - Test critical paths"
echo ""