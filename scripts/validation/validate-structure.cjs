/**
 * Structure Validation Script
 *
 * Validates project structure against rules defined in structure-rules.cjs
 * Run: node scripts/validation/validate-structure.cjs
 *
 * Exit codes:
 *   0 - All validations passed
 *   1 - Validation errors found
 */

const fs = require('fs');
const path = require('path');
const {
  FOLDER_RULES,
  ROOT_ALLOWED_FILES,
  ROOT_ALLOWED_DIRS
} = require('./structure-rules.cjs');

const projectRoot = path.resolve(__dirname, '../..');
let errors = [];
let warnings = [];

/**
 * Get all files recursively in a directory
 */
function getFilesRecursively(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .git
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        getFilesRecursively(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Validate file extensions per folder rules
 */
function validateFolderExtensions() {
  console.log('\n📁 Validating folder extension rules...');
  Object.entries(FOLDER_RULES).forEach(([folder, rules]) => {
    const fullPath = path.join(projectRoot, folder);
    if (!fs.existsSync(fullPath)) {
      warnings.push(`Folder not found: ${folder}`);
      return;
    }

    const files = getFilesRecursively(fullPath);
    files.forEach(file => {
      const ext = path.extname(file);
      const relativePath = path.relative(projectRoot, file);

      // Check forbidden extensions
      if (rules.forbiddenExtensions && rules.forbiddenExtensions.includes(ext)) {
        errors.push(`Forbidden extension ${ext} in ${relativePath} (${rules.description})`);
      }

      // Check allowed extensions (if specified)
      if (rules.allowedExtensions && !rules.allowedExtensions.includes(ext)) {
        // Skip index.ts files that export from components
        if (ext === '.ts' && file.endsWith('index.ts')) {
          return; // Allow index.ts barrel exports
        }
        warnings.push(`Unexpected extension ${ext} in ${relativePath} (expected: ${rules.allowedExtensions.join(', ')})`);
      }
    });
  });
}

/**
 * Validate root directory contents
 */
function validateRootFiles() {
  console.log('\n📂 Validating root directory...');
  const rootContents = fs.readdirSync(projectRoot);

  rootContents.forEach(item => {
    const itemPath = path.join(projectRoot, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      if (!ROOT_ALLOWED_DIRS.includes(item) && !item.startsWith('.')) {
        errors.push(`Unexpected directory in root: ${item}`);
      }
    } else {
      // Check if file is allowed or matches a pattern
      const isAllowed = ROOT_ALLOWED_FILES.includes(item) ||
                       item.startsWith('.') ||
                       item.endsWith('.md') ||
                       item.endsWith('.ps1') ||
                       item.endsWith('.sh') ||
                       item.endsWith('.cjs') ||
                       item.endsWith('.txt');

      if (!isAllowed) {
        warnings.push(`Unexpected file in root: ${item}`);
      }
    }
  });
}

/**
 * Print results and exit
 */
function printResults() {
  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(60));

  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach(w => console.log(`   - ${w}`));
  }

  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):`);
    errors.forEach(e => console.log(`   - ${e}`));
    console.log('\n❌ Validation FAILED');
    process.exit(1);
  }

  console.log('\n✅ Validation PASSED');
  if (warnings.length > 0) {
    console.log(`   (${warnings.length} warnings - consider addressing these)`);
  }
  process.exit(0);
}

// Run validations
console.log('🔍 TeluguTutor Structure Validation');
console.log('='.repeat(60));

validateRootFiles();
validateFolderExtensions();
printResults();
