# DentalHub Netlify Deployment Guide

This guide provides step-by-step instructions for deploying the DentalHub application to Netlify.

## Prerequisites

- Netlify account with appropriate permissions
- Node.js v18+ installed
- Netlify CLI installed: `npm install -g netlify-cli`
- Git repository access

## Pre-Deployment Cleanup

1. Run the cleanup script to remove unnecessary files:

```bash
npm run prepare:netlify
```

This script removes:
- Server directory and related files
- Docker configuration files
- Proxy server files
- Server startup scripts

2. Verify API references are using relative paths:
   - All API calls should use `/api` instead of hardcoded localhost URLs
   - Check `src/utils/api.ts` and `src/lib/api/communicationService.ts`

## Environment Configuration

1. Create a `.env` file based on `.env.example` with all required variables:

```
# Frontend Environment Variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend Environment Variables (Netlify Functions)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Other required keys for services
...
```

2. Configure environment variables in Netlify:
   - Go to Site settings > Environment variables
   - Add all variables from your `.env` file
   - Ensure sensitive keys are marked as "sensitive"

## Local Testing

1. Build the application locally:

```bash
npm run build
```

2. Test with Netlify Dev:

```bash
netlify dev
```

3. Follow the testing plan in `NETLIFY-TESTING-PLAN.md` to verify all functions work correctly.

## Deployment Process

### Option 1: Deploy via Netlify CLI

1. Login to Netlify:

```bash
netlify login
```

2. Link your local project to a Netlify site:

```bash
netlify link
```

3. Deploy a preview version:

```bash
npm run deploy:preview
```

4. After testing the preview, deploy to production:

```bash
npm run deploy:prod
```

### Option 2: Deploy via Netlify UI

1. Push your changes to your Git repository

2. In the Netlify dashboard:
   - Create a new site from Git
   - Connect to your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Functions directory: `netlify/functions`

3. Configure environment variables in the Netlify UI

4. Trigger a deploy

## Post-Deployment Verification

1. Verify all functions are deployed correctly:
   - Check the Functions tab in the Netlify dashboard
   - Test each function endpoint

2. Verify frontend is working correctly:
   - Test authentication flow
   - Test all major features
   - Verify API calls are successful

3. Check for any errors in the Netlify logs

## Troubleshooting

### Common Issues

1. **Function Timeouts**
   - Check the timeout settings in `netlify.toml`
   - Optimize function code for better performance

2. **CORS Issues**
   - Verify the headers configuration in `netlify.toml`
   - Check browser console for specific CORS errors

3. **Environment Variables**
   - Ensure all required variables are set in Netlify UI
   - Check for typos in variable names

4. **Build Failures**
   - Review build logs for specific errors
   - Verify dependencies are correctly installed

### Getting Help

- Netlify Support: https://www.netlify.com/support/
- Netlify Functions Documentation: https://docs.netlify.com/functions/overview/
- DentalHub Documentation: See the `docs` directory

## Rollback Procedure

If issues are detected after deployment:

1. In the Netlify dashboard, go to the Deploys tab
2. Find the last working deployment
3. Click "Publish deploy" on that version
4. Fix issues locally and redeploy when ready
