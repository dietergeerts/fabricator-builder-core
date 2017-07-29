// TODO: Extract this to a separate project, so it can be used by many!
// Taken from https://gist.github.com/just-boris/ea02ff33b09d6ce3b492, so make sure to give special thx later!

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars/dist/cjs/handlebars');

// configuration the same as webpack handlebars-loader has
const config = {
    helperDirs: [
        path.resolve(__dirname, '../src/helpers'),
        path.resolve(__dirname, '../src/blocks')
    ]
};

// if you are using `runtime` in your helpers, they should get the same Handlebars instance
require.cache[require.resolve('handlebars/runtime')] = {exports: Handlebars};

// load helpers library, see https://github.com/helpers/handlebars-helpers
require('handlebars-helpers')();

// load helpers
Handlebars.registerHelper('helperMissing', function() {
    if(arguments.length === 1) {
        return;
    }
    const options = Array.from(arguments).pop();
    const helper = config.helperDirs.reduce(function(helper, dir) {
        return helper || require(path.join(dir, options.name));
    }, null);
    return helper.apply(this, arguments);
});

// there is no `partialMissing` thing, so we need to patch this method
const resolvePartial = Handlebars.VM.resolvePartial;
function patchResolvePartial(filename) {
    return function(partial, content, options) {
        if(!partial) {
            partial = require(path.resolve(path.dirname(filename), options.name) + '.hbs');
        }
        return resolvePartial.call(this, partial, content, options);
    };
}

//install require hook
require.extensions['.hbs'] = function(module, filename) {
    Handlebars.VM.resolvePartial = patchResolvePartial(filename);
    const templateString = fs.readFileSync(filename, 'utf8');
    module.exports = Handlebars.compile(templateString);
};
