/**
 * Base/Karma Mocha Test configuration
 */
/* global sinon:true */
var root = window,
  mocha = root.mocha, // Off static include.
  chai = require("chai"),
  sinon = require("sinon"),
  sinonChai = require("sinon-chai"),
  $ = require("jquery"),
  appConfig = require("../../../app/js/app/config"),
  isKarma = !!root.__karma__,
  cfgId = isKarma ? "karma" : "browser";

// --------------------------------------------------------------------------
// Chai / Sinon / Mocha configuration.
// --------------------------------------------------------------------------
// Exports
root.expect = chai.expect;
root.sinon = sinon;

// Plugins
chai.use(sinonChai);

// Mocha
mocha.setup({
  ui: "bdd",
  bail: false
});

// --------------------------------------------------------------------------
// App configuration.
// --------------------------------------------------------------------------
appConfig.storeName = "notes-browserify-" + cfgId + "-mocha";

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

// Only start mocha in browser.
if (!isKarma) {
  mocha.run();
}
