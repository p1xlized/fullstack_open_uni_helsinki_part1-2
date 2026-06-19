import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["frontend/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-console": "off", // console.log to log the backend
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
