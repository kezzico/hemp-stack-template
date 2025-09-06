module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['<rootDir>/tests/**/*.test.js', '<rootDir>/tests/**/*.tests.js'],
  testTimeout: 10000,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  
  silent: false,
  verbose: true
};
