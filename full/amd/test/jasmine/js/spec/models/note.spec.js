define(["app/models/note"], function (NoteModel) {
  describe("app/models/note", function () {
    it("has default values", function () {
      // Create empty note model.
      var model = new NoteModel();

      expect(model).toBeTruthy;
      expect(model.get("title")).toBe("");
      expect(model.get("text")).toBe("*Edit your note!*");
      expect(model.get("createdAt") instanceof Date).toBe(true);
    });

    it("sets passed attributes", function () {
      var model = new NoteModel({
        title: "Grocery List",
        text: "* Milk\n* Eggs\n*Coffee"
      });

      expect(model.get("title")).toBe("Grocery List");
      expect(model.get("text")).toBe("* Milk\n* Eggs\n*Coffee");
    });
  });
});

/* Backbone Testing References
 *
 * **See**
 * http://backbone-testing.com/chapters/02/test/test.html
 * http://backbone-testing.com/notes/test/js/spec/models/note.spec.js
 * http://backbone-testing.com/notes/test/test.html?grep=App.Models.Note
 */
