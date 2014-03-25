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
  // Jasmine HTML Reporter
  // --------------------------------------------------------------------------
  var jasReq = root.jasmineRequire;
  var env = root.jasmine.getEnv();

  // Simple function proxy and binding.
  var _proxy = function (obj, name) {
    return function () {
      return obj[name].apply(obj, arguments);
    };
  };

  // Reporter: HTML
  jasReq.html(root.jasmine);

  // Set up the HTML reporter.
  var htmlReporter = new root.jasmine.HtmlReporter({
    env:            env,
    getContainer:   function () { return document.body; },
    createElement:  _proxy(document, "createElement"),
    createTextNode: _proxy(document, "createTextNode"),
    timer:          new root.jasmine.Timer()
  });

  env.addReporter(htmlReporter);

  // --------------------------------------------------------------------------
  // Test Includes
  // --------------------------------------------------------------------------
  require([
    "spec/collections/notes.spec"
  ], function (spec) {
    // Start tests.
    htmlReporter.initialize();
    env.execute();
  });
}());
