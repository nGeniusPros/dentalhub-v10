#!/usr/bin/env node

/**
 * Prepare for Netlify Deployment Script
 * 
 * This script cleans up the codebase by removing files and directories
 * that are not needed for a Netlify Functions deployment.
 */

const fs = require('fs').promises;
const path = require('path');

// Get the project root directory
const projectRoot = path.resolve(__dirname, '..');

// Files and directories to remove
const itemsToRemove = [
  // Server directory and related files
  'server',
  'Dockerfile',
  '.dockerignore',
  'proxy-server.js',
  
  // Server startup scripts
  'server/start-server.bat',
  'server/start-server.ps1',
  'server/start-server.sh',
  'server/start-with-frontend.bat',
  'server/start-with-frontend.ps1',
  'server/start-with-frontend.sh',
];

// Function to safely remove a file or directory
async function safeRemove(itemPath) {
  try {
    const fullPath = path.join(projectRoot, itemPath);
    const stats = await fs.stat(fullPath).catch(() => null);
    
    if (!stats) {
      console.log(`⚠️ ${itemPath} does not exist, skipping`);
      return;
    }
    
    if (stats.isDirectory()) {
      console.log(`🗑️ Removing directory: ${itemPath}`);
      await fs.rm(fullPath, { recursive: true, force: true });
    } else {
      console.log(`🗑️ Removing file: ${itemPath}`);
      await fs.unlink(fullPath);
    }
  } catch (error) {
    console.error(`❌ Error removing ${itemPath}:`, error);
  }
}

// Main function
async function main() {
  console.log('🧹 Starting cleanup for Netlify deployment...');
  
  // Remove each item in the list
  for (const item of itemsToRemove) {
    await safeRemove(item);
  }
  
  console.log('✅ Cleanup complete!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Run a local build to verify everything compiles: npm run build');
  console.log('2. Test Netlify Functions locally: netlify dev');
  console.log('3. Deploy to Netlify: netlify deploy --prod');
}

// Run the main function
main().catch(error => {
  console.error('❌ Cleanup failed:', error);
  process.exit(1);
});

// Export the main function for potential reuse
module.exports = { main };
