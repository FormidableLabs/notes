/**
 * Test dependencies.
 *
 * This file lists out all of the individual spec (test) files so that they
 * are run by our infrastructure.
 */
// App configuration.
var appConfig = require("../../../../app/js/app/config"),
  cfgId = !!window.__karma__ ? "karma" : "browser";

appConfig.storeName = "notes-browserify-" + cfgId + "-mocha";

// Require each module directly.
require("./hello.spec");
