import '@testing-library/jest-dom';

// Mock de localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Suprimir advertencias de console
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
