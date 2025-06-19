/**
 * DentalHub v10 Database Verification Script
 * 
 * This script verifies the database structure and security settings
 * using the credentials from your .env file.
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const chalk = require('chalk');

// Load environment variables
dotenv.config();

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(chalk.red('Error: Missing Supabase credentials. Check your .env file.'));
  process.exit(1);
}

console.log(chalk.blue('Using Supabase URL:', supabaseUrl));
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Required tables for the application
const requiredTables = [
  'profiles', 'prospects', 'campaigns', 'locations', 
  'tags', 'prospect_tags', 'prospect_campaigns',
  'ai_feedback', 'ai_responses', 'ai_improvements', 
  'ai_training_datasets', 'ai_response_feedback',
  'ai_dataset_feedback', 'admin_users', 'migration_history'
];

/**
 * Check if a table exists in the database
 */
async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);

    if (error) {
      console.error(chalk.red(`Error checking if table ${tableName} exists:`, error.message));
      return false;
    }

    return data && data.length > 0;
  } catch (err) {
    console.error(chalk.red(`Error checking table ${tableName}:`, err.message));
    return false;
  }
}

/**
 * Check if RLS is enabled for a table
 */
async function checkRlsEnabled(tableName) {
  try {
    const { data, error } = await supabase
      .from('pg_tables')
      .select('rowsecurity')
      .eq('schemaname', 'public')
      .eq('tablename', tableName);

    if (error) {
      console.error(chalk.red(`Error checking RLS for table ${tableName}:`, error.message));
      return false;
    }

    return data && data.length > 0 && data[0].rowsecurity;
  } catch (err) {
    console.error(chalk.red(`Error checking RLS for table ${tableName}:`, err.message));
    return false;
  }
}

/**
 * Check if policies exist for a table
 */
async function checkPoliciesExist(tableName) {
  try {
    const { data, error } = await supabase
      .from('pg_policies')
      .select('policyname')
      .eq('schemaname', 'public')
      .eq('tablename', tableName);

    if (error) {
      console.error(chalk.red(`Error checking policies for table ${tableName}:`, error.message));
      return false;
    }

    return data && data.length > 0;
  } catch (err) {
    console.error(chalk.red(`Error checking policies for table ${tableName}:`, err.message));
    return false;
  }
}

/**
 * Main verification function
 */
async function verifyDatabase() {
  console.log(chalk.blue('=== DentalHub v10 Database Verification ===\n'));
  
  // Test connection
  try {
    const { data, error } = await supabase.from('pg_tables').select('tablename').limit(1);
    if (error) {
      console.error(chalk.red('Failed to connect to Supabase:', error.message));
      process.exit(1);
    }
    console.log(chalk.green('✓ Successfully connected to Supabase\n'));
  } catch (err) {
    console.error(chalk.red('Failed to connect to Supabase:', err.message));
    process.exit(1);
  }
  
  // Check required tables
  console.log(chalk.blue('Checking required tables...'));
  let allTablesExist = true;
  for (const table of requiredTables) {
    const exists = await checkTableExists(table);
    if (exists) {
      console.log(chalk.green(`✓ Table ${table} exists`));
    } else {
      console.log(chalk.red(`✗ Table ${table} does not exist`));
      allTablesExist = false;
    }
  }
  
  if (allTablesExist) {
    console.log(chalk.green('\n✓ All required tables exist\n'));
  } else {
    console.log(chalk.red('\n✗ Some required tables are missing\n'));
  }
  
  // Check RLS
  console.log(chalk.blue('Checking Row Level Security...'));
  let allRlsEnabled = true;
  for (const table of requiredTables) {
    const exists = await checkTableExists(table);
    if (!exists) continue;
    
    const rlsEnabled = await checkRlsEnabled(table);
    if (rlsEnabled) {
      console.log(chalk.green(`✓ RLS is enabled for table ${table}`));
    } else {
      console.log(chalk.red(`✗ RLS is not enabled for table ${table}`));
      allRlsEnabled = false;
    }
  }
  
  if (allRlsEnabled) {
    console.log(chalk.green('\n✓ RLS is enabled for all tables\n'));
  } else {
    console.log(chalk.red('\n✗ RLS is not enabled for some tables\n'));
  }
  
  // Check policies
  console.log(chalk.blue('Checking security policies...'));
  let allPoliciesExist = true;
  for (const table of requiredTables) {
    const exists = await checkTableExists(table);
    if (!exists) continue;
    
    const policiesExist = await checkPoliciesExist(table);
    if (policiesExist) {
      console.log(chalk.green(`✓ Security policies exist for table ${table}`));
    } else {
      console.log(chalk.red(`✗ No security policies found for table ${table}`));
      allPoliciesExist = false;
    }
  }
  
  if (allPoliciesExist) {
    console.log(chalk.green('\n✓ Security policies are configured for all tables\n'));
  } else {
    console.log(chalk.red('\n✗ Some tables are missing security policies\n'));
  }
  
  // Summary
  console.log(chalk.blue('=== Database Verification Summary ==='));
  if (allTablesExist && allRlsEnabled && allPoliciesExist) {
    console.log(chalk.green('\n✓ Database is properly configured for production\n'));
  } else {
    console.log(chalk.yellow('\n⚠ Database configuration needs attention before production deployment\n'));
  }
}

// Run the verification
verifyDatabase().catch(err => {
  console.error(chalk.red('Verification failed:', err.message));
  process.exit(1);
});
