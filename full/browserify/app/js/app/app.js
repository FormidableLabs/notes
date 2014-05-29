/**
 * Application bootstrap.
 */
var $ = require("jquery"),
  Backbone = require("backbone");

// TODO: Need actual dep for $ for Backbone.
Backbone.$ = $;

var NotesCollection = require("./collections/notes"),
  Router = require("./routers/router");

$(function () {
  // Initialize application components.
  // The collection object comes first as views depend on it.
  var collection = NotesCollection.getInstance();

  // Router has bootstraps necessary views.
  var router = new Router();

  // Wait until we have our initial collection from the backing
  // store before firing up the router.
  collection.once("reset", function () {
    Backbone.history.start();
  });

  // Now fetch collection data, kicking off everything.
  collection.fetch({ reset: true });
});
