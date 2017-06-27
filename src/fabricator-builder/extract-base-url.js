module.exports = function extractBaseUrl(path) {

    return `./${'../'.repeat(path     // Start in the current folder, adding 'up' for each sub-folder.
        .replace(/[^/]+?.html$/g, '') // We're only interested in the folder structure, not files within!
        .split('/')                   // Split out the folders, so we can check it's length.
        .filter(Boolean)              // But only keep the actual folders in mind (as how split works...)
        .length)}`;                   // Get the actual folder count, for moving that count up.
};
