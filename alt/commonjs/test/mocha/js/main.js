/**
 * Base/Karma Mocha Test configuration
 */
/* global sinon:true */
var root = window,
  mocha = root.mocha, // Off static include.
  chai = require("chai"),
  sinon = root.sinon, // Off static include.
  sinonChai = require("sinon-chai"),
  $ = require("jquery"),
  Backbone = require("backbone"),
  isKarma = !!root.__karma__;

// TODO(48): Needed for browserify. Check if can remove for webpack.
require("underscore");

// --------------------------------------------------------------------------
// Chai / Sinon / Mocha configuration.
// --------------------------------------------------------------------------
// Exports
root.expect = chai.expect;
Backbone.$ = $;

// Plugins
chai.use(sinonChai);

// Mocha
mocha.setup({
  ui: "bdd",
  bail: false
});

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
