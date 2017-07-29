require('babel-register');

const path = require('path');
const assembler = require('./src/fabricator-builder/assembler');

assembler.run({
    dist: path.resolve(__dirname, 'dist'),
});
