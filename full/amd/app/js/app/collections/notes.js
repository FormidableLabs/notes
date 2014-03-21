define([
  "backbone",
  "app/config",
  "app/models/note",

  // Patch Backbone. Import has side-effects, so don't use variable.
  "backbone.localStorage"
], function (Backbone, config, NoteModel) {
  "use strict";

  // Notes Collection
  // ----------------
  // Uses HTML `localStorage`.
  var NotesCollection = Backbone.Collection.extend({

    model: NoteModel,

    localStorage: new Backbone.LocalStorage(config.storeName)

  });

  return NotesCollection;
});
