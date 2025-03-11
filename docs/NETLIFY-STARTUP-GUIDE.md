# DentalHub Netlify Deployment Startup Guide

This guide provides a step-by-step process to deploy your DentalHub application to Netlify and ensure it works correctly.

## Prerequisites

- GitHub repository with your DentalHub code
- Netlify account
- Supabase project set up
- Necessary third-party service accounts (Twilio, email provider, etc.)

## Step 1: Prepare Your Repository

1. Ensure the `netlify.toml` file is correctly configured:
   - Check that the build command and publish directory are correct
   - Verify API redirects are properly set up
   - Confirm functions configuration

2. Install the Netlify CLI and login:
```bash
npm install -g netlify-cli
netlify login
```

## Step 2: Set Up Local Development With Functions

1. Initialize Netlify in your project:
```bash
netlify init
```

2. Create Netlify Functions locally:
```bash
# Make sure the functions directory exists
mkdir -p netlify/functions
```

3. Test functions locally:
```bash
netlify dev
```

## Step 3: Configure Environment Variables

1. Create a `.env` file locally based on the example:
```bash
cp netlify/.env.example .env
```

2. Fill in your environment variables with actual values

3. Set up environment variables in Netlify:
```bash
netlify env:import .env
```

Or set them manually in the Netlify dashboard:
- Site settings > Environment variables

## Step 4: Update Frontend Code

1. Update your components to use the API utility:
   - Follow the instructions in `docs/NETLIFY-INTEGRATION-GUIDE.md`
   - Test locally to ensure everything works

2. Example usage:
```typescript
import { api } from '../utils/api';

// Get data
const data = await api.get('patients');

// Post data
const result = await api.post('auth/session', {
  action: 'SIGNIN',
  email: 'user@example.com',
  password: 'password'
});
```

## Step 5: Deploy to Netlify

1. Commit and push your changes:
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push
```

2. Deploy from the command line:
```bash
netlify deploy --prod
```

Or configure continuous deployment in the Netlify dashboard:
- Connect to your GitHub repository
- Configure build settings
- Deploy site

## Step 6: Verify Deployment

1. Test the basic API endpoint:
   - Visit `https://your-site.netlify.app/api/hello-world`
   - You should receive a JSON response

2. Test all major functionality:
   - Authentication
   - Patient management
   - Other key features

3. Check function logs if issues occur:
   - Netlify dashboard > Functions > View logs

## Step 7: Optimize and Monitor

1. Enable function bundling for better performance:
```toml
[functions]
  node_bundler = "esbuild"
```

2. Set up monitoring:
   - Netlify Analytics
   - Add error tracking to your frontend

3. Consider performance improvements:
   - Cache static assets
   - Optimize database queries
   - Use edge functions for global distribution

## Troubleshooting

If you encounter issues, refer to:
- `NETLIFY-DEBUGGING.md` for common issues and solutions
- Netlify support forums
- Netlify documentation on Functions

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Supabase Documentation](https://supabase.io/docs)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)