# DentalHub Deployment Cleanup Plan

## Files/Directories to Remove or Refactor

### Remove (Not Needed for Netlify Deployment)
- `server/` directory (all contents)
- `Dockerfile`
- `.dockerignore`
- `proxy-server.js`
- `start-server.bat`, `start-server.ps1`, `start-server.sh`
- `start-with-frontend.bat`, `start-with-frontend.ps1`, `start-with-frontend.sh`

### Refactor/Update
- Update `package.json` to remove any server-specific dependencies
- Ensure all API calls in frontend code point to `/.netlify/functions/` or `/api/` paths (which redirect to functions)
- Review and update environment variables in `.env.example` to match Netlify requirements

## Netlify Functions Verification
- Ensure all backend functionality is properly implemented as Netlify Functions
- Verify that all functions have proper error handling
- Check that functions have appropriate timeouts configured in `netlify.toml`

## Environment Configuration
- Review environment variables in `.env` and ensure they're properly set in Netlify deployment settings
- Remove any server-specific environment variables not needed for Netlify Functions

## Testing Plan
1. Test all Netlify Functions locally using Netlify CLI
2. Verify frontend can successfully call all required functions
3. Test authentication flow with Supabase through Netlify Functions
4. Verify proper error handling and logging

## Deployment Steps
1. Complete the cleanup tasks above
2. Run a full build locally to verify everything compiles correctly
3. Deploy to a staging environment on Netlify
4. Run comprehensive tests on the staging environment
5. Deploy to production when all tests pass
