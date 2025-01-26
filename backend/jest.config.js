export default {
  testEnvironment: 'node', // Use Node.js environment
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Use Babel for ES6+ transformations
  },
  setupFiles: ['dotenv/config'], // Load .env file before running tests
}
