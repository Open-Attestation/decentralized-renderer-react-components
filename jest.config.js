/** @type {import('ts-jest').JestConfigWithTsJest} */

const config = {
  verbose: true,
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
    "^.+\\.js?$": "babel-jest",
    "^.+\\.jsx?$": "babel-jest",
    "\\.(d\\.ts|[jt]sx?)$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!(uuid|@tradetrust-tt/tradetrust)/)"],
};

module.exports = config;
