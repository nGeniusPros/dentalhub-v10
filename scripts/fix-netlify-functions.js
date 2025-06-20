/**
 * Fix Netlify Functions Script
 * 
 * This script automatically fixes common issues in Netlify Functions:
 * 1. Adds CORS headers using response-helpers
 * 2. Adds environment variable validation
 * 3. Wraps handler functions with createHandler
 * 4. Adds try/catch blocks where missing
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Config
const FUNCTIONS_DIR = path.join(__dirname, '..', 'netlify', 'functions');
const UTILS_DIR = path.join(FUNCTIONS_DIR, 'utils');
const ENV_VAR_REGEX = /process\.env\.([A-Z0-9_]+)/g;
const HANDLER_EXPORT_REGEX = /exports\.handler\s*=\s*(async)?\s*\(\s*event\s*,\s*context\s*\)\s*=>/;
const OLD_RESPONSE_IMPORT_REGEX = /const\s+\{\s*([^}]+)\s*\}\s*=\s*require\(['"]\.\.\/?utils\/response['"]\)/;
const SUCCESS_RESPONSE_REGEX = /return\s+success\s*\(/;
const ERROR_RESPONSE_REGEX = /return\s+error\s*\(/;
const OPTIONS_HANDLER_REGEX = /if\s*\(\s*event\.httpMethod\s*===\s*['"]OPTIONS['"]\s*\)\s*\{[^}]*return\s+handleOptions\s*\([^)]*\)[^}]*\}/;

// Skip these files
const SKIP_FILES = [
  'response-helpers.js',
  'response.js'
];

// Utility files that don't need a handler export
const UTIL_FILES = [
  'firebase.js',
  'performance.js',
  'retell.js',
  'supabase.js',
  'response-helpers.js',
  'response.js'
];

/**
 * Gets all function files recursively
 */
