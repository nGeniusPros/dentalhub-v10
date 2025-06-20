# DentalHub Netlify Deployment Checklist

## Completed Tasks

- [x] Updated API references to use relative paths instead of hardcoded localhost URLs
- [x] Fixed duplicate imports in API utility files
- [x] Created cleanup script (`scripts/prepare-for-netlify.js`) to remove unnecessary files
- [x] Added new deployment-related scripts to package.json
- [x] Created Netlify Functions verification script (`scripts/verify-netlify-functions.js`)
- [x] Created comprehensive testing plan (`NETLIFY-TESTING-PLAN.md`)
- [x] Created detailed deployment guide (`NETLIFY-DEPLOYMENT-GUIDE.md`)

## Remaining Tasks

- [ ] Run the cleanup script: `npm run prepare:netlify`
- [ ] Verify Netlify Functions: `npm run verify:functions`
- [ ] Test all functions locally with Netlify CLI: `netlify dev`
- [ ] Set up environment variables in Netlify UI
- [ ] Deploy to preview environment: `npm run deploy:preview`
- [ ] Test all functionality in preview environment
- [ ] Deploy to production: `npm run deploy:prod`
- [ ] Verify production deployment

## Files to Remove

The following files/directories will be removed by the cleanup script:

- `server/` directory (all contents)
- `Dockerfile`
- `.dockerignore`
- `proxy-server.js`
- Server startup scripts

## Deployment Commands

```bash
# Step 1: Clean up the codebase
npm run prepare:netlify

# Step 2: Verify Netlify Functions
npm run verify:functions

# Step 3: Build the application
npm run build

# Step 4: Test locally
netlify dev

# Step 5: Deploy preview
npm run deploy:preview

# Step 6: Deploy to production
npm run deploy:prod
```

## Post-Deployment Verification

After deployment, verify:

1. All Netlify Functions are working correctly
2. Frontend can successfully call all required functions
3. Authentication flow works properly
4. No console errors related to API calls or CORS
5. All features are functioning as expected

## Rollback Plan

If issues are detected after deployment:

1. In the Netlify dashboard, go to the Deploys tab
2. Find the last working deployment
3. Click "Publish deploy" on that version
4. Fix issues locally and redeploy when ready
