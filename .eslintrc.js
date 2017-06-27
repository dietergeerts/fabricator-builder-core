module.exports = {
    'root': true,
    'env': {
        'es6': true,
    },
    'plugins': [
        'filenames',
        'fp',
        'lodash-fp',
        'no-use-extend-native',
        'optimize-regex',
        'unicorn',
    ],
    'extends': [
        'eslint:recommended',
        'plugin:fp/recommended',
        'plugin:lodash-fp/recommended',
        'plugin:unicorn/recommended',
    ],
    'rules': {
        'no-use-extend-native/no-use-extend-native': 2,
        'optimize-regex/optimize-regex': 1,
    },
    'overrides': [
        {
            'files': ['./src/**/*.js'],
            'rules': {
                'filenames/no-index': 2,
            },
        },
        {
            'files': ['./src/**/*.js'],
            'excludedFiles': './src/**/*.test.js',
            'rules': {
                'filenames/match-exported': [2, 'kebab'],
            },
        },
        {
            'files': ['./src/**/*.test.js'],
            'env': {
                'mocha': true,
            },
            'plugins': [
                'chai-expect',
                'mocha',
            ],
            'rules': {
                'chai-expect/missing-assertion': 2,
                'chai-expect/no-inner-compare': 2,
                'chai-expect/terminating-properties': 1,
                'filenames/match-regex': [2, '^.+\.test\.js$'],
                'mocha/no-exclusive-tests': 2,
            },
        },
        {
            'files': ['./src/fabricator/**/*.js'],
            'env': {
                'browser': true,
            },
        },
        {
            'files': ['./src/fabricator-builder/**/*.js', './*.js'],
            'env': {
                'node': true,
            },
        },
    ],
};
