/**
 * RequireJS Jasmine Test configuration
 */
(function () {
  var root = this,
    karma = root.__karma__,
    specs = [];

  // --------------------------------------------------------------------------
  // Test Includes
  // --------------------------------------------------------------------------
  // Infer from Karma itself (need to already be loaded).
  for (var file in karma.files) {
    if (karma.files.hasOwnProperty(file)) {
      if (/\.spec\.js$/.test(file)) {
        specs.push(file);
      }
    }
  }

  // --------------------------------------------------------------------------
  // RequireJS configuration.
  // --------------------------------------------------------------------------
  require.config({
    baseUrl: "/base/app/js/vendor",
    paths: {
      spec: "../../../test/jasmine/js/spec"
    },
    // Add specs as straight dependencies.
    deps: specs,
    callback: karma.start
  });
}());
