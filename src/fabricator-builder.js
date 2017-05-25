const assign = require('lodash/assign');
const Rx = require('rxjs/Rx');

module.exports = function fabricatorBuilderRendererCreator(options) {

    options = assign({}, options);

    return function render(locals) {
        return locals.faviconsManifestRx.first()
            .map((faviconsManifest) => `<h1>TOOLKIT PAGE</h1>${faviconsManifest.html.join('\n')}`)
            .toPromise();
    };
};