define([
  "jquery",
  "backbone",
  "app/views/notes",
  "app/views/note",
  "app/views/note-nav"
], function (
  $,
  Backbone,
  NotesView,
  NoteView,
  NoteNavView
) {
  "use strict";

  // Router
  // ------
  // The router translates routes in to views.
  var Router = Backbone.Router.extend({

    // **Note**: Could wrap this up in functions to allow easier
    // stubbing of the underlying methods. But, there are some
    // definite Backbone.js efficiencies from using simple string
    // method names instead (like name inference, etc).
    routes: {
      "": "notes",
      "note/:id/:action": "note",
    },

    initialize: function () {
      this.notesView = new NotesView({}, {
        router: this
      });
      this.noteNavView = new NoteNavView();

      // Validation.
      if (!this.notesView) { throw new Error("No notesView"); }
      if (!this.noteNavView) { throw new Error("No noteNavView"); }

      // Stash current note view for re-rendering.
      this.noteView = null;
    },

    // Show notes list.
    notes: function () {
      this.notesView.render();
    },

    // Common single note edit/view.
    note: function (noteId, action) {
      // Check if we are already at currently active view.
      if (this.noteView) {
        if (this.noteView.model.id === noteId) {
          // Reuse existing note view if same note.
          return this.noteView.trigger("update:" + action);
        } else {
          // Else, remove the last stored view.
          this.noteView.remove();
        }
      }

      // Try to find note in existing collection.
      var model = this.notesView.collection.get(noteId);
      if (!model) {
        // Go to home page on missing model.
        return this.navigate("", { trigger: true });
      }

      // Create note and add to DOM.
      this.noteView = new NoteView({ model: model }, {
        action: action,
        nav: this.noteNavView,
        router: this
      });
      $("#note").html(this.noteView.render().$el);
    }

  });

  return Router;
});
