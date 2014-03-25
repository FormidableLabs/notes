/**
 * RequireJS Jasmine Test configuration
 */
(function () {
  var root = this;

  // --------------------------------------------------------------------------
  // RequireJS configuration.
  // --------------------------------------------------------------------------
  require.config({
    baseUrl: "../../app/js/vendor",
    paths: {
      spec: "../../../test/jasmine/js/spec"
    }
  });

  // --------------------------------------------------------------------------
  // Test Includes
  // --------------------------------------------------------------------------
  require([
    "spec/collections/notes.spec"
  ], function (spec) {
    // Start tests.
    root.jHtmlReporter.initialize();
    root.jEnv.execute();
  });
}());
