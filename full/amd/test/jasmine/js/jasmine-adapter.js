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
  root.jasmine = jasReq.core(jasReq);
  var env = root.jasmine.getEnv();

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

  // API reporter for other tool integration.
  env.addReporter(new root.jasmine.JsApiReporter({
    timer: new root.jasmine.Timer()
  }));
}());
