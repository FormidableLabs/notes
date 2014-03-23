define([
  "underscore",
  "backbone",
  "app/config",
  "app/models/note",

  // Patch Backbone. Import has side-effects, so don't use variable.
  "backbone.localStorage"
], function (_, Backbone, config, NoteModel) {
  "use strict";

  // Notes Collection
  // ----------------
  // Uses HTML `localStorage`.
  var NotesCollection = Backbone.Collection.extend({

    model: NoteModel,

    localStorage: new Backbone.LocalStorage(config.storeName)

  });

  // Singleton.
  NotesCollection.getInstance = _.memoize(function () {
    return new NotesCollection();
  });

  return NotesCollection;
});
