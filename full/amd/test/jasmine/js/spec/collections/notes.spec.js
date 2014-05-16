define(["app/collections/notes"], function (NotesCollection) {

  beforeEach(function () {
    // stub for express server
    this.stubServer = sinon.fakeServer.create();
    this.stubServer.autoRespond = true;

    var savedNotes = []; // stub db table

    this.stubServer.respondWith("GET", "/tasks", function (xhr) {
      xhr.respond(200,
        { "Content-Type": "application/json" },
        JSON.stringify(savedNotes)
      );
    });

    this.stubServer.respondWith("POST", "/tasks", function (xhr) {
      var params = JSON.parse(xhr.requestBody);
      savedNotes.push({ title: params.title, text: params.text });
      xhr.respond(200,
        { "Content-Type": "application/json" },
        JSON.stringify(savedNotes[-1])
      );
    });
  });

  afterEach(function () {
    this.stubServer.restore();
  });

  describe("app/collections/notes", function () {

    beforeEach(function () {

      // Create a reference for all internal suites/specs.
      this.notes = new NotesCollection();
      this.notes.reset();
    });

    afterEach(function () {
      // Remove the reference.
      this.notes = null;
    });

    describe("creation", function () {

      it("has default values", function () {
        expect(this.notes).toBeTruthy();
        expect(this.notes.length).toBe(0);
      });

      // -- Omitted in Book. --
      it("should be empty on fetch", function (done) {

        // Stash reference to save context.
        var notes = this.notes;

        // Before fetch.
        expect(notes).toBeTruthy();
        expect(notes.length).toBe(0);

        // After fetch.
        notes.once("reset", function () {
          expect(notes.length).toBe(0);
          done();
        });

        notes.fetch({ reset: true });
      });

    });

    describe("modification", function () {

      beforeEach(function () {
        // Load a pre-existing note.
        this.notes.create({
          title: "Test note #1",
          text: "A pre-existing note from beforeEach."
        });

      });

      afterEach(function () {
        // Wipe internal data and reset collection.
        this.notes.reset();
      });

      it("has a single note", function (done) {
        var notes = this.notes;

        // After fetch.
        notes.once("reset", function () {
          expect(notes.length).toBe(1);

          // Check model attributes.
          var note = notes.at(0);
          expect(notes).toBeTruthy();
          expect(note.get("title")).toContain("#1");
          expect(note.get("text")).toContain("pre-existing");

          done();
        });

        notes.fetch({ reset: true });
      });

      it("can delete a note", function (done) {
        var notes = this.notes;

        // After shift.
        notes.once("remove", function (note) {
          expect(note).toBeTruthy();
          expect(note.get("title")).toContain("#1");

          expect(notes.length).toBe(0);

          done();
        });

        // Remove and return first model.
        notes.shift();
      });

      // -- Omitted in Book. --
      it("can create a second note", function (done) {
        var notes = this.notes;

        // After fetch.
        notes.once("reset", function () {
          expect(notes.length).toBe(2);

          // Check model attributes.
          var note = notes.at(1);
          expect(notes).toBeTruthy();
          expect(note.get("title")).toContain("#2");
          expect(note.get("text")).toContain("new note");

          done();
        });

        notes.create({
          title: "Test note #2",
          text: "A new note, created in the test."
        });

        notes.fetch({ reset: true });
      });
    });
  });

});


/* Backbone Testing References
 *
 * **See**
 * http://backbone-testing.com/chapters/03/test/test.html
 * http://backbone-testing.com/notes/test/js/spec/collections/notes.spec.js
 * http://backbone-testing.com/notes/test/test.html?grep=App.Collections.Notes
 */