async function getFunctionFiles(dir) {
  const files = [];
  const entries = await readdir(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      const subFiles = await getFunctionFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.endsWith('.js') && !SKIP_FILES.includes(entry)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Extracts environment variables from file content
 */
function extractEnvVars(content) {
  const envVars = new Set();
  let match;
  
  while ((match = ENV_VAR_REGEX.exec(content)) !== null) {
    envVars.add(match[1]);
  }
  
  return Array.from(envVars);
}

/**
 * Checks if the file has a handler export
 */
function hasHandlerExport(content) {
  return HANDLER_EXPORT_REGEX.test(content);
}

/**
 * Checks if the file uses old response utilities
 */
function usesOldResponseUtils(content) {
  return OLD_RESPONSE_IMPORT_REGEX.test(content);
}

/**
 * Fixes a function file
 */
async function fixFunctionFile(filePath) {
  console.log(`Fixing ${path.relative(FUNCTIONS_DIR, filePath)}...`);
  
  let content = await readFile(filePath, 'utf8');
  let modified = false;
  const isUtilFile = UTIL_FILES.includes(path.basename(filePath));
  
  // Skip utility files that don't need a handler
  if (isUtilFile) {
    console.log(`  Skipping utility file ${path.basename(filePath)}`);
    return;
  }
  
  // Extract environment variables
  const envVars = extractEnvVars(content);
  
  // Check if file has handler export
  const hasHandler = hasHandlerExport(content);
  
  // Check if file uses old response utilities
  const usesOldUtils = usesOldResponseUtils(content);
  
  // 1. Replace old response utilities with new ones
  if (usesOldUtils) {
    const oldImport = content.match(OLD_RESPONSE_IMPORT_REGEX)[0];
    content = content.replace(
      oldImport,
      "const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers')"
    );
    modified = true;
    
    // Replace success() calls with successResponse()
    content = content.replace(/success\(([^)]*)\)/g, 'successResponse($1)');
    
    // Replace error() calls with errorResponse()
    content = content.replace(/error\(([^)]*)\)/g, 'errorResponse($1)');
    
    // Remove handleOptions usage
    content = content.replace(OPTIONS_HANDLER_REGEX, '');
  } else if (!content.includes('response-helpers')) {
    // Add new response helpers import if not already there and not a utility file
    const importStatement = "const { successResponse, errorResponse, createHandler } = require('../utils/response-helpers');\n\n";
    
    // Find the right place to insert the import
    const requireIndex = content.indexOf('require(');
    if (requireIndex !== -1) {
      // Find the end of the require statement
      const endOfRequire = content.indexOf(';', requireIndex);
      if (endOfRequire !== -1) {
        content = content.slice(0, endOfRequire + 1) + '\n' + importStatement + content.slice(endOfRequire + 1);
        modified = true;
      }
    } else {
      // Add at the beginning
      content = importStatement + content;
      modified = true;
    }
  }
  
  // 2. Add environment variable validation
  if (envVars.length > 0 && !content.includes('REQUIRED_ENV_VARS')) {
    const envVarsDeclaration = `\n// Define required environment variables\nconst REQUIRED_ENV_VARS = [${envVars.map(v => `'${v}'`).join(', ')}];\n\n`;
    
    // Find the right place to insert the declaration
    const importEnd = content.indexOf('\n\n');
    if (importEnd !== -1) {
      content = content.slice(0, importEnd + 2) + envVarsDeclaration + content.slice(importEnd + 2);
      modified = true;
    } else {
      // Add after imports
      const lastRequire = content.lastIndexOf('require(');
      if (lastRequire !== -1) {
        const endOfRequire = content.indexOf(';', lastRequire);
        if (endOfRequire !== -1) {
          content = content.slice(0, endOfRequire + 1) + envVarsDeclaration + content.slice(endOfRequire + 1);
          modified = true;
        }
      }
    }
  }
  
  // 3. Wrap handler with createHandler
  if (hasHandler && !content.includes('createHandler') && envVars.length > 0) {
    // Extract the handler function
    const handlerMatch = content.match(/exports\.handler\s*=\s*(async)?\s*\(\s*event\s*,\s*context\s*\)\s*=>\s*\{([\s\S]*)\};?\s*$/);
    
    if (handlerMatch) {
      const isAsync = !!handlerMatch[1];
      const handlerBody = handlerMatch[2];
      
      // Create the new handler function
      const newHandlerFunction = `// Main handler function
${isAsync ? 'async ' : ''}function ${path.basename(filePath, '.js').replace(/-/g, '')}Handler(event, context) {${handlerBody}}

// Export the handler with environment variable validation
exports.handler = createHandler(${path.basename(filePath, '.js').replace(/-/g, '')}Handler, REQUIRED_ENV_VARS);`;
      
      // Replace the old handler with the new one
      content = content.replace(/exports\.handler\s*=\s*(async)?\s*\(\s*event\s*,\s*context\s*\)\s*=>\s*\{[\s\S]*\};?\s*$/, newHandlerFunction);
      modified = true;
    }
  }
  
  // 4. Save changes if modified
  if (modified) {
    await writeFile(filePath, content, 'utf8');
    console.log(`  ✅ Fixed ${path.relative(FUNCTIONS_DIR, filePath)}`);
  } else {
    console.log(`  ⚠️ No changes made to ${path.relative(FUNCTIONS_DIR, filePath)}`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔧 Starting Netlify Functions fixes...');
  
  try {
    // Get all function files
    const files = await getFunctionFiles(FUNCTIONS_DIR);
    console.log(`Found ${files.length} function files to process`);
    
    // Fix each file
    for (const file of files) {
      await fixFunctionFile(file);
    }
    
    console.log('\n✅ Finished fixing Netlify Functions!');
    console.log('\nNext steps:');
    console.log('1. Run verification again: npm run verify:functions');
    console.log('2. Test locally: netlify dev');
    console.log('3. Deploy a preview: npm run deploy:preview');
  } catch (error) {
    console.error('❌ Error fixing functions:', error);
    process.exit(1);
  }
}

// Run the script
main();
