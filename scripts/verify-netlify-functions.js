#!/usr/bin/env node

/**
 * Netlify Functions Verification Script
 * 
 * This script verifies that all Netlify Functions are properly configured
 * and ready for deployment. It checks for common issues and provides
 * suggestions for fixing them.
 */

const fs = require('fs').promises;
const path = require('path');

// Get the project root directory
const projectRoot = path.resolve(__dirname, '..');
const functionsDir = path.join(projectRoot, 'netlify', 'functions');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Function to check if a file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Function to recursively find all JavaScript files in a directory
async function findJsFiles(dir, fileList = []) {
  const files = await fs.readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);
    
    if (stats.isDirectory()) {
      await findJsFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Function to check if a file contains a handler export
async function hasHandlerExport(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  
  // Skip utility files that don't need a handler export
  const fileName = path.basename(filePath);
  const isUtilFile = [
    'response-helpers.js',
    'response.js',
    'firebase.js',
    'performance.js',
    'retell.js',
    'supabase.js'
  ].includes(fileName);
  
  if (isUtilFile) {
    return true;
  }
  
  return content.includes('exports.handler =') || 
         content.includes('export const handler =') ||
         content.includes('export async function handler');
}

// Function to check for common issues in a function file
async function checkFunctionFile(filePath) {
  const issues = [];
  const content = await fs.readFile(filePath, 'utf-8');
  
  // Check for handler export
  if (!await hasHandlerExport(filePath)) {
    issues.push(`Missing handler export. Add 'exports.handler = async (event, context) => { ... }'`);
  }
  
  // Check for error handling
  if (!content.includes('try') || !content.includes('catch')) {
    issues.push('Missing try/catch block for error handling');
  }
  
  // Check for CORS headers
  if (!content.includes('Access-Control-Allow-Origin') && 
      !content.includes('response-helpers') && 
      !content.includes('createHandler')) {
    issues.push('Missing CORS headers');
  }
  
  // Check for environment variable usage without validation
  const envVarMatches = content.match(/process\.env\.[A-Z_]+/g) || [];
  
  // Skip validation check if using response-helpers with REQUIRED_ENV_VARS
  const usesResponseHelpers = content.includes('response-helpers');
  const usesRequiredEnvVars = content.includes('REQUIRED_ENV_VARS');
  const usesCreateHandler = content.includes('createHandler');
  
  if (!usesResponseHelpers || !usesRequiredEnvVars || !usesCreateHandler) {
    for (const envVar of envVarMatches) {
      const envVarName = envVar.replace('process.env.', '');
      
      // Check if the variable is included in REQUIRED_ENV_VARS
      const isInRequiredEnvVars = content.includes(`'${envVarName}'`) || 
                                content.includes(`"${envVarName}"`);
      
      if (!content.includes(`if (!${envVar})`) && 
          !content.includes(`${envVar} ||`) &&
          !content.includes(`!${envVar}`) &&
          !(usesRequiredEnvVars && isInRequiredEnvVars)) {
        issues.push(`Environment variable ${envVar} used without validation`);
      }
    }
  }
  
  return issues;
}

// Main function
async function main() {
  console.log(`${colors.cyan}Verifying Netlify Functions...${colors.reset}\n`);
  
  // Check if functions directory exists
  if (!await fileExists(functionsDir)) {
    console.error(`${colors.red}❌ Functions directory not found: ${functionsDir}${colors.reset}`);
    process.exit(1);
  }
  
  // Find all JavaScript files in the functions directory
  const functionFiles = await findJsFiles(functionsDir);
  console.log(`${colors.blue}Found ${functionFiles.length} function files${colors.reset}`);
  
  // Check each function file
  let hasIssues = false;
  for (const filePath of functionFiles) {
    const relativePath = path.relative(projectRoot, filePath);
    const issues = await checkFunctionFile(filePath);
    
    if (issues.length > 0) {
      hasIssues = true;
      console.log(`\n${colors.yellow}⚠️ Issues in ${relativePath}:${colors.reset}`);
      issues.forEach(issue => console.log(`  - ${issue}`));
    } else {
      console.log(`${colors.green}✅ ${relativePath}${colors.reset}`);
    }
  }
  
  // Check netlify.toml configuration
  const netlifyTomlPath = path.join(projectRoot, 'netlify.toml');
  if (await fileExists(netlifyTomlPath)) {
    const netlifyToml = await fs.readFile(netlifyTomlPath, 'utf-8');
    
    // Check for functions configuration
    if (!netlifyToml.includes('[functions]')) {
      console.log(`\n${colors.yellow}⚠️ netlify.toml is missing [functions] configuration${colors.reset}`);
      hasIssues = true;
    }
    
    // Check for redirects
    if (!netlifyToml.includes('[[redirects]]') || !netlifyToml.includes('/api/*')) {
      console.log(`\n${colors.yellow}⚠️ netlify.toml is missing API redirects configuration${colors.reset}`);
      hasIssues = true;
    }
  } else {
    console.log(`\n${colors.red}❌ netlify.toml not found${colors.reset}`);
    hasIssues = true;
  }
  
  // Summary
  console.log('\n' + '-'.repeat(50));
  if (hasIssues) {
    console.log(`${colors.yellow}⚠️ Some issues were found. Please fix them before deploying.${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ All Netlify Functions look good!${colors.reset}`);
  }
  
  console.log('\n📋 Next steps:');
  console.log('1. Run local tests: netlify dev');
  console.log('2. Deploy a preview: npm run deploy:preview');
  console.log('3. Deploy to production: npm run deploy:prod');
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}❌ Verification failed:${colors.reset}`, error);
  process.exit(1);
});

// Export the main function for potential reuse
module.exports = { main };
