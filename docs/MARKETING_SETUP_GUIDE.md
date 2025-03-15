# Marketing Functionality Setup Guide

This guide provides step-by-step instructions to set up and use the marketing functionality in DentalHub, specifically for managing prospects and running marketing campaigns.

## Prerequisites

- Node.js (v14+)
- npm or yarn
- A running Supabase instance
- A Twilio account (for SMS communication)

## Initial Setup

1. **Configure Environment Variables**

   Copy the `.env.example` file to `.env` and fill in the required information:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You can find these values in your Supabase project dashboard under Project Settings > API.

2. **Verify Database Setup**

   Run the setup script to verify that your Supabase database has the required tables:

   ```bash
   # Install dependencies first
   npm install

   # Run the setup script
   node scripts/setup-marketing.js
   ```

   This script will check if the following tables exist:
   - prospects
   - campaigns
   - prospect_campaigns
   - tags
   - prospect_tags
   - profiles

3. **Create Required Tables (if needed)**

   If the setup script indicates missing tables, you'll need to create them in your Supabase dashboard. Here are the SQL statements for creating the required tables:

   ```sql
   -- Prospects table
   create table public.prospects (
     id uuid default uuid_generate_v4() primary key,
     first_name text not null,
     last_name text not null,
     email text,
     phone text,
     address text,
     city text,
     state text,
     postal_code text,
     status text default 'new',
     lead_source text,
     interest_level text,
     notes text,
     next_appointment timestamp with time zone,
     last_contact timestamp with time zone,
     assignee_id uuid references auth.users(id),
     location_id uuid,
     created_at timestamp with time zone default now(),
     updated_at timestamp with time zone default now()
   );

   -- Campaigns table
   create table public.campaigns (
     id uuid default uuid_generate_v4() primary key,
     name text not null,
     description text,
     campaign_type text not null,
     status text default 'draft',
     twilio_number_pool text,
     created_by uuid references auth.users(id),
     created_at timestamp with time zone default now(),
     updated_at timestamp with time zone default now()
   );

   -- Prospect-Campaign join table
   create table public.prospect_campaigns (
     id uuid default uuid_generate_v4() primary key,
     prospect_id uuid references public.prospects(id) on delete cascade,
     campaign_id uuid references public.campaigns(id) on delete cascade,
     status text default 'active',
     assigned_at timestamp with time zone default now(),
     created_at timestamp with time zone default now(),
     updated_at timestamp with time zone default now(),
     unique(prospect_id, campaign_id)
   );

   -- Tags table
   create table public.tags (
     id uuid default uuid_generate_v4() primary key,
     name text not null unique,
     created_at timestamp with time zone default now()
   );

   -- Prospect-Tag join table
   create table public.prospect_tags (
     id uuid default uuid_generate_v4() primary key,
     prospect_id uuid references public.prospects(id) on delete cascade,
     tag_id uuid references public.tags(id) on delete cascade,
     created_at timestamp with time zone default now(),
     unique(prospect_id, tag_id)
   );
   ```

4. **Set up RLS (Row Level Security)**

   For proper security, set up RLS policies for these tables. In your Supabase dashboard, go to each table and create policies to restrict access to authenticated users.

5. **Test the Import Functionality**

   Run the test script to verify that prospect import is working correctly:

   ```bash
   node scripts/test-prospect-import.js
   ```

   This script will:
   - Create a sample Excel file with prospect data
   - Import the data into your Supabase database
   - Create a test campaign
   - Assign the imported prospects to the campaign

## Using the Marketing Functionality

Once you've completed the setup, you can use the marketing functionality in the application:

1. **Start the application**

   ```bash
   npm run dev
   ```

2. **Access the Prospects Page**

   Go to `http://localhost:5173/admin-dashboard/prospects`

3. **Import Prospects**

   - Click the "Import" button
   - Upload a CSV or Excel file with prospect data
   - Follow the steps in the import wizard:
     - Map your file columns to prospect fields
     - Configure import options (handling duplicates, assigning campaigns, etc.)
     - Complete the import

4. **Managing Prospects**

   You can:
   - Filter prospects by status, campaign, or tags
   - Assign prospects to campaigns
   - Send SMS messages to prospects
   - Make phone calls to prospects (if Twilio is configured)
   - Add tags to prospects
   - View prospect details

5. **Campaigns Management**

   Go to the Campaigns page to create and manage marketing campaigns:
   - Create new campaigns
   - View prospects in each campaign
   - Track campaign performance

## Troubleshooting

### Common Issues

1. **Database Connection Problems**

   - Verify your Supabase credentials in the `.env` file
   - Check if your IP address is allowed in Supabase

2. **Import Issues**

   - Ensure your CSV/Excel file has headers that match the expected fields
   - Check for special characters in your data
   - Verify that required fields (first_name, last_name) are present

3. **SMS/Calling Not Working**

   - Verify your Twilio credentials
   - Check the server logs for API errors
   - Ensure phone numbers are in the correct format (E.164)

### Getting Help

If you encounter issues not covered in this guide:

1. Check the console logs in your browser developer tools
2. Review the server logs for backend errors
3. Open an issue on the project repository with detailed information about the problem

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Twilio SMS Documentation](https://www.twilio.com/docs/sms)
- [Excel Import/Export Library (XLSX)](https://github.com/sheetjs/sheetjs)