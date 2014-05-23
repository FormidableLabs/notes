define([
  "underscore",
  "backbone",
  "app/config",
  "app/models/note",
  "backbone.localStorage" // Patches Backbone.
], function (_, Backbone, config, NoteModel) {
  "use strict";

  // Notes Collection
  // ----------------
  var NotesCollection;

  // Decide whether to use localStorage or REST.
  if (window._USE_LOCAL_STORAGE === true) {
    // Uses HTML `localStorage`.
    NotesCollection = Backbone.Collection.extend({
      localStorage: new Backbone.LocalStorage(config.storeName)
    });
  } else {
    // Uses real REST backend.
    NotesCollection = Backbone.Collection.extend({
      url: "/notes"
    });
  }

  // Singleton.
  NotesCollection.getInstance = _.memoize(function () {
    return new NotesCollection();
  });

  return NotesCollection;
});
