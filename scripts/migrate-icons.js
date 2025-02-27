const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Paths to search for files
const sourceDirs = [
  path.resolve(__dirname, '../src')
];

// Function to process a file
function processFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip files that already use the icon strategy
    if (content.includes("import { Icon") || 
        content.includes("import Icon from") || 
        content.includes("from '../ui/icon-strategy'") ||
        content.includes("from '../../components/ui/icon-strategy'") ||
        content.includes("from '../components/ui/icon-strategy'")) {
      console.log(`  Skipping (already uses Icon component): ${filePath}`);
      return;
    }
    
    // Handle files importing from lucide-react
    const lucideImportMatch = content.match(/import\s+[{]([^}]+)[}]\s+from\s+['"]lucide-react['"]/);
    if (lucideImportMatch) {
      // Extract imported icons
      const importedIcons = lucideImportMatch[1]
        .split(',')
        .map(i => i.trim())
        .filter(i => i);
      
      console.log(`  Found ${importedIcons.length} Lucide icons`);
      
      // Determine the relative path to the icon-strategy file
      let relativePath;
      const relativeToSrc = path.relative(path.dirname(filePath), path.resolve(__dirname, '../src/components/ui'));
      relativePath = relativeToSrc.replace(/\\/g, '/');
      if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
      }
      
      // Replace original import with Icon import
      const iconImport = `import { Icon } from '${relativePath}/icon-strategy';`;
      content = content.replace(/import\s+[{][^}]+[}]\s+from\s+['"]lucide-react['"];?/, iconImport);
      
      // Replace icon usages with Icon component
      importedIcons.forEach(iconName => {
        // Skip empty strings
        if (!iconName) return;
        
        const iconRegex = new RegExp(`<${iconName}([^>]*)>`, 'g');
        content = content.replace(iconRegex, (match, props) => {
          return `<Icon name="${iconName}"${props}>`;
        });
        
        const closeIconRegex = new RegExp(`<${iconName}([^>]*)></${iconName}>`, 'g');
        content = content.replace(closeIconRegex, (match, props) => {
          return `<Icon name="${iconName}"${props}></Icon>`;
        });
      });
      
      // Handle importing all icons as namespace
      if (content.includes("import * as Icons from 'lucide-react'")) {
        // Replace import
        content = content.replace(
          /import\s+\*\s+as\s+Icons\s+from\s+['"]lucide-react['"];?/,
          `import { Icon } from '${relativePath}/icon-strategy';`
        );
        
        // Replace usages
        content = content.replace(/<Icons\.([A-Za-z0-9]+)([^>]*)>/g, (match, iconName, props) => {
          return `<Icon name="${iconName}"${props}>`;
        });
        
        content = content.replace(/<Icons\.([A-Za-z0-9]+)([^>]*)><\/Icons\.[A-Za-z0-9]+>/g, (match, iconName, props) => {
          return `<Icon name="${iconName}"${props}></Icon>`;
        });
      }
      
      // Write modified content back to file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  Updated: ${filePath}`);
    } else if (content.includes("import * as Icons from 'lucide-react'")) {
      console.log(`  File uses wildcard import of lucide-react: ${filePath}`);
      
      // Determine the relative path to the icon-strategy file
      let relativePath;
      const relativeToSrc = path.relative(path.dirname(filePath), path.resolve(__dirname, '../src/components/ui'));
      relativePath = relativeToSrc.replace(/\\/g, '/');
      if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
      }
      
      // Replace import
      content = content.replace(
        /import\s+\*\s+as\s+Icons\s+from\s+['"]lucide-react['"];?/,
        `import { Icon } from '${relativePath}/icon-strategy';`
      );
      
      // Replace usages
      content = content.replace(/<Icons\.([A-Za-z0-9]+)([^>]*)>/g, (match, iconName, props) => {
        return `<Icon name="${iconName}"${props}>`;
      });
      
      content = content.replace(/<Icons\.([A-Za-z0-9]+)([^>]*)><\/Icons\.[A-Za-z0-9]+>/g, (match, iconName, props) => {
        return `<Icon name="${iconName}"${props}></Icon>`;
      });
      
      // Write modified content back to file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  Updated: ${filePath}`);
    } else {
      console.log(`  No lucide imports found: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Find all React and TypeScript files
let allFiles = [];
sourceDirs.forEach(dir => {
  const files = glob.sync(`${dir}/**/*.{js,jsx,ts,tsx}`);
  allFiles = allFiles.concat(files);
});

console.log(`Found ${allFiles.length} files to process`);

// Process each file
allFiles.forEach(processFile);

console.log('Icon migration completed!');
