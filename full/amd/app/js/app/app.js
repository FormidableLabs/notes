define([
  "jquery",
  "backbone",
  "app/collections/notes",
  "app/views/notes",
  "app/views/note-nav",
  "app/routers/router",

  // Polyfill JSON for old browsers.
  "json2"
], function (
  $,
  Backbone,
  NotesCollection,
  NotesView,
  NoteNavView,
  Router
) {
  "use strict";

  $(function () {
    // Initialize application components.
    // The collection object comes first as views depend on it.
    var collection = new NotesCollection();

    // Router has bootstraps necessary views.
    var router = new Router({
      collection: collection
    });

    // Wait until we have our initial collection from the backing
    // store before firing up the router.
    collection.once("reset", function () {
      Backbone.history.start();
    });

    // Now fetch collection data, kicking off everything.
    collection.fetch({ reset: true });
  });
});
