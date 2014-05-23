/**
 * RequireJS Jasmine Test configuration
 */
(function () {
  var root = this;

  // --------------------------------------------------------------------------
  // Jasmine configuration.
  // --------------------------------------------------------------------------
  // Modified from http://jasmine.github.io/2.0/boot.html to work with AMD.
  // Start with Jasmine.
  var jasReq = root.jasmineRequire;
  var jasmine = jasReq.core(jasReq);
  var env = jasmine.getEnv();

  // Simple function proxy and binding.
  var _proxy = function (obj, name) {
    return function () {
      return obj[name].apply(obj, arguments);
    };
  };

  // Patch global (`window`) with BDD interface.
  root.describe   = _proxy(env, "describe");
  root.xdescribe  = _proxy(env, "xdescribe");
  root.it         = _proxy(env, "it");
  root.xit        = _proxy(env, "xit");
  root.beforeEach = _proxy(env, "beforeEach");
  root.afterEach  = _proxy(env, "afterEach");
  root.expect     = _proxy(env, "expect");

  // Reporter: HTML
  jasReq.html(jasmine);

  // Add support for custom filtering.
  // E.g., /test/jasmine/test.html?spec=app%2Fmodels%2Fnote
  // in the browser.
  var queryString = new jasmine.QueryString({
    getWindowLocation: function () { return root.location; }
  });
  var specFilter = new jasmine.HtmlSpecFilter({
    filterString: function () { return queryString.getParam("spec"); }
  });
  env.specFilter = function (spec) {
    return specFilter.matches(spec.getFullName());
  };

  // Set up the HTML reporter.
  var htmlReporter = new jasmine.HtmlReporter({
    env:            env,
    queryString:    queryString,
    getContainer:   function () { return document.body; },
    createElement:  _proxy(document, "createElement"),
    createTextNode: _proxy(document, "createTextNode"),
    timer:          new jasmine.Timer()
  });

  env.addReporter(htmlReporter);

  // --------------------------------------------------------------------------
  // RequireJS configuration.
  // --------------------------------------------------------------------------
  // Test-only configuration.
  define("app/config", {
    storeName: "notes-amd-browser-jasmine"
  });

  require.config({
    baseUrl: "../../app/js/vendor",
    paths: {
      spec: "../../../test/jasmine/js/spec"
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
      // Start tests.
      htmlReporter.initialize();
      env.execute();
    });
  });
}());
