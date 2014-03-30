define([
  "jquery",
  "app/views/note",
  "app/models/note"
], function ($, NoteView, NoteModel) {

  describe("app/views/note", function () {
    beforeEach(function () {
      // Create test fixture.
      this.$fixture = $("<div id='note-view-fixture'></div>");

      // Empty out and rebind the fixture for each run.
      this.$fixture.empty().appendTo($("#fixtures"));

      // New default model and view for each test.
      //
      // Creation actually calls `render()`, so in tests we have an
      // *already rendered* view.
      this.view = new NoteView({
        el: this.$fixture,
        model: new NoteModel()
      });
    });

    afterEach(function () {
      // Destroying the model also destroys the view.
      this.view.model.destroy();

      // Remove all sub-fixtures after test suite finishes.
      $("#fixtures").empty();
    });

    it("can render an empty note", function () {
      var $title = $("#pane-title"),
        $text = $("#pane-text");

      // Default to empty title in `h2` tag.
      expect($title.text()).toBe("");
      expect($title.prop("tagName")).toMatch(/h2/i);

      // Have simple default message.
      expect($text.text()).toBe("Edit your note!");
      expect($text.html()).toBe("<p><em>Edit your note!</em></p>");
    });
  });

});

/* Backbone Testing References
 *
 * **See**
 * http://backbone-testing.com/chapters/03/test/test.html
 * http://backbone-testing.com/chapters/03/test/js/spec/views/note-view.spec.js
 * http://backbone-testing.com/notes/test/test.html?grep=App.Views.NoteView
 */
