const globals = require("globals");
const pluginJs = require("@eslint/js");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } }, // Use `globals.node` for Node.js
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
    },
  },
];
