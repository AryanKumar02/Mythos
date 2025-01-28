export default {
  testEnvironment: 'node', // Use Node.js environment
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Use Babel for ES6+ transformations
  },
  setupFiles: ['dotenv/config'], // Load .env file before running tests
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'], // Initialize in-memory MongoDB
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'], // File extensions for modules
  moduleDirectories: ['node_modules', '<rootDir>/backend'], // Directories to search for modules
  collectCoverage: true, // Enable coverage collection
  coverageDirectory: 'coverage', // Directory to output coverage reports
  coverageReporters: ['text', 'lcov'], // Formats of coverage reports
  verbose: true, // Display individual test results with the test suite hierarchy
}
