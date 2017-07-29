const size = require('lodash/fp/size');
const flow = require('lodash/fp/flow');
const split = require('lodash/fp/split');
const repeat = require('lodash/fp/repeat');
const compact = require('lodash/fp/compact');

/**
 * Calculate the base directory relative to the output path.
 * @param {{publicPath: string}} output - Webpack output options
 * @returns {string} Relative base dir path
 */
function getBaseDir(output) {

    return flow(
        split('/'),                            // Split out directories
        compact,                               // Remove empty parts
        size,                                  // Get go-up count
        repeat.convert({rearg: false})('../')  // Combine to relative path
    )(output.publicPath);
}

/**
 * Adds the asset to the webpack compilation assets.
 * @param {{assets: {}.<string, {source: string, size: number}>}} compilation - Webpack compilation object
 * @param {string} filename - The full filename for the asset
 * @param {string} content - The file content to store
 */
function addAsset(compilation, filename, content) {

    compilation.assets[filename] = {source: () => content, size: () => size(content)};
}

module.exports = {
    getBaseDir,
    addAsset,
};
