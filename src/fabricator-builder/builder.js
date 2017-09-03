// require('babel-register');

// const Rx = require('rxjs/Rx');
// const noop = require('lodash/fp/noop');
// const requireGlob = require('require-glob');
//
// Rx.Observable
//     .fromPromise(requireGlob('./../../test/materials/**/*.js'))
//     .subscribe(console.log, console.log, noop);

const path = require('path');
const glob_entries = require('webpack-glob-entries');
const GlobEntryPlugin = require('glob-entry-webpack-plugin');
const entry = require('webpack-glob-entry');

const WebpackEntriesPlugin = require('./../../lib/webpack-entries-plugin');

module.exports = {
    context: path.resolve(__dirname, './../../test'),
    entry: './materials/**/*.js',
    // entry: entry(path.resolve(__dirname, './../../test') + '/materials/**/*.js'),
    // entry: {test: './materials/atoms/button.js'}, // glob_entries(path.resolve(__dirname, './../../test') + '/materials/**/*.js'),
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../../dist/assets'),
        publicPath: 'assets',
    },
    devServer: {port: 3000},
    plugins: [
        new WebpackEntriesPlugin(),
    //     new GlobEntryPlugin('./materials/**/*.js'),
    ],
};
