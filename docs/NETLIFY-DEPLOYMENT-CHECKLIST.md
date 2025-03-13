# DentalHub Production Deployment Checklist

Use this checklist before launching to production to ensure all critical components are properly configured and tested.

## Pre-Deployment Verification

### Environment Variables
- [ ] SUPABASE_URL is set to production URL
- [ ] SUPABASE_SERVICE_KEY is set (for admin functions)
- [ ] SUPABASE_ANON_KEY is set (for client-side access)
- [ ] DEEPSEEK_API_KEY is valid
- [ ] AI service API limits verified
- [ ] Other third-party API keys configured

### Security Configuration
- [ ] Content Security Policy is properly configured
- [ ] CORS settings allow only necessary origins
- [ ] API rate limiting is enabled
- [ ] Authentication tokens have appropriate expiration times
- [ ] Sensitive environment variables are marked as secret in Netlify

### Database Preparation
- [ ] Database schema is finalized
- [ ] Migrations are tested and documented
- [ ] Indexes are created for query optimization
- [ ] RLS (Row Level Security) policies are configured
- [ ] Database backups are scheduled
- [ ] Connection pools are properly sized

### Testing
- [ ] All critical paths in TEST-CRITICAL-PATHS.md have been verified
- [ ] Cross-browser testing is complete
- [ ] Mobile responsiveness is verified
- [ ] Error handling is tested (try/catch, boundary errors)
- [ ] API endpoints return appropriate status codes
- [ ] Performance testing under load is completed

### Monitoring
- [ ] Health check endpoint is accessible
- [ ] Error tracking is capturing and reporting errors
- [ ] Performance monitoring is enabled
- [ ] Logging is properly configured
- [ ] Uptime monitoring is set up
- [ ] Alert notifications are configured

## Deployment Process

### 1. Preparation
- [ ] Create deployment branch (e.g., `production`)
- [ ] Update version numbers in package.json and documentation
- [ ] Tag release in Git repository
- [ ] Notify team of upcoming deployment

### 2. Staging Deployment
- [ ] Deploy to staging environment
- [ ] Run full test suite on staging
- [ ] Verify environment variables
- [ ] Run database migrations

### 3. Production Deployment
- [ ] Schedule deployment window
- [ ] Create pre-deployment database backup
- [ ] Deploy to production
- [ ] Verify deployment was successful
- [ ] Run smoke tests on production

### 4. Post-Deployment
- [ ] Monitor error rates for 24 hours
- [ ] Check application performance
- [ ] Verify all integrations are functioning
- [ ] Confirm monitoring alerts are working
- [ ] Add deployment to release documentation

## Rollback Plan

If critical issues are discovered post-deployment:

1. Identify whether a rollback is necessary vs. a fix-forward approach
2. If rolling back:
   - [ ] Deploy previous stable version
   - [ ] Restore database if needed
   - [ ] Update DNS/routing if necessary
   - [ ] Notify team and users
3. If fixing forward:
   - [ ] Implement and test fix
   - [ ] Deploy hotfix
   - [ ] Monitor to confirm resolution

## Performance Baselines

Document these metrics after successful deployment for future comparison:

| Metric | Target | Actual |
|--------|--------|--------|
| Dashboard load time | < 3s | |
| API response time (avg) | < 200ms | |
| Time to interactive | < 4s | |
| Lighthouse score | > 85 | |
| Error rate | < 0.1% | |

## Launch Communication

- [ ] Internal announcement to team
- [ ] Customer notification (if applicable)
- [ ] Documentation updated
- [ ] Support team briefed on new features/changes

## First Week Monitoring Schedule

| Day | Primary On-Call | Secondary On-Call |
|-----|-----------------|-------------------|
| 1   |                 |                   |
| 2   |                 |                   |
| 3   |                 |                   |
| 4   |                 |                   |
| 5   |                 |                   |
| 6   |                 |                   |
| 7   |                 |                   |

Fill in team members responsible for monitoring the application during the first week after deployment.