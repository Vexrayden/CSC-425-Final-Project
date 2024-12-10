module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transpile .js and .jsx files with Babel
  },
  testEnvironment: 'jest-environment-jsdom', // Use jsdom environment for React tests
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // Setup file (adjust the path if necessary)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Example alias (adjust based on your project structure)
    '\\.css$': 'identity-obj-proxy'
  },
  moduleDirectories: ['node_modules', 'src'], // This allows you to import files from the 'src' folder without relative paths
};

  