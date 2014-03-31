define([
  "underscore",
  "backbone",
  "hbs!app/templates/notes-item"
], function (
  _,
  Backbone,
  tmpl
) {
  "use strict";

  // Notes Item View
  // ---------------
  // A single note within a list of notes.
  var NotesItemView = Backbone.View.extend({

    // Set rendered DOM element `id` property to the model's id.
    id: function () { return this.model.id; },

    tagName: "tr",

    className: "notes-item",

    template: tmpl,

    events: {
      "click .note-view":   "viewNote",
      "click .note-edit":   "editNote",
      "click .note-delete": "deleteNote"
    },

    initialize: function () {
      this.listenTo(this.model, {
        "change":   this.render,
        "destroy":  this.remove
      });
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    viewNote: function () {
      var loc = ["note", this.model.id, "view"].join("/");
      Backbone.history.navigate(loc, { trigger: true });
    },

    editNote: function () {
      var loc = ["note", this.model.id, "edit"].join("/");
      Backbone.history.navigate(loc, { trigger: true });
    },

    deleteNote: function () {
      // Destroying model triggers view cleanup.
      this.model.destroy();
    }

  });

  return NotesItemView;
});
