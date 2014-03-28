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
