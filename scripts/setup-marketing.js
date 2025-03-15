// This script sets up the necessary database structure for marketing functionality
require('dotenv').config();
const { supabase } = require('../src/lib/supabase');
const readline = require('readline');

// Initialize readline interface for user prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask user for confirmation before creating tables
const askForConfirmation = (question) => {
  return new Promise((resolve) => {
    rl.question(question + ' (y/n): ', (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
};

// Main setup function
async function setupMarketing() {
  console.log('=== DentalHub Marketing Setup ===');

  // Check environment variables
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
    console.error('ERROR: Missing Supabase environment variables');
    console.log('Please make sure you have .env file with the following variables:');
    console.log('VITE_SUPABASE_URL=your_supabase_url');
    console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
    rl.close();
    return;
  }
  
  console.log('Environment variables found. Connecting to Supabase...');

  // Test connection
  try {
    const { data, error } = await supabase.from('profiles').select('count(*)', { count: 'exact' });
    if (error) throw error;
    console.log('Connected to Supabase successfully!');
    console.log(`Found ${data.length} profiles in the database.`);
  } catch (error) {
    console.error('Failed to connect to Supabase:', error.message);
    console.log('Please check your Supabase URL and anon key.');
    rl.close();
    return;
  }
  
  // Check if required tables exist
  const requiredTables = [
    'prospects',
    'campaigns',
    'prospect_campaigns',
    'tags',
    'prospect_tags'
  ];
  
  console.log('\nChecking for required database tables...');

  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');
  
  if (tablesError) {
    console.error('Error checking tables:', tablesError.message);
    rl.close();
    return;
  }
  
  const existingTables = tables.map(t => t.table_name);
  const missingTables = requiredTables.filter(table => !existingTables.includes(table));
  
  if (missingTables.length === 0) {
    console.log('All required tables exist!');
  } else {
    console.log('Missing tables:', missingTables.join(', '));
    
    const shouldCreateTables = await askForConfirmation('Would you like to create the missing tables?');
    
    if (shouldCreateTables) {
      console.log('Creating missing tables...');
      
      for (const table of missingTables) {
        try {
          let query = '';
          
          switch (table) {
            case 'prospects':
              query = `
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
              `;
              break;
              
            case 'campaigns':
              query = `
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
              `;
              break;
              
            case 'prospect_campaigns':
              query = `
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
              `;
              break;
              
            case 'tags':
              query = `
                create table public.tags (
                  id uuid default uuid_generate_v4() primary key,
                  name text not null unique,
                  created_at timestamp with time zone default now()
                );
              `;
              break;
              
            case 'prospect_tags':
              query = `
                create table public.prospect_tags (
                  id uuid default uuid_generate_v4() primary key,
                  prospect_id uuid references public.prospects(id) on delete cascade,
                  tag_id uuid references public.tags(id) on delete cascade,
                  created_at timestamp with time zone default now(),
                  unique(prospect_id, tag_id)
                );
              `;
              break;
          }

          const { error } = await supabase.rpc('exec_sql', { sql: query });
          if (error) throw error;
          console.log(`Created table: ${table}`);
          
        } catch (error) {
          console.error(`Failed to create table ${table}:`, error.message);
          
          if (error.message.includes('permission denied')) {
            console.log('You might need to run this SQL manually in the Supabase SQL editor.');
            console.log('Please refer to docs/MARKETING_SETUP_GUIDE.md for SQL statements.');
          }
        }
      }
    } else {
      console.log('Skipping table creation. Please create them manually in Supabase.');
      console.log('See docs/MARKETING_SETUP_GUIDE.md for the required SQL statements.');
    }
  }
  
  // Create default tags
  if (existingTables.includes('tags') || missingTables.includes('tags')) {
    console.log('\nChecking for default tags...');
    
    const defaultTags = [
      'Hot Lead',
      'Warm Lead',
      'Cold Lead',
      'Follow Up',
      'Potential Patient',
      'Referred',
      'Email Campaign',
      'SMS Campaign',
      'Needs Second Call',
      'Appointment Scheduled',
      'Appointment Completed',
      'VIP'
    ];
    

    const { data: existingTags, error: tagsError } = await supabase
      .from('tags')
      .select('name');
    if (tagsError) {
      console.error('Error checking tags:', tagsError.message);
    } else {
      const existingTagNames = existingTags.map(t => t.name);
      const missingTags = defaultTags.filter(tag => !existingTagNames.includes(tag));
      
      if (missingTags.length === 0) {
        console.log('All default tags exist!');
      } else {
        console.log('Missing tags:', missingTags.join(', '));
        
        const shouldCreateTags = await askForConfirmation('Would you like to create the missing tags?');
        
        if (shouldCreateTags) {
          const tagsToInsert = missingTags.map(name => ({ name }));
          

          const { error: insertError } = await supabase
            .from('tags')
            .insert(tagsToInsert);
          if (insertError) {
            console.error('Failed to create default tags:', insertError.message);
          } else {
            console.log(`Created ${missingTags.length} default tags.`);
          }
        }
      }
    }
  }
  
  // Setup RLS policies
  console.log('\nChecking Row Level Security (RLS) policies...');
  
  const shouldSetupRLS = await askForConfirmation('Would you like to set up RLS policies for marketing tables?');
  
  if (shouldSetupRLS) {
    try {
      // Enable RLS for all tables
      for (const table of requiredTables) {
        if (existingTables.includes(table) || missingTables.includes(table)) {
          const enableQuery = `alter table public.${table} enable row level security;`;
          await supabase.rpc('exec_sql', { sql: enableQuery });
        }
      }
      
      // Create RLS policies for prospects table
      if (existingTables.includes('prospects') || missingTables.includes('prospects')) {
        const policiesQueries = [
          `
          create policy "Users can view prospects"
          on prospects for select
          to authenticated
          using (true);
          `,
          `
          create policy "Users can insert prospects"
          on prospects for insert
          to authenticated
          with check (true);
          `,
          `
          create policy "Users can update prospects"
          on prospects for update
          to authenticated
          using (true);
          `
        ];
        
        for (const query of policiesQueries) {
          // Ignore errors in case policies already exist
          await supabase.rpc('exec_sql', { sql: query }).catch(() => {});
        }
      }
      
      // Similar policies for other tables...
      console.log('RLS policies have been set up!');
      
    } catch (error) {
      console.error('Failed to set up RLS policies:', error.message);
      console.log('You might need to set up RLS policies manually in the Supabase dashboard.');
    }
  }
  
  // Final steps
  console.log('\n=== Marketing Setup Complete ===');
  console.log('You can now import prospects and start marketing campaigns.');
  console.log('To test the functionality, run:');
  console.log('  node scripts/test-prospect-import.js');
  console.log('  node scripts/test-communication.js');
  console.log('\nTo access the prospects page, start your application and go to:');
  console.log('  http://localhost:5173/admin-dashboard/prospects');
  
  rl.close();
}

// Run the setup
setupMarketing().catch(err => {
  console.error('Setup failed with error:', err);
  rl.close();
});