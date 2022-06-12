module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  overrides: [
    {
      files: ["./integration/**/*.ts", "./e2e/**/*.ts"],
      rules: {
        "jest/valid-expect": 0,
        "@typescript-eslint/no-unused-expressions": 0,
        "jest/valid-expect-in-promise": 0,
      },
    },
  ],
};
