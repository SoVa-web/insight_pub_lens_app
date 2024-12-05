module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "env": {
      "node": true,
      "es6": true
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'warn', 
      'import/no-unresolved': 'off', 
      'no-console': 'warn', 
    },
  };