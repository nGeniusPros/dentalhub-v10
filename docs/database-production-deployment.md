# DentalHub v10 Database Production Deployment Guide

This guide provides step-by-step instructions for deploying the DentalHub v10 database to production. It covers database setup, migration, security configuration, and environment variable management.

## Prerequisites

- Supabase account with a production project created
- Node.js 18+ installed
- Access to your production environment (Netlify, Vercel, or other hosting provider)

## 1. Environment Configuration

### 1.1 Set Up Environment Variables

1. Copy the `.env.production` file to your production environment:

```bash
cp .env.production .env.production.local
```

2. Update the values in `.env.production.local` with your actual production credentials:

```
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_KEY=your_production_service_key
# ... other variables
```

3. Configure these environment variables in your hosting provider's dashboard:
   - For Netlify: Go to Site settings > Build & deploy > Environment variables
   - For Vercel: Go to Project settings > Environment Variables

## 2. Database Setup and Migration

### 2.1 Install Dependencies

```bash
npm install
```

### 2.2 Deploy Database Schema

Run the database deployment script to set up all required tables and security policies:

```bash
node scripts/supabase/deploy-production-db.js
```

This script will:
- Check for required extensions
- Create all necessary tables if they don't exist
- Apply security policies
- Set up indexes for performance
- Configure Row Level Security

### 2.3 Verify Migrations

Run the migration verification script to ensure all migrations have been applied:

```bash
node scripts/supabase/verify-migrations.js
```

This script will:
- Create a migration tracking table if it doesn't exist
- Check which migrations have been applied
- Apply any missing migrations
- Record applied migrations in the tracking table

## 3. Security Configuration

### 3.1 Run Security Audit

Run the security audit script to ensure your database meets production security standards:

```bash
node scripts/supabase/security-audit.js
```

This script checks:
- Row Level Security (RLS) is enabled for all tables
- Security policies are properly configured
- Authentication is set up correctly
- Admin users are configured

### 3.2 Configure Admin Users

1. Add admin users to the `admin_users` table through the Supabase dashboard:
   - Go to Table Editor > admin_users
   - Add the email addresses of users who should have admin privileges

2. Ensure these users have accounts in your authentication system.

## 4. Database Schema Overview

### Core Tables

- **prospects**: Stores information about dental patient prospects
- **campaigns**: Marketing campaigns for patient acquisition
- **prospect_campaigns**: Junction table linking prospects to campaigns
- **tags**: Categories for organizing prospects
- **prospect_tags**: Junction table linking prospects to tags

### AI and Machine Learning Tables

- **ai_feedback**: User feedback on AI responses
- **ai_responses**: Actual AI interactions
- **ai_improvements**: Tracking model improvements
- **ai_training_datasets**: Managing training data
- **ai_response_feedback**: Detailed feedback for reinforcement learning
- **ai_dataset_feedback**: Junction table for datasets and feedback

## 5. Performance Optimization

### 5.1 Indexes

The following indexes are created for performance optimization:

- **idx_ai_feedback_response_id**: For quick lookup of feedback by response ID
- **idx_ai_feedback_agent_type**: For filtering feedback by agent type
- **idx_ai_feedback_user_role**: For filtering feedback by user role
- **idx_ai_feedback_context**: For filtering feedback by context
- **idx_ai_feedback_is_validated**: For filtering validated/unvalidated feedback
- **idx_ai_responses_agent_type**: For filtering responses by agent type
- **idx_prospects_status**: For filtering prospects by status
- **idx_prospects_assignee**: For filtering prospects by assignee
- **idx_prospects_location**: For filtering prospects by location
- **idx_campaigns_status**: For filtering campaigns by status
- **idx_campaigns_type**: For filtering campaigns by type

### 5.2 Vector Search

Vector search is enabled for AI feedback and responses, allowing for semantic search capabilities. The following indexes are created for vector search:

- Vector index on **ai_response_feedback.embedding**

## 6. Monitoring and Maintenance

### 6.1 Database Monitoring

Set up monitoring for your Supabase database:
- Enable database metrics in the Supabase dashboard
- Set up alerts for high CPU usage, storage limits, and connection limits

### 6.2 Regular Backups

Configure regular backups of your production database:
- Enable point-in-time recovery in Supabase
- Schedule regular exports of critical data

### 6.3 Maintenance Tasks

Schedule regular maintenance tasks:
- Run `VACUUM ANALYZE` periodically to optimize performance
- Monitor and clean up unused indexes
- Review and update security policies as needed

## 7. Troubleshooting

### 7.1 Common Issues

- **Connection Issues**: Verify environment variables are correctly set
- **Permission Errors**: Check RLS policies and user roles
- **Performance Issues**: Review query performance and indexes

### 7.2 Support Resources

- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- DentalHub Support: [support@dentalhub.com](mailto:support@dentalhub.com)

## 8. Next Steps

After deploying your database:

1. Deploy your frontend application
2. Configure authentication providers
3. Set up monitoring and analytics
4. Perform end-to-end testing
5. Create a rollback plan in case of issues

---

This guide was last updated on June 19, 2025.
