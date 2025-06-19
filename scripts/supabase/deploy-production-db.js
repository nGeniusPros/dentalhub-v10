/**
 * DentalHub v10 Production Database Deployment Script
 * 
 * This script helps deploy and validate the database setup for production.
 * It checks for existing tables, applies migrations, and verifies security settings.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
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

// Required tables for the application
const requiredTables = [
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
  'ai_dataset_feedback',
  'admin_users'
];

// Required extensions
const requiredExtensions = [
  'uuid-ossp',
  'vector'
];

// Required indexes
const requiredIndexes = [
  'idx_ai_feedback_response_id',
  'idx_ai_feedback_agent_type',
  'idx_ai_feedback_user_role',
  'idx_ai_feedback_context',
  'idx_ai_feedback_is_validated',
  'idx_ai_responses_agent_type',
  'idx_prospects_status',
  'idx_prospects_assignee',
  'idx_prospects_location',
  'idx_campaigns_status',
  'idx_campaigns_type'
];

/**
 * Check if a table exists in the database
 */
async function checkTableExists(tableName) {
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
}

/**
 * Check if an extension is installed
 */
async function checkExtensionExists(extensionName) {
  const { data, error } = await supabase
    .from('pg_extension')
    .select('extname')
    .eq('extname', extensionName);

  if (error) {
    console.error(chalk.red(`Error checking if extension ${extensionName} exists:`, error.message));
    return false;
  }

  return data && data.length > 0;
}

/**
 * Check if an index exists
 */
async function checkIndexExists(indexName) {
  const { data, error } = await supabase
    .from('pg_indexes')
    .select('indexname')
    .eq('indexname', indexName);

  if (error) {
    console.error(chalk.red(`Error checking if index ${indexName} exists:`, error.message));
    return false;
  }

  return data && data.length > 0;
}

/**
 * Execute a SQL file
 */
async function executeSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error(chalk.red(`Error executing SQL file ${filePath}:`, error.message));
      return false;
    }
    
    return true;
  } catch (err) {
    console.error(chalk.red(`Error reading or executing SQL file ${filePath}:`, err.message));
    return false;
  }
}

/**
 * Check if RLS is enabled for a table
 */
async function checkRlsEnabled(tableName) {
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
}

/**
 * Main function to deploy and validate the database
 */
async function deployAndValidate() {
  console.log(chalk.blue('=== DentalHub v10 Production Database Deployment ==='));
  
  // Step 1: Check for required extensions
  console.log(chalk.blue('\nChecking required extensions...'));
  for (const extension of requiredExtensions) {
    const exists = await checkExtensionExists(extension);
    if (exists) {
      console.log(chalk.green(`✓ Extension ${extension} is installed`));
    } else {
      console.log(chalk.yellow(`⚠ Extension ${extension} is not installed. Will be created in the setup script.`));
    }
  }

  // Step 2: Check for required tables
  console.log(chalk.blue('\nChecking required tables...'));
  const missingTables = [];
  for (const table of requiredTables) {
    const exists = await checkTableExists(table);
    if (exists) {
      console.log(chalk.green(`✓ Table ${table} exists`));
    } else {
      console.log(chalk.yellow(`⚠ Table ${table} does not exist. Will be created in the setup script.`));
      missingTables.push(table);
    }
  }

  // Step 3: Apply the production setup script if needed
  if (missingTables.length > 0) {
    console.log(chalk.blue('\nApplying production setup script...'));
    const setupPath = path.join(process.cwd(), 'scripts', 'supabase', 'production-setup.sql');
    const success = await executeSqlFile(setupPath);
    
    if (success) {
      console.log(chalk.green('✓ Production setup script applied successfully'));
    } else {
      console.log(chalk.red('✗ Failed to apply production setup script'));
      process.exit(1);
    }
  }

  // Step 4: Check for required indexes
  console.log(chalk.blue('\nChecking required indexes...'));
  for (const index of requiredIndexes) {
    const exists = await checkIndexExists(index);
    if (exists) {
      console.log(chalk.green(`✓ Index ${index} exists`));
    } else {
      console.log(chalk.yellow(`⚠ Index ${index} does not exist. Will be created in the setup script.`));
    }
  }

  // Step 5: Check RLS settings
  console.log(chalk.blue('\nChecking Row Level Security settings...'));
  for (const table of requiredTables) {
    const enabled = await checkRlsEnabled(table);
    if (enabled) {
      console.log(chalk.green(`✓ RLS is enabled for table ${table}`));
    } else {
      console.log(chalk.yellow(`⚠ RLS is not enabled for table ${table}. Will be enabled in the setup script.`));
    }
  }

  // Step 6: Apply any pending migrations
  console.log(chalk.blue('\nApplying pending migrations...'));
  const migrationsDir = path.join(process.cwd(), 'scripts', 'supabase', 'migrations');
  
  try {
    const files = fs.readdirSync(migrationsDir);
    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(chalk.blue(`Applying migration: ${file}`));
        const migrationPath = path.join(migrationsDir, file);
        const success = await executeSqlFile(migrationPath);
        
        if (success) {
          console.log(chalk.green(`✓ Migration ${file} applied successfully`));
        } else {
          console.log(chalk.red(`✗ Failed to apply migration ${file}`));
        }
      }
    }
  } catch (err) {
    console.error(chalk.red('Error reading migrations directory:', err.message));
  }

  console.log(chalk.green('\n=== Database deployment and validation complete ==='));
}

// Run the deployment and validation
deployAndValidate().catch(err => {
  console.error(chalk.red('Deployment failed:', err.message));
  process.exit(1);
});
