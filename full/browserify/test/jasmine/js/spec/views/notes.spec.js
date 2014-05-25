define([
  "underscore",
  "jquery",
  "app/views/notes",
  "app/collections/notes",
  "app/models/note"
], function (_, $, NotesView, NotesCollection, NoteModel) {

  describe("app/views/notes", function () {

    // Common setup (after stubbing, etc.).
    // Create view and trigger collection add notes.
    var _setupView = function (ctx) {
      ctx.view = new NotesView();
      ctx.collection.trigger("add:notes");
    };

    beforeEach(function () {
      // Create nav fixture (needed) and test fixture.
      $("#fixtures").append($(
        "<form class=\"navbar-search\">" +
          "<input type=\"text\" class=\"search-query\">" +
        "</form>"
      ));
      this.$fixture = $(
        "<div id='notes' class='region region-notes'>" +
          "<table id='notes-list'>" +
            "<tr><td>" +
              "<input id='note-new-input'>" +
              "<div id='note-create'></div>" +
            "</td></tr>" +
          "</table>" +
        "</div>"
      ).appendTo($("#fixtures"));

      // Create collection of notes data that we will sometimes
      // use to check full rendering, etc.
      this.notes = _.map(_.range(4), function (i) {
        return new NoteModel({
          id: i.toString(),
          title: "title" + i,
          text: "text" + i
        });
      });

      this.collection = new NotesCollection();
      sinon.stub(NotesCollection, "getInstance").returns(this.collection);
      this.view = null;
    });

    afterEach(function () {
      NotesCollection.getInstance.restore();

      // Remove views and trigger model destroy to have any internal
      // `NotesItem` views remove themselves.
      if (this.view) {
        this.view.remove();
      }
      _.each(this.notes, function (m) { m.trigger("destroy"); });

      // Clean up DOM fixtures.
      $("#fixtures").empty();
    });

    describe("render", function () {

      it("shows notes region on render", function () {
        _setupView(this);

        // Hide the fixture region first.
        this.$fixture.hide();
        expect(this.$fixture.css("display")).toBe("none");

        // Render and verify shown.
        this.view.render();
        expect(this.$fixture.css("display")).not.toBe("none");
      });

    });

    // Tests `addNotes` and `addNotes`.
    describe("add existing notes", function () {

      it("adds notes on collection reset", sinon.test(function () {
        this.stub(NotesView.prototype, "addNotes");
        _setupView(this);

        this.collection.trigger("reset");

        expect(this.view.addNotes.callCount).toBe(1);
      }));

      it("does not add when empty", sinon.test(function () {
        this.spy(NotesView.prototype, "addNote");
        _setupView(this);

        this.view.addNotes();

        expect(this.view.addNote.callCount).toBe(0);
        expect($("tr.notes-item").length).toBe(0);
      }));

      // Replace collection `chain()` with our data, so that we can
      // simulate a collection full of models without having to
      // actually change model state.
      //
      // Spy `addNote` here to check that it was called **and** be
      // able to verify that it rendered correctly in our fixture.
      it("adds with models", sinon.test(function () {
        this.spy(NotesView.prototype, "addNote");
        this.stub(this.collection, "chain", _.bind(function () {
          return _.chain(this.notes);
        }, this));

        _setupView(this);
        this.view.addNotes();

        expect(this.view.addNote.callCount).toBe(4);
        expect($("tr.notes-item").length).toBe(4);
      }));

    });

    describe("create new notes", function () {

      // Trigger with "click".
      it("does not create when no title", sinon.test(function () {
        this.spy(NotesView.prototype, "createNote");
        this.stub(NotesView.prototype, "create");
        _setupView(this);

        $("#note-create").trigger("click");

        expect(this.view.createNote.callCount).toBe(1);
        expect(this.view.create.callCount).toBe(0);
      }));

      // Make direct call on "enter" function.
      it("creates when title", sinon.test(function () {
        this.spy(NotesView.prototype, "enterNote");
        this.spy(NotesView.prototype, "createNote");
        this.stub(NotesView.prototype, "create");
        _setupView(this);

        // Simulate an "enter" (keycode 13) event on `enterNote` after
        // we have entered a title in the new note input field.
        //
        // See: http://stackoverflow.com/questions/6124692
        $("#note-new-input")
          .val("New Title")
          .trigger($.Event("keypress", { which: 13 }));

        expect(this.view.enterNote.callCount).toBe(1);
        expect(this.view.createNote.callCount).toBe(1);
        expect(this.view.create.callCount).toBe(1);
      }));

      // Check creation triggers add event and updates DOM.
      it("adds note to DOM on create", sinon.test(function () {
        var note = this.notes[0],
          addSpy = this.spy();

        // Stub collection `create` to just call the success callback
        // with specified note and `get` that note as well.
        this.stub(this.collection, "create")
          .yieldsTo("success", null, note.toJSON());
        this.stub(this.collection, "get").returns(note);

        // Set up spies on events and actual addition.
        this.collection.on("notes:add", addSpy);
        this.spy(NotesView.prototype, "addNote");
        _setupView(this);

        this.view.create("My Title");

        // Check spies, stubs.
        expect(this.view.addNote.callCount).toBe(1);
        expect(this.collection.create.callCount).toBe(1);
        expect(addSpy.callCount).toBe(1);
        expect(addSpy.calledWith(note)).toBe(true);

        // Check the note was added to the DOM.
        expect($("tr.notes-item").length).toBe(1);

        // Stop listeners on collection. We want to do this here
        // because we persist the collection object across tests in
        // this suite.
        this.collection.off("notes:add", addSpy);
      }));

    });
  });
});

/* Backbone Testing References
 *
 * **See**
 * http://backbone-testing.com/notes/test/test.html?grep=App.Views.Notes
 */
