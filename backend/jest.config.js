// Jest configuration for backend Node.js tests
module.exports = {
  testEnvironment: 'node',           // Use Node.js environment
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'                 // Exclude main entry point
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};