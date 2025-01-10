module.exports = {
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/extensions': ['error', 'always', {
      ts: 'never',  // Allow importing .ts files without specifying extensions
    }],
    'import/no-unresolved': ['error', { ignore: ['\\.ts$'] }],  // Ignore unresolved imports for .ts files
    '@typescript-eslint/explicit-module-boundary-types': 'off',  // Optional: turn off this rule if you don't want explicit types on exported functions
    'import/prefer-default-export': 'off', // Disable for the whole project
    'import/order': ['error', {
      'groups': [
        // Group 1: Node.js modules
        ['builtin', 'external'],

        // Group 2: Internal or local imports
        ['internal', 'parent', 'sibling'],

        // Group 3: Side-effect imports (e.g., stylesheets)
        'index',
      ],
      'pathGroups': [
        {
          pattern: '**/*.ts',
          group: 'internal',  // Treat TypeScript files as internal imports
          position: 'before',
        },
      ],
      'alphabetize': {
        'order': 'asc',  // Optional: Alphabetize the imports
        'caseInsensitive': true,
      },
    }],
  },
};
