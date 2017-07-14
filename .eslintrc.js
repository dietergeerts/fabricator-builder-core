module.exports = {
    root: true,
    env: {es6: true},
    plugins: [
        'filenames',
        'fp',
        'lodash-fp',
        'no-use-extend-native',
        'unicorn',
    ],
    extends: [
        'eslint:recommended',
        'plugin:fp/recommended',
        'plugin:lodash-fp/recommended',
        'plugin:unicorn/recommended',
    ],
    rules: {
        'comma-dangle': ["error", "always-multiline"],
        'filenames/match-regex': [2, '^[a-z-\.]+$'],
        'fp/no-nil': 0,
        'fp/no-throw': 0,
        'fp/no-unused-expression': 0,
        'no-use-extend-native/no-use-extend-native': 2,
        'unicorn/explicit-length-check': 0,
    },
    overrides: [
        {
            files: ['src/**/*.js'],
            excludedFiles: 'src/**/*.test.js',
        },
        {
            files: ['src/**/*.test.js'],
            env: {mocha: true},
            plugins: [
                'chai-expect',
                'mocha',
            ],
            rules: {
                'chai-expect/missing-assertion': 2,
                'chai-expect/no-inner-compare': 2,
                'chai-expect/terminating-properties': 1,
                'mocha/no-exclusive-tests': 2,
            },
        },
        {
            files: ['src/fabricator/**/*.js'],
            env: {browser: true},
        },
        {
            files: ['src/fabricator-builder/**/*.js', '*.js'],
            env: {node: true},
            rules: {
                'fp/no-mutation': ['error', {'commonjs': true}],
            }
        },
    ],
};
