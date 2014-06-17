var NoteModel = require("app/models/note");

describe("app/models/note", function () {
  it("has default values", function () {
    // Create empty note model.
    var model = new NoteModel();

    expect(model).to.be.ok;
    expect(model.get("title")).to.equal("");
    expect(model.get("text")).to.equal("*Edit your note!*");
    expect(model.get("createdAt")).to.be.a("date");
  });

  it("sets passed attributes", function () {
    var model = new NoteModel({
      title: "Grocery List",
      text: "* Milk\n* Eggs\n*Coffee"
    });

    expect(model.get("title")).to.equal("Grocery List");
    expect(model.get("text")).to.equal("* Milk\n* Eggs\n*Coffee");
  });
});

/* Backbone Testing References
 *
 * **See**
 * http://backbone-testing.com/chapters/02/test/test.html
 * http://backbone-testing.com/notes/test/js/spec/models/note.spec.js
 * http://backbone-testing.com/notes/test/test.html?grep=App.Models.Note
 */
