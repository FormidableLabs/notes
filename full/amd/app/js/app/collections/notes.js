define([
  "underscore",
  "backbone",
  "app/config",
  "app/models/note",

], function (_, Backbone, config, NoteModel) {
  "use strict";

  // Notes Collection
  // ----------------
  // Uses HTML `localStorage`.
  var NotesCollection = Backbone.Collection.extend({
    url: "/tasks"
  });

  // Singleton.
  NotesCollection.getInstance = _.memoize(function () {
    return new NotesCollection();
  });

  return NotesCollection;
});
