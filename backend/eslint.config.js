import tseslint from "typescript-eslint";

export default tseslint.config(tseslint.configs.recommended, {
  files: ["**/*.ts"],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/await-thenable": "error",
  },
});
