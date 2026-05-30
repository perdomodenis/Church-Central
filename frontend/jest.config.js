// Sagt Jest wie die tests ausgeführt werden.
module.exports = {
  testEnvironment: 'jsdom',           // Simulates browser environment
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',  // Handle CSS imports in tests
  },
};