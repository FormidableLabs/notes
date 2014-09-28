var $ = require("jquery");
var Backbone = require("backbone");
var NoteView = require("app/views/note");
var NoteViewView = require("app/views/note-view");
var NoteModel = require("app/models/note");

describe("app/views/note", function () {

  before(function () {
    // Regions for different views.
    $("#fixtures").append($(
      "<div class='region-note' style='display: none;'></div>" +
      "<div class='region-notes' style='display: none;'></div>"
    ));

    // Any model changes will trigger a `model.save()`, which
    // won't work in the tests, so we have to fake the method.
    //
    // Stub the model prototype *once* for all our tests.
    sinon.stub(NoteModel.prototype, "save");
    // Same for backbone history.
    sinon.stub(Backbone.history, "navigate");
  });

  beforeEach(function () {
    // NoteView fixture.
    this.$fixture = $(
      "<div id='note-fixture'>" +
        "<div id='#note-pane-view-content'></div>" +
      "</div>"
    ).appendTo($("#fixtures"));

    // Spy bound methods of `NoteView` here to allow introspection
    // after instantiated and bound to events, etc.
    sinon.spy(NoteView.prototype, "remove");
    sinon.spy(NoteViewView.prototype, "remove");

    // Creation calls `render()`, so in tests we have an
    // *already rendered* view.
    this.view = new NoteView({
      el: this.$fixture,
      model: new NoteModel()
    });
  });

  afterEach(function () {
    this.$fixture.empty();
    if (this.view) { this.view.model.destroy(); }
    NoteView.prototype.remove.restore();
    NoteViewView.prototype.remove.restore();
  });

  after(function () {
    $("#fixtures").empty();

    NoteModel.prototype.save.restore();
    Backbone.history.navigate.restore();
  });

  describe("view modes and actions", function () {
    // `NoteView` first goes to `#note/:id/view`
    it("navigates / displays 'view' by default", function () {
      expect(Backbone.history.navigate).to.be.calledWithMatch(/view$/);

      // Check CSS visibility directly. Not necessarily a best
      // practice as it uses internal knowledge of the DOM, but
      // gets us a quick check on what should be the visible
      // view pane.
      expect($("#note-pane-view")
        .css("display")).to.not.equal("none");
      expect($("#note-pane-edit")
        .css("display")).to.equal("none");
    });

    // Edit event triggers navigation to `#note/:id/edit`
    it("navigates / displays 'edit' on event", function () {
      this.view.trigger("update:edit");
      expect(Backbone.history.navigate).to.be.calledWithMatch(/edit$/);

      expect($("#note-pane-edit")
        .css("display")).to.not.equal("none");
      expect($("#note-pane-view")
        .css("display")).to.equal("none");
    });

    it("confirms note on delete", sinon.test(function () {
      this.stub(window, "confirm").returns(false);
      this.view.deleteNote();
      expect(window.confirm)
        .to.have.been.calledOnce.and
        .to.have.been.calledWith("Delete note?");
    }));
  });

  describe("model interaction", function () {
    afterEach(function () {
      // Wipe out to prevent any further use.
      this.view = null;
    });

    // It is a good habit to check that views are actually
    // disposed of when expected. Here, we bind view removal to
    // the destruction of a model.
    it("is removed on destroyed model", function () {
      this.view.model.trigger("destroy");

      expect(NoteView.prototype.remove).to.be.calledOnce;
      expect(NoteViewView.prototype.remove.callCount).to.be.at.least(2);
    });
  });

  describe("note rendering", function () {

    it("can render a note", function () {
      // Don't explicitly call `render()` because
      // `initialize()` already called it.
      expect($(".region-note")
        .css("display")).to.not.equal("none");
      expect($(".region-notes")
        .css("display")).to.equal("none");
    });

    // Borrows a `NoteView` spec verbatim to make sure that the
    // overall view code renders correctly.
    // -- Omitted in Book. --
    it("can render a default note view", function () {
      var $title = $("#pane-title"),
        $text = $("#pane-text");

      // Default to empty title in `h2` tag.
      expect($title.text()).to.equal("");
      expect($title.prop("tagName")).to.match(/h2/i);

      // Have simple default message.
      expect($text.text()).to.equal("Edit your note!");
      expect($text.html())
        .to.equal("<p><em>Edit your note!</em></p>");
    });

    it("calls render on model events", sinon.test(function () {
      // Spy on `render` and check call/return value.
      this.spy(this.view, "render");

      this.view.model.trigger("change");

      expect(this.view.render)
        .to.be.calledOnce.and
        .to.have.returned(this.view);
    }));

    it("calls render on changed data", sinon.test(function () {
      this.spy(this.view, "render");

      // Replace form value and blur to force changes.
      $("#input-text").val("# A Heading!");
      $("#note-form-edit").blur();

      // `Note` view should have rendered.
      expect(this.view.render)
        .to.be.calledOnce.and
        .to.have.returned(this.view);

      // Check the `NoteView` view rendered the new markdown.
      expect($("#pane-text").html())
        .to.equal("<h1>A Heading!</h1>");
    }));
  });
});

/* Backbone Testing References
 *
 * **See**
 * http://backbone-testing.com/chapters/04/test/test.html
 * http://backbone-testing.com/chapters/04/test/js/spec/views/note.spec.js
 * http://backbone-testing.com/notes/test/test.html?grep=App.Views.Note
 */
