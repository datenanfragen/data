module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
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
    plugins: ['optimize-regex'],
    // TODO this is duplicated from datenanfragen/website
    rules: {
        'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
        'no-empty': ['error', { allowEmptyCatch: true }],
        'optimize-regex/optimize-regex': 'warn',
        'no-undef': 'off',
        'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
        '@typescript-eslint/no-non-null-assertion': 'off',
    },
};
