# DentalHub Netlify Functions Testing Plan

This document outlines the testing strategy for DentalHub's Netlify Functions before deployment.

## Prerequisites

- Netlify CLI installed: `npm install -g netlify-cli`
- Environment variables properly configured in `.env` file
- Cleanup process completed using `npm run prepare:netlify`

## Local Testing Process

### 1. Start the Local Development Environment

```bash
netlify dev
```

This will start both the frontend and Netlify Functions locally.

### 2. Function Testing Matrix

Test each function individually to ensure proper operation:

| Function Category | Endpoint | Test Method | Expected Result |
|------------------|----------|-------------|----------------|
| **Health Check** | `/api/health-check` | GET | Returns 200 OK with status information |
| **Authentication** | `/api/auth/verify` | POST | Validates user token and returns user data |
| **AI Functions** | `/api/ai/chat` | POST | Returns AI response to user query |
| **Dashboard** | `/api/dashboard/revenue` | GET | Returns revenue data in expected format |
| **Database** | `/api/database/patients` | GET | Returns patient data from Supabase |
| **Email** | `/api/email/send` | POST | Sends email and returns success status |
| **Newsletter** | `/api/newsletter/subscribe` | POST | Adds email to newsletter list |
| **NexHealth** | `/api/nexhealth/appointments` | GET | Returns appointment data from NexHealth |
| **Notifications** | `/api/notifications/send` | POST | Sends notification and returns success |
| **Retell** | `/api/retell/create-call` | POST | Creates a new call in Retell system |
| **Social** | `/api/social/share` | POST | Shares content to social media |

### 3. Error Handling Tests

For each function, test error scenarios:

- Missing required parameters
- Invalid authentication
- External API failures
- Rate limiting responses

### 4. Performance Testing

- Test function response times
- Verify functions complete within timeout limits set in netlify.toml
- Test with typical payload sizes

### 5. Integration Testing

Test complete user flows that involve multiple functions:

1. **Patient Onboarding Flow**
   - Create patient record
   - Schedule appointment
   - Send welcome email

2. **Communication Flow**
   - Send notification
   - Log communication
   - Update patient record

3. **Reporting Flow**
   - Generate revenue report
   - Export data
   - Email report

## Deployment Testing

After deploying to a preview environment:

1. Repeat all tests against the preview URL
2. Verify CORS and security headers
3. Test authentication flows with actual Supabase
4. Verify environment variables are properly set

## Production Deployment Checklist

- [ ] All local tests pass
- [ ] All preview deployment tests pass
- [ ] Environment variables configured in Netlify UI
- [ ] Function timeouts appropriately set
- [ ] Error logging configured
- [ ] Security headers verified

## Rollback Plan

If issues are detected after deployment:

1. Identify the specific function causing problems
2. Roll back to previous deployment using Netlify UI
3. Fix issues locally and redeploy

## Monitoring

After deployment, monitor:

- Function execution logs in Netlify dashboard
- Error rates and response times
- External API integration status
