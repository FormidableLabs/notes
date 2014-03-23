define([
  "underscore",
  "backbone",
  "showdown",
  "app/templates/templates"
], function (
  _,
  Backbone,
  Showdown,
  templates
) {
  "use strict";

  // Note View Pane
  // --------------
  // Render a single note pane for viewing.
  var NoteViewView = Backbone.View.extend({

    template: _.template(templates["template-note-view"]),

    converter: new Showdown.converter(),

    initialize: function () {
      this.listenTo(this.model, {
        "change": this.render,
        "destroy": this.remove
      });
      this.render();
    },

    // Convert note data into Markdown.
    render: function () {
      this.$el.html(this.template({
        title: this.model.get("title"),
        text: this.converter.makeHtml(this.model.get("text"))
      }));
      return this;
    }
  });

  return NoteViewView;
});
