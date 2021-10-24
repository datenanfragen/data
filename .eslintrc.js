module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'optimize-regex'],
    env: {
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:json/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:eslint-comments/recommended',
        'prettier',
    ],
    // TODO this is duplicated from datenanfragen/website
    rules: {
        'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
        'no-empty': ['error', { allowEmptyCatch: true }],
        'optimize-regex/optimize-regex': 'warn',
        'no-undef': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off', // TODO
    },
};
