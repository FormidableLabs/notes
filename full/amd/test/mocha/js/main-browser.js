/**
 * RequireJS Mocha Test configuration
 */
(function () {
  var root = this,
    chai = root.chai,
    mocha = root.mocha;

  // --------------------------------------------------------------------------
  // Chai / Mocha configuration.
  // --------------------------------------------------------------------------
  root.expect = chai.expect;

  mocha.setup({
    ui: "bdd",
    bail: false
  });

  // --------------------------------------------------------------------------
  // RequireJS configuration.
  // --------------------------------------------------------------------------
  // Test-only configuration.
  define("app/config", {
    storeName: "notes-amd-browser-mocha"
  });

  require.config({
    baseUrl: "../../app/js/vendor",
    paths: {
      spec: "../../../test/mocha/js/spec"
    }
  });

  // --------------------------------------------------------------------------
  // Test Bootstrap / Includes
  // --------------------------------------------------------------------------
  require(["jquery"], function ($) {
    // Add DOM fixture.
    $("<div id='fixtures' />")
      .css({ display: "none", visibility: "hidden" })
      .prependTo($("body"));

    // The file `spec/deps.js` specifies all test dependencies.
    require(["spec/deps"], function () {
      mocha.run();
    });
  });
}());
