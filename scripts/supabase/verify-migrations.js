/**
 * DentalHub v10 Migration Verification Script
 * 
 * This script verifies that all migrations have been properly applied to the database.
 * It creates a migrations tracking table if it doesn't exist and checks against applied migrations.
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

/**
 * Create migrations tracking table if it doesn't exist
 */
async function createMigrationsTable() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS migration_history (
        id SERIAL PRIMARY KEY,
        migration_name TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        applied_by TEXT
      );
    `
  });

  if (error) {
    console.error(chalk.red('Error creating migrations table:', error.message));
    return false;
  }

  return true;
}

/**
 * Check if a migration has been applied
 */
async function checkMigrationApplied(migrationName) {
  const { data, error } = await supabase
    .from('migration_history')
    .select('migration_name')
    .eq('migration_name', migrationName);

  if (error) {
    console.error(chalk.red(`Error checking if migration ${migrationName} has been applied:`, error.message));
    return false;
  }

  return data && data.length > 0;
}

/**
 * Record a migration as applied
 */
async function recordMigration(migrationName) {
  const { error } = await supabase
    .from('migration_history')
    .insert([
      { 
        migration_name: migrationName,
        applied_by: 'verification_script'
      }
    ]);

  if (error) {
    console.error(chalk.red(`Error recording migration ${migrationName}:`, error.message));
    return false;
  }

  return true;
}

/**
 * Apply a migration
 */
async function applyMigration(migrationPath, migrationName) {
  try {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error(chalk.red(`Error applying migration ${migrationName}:`, error.message));
      return false;
    }
    
    const recorded = await recordMigration(migrationName);
    return recorded;
  } catch (err) {
    console.error(chalk.red(`Error reading or executing migration ${migrationName}:`, err.message));
    return false;
  }
}

/**
 * Main function to verify and apply migrations
 */
async function verifyMigrations() {
  console.log(chalk.blue('=== DentalHub v10 Migration Verification ==='));
  
  // Step 1: Create migrations table if it doesn't exist
  console.log(chalk.blue('\nChecking migrations tracking table...'));
  const tableCreated = await createMigrationsTable();
  
  if (tableCreated) {
    console.log(chalk.green('✓ Migrations tracking table exists or was created'));
  } else {
    console.log(chalk.red('✗ Failed to create migrations tracking table'));
    process.exit(1);
  }

  // Step 2: Check and apply migrations
  console.log(chalk.blue('\nVerifying migrations...'));
  const migrationsDir = path.join(process.cwd(), 'scripts', 'supabase', 'migrations');
  
  try {
    const files = fs.readdirSync(migrationsDir);
    const migrationFiles = files.filter(file => file.endsWith('.sql')).sort();
    
    for (const file of migrationFiles) {
      const migrationName = file;
      const migrationPath = path.join(migrationsDir, file);
      
      const isApplied = await checkMigrationApplied(migrationName);
      
      if (isApplied) {
        console.log(chalk.green(`✓ Migration ${migrationName} has already been applied`));
      } else {
        console.log(chalk.yellow(`⚠ Migration ${migrationName} has not been applied. Applying now...`));
        
        const success = await applyMigration(migrationPath, migrationName);
        
        if (success) {
          console.log(chalk.green(`✓ Migration ${migrationName} applied successfully`));
        } else {
          console.log(chalk.red(`✗ Failed to apply migration ${migrationName}`));
        }
      }
    }
  } catch (err) {
    console.error(chalk.red('Error reading migrations directory:', err.message));
    process.exit(1);
  }

  console.log(chalk.green('\n=== Migration verification complete ==='));
}

// Run the verification
verifyMigrations().catch(err => {
  console.error(chalk.red('Verification failed:', err.message));
  process.exit(1);
});
