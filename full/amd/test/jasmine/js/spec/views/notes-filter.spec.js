define([
  "underscore",
  "jquery",
  "app/views/notes-filter",
  "app/collections/notes",
  "app/models/note"
], function (_, $, NotesFilterView, NotesCollection, NoteModel) {

  describe("app/views/notes-filter", function () {

    beforeEach(function () {
      // Spy on filterNotes prototype **before** calling `new`.
      // This allows us to still use the string versions of an events
      // hash in our class definition.
      sinon.spy(NotesFilterView.prototype, "filterNotes");

      // Create our base fixture and attach.
      this.$fixture = $(
        "<form class=\"navbar-search\">" +
          "<input type=\"text\" class=\"search-query\">" +
        "</form>" +
        "<div id='notes'></div>"
      ).appendTo($("#fixtures"));

      // Create fixture / model data for 4 notes.
      var notes = _.map(_.range(4), function (i) {
        // Side effect: attach div to fixtures.
        $("#notes").append($("<div id='" + i + "'></div>"));

        // Create raw model data.
        // E.g., { id: "1", title: "title1", text: "text1" }
        return { id: "" + i, title: "title" + i, text: "text" + i };
      });

      // Instantiate manual collection and view.
      this.collection = new NotesCollection(notes);
      sinon.stub(NotesCollection, "getInstance").returns(this.collection);
      this.view = new NotesFilterView();

      // Manually reset spy and view state.
      $(".search-query").val("");
      this.view.query("");
    });

    afterEach(function () {
      NotesFilterView.prototype.filterNotes.restore();
      NotesCollection.getInstance.restore();
      this.view.remove();
      $("#fixtures").empty();
    });

    // -- Omitted in Book. --
    describe("isMatch", function () {
      // Stash a reference within suite. Could just as easily be
      // a context variable (`this.isMatch`).
      var isMatch = NotesFilterView.prototype.isMatch;

      it("works for identity comparisons", function () {
        expect(isMatch()).toBe(true);
        expect(isMatch("", "")).toBe(true);
        expect(isMatch("a", "a")).toBe(true);
        expect(isMatch("ab", "ab")).toBe(true);
      });

      it("should be true on empty query", function () {
        expect(isMatch(null, "foo")).toBe(true);
        expect(isMatch("", "foo")).toBe(true);
      });

      it("can find substring matches", function () {
        expect(isMatch("o", "foo")).toBe(true);
        expect(isMatch("oo", "foo")).toBe(true);
        expect(isMatch("f", "foo")).toBe(true);
        expect(isMatch("short", "a short sentence.")).toBe(true);
      });

      it("should be false on misses", function () {
        expect(isMatch("a", "foo")).toBe(false);
        expect(isMatch("ooo", "foo")).toBe(false);
        expect(isMatch("of", "foo")).toBe(false);
        expect(isMatch("shot", "a short sentence.")).toBe(false);
      });
    });

    describe("with notes", function () {

      // -- Omitted in Book. --
      it("shows all notes by default", function () {
        this.view.filterNotes();
        expect($("#0").css("display")).not.toBe("none");
        expect($("#1").css("display")).not.toBe("none");
        expect($("#2").css("display")).not.toBe("none");
        expect($("#3").css("display")).not.toBe("none");
      });

      it("shows filtered notes", function () {
        $(".search-query").val("tle1");
        this.view.filterNotes();
        expect($("#0").css("display")).toBe("none");
        expect($("#1").css("display")).not.toBe("none");
        expect($("#2").css("display")).toBe("none");
        expect($("#3").css("display")).toBe("none");
      });

    });

    describe("filterNote", function () {

      it("shows note with empty filter", function () {
        // We already have an empty filter applied.
        this.view.filterNote(this.collection.at(0));
        expect($("#0").css("display")).not.toBe("none");
      });

      it("shows note with matching filter", sinon.test(function () {
        this.stub(this.view, "query", function () { return "0"; });
        this.view.filterNote(this.collection.at(0));
        expect($("#0").css("display")).not.toBe("none");
      }));

      it("hides note on no filter match", sinon.test(function () {
        this.stub(this.view, "query", function () { return "1"; });
        this.view.filterNote(this.collection.at(0));
        expect($("#0").css("display")).toBe("none");
      }));

    });

    // -- Omitted in Book. --
    describe("add a new note", function () {

      beforeEach(function () {
        // Add DOM to simulate new element.
        $("<div id='5'></div>").appendTo($("#fixtures"));

        var data = { id: "5", title: "title5", text: "text5" };
        this.model5 = new NoteModel(data);
      });

      afterEach(function () {
        $("#5").remove();
      });

      // The spy we set on `filterNote` illustrates that a callback
      // can only be spied on if it is called on the object, not
      // passed as a raw function pointer.
      //
      it("hides new unmatched note", sinon.test(function () {
        this.stub(this.view, "query", function () { return "1"; });
        this.spy(this.view, "filterNote");

        expect($("#5").css("display")).not.toBe("none");

        // Trigger a collection notes add.
        this.view.collection.trigger("notes:add", this.model5);

        // Should have hidden element with filterNote.
        expect($("#5").css("display")).toBe("none");
        expect(this.view.filterNote.callCount).toBe(1);
      }));

      it("shows new matched note", sinon.test(function () {
        this.stub(this.view, "query", function () { return "t"; });
        this.spy(this.view, "filterNote");

        this.view.collection.trigger("notes:add", this.model5);

        expect($("#5").css("display")).not.toBe("none");
        expect(this.view.filterNote.callCount).toBe(1);
      }));

    });

    // Use our 3 different event triggers: `change`, `keypress`, and
    // `keyup` to call `filterNotes` and verify the event handlers
    // work in the course of our other tests.
    describe("filterNotes", function () {

      beforeEach(function () {
        // We stub the collection to check if `each` is called,
        // which is our way of determining if the query text was
        // actually filtered.
        sinon.stub(this.collection, "each");
      });

      afterEach(function () {
        this.collection.each.restore();
      });

      it("doesn't filter by default", function () {
        // Invoke with "change" event.
        $(".search-query").trigger("change");
        expect(this.view.filterNotes.callCount).toBe(1);
        expect(this.collection.each.callCount).toBe(0);
      });

      it("filters notes if changed query", function () {
        // Invoke with "keypress" event.
        $(".search-query").val("changed");
        $(".search-query").trigger("keypress");

        // `filterNotes` gets called **every** time, but the
        // collection should only be iterated on **changes**.
        expect(this.view.filterNotes.callCount).toBe(1);
        expect(this.collection.each.callCount).toBe(1);
        expect(this.collection.each
          .calledWith(this.view.filterNote)).toBe(true);

        // Second time does not change.
        $(".search-query").trigger("keypress");
        expect(this.view.filterNotes.callCount).toBe(2);
        expect(this.collection.each.callCount).toBe(1);

        // -- Omitted in Book. --
        // Change to different should call collection stub.
        $(".search-query").val("different");
        $(".search-query").trigger("keypress");
        expect(this.view.filterNotes.callCount).toBe(3);
        expect(this.collection.each.callCount).toBe(2);
      });

      // -- Omitted in Book. --
      it("doesn't filter on same change", function () {
        // Invoke with "keyup" event.
        $(".search-query").val("new value");
        $(".search-query").trigger("keyup");
        expect(this.view.filterNotes.callCount).toBe(1);
        expect(this.collection.each.callCount).toBe(1);

        // Check again with value set collection stub isn't called.
        $(".search-query").val("new value");
        $(".search-query").trigger("keyup");
        expect(this.view.filterNotes.callCount).toBe(2);
        expect(this.collection.each.callCount).toBe(1);
      });

    });

  });
});

/* Backbone Testing References
 *
 * **See**
 * http://backbone-testing.com/notes/test/test.html?grep=App.Views.NotesFilter
 */
