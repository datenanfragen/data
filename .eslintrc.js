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
        'optimize-regex/optimize-regex': 'warn',
    },
};
