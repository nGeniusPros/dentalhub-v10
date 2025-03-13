# DentalHub Netlify Monitoring Guide

This guide outlines monitoring best practices and implementation details for the DentalHub application deployed on Netlify. Proper monitoring is critical for production deployments to ensure application reliability, performance, and security.

## Monitoring Components

### 1. Health Check Endpoint

A dedicated health check endpoint has been implemented at `/api/health-check`. This endpoint:

- Tests database connectivity
- Verifies AI service availability
- Returns appropriate HTTP status codes (200 for healthy, 503 for degraded)
- Provides detailed component health information

**Usage:**

```bash
# Check the overall system health
curl https://dentalhub.netlify.app/api/health-check
```

**Response Example:**

```json
{
  "service": "DentalHub API",
  "status": "operational",
  "version": "v1.0.0",
  "timestamp": "2025-03-11T12:34:56.789Z",
  "components": {
    "api": { "status": "operational" },
    "database": { "status": "operational" },
    "ai": { "status": "operational" }
  },
  "environment": "production"
}
```

### 2. Netlify Analytics

Netlify provides built-in analytics for all sites. To enable:

1. Go to your site in the Netlify dashboard
2. Navigate to Analytics
3. Click "Enable Analytics"

This provides insights on:
- Page views and unique visitors
- Top pages
- Bandwidth usage
- Response codes
- File not found errors

### 3. Structured Logging

All serverless functions have been updated to use structured logging with JSON format for easier parsing. Key components:

- **Error Logs**: All errors are logged with timestamps, function names, and context
- **Performance Metrics**: Function execution times, memory usage, and success rates
- **Request Details**: API endpoints, HTTP methods, and response codes

**Sample Log Format:**

```json
{
  "type": "error",
  "timestamp": "2025-03-11T12:34:56.789Z",
  "function": "patients-lookup",
  "error": "Database connection timeout",
  "stack": "Error: Database connection timeout\n    at ...",
  "context": {
    "path": "/api/patients/lookup",
    "method": "GET",
    "requestId": "req_123abc"
  }
}
```

### 4. Client-Side Error Tracking

A client-side error tracking system has been implemented that:

- Captures unhandled exceptions and promise rejections
- Reports errors back to the server with contextual information
- Associates errors with specific users when authenticated
- Preserves stack traces for debugging

Configure integration with external monitoring services by adding the appropriate keys to environment variables:

```
SENTRY_DSN=https://abcdef123456@o123456.ingest.sentry.io/123456
```

## Setting Up External Monitoring

### 1. Uptime Monitoring

Use a service like UptimeRobot or Pingdom to monitor the health endpoint:

1. Create an account with your preferred uptime monitoring service
2. Add a new HTTP monitor for `https://dentalhub.netlify.app/api/health-check`
3. Set check interval to 5 minutes
4. Configure alerts to notify the team via email/Slack when health check fails

### 2. Sentry Integration

For detailed error tracking with source maps:

1. Create a Sentry project at https://sentry.io/
2. Add the DSN to Netlify environment variables:
   - Go to Site settings > Build & deploy > Environment
   - Add variable `SENTRY_DSN`
3. Configure notification rules in the Sentry dashboard

### 3. New Relic (Optional)

For advanced performance monitoring:

1. Sign up for a New Relic account
2. Install the Browser monitoring JS snippet
3. Add the license key to your environment variables
4. Configure custom dashboards for key metrics

## Alerting Setup

### 1. Configure Netlify Notifications

1. Go to Site settings > Notifications
2. Set up notifications for:
   - Failed deploys
   - Form submissions
   - Function execution errors

### 2. Create On-Call Schedule

Document your team's on-call rotation:

| Week | Primary | Secondary |
|------|---------|-----------|
| Current | Alice | Bob |
| Next | Charlie | Dave |

Keep this document updated with the current schedule.

### 3. Incident Response Protocol

1. **Acknowledge**: Confirm receipt of the alert
2. **Assess**: Determine severity and impact
3. **Communicate**: Notify stakeholders if user-facing
4. **Mitigate**: Implement temporary fix if possible
5. **Resolve**: Deploy permanent solution
6. **Review**: Conduct post-mortem analysis

## Monitoring Dashboard

We recommend setting up a central dashboard that combines:

1. Netlify deploy status
2. Function execution metrics
3. Error rates
4. Health check status
5. Uptime percentage

Tools like Datadog, Grafana or Cloudwatch can be configured to aggregate these metrics.

## Regular Maintenance

Schedule these monitoring tasks:

- **Daily**: Review error logs for patterns
- **Weekly**: Analyze performance metrics and identify optimization opportunities
- **Monthly**: Review and update alert thresholds based on usage patterns
- **Quarterly**: Test disaster recovery procedures

## Logging Retention

Configure log retention policies:

- Error logs: 90 days
- Performance metrics: 30 days
- Access logs: 7 days

Implement log archiving for longer-term storage if needed for compliance.