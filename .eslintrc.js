module.exports = {
    parser: 'babel-eslint',
    env: {
        es6: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:json/recommended'],
    plugins: ['optimize-regex'],
    // TODO this is duplicated from datenanfragen/website
    rules: {
        'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
        'no-empty': ['error', { allowEmptyCatch: true }],
        // Re-enable the `no-console` rule which gets disabled by the Node env.
        'no-console': 'error',

        'optimize-regex/optimize-regex': 'warn',
    },
};
