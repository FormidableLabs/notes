// Notes Collection
var _ = require("lodash/dist/lodash.underscore");
var Backbone = require("backbone");

var config = require("../config");
var NoteModel = require("../models/note");
var NotesCollection;

// Imports for side effects.
require("backbone.localStorage");

// Decide whether to use localStorage or REST.
if (config.useLocalStorage === true) {
  // Uses HTML `localStorage`.
  NotesCollection = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage(config.storeName),
    model: NoteModel
  });
} else {
  // Uses real REST backend.
  NotesCollection = Backbone.Collection.extend({
    url: "/notes",
    model: NoteModel
  });
}

// Singleton.
NotesCollection.getInstance = _.memoize(function () {
  return new NotesCollection();
});

module.exports = NotesCollection;
