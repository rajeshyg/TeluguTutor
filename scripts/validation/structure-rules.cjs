/**
 * Structure Rules - Single Source of Truth
 *
 * Defines allowed file extensions per folder, canonical vocabulary,
 * and exception registry for TeluguTutor.
 *
 * Run: node scripts/validation/structure-rules.cjs
 */

const FOLDER_RULES = {
  'src/': {
    allowedExtensions: ['.ts', '.tsx', '.css'],
    forbiddenExtensions: ['.js', '.jsx', '.sql', '.html'],
    description: 'TypeScript source files only'
  },
  'src/components/': {
    allowedExtensions: ['.tsx', '.ts'],
    description: 'React components'
  },
  'src/pages/': {
    allowedExtensions: ['.tsx'],
    description: 'Page components'
  },
  'src/api/': {
    allowedExtensions: ['.ts', '.js'],
    description: 'API client modules'
  },
  'src/entities/': {
    allowedExtensions: ['.ts', '.js'],
    description: 'Entity/model definitions'
  },
  'src/data/': {
    allowedExtensions: ['.ts', '.js'],
    description: 'Data files'
  },
  'src/utils/': {
    allowedExtensions: ['.ts', '.js'],
    description: 'Utility functions'
  },
  'tests/': {
    allowedExtensions: ['.ts', '.tsx', '.spec.ts', '.spec.js'],
    description: 'Test files'
  },
  'scripts/': {
    allowedExtensions: ['.js', '.cjs', '.ts'],
    description: 'Utility scripts'
  },
  'docs/': {
    allowedExtensions: ['.md'],
    description: 'Documentation'
  }
};

const CANONICAL_VOCABULARY = {
  // Script naming prefixes
  'validate-': {
    meaning: 'Enforce rules, block on failure',
    location: 'scripts/validation/',
    replaces: ['check-', 'verify-']
  },
  'audit-': {
    meaning: 'Generate reports, non-blocking',
    location: 'scripts/validation/',
    replaces: ['scan-', 'analyze-', 'report-']
  }
};

const ROOT_ALLOWED_FILES = [
  'README.md',
  'CLAUDE.md',
  'FRAMEWORK_INTEGRATION_SUMMARY.md',
  'index.html',
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'playwright.config.cjs',
  '.env',
  '.env.local',
  '.env.example',
  '.gitignore'
];

const ROOT_ALLOWED_DIRS = [
  '.claude',
  '.git',
  'docs',
  'node_modules',
  'public',
  'scripts',
  'src',
  'tests',
  'dist'
];

// Export rules for use by validators
module.exports = {
  FOLDER_RULES,
  CANONICAL_VOCABULARY,
  ROOT_ALLOWED_FILES,
  ROOT_ALLOWED_DIRS
};

// If run directly, print summary
if (require.main === module) {
  console.log('=== TeluguTutor Structure Rules ===\n');
  console.log('FOLDER RULES:');
  Object.entries(FOLDER_RULES).forEach(([folder, rules]) => {
    console.log(`  ${folder}`);
    console.log(`    Extensions: ${rules.allowedExtensions.join(', ')}`);
    console.log(`    Purpose: ${rules.description}`);
  });

  console.log('\nRun validation with: node scripts/validation/validate-structure.cjs');
}
