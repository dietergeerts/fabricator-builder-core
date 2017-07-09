const mergeAll = require('lodash/fp/mergeAll');
const has = require('lodash/fp/has');

module.exports = function createOptions(defaults, options, requiredOptions) {

    (requiredOptions || []).forEach(option => {
        if (!has(option)(options)) {
            throw new Error(`The option '${option}' is required`);
        }
    });

    return mergeAll([{}, defaults, options]);
};
