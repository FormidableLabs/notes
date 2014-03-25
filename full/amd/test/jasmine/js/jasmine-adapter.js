/**
 * Jasmine Test Adapter
 *
 * Sets up both HTML and Karma.
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
  root.jEnv = jasmine.getEnv();
  root.jHtmlReporter = null;

  // Simple function proxy and binding.
  var _proxy = function (obj, name) {
    return function () {
      return obj[name].apply(obj, arguments);
    };
  };

  // Patch global (`window`) with BDD interface.
  root.describe   = _proxy(root.jEnv, "describe");
  root.xdescribe  = _proxy(root.jEnv, "xdescribe");
  root.it         = _proxy(root.jEnv, "it");
  root.xit        = _proxy(root.jEnv, "xit");
  root.beforeEach = _proxy(root.jEnv, "beforeEach");
  root.afterEach  = _proxy(root.jEnv, "afterEach");
  root.expect     = _proxy(root.jEnv, "expect");

  // Reporter: HTML
  if (jasReq.html) {
    jasReq.html(jasmine);

    // Set up the HTML reporter.
    root.jHtmlReporter = new jasmine.HtmlReporter({
      env:            root.jEnv,
      getContainer:   function () { return document.body; },
      createElement:  _proxy(document, "createElement"),
      createTextNode: _proxy(document, "createTextNode"),
      timer:          new jasmine.Timer()
    });

    root.jEnv.addReporter(root.jHtmlReporter);
  }

  // API reporter for other tool integration.
  root.jEnv.addReporter(new jasmine.JsApiReporter({
    timer: new jasmine.Timer()
  }));
}());
