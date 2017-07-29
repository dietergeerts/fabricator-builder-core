module.exports = function () {
    return {
        files: [
            {pattern: 'src/**/*.js'},
            {pattern: 'src/**/*.hbs', instrument: false},
            {pattern: 'src/**/*.test.js', ignore: true},
        ],
        tests: [
            {pattern: 'src/**/*.test.js'},
        ],
        testFramework: 'mocha',
        env: {
            type: 'node',
        },
    };
};
