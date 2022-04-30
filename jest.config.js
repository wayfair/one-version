module.exports =
  (resolve) =>
  ({ additionalIgnorePatterns = [] } = {}) => ({
    testPathIgnorePatterns: ["/node_modules/", ...additionalIgnorePatterns],
    testResultsProcessor: "jest-sonar-reporter",
    resetModules: true,
  });
