define(["backbone"], function (Backbone) {
  "use strict";

  // Note Model
  // ----------
  var NoteModel = Backbone.Model.extend({

    defaults: function () {
      return {
        title: "",
        text: "*Edit your note!*",
        createdAt: new Date()
      };
    }

  });

  return NoteModel;
});
