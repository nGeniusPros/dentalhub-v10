# DentalHub Netlify Debugging Guide

This guide helps troubleshoot common issues when deploying your DentalHub application to Netlify.

## Diagnosing Issues

Before diving into specific problems, follow these general debugging steps:

1. **Check Netlify Function Logs**:
   - Go to Netlify dashboard > Your site > Functions
   - Select the function that's failing
   - Review logs for error messages

2. **Test API Connectivity**:
   - Visit `https://your-site.netlify.app/api/hello-world`
   - This should return a JSON response with environment status
   - If this fails, your Netlify Functions aren't properly configured

3. **Check Browser Console**:
   - Open your site in a browser
   - Open Developer Tools (F12) > Console tab
   - Look for API errors or other issues

4. **Verify API Requests in Network Tab**:
   - Open Developer Tools (F12) > Network tab
   - Filter by "Fetch/XHR"
   - Try to use your app and check the requests being made
   - Look for failed requests (red) and check their response content

## Common Issues and Solutions

### 1. API Calls Returning 404 Not Found

**Symptoms**:
- Browser console shows 404 errors for API calls
- App buttons/features don't work

**Possible Causes**:
- Netlify Functions not properly deployed
- API path misconfiguration
- Incorrect redirects in netlify.toml

**Solutions**:
- Check that `netlify.toml` includes correct redirects:
  ```toml
  [[redirects]]
    from = "/api/*"
    to = "/.netlify/functions/:splat"
    status = 200
  ```
- Verify functions are deployed (check Netlify dashboard > Functions)
- Check the paths in your API calls (should start with '/api/')

### 2. API Calls Returning 401 Unauthorized or 403 Forbidden

**Symptoms**:
- Browser console shows 401/403 errors for API calls
- Authentication-related features don't work

**Possible Causes**:
- Missing environment variables
- Incorrect Supabase credentials
- JWT token issues

**Solutions**:
- Verify required environment variables are set in Netlify:
  - SUPABASE_URL
  - SUPABASE_SERVICE_KEY
  - SUPABASE_ANON_KEY
  - SUPABASE_JWT_SECRET
- Check JWT handling in your API utility
- Review function logs for specific authentication errors

### 3. Functions Timing Out

**Symptoms**:
- Browser console shows 504 timeout errors
- Operations take too long and eventually fail

**Possible Causes**:
- Function execution exceeding Netlify's default timeout (10 seconds)
- Inefficient queries or external API calls

**Solutions**:
- Increase function timeout in `netlify.toml`:
  ```toml
  [functions]
    timeout = 30
  ```
- Optimize function code to reduce execution time
- Break complex operations into smaller chunks

### 4. CORS Errors

**Symptoms**:
- Browser console shows CORS-related errors
- API calls fail with messages about cross-origin requests

**Possible Causes**:
- Missing CORS headers in function responses
- Incorrect API URL format

**Solutions**:
- Check that all functions use the `handleOptions` and `corsHeaders` from `utils/response.js`
- Verify API calls are using the correct base URL
- Add specific CORS headers if needed:
  ```javascript
  headers: {
    'Access-Control-Allow-Origin': 'https://your-site.netlify.app',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
  ```

### 5. Environment Variable Issues

**Symptoms**:
- Functions fail with "Missing API key" or similar errors
- External services (AI, social, etc.) don't work

**Possible Causes**:
- Environment variables not set in Netlify
- Environment variables not accessible in functions

**Solutions**:
- Check all required variables are set in Netlify dashboard:
  - Site settings > Environment variables
- Verify variable names match what your code expects
- Restart Netlify build/deploy after adding variables

### 6. Build Errors

**Symptoms**:
- Deploy fails with build errors
- Site doesn't update after pushing changes

**Possible Causes**:
- TypeScript errors
- Dependencies issues
- Configuration problems

**Solutions**:
- Check build logs in Netlify dashboard
- Run build locally first (`npm run build`)
- Verify all dependencies are installed
- Check TypeScript configuration

### 7. API Utility Not Working Correctly

**Symptoms**:
- Inconsistent behavior between environments
- Some API calls work while others fail

**Possible Causes**:
- Incorrect environment detection
- Incomplete API utility implementation
- Missing function implementations

**Solutions**:
- Check environment detection in `api.ts`:
  ```typescript
  const isProduction = import.meta.env.PROD || 
    window.location.hostname === 'your-site.netlify.app' || 
    window.location.hostname.endsWith('.netlify.app');
  ```
- Verify all API methods are properly implemented
- Implement any missing functions in the Netlify Functions directory

## Advanced Debugging Techniques

### 1. Local Netlify Development

Test your functions locally before deploying:

```bash
# Install Netlify CLI
npm install netlify-cli -g

# Run Netlify dev server
netlify dev
```

This runs your functions locally and emulates the Netlify environment.

### 2. Adding Debug Logs

Add detailed logging to your functions:

```javascript
console.log('Function executing with params:', JSON.stringify(event));
console.log('Environment check:', process.env.SUPABASE_URL ? 'available' : 'missing');
```

View these logs in the Netlify Functions dashboard.

### 3. Testing Functions Directly

Test your Netlify Functions directly via curl or Postman:

```bash
# Example curl command to test a function
curl -X POST https://your-site.netlify.app/.netlify/functions/hello-world
```

### 4. Checking Function Bundle Size

Large function bundles can cause deployment issues or slow cold starts:

```bash
# Check function size
du -sh .netlify/functions/*/

# If functions are too large, optimize imports or split into multiple functions
```

## Still Having Issues?

If you've followed all the steps above and still encounter problems:

1. Review our other documentation:
   - README-NETLIFY.md
   - NETLIFY-INTEGRATION-GUIDE.md
   - NETLIFY-DEPLOYMENT-SUMMARY.md

2. Check Netlify's status page: https://www.netlifystatus.com/

3. For Supabase specific issues: https://status.supabase.com/