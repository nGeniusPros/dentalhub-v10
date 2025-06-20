/**
 * Script to fix import paths for response-helpers.js in Netlify Functions
 * 
 * This script scans all Netlify Functions and fixes incorrect import paths
 * for the response-helpers.js utility.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Configuration
const functionsDir = path.join(__dirname, '..', 'netlify', 'functions');
const excludeDirs = ['utils']; // Don't process files in these directories
const incorrectImportPattern = /require\(['"]\.\./utils/response-helpers['"]\)/g;
const nestedImportPattern = /require\(['"]\./utils/response-helpers['"]\)/g;
const correctImport = "require('./utils/response-helpers')";
const nestedCorrectImport = "require('../utils/response-helpers')";

/**
 * Check if a path is a directory
 * @param {string} dirPath - Path to check
 * @returns {Promise<boolean>} - True if path is a directory
 */
async function isDirectory(dirPath) {
  try {
    const stats = await stat(dirPath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Get all JavaScript files in a directory and its subdirectories
 * @param {string} dir - Directory to scan
 * @returns {Promise<string[]>} - Array of file paths
 */
async function getJsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    
    // Skip excluded directories
    if (entry.isDirectory() && excludeDirs.includes(entry.name)) {
      return [];
    }
    
    if (entry.isDirectory()) {
      return getJsFiles(fullPath);
    } else if (entry.name.endsWith('.js')) {
      return [fullPath];
    }
    
    return [];
  }));
  
  return files.flat();
}

/**
 * Fix import paths in a file
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - True if file was modified
 */
async function fixImportPaths(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Check if file contains incorrect import path
    if (incorrectImportPattern.test(content)) {
      console.log(`Fixing import paths in ${path.relative(process.cwd(), filePath)}`);
      
      // Replace incorrect import paths
      const updatedContent = content.replace(incorrectImportPattern, correctImport);
      
      // Write updated content back to file
      await writeFile(filePath, updatedContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Scanning for incorrect import paths...');
    
    // Get all JavaScript files in the functions directory
    const files = await getJsFiles(functionsDir);
    
    // Fix import paths in each file
    const results = await Promise.all(files.map(fixImportPaths));
    
    // Count modified files
    const modifiedCount = results.filter(Boolean).length;
    
    console.log(`\nDone! Fixed import paths in ${modifiedCount} files.`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();
