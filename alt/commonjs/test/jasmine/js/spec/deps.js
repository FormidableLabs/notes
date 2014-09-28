/**
 * Test dependencies.
 */
// App configuration.
var _ = require("underscore"),
  appConfig = require("app/config"),
  cfgId = !!window.__karma__ ? "karma" : "browser";

appConfig.storeName = "notes-cjs-wp-" + cfgId + "-jasmine";

// Use webpack to infer tests automatically.
var testsReq = require.context(".", true, /\.spec.js$/);

// Require collection module directly.
appConfig.useLocalStorage ?
  require("./collections/notes.spec") :
  require("./collections/notes-rest.spec");

// Automatically import the rest.
_.chain(testsReq.keys())
  .reject(function (mod) { return /collections\/notes/.test(mod); })
  .each(function (mod) {
    testsReq(mod);
  });
