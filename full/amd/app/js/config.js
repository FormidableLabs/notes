/**
 * RequireJS configuration
 */
(function () {
  require.config({
    // The root from which RJS will *start* looking for paths.
    // This is relative to the loading HTML page, which for our SPA is:
    // "full/amd/app/".
    //
    // See: http://requirejs.org/docs/api.html#config-baseUrl
    baseUrl: "js",

    // Shims: Bridge non-AMD libraries to AMD by specifying deps and exports.
    // - `deps`: Array of RJS names of libraries that are depended on.
    // - `exports`: String name of `window.NAME` variable to export.
    //
    // See: http://requirejs.org/docs/api.html#config-shim
    shim: {
      "jquery": {
        exports: "$"
      }
    },

    // Map: Add alias for one module to another.
    //
    // See: http://requirejs.org/docs/api.html#config-map
    map: {
      // For all modules and code, alias `underscore` to `lodash`.
      "*": {
        "underscore": "lodash"
      }
    },

    // Paths: Prefixes / full paths to find libraries.
    //
    // See: http://requirejs.org/docs/api.html#config-paths
    paths: {
      // Vendor libraries.
      "jquery": "vendor/jquery",
      "lodash": "vendor/lodash.underscore",
      "backbone": "vendor/backbone",

      // Application libraries.
      // Set up "app/" as base application prefix.
      "app": "app"
    }
  });
}());
