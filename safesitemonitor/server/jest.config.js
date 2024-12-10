module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest" // Ensure Babel is used for JavaScript/React files
    },
    testEnvironment: "node" // Use Node environment for server tests
  };
  