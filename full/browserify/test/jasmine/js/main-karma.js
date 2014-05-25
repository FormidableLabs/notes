/**
 * RequireJS Jasmine Test configuration
 *
 * See: http://karma-runner.github.io/0.8/plus/RequireJS.html
 */
(function () {
  var root = this,
    karma = root.__karma__;

  // --------------------------------------------------------------------------
  // Test Includes
  // --------------------------------------------------------------------------
  // NOTE: Alternate way of getting test specs is to **automatically** infer
  // them from the file system. You can uncomment the code below...
  //
  // // Infer from Karma itself (need to already be loaded).
  // var specs = [];
  // for (var file in karma.files) {
  //   if (karma.files.hasOwnProperty(file)) {
  //     if (/\.spec\.js$/.test(file)) {
  //       specs.push(file);
  //     }
  //   }
  // }
  //
  // ... and then switch to `deps: specs,` in `require.config()` below.
  //
  // We currently **don't** do this because the browser tests need an already
  // defined list, so we share that with the automated tests.

  // --------------------------------------------------------------------------
  // RequireJS configuration.
  // --------------------------------------------------------------------------
  // Test-only configuration.
  define("app/config", {
    storeName: "notes-amd-karma-jasmine"
  });

  require.config({
    baseUrl: "/base/app/js/vendor",
    paths: {
      spec: "../../../test/jasmine/js/spec"
    }
  });

  require(["jquery"], function ($) {
    // Add DOM fixture.
    $("<div id='fixtures' />")
      .css({ display: "none", visibility: "hidden" })
      .prependTo($("body"));

    // Load `spec/deps.js` dependencies, then start Karma.
    require(["spec/deps"], karma.start);
  });
}());
