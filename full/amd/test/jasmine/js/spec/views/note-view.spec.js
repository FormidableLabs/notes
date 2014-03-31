define([
  "jquery",
  "app/views/note-view",
  "app/models/note"
], function ($, NoteViewView, NoteModel) {

  describe("app/views/note-view", function () {
    beforeEach(function () {
      // Create test fixture.
      this.$fixture = $("<div id='note-view-fixture'></div>");

      // Empty out and rebind the fixture for each run.
      this.$fixture.empty().appendTo($("#fixtures"));

      // New default model and view for each test.
      //
      // Creation actually calls `render()`, so in tests we have an
      // *already rendered* view.
      this.view = new NoteViewView({
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

    it("can render more complicated markdown", function (done) {
      // Model updates will cause a re-render. Set our tests on that
      // event. Because we set in tests, we will come **after** the
      // event listener in the view.
      //
      // An alternate approach would be to set a mock on the view's
      // `render()` method. This would be more robust as relying on
      // internal listener order is fairly brittle and risky in the
      // face of implementation changes.
      //
      // Yet another approach is to have the view emit a "render"-
      // related event that we can listen on once rendering is done
      // and ensure that the DOM is updated before testing.
      this.view.model.once("change", function () {
        var $title = $("#pane-title"),
          $text = $("#pane-text");

        // Our new (changed) title.
        expect($title.text()).toBe("My Title");

        // Rendered Markdown with headings, list.
        //
        // **Note**: The start `<h2>` tag also has a generated `id`
        // field, so for simplicity we only assert on
        // `"My Heading</h2>"`.
        var text = $text.html();
        expect(text).toContain("My Heading</h2>");
        expect(text).toContain("<ul>");
        expect(text).toContain("<li>List item 2</li>");

        done();
      });

      // Make our note a little more complex.
      this.view.model.set({
        title: "My Title",
        text: "## My Heading\n" +
              "* List item 1\n" +
              "* List item 2"
      });
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
