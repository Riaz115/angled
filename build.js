import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix duplicate display properties
function fixDuplicateDisplay(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace duplicate display properties
    content = content.replace(
      /display:\s*"block",\s*display:\s*"-webkit-box"/g,
      'display: "-webkit-box"'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed duplicate display in ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
  }
}

// Files to fix
const filesToFix = [
  'src/pages/Employer/EmployerJob/EmployerJobs.jsx',
  'src/pages/Admin/AdminJob/AdminJobs.jsx'
];

// Fix each file
filesToFix.forEach(fixDuplicateDisplay);

console.log('Build process completed!'); 