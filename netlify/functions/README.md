# Netlify Functions for DentalHub

This directory contains serverless functions that power the backend of DentalHub when deployed on Netlify.

## Function Categories

- **auth/**: Authentication-related functions
- **patients/**: Patient management endpoints
- **twilio/**: SMS messaging functionality
- **email/**: Email sending capabilities
- **ai/**: AI-related features and feedback
- **utils/**: Shared utility functions

## Local Development

To test these functions locally:

1. Install Netlify CLI:
```
npm install -g netlify-cli
```

2. Create a `.env` file in the root directory based on `.env.example`

3. Start the local development server:
```
netlify dev
```

This will run both your frontend application and the Netlify Functions locally.

## Accessing Functions

When running locally:
- Functions are available at: `http://localhost:8888/.netlify/functions/function-name`
- With API redirects: `http://localhost:8888/api/function-name`

In production:
- Functions are available at: `https://your-site.netlify.app/.netlify/functions/function-name`
- With API redirects: `https://your-site.netlify.app/api/function-name`

## Development Notes

- Each function should handle CORS properly using the provided utility functions
- Always use environment variables for sensitive information
- Include proper error handling in all functions