define(["backbone"], function (Backbone) {
  "use strict";

  // Note Model
  // ----------
  var NoteModel = Backbone.Model.extend({
    url: "/task"
  });

  return NoteModel;
});
