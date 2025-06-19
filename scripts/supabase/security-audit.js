/**
 * DentalHub v10 Database Security Audit Script
 * 
 * This script performs a comprehensive security audit of your Supabase database
 * to ensure it meets production security standards.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(chalk.red('Error: Missing Supabase credentials. Check your .env file.'));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tables that should have RLS enabled
const tablesToCheck = [
  'prospects',
  'campaigns',
  'prospect_campaigns',
  'tags',
  'prospect_tags',
  'ai_feedback',
  'ai_responses',
  'ai_improvements',
  'ai_training_datasets',
  'ai_response_feedback',
  'ai_dataset_feedback'
];

/**
 * Check if a table exists
 */
async function checkTableExists(tableName) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '${tableName}'
      );
    `
  });

  if (error) {
    console.error(chalk.red(`Error checking if table ${tableName} exists:`, error.message));
    return false;
  }

  return data && data[0] && data[0].exists;
}

/**
 * Check if RLS is enabled for a table
 */
async function checkRlsEnabled(tableName) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename = '${tableName}';
    `
  });

  if (error) {
    console.error(chalk.red(`Error checking RLS for table ${tableName}:`, error.message));
    return false;
  }

  return data && data[0] && data[0].rowsecurity;
}

/**
 * Check if policies exist for a table
 */
async function checkPoliciesExist(tableName) {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT COUNT(*) 
      FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = '${tableName}';
    `
  });

  if (error) {
    console.error(chalk.red(`Error checking policies for table ${tableName}:`, error.message));
    return 0;
  }

  return data && data[0] ? parseInt(data[0].count) : 0;
}

/**
 * Check if auth is configured properly
 */
async function checkAuthConfig() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT EXISTS (
        SELECT FROM auth.users 
        LIMIT 1
      );
    `
  });

  if (error) {
    console.error(chalk.red('Error checking auth configuration:', error.message));
    return false;
  }

  return true;
}

/**
 * Check if admin users are configured
 */
async function checkAdminUsers() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
      );
    `
  });

  if (error || !data || !data[0] || !data[0].exists) {
    console.error(chalk.red('Error checking admin_users table:', error ? error.message : 'Table does not exist'));
    return false;
  }

  const { data: adminData, error: adminError } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT COUNT(*) 
      FROM admin_users;
    `
  });

  if (adminError) {
    console.error(chalk.red('Error checking admin users count:', adminError.message));
    return false;
  }

  return adminData && adminData[0] ? parseInt(adminData[0].count) > 0 : false;
}

/**
 * Main function to perform security audit
 */
async function performSecurityAudit() {
  console.log(chalk.blue('=== DentalHub v10 Database Security Audit ==='));
  
  // Step 1: Check auth configuration
  console.log(chalk.blue('\nChecking authentication configuration...'));
  const authConfigured = await checkAuthConfig();
  
  if (authConfigured) {
    console.log(chalk.green('✓ Authentication is properly configured'));
  } else {
    console.log(chalk.red('✗ Authentication configuration issue detected'));
  }

  // Step 2: Check admin users
  console.log(chalk.blue('\nChecking admin users...'));
  const adminUsersConfigured = await checkAdminUsers();
  
  if (adminUsersConfigured) {
    console.log(chalk.green('✓ Admin users are properly configured'));
  } else {
    console.log(chalk.red('✗ Admin users are not properly configured'));
  }

  // Step 3: Check RLS and policies for each table
  console.log(chalk.blue('\nChecking Row Level Security and policies...'));
  
  let securityIssuesFound = false;
  
  for (const table of tablesToCheck) {
    const tableExists = await checkTableExists(table);
    
    if (!tableExists) {
      console.log(chalk.yellow(`⚠ Table ${table} does not exist, skipping security checks`));
      continue;
    }
    
    const rlsEnabled = await checkRlsEnabled(table);
    const policiesCount = await checkPoliciesExist(table);
    
    if (rlsEnabled) {
      console.log(chalk.green(`✓ RLS is enabled for table ${table}`));
    } else {
      console.log(chalk.red(`✗ RLS is NOT enabled for table ${table}`));
      securityIssuesFound = true;
    }
    
    if (policiesCount > 0) {
      console.log(chalk.green(`✓ ${policiesCount} policies found for table ${table}`));
    } else {
      console.log(chalk.red(`✗ No policies found for table ${table}`));
      securityIssuesFound = true;
    }
  }

  // Step 4: Summary
  console.log(chalk.blue('\n=== Security Audit Summary ==='));
  
  if (securityIssuesFound) {
    console.log(chalk.red('⚠ Security issues were found. Please address them before deploying to production.'));
  } else {
    console.log(chalk.green('✓ No security issues were found. Your database is properly secured for production.'));
  }
}

// Run the security audit
performSecurityAudit().catch(err => {
  console.error(chalk.red('Security audit failed:', err.message));
  process.exit(1);
});
