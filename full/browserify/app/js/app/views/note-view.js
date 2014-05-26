var _ = require("lodash/dist/lodash.underscore");
var Backbone = require("backbone");
var Showdown = require("showdown");

var tmpl = require("../templates/note-view.hbs");

// Note View Pane
// --------------
// Render a single note pane for viewing.
var NoteViewView = Backbone.View.extend({

  template: tmpl,

  converter: new Showdown.converter(),

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
      text: this.converter.makeHtml(this.model.get("text"))
    }));
    return this;
  }

});

module.exports = NoteViewView;
