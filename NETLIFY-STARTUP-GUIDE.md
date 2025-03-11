
# DentalHub Netlify Startup Guide

This step-by-step guide walks you through deploying your DentalHub application to Netlify for the first time.

## Prerequisites

Before you begin, make sure you have:

- A GitHub, GitLab, or Bitbucket account with your DentalHub code repository
- A Netlify account (sign up at [netlify.com](https://netlify.com))
- The necessary API keys for any services you're using (Supabase, Firebase, etc.)

## Step 1: Prepare Your Repository

Ensure your repository includes all the files provided in this solution:

1. `netlify.toml` - Updated configuration file
2. `netlify/functions/` directory - Contains all serverless functions
3. `src/utils/api.ts` - Smart API utility 
4. `src/utils/ai.ts` - AI utilities (if using AI features)
5. Documentation files (README-NETLIFY.md, etc.)

## Step 2: Connect to Netlify

1. Log in to your Netlify account
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your DentalHub repository
6. Configure build settings:
   - Build command: `npm run build` (or your custom build command)
   - Publish directory: `dist` (for Vite) or `build` (for Create React App)
7. Click "Deploy site"

## Step 3: Set Up Environment Variables

After your initial deployment (which will likely fail without environment variables), set up the required environment variables:

1. Go to Site settings > Environment variables
2. Add the following variables (replace values with your actual credentials):

```
# Supabase Configuration
SUPABASE_URL=https://iilbbthuqeglxavgaobj.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Firebase Configuration (if using)
FIREBASE_API_KEY=your-api-key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_AUTH_DOMAIN=your-auth-domain

# DeepSeek AI (if using AI features)
DEEPSEEK_API_KEY=your-deepseek-api-key

# Social Media (if using)
AYRSHARE_API_KEY=your-ayrshare-api-key

# Call Center (if using)
RETELL_API_KEY=your-retell-api-key
RETELL_WEBHOOK_SECRET=your-webhook-secret
RETELL_AGENT_ID=your-agent-id

# Newsletter (if using)
BEEHIIV_API_KEY=your-beehiiv-api-key

# SMS (if using)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-phone-number
```

> **Note**: You should also have client-side environment variables prefixed with `VITE_` already in your project. These are different and are used by the frontend code.

## Step 4: Trigger a New Deployment

After setting environment variables:

1. Go to the "Deploys" tab in your Netlify dashboard
2. Click "Trigger deploy" > "Deploy site"
3. Wait for the deployment to complete

## Step 5: Verify API Connectivity

1. Once deployed, visit `https://your-site.netlify.app/api/hello-world`
2. You should see a JSON response confirming your functions are working:
   ```json
   {
     "message": "Hello from DentalHub Netlify Function!",
     "status": "online",
     "timestamp": "2025-03-11T20:05:54.123Z",
     "environment": {
       "supabase": "configured",
       "firebase": "configured",
       "node": "v18.x.x",
       "region": "netlify"
     }
   }
   ```
3. If you see this response, your Netlify Functions are correctly set up!

## Step 6: Update Your Components

Now you need to update your components to use the new API utility:

1. Follow the instructions in `NETLIFY-INTEGRATION-GUIDE.md`
2. Replace direct Supabase calls with the API utility
3. Test your site functionality

Example component update:

```typescript
// Before:
const { data, error } = await supabase.from('patients').select('*');

// After:
const data = await api.get('patients');
```

## Step 7: Deploy Updated Components

1. Push your updated components to your Git repository
2. Netlify will automatically deploy the changes
3. Test all functionality on the live site

## Step 8: Set Up Custom Domain (Optional)

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to set up your domain
4. Wait for DNS propagation (may take up to 24 hours)

## Step 9: Enable HTTPS (Optional)

HTTPS is automatically enabled for all Netlify sites, including custom domains. You don't need to do anything extra!

## Step 10: Monitor Your Site

1. Set up Netlify Analytics (optional, paid feature)
2. Monitor function invocations in the Functions tab
3. Check for errors in the Netlify logs

## Troubleshooting

If you encounter issues:

1. Check the logs in your Netlify dashboard
2. Verify all environment variables are correctly set
3. Test your API endpoints directly
4. Refer to `NETLIFY-DEBUGGING.md` for common issues and solutions

## Next Steps

- Set up continuous integration/deployment workflows
- Configure branch deploy previews
- Implement A/B testing or split testing
- Set up form handling if you're using Netlify Forms

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Supabase Documentation](https://supabase.io/docs)
- [DentalHub Netlify Debugging Guide](./NETLIFY-DEBUGGING.md)
- [DentalHub Netlify Integration Guide](./NETLIFY-INTEGRATION-GUIDE.md)