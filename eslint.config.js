const {
    defineConfig, globalIgnores
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const optimizeRegex = require("eslint-plugin-optimize-regex");
const globals = require("globals");

const {
    fixupConfigRules,
} = require("@eslint/compat");

const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});



module.exports = defineConfig([{
    languageOptions: {
        parser: tsParser,

        globals: {
            ...globals.node,
        },
    },

    plugins: {
        "@typescript-eslint": typescriptEslint,
        "optimize-regex": optimizeRegex,
    },

    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:json/recommended-legacy",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:eslint-comments/recommended",
        "prettier",
    )),

    rules: {
        "no-unused-vars": ["warn", {
            args: "none",
            caughtErrors: "none",
        }],

        "no-empty": ["error", {
            allowEmptyCatch: true,
        }],

        "optimize-regex/optimize-regex": "warn",
        "no-undef": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
    },
}, globalIgnores(["src/types/AuthorityRecord.ts",
    "src/types/CompanyRecord.ts",
    "src/types/CompanyPack.ts",
    "src/types/ObsoleteRecord.ts"])]);
