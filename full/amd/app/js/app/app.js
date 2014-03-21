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
    var collection = new NotesCollection(),

      // Views come next. Lazy dependency on router internally, meaning
      // that by the time we start using view methods, the `router`
      // object must exist. In practice, this isn't a big deal, because
      // the router is the ingress point that handles a request and
      // actually binds it to a view, allowing the view methods to be
      // called.
      notesView = new NotesView({
        collection: collection
      }),
      noteNavView = new NoteNavView(),

      // Router has dependencies on `*View` objects, so comes
      // after.
      router = new Router({
        notesView: notesView,
        noteNavView: noteNavView
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
