module.exports = {
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    uuid: require.resolve("uuid"), // FIXME: Somehow required after jest is upgraded
  },
};
