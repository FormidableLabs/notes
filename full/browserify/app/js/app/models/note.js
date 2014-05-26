/**
 * Note Model
 */
"use strict";

var Backbone = require("backbone");

var NoteModel = Backbone.Model.extend({
  defaults: function () {
    return {
      title: "",
      text: "*Edit your note!*",
      createdAt: new Date()
    };
  }
});

module.exports = NoteModel;
