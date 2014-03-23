define([
  "underscore",
  "backbone",
  "app/templates/templates"
], function (
  _,
  Backbone,
  templates
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

    template: _.template(templates["template-notes-item"]),

    events: {
      "click .note-view":   function () { this.viewNote(); },
      "click .note-edit":   function () { this.editNote(); },
      "click .note-delete": function () { this.deleteNote(); }
    },

    initialize: function () {
      this.listenTo(this.model, {
        "change":   function () { this.render(); },
        "destroy":  function () { this.remove(); }
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
