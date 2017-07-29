const has = require('lodash/fp/has');
const forEach = require('lodash/fp/forEach');
const mergeAll = require('lodash/fp/mergeAll');

module.exports = function createOptions(defaults, options, requiredOptions) {

    forEach(option => {
        if (!has(option)(options)) {
            throw new Error(`The option '${option}' is required`);
        }
    })(requiredOptions || []);

    return mergeAll([{}, defaults, options]);
};
