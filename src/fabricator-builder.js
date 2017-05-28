const assign = require('lodash/assign');
const Rx = require('rxjs/Rx');

module.exports = function render(locals) {

    const BASE_URL = `${'../'.repeat(locals.path.split('/').length - 1)}`;

    return locals.faviconsManifestRx.first()
        .map((faviconsManifest) => {

            const FAVICON_HTML = faviconsManifest && faviconsManifest.html.join('\n') || '';

            return require('./layouts/default.hbs')({
                BASE_URL: BASE_URL,
                FAVICON_HTML: FAVICON_HTML.replace(/href="/g, `href="${BASE_URL}`),
                FABRICATOR_SCRIPT: locals.assets.fabricator,
                FABRICATOR_STYLES: locals.assets.fabricator.slice(0, -2) + 'css',
                VIEW: '<h1>TOOLKIT PAGE</h1>'
            });
        })
        .toPromise();
};
