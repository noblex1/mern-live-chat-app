module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  globals: {
    // Zustand store parameters
    get: 'readonly',
    set: 'readonly',
    // Other common globals
    process: 'readonly',
    Buffer: 'readonly'
  },
  rules: {
    // Allow unused variables in function parameters (common in Zustand)
    'no-unused-vars': ['error', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
      'ignoreRestSiblings': true 
    }],
    // Allow console.log in development
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}; 