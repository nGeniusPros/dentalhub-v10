@echo off
echo ===================================
echo DentalHub Testing Scripts Setup
echo ===================================

echo Installing dependencies...
npm install

echo.
echo Setting file permissions...
REM In Windows, .js files don't need special permissions
REM but we'll ensure they are properly recognized as executable

echo.
echo Setting up environment...
if not exist ..\.env (
  echo Creating sample .env file...
  echo # Supabase Configuration > ..\.env
  echo VITE_SUPABASE_URL=your_supabase_url >> ..\.env
  echo VITE_SUPABASE_ANON_KEY=your_supabase_anon_key >> ..\.env
  echo.
  echo Created .env file. Please edit it with your actual Supabase credentials.
) else (
  echo .env file already exists
)

echo.
echo Setup complete!
echo To run tests, use:
echo   npm run test-buttons  - Test button functionality
echo   npm run test-db       - Test database connection
echo   npm run test-paths    - Test critical paths
echo.