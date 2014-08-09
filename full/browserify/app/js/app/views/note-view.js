var _ = require("underscore");
var Backbone = require("backbone");
var markdown = require("markdown").markdown;

var tmpl = require("../templates/note-view.hbs");

// Note View Pane
// --------------
// Render a single note pane for viewing.
var NoteViewView = Backbone.View.extend({

  template: tmpl,

  initialize: function () {
    this.listenTo(this.model, {
      "change":  this.render,
      "destroy": this.remove
    });
    this.render();
  },

  // Convert note data into Markdown.
  render: function () {
    this.$el.html(this.template({
      title: this.model.get("title"),
      text: markdown.toHTML(this.model.get("text"))
    }));
    return this;
  }

});

module.exports = NoteViewView;
