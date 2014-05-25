define([
  "jquery",
  "underscore",
  "backbone",
  "app/views/note-view",
  "app/views/note-nav",
  "hbs!app/templates/note"
], function (
  $,
  _,
  Backbone,
  NoteViewView,
  NoteNavView,
  tmpl
) {
  "use strict";

  // Note View
  // ---------
  // A single note.
  //
  // Contains:
  // * "app/views/note-nav": Helper view for navigation events. (From `nav`).
  // * "app/views/note-view": Child view for rendering Markdown.
  //
  var NoteView = Backbone.View.extend({

    id: "note-panes",

    template: tmpl,

    events: {
      "blur   #note-form-edit": "saveNote",
      "submit #note-form-edit": function () { return false; }
    },

    initialize: function (attrs, opts) {
      opts || (opts = {});

      // Views.
      this.nav = new NoteNavView();

      // Add our custom listeners.
      this._addListeners();

      // Render HTML, update to action, and show note.
      this.$el.html(this.template(this.model.toJSON()));
      this.update(opts.action || "view");
      this.render();

      // Add in viewer child view (which auto-renders).
      // Removed on *view* remove or *model* destroy events.
      this.noteView = new NoteViewView({
        el: this.$("#note-pane-view-content"),
        model: this.model
      });
    },

    // Helper listener initialization method.
    _addListeners: function () {
      // Model controls view rendering and existence.
      this.listenTo(this.model, {
        "destroy": this.remove,
        "change":  function () { this.render().model.save(); }
      });

      // Navbar controls/responds to panes.
      this.listenTo(this.nav, {
        "nav:view":   this.viewNote,
        "nav:edit":   this.editNote,
        "nav:delete": this.deleteNote
      });

      // Respond to update events from router.
      this.listenTo(this, {
        "update:view": function () { this.render().viewNote(); },
        "update:edit": function () { this.render().editNote(); }
      });
    },

    // Rendering the note is simply showing the active pane.
    // All HTML should already be rendered during initialize.
    render: function () {
      $(".region").not(".region-note").hide();
      $(".region-note").show();
      return this;
    },

    remove: function () {
      // Remove child, then self.
      this.noteView.remove();
      Backbone.View.prototype.remove.call(this);
    },

    // Update internal "action" state (view or edit).
    update: function (action) {
      action = action || this.action || "view";
      var paneEl = "#note-pane-" + action,
        loc = "note/" + this.model.id + "/" + action;

      // Ensure menu bar is updated.
      this.nav.trigger("nav:update:" + action);

      // Show active pane.
      this.$(".pane").not(paneEl).hide();
      this.$(paneEl).show();

      // Store new action and navigate.
      if (this.action !== action) {
        this.action = action;
        Backbone.history.navigate(loc, { replace: true });
      }
    },

    // Activate "view" or "edit" note panes.
    viewNote: function () {
      this.update("view");
    },
    editNote: function () {
      this.update("edit");
    },

    // Delete model (causes view removal) and navigate to
    // "all notes" list page.
    deleteNote: function () {
      if (window.confirm("Delete note?")) {
        this.model.destroy();
        Backbone.history.navigate("", { trigger: true, replace: true });
      }
    },

    // Save note (triggering model change).
    saveNote: function () {
      this.model.set({
        title: this.$("#input-title").val().trim(),
        text: this.$("#input-text").val().trim()
      });
    }

  });

  return NoteView;
});
