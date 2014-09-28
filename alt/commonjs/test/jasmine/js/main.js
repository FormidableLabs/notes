/**
 * RequireJS Jasmine Test configuration
 */
var root = window,
  $ = require("jquery"),
  Backbone = require("backbone"),
  isKarma = !!root.__karma__;

// TODO(48): Needed for browserify. Check if can remove for webpack.
require("underscore");

// --------------------------------------------------------------------------
// Global configuration.
// --------------------------------------------------------------------------
// Exports
Backbone.$ = $;

// --------------------------------------------------------------------------
// Jasmine Browser configuration.
// --------------------------------------------------------------------------
if (!isKarma) {
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
}

// --------------------------------------------------------------------------
// Fixtures
// --------------------------------------------------------------------------
// Add DOM fixture.
$("<div id='fixtures' />")
  .css({ display: "none", visibility: "hidden" })
  .prependTo($("body"));

// --------------------------------------------------------------------------
// Bootstrap
// --------------------------------------------------------------------------
// Now add in the specs.
require("./spec/deps");

// Start tests.
if (!isKarma) {
  htmlReporter.initialize();
  env.execute();
}
