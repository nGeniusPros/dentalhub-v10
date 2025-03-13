# DentalHub Netlify Deployment Guide

This guide explains how to deploy your DentalHub application to Netlify and ensure it functions correctly in the production environment.

## Overview

When deploying a Supabase-based application to Netlify, you may encounter issues where the application works locally but not on Netlify. This typically happens because:

1. The frontend code makes direct API calls to Supabase
2. These calls work in development but fail in production due to CORS or authentication issues
3. Client-side code has limited permissions compared to server-side code

Our solution addresses these issues by:

1. Creating a smart API utility that automatically routes requests appropriately:
   - Direct Supabase calls in development
   - Netlify Functions in production
2. Implementing serverless functions for all backend operations
3. Properly configuring Netlify to handle API requests

## Prerequisites

- A DentalHub project with Supabase integration
- A Netlify account
- Node.js and npm installed locally

## Setup Instructions

### 1. Environment Variables

Add the following environment variables in your Netlify dashboard (Site settings > Environment variables):

```
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Firebase Configuration (if using)
FIREBASE_API_KEY=your-api-key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com

# Additional Service Keys (if using)
DEEPSEEK_API_KEY=your-deepseek-api-key
AYRSHARE_API_KEY=your-ayrshare-api-key
RETELL_API_KEY=your-retell-api-key
RETELL_WEBHOOK_SECRET=your-webhook-secret
BEEHIIV_API_KEY=your-beehiiv-api-key
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-phone-number
```

Note: You already have the `VITE_` prefixed versions of environment variables for client-side usage. The variables above are for server-side (Netlify Functions) usage.

### 2. Project Structure

Ensure your project has the following structure:

```
project-root/
├── netlify/
│   ├── functions/           # Serverless functions
│   │   ├── utils/           # Shared utilities for functions
│   │   ├── ai/              # AI-related functions
│   │   ├── social/          # Social media functions
│   │   ├── newsletter/      # Newsletter functions
│   │   ├── retell/          # Retell call center functions
│   │   ├── notifications/   # Push notification functions
│   │   └── hello-world.js   # Test function
├── src/
│   ├── utils/
│   │   ├── api.ts           # Smart API utility
│   │   └── ai.ts            # AI utility
│   └── examples/            # Example components
└── netlify.toml             # Netlify configuration
```

### 3. Netlify Configuration

Your `netlify.toml` file should include:

```toml
[build]
  command = "npm run build"
  publish = "dist"

# Functions configuration
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
  timeout = 30
  included_files = ["netlify/functions/**/*.js"]

# API redirects to Netlify Functions
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# Redirect all URLs to index.html for SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Updating Your Code

### Using the API Utility

Replace direct Supabase calls with our API utility:

```typescript
// BEFORE: Direct Supabase call
const { data, error } = await supabase
  .from('patients')
  .select('*')
  .order('created_at', { ascending: false });

// AFTER: Using the API utility
import { api } from '../utils/api';

const data = await api.get('patients');
```

The API utility automatically:
- Uses direct Supabase calls during local development
- Routes through Netlify Functions when deployed
- Handles errors consistently

### Core API Methods

```typescript
// GET request (retrieving data)
const patients = await api.get('patients');
const patient = await api.get(`patients/${id}`);

// POST request (creating data)
const newPatient = await api.post('patients', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request (updating data)
const updatedPatient = await api.put('patients', {
  id: 123,
  name: 'John Updated'
});

// DELETE request (removing data)
const result = await api.delete('patients', 123);
```

### Access to External Services

The API utility also routes to specialized Netlify Functions for external services:

```typescript
// AI completion
import { ai } from '../utils/ai';
const diagnosis = await ai.getDentalDiagnosis(symptoms);

// Social media posting
const postResult = await api.post('social/post', {
  post: 'Check out our new dental services!',
  platforms: ['twitter', 'facebook']
});

// Newsletter subscription
const subscriber = await api.post('newsletter/subscriber', {
  email: 'patient@example.com',
  publicationId: 'pub_123'
});
```

## Deployment Steps

1. Ensure all required files are in place:
   - `netlify.toml`
   - `netlify/functions/` directory with all function files
   - `src/utils/api.ts` and other utilities

2. Push your changes to your Git repository

3. Deploy to Netlify:
   - Connect your repository to Netlify
   - Configure build settings (`npm run build`)
   - Set environment variables
   - Deploy

4. Test the deployment:
   - Check `/api/hello-world` endpoint
   - Verify core application functionality

## Troubleshooting

### Common Issues

1. **API calls failing**: Check network tab for errors
   - 401 Unauthorized: Check if service keys are properly set in environment variables
   - 404 Not Found: Check that functions are being properly deployed
   - CORS errors: Check Netlify Functions are properly configured

2. **Functions not loading**: Check Netlify's Functions tab
   - Check function logs for errors
   - Verify function permissions

3. **Authentication issues**:
   - Ensure JWT secret is properly set
   - Verify authentication flow works with the API utility

### Debugging Techniques

1. Check Netlify Function logs in the Netlify dashboard
2. Use `/api/hello-world` to verify configuration
3. Inspect network requests in browser developer tools
4. Add console logs to track API utility behavior

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Supabase Documentation](https://supabase.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

## Support

If you encounter issues not covered in this guide, refer to:
- NETLIFY-DEBUGGING.md for detailed troubleshooting steps
- NETLIFY-DEPLOYMENT-SUMMARY.md for a complete overview of all changes