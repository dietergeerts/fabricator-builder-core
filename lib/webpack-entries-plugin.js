const Rx = require('rxjs');
const path = require('path');
const glob = require('glob');
const map = require('lodash/fp/map');
const flow = require('lodash/fp/flow');
const split = require('lodash/fp/split');
const flatten = require('lodash/fp/flatten');
const mapKeys = require('lodash/fp/mapKeys');
const replace = require('lodash/fp/replace');
const mapValues = require('lodash/fp/mapValues');
const fromPairs = require('lodash/fp/fromPairs');
const trimCharsStart = require('lodash/fp/trimCharsStart');


// TODO remove polyfill in nodejs4
var objectAssign = require('object-assign');

var Q = require('q');
var SingleEntryDependency = require('webpack/lib/dependencies/SingleEntryDependency');


function WebpackEntriesPlugin() {

}

WebpackEntriesPlugin.prototype.apply = function (compiler) {

    const entryGlobs = absoluteEntryGlobs(compiler.options.context, compiler.options.entry);

    delete compiler.options.entry; // Because we don't want 'main.[hash].js'!

    // ?
    compiler.plugin('compilation', function (compilation, params) {
        compilation.dependencyFactories.set(SingleEntryDependency, params.normalModuleFactory);
    });

    // ?
    compiler.plugin('watch-run', function (watching, callback) {
        // only if watching
        compiler.plugin('this-compilation', function (compilation) {
            // on the main compilation instance
            compilation.plugin('record', function () {
                // before almost all done, add entry to contextDependencies
                // so it would be watched
                Object.keys(compilation.foundentry).forEach(function (entry) {
                    compilation.contextDependencies.push(compilation.foundentry[entry]);
                });
            });
        });
        callback();
    });

    compiler.plugin('make', collectAndAddEntries(compiler.options.context, entryGlobs));
};

module.exports = WebpackEntriesPlugin;

/**
 * Create the absolute entry globs.
 *
 * @param {string} context - Absolute context path.
 * @param {string|string[]} entry - Entry glob(s).
 * @returns {string[]} Absolute entry globs.
 */
function absoluteEntryGlobs(context, entry) {

    return flow(
        flatten,                              // Make sure it's a string array.
        map(path.resolve.bind(null, context)) // Convert to absolute paths.
    )([entry]);
}

/**
 * Collect all entries defined by glob.
 *
 * @param {string} context - Absolute context path.
 * @param {string} pattern - Entry glob pattern.
 * @returns {Rx.Observable.<Object>} Object map with name/entry pairs.
 */
function collectEntries(context, pattern) {

    return Rx.Observable
        .bindNodeCallback(glob)(pattern)
        .map(map(trimCharsStart(replace('\\', '/')(context)))) // Remove context from path.
        .map(map(p => [p, p]))                                 // Convert to pairs.
        .map(fromPairs)                                        // Convert to object.
        .map(mapKeys(k => split('.')(k)[0]))                   // Remove '.js' from keys.
        .map(mapKeys(replace(new RegExp('/', 'g'), '.')))      // Have dot separated keys.
        .map(mapValues(v => `./${v}`));                        // Make paths relative.
}

/**
 * Creates 'make' compiler step to collect and add all entries.
 *
 * @param {string} context - Absolute context path.
 * @param {string[]} entryGlobs - Absolute entry globs.
 * @returns {function(*, *=)} Compiler make step.
 */
function collectAndAddEntries(context, entryGlobs) {

    return (compilation, callback) => {

        Q.all(entryGlobs
            .map(collectEntries.bind(null, context))
            .map(entrie$ => entrie$.toPromise())
        )
            .then(function (entryList) {
                compilation.foundentry = objectAssign.apply(null, entryList);
                return Object.keys(compilation.foundentry);
            })
            .invoke('map', function (entry) {
                var deferred = Q.defer();
                compilation.addEntry(
                    context,
                    new SingleEntryDependency(compilation.foundentry[entry]),
                    entry,
                    deferred.makeNodeResolver());
                return deferred.promise;
            })
            .all()
            .nodeify(callback);
    };
}
