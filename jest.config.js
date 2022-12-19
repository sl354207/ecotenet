const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/components/$1",
    "^@data/(.*)$": "<rootDir>/data/$1",
    "^@utils/(.*)$": "<rootDir>/utils/$1",
    "^@styles/(.*)$": "<rootDir>/styles/$1",
    "^@plugins/(.*)$": "<rootDir>/plugins/$1",
    "^@schema/(.*)$": "<rootDir>/schema/$1",
    "^@pages/(.*)$": "<rootDir>/pages/$1",
  },
  // COMMENT OUT NEXT TWO LINES WHEN RUNNING NON MONGODB TESTS
  // preset: "@shelf/jest-mongodb",
  // watchPathIgnorePatterns: ["globalConfig"],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],

  // UNCOMMENT WHEN RUNNING NON MONGODB TESTS
  testEnvironment: "jest-environment-jsdom",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
