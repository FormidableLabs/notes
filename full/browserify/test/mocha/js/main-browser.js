/**
 * Browserify Mocha Test configuration
 */
/* global sinon:true */
var root = window,
  mocha = root.mocha, // Off static include.
  appConfig = require("../../../app/js/app/config"),
  karma = root.__karma__;

// Configuration.
appConfig.storeName = "notes-browserify-karma-mocha";

// Base test setup.
require("./main");

// The file `spec/deps.js` specifies all test dependencies.
require("./spec/deps");
mocha.run();
