/**
 * Browserify Mocha Test configuration
 */
var root = window,
  mocha = root.mocha, // Off static include.
  chai = root.chai, // Off static include (TODO SWITCH TO BROWSERIFY?)
  $ = require("jquery");

// --------------------------------------------------------------------------
// Chai / Mocha configuration.
// --------------------------------------------------------------------------
root.expect = chai.expect;
// TODO SINON INTEGRATION

mocha.setup({
  ui: "bdd",
  bail: false
});

// --------------------------------------------------------------------------
// Test Bootstrap / Includes
// --------------------------------------------------------------------------
// Add DOM fixture.
$("<div id='fixtures' />")
  .css({ display: "none", visibility: "hidden" })
  .prependTo($("body"));

// The file `spec/deps.js` specifies all test dependencies.
require("./spec/deps");
$(function () {
  mocha.run();
});
