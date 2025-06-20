/**
 * Script to fix import paths for response-helpers.js in Netlify Functions
 * 
 * This script ensures all functions use the correct import path for response-helpers.js
 * based on their location in the directory structure.
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
const excludeDirs = []; // We need to process utils directory too

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
 * Check if a file is in a subdirectory of the functions directory
 * @param {string} filePath - Path to check
 * @returns {boolean} - True if file is in a subdirectory
 */
function isInSubdirectory(filePath) {
  const relativePath = path.relative(functionsDir, filePath);
  return relativePath.includes(path.sep) && !relativePath.startsWith('utils');
}

/**
 * Fix import paths in a file
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - True if file was modified
 */
async function fixImportPaths(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let updatedContent = content;
    let wasModified = false;
    
    // Determine if file is in a subdirectory
    const inSubdirectory = isInSubdirectory(filePath);
    
    // Check for response-helpers import
    const hasResponseHelpersImport = content.includes('response-helpers');
    
    if (hasResponseHelpersImport) {
      if (inSubdirectory) {
        // Files in subdirectories need to use '../utils/response-helpers'
        if (content.includes("require('./utils/response-helpers')")) {
          console.log(`Fixing import paths in ${path.relative(process.cwd(), filePath)} (subdirectory)`);
          updatedContent = content.replace(
            /require\(['"]\.\/utils\/response-helpers['"]\)/g, 
            "require('../utils/response-helpers')"
          );
          wasModified = true;
        }
      } else {
        // Files in root directory need to use './utils/response-helpers'
        if (content.includes("require('../utils/response-helpers')")) {
          console.log(`Fixing import paths in ${path.relative(process.cwd(), filePath)} (root directory)`);
          updatedContent = content.replace(
            /require\(['"]\.\.\/utils\/response-helpers['"]\)/g, 
            "require('./utils/response-helpers')"
          );
          wasModified = true;
        }
      }
    }
    
    // Write updated content back to file if modified
    if (wasModified) {
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
