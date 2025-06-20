# Netlify Functions Migration Guide

This guide provides instructions for updating existing Netlify Functions to use the new response-helpers utility and follow best practices for deployment.

## Common Issues to Fix

Our verification script identified several common issues across the Netlify Functions:

1. Missing CORS headers
2. Insufficient environment variable validation
3. Inconsistent error handling
4. Missing try/catch blocks

## Using the Response Helpers Utility

We've created a new utility file at `utils/response-helpers.js` that provides standardized functions for:

- Adding CORS headers to all responses
- Handling success responses
- Handling error responses
- Validating environment variables
- Creating handlers with built-in error handling

## Migration Steps

Follow these steps to update each function:

### 1. Update Imports

Replace existing response utility imports with the new helpers:

```javascript
// OLD
const { handleOptions, success, error } = require('../utils/response');

// NEW
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');
```

### 2. Define Required Environment Variables

List all required environment variables at the top of the file:

```javascript
// Define required environment variables
const REQUIRED_ENV_VARS = ['VARIABLE_NAME_1', 'VARIABLE_NAME_2'];
```

### 3. Refactor Handler Function

Convert the existing handler to a named function:

```javascript
// OLD
exports.handler = async (event, context) => {
  // ...
};

// NEW
async function myFunctionHandler(event, context) {
  // ...
}

// Export the handler with environment variable validation
exports.handler = createHandler(myFunctionHandler, REQUIRED_ENV_VARS);
```

### 4. Remove Manual CORS and Options Handling

The `createHandler` function automatically handles CORS and OPTIONS requests, so remove this code:

```javascript
// REMOVE THIS
if (event.httpMethod === 'OPTIONS') {
  return handleOptions(event);
}
```

### 5. Update Response Formatting

Replace the old response formatting with the new helpers:

```javascript
// OLD
return success(data, 200, event);

// NEW
return successResponse(data);
```

```javascript
// OLD
return error(message, statusCode, event);

// NEW
return errorResponse(message, statusCode);
```

### 6. Ensure Proper Error Handling

Make sure all code is wrapped in try/catch blocks:

```javascript
try {
  // Function logic
} catch (err) {
  console.error('Function error:', err);
  return errorResponse(`Operation failed: ${err.message}`, 500);
}
```

## Example Migration

Here's a complete example of a migrated function:

```javascript
const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');

// Define required environment variables
const REQUIRED_ENV_VARS = ['API_KEY'];

async function myFunctionHandler(event, context) {
  // Only allow specific HTTP methods
  if (event.httpMethod !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Parse request body
    const payload = JSON.parse(event.body);
    
    // Function logic here...
    const result = { success: true, data: "Some data" };
    
    // Return success response
    return successResponse(result);
  } catch (err) {
    console.error('Function error:', err);
    return errorResponse(`Operation failed: ${err.message}`, 500);
  }
}

// Export the handler with environment variable validation
exports.handler = createHandler(myFunctionHandler, REQUIRED_ENV_VARS);
```

## Testing Your Migration

After updating a function:

1. Test it locally using Netlify Dev: `netlify dev`
2. Verify CORS headers are present in responses
3. Test error scenarios to ensure proper error handling
4. Verify environment variable validation works correctly

## Deployment Considerations

- All functions must be updated before production deployment
- Run the verification script to check for any remaining issues: `npm run verify:functions`
- Test all functions in a preview deployment before going to production
