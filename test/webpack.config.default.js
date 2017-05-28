const fabricatorBuilderWebpackConfigCreator = require('../index');
const path = require('path');

module.exports = [
    {devServer: {port: 3000}},
    fabricatorBuilderWebpackConfigCreator()
];
