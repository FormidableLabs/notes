/**
 * Tests for REST Notes collection.
 */
var NotesCollection = require("app/collections/notes");

describe("app/collections/notes", function () {

  beforeEach(function () {
    // stub for express server
    this.stubServer = sinon.fakeServer.create();

    var savedNotes = []; // stub db table
    this.stubServer.respondWith("GET", "/notes", function (xhr) {
      xhr.respond(200,
        { "Content-Type": "application/json" },
        JSON.stringify(savedNotes)
      );
    });

    this.stubServer.respondWith("POST", "/notes", function (xhr) {
      var params = JSON.parse(xhr.requestBody);
      savedNotes.push({ title: params.title, text: params.text });
      xhr.respond(200,
        { "Content-Type": "application/json" },
        JSON.stringify(savedNotes[savedNotes.length - 1])
      );
    });

    // Create a reference for all internal suites/specs.
    this.notes = new NotesCollection();
  });

  afterEach(function () {
    this.stubServer.restore();
    this.notes = null;
  });

  describe("creation", function () {

    it("has default values", function () {
      expect(this.notes).to.be.ok;
      expect(this.notes).to.have.length(0);
    });

    // -- Omitted in Book. --
    it("should be empty on fetch", function (done) {
      // Stash reference to save context.
      var notes = this.notes;

      // Before fetch.
      expect(notes).to.be.ok;
      expect(notes).to.have.length(0);

      // After fetch.
      notes.once("reset", function () {
        expect(notes).to.have.length(0);
        done();
      });

      notes.fetch({ reset: true });
      this.stubServer.respond();
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

    it("has a single note", function (done) {
      var notes = this.notes, note;

      // After fetch.
      notes.once("reset", function () {
        expect(notes).to.have.length(1);

        // Check model attributes.
        note = notes.at(0);
        expect(note).to.be.ok;
        expect(note.get("title")).to.contain("#1");
        expect(note.get("text")).to.contain("pre-existing");

        done();
      });

      notes.fetch({ reset: true });
      this.stubServer.respond();
    });

    it("can delete a note", function (done) {
      var notes = this.notes,
        note = null;

      // After shift.
      notes.once("remove", function () {
        expect(notes).to.have.length(0);
        done();
      });

      // Remove and return first model.
      note = notes.shift();
      expect(note).to.be.ok;
    });

    // -- Omitted in Book. --
    it("can create a second note", function (done) {
      var notes = this.notes,
        note = notes.create({
          title: "Test note #2",
          text: "A new note, created in the test."
        });

      // After fetch.
      notes.once("reset", function () {
        expect(notes).to.have.length(2);

        // Check model attributes.
        note = notes.at(1);
        expect(note).to.be.ok;
        expect(note.get("title")).to.contain("#2");
        expect(note.get("text")).to.contain("new note");

        done();
      });

      notes.fetch({ reset: true });
      this.stubServer.respond();
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
